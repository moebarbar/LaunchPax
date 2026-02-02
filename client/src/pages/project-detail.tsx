import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  LayoutDashboard,
  Type,
  Palette,
  Globe,
  Image,
  Activity,
  Settings,
} from "lucide-react";
import type { Project } from "@shared/schema";
import ProjectOverview from "@/components/project/project-overview";
import NamingDomain from "@/components/project/naming-domain";
import BrandKit from "@/components/project/brand-kit";
import WebsitePlan from "@/components/project/website-plan";
import Graphics from "@/components/project/graphics";
import ActivityLogTab from "@/components/project/activity-log";
import { SiteSettings } from "@/components/project/site-settings";

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const projectId = parseInt(params.id || "0");

  const { data: project, isLoading } = useQuery<Project>({
    queryKey: ["/api/projects", projectId],
    enabled: !!projectId,
  });

  if (isLoading) {
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

  if (!project) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Project not found</h2>
          <p className="text-muted-foreground mb-4">
            This project doesn't exist or you don't have access to it.
          </p>
          <Link href="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 space-y-6 overflow-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" data-testid="button-back-to-dashboard">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold" data-testid="text-project-name">
                {project.name}
              </h1>
              <Badge variant="outline" className="capitalize">
                {project.status}
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm">
              {project.industry && `${project.industry} • `}
              Created {new Date(project.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
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
          <ProjectOverview project={project} />
        </TabsContent>
        <TabsContent value="naming">
          <NamingDomain projectId={projectId} project={project} />
        </TabsContent>
        <TabsContent value="brand">
          <BrandKit projectId={projectId} />
        </TabsContent>
        <TabsContent value="website">
          <WebsitePlan projectId={projectId} />
        </TabsContent>
        <TabsContent value="graphics">
          <Graphics projectId={projectId} />
        </TabsContent>
        <TabsContent value="activity">
          <ActivityLogTab projectId={projectId} />
        </TabsContent>
        <TabsContent value="settings">
          <SiteSettings project={project} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
