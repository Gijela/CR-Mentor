const { TextLoader } = require('langchain/document_loaders/fs/text');
const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter');

class DocumentProcessor {
  constructor() {
    this.textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200
    });
  }

  async loadDocument(filePath) {
    const loader = new TextLoader(filePath);
    return await loader.load();
  }

  async splitDocuments(documents) {
    return await this.textSplitter.splitDocuments(documents);
  }
}

module.exports = DocumentProcessor;