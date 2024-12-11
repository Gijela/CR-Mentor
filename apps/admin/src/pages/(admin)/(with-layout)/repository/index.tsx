import { useState } from "react"
import { useRepositories } from "@/hooks/query/use-repositories"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@repo/ui/pagination"
import { Separator } from "@repo/ui/separator"
import { useTranslation } from "react-i18next"
import { Button } from "@repo/ui/button"
import { Input } from "@repo/ui/input"
import { Card, CardHeader, CardContent } from "@repo/ui/card"
import { Badge } from "@repo/ui/badge"
import {
  GitForkIcon,
  StarIcon,
  ClockIcon,
  SettingsIcon,
  GitPullRequestIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { SearchIcon } from "lucide-react"
import { LoadingSpinner } from "@/components/loading-spinner"
import type { Repository } from "./interface"
import { CreatePRDialog } from "./components/create-pr-dialog"

export function Component() {
  const { t } = useTranslation()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState<'updated' | 'stars' | 'forks'>("updated")

  const handleSearch = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  const { data, isLoading, total, pageSize } = useRepositories({
    page,
    search,
    sort
  })

  const totalPages = Math.ceil(total / pageSize)

  const handlePageChange = (newPage: number) => {
    setPage(Math.max(1, Math.min(newPage, totalPages)))
  }

  const handleSortChange = (value: string) => {
    setSort(value as 'updated' | 'stars' | 'forks')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <div className="relative w-[300px]">
            <Input
              className="pl-8"
              placeholder={t('repository.search_placeholder', '搜索仓库...')}
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />
            <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>

          <Select value={sort} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t('repository.sort_by', '排序方式')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="updated">{t('repository.sort.updated', '最近更新')}</SelectItem>
              <SelectItem value="stars">{t('repository.sort.stars', '星标数')}</SelectItem>
              <SelectItem value="forks">{t('repository.sort.forks', '复刻数')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <CreatePRDialog />
      </div>

      <Separator />

      {isLoading ? (
        <div className="flex justify-center p-8">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {data?.map((repo: Repository, index: number) => (
              <Card key={index} className="hover:bg-muted/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-primary hover:underline cursor-pointer">
                          {repo.name}
                        </h3>
                        <Badge variant="secondary">{repo.visibility}</Badge>
                      </div>

                      {repo.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {repo.description}
                        </p>
                      )}

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <span
                            className={cn(
                              "w-3 h-3 rounded-full",
                              {
                                "bg-yellow-400": repo.language === "JavaScript",
                                "bg-green-500": repo.language === "Vue",
                                "bg-gray-400": !["JavaScript", "Vue"].includes(repo.language)
                              }
                            )}
                          />
                          {repo.language}
                        </div>
                        <div className="flex items-center gap-1">
                          <StarIcon className="h-4 w-4" />
                          {repo.stars}
                        </div>
                        <div className="flex items-center gap-1">
                          <GitForkIcon className="h-4 w-4" />
                          {repo.forks}
                        </div>
                        <div className="flex items-center gap-1">
                          <ClockIcon className="h-4 w-4" />
                          Updated on {repo.updatedAt}
                        </div>
                        {repo.license && (
                          <Badge variant="outline">{repo.license}</Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <SettingsIcon className="mr-2 h-4 w-4" />
                        {t('repository.setting', '设置')}
                      </Button>
                      <Button variant="outline" size="sm">
                        <GitPullRequestIcon className="mr-2 h-4 w-4" />
                        {t('repository.prs', 'PRs')}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {total > 0 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground whitespace-nowrap">
                {t('repository.total_items', {
                  total,
                  defaultValue: '共 {{total}} 个仓库'
                })}
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      size="default"
                      onClick={() => handlePageChange(page - 1)}
                      className={page === 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <span className="px-4">
                      {page} / {totalPages}
                    </span>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      size="default"
                      onClick={() => handlePageChange(page + 1)}
                      className={page >= totalPages ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  )
}
