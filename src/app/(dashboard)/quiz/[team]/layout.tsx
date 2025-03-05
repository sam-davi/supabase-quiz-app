import { AppSidebar } from "@/components/app-sidebar";
import NavBreadcrumbs from "@/components/nav-breadcrumbs";
import { ThemeSwitcher } from "@/components/theme-switcher";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { getUserProfileAction } from "@/server/actions/profiles";
import { getTeamsAction } from "@/server/actions/teams";
import { Separator } from "@radix-ui/react-separator";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar teams={getTeamsAction()} user={getUserProfileAction()} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <NavBreadcrumbs />
          </div>
          <div className="flex items-center gap-2 px-4">
            <ThemeSwitcher />
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
