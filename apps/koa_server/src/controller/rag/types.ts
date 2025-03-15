export interface KnowledgeBaseConfig {
  connectionString: string
  openaiApiKey: string
  openaiBaseURL: string
}

export interface DocumentMetadata {
  category?: string
  author?: string
  source?: string
  createdAt?: string
  fileName?: string
  fileType?: string
  [key: string]: any
}

export interface Document {
  content: string
  metadata?: DocumentMetadata
}

export interface KnowledgeBaseInfo {
  id: string
  name: string
  description?: string
  documentCount: number
  createdAt: string
  lastUpdated: string
  tags?: string[]
}

export interface KnowledgeBaseMetadata {
  description?: string
  tags?: string[]
  createdBy?: string
  [key: string]: any
}

export interface DocumentInfo {
  id: string
  content: string
  metadata: DocumentMetadata
}
