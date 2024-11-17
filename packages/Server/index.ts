import Koa from 'koa';
import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { ConversationalRetrievalQAChain } from 'langchain/chains';
import { config, logger } from './config/settings';
import DocumentProcessor from './utils/documentLoader';
import VectorStore from './utils/vectorStore';
import koaBody from 'koa-body';
import fs from 'fs';

// 定义类型
interface FileUploadResponse {
  message: string;
  filename: string;
}

interface QueryResponse {
  answer: string;
  source_documents: any[];
}

interface HealthStatus {
  status: string;
  components?: {
    vectorStore: boolean;
    embeddings: boolean;
    llm: boolean;
  };
  message?: string;
}

interface QueryResult {
  text: string;
  sourceDocuments: any[];
}

const app = new Koa();
const router = new Router();

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

// 全局错误处理中间件
app.use(async (ctx: Koa.Context, next: Koa.Next) => {
  try {
    await next();
  } catch (err: any) {
    logger.error(err.message);
    ctx.status = err.status || 500;
    ctx.body = { error: err.message };
  }
});

// 配置 koa-body
app.use(koaBody({
  multipart: true,
  formidable: {
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024 // 10MB 限制
  }
}));

// 文件上传
router.post('/upload', async (ctx: Koa.Context) => {
  logger.info('开始处理文件上传请求');
  const file = ctx.request.files?.file;
  
  if (!file || Array.isArray(file) || !file.originalFilename || !file.originalFilename.match(/\.(txt|md)$/)) {
    logger.error('文件类型不支持');
    ctx.throw(400, 'Invalid file type. Only .txt or .md files are supported');
  }

  try {
    // 1. 读取文件内容
    const fileContent = await fs.promises.readFile(file.filepath, 'utf-8');
    
    // 2. 直接处理文档
    const documents = await documentProcessor.loadDocument({
      text: fileContent,
      metadata: { source: file.originalFilename }
    });
    const splits = await documentProcessor.splitDocuments(documents);
    
    // 3. 创建向量存储
    await vectorStore.createVectorStore(splits, {
      sourceFile: file.originalFilename
    });

    ctx.body = { 
      message: '文档处理完成',
      filename: file.originalFilename
    };

    // 清理临时文件
    await fs.promises.unlink(file.filepath);
  } catch (error: any) {
    logger.error('文档处理失败:', error);
    ctx.throw(500, `文档处理失败: ${error.message}`);
  }
});

// 查询接口
router.post('/query', async (ctx: Koa.Context) => {
  const { question } = ctx.request.body as { question: string };
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
        verbose: true
      }
    );

    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('查询超时')), 120000);
    });

    logger.info('开始执行查询');
    const result = (await Promise.race([
      chain.call({ question, chat_history: [] }),
      timeoutPromise
    ])) as QueryResult;

    logger.info('查询完成，准备返回结果');
    ctx.body = {
      answer: result.text,
      source_documents: result.sourceDocuments
    } as QueryResponse;
  } catch (error: any) {
    logger.error('查询失败:', error);
    ctx.throw(500, `查询失败: ${error.message}`);
  }
});

router.get('/health', async (ctx: Koa.Context) => {
  try {
    const status: HealthStatus = {
      status: 'ok',
      components: {
        vectorStore: !!vectorStore.vectorstore,
        embeddings: !!embeddings,
        llm: !!llm
      }
    };
    ctx.body = status;
  } catch (error: any) {
    ctx.status = 500;
    ctx.body = { 
      status: 'error', 
      message: error.message 
    } as HealthStatus;
  }
});

app
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods());

// 启动服务
const PORT = process.env.PORT || 8000;
app.listen(PORT, async () => {
  if (!config.OPENAI_API_KEY) {
    logger.error('Missing required environment variables');
    process.exit(1);
  }

  logger.info(`Server is running on port ${PORT}`);
});

export default app;