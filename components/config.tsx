import type { MenuProps } from "antd";
import {
  AppstoreOutlined,
  FolderOpenOutlined,
  SettingOutlined,
} from "@ant-design/icons";

import Repositories from "@/components/repositories";
import Knowledge from "@/components/knowledge";
import Settings from "@/components/settings";

type MenuItem = Required<MenuProps>["items"][number];

export const menuItems: (MenuItem & { component?: React.ReactNode })[] = [
  {
    key: "repo",
    label: "Repositories",
    icon: <AppstoreOutlined />,
    component: <Repositories />,
  },
  {
    key: "knowledge",
    label: "Knowledge",
    icon: <FolderOpenOutlined />,
    component: <Knowledge />,
  },
  {
    key: "settings",
    label: "Settings",
    icon: <SettingOutlined />,
    component: <Settings />,
  },
];
