import { TextLoader } from 'langchain/document_loaders/fs/text';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { Document } from 'langchain/document';

class DocumentProcessor {
  private textSplitter: RecursiveCharacterTextSplitter;

  constructor() {
    this.textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200
    });
  }

  async loadDocument(input: string | { text: string; metadata?: Record<string, any> }) {
    try {
      if (typeof input === 'string') {
        return [new Document({ pageContent: input })];
      }
      return [new Document({ 
        pageContent: input.text,
        metadata: input.metadata || {}
      })];
    } catch (error) {
      throw new Error(`加载文档失败: ${error}`);
    }
  }

  async splitDocuments(documents: Document[]): Promise<Document[]> {
    return await this.textSplitter.splitDocuments(documents);
  }
}

export default DocumentProcessor;