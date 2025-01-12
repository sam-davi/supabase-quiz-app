"use client";

import * as React from "react";
import {
  BookOpenCheck,
  ChartNoAxesCombined,
  MapPinned,
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
import { useParams, usePathname } from "next/navigation";

export function AppSidebar({
  teams,
  user,
  ...props
}: {
  teams: Promise<{ slug: string | null; name: string }[]>;
  user: Promise<{
    name: string;
    email: string | null;
    avatar?: string;
  }>;
} & React.ComponentProps<typeof Sidebar>) {
  const { team }: { team: string } = useParams();
  const path = usePathname().split("/")[3] ?? "";
  const teamsData = React.use(teams);
  const userData = React.use(user);

  const navMain = [
    {
      title: "Dashboard",
      url: `/quiz/${team}`,
      icon: ChartNoAxesCombined,
      activePath: "",
      items: [
        {
          title: "Home",
          url: "#",
        },
      ],
    },
    {
      title: "Quiz Scores",
      url: `/quiz/${team}/scores`,
      icon: BookOpenCheck,
      activePath: "scores",
      items: [
        {
          title: "Quiz Nights",
          url: "#",
        },
        {
          title: "Round Stats",
          url: "/stats",
        },
        {
          title: "Add Quiz Results",
          url: "/add",
        },
      ],
    },
    {
      title: "Quiz Locations",
      url: `/quiz/${team}/locations`,
      activePath: "locations",
      icon: MapPinned,
      items: [
        {
          title: "Locations",
          url: "#",
        },
        {
          title: "Rate Locations",
          url: "/rate",
        },
        {
          title: "Add Location",
          url: "/add",
        },
      ],
    },
    {
      title: "Quiz Team",
      url: `/quiz/${team}/team`,
      activePath: "team",
      icon: Users,
      items: [
        {
          title: "Members",
          url: "#",
        },
        {
          title: "Review Team Requests",
          url: "/requests",
        },
        {
          title: "Invite Members",
          url: "/invite",
        },
      ],
    },
  ];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={teamsData} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} path={path} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
