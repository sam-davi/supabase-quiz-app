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
  const { team }: { team: string } = useParams();
  const path = usePathname().split("/")[3] || "";
  const teamsData = React.use(teams);

  console.log(path);

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
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
