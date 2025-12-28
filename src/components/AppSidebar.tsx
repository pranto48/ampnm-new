import { useLocation } from "react-router-dom";
import { Map, ListTree, HelpCircle, Home } from "lucide-react";

import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Devices", url: "/devices", icon: ListTree },
  { title: "Public Map", url: "/public/map", icon: Map },
  { title: "Installation Guide", url: "/help/install", icon: HelpCircle },
];

export function AppSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <Sidebar className="border-r border-sidebar-border" collapsible="icon">
      <SidebarHeader>
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-sidebar-foreground/70">
          AMPNM
        </span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = item.url === "/" ? currentPath === "/" : currentPath.startsWith(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                      <NavLink
                        to={item.url}
                        end={item.url === "/"}
                        className="flex items-center gap-2"
                        activeClassName="font-medium"
                      >
                        <item.icon className="h-4 w-4" aria-hidden="true" />
                        <span className="truncate text-sm">{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
