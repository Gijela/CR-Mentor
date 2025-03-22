import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import useAgents from "@/hooks/useAgents";

import { AnalyzerView } from "./components/AnalyzerView";
import { ArchitectView } from "./components/ArchitectView";
// 导入抽离出去的组件
import { ChatPanel } from "./components/ChatPanel";
import { CollectorView } from "./components/CollectorView";
import { ContextualizerView } from "./components/ContextualizerView";
import { ReviewerView } from "./components/ReviewerView";
import { TeamMembersList } from "./components/TeamMembersList";

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
  renderData: (
    diffsData: any,
    combinedContextList?: any,
    diffEntityObj?: any,
    codeKnowledgeGraph?: any
  ) => React.ReactNode;
};

// 主组件
export function Component() {
  const [selectedMember, setSelectedMember] = useState<string>("Collector");
  const [message, setMessage] = useState("");
  const [mockMessages, setMockMessages] = useState<Message[]>([
    { id: 1, type: "user", content: "Hi, I need help with the project." },
    {
      id: 2,
      type: "agent",
      content:
        "Sure, I can help. What specific aspect do you need assistance with?",
    },
  ]);
  const [searchParams] = useSearchParams();
  const diffInfo = JSON.parse(searchParams.get("diffInfo") || "{}");
  console.log("🚀 ~ Component ~ diffInfo:", diffInfo);

  const {
    diffsData,
    combinedContextList,
    step,
    diffEntityObj,
    codeKnowledgeGraph,
    reviewData,
  } = useAgents(
    diffInfo
    // mock test
    // {
    //   githubName: "Gijela",
    //   compareUrl: "https://api.github.com/repos/Gijela/git-analyze/compare/{base}...{head}",
    //   baseLabel: "Gijela:faeture/v1",
    //   headLabel: "Gijela:main",
    //   commentUrl: "https://api.github.com/repos/Gijela/git-analyze/issues/2/comments", // 从 _links.comments.href 中获取
    //   reviewCommentsUrl: "https://api.github.com/repos/Gijela/git-analyze/pulls/2/comments", // 从 _links.review_comments.href 中获取
    //   repoUrl: "https://github.com/Gijela/git-analyze",
    //   sourceBranch: "main",
    // }
  );

  // 定义每个步骤的人类消息
  const userMessagesForSteps = [
    "Please fetch the Diff information.",
    "Please process the Diff entities.",
    "Please build the code knowledge graph.",
    "Please generate the context list.",
    "Please perform code review.",
  ];

  // 定义每个步骤完成的AI消息
  const completionMessagesForSteps = [
    "Diff information fetched successfully.",
    "Diff entities processed successfully.",
    "Code knowledge graph built successfully.",
    "Context list generated successfully.",
    "Code review completed successfully.",
  ];

  // 定义步骤标题
  const stepTitles = [
    "Fetch Diff Information",
    "Process Diff Entities",
    "Build Code Knowledge Graph",
    "Generate Context List",
    "Perform Code Review",
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
      setMockMessages(
        (prevMessages) =>
          [...prevMessages, completionMessage, userMessage] as Message[]
      );

      // 没有手动选择过角色，则自动选择与当前步骤对应的团队成员
      if (!hasSelectedRole) {
        const currentMember = teamMembers.find((m) => m.step === step);
        if (currentMember) {
          setSelectedMember(currentMember.name);
        }
      }
    }
  }, [step]);

  const [hasSelectedRole, setHasSelectRole] = useState(false); // 是否手动选择过角色

  // 监听步骤变化后，添加AI消息
  useEffect(() => {
    if (step > 0) {
      const agentMessage = {
        id: mockMessages.length + 1,
        type: "agent",
        content: `Okay, switching to step: ${stepTitles[step]}. The main task of this step is...`, // Here you can describe the step content in detail
      };
      setMockMessages((prevMessages) => [...prevMessages, agentMessage]);
    }
  }, [step]);

  // 定义团队成员
  const teamMembers: TeamMember[] = [
    {
      name: "Collector",
      role: "Diff Collector",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Collector",
      step: 0,
      renderData: (diffsData) => <CollectorView diffsData={diffsData} />,
    },
    {
      name: "Analyzer",
      role: "Entity Analyst",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Analyzer",
      step: 1,
      renderData: (diffsData, _, diffEntityObj) => (
        <AnalyzerView diffsData={diffsData} diffEntityObj={diffEntityObj} />
      ),
    },
    {
      name: "Architect",
      role: "Knowledge Graph Architect",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Architect",
      step: 2,
      renderData: (_, __, ___, codeKnowledgeGraph) => (
        <ArchitectView codeKnowledgeGraph={codeKnowledgeGraph} />
      ),
    },
    {
      name: "Contextualizer",
      role: "Context Integrator",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Contextualizer",
      step: 3,
      renderData: (_, combinedContextList) => (
        <ContextualizerView combinedContextList={combinedContextList} />
      ),
    },
    {
      name: "Reviewer",
      role: "Code Reviewer",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Reviewer",
      step: 4,
      renderData: () => <ReviewerView reviewData={reviewData} />,
    },
  ];

  // 获取当前选中成员的数据渲染函数
  const getCurrentMemberContent = () => {
    const currentMember = teamMembers.find((m) => m.name === selectedMember);
    if (!currentMember) return null;

    return currentMember.renderData(
      diffsData,
      combinedContextList,
      diffEntityObj,
      codeKnowledgeGraph
    );
  };

  return (
    <div
      className="flex w-full"
      style={{ height: window.innerHeight - extraHeight }}
    >
      {/* 左侧对话区域 */}
      <ChatPanel
        messages={mockMessages}
        message={message}
        setMessage={setMessage}
      />

      {/* 右侧内容区域 */}
      <div className="flex-1 flex flex-col">
        {/* 团队成员列表 - 固定在顶部 */}
        <div className="flex-none">
          <TeamMembersList
            teamMembers={teamMembers}
            selectedMember={selectedMember}
            setSelectedMember={setSelectedMember}
            step={step}
            setHasSelectedRole={setHasSelectRole}
          />
        </div>

        {/* 数据展示区域 - 可滚动 */}
        <div className="flex-1 overflow-y-auto">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-6">
              {/* 数据展示区 */}
              <div className="space-y-4">
                {getCurrentMemberContent() || (
                  <div className="text-center py-8 text-muted-foreground">
                    {step <
                    (teamMembers.find((m) => m.name === selectedMember)?.step ||
                      Infinity)
                      ? "This step has not started yet..."
                      : "No data"}
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
