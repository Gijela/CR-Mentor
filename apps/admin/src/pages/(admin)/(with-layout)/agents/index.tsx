import { ScrollArea } from "@repo/ui/scroll-area"
import { useState, useEffect } from "react"

import useAgents from "@/hooks/useAgents"
// 导入抽离出去的组件
import { ChatPanel } from "./components/ChatPanel"
import { TeamMembersList } from "./components/TeamMembersList"
import { CollectorView } from "./components/CollectorView"
import { AnalyzerView } from "./components/AnalyzerView"
import { ArchitectView } from "./components/ArchitectView"
import { ContextualizerView } from "./components/ContextualizerView"
import { ReviewerView } from "./components/ReviewerView"

// 2 * 8px是上下margin, 还有64px的header高度
export const extraHeight = 2 * 8 + 64;

// 团队成员列表高度
export const teamHeight = 76 + 36;

// 聊天消息类型
type Message = {
  id: number;
  type: string;
  content: string;
};

// 团队成员类型
type TeamMember = {
  name: string;
  role: string;
  avatar: string;
  step: number;
  renderData: (diffsData: any, combinedContextList?: any, diffEntityObj?: any, codeKnowledgeGraph?: any) => React.ReactNode;
};

// 主组件
export function Component() {
  const [selectedMember, setSelectedMember] = useState<string>("Collector")
  const [message, setMessage] = useState("")
  const [mockMessages, setMockMessages] = useState<Message[]>([
    { id: 1, type: "user", content: "Hi, I need help with the project." },
    { id: 2, type: "agent", content: "Sure, I can help. What specific aspect do you need assistance with?" },
  ]);

  const { diffsData, combinedContextList, step, diffEntityObj, codeKnowledgeGraph, reviewData } = useAgents({
    githubName: "Gijela",
    compareUrl: "https://api.github.com/repos/Gijela/git-analyze/compare/{base}...{head}",
    baseLabel: "Gijela:faeture/v1",
    headLabel: "Gijela:main",
    commentUrl: "https://api.github.com/repos/Gijela/git-analyze/issues/2/comments", // 从 _links.comments.href 中获取
    reviewCommentsUrl: "https://api.github.com/repos/Gijela/git-analyze/pulls/2/comments", // 从 _links.review_comments.href 中获取
    lastCommitSha: "758077d717ff0ab82ad40ef37b7790c60b22cc70", // commits[commits.length - 1].sha
  })

  // 定义每个步骤的人类消息
  const userMessagesForSteps = [
    "请获取 Diff 信息。",
    "请处理 Diff 实体。",
    "请构建代码知识图谱。",
    "请生成上下文列表。",
    "请执行代码审查。"
  ];

  // 定义每个步骤完成的AI消息
  const completionMessagesForSteps = [
    "Diff 信息获取完成。",
    "Diff 实体处理完成。",
    "代码知识图谱构建完成。",
    "上下文列表生成完成。",
    "代码审查完成。"
  ];

  // 定义步骤标题
  const stepTitles = [
    "获取 Diff 信息",
    "处理 Diff 实体",
    "构建代码知识图谱",
    "生成上下文列表",
    "执行代码审查"
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
        content: userMessagesForSteps[step] || "",
      };
      setMockMessages((prevMessages) => [...prevMessages, completionMessage, userMessage] as Message[]);

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

  // 定义团队成员
  const teamMembers: TeamMember[] = [
    {
      name: "Collector",
      role: "Diff 收集者",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Collector",
      step: 0,
      renderData: (diffsData) => <CollectorView diffsData={diffsData} />
    },
    {
      name: "Analyzer",
      role: "实体分析师",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Analyzer",
      step: 1,
      renderData: (diffsData, _, diffEntityObj) => <AnalyzerView diffsData={diffsData} diffEntityObj={diffEntityObj} />
    },
    {
      name: "Architect",
      role: "知识图谱架构师",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Architect",
      step: 2,
      renderData: (_, __, ___, codeKnowledgeGraph) => <ArchitectView codeKnowledgeGraph={codeKnowledgeGraph} />
    },
    {
      name: "Contextualizer",
      role: "上下文整合者",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Contextualizer",
      step: 3,
      renderData: (_, combinedContextList) => <ContextualizerView combinedContextList={combinedContextList} />
    },
    {
      name: "Reviewer",
      role: "代码审查员",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Reviewer",
      step: 4,
      renderData: () => <ReviewerView reviewData={reviewData} />
    },
  ];

  // 获取当前选中成员的数据渲染函数
  const getCurrentMemberContent = () => {
    const currentMember = teamMembers.find(m => m.name === selectedMember);
    if (!currentMember) return null;

    return currentMember.renderData(
      diffsData,
      combinedContextList,
      diffEntityObj,
      codeKnowledgeGraph
    );
  };

  return (
    <div className={'flex w-full'} style={{ height: window.innerHeight - extraHeight }}>
      {/* 左侧对话区域 */}
      <ChatPanel
        messages={mockMessages}
        message={message}
        setMessage={setMessage}
      />

      {/* 右侧内容区域 */}
      <div className='flex-1 flex flex-col'>
        {/* 团队成员列表 - 固定在顶部 */}
        <div className="flex-none">
          <TeamMembersList
            teamMembers={teamMembers}
            selectedMember={selectedMember}
            setSelectedMember={setSelectedMember}
            step={step}
          />
        </div>

        {/* 数据展示区域 - 可滚动 */}
        <div className='flex-1 overflow-y-auto'>
          <ScrollArea className="h-full">
            <div className={'p-4 space-y-6'}>
              {/* 数据展示区 */}
              <div className="space-y-4">
                {getCurrentMemberContent() || (
                  <div className="text-center py-8 text-muted-foreground">
                    {step < (teamMembers.find(m => m.name === selectedMember)?.step || Infinity)
                      ? "该阶段尚未开始..."
                      : "暂无数据"}
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
