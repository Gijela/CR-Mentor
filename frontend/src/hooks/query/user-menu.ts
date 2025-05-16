import { queryOptions, useSuspenseQuery } from "@tanstack/react-query"
import {
  BookMinus,
  BookOpen,
  Bot,
  ChartNoAxesCombined,
  Gauge,
  GitPullRequest,
  Orbit,
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
    title: "dashboard",
    icon: Gauge,
    to: "/dashboard",
    // children: [
    //   {
    //     title: "overview",
    //     label: "128",
    //     icon: Gauge,
    //     to: "/dashboard/overview",
    //   },
    //   {
    //     title: "analysis",
    //     label: "9",
    //     icon: ChartNoAxesCombined,
    //     to: "/dashboard/analysis",
    //   },
    //   {
    //     title: "workplace",
    //     icon: Orbit,
    //     to: "/dashboard/workplace",
    //   },
    // ],
  },
  // {
  //   title: "forms",
  //   label: "12",
  //   icon: MessagesSquare,
  //   to: "/form",
  //   children: [
  //     {
  //       title: "basic_form",
  //       label: "23",
  //       icon: ArchiveX,
  //       to: "/form/basic-form",
  //     },
  //     {
  //       title: "step_form",
  //       icon: Trash2,
  //       to: "/form/step-form",
  //     },
  //     {
  //       title: "advanced_form",
  //       icon: Archive,
  //       to: "/form/advanced-form",
  //     },
  //   ],
  // },
  // {
  //   title: "charts",
  //   icon: ChartLine,
  //   to: "/charts",
  //   children: [
  //     {
  //       title: "area_chart",
  //       icon: ChartArea,
  //       to: "/charts/area-chart",
  //     },
  //     {
  //       title: "bar_chart",
  //       icon: ChartBar,
  //       to: "/charts/bar-chart",
  //     },
  //     {
  //       title: "line_chart",
  //       icon: ChartLine,
  //       to: "/charts/line-chart",
  //     },
  //     {
  //       title: "pie_chart",
  //       icon: ChartPie,
  //       to: "/charts/pie-chart",
  //     },
  //     {
  //       title: "radar_chart",
  //       icon: Radar,
  //       to: "/charts/radar-chart",
  //     },
  //     {
  //       title: "radial_chart",
  //       icon: Radical,
  //       to: "/charts/radial-chart",
  //     },
  //     {
  //       title: "tooltip_chart",
  //       icon: CircleDot,
  //       to: "/charts/tooltip",
  //     },
  //   ],
  // },
  // {
  //   title: "settings",
  //   icon: Settings,
  //   to: "/settings",
  // },
  // {
  //   title: "system",
  //   icon: Info,
  //   to: "/system",
  //   children: [
  //     {
  //       title: "about",
  //       icon: Info,
  //       to: "/system/about",
  //     },
  //   ],
  // },
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
    title: "Code Review",
    icon: Bot,
    to: "/agents",
  },
  {
    title: "Knowledge Base Edit",
    label: "9",
    hide: true,
    icon: ChartNoAxesCombined,
    to: "/knowledgeBase/edit",
  },
  {
    title: "ChatGPT",
    icon: Bot,
    to: "/chatgpt",
  },
  {
    title: "test",
    icon: Bot,
    to: "/test",
  },
] as const
