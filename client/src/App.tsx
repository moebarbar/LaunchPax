import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";

import LandingPage from "@/pages/landing";
import DashboardPage from "@/pages/dashboard";
import NewProjectPage from "@/pages/new-project";
import ProjectDetailPage from "@/pages/project-detail";
import ConnectorsPage from "@/pages/connectors";
import SettingsPage from "@/pages/settings";
import WebsitePreview from "@/pages/website-preview";
import PublishedSite from "@/pages/published-site";
import NotFound from "@/pages/not-found";

function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1 min-w-0">
          <header className="flex items-center justify-between gap-4 p-3 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <ThemeToggle />
          </header>
          <main className="flex-1 overflow-hidden flex flex-col">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function AuthenticatedRoutes() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="space-y-4 text-center">
          <Skeleton className="h-12 w-12 rounded-full mx-auto" />
          <Skeleton className="h-4 w-32 mx-auto" />
        </div>
      </div>
    );
  }

  if (!user) {
    return <LandingPage />;
  }

  return (
    <AuthenticatedLayout>
      <Switch>
        <Route path="/" component={DashboardPage} />
        <Route path="/dashboard" component={DashboardPage} />
        <Route path="/project/new" component={NewProjectPage} />
        <Route path="/project/:id" component={ProjectDetailPage} />
        <Route path="/connectors" component={ConnectorsPage} />
        <Route path="/settings" component={SettingsPage} />
        <Route component={NotFound} />
      </Switch>
    </AuthenticatedLayout>
  );
}

function AppRouter() {
  return (
    <Switch>
      {/* Public routes - accessible without auth */}
      <Route path="/preview/:token" component={WebsitePreview} />
      <Route path="/site/:projectId" component={PublishedSite} />
      {/* Auth-gated routes */}
      <Route component={AuthenticatedRoutes} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="launchpax-theme">
        <TooltipProvider>
          <Toaster />
          <AppRouter />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
