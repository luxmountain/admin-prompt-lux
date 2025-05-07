import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import routes from "@/router";
import { ReactNode } from "react";
import { useLocation } from "react-router-dom"; // ✅ thay usePathname

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation(); // ✅
  const pathname = location.pathname;

  const currentRoute = routes
  .sort((a, b) => b.path.length - a.path.length)
  .find((route) => pathname.startsWith(route.path));

  const title = currentRoute?.label || "Documents";

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader title={title} />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {children}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
