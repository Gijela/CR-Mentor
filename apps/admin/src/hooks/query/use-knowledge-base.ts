import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

interface KnowledgeBase {
  id: number
  user_id: string
  title: string
  description: string
  created_at: string
  updated_at: string
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
export function useKnowledgeBases(user_id: string) {
  return useQuery({
    queryKey: ["knowledge-bases", user_id],
    queryFn: async () => {
      const res = await fetch(`${apiUrl}/api/supabase/rag/knowledge_bases/getTotalKB`, {
        method: "POST",
        body: JSON.stringify({ user_id }),
      })
      const { success, data } = await res.json()
      if (!success) throw new Error("Failed to fetch knowledge bases")
      return data as KnowledgeBase[]
    },
  })
}

// 创建知识库
export function useCreateKnowledgeBase() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (params: CreateKnowledgeBaseParams) => {
      const res = await fetch(`${apiUrl}/api/supabase/rag/knowledge_bases/insertKB`, {
        method: "POST",
        body: JSON.stringify(params),
      })
      const { success, data } = await res.json()
      if (!success) throw new Error("Failed to create knowledge base")
      return data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["knowledge-bases", variables.user_id] })
    },
  })
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
export function useDeleteKnowledgeBase() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, user_id }: { id: number; user_id: string }) => {
      const res = await fetch(`${apiUrl}/api/supabase/rag/knowledge_bases/deleteKB`, {
        method: "POST",
        body: JSON.stringify({ id, user_id }),
      })
      const { success, data } = await res.json()
      if (!success) throw new Error("Failed to delete knowledge base")
      return data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["knowledge-bases", variables.user_id] })
    },
  })
} 