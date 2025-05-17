import { useUser } from "@clerk/clerk-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ExternalLink, GitBranch, MoreHorizontal, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { LoadingSpinner } from "@/components/loading-spinner";
import { RepositorySearch } from "@/components/repository-search";
import { usePullRequests } from "@/hooks/query/use-pull-request";

import EmptyCard from "./components/emptyCard";

interface PullRequest {
  id: number;
  title: string;
  status: "open" | "closed" | "merged";
  author: {
    name: string;
    avatar: string;
  };
  createdAt: string;
  sourceBranch: string;
  targetBranch: string;
  repository: {
    name: string;
    url: string;
  };
  prUrl: string;
}

const getStatusBadge = (status: PullRequest["status"]) => {
  const styles = {
    open: "bg-green-100 text-green-800",
    closed: "bg-red-100 text-red-800",
    merged: "bg-purple-100 text-purple-800",
  };

  return (
    <Badge variant="secondary" className={styles[status]}>
      {status.toUpperCase()}
    </Badge>
  );
};

export function Component() {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<
    PullRequest["status"] | "all"
  >("all");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [searchRepo, setSearchRepo] = useState("");
  const [selectedRepo, setSelectedRepo] = useState<string>("all");
  const itemsPerPage = 20;
  const { user } = useUser();

  useEffect(() => {
    const repoFromUrl = searchParams.get("repo");
    if (repoFromUrl) {
      setSelectedRepo(repoFromUrl);
      setSearchRepo(repoFromUrl);
    }
  }, [searchParams]);

  // 当筛选条件改变时重置页码
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, sortOrder, selectedRepo, searchQuery]);

  const {
    data: pullResponse = { items: [], totalCount: 0 },
    isLoading: isLoadingPRs,
  } = usePullRequests({
    owner: user?.username!,
    repo: selectedRepo === "all" ? "" : selectedRepo,
    state: statusFilter === "all" ? "all" : statusFilter,
    sort: "created",
    direction: sortOrder,
    per_page: itemsPerPage,
    page: currentPage,
    query: searchQuery,
  });

  // 直接使用 API 返回的结果
  const filteredPRs = pullResponse.items;

  // 计算总页数，使用 API 返回的总数
  const totalPages = Math.max(
    1,
    Math.ceil(pullResponse.totalCount / itemsPerPage)
  );

  // 处理页码变化
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // 生成要显示的页码数组
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // 如果总页数小于等于最大显示页数，显示所有页码
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // 总是显示第一页
      pageNumbers.push(1);

      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      // 如果当前页靠近开始
      if (currentPage <= 3) {
        startPage = 2;
        endPage = 4;
      }

      // 如果当前页靠近结束
      if (currentPage >= totalPages - 2) {
        startPage = totalPages - 3;
        endPage = totalPages - 1;
      }

      // 添加省略号
      if (startPage > 2) {
        pageNumbers.push("...");
      }

      // 添加中间的页码
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      // 添加省略号
      if (endPage < totalPages - 1) {
        pageNumbers.push("...");
      }

      // 总是显示最后一页
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div className="flex justify-between gap-4 w-full p-1">
          <div className="flex gap-4">
            <RepositorySearch
              owner={user?.username as string}
              value={searchRepo}
              onChange={(value) => {
                setSearchRepo(value);
                // 当搜索框被清空时，重置为搜索所有仓库
                if (!value) {
                  setSelectedRepo("all");
                }
              }}
              onSelect={(repo) => {
                setSelectedRepo(repo.value);
                setSearchRepo(repo.label);
              }}
              className="w-[200px]"
            />

            <div className="relative w-[300px]">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder={
                  selectedRepo === "all"
                    ? "Search all PRs..."
                    : `Search PRs in ${selectedRepo}...`
                }
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  // 可以添加防抖逻辑
                }}
                className="pl-8"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value: PullRequest["status"] | "all") =>
                setStatusFilter(value)
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
                <SelectItem value="merged">Merged</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={sortOrder}
              onValueChange={(value: "desc" | "asc") => setSortOrder(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by Created" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Newest</SelectItem>
                <SelectItem value="asc">Oldest</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New PR
          </Button> */}
        </div>
      </div>

      {isLoadingPRs && <LoadingSpinner />}

      {!isLoadingPRs && filteredPRs.length === 0 && (
        <EmptyCard
          icon={<GitBranch className="h-12 w-12 text-gray-400 mx-auto" />}
          title="No Pull Requests"
          description="Please login to create and manage your pull requests"
        />
      )}

      {!isLoadingPRs && filteredPRs.length > 0 && (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[280px]">Title</TableHead>
                {selectedRepo === "all" && <TableHead>Repository</TableHead>}
                <TableHead>Status</TableHead>
                <TableHead>Author</TableHead>
                {selectedRepo !== "all" && (
                  <>
                    <TableHead>Source Branch</TableHead>
                    <TableHead>Target Branch</TableHead>
                  </>
                )}
                <TableHead>Created At</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPRs.map((pr) => (
                <TableRow key={pr.id}>
                  <TableCell>
                    <div className="w-[280px] overflow-hidden">
                      <a
                        href={pr.prUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-600 hover:underline cursor-pointer truncate block"
                        title={pr.title}
                      >
                        {pr.title}
                      </a>
                    </div>
                  </TableCell>
                  {selectedRepo === "all" && (
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <GitBranch className="h-4 w-4" />
                        <a
                          href={pr.repository.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          {pr.repository.name}
                        </a>
                      </div>
                    </TableCell>
                  )}
                  <TableCell>{getStatusBadge(pr.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={pr.author.avatar} />
                        <AvatarFallback>{pr.author.name[0]}</AvatarFallback>
                      </Avatar>
                      {pr.author.name}
                    </div>
                  </TableCell>
                  {selectedRepo !== "all" && (
                    <>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <GitBranch className="h-4 w-4" />
                          {pr.sourceBranch}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <GitBranch className="h-4 w-4" />
                          {pr.targetBranch}
                        </div>
                      </TableCell>
                    </>
                  )}
                  <TableCell>{pr.createdAt}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => window.open(pr.prUrl, "_blank")}
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View PR
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    size="default"
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={
                      currentPage === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>
                {getPageNumbers().map((pageNumber, index) => (
                  <PaginationItem key={index}>
                    {pageNumber === "..." ? (
                      <span className="px-4 py-2">...</span>
                    ) : (
                      <PaginationLink
                        size="default"
                        onClick={() => handlePageChange(pageNumber as number)}
                        isActive={currentPage === pageNumber}
                      >
                        {pageNumber}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    size="default"
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={
                      currentPage >= totalPages
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
    </>
  );
}
