import { useQuery } from "@tanstack/react-query"

import { getDiffInfo } from "@/lib/github"

interface UseAgentsOptions {
  githubName: string
  compareUrl: string
  baseLabel: string
  headLabel: string
}
const useAgents = (options: UseAgentsOptions) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["agents", options],
    queryFn: () => getDiffInfo(options),
  })

  return {
    data,
    isLoading,
    error,
  }
}

export default useAgents
