// 创建知识库
export const createKnowledgeBase = async (params: { name: string }) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_SERVER_HOST}/rag/createKnowledgeBase`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    })
    const { success, data } = await res.json()
    if (!success) {
      throw new Error("Failed to create knowledge base")
    }
    return data
  } catch {
    throw new Error("Failed to create knowledge base")
  }
}

// 删除知识库
export const deleteKnowledgeBase = async ({ name }: { name: string }) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_SERVER_HOST}/rag/deleteKnowledgeBase`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    })
    const { success, data } = await res.json()
    if (!success) {
      throw new Error("Failed to delete knowledge base")
    }
    return data
  } catch {
    throw new Error("Failed to delete knowledge base")
  }
}

export interface ClerkUserMetadataParams {
  token: string
  [key: string]: any // 会自动存储到 publicMetadata 中
}

// 设置clerk用户元数据
export const updateClerkUserMetadata = async (params: ClerkUserMetadataParams) => {
  try {
    const { token, ...rest } = params
    const res = await fetch(`${import.meta.env.VITE_SERVER_HOST}/clerk/setMetadata`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(rest),
    })
    const { success, data } = await res.json()
    if (!success) {
      throw new Error("Failed to update clerk user metadata")
    }
    return { success, data }
  } catch {
    return { success: false, msg: "Failed to update clerk user metadata" }
  }
}
