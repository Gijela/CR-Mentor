import * as React from "react";
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type {
  ColumnDef,
  ColumnFiltersState,
  Row,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  CheckCircle2Icon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ColumnsIcon,
  GripVerticalIcon,
  LoaderIcon,
  MoreVerticalIcon,
  PlusIcon,
  TrendingUpIcon,
  AlertTriangleIcon,
} from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { toast } from "sonner";
import { z } from "zod";

import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ChartConfig } from "@/components/ui/chart";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Updated schema for IssueItem
export const issueSchema = z.object({
  id: z.string(), // Assuming ID from API is a string or can be converted
  description: z.string(),
  category_or_area: z.string(),
  status: z.string(), // e.g., "active", "resolved", "new"
  frequency: z.number().optional(),
  related_prs: z.array(z.string()).nullable().optional(),
  last_seen_at: z.string().datetime({ offset: true }).optional(), // Expecting ISO 8601 format
  first_seen_at: z.string().datetime({ offset: true }).optional(),
});

export type IssueItem = z.infer<typeof issueSchema>;

// Define schema for StrengthItem
export const strengthSchema = z.object({
  id: z.string(),
  description: z.string(),
  category_or_area: z.string(),
  confidence: z.number().optional(),
  related_prs: z.array(z.string()).nullable().optional(),
  last_seen_at: z.string().datetime({ offset: true }).optional(),
  first_seen_at: z.string().datetime({ offset: true }).optional(),
});

export type StrengthItem = z.infer<typeof strengthSchema>;

// 通用类型定义，用于处理表格数据项
export type TableItemType = IssueItem | StrengthItem;

// Create a separate component for the drag handle
function DragHandle({ id }: { id: string }) {
  // id type changed to string
  const { attributes, listeners } = useSortable({
    id,
  });

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="size-7 text-muted-foreground hover:bg-transparent"
    >
      <GripVerticalIcon className="size-3 text-muted-foreground" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  );
}

