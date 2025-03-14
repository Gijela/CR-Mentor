import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/avatar"
import { Button } from "@repo/ui/button"
import { Card, CardContent } from "@repo/ui/card"
import { Input } from "@repo/ui/input"
import { ScrollArea } from "@repo/ui/scroll-area"
import { Send } from "lucide-react"
import { useState, useEffect } from "react"
import { Badge } from "@repo/ui/badge"
import { Progress } from "@repo/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@repo/ui/alert"
import { Info, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@repo/ui/dialog"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@repo/ui/collapsible"
import { ChevronDown, ChevronRight, FileCode, GitBranch, Network } from "lucide-react"
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  Position
} from 'reactflow';
import 'reactflow/dist/style.css';

import useAgents from "@/hooks/useAgents"

export function Component() {
  const [selectedMember, setSelectedMember] = useState<string>("Collector")
  const [message, setMessage] = useState("")
  const [selectedNode, setSelectedNode] = useState<any>(null)

  const { diffsData, combinedContextList, step, diffEntityObj, codeKnowledgeGraph, reviewData } = useAgents({
    githubName: "Gijela",
    compareUrl: "https://api.github.com/repos/Gijela/git-analyze/compare/{base}...{head}",
    baseLabel: "Gijela:faeture/v1",
    headLabel: "Gijela:main",
    commentUrl: "https://api.github.com/repos/Gijela/git-analyze/issues/2/comments", // 从 _links.comments.href 中获取
    reviewCommentsUrl: "https://api.github.com/repos/Gijela/git-analyze/pulls/2/comments", // 从 _links.review_comments.href 中获取
    lastCommitSha: "758077d717ff0ab82ad40ef37b7790c60b22cc70", // commits[commits.length - 1].sha
  })
  console.warn("🚀 ~ step:", step)
  console.info("🚀 ~ combinedContextList:", combinedContextList)
  console.info("🚀 ~ diffsData:", diffsData)

  const [mockMessages, setMockMessages] = useState([
    { id: 1, type: "user", content: "Hi, I need help with the project." },
    { id: 2, type: "agent", content: "Sure, I can help. What specific aspect do you need assistance with?" },
  ]);

  // 定义每个步骤的人类消息
  const userMessagesForSteps = [
    "请获取 Diff 信息。",
    "请处理 Diff 实体。",
    "请构建代码知识图谱。",
    "请生成上下文列表。",
    "请执行代码审查。"
  ];

  // 定义每个步骤的AI解释
  const agentMessagesForSteps = [
    "好的，正在获取 Diff 信息。这一步将帮助我们了解代码变更的具体内容和范围。",
    "好的，正在处理 Diff 实体。这一步将提取出代码变更中的关键实体，便于后续分析。",
    "好的，正在构建代码知识图谱。这一步将帮助我们可视化代码结构和关系，便于理解代码的整体架构。",
    "好的，正在生成上下文列表。这一步将整合相关信息，为代码审查提供更全面的背景。",
    "好的，正在执行代码审查。这一步将对代码变更进行详细审查，确保代码质量和功能正确性。"
  ];

  // 定义每个步骤完成的AI消息
  const completionMessagesForSteps = [
    "Diff 信息获取完成。",
    "Diff 实体处理完成。",
    "代码知识图谱构建完成。",
    "上下文列表生成完成。",
    "代码审查完成。"
  ];

  // 监听步骤变化前，添加用户消息
  useEffect(() => {
    if (step > 0) {
      const completionMessage = {
        id: mockMessages.length + 1,
        type: "agent",
        content: completionMessagesForSteps[step - 1],
      };
      const userMessage = {
        id: mockMessages.length + 2,
        type: "user",
        content: userMessagesForSteps[step],
      };
      setMockMessages((prevMessages) => [...prevMessages, completionMessage, userMessage]);

      // 自动选择与当前步骤对应的团队成员
      const currentMember = teamMembers.find(m => m.step === step);
      if (currentMember) {
        setSelectedMember(currentMember.name);
      }
    }
  }, [step]);

  // 监听步骤变化后，添加AI消息
  useEffect(() => {
    if (step > 0) {
      const agentMessage = {
        id: mockMessages.length + 1,
        type: "agent",
        content: `好的，正在切换到步骤: ${stepTitles[step]}。这个步骤的主要任务是...`, // 这里可以详细描述步骤内容
      };
      setMockMessages((prevMessages) => [...prevMessages, agentMessage]);
    }
  }, [step]);

  // 计算进度百分比
  const progressPercentage = ((step + 1) / 5) * 100

  // 定义步骤标题
  const stepTitles = [
    "获取 Diff 信息",
    "处理 Diff 实体",
    "构建代码知识图谱",
    "生成上下文列表",
    "执行代码审查"
  ]

  // 重新定义团队成员，增加更详细的数据展示
  const teamMembers = [
    {
      name: "Collector",
      role: "Diff 收集者",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Collector",
      step: 0,
      renderData: (diffsData: any) => (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <GitBranch className="h-4 w-4" />
            <span className="text-sm font-medium">变更概览</span>
          </div>
          {diffsData?.files?.map((file: any, index: number) => (
            <Collapsible key={index} className="space-y-2">
              <Alert>
                <CollapsibleTrigger className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    <AlertTitle className="text-left">{file.filename}</AlertTitle>
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </CollapsibleTrigger>
                <AlertDescription>
                  <div className="text-sm mt-2">
                    <p>状态: {file.status}</p>
                    <p>添加: +{file.additions} 删除: -{file.deletions}</p>
                  </div>
                </AlertDescription>
                <CollapsibleContent className="mt-4">
                  <Card>
                    <CardContent className="p-4">
                      <pre className="text-sm whitespace-pre-wrap overflow-auto max-h-[300px] bg-muted p-2 rounded-md">
                        {file.patch}
                      </pre>
                    </CardContent>
                  </Card>
                </CollapsibleContent>
              </Alert>
            </Collapsible>
          ))}
        </div>
      )
    },
    {
      name: "Analyzer",
      role: "实体分析师",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Analyzer",
      step: 1,
      renderData: (diffsData: any, _, diffEntityObj: any) => (
        <div className="space-y-4">
          <Alert>
            <AlertTitle>实体分析结果</AlertTitle>
            <AlertDescription>
              <div className="text-sm mt-2">
                <p>分析的文件数: {diffsData?.files?.length || 0}</p>
                <p>总变更行数: {diffsData?.files?.reduce((acc: number, file: any) => acc + file.changes, 0) || 0}</p>
              </div>
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FileCode className="h-4 w-4" />
              <span className="text-sm font-medium">提取的实体</span>
            </div>
            {diffEntityObj?.entityList?.map((entity: any, index: number) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <h4 className="text-sm font-medium mb-2">{entity.file_path}</h4>
                  <div className="flex flex-wrap gap-2">
                    {entity.entities.map((item: string, i: number) => (
                      <Badge key={i} variant="secondary">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {diffEntityObj?.filteredSummary && (
            <Alert>
              <AlertTitle>变更摘要</AlertTitle>
              <AlertDescription>
                <p className="text-sm mt-2 whitespace-pre-wrap">
                  {diffEntityObj.filteredSummary}
                </p>
              </AlertDescription>
            </Alert>
          )}
        </div>
      )
    },
    {
      name: "Architect",
      role: "知识图谱架构师",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Architect",
      step: 2,
      renderData: (_, __, ___, codeKnowledgeGraph: any) => {
        const { nodes, edges } = processKnowledgeGraph(codeKnowledgeGraph);

        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Network className="h-4 w-4" />
              <span className="text-sm font-medium">代码知识图谱</span>
            </div>

            {/* 知识图谱可视化 */}
            <Card>
              <CardContent className="p-4">
                <div style={{ height: '500px' }}>
                  <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodeClick={(_, node) => setSelectedNode(node)}
                    fitView
                  >
                    <Background />
                    <Controls />
                    <MiniMap />
                  </ReactFlow>
                </div>
              </CardContent>
            </Card>

            {/* 节点详情对话框 */}
            <Dialog open={!!selectedNode} onOpenChange={() => setSelectedNode(null)}>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>节点详情</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-1">类型</h4>
                    <Badge variant="secondary">{selectedNode?.data?.type}</Badge>
                  </div>
                  {selectedNode?.data?.implementation && (
                    <div>
                      <h4 className="text-sm font-medium mb-1">实现代码</h4>
                      <Card>
                        <CardContent className="p-4">
                          <pre className="text-sm whitespace-pre-wrap overflow-auto max-h-[300px] bg-muted p-2 rounded-md">
                            {selectedNode.data.implementation}
                          </pre>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>

            {/* 图谱统计信息 */}
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm font-medium">节点数量</div>
                  <div className="text-2xl font-bold mt-1">{nodes.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm font-medium">关系数量</div>
                  <div className="text-2xl font-bold mt-1">{edges.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm font-medium">类型统计</div>
                  <div className="text-2xl font-bold mt-1">
                    {new Set(nodes.map(n => n.data.type)).size}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 完整数据查看按钮 */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  查看原始数据
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl h-[80vh]">
                <DialogHeader>
                  <DialogTitle>知识图谱原始数据</DialogTitle>
                </DialogHeader>
                <div className="flex-1 overflow-auto">
                  <pre className="text-sm whitespace-pre-wrap">
                    {JSON.stringify(codeKnowledgeGraph, null, 2)}
                  </pre>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        );
      }
    },
    {
      name: "Contextualizer",
      role: "上下文整合者",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Contextualizer",
      step: 3,
      renderData: (_, combinedContextList: string[]) => combinedContextList.map((context, index) => (
        <Card key={index}>
          <CardContent className="p-4">
            <pre className="text-sm whitespace-pre-wrap overflow-auto max-h-[300px]">
              {context}
            </pre>
          </CardContent>
        </Card>
      ))
    },
    {
      name: "Reviewer",
      role: "代码审查员",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Reviewer",
      step: 4,
      renderData: () => (
        <div className="space-y-4">
          <Alert>
            <AlertTitle>代码审查完成</AlertTitle>
            <AlertDescription>
              <div className="text-sm mt-2">
                <p>代码审查已完成，评论已发布到 GitHub</p>
              </div>
            </AlertDescription>
          </Alert>

          {/* 展示被评论的文件及评论内容 */}
          {reviewData?.comments?.map((comment: any, index: number) => (
            <Collapsible key={index} className="space-y-2">
              <Alert>
                <CollapsibleTrigger className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <FileCode className="h-4 w-4" />
                    <AlertTitle className="text-left">{comment.filePath}</AlertTitle>
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </CollapsibleTrigger>
                <AlertDescription>
                  <div className="text-sm mt-2">
                    <p>评论内容:</p>
                    <p className="text-sm text-muted-foreground">{comment.content}</p>
                  </div>
                </AlertDescription>
                <CollapsibleContent className="mt-4">
                  <Card>
                    <CardContent className="p-4">
                      <pre className="text-sm whitespace-pre-wrap overflow-auto max-h-[300px] bg-muted p-2 rounded-md">
                        {comment.details}
                      </pre>
                    </CardContent>
                  </Card>
                </CollapsibleContent>
              </Alert>
            </Collapsible>
          ))}

          {/* 展示整个 PR 的总体总结 */}
          {reviewData?.summary && (
            <Alert>
              <AlertTitle>PR 总结</AlertTitle>
              <AlertDescription>
                <p className="text-sm mt-2 whitespace-pre-wrap">
                  {reviewData.summary}
                </p>
              </AlertDescription>
            </Alert>
          )}
        </div>
      )
    },
  ]

  // 修改获取当前选中成员的数据渲染函数，传入更多参数
  const getCurrentMemberContent = () => {
    const currentMember = teamMembers.find(m => m.name === selectedMember)
    if (!currentMember) return null

    return currentMember.renderData(
      diffsData,
      combinedContextList,
      diffEntityObj, // 从 useAgents 中获取
      codeKnowledgeGraph // 从 useAgents 中获取
    )
  }

  // 添加知识图谱数据处理函数
  const processKnowledgeGraph = (codeKnowledgeGraph: any) => {
    if (!codeKnowledgeGraph?.nodes || !codeKnowledgeGraph?.edges) {
      return { nodes: [], edges: [] };
    }

    const nodes: Node[] = codeKnowledgeGraph.nodes.map((node: any) => {
      const id = node.id.split('#').pop() || node.id;
      const filePath = node.filePath.split('/').pop() || node.filePath;

      return {
        id: node.id,
        position: { x: Math.random() * 500, y: Math.random() * 500 }, // 实际项目中应该使用布局算法
        data: {
          label: (
            <div className="bg-background p-2 rounded-md border shadow-sm">
              <div className="font-medium text-sm">{id}</div>
              <div className="text-xs text-muted-foreground">{filePath}</div>
              <div className="text-xs text-muted-foreground">{node.type}</div>
            </div>
          ),
          type: node.type,
          implementation: node.implementation
        },
        type: 'default',
      };
    });

    const edges: Edge[] = codeKnowledgeGraph.edges.map((edge: any) => ({
      id: `${edge.source}-${edge.target}`,
      source: edge.source,
      target: edge.target,
      label: edge.type,
      type: 'smoothstep',
      animated: true,
    }));

    return { nodes, edges };
  };

  return (
    <div className="flex h-full w-full">
      {/* 左侧对话区域 */}
      <div className="w-[320px] border-r flex flex-col">
        {/* 对话历史列表 */}
        <ScrollArea className="flex-1 px-4 py-6">
          <div className="space-y-4">
            {mockMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <Card className={`max-w-[85%] ${msg.type === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                  <CardContent className="p-3">
                    <p className="text-sm">{msg.content}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* 底部输入框 */}
        <div className="border-t p-4 bg-background">
          <div className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1"
            />
            <Button size="icon" className="shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* 右侧内容区域 */}
      <div className="flex-1 flex flex-col">
        {/* 团队信息和成员列表 */}
        <div className="border-b bg-card">
          {/* 团队信息 */}
          <div className="px-4 py-2 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-muted-foreground"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17 20H22V18C22 16.3431 20.6569 15 19 15C18.0444 15 17.1931 15.4468 16.6438 16.1429M17 20H7M17 20V18C17 17.3438 16.8736 16.717 16.6438 16.1429M7 20H2V18C2 16.3431 3.34315 15 5 15C5.95561 15 6.80686 15.4468 7.35625 16.1429M7 20V18C7 17.3438 7.12642 16.717 7.35625 16.1429M7.35625 16.1429C8.0935 14.301 9.89482 13 12 13C14.1052 13 15.9065 14.301 16.6438 16.1429M15 7C15 8.65685 13.6569 10 12 10C10.3431 10 9 8.65685 9 7C9 5.34315 10.3431 4 12 4C13.6569 4 15 5.34315 15 7ZM21 10C21 11.1046 20.1046 12 19 12C17.8954 12 17 11.1046 17 10C17 8.89543 17.8954 8 19 8C20.1046 8 21 8.89543 21 10ZM7 10C7 11.1046 6.10457 12 5 12C3.89543 12 3 11.1046 3 10C3 8.89543 3.89543 8 5 8C6.10457 8 7 8.89543 7 10Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-sm text-muted-foreground">分析团队</span>
            <span className="text-sm text-muted-foreground">{teamMembers.length}</span>
          </div>

          {/* 成员列表 */}
          <div className="flex px-4 py-2 gap-2">
            {teamMembers.map((member) => (
              <button
                key={member.name}
                onClick={() => setSelectedMember(member.name)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                  ${selectedMember === member.name ?
                    "bg-primary text-primary-foreground shadow-md scale-[1.02]" :
                    step >= member.step ? "hover:bg-accent/40 hover:scale-[1.02]" : "opacity-50 cursor-not-allowed"
                  }
                `}
                disabled={step < member.step}
              >
                <Avatar className="h-9 w-9 border-2 border-background">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback>{member.name[0]}</AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <div className="text-sm font-medium leading-none mb-1">{member.name}</div>
                  <div className={`text-xs ${selectedMember === member.name ?
                    "text-primary-foreground/80" :
                    "text-muted-foreground"
                    }`}
                  >
                    {member.role}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 数据展示区域 */}
        <ScrollArea className="flex-1">
          <div className="p-6 space-y-6">
            {/* 进度指示器 */}
            {/* <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">分析进度</h3>
                <Badge variant={step === 4 ? "success" : "secondary"}>
                  {step === 4 ? "完成" : "进行中"}
                </Badge>
              </div>
              <Progress value={progressPercentage} />
              <div className="text-sm text-muted-foreground">
                当前步骤: {stepTitles[step]}
              </div>
            </div> */}

            {/* 数据展示区 */}
            <div className="space-y-4">
              {getCurrentMemberContent() || (
                <div className="text-center py-8 text-muted-foreground">
                  {step < teamMembers.find(m => m.name === selectedMember)?.step
                    ? "该阶段尚未开始..."
                    : "暂无数据"}
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
