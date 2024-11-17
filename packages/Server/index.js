const Koa = require('koa');
const Router = require('@koa/router');
const multer = require('@koa/multer');
const bodyParser = require('koa-bodyparser');
const { ChatOpenAI } = require('langchain/chat_models/openai');
const { OpenAIEmbeddings } = require('langchain/embeddings/openai');
const { ConversationalRetrievalQAChain } = require('langchain/chains');
const { config, logger } = require('./config/settings');
const DocumentProcessor = require('./utils/documentLoader');
const VectorStore = require('./utils/vectorStore');

const app = new Koa();
const router = new Router();
const upload = multer({ dest: 'uploads/' });

// 初始化组件
const documentProcessor = new DocumentProcessor();

// 配置 LLM 和 Embeddings
const llm = new ChatOpenAI({
  configuration: {
    apiKey: config.OPENAI_API_KEY,
    baseURL: config.OPENAI_API_BASE,
  },
  modelName: 'deepseek-ai/DeepSeek-V2.5',
  temperature: 0.7
});

const embeddings = new OpenAIEmbeddings({
  configuration: {
    apiKey: config.OPENAI_API_KEY,
    baseURL: config.OPENAI_API_BASE,
  },
  modelName: 'BAAI/bge-large-zh-v1.5',
});

// 初始化向量存储
const vectorStore = new VectorStore(embeddings);

// 全局错误处理
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    logger.error(err.message);
    ctx.status = err.status || 500;
    ctx.body = { error: err.message };
  }
});

// 文件上传
router.post('/upload', upload.single('file'), async (ctx) => {
  logger.info('开始处理文件上传请求');
  const file = ctx.request.file;
  
  logger.info('接收到的文件信息:', file);
  
  if (!file || !file.originalname.match(/\.(txt|md)$/)) {
    logger.error('文件类型不支持');
    ctx.throw(400, 'Invalid file type. Only .txt or .md files are supported');
  }

  try {
    logger.info(`开始加载文档: ${file.path}`);
    const documents = await documentProcessor.loadDocument(file.path);
    
    logger.info('开始分割文档');
    const splits = await documentProcessor.splitDocuments(documents);
    
    logger.info('开始创建向量存储');
    await vectorStore.createVectorStore(splits, embeddings);

    ctx.body = { 
      message: '文档处理完成',
      filename: file.originalname 
    };
  } catch (error) {
    logger.error('文档处理失败:', error);
    ctx.throw(500, `文档处理失败: ${error.message}`);
  }
});

// 查询接口
router.post('/query', async (ctx) => {
  const { question } = ctx.request.body;
  logger.info(`收到查询请求: ${question}`);

  if (!vectorStore.vectorstore) {
    ctx.throw(400, '请先上传文档后再进行查询');
  }

  try {
    logger.info('开始检索相关文档');
    const retriever = vectorStore.vectorstore.asRetriever({
      searchType: 'similarity',
      k: 2
    });

    logger.info('创建查询链');
    const chain = ConversationalRetrievalQAChain.fromLLM(
      llm,
      retriever,
      { 
        returnSourceDocuments: true,
        verbose: true  // 启用详细日志
      }
    );

    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('查询超时')), 120000);
    });

    logger.info('开始执行查询');
    const result = await Promise.race([
      chain.call({ question, chat_history: [] }),
      timeoutPromise
    ]);

    logger.info('查询完成，准备返回结果');
    ctx.body = {
      answer: result.text,
      source_documents: result.sourceDocuments
    };
  } catch (error) {
    logger.error('查询失败:', error);
    ctx.throw(500, `查询失败: ${error.message}`);
  }
});

router.get('/health', async (ctx) => {
  try {
    const status = {
      vectorStore: !!vectorStore.vectorstore,
      embeddings: !!embeddings,
      llm: !!llm
    };
    ctx.body = { status: 'ok', components: status };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { status: 'error', message: error.message };
  }
});

app
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods());

// 启动服务
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  if (!config.OPENAI_API_KEY || !config.SUPABASE_URL || !config.SUPABASE_KEY) {
    logger.error('Missing required environment variables');
    process.exit(1);
  }
  logger.info(`Server is running on port ${PORT}`);
});