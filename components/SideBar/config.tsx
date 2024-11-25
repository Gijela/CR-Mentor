import PullRequest from "@/components/PullRequest";
import DashboardIcon from "./icons/DashboardIcon";
import KnowledgeBaseIcon from "./icons/KnowledgeBaseIcon";
import PullRequestIcon from "./icons/PullRequestIcon";
import RepositoriesIcon from "./icons/RepositoriesIcon";
import ShareBotIcon from "./icons/ShareBotIcon";
import ShareBot from "@/components/ShareBot";
import Repositories from "@/components/Repo";
import KnowledgeBase from "@/components/KnowledgeBase";
import Home from "@/components/dashboard/Home";
import Analytics from "@/components/dashboard/Analytics";

export const sidebarItems = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: <DashboardIcon />,
    defaultOpen: true,
    children: [
      {
        key: "main",
        label: "Main",
        component: <Home />,
      },
      {
        key: "analytics",
        label: "Analytics",
        component: <Analytics />,
      },
      {
        key: "fintech",
        label: "Fintech",
        component: <Home />,
      },
    ],
  },
  {
    key: "pull-request",
    label: "Pull Request",
    icon: <PullRequestIcon />,
    badge: 4,
    component: <PullRequest />,
  },
  {
    key: "share-bot",
    label: "Share Bot",
    icon: <ShareBotIcon />,
    component: <ShareBot />,
  },
  {
    key: "repositories",
    label: "Repositories",
    icon: <RepositoriesIcon />,
    component: <Repositories />,
  },
  {
    key: "knowledge-base",
    label: "Knowledge Base",
    icon: <KnowledgeBaseIcon />,
    component: <KnowledgeBase />,
  },
];
