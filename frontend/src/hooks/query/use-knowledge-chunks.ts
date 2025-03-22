export interface FileListParams {
  knowledgeBaseName: string
  options?: {
    page: number
    pageSize: number
    // 过滤条件
    filter?: Record<string, any>
  }
}

export interface ChunkItem {
  id: string
  fileName: string
  fileExtension: string
  text: string
  createdAt?: string
  lastUpdated?: string
}

/**
 * 获取知识库的文档列表
 * ps: 现在默认返回所有文档, 不处理分页
 * @param params
 * @returns
 */
export const getChunkList = async (params: FileListParams): Promise<ChunkItem[]> => {
  try {
    const res = await fetch(`${import.meta.env.VITE_SERVER_HOST}/rag/listDocuments`, {
      method: "POST",
      body: JSON.stringify(params),
      headers: {
        "Content-Type": "application/json",
      },
    })
    const { success, data } = await res.json()
    if (!success) {
      throw new Error("Failed to fetch chunks")
    }

    return (data?.documents || []).reverse()
  } catch (error) {
    console.error("Failed to fetch chunks:", error)
    throw error
  }
}

// 删除文档
export const deleteChunk = async (kbName: string, docId: string) => {
  try {
    const result = await fetch(`${import.meta.env.VITE_SERVER_HOST}/rag/deleteDocument`, {
      method: "POST",
      body: JSON.stringify({ knowledgeBaseName: kbName, documentId: docId }),
      headers: {
        "Content-Type": "application/json",
      },
    })
    const { success, data } = await result.json()
    if (!success) {
      throw new Error("Failed to delete chunk")
    }

    return { success, data }
  } catch (error) {
    console.error("Failed to delete chunk:", error)
    return { success: false, data: null }
  }
}

// 更新文档
export const updateChunk = async (kbName: string, docId: string, content: string) => {
  try {
    const result = await fetch(`${import.meta.env.VITE_SERVER_HOST}/rag/updateDocument`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        knowledgeBaseName: kbName,
        documentId: docId,
        updates: {
          content,
        },
      }),
    })
    const { success, data } = await result.json()
    if (!success) {
      throw new Error("Failed to update document")
    }
    return { success, data }
  } catch (error) {
    console.error("Failed to update document:", error)
    return { success: false, data: null }
  }
}

export interface UploadFileParams {
  knowledgeBaseName: string
  documents: {
    content: string
    fileName: string
    fileExtension: string
  }[]
}

// 上传文件
export const uploadFile = async (params: UploadFileParams) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_SERVER_HOST}/rag/addDocuments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    })
    const { success, data } = await res.json()
    if (!success) {
      throw new Error("Failed to upload file")
    }
    return { success, data }
  } catch (error) {
    console.error("Failed to upload file:", error)
    return { success: false, data: null }
  }
}
