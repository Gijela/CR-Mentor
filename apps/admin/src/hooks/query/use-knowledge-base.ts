import { useMutation, useQueryClient } from "@tanstack/react-query"

export interface KnowledgeBase {
  id: string
  name: string
  description: string
  documentCount: number
  createdAt: string
  lastUpdated: string
  tags: string[]
}

interface CreateKnowledgeBaseParams {
  user_id: string
  title: string
  description: string
}

interface UpdateKnowledgeBaseParams extends CreateKnowledgeBaseParams {
  id: number
}
const apiUrl = import.meta.env.VITE_GITHUB_SERVER_API

// 获取知识库列表
export const getKnowledgeBases = async (user_id: string) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_SERVER_HOST}/rag/listKnowledgeBases`, {
      method: "POST",
      body: JSON.stringify({ user_id }),
    })
    const { success, data } = await res.json()
    if (!success) {
      throw new Error("Failed to fetch knowledge bases")
    }
    return data as KnowledgeBase[]
  } catch {
    return []
  }
}

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

// 更新知识库
export function useUpdateKnowledgeBase() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (params: UpdateKnowledgeBaseParams) => {
      const res = await fetch(`${apiUrl}/api/supabase/rag/knowledge_bases/updateKB`, {
        method: "POST",
        body: JSON.stringify(params),
      })
      const { success, data } = await res.json()
      if (!success) throw new Error("Failed to update knowledge base")
      return data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["knowledge-bases", variables.user_id] })
    },
  })
}

// 删除知识库
export const deleteKnowledgeBase = async ({ name, user_id }: { name: string, user_id: string }) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_SERVER_HOST}/rag/deleteKnowledgeBase`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, user_id }),
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
