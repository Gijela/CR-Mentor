import { env } from "@env";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Command, Send } from "lucide-react";
import * as React from "react";
import { Link } from "react-router-dom";

import { NavMain } from "@/components/nav-sidebar/nav-main";
import { NavSecondary } from "@/components/nav-sidebar/nav-secondary";
import { NavUser } from "@/components/nav-sidebar/nav-user";
import { useNavMenu } from "@/hooks/query/user-menu";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import type { IChildrenMenuItem, IMenu } from "@/schema/menu";

const navSecondary = [
  {
    title: "Feedback",
    url: "https://github.com/Gijela/CR-Mentor/issues",
    icon: Send,
    external: true,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: menus } = useNavMenu();

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-2">
              <SidebarMenuButton size="lg" asChild>
                <Link to="/quickStart">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    {/* <Command className="size-4" /> */}
                    <img src="/logo.gif" alt="logo" className="size-8" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">CR-Mentor</span>
                    <span className="truncate text-xs">Enterprise</span>
                  </div>
                </Link>
              </SidebarMenuButton>

              <div className="flex-shrink-0 text-[blue]">
                <SignedOut>
                  <SignInButton />
                </SignedOut>
                <SignedIn>
                  <div className="mt-[6px]">
                    <UserButton />
                  </div>
                </SignedIn>
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          items={menus
            .filter((menu: IMenu & { hide?: boolean }) => !menu.hide)
            .map((menu: IMenu & { hide?: boolean }) => ({
              ...menu,
              children: menu.children?.filter(
                (child: IChildrenMenuItem & { hide?: boolean }) => !child.hide
              ),
            }))}
        />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      {/* <SidebarFooter>
        <NavUser />
      </SidebarFooter> */}
    </Sidebar>
  );
}
