const { SupabaseVectorStore } = require('langchain/vectorstores/supabase');
const { createClient } = require('@supabase/supabase-js');
const { config, logger } = require('../config/settings');

class VectorStore {
  constructor(embeddings) {
    this.embeddings = embeddings;
    this.supabase = createClient(config.SUPABASE_URL, config.SUPABASE_KEY, {
      auth: {
        persistSession: false
      },
      db: {
        schema: 'public'
      }
    });
    this.initVectorStore();
  }

  async initVectorStore() {
    try {
      this.vectorstore = new SupabaseVectorStore(
        this.embeddings,
        {
          client: this.supabase,
          tableName: 'documents2',
          queryName: 'match_fn_cr'
        }
      );
      logger.info('向量存储初始化成功');
    } catch (e) {
      logger.warn(`初始化向量存储失败: ${e.message}`);
      logger.warn(`详细错误: ${JSON.stringify(e)}`);
      this.vectorstore = null;
    }
  }

  async createVectorStore(documents) {
    try {
      if (!documents || documents.length === 0) {
        throw new Error('没有有效的文档内容');
      }

      logger.info('开始创建向量存储，文档数量:', documents.length);
      logger.info('文档示例:', documents[0].pageContent.substring(0, 100));

      this.vectorstore = await SupabaseVectorStore.fromDocuments(
        documents,
        this.embeddings,
        {
          client: this.supabase,
          tableName: 'documents2',
          queryName: 'match_fn_cr'
        }
      );

      logger.info('向量存储创建成功');
      return this.vectorstore;
    } catch (error) {
      logger.error('创建向量存储失败，详细信息:', {
        message: error.message,
        cause: error.cause,
        config: error.config,
        response: error.response?.data
      });
      throw new Error(`创建向量存储失败: ${error.message}`);
    }
  }
}

module.exports = VectorStore;