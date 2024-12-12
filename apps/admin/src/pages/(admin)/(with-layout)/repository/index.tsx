import { Badge } from "@repo/ui/badge"
import { Button } from "@repo/ui/button"
import { Card, CardContent } from "@repo/ui/card"
import { Input } from "@repo/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@repo/ui/pagination"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select"
import { Separator } from "@repo/ui/separator"
import {
  ClockIcon,
  GitForkIcon,
  GitPullRequestIcon,
  SearchIcon,
  SettingsIcon,
  StarIcon,
} from "lucide-react"
import { useState } from "react"
import { useTranslation } from "react-i18next"

import { LoadingSpinner } from "@/components/loading-spinner"
import { useRepositories } from "@/hooks/query/use-repositories"
import { cn } from "@/lib/utils"

import { CreatePRDialog } from "./components/create-pr-dialog"
import type { Repository } from "./interface"

const githubName = "Gijela"

export function Component() {
  const { t } = useTranslation()
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState<"updated" | "stars" | "forks">("updated")

  const handleSearch = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  const { data, isLoading, page, setPage, totalCount } = useRepositories({
    githubName,
    search,
    sort,
    pageSize: 20,
  })

  const handleSortChange = (value: string) => {
    setSort(value as "updated" | "stars" | "forks")
    setPage(1)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <div className="relative w-[300px]">
            <Input
              className="pl-8"
              placeholder={t("repository.search_placeholder", "搜索仓库...")}
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />
            <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>

          <Select value={sort} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t("repository.sort_by", "排序方式")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="updated">{t("repository.sort.updated", "最近更新")}</SelectItem>
              <SelectItem value="stars">{t("repository.sort.stars", "星标数")}</SelectItem>
              <SelectItem value="forks">{t("repository.sort.forks", "复刻数")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <CreatePRDialog githubName={githubName} totalCount={totalCount} />
      </div>

      <Separator />

      {isLoading ? (
        <div className="flex justify-center p-8">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {(data || []).map((repo: Repository, index: number) => (
              <Card key={index} className="hover:bg-muted/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 onClick={() => window.open(repo.html_url, "_blank")} className="text-lg font-semibold text-primary hover:underline cursor-pointer">
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
                                "bg-gray-400": !["JavaScript", "Vue"].includes(repo.language),
                              },
                            )}
                          />
                          {repo.language}
                        </div>
                        <div className="flex items-center gap-1">
                          <StarIcon className="h-4 w-4" />
                          {repo.stargazers_count}
                        </div>
                        <div className="flex items-center gap-1">
                          <GitForkIcon className="h-4 w-4" />
                          {repo.forks_count}
                        </div>
                        <div className="flex items-center gap-1">
                          <ClockIcon className="h-4 w-4" />
                          Updated on
                          {" "}
                          {new Date(repo.updated_at).toLocaleString("zh-CN", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: false,
                          })}
                        </div>
                        {repo.license && (
                          <Badge variant="outline">{repo.license.name}</Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <SettingsIcon className="mr-2 h-4 w-4" />
                        {t("repository.setting", "设置")}
                      </Button>
                      <Button variant="outline" size="sm">
                        <GitPullRequestIcon className="mr-2 h-4 w-4" />
                        {t("repository.prs", "PRs")}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground whitespace-nowrap">
              {t("repository.total_items", {
                defaultValue: `总共 ${totalCount} 个仓库`,
              })}
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    size="default"
                    onClick={() => setPage(page - 1)}
                    className={page <= 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                <PaginationItem>
                  <span className="px-4">
                    {page}
                  </span>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    size="default"
                    onClick={() => setPage(page + 1)}
                    className={page === Math.ceil(totalCount / 20) ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </>
      )}
    </div>
  )
}