const columns: ColumnDef<IssueItem>[] = [
  // Type changed to IssueItem
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />, // id is string
  },
  {
    accessorKey: "description", // Was "header"
    header: "Issue Description",
    cell: ({ row }) => {
      // TableCellViewer will need to be adapted or this cell customized
      return <TableCellViewer item={row.original} />;
    },
    enableHiding: false,
  },
  {
    accessorKey: "category_or_area", // Was "type"
    header: "Category",
    cell: ({ row }) => (
      <div className="w-36 truncate">
        {" "}
        {/* Increased width and added truncate */}
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
      // Example status handling, adjust icons and colors as needed
      let icon = <LoaderIcon />;
      if (status === "active" || status === "open" || status === "new") {
        icon = (
          <AlertTriangleIcon className="text-orange-500 dark:text-orange-400" />
        );
      } else if (
        status === "resolved" ||
        status === "closed" ||
        status === "done"
      ) {
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
      <div className="w-24 tabular-nums">
        {" "}
        {/* Adjusted width */}
        {row.original.frequency ?? "N/A"}
      </div>
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
      // Simple display, could be enhanced with links if PRs are URLs
      return (
        <div className="w-36 truncate">
          {/* Added truncate for long lists */}
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
          {" "}
          {/* Adjusted width */}
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
          {" "}
          {/* Adjusted width */}
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

// Define columns for StrengthItem
const strengthColumns: ColumnDef<StrengthItem>[] = [
  // Drag column
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
  },
  // Description column
  {
    accessorKey: "description",
    header: "Strength Description",
    cell: ({ row }) => {
      return <StrengthCellViewer item={row.original} />;
    },
    enableHiding: false,
  },
  // Category/Area column
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
  // Confidence column
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
  // Related PRs column
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
  // First seen column
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
  // Last seen column
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
  // Actions column
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

function DraggableRow<T extends { id: string }>({ row }: { row: Row<T> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  });

  return (
    <TableRow
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}

// Issues 详情查看组件
function TableCellViewer({ item }: { item: IssueItem }) {
  const [activeTab, setActiveTab] = React.useState("summary");
  const isMobile = useIsMobile();

  // Update to reflect IssueItem structure
  const title = item.description; // Use description as title
  const summaryDetails = [
    { label: "Category", value: item.category_or_area },
    { label: "Status", value: item.status },
    { label: "Frequency", value: item.frequency?.toString() ?? "N/A" },
    {
      label: "First Seen",
      value: item.first_seen_at
        ? new Date(item.first_seen_at).toLocaleDateString()
        : "N/A",
    },
    {
      label: "Last Seen",
      value: item.last_seen_at
        ? new Date(item.last_seen_at).toLocaleDateString()
        : "N/A",
    },
  ];

  const prs =
    item.related_prs && item.related_prs.length > 0
      ? item.related_prs.join(", ")
      : "None";

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="link" className="w-fit px-0 text-left text-foreground">
          {title}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex flex-col">
        <SheetHeader className="gap-1">
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>
            Showing total visitors for the last 6 months
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto py-4 text-sm">
          {!isMobile && (
            <>
              <ChartContainer config={chartConfig}>
                <AreaChart
                  accessibilityLayer
                  data={chartData}
                  margin={{
                    left: 0,
                    right: 10,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                    hide
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Area
                    dataKey="mobile"
                    type="natural"
                    fill="var(--color-mobile)"
                    fillOpacity={0.6}
                    stroke="var(--color-mobile)"
                    stackId="a"
                  />
                  <Area
                    dataKey="desktop"
                    type="natural"
                    fill="var(--color-desktop)"
                    fillOpacity={0.4}
                    stroke="var(--color-desktop)"
                    stackId="a"
                  />
                </AreaChart>
              </ChartContainer>
              <Separator />
              <div className="grid gap-2">
                <div className="flex gap-2 font-medium leading-none">
                  Trending up by 5.2% this month{" "}
                  <TrendingUpIcon className="size-4" />
                </div>
                <div className="text-muted-foreground">
                  Showing total visitors for the last 6 months. This is just
                  some random text to test the layout. It spans multiple lines
                  and should wrap around.
                </div>
              </div>
              <Separator />
            </>
          )}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-2 grid w-full grid-cols-3">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>
            <TabsContent value="summary">
              <SheetDescription className="space-y-2">
                {summaryDetails.map((detail) => (
                  <div key={detail.label} className="flex justify-between">
                    <span className="font-medium text-foreground/80">
                      {detail.label}:
                    </span>
                    <span>{detail.value}</span>
                  </div>
                ))}
                <div className="flex justify-between">
                  <span className="font-medium text-foreground/80">
                    Related PRs:
                  </span>
                  <span className="truncate">{prs}</span>
                </div>
              </SheetDescription>
            </TabsContent>
            <TabsContent value="details">
              <SheetDescription>
                Detailed information about the issue. (Content TBD) <br />
                Full Description: {item.description}
              </SheetDescription>
            </TabsContent>
            <TabsContent value="activity">
              <SheetDescription>
                Activity log for this issue. (Content TBD)
              </SheetDescription>
            </TabsContent>
          </Tabs>
        </div>
        <SheetFooter className="mt-auto flex gap-2 sm:flex-col sm:space-x-0">
          <Button className="w-full">Submit</Button>
          <SheetClose asChild>
            <Button variant="outline" className="w-full">
              Done
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

// Strengths 详情查看组件
function StrengthCellViewer({ item }: { item: StrengthItem }) {
  const [activeTab, setActiveTab] = React.useState("summary");
  const isMobile = useIsMobile();

  // Strength-specific information
  const title = item.description;
  const summaryDetails = [
    { label: "Area", value: item.category_or_area },
    {
      label: "Confidence",
      value: item.confidence ? `${Math.round(item.confidence * 100)}%` : "N/A",
    },
    {
      label: "First Seen",
      value: item.first_seen_at
        ? new Date(item.first_seen_at).toLocaleDateString()
        : "N/A",
    },
    {
      label: "Last Seen",
      value: item.last_seen_at
        ? new Date(item.last_seen_at).toLocaleDateString()
        : "N/A",
    },
  ];

  const prs =
    item.related_prs && item.related_prs.length > 0
      ? item.related_prs.join(", ")
      : "None";

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="link" className="w-fit px-0 text-left text-foreground">
          {title}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex flex-col">
        <SheetHeader className="gap-1">
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>
            Developer strength and expertise details
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto py-4 text-sm">
          {!isMobile && (
            <>
              <div className="grid gap-2">
                <div className="flex gap-2 font-medium leading-none">
                  <TrendingUpIcon className="size-4 text-green-500" />
                  {item.category_or_area} expertise
                </div>
                <div className="text-muted-foreground">
                  This strength has been consistently demonstrated in the
                  developer's code contributions.
                </div>
              </div>
              <Separator />
            </>
          )}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-2 grid w-full grid-cols-3">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="related">Related</TabsTrigger>
            </TabsList>
            <TabsContent value="summary">
              <SheetDescription className="space-y-2">
                {summaryDetails.map((detail) => (
                  <div key={detail.label} className="flex justify-between">
                    <span className="font-medium text-foreground/80">
                      {detail.label}:
                    </span>
                    <span>{detail.value}</span>
                  </div>
                ))}
                <div className="flex justify-between">
                  <span className="font-medium text-foreground/80">
                    Related PRs:
                  </span>
                  <span className="truncate">{prs}</span>
                </div>
              </SheetDescription>
            </TabsContent>
            <TabsContent value="details">
              <SheetDescription>
                Detailed information about this strength. (Content TBD) <br />
                Full Description: {item.description}
              </SheetDescription>
            </TabsContent>
            <TabsContent value="related">
              <SheetDescription>
                Related knowledge snippets and code examples. (Content TBD)
              </SheetDescription>
            </TabsContent>
          </Tabs>
        </div>
        <SheetFooter className="mt-auto flex gap-2 sm:flex-col sm:space-x-0">
          <Button className="w-full">View All Strengths</Button>
          <SheetClose asChild>
            <Button variant="outline" className="w-full">
              Done
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

// Issues 表格组件
function IssuesTable({ data: initialData }: { data: IssueItem[] }) {
  const [data, setData] = React.useState<IssueItem[]>(initialData);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const sortableId = React.useId();
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ id }) => id) || [],
    [data]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id);
        const newIndex = dataIds.indexOf(over.id);
        return arrayMove(data, oldIndex, newIndex);
      });
    }
  }

  return (
    <>
      <div className="overflow-hidden rounded-lg border">
        <DndContext
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={handleDragEnd}
          sensors={sensors}
          id={sortableId}
        >
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-muted">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="**:data-[slot=table-cell]:first:w-8">
              {table.getRowModel().rows?.length ? (
                <SortableContext
                  items={dataIds}
                  strategy={verticalListSortingStrategy}
                >
                  {table.getRowModel().rows.map((row) => (
                    <DraggableRow key={row.id} row={row} />
                  ))}
                </SortableContext>
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DndContext>
      </div>
      <div className="flex items-center justify-end">
        <div className="flex w-full items-center gap-8 lg:w-fit">
          <div className="hidden items-center gap-2 lg:flex">
            <Label htmlFor="rows-per-page" className="text-sm font-medium">
              Rows per page
            </Label>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="w-20" id="rows-per-page">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-fit items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeftIcon />
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeftIcon />
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRightIcon />
            </Button>
            <Button
              variant="outline"
              className="hidden size-8 lg:flex"
              size="icon"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRightIcon />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

// Strengths 表格组件
function StrengthsTable({ data: initialData }: { data: StrengthItem[] }) {
  const [data, setData] = React.useState<StrengthItem[]>(initialData);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const sortableId = React.useId();
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ id }) => id) || [],
    [data]
  );

  const table = useReactTable({
    data,
    columns: strengthColumns,
    state: {
      sorting,
      columnVisibility,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id);
        const newIndex = dataIds.indexOf(over.id);
        return arrayMove(data, oldIndex, newIndex);
      });
    }
  }

  return (
    <>
      <div className="overflow-hidden rounded-lg border">
        <DndContext
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={handleDragEnd}
          sensors={sensors}
          id={sortableId}
        >
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-muted">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="**:data-[slot=table-cell]:first:w-8">
              {table.getRowModel().rows?.length ? (
                <SortableContext
                  items={dataIds}
                  strategy={verticalListSortingStrategy}
                >
                  {table.getRowModel().rows.map((row) => (
                    <DraggableRow key={row.id} row={row} />
                  ))}
                </SortableContext>
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={strengthColumns.length}
                    className="h-24 text-center"
                  >
                    No strengths data available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DndContext>
      </div>
      <div className="flex items-center justify-end">
        <div className="flex w-full items-center gap-8 lg:w-fit">
          <div className="hidden items-center gap-2 lg:flex">
            <Label
              htmlFor="strength-rows-per-page"
              className="text-sm font-medium"
            >
              Rows per page
            </Label>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="w-20" id="strength-rows-per-page">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-fit items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeftIcon />
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeftIcon />
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRightIcon />
            </Button>
            <Button
              variant="outline"
              className="hidden size-8 lg:flex"
              size="icon"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRightIcon />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export function DataTable({
  data: initialData,
  activeTab = "outline",
  onTabChange,
}: {
  data: IssueItem[] | StrengthItem[];
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}) {
  const [activeTabState, setActiveTabState] = React.useState(activeTab);

  // 更新当选项卡变更时
  React.useEffect(() => {
    setActiveTabState(activeTab);
  }, [activeTab]);

  // 处理标签页变更，同时通知父组件
  const handleTabChange = (value: string) => {
    setActiveTabState(value);
    if (onTabChange) {
      onTabChange(value);
    }
  };

  // 判断数据类型，用于类型安全处理
  const isIssueData = (data: any[]): data is IssueItem[] => {
    return data.length > 0 && "status" in data[0];
  };

  const isStrengthData = (data: any[]): data is StrengthItem[] => {
    return data.length > 0 && "confidence" in data[0];
  };

  // 确保初始数据适合当前标签页
  const issuesData = isIssueData(initialData) ? initialData : [];
  const strengthsData = isStrengthData(initialData) ? initialData : [];

  return (
    <Tabs
      defaultValue={activeTab}
      value={activeTabState}
      onValueChange={handleTabChange}
      className="flex w-full flex-col justify-start gap-6"
    >
      <div className="flex items-center justify-between">
        <Label htmlFor="view-selector" className="sr-only">
          View
        </Label>
        <Select value={activeTabState} onValueChange={handleTabChange}>
          <SelectTrigger
            className="@4xl/main:hidden flex w-fit"
            id="view-selector"
          >
            <SelectValue placeholder="Select a view" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="outline">Outline</SelectItem>
            <SelectItem value="past-performance">Past Performance</SelectItem>
            <SelectItem value="key-personnel">Key Personnel</SelectItem>
            <SelectItem value="focus-documents">Focus Documents</SelectItem>
          </SelectContent>
        </Select>
        <TabsList className="@4xl/main:flex hidden">
          <TabsTrigger value="outline">Outline</TabsTrigger>
          <TabsTrigger value="past-performance" className="gap-1">
            Past Performance{" "}
            <Badge
              variant="secondary"
              className="flex h-5 w-5 items-center justify-center rounded-full bg-muted-foreground/30"
            >
              3
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="key-personnel" className="gap-1">
            Key Personnel{" "}
            <Badge
              variant="secondary"
              className="flex h-5 w-5 items-center justify-center rounded-full bg-muted-foreground/30"
            >
              2
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="focus-documents">Focus Documents</TabsTrigger>
        </TabsList>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <ColumnsIcon />
                <span className="hidden lg:inline">Customize Columns</span>
                <span className="lg:hidden">Columns</span>
                <ChevronDownIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {/* 由于表格实例现在是条件渲染的，我们需要移除此处的列选择UI或做更复杂处理 */}
              <DropdownMenuItem className="cursor-pointer">
                Customize columns in settings
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Issues Data Table */}
      <TabsContent
        value="outline"
        className="relative flex flex-col gap-4 overflow-auto"
      >
        <IssuesTable data={issuesData} />
      </TabsContent>

      {/* Strengths Data Table */}
      <TabsContent
        value="past-performance"
        className="relative flex flex-col gap-4 overflow-auto"
      >
        <StrengthsTable data={strengthsData} />
      </TabsContent>

      <TabsContent value="key-personnel" className="flex flex-col">
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </TabsContent>
      <TabsContent value="focus-documents" className="flex flex-col">
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </TabsContent>
    </Tabs>
  );
}

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--primary)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--primary)",
  },
} satisfies ChartConfig;
