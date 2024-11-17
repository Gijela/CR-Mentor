import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { SupabaseVectorStore } from 'langchain/vectorstores/supabase';
import { Document } from 'langchain/document';
import { createClient } from '@supabase/supabase-js';
import { logger, config } from '../config/settings';

interface StoreMetadata {
  sourceFile: string;
  sourceUrl?: string;
}

class VectorStore {
  public vectorstore: SupabaseVectorStore | null = null;
  private embeddings: OpenAIEmbeddings;
  private supabaseClient;

  constructor(embeddings: OpenAIEmbeddings) {
    this.embeddings = embeddings;
    this.supabaseClient = createClient(config.SUPABASE_URL, config.SUPABASE_KEY);
  }

  async createVectorStore(documents: Document[], metadata: StoreMetadata) {
    try {
      const docsWithMetadata = documents.map(doc => {
        doc.metadata = {
          ...doc.metadata,
          sourceFile: metadata.sourceFile,
          sourceUrl: metadata.sourceUrl
        };
        return doc;
      });

      this.vectorstore = await SupabaseVectorStore.fromDocuments(
        docsWithMetadata,
        this.embeddings,
        {
          client: this.supabaseClient,
          tableName: 'documents2',
          queryName: 'match_fn_cr'
        }
      );

      logger.info(`向量存储创建成功，文档数量: ${documents.length}`);
      return this.vectorstore;
    } catch (error) {
      logger.error('创建向量存储失败:', error);
      throw new Error(`创建向量存储失败: ${error}`);
    }
  }
}

export default VectorStore;
