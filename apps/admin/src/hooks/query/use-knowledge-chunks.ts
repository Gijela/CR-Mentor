import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export interface DocumentChunk {
  id: number
  kb_id: number
  content: string
  embedding: string
  created_at: string
  metadata: {
    source: string
    title: string
  }
}

interface CreateChunkParams {
  kb_id: number
  content: string
  metadata: {
    source: string
    title: string
  }
}

const apiUrl = import.meta.env.VITE_GITHUB_SERVER_API
// 获取知识库的所有文档块
export function useKnowledgeChunks(kb_id: number) {
  return useQuery({
    queryKey: ["knowledge-chunks", kb_id],
    queryFn: async () => {
      const res = await fetch(`${apiUrl}/api/supabase/rag/kb_chunks/getOneKBTotalChunks`, {
        method: "POST",
        body: JSON.stringify({ kb_id }),
      })
      const { success, data } = await res.json()
      if (!success) throw new Error("Failed to fetch chunks")
      return data as DocumentChunk[]
    },
  })
}

// 创建新的文档块
export function useCreateChunk() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (params: CreateChunkParams) => {
      const res = await fetch(`${apiUrl}/api/supabase/rag/kb_chunks/insertChunk`, {
        method: "POST",
        body: JSON.stringify(params),
      })
      const { ok, data } = await res.json()
      if (!ok) throw new Error("Failed to create chunk")
      return data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["knowledge-chunks", variables.kb_id] })
    },
  })
}

// 删除文档块
export function useDeleteChunk() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, kb_id }: { id: number; kb_id: number }) => {
      const res = await fetch(`${apiUrl}/api/supabase/rag/kb_chunks/deleteChunk`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          // 可能需要添加其他必要的参数，比如 user_id 等
        }),
      })
      const { success, error, data } = await res.json()
      if (!success) {
        throw new Error(
          error?.message ||
          error?.details ||
          "删除文档块失败"
        )
      }
      return data
    },
    onSuccess: (_, variables) => {
      // 删除成功后刷新列表
      queryClient.invalidateQueries({
        queryKey: ["knowledge-chunks", variables.kb_id]
      })
    },
    onError: (error) => {
      console.error("Delete chunk error:", error)
    }
  })
}

// 更新文档块
export function useUpdateChunk() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, kb_id, content }: { id: number; kb_id: number; content: string }) => {
      if (!content.trim()) {
        throw new Error("文档内容不能为空")
      }

      const res = await fetch(`${apiUrl}/api/supabase/rag/kb_chunks/updateChunk`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          content,
          // 可能需要添加其他必要的参数
        }),
      })
      const { success, error, data } = await res.json()
      if (!success) {
        throw new Error(
          error?.message ||
          error?.details ||
          "更新文档块失败"
        )
      }
      return data
    },
    onSuccess: (_, variables) => {
      // 更新成功后刷新列表
      queryClient.invalidateQueries({
        queryKey: ["knowledge-chunks", variables.kb_id]
      })
    },
    onError: (error) => {
      console.error("Update chunk error:", error)
    }
  })
} 