import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/avatar"
import { Badge } from "@repo/ui/badge"
import { Button } from "@repo/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu"
import { Input } from "@repo/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/table"
import { ExternalLink, GitBranch, MoreHorizontal, Search } from "lucide-react"
import React, { useState } from "react"

interface PullRequest {
  id: number
  title: string
  status: "open" | "closed" | "merged"
  author: {
    name: string
    avatar: string
  }
  createdAt: string
  sourceBranch: string
  targetBranch: string
  repository: {
    name: string
    url: string
  }
  prUrl: string
}

const pullRequests: PullRequest[] = [
  {
    id: 1,
    title: "添加用户认证功能",
    status: "open",
    author: {
      name: "张三",
      avatar: "https://github.com/shadcn.png",
    },
    createdAt: "2024-03-20",
    sourceBranch: "feature/auth",
    targetBranch: "main",
    repository: {
      name: "frontend-bds",
      url: "https://github.com/org/frontend-bds",
    },
    prUrl: "https://github.com/org/frontend-bds/pull/1",
  },
  {
    id: 2,
    title: "优化首页性能",
    status: "merged",
    author: {
      name: "李四",
      avatar: "https://github.com/shadcn.png",
    },
    createdAt: "2024-03-19",
    sourceBranch: "feature/performance",
    targetBranch: "main",
    repository: {
      name: "frontend-app",
      url: "https://github.com/org/frontend-app",
    },
    prUrl: "https://github.com/org/frontend-app/pull/2",
  },
]

const getStatusBadge = (status: PullRequest["status"]) => {
  const styles = {
    open: "bg-green-100 text-green-800",
    closed: "bg-red-100 text-red-800",
    merged: "bg-purple-100 text-purple-800",
  }

  return (
    <Badge variant="secondary" className={styles[status]}>
      {status.toUpperCase()}
    </Badge>
  )
}

export function Component() {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<PullRequest["status"] | "all">("all")
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc")
  const itemsPerPage = 10

  const filteredPRs = pullRequests
    .filter((pr) => {
      const matchesSearch =
        pr.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pr.sourceBranch.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pr.targetBranch.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pr.repository.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pr.author.name.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = statusFilter === "all" || pr.status === statusFilter

      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime()
      const dateB = new Date(b.createdAt).getTime()
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB
    })

  const totalPages = Math.ceil(filteredPRs.length / itemsPerPage)
  const paginatedPRs = filteredPRs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div className="flex justify-between gap-4 w-full">
          <div className="flex gap-4">
            <div className="relative w-[300px]">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search PR..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={statusFilter} onValueChange={(value: PullRequest["status"] | "all") => setStatusFilter(value)}>
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
            <Select value={sortOrder} onValueChange={(value: "desc" | "asc") => setSortOrder(value)}>
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

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Repository</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Source Branch</TableHead>
            <TableHead>Target Branch</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedPRs.map((pr) => (
            <TableRow key={pr.id}>
              <TableCell className="font-medium">{pr.title}</TableCell>
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
                onClick={() => setCurrentPage((p) => p - 1)}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i + 1}>
                <PaginationLink
                  size="default"
                  onClick={() => setCurrentPage(i + 1)}
                  isActive={currentPage === i + 1}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                size="default"
                onClick={() => setCurrentPage((p) => p + 1)}
                className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </>
  )
}
