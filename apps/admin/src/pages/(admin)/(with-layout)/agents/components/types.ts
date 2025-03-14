import { ReactNode } from "react";

// 聊天消息类型
export type Message = {
  id: number;
  type: string;
  content: string;
};

// 团队成员类型
export type TeamMember = {
  name: string;
  role: string;
  avatar: string;
  step: number;
  renderData: (diffsData: any, combinedContextList?: any, diffEntityObj?: any, codeKnowledgeGraph?: any) => ReactNode;
};
