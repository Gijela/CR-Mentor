import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  AlertTriangleIcon,
  CheckCircle2Icon,
  MoreVerticalIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { DragHandle } from "./DragHandle";
import { TableCellViewer } from "./TableCellViewer";
import { StrengthCellViewer } from "./StrengthCellViewer";
import { type IssueItem, type StrengthItem } from "./types";

// 问题表格列定义
export const columns: ColumnDef<IssueItem>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
  },
  {
    accessorKey: "description",
    header: "Issue Description",
    cell: ({ row }) => {
      return <TableCellViewer item={row.original} />;
    },
    enableHiding: false,
  },
  {
    accessorKey: "category_or_area",
    header: "Category",
    cell: ({ row }) => (
      <div className="w-36 truncate">
        <Badge variant="outline" className="px-1.5 text-muted-foreground">
          {row.original.category_or_area}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status.toLowerCase();
      let icon = (
        <AlertTriangleIcon className="text-orange-500 dark:text-orange-400" />
      );

      if (status === "resolved" || status === "closed" || status === "done") {
        icon = (
          <CheckCircle2Icon className="text-green-500 dark:text-green-400" />
        );
      }

      return (
        <Badge
          variant="outline"
          className="mr-4 gap-1 px-1.5 text-muted-foreground [&_svg]:size-3"
        >
          {icon}
          <span className="capitalize">{row.original.status}</span>
        </Badge>
      );
    },
  },
  {
    accessorKey: "frequency",
    header: () => <div className="w-full">Frequency</div>,
    cell: ({ row }) => (
      <div className="w-24 tabular-nums">{row.original.frequency ?? "N/A"}</div>
    ),
  },
  {
    accessorKey: "related_prs",
    header: "Related PRs",
    cell: ({ row }) => {
      const prs = row.original.related_prs;
      if (!prs || prs.length === 0) {
        return <span className="text-muted-foreground">None</span>;
      }
      const prArr = prs?.[0]?.split("/");
      const repo = prArr?.[prArr.length - 3];
      const prNumber = prArr?.[prArr.length - 1];

      return (
        <div className="w-36 truncate">
          <Button
            variant="link"
            onClick={() => window.open(prs?.[0], "_blank")}
            className="w-fit px-0 text-left text-foreground"
          >
            {repo} PR {prNumber}
          </Button>
        </div>
      );
    },
  },
  {
    accessorKey: "first_seen_at",
    header: "First Seen",
    cell: ({ row }) => {
      const date = row.original.first_seen_at;
      return (
        <div className="w-24">
          {date ? new Date(date).toLocaleDateString() : "N/A"}
        </div>
      );
    },
  },
  {
    accessorKey: "last_seen_at",
    header: "Last Seen",
    cell: ({ row }) => {
      const date = row.original.last_seen_at;
      return (
        <div className="w-24">
          {date ? new Date(date).toLocaleDateString() : "N/A"}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex size-8 text-muted-foreground data-[state=open]:bg-muted"
            size="icon"
          >
            <MoreVerticalIcon />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem className="cursor-pointer" onClick={() => {}}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" onClick={() => {}}>
            Make a copy
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" onClick={() => {}}>
            Favorite
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer" onClick={() => {}}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

// 技术优势表格列定义
export const strengthColumns: ColumnDef<StrengthItem>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
  },
  {
    accessorKey: "description",
    header: "Strength Description",
    cell: ({ row }) => {
      return <StrengthCellViewer item={row.original} />;
    },
    enableHiding: false,
  },
  {
    accessorKey: "category_or_area",
    header: "Area of Expertise",
    cell: ({ row }) => (
      <div className="w-36 truncate">
        <Badge variant="outline" className="px-1.5 text-muted-foreground">
          {row.original.category_or_area}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "confidence",
    header: () => <div className="w-full">Confidence</div>,
    cell: ({ row }) => {
      const confidence = row.original.confidence;
      return (
        <div className="w-32 flex items-center">
          <div className="bg-primary/20 rounded-full h-2 w-full">
            <div
              className="bg-green-500 dark:bg-green-400 rounded-full h-2"
              style={{ width: `${(confidence || 0) * 100}%` }}
            />
          </div>
          <span className="ml-2 tabular-nums text-xs">
            {confidence ? `${Math.round(confidence * 100)}%` : "N/A"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "related_prs",
    header: "Related PRs",
    cell: ({ row }) => {
      const prs = row.original.related_prs;
      if (!prs || prs.length === 0) {
        return <span className="text-muted-foreground">None</span>;
      }
      const prArr = prs?.[0]?.split("/");
      const repo = prArr?.[prArr.length - 3];
      const prNumber = prArr?.[prArr.length - 1];
      return (
        <div className="w-36 truncate">
          <Button
            variant="link"
            onClick={() => window.open(prs?.[0], "_blank")}
            className="w-fit px-0 text-left text-foreground"
          >
            {repo} PR {prNumber}
          </Button>
        </div>
      );
    },
  },
  {
    accessorKey: "first_seen_at",
    header: "First Seen",
    cell: ({ row }) => {
      const date = row.original.first_seen_at;
      return (
        <div className="w-24">
          {date ? new Date(date).toLocaleDateString() : "N/A"}
        </div>
      );
    },
  },
  {
    accessorKey: "last_seen_at",
    header: "Last Seen",
    cell: ({ row }) => {
      const date = row.original.last_seen_at;
      return (
        <div className="w-24">
          {date ? new Date(date).toLocaleDateString() : "N/A"}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex size-8 text-muted-foreground data-[state=open]:bg-muted"
            size="icon"
          >
            <MoreVerticalIcon />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem className="cursor-pointer" onClick={() => {}}>
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" onClick={() => {}}>
            Related Knowledge
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer" onClick={() => {}}>
            Share
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
