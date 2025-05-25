import { queryOptions, useSuspenseQuery } from "@tanstack/react-query"
import {
  BookMinus,
  BookOpen,
  Bot,
  ChartNoAxesCombined,
  Gauge,
  GitPullRequest,
  TrendingUp,
} from "lucide-react"

import type { IChildrenMenuItem, IMenu } from "@/schema/menu"

// 为子菜单项也添加hide属性
export interface IExtendedChildrenMenuItem extends IChildrenMenuItem {
  hide?: boolean
}

export interface IExtendedMenu extends IMenu {
  hide?: boolean
  children?: IExtendedChildrenMenuItem[]
}

export const queryNavMenu = () => queryOptions({
  queryKey: ["nav-menu"],
  queryFn: async () => mockMenu(),
})

export function useNavMenu() {
  return useSuspenseQuery(queryNavMenu())
}

async function mockMenu(): Promise<IMenu[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(menus)
    }, 1000)
  })
}

// 使用新的接口类型
export const menus: IExtendedMenu[] = [
  {
    title: "Quick Start",
    icon: TrendingUp,
    to: "/quickStart",
  },
  {
    title: "Dashboard",
    icon: Gauge,
    to: "/dashboard",
  },
  {
    title: "Agent Studio",
    icon: Bot,
    to: "/studio",
  },
  {
    title: "Repository",
    icon: BookMinus,
    to: "/repository",
  },
  {
    title: "Pull Request",
    icon: GitPullRequest,
    to: "/pullRequest",
  },
  {
    title: "Knowledge Base",
    icon: BookOpen,
    to: "/knowledgeBase/list",
  },
  {
    title: "Knowledge Base Edit",
    label: "9",
    hide: true,
    icon: ChartNoAxesCombined,
    to: "/knowledgeBase/edit",
  },
  // {
  //   title: "Code Review",
  //   icon: Bot,
  //   to: "/agents",
  // },
  // {
  //   title: "test",
  //   icon: Bot,
  //   to: "/test",
  // },
] as const
