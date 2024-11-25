import DashboardIcon from "./icons/DashboardIcon";
import KnowledgeBaseIcon from "./icons/KnowledgeBaseIcon";
import PullRequestIcon from "./icons/PullRequestIcon";
import RepositoriesIcon from "./icons/RepositoriesIcon";
import ShareBotIcon from "./icons/ShareBotIcon";

export const sidebarItems = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: <DashboardIcon />,
    children: [
      {
        key: "main",
        label: "Main",
      },
      {
        key: "analytics",
        label: "Analytics",
      },
      {
        key: "fintech",
        label: "Fintech",
      },
    ],
  },
  {
    key: "pull-request",
    label: "Pull Request",
    icon: <PullRequestIcon />,
    badge: 4,
  },
  {
    key: "share-bot",
    label: "Share Bot",
    icon: <ShareBotIcon />,
  },
  {
    key: "repositories",
    label: "Repositories",
    icon: <RepositoriesIcon />,
  },
  {
    key: "knowledge-base",
    label: "Knowledge Base",
    icon: <KnowledgeBaseIcon />,
  },
];
