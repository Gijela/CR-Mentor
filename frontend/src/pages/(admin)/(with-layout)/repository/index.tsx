import { useUser } from "@clerk/clerk-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  ClockIcon,
  GitForkIcon,
  GitPullRequestIcon,
  SearchIcon,
  SettingsIcon,
  StarIcon,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { LoadingSpinner } from "@/components/loading-spinner";
import { useRepositories } from "@/hooks/query/use-repositories";
import { cn } from "@/lib/utils";

import EmptyCard from "../pullRequest/components/emptyCard";
import { CreatePRDialog } from "./components/create-pr-dialog";
import type { Repository } from "./interface";
import { usePlatform } from "@/hooks/use-platform";

export function Component() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"updated" | "stars" | "forks">("updated");

  const navigate = useNavigate();
  const { user } = useUser();
  const { isGithub } = usePlatform();

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const {
    data = [],
    isLoading,
    page,
    setPage,
    totalCount,
  } = useRepositories({
    githubName: user?.publicMetadata?.githubName as string,
    search,
    sort,
    pageSize: 20,
  });

  const handleSortChange = (value: string) => {
    setSort(value as "updated" | "stars" | "forks");
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-1">
        <div className="flex gap-4">
          <div className="relative w-[300px]">
            <Input
              className="pl-8"
              placeholder={t(
                "repository.search_placeholder",
                "Search repositories..."
              )}
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />
            <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>

          {isGithub && (
            <Select value={sort} onValueChange={handleSortChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t("repository.sort_by", "Sort by")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="updated">
                  {t("repository.sort.updated", "Recently updated")}
                </SelectItem>
                <SelectItem value="stars">
                  {t("repository.sort.stars", "Stars")}
                </SelectItem>
                <SelectItem value="forks">
                  {t("repository.sort.forks", "Forks")}
                </SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>

        <CreatePRDialog
          githubName={user?.publicMetadata?.githubName as string}
        />
      </div>

      <Separator />

      {isLoading ? (
        <LoadingSpinner />
      ) : (data || []).length === 0 ? (
        <EmptyCard
          icon={<GitForkIcon className="h-12 w-12 text-gray-400 mx-auto" />}
          title="No Repositories found"
          description="Please Sign in First"
        />
      ) : (
        <>
          <div className="space-y-4">
            {(data || []).map((repo: Repository, index: number) => (
              <Card key={index} className="hover:bg-muted/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3
                          onClick={() => window.open(repo.html_url, "_blank")}
                          className="text-lg font-semibold text-primary hover:underline cursor-pointer"
                        >
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
                        {repo.language && (
                          <div className="flex items-center gap-1">
                            <span
                              className={cn("w-3 h-3 rounded-full", {
                                "bg-yellow-400": repo.language === "JavaScript",
                                "bg-green-500": repo.language === "Vue",
                                "bg-gray-400": !["JavaScript", "Vue"].includes(
                                  repo.language
                                ),
                              })}
                            />
                            {repo.language}
                          </div>
                        )}
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
                          Updated{" "}
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
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          toast.info(
                            "Repository personalization settings are under development, stay tuned ~"
                          )
                        }
                      >
                        <SettingsIcon className="mr-2 h-4 w-4" />
                        {t("repository.setting", "Setting")}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          navigate(`/pullRequest?repo=${repo.name}`)
                        }
                      >
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
                defaultValue: `Total ${totalCount} repositories`,
              })}
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    size="default"
                    onClick={() => setPage(page - 1)}
                    className={
                      page <= 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>
                <PaginationItem>
                  <span className="px-4">{page}</span>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    size="default"
                    onClick={() => setPage(page + 1)}
                    className={
                      page === Math.ceil(totalCount / 20)
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </>
      )}
    </div>
  );
}
