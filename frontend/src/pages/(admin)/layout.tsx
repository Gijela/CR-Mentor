import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { CircleHelp } from "lucide-react";
import { Link, Outlet, useLocation } from "react-router-dom";

import { Icons } from "@/components/icons";
import { AppSidebar } from "@/components/nav-sidebar/app-sidebar";
import { NavBreadcrumb } from "@/components/nav-sidebar/nav-breadcrumb";
import { Search } from "@/components/search";
import { ThemeCustomizer } from "@/components/theme/theme-customizer";
import { ThemeSwitcher } from "@/components/theme/theme-switcher";
import { SIDEBAR_COOKIE_NAME } from "@/constants";

export function Component() {
  const sidebarState = localStorage.getItem(SIDEBAR_COOKIE_NAME) === "true";

  const location = useLocation();
  const hidePaddingPaths = ["/agents", "/studio"];
  const isHidePadding = hidePaddingPaths.some((path) =>
    location.pathname.includes(path)
  );

  const hideHeaderPaths = ["/studio"];
  const isHideHeader = hideHeaderPaths.some((path) =>
    location.pathname.includes(path)
  );

  return (
    <SidebarProvider defaultOpen={sidebarState} storage="local">
      <AppSidebar />
      <SidebarInset className="w-full overflow-hidden">
        {isHideHeader ? (
          <div className="h-[calc(100vh-1rem)] w-full">
            <Outlet />
          </div>
        ) : (
          <>
            <div className="sticky top-0 z-10">
              <header className="flex h-14 w-full shrink-0 items-center justify-between border-b bg-background/80 px-2 backdrop-blur-sm sm:h-16 sm:px-4">
                <div className="flex items-center gap-2">
                  <SidebarTrigger className="-ml-0.5 sm:-ml-1" />
                  <Separator
                    orientation="vertical"
                    className="mr-2 hidden h-4 sm:block"
                  />
                  <NavBreadcrumb className="hidden sm:flex" />
                </div>
                <div className="ml-auto flex flex-1 items-center space-x-2 px-2 sm:px-4 md:max-w-96 lg:max-w-lg">
                  <Search />
                  <Link
                    to="https://github.com/Gijela/CR-Mentor"
                    target="_blank"
                  >
                    <Button variant="ghost" size="icon">
                      <Icons.gitHub className="size-5" />
                    </Button>
                  </Link>
                  <Link to="https://cr-mentor.top" target="_blank">
                    <Button variant="ghost" size="icon">
                      <CircleHelp className="size-5" />
                    </Button>
                  </Link>
                  <ThemeSwitcher />
                  <ThemeCustomizer />
                </div>
              </header>
            </div>

            <ScrollArea
              className={`flex h-[calc(100vh-5rem)] flex-col gap-4 pt-0 sm:h-[calc(100vh-5rem)] ${
                isHidePadding ? "p-0" : "p-4 sm:py-6"
              }`}
            >
              <Outlet />
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </>
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}
