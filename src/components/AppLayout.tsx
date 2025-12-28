import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";

const AppLayout = () => {
  return (
    <SidebarProvider>
      <div className="min-h-svh flex w-full bg-background">
        <AppSidebar />
        <SidebarInset>
          <header className="flex items-center justify-between border-b border-border px-4 py-2">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <span className="text-sm font-semibold tracking-wide">AMPNM Network Monitor</span>
            </div>
          </header>
          <main className="flex-1 px-4 py-4">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
