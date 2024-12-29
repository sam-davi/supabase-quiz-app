"use client";

import * as React from "react";
import {
  BookOpen,
  BookOpenCheck,
  Bot,
  ChartNoAxesCombined,
  MapPinned,
  Settings2,
  SquareTerminal,
  Users,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: ChartNoAxesCombined,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Quiz Scores",
      url: "#",
      icon: BookOpenCheck,
      items: [
        {
          title: "Round Stats",
          url: "#",
        },
        {
          title: "Add Quiz Night",
          url: "#",
        },
      ],
    },
    {
      title: "Quiz Locations",
      url: "#",
      icon: MapPinned,
      items: [
        {
          title: "Rate Locations",
          url: "#",
        },
        {
          title: "Add Location",
          url: "#",
        },
      ],
    },
    {
      title: "Quiz Team",
      url: "#",
      icon: Users,
      items: [
        {
          title: "Review Team Requests",
          url: "#",
        },
        {
          title: "Invite Members",
          url: "#",
        },
      ],
    },
  ],
};

export function AppSidebar({
  teams,
  ...props
}: {
  teams: Promise<{ slug: string | null; name: string }[]>;
} & React.ComponentProps<typeof Sidebar>) {
  const teamsData = React.use(teams);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={teamsData} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
