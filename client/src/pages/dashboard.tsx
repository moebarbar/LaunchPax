import { useQuery } from "@tanstack/react-query";
import { Link, useLocation, useSearch } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { useSelectedProject } from "@/hooks/use-selected-project";
import {
  Plus,
  FolderKanban,
  Building2,
  Clock,
  LayoutDashboard,
  Type,
  Palette,
  Globe,
  Image,
  Activity,
  Settings,
  PenTool,
} from "lucide-react";
import type { Project } from "@shared/schema";
import ProjectOverview from "@/components/project/project-overview";
import NamingDomain from "@/components/project/naming-domain";
import BrandKit from "@/components/project/brand-kit";
import WebsitePlan from "@/components/project/website-plan";
import Graphics from "@/components/project/graphics";
import ActivityLogTab from "@/components/project/activity-log";
import { SiteSettings } from "@/components/project/site-settings";

export default function DashboardPage() {
  const { user } = useAuth();
  const { selectedProject, selectedProjectId, projects, isLoadingProjects } = useSelectedProject();
  const [location, navigate] = useLocation();
  const searchString = useSearch();

  const params = new URLSearchParams(searchString);
  const activeTab = params.get("tab") || "overview";

  const setActiveTab = (tab: string) => {
    navigate(`/dashboard?tab=${tab}`);
  };

  if (isLoadingProjects) {
    return (
      <div className="flex-1 p-6 space-y-6 overflow-auto">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Skeleton className="h-[400px]" />
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center overflow-auto">
        <Card className="max-w-md mx-auto">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <FolderKanban className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-2">No projects yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first project to start building your business
            </p>
            <Link href="/project/new">
              <Button data-testid="button-create-first-project">
                <Building2 className="w-4 h-4 mr-2" />
                Create Your First Project
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!selectedProject) {
    return (
      <div className="flex-1 p-6 space-y-6 overflow-auto">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Skeleton className="h-[400px]" />
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 space-y-6 overflow-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold" data-testid="text-project-name">
              {selectedProject.name}
            </h1>
            <Badge variant="outline" className="capitalize">
              {selectedProject.status}
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">
            {selectedProject.industry && `${selectedProject.industry} · `}
            Created {new Date(selectedProject.createdAt).toLocaleDateString()}
          </p>
        </div>
        <Link href={`/project/${selectedProjectId}/editor`}>
          <Button variant="default" className="gap-2" data-testid="button-visual-editor-header">
            <PenTool className="w-4 h-4" />
            Visual Editor
          </Button>
        </Link>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="flex flex-wrap h-auto gap-1 p-1">
          <TabsTrigger value="overview" className="flex items-center gap-2" data-testid="tab-overview">
            <LayoutDashboard className="w-4 h-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="naming" className="flex items-center gap-2" data-testid="tab-naming">
            <Type className="w-4 h-4" />
            <span className="hidden sm:inline">Naming & Domain</span>
          </TabsTrigger>
          <TabsTrigger value="brand" className="flex items-center gap-2" data-testid="tab-brand">
            <Palette className="w-4 h-4" />
            <span className="hidden sm:inline">Brand Kit</span>
          </TabsTrigger>
          <TabsTrigger value="website" className="flex items-center gap-2" data-testid="tab-website">
            <Globe className="w-4 h-4" />
            <span className="hidden sm:inline">Website</span>
          </TabsTrigger>
          <TabsTrigger value="graphics" className="flex items-center gap-2" data-testid="tab-graphics">
            <Image className="w-4 h-4" />
            <span className="hidden sm:inline">Graphics</span>
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2" data-testid="tab-activity">
            <Activity className="w-4 h-4" />
            <span className="hidden sm:inline">Activity</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2" data-testid="tab-settings">
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <ProjectOverview project={selectedProject} />
        </TabsContent>
        <TabsContent value="naming">
          <NamingDomain projectId={selectedProjectId!} project={selectedProject} />
        </TabsContent>
        <TabsContent value="brand">
          <BrandKit projectId={selectedProjectId!} project={selectedProject} />
        </TabsContent>
        <TabsContent value="website">
          <WebsitePlan projectId={selectedProjectId!} />
        </TabsContent>
        <TabsContent value="graphics">
          <Graphics projectId={selectedProjectId!} />
        </TabsContent>
        <TabsContent value="activity">
          <ActivityLogTab projectId={selectedProjectId!} />
        </TabsContent>
        <TabsContent value="settings">
          <SiteSettings project={selectedProject} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
