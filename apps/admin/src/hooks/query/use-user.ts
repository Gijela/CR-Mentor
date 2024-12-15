import {
  keepPreviousData,
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query"
import type { PaginationState } from "@tanstack/react-table"
import { useNavigate } from "react-router-dom"

import { apiFetch } from "@/lib/api-fetch"
import type { ILoginForm, IUserProfile, IUsers } from "@/schema/user"

export const queryUser = () => queryOptions({
  queryKey: ["userInfo"],
  queryFn: async () => apiFetch<IUserProfile>("/api/users"),
})

export const queryUserInfo = () =>
  queryOptions({
    queryKey: ["user-info"],
    // queryFn: async () => apiFetch<{
    //   data: IUserProfile
    // }>(`/api/users/info`),
    queryFn: async () => ({
      code: 200,
      msg: "Get user info success",
      data: {
        id: "cb9dacc8-2cbf-48de-bb17-ac47c34379ab",
        email: "admin@shadcn.com",
        password: "$2a$10$jzcPjzUKWCUd1Tc1tqq2ZOThLyRdvSy2bY6iZDnmnefgJUTNL9P2a",
        name: "Admin",
        username: "admin",
        avatar: "https://avatars.githubusercontent.com/u/31701936",
        birthdate: "2005-08-15T11:00:26.555Z",
        registeredAt: "2024-11-29T06:47:01.680Z",
        createdAt: "2024-11-29T06:47:01.680Z",
        updatedAt: "2024-11-29T06:47:01.575Z",
        status: "active",
        role: "admin",
        bio: "Tremo tabella capillus benigne supplanto surculus arcesso subnecto aliquid minima. Valens attero vilis caecus auctus consectetur beneficium copiose viscus ipsum. Tendo confido terminatio itaque.",
        amount: "1000"
      }
    }),
  })

export function useUser() {
  return useSuspenseQuery(queryUserInfo())
}

export function useUserLoginMutation() {
  return useMutation({
    mutationFn: async (loginForm: ILoginForm) =>
      await apiFetch("/api/auth/login", {
        method: "POST",
        body: loginForm,
      }),
    mutationKey: ["user-login"],
  })
}

export function useUserLogoutMutation() {
  const navigate = useNavigate()
  return useMutation({
    mutationFn: async () => await apiFetch("/api/logout"),
    mutationKey: ["user-logout"],
    onSuccess: () => {
      localStorage.clear()
      navigate("/login")
    },
  })
}

export function useUsers(pagination?: PaginationState, searchParams?: Partial<IUsers>) {
  const { pageIndex = 1, pageSize = 10 } = pagination || {}
  const { data, isPending, isFetching, refetch } = useQuery({
    queryKey: ["users", pageIndex, pageSize, ...Object.entries(searchParams || {})],
    queryFn: async () => apiFetch<{
      list: IUsers[]
      total: number
      page: number
      pageSize: number
    }>("/api/users", {
      params: {
        page: pageIndex,
        pageSize,
        ...searchParams,
      },
    }),
    placeholderData: keepPreviousData,
  })

  return {
    isPending,
    isLoading: isFetching,
    refetch,
    data: {
      list: data?.list || [],
      total: data?.total || 0,
      page: data?.page || 0,
      pageSize: data?.pageSize || 0,
    },
  }
}

export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (user: IUsers) =>
      await apiFetch(`/api/${user.id}`, {
        method: "PUT",
        body: user,
      }),
    onSuccess: () => {
      // 更新用户列表缓存
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
  })
}
