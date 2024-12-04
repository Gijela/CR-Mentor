import PullRequest from "@/components/PullRequest";
import KnowledgeBaseIcon from "./icons/KnowledgeBaseIcon";
import PullRequestIcon from "./icons/PullRequestIcon";
import RepositoriesIcon from "./icons/RepositoriesIcon";
import Repositories from "@/components/Repository";
import KnowledgeBase from "@/components/KnowledgeBase";
import ChatGPT from "../ChatGPT";
import ChatGPTIcon from "./icons/ChatgptIcon";

export const sidebarItems = [
  // {
  //   key: "dashboard",
  //   label: "Dashboard",
  //   icon: <DashboardIcon />,
  //   defaultOpen: true,
  //   children: [
  //     {
  //       key: "main",
  //       label: "Main",
  //       component: <Home />,
  //     },
  //     {
  //       key: "analytics",
  //       label: "Analytics",
  //       component: <Analytics />,
  //     },
  //     {
  //       key: "fintech",
  //       label: "Fintech",
  //       component: <Home />,
  //     },
  //   ],
  // },
  {
    key: "pull-request",
    label: "Pull Request",
    icon: <PullRequestIcon />,
    // badge: 4,
    component: <PullRequest />,
  },
  // {
  //   key: "share-bot",
  //   label: "Share Bot",
  //   icon: <ShareBotIcon />,
  //   component: <ShareBot />,
  // },
  {
    key: "repositories",
    label: "Repository",
    icon: <RepositoriesIcon />,
    component: <Repositories />,
  },
  {
    key: "knowledge-base",
    label: "Knowledge Base",
    icon: <KnowledgeBaseIcon />,
    component: <KnowledgeBase />,
  },
  {
    key: "chatgpt",
    label: "ChatGPT",
    icon: <ChatGPTIcon />,
    component: <ChatGPT />,
  },
];
