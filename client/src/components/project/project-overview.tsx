import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Circle,
  Building2,
  MapPin,
  Users,
  Palette,
  DollarSign,
} from "lucide-react";
import type { Project, NamingResult, BrandKit, WebsiteContent, GraphicAsset } from "@shared/schema";
import { IndustryRecommendations } from "./industry-recommendations";

interface ProjectOverviewProps {
  project: Project;
}

export default function ProjectOverview({ project }: ProjectOverviewProps) {
  const { data: namingResult } = useQuery<NamingResult>({
    queryKey: ["/api/projects", project.id, "naming-domain", "results"],
  });

  const { data: brandKit } = useQuery<BrandKit>({
    queryKey: ["/api/projects", project.id, "brand-kit"],
  });

  const { data: websitePlan } = useQuery<WebsiteContent>({
    queryKey: ["/api/projects", project.id, "website-plan"],
  });

  const { data: graphics } = useQuery<GraphicAsset[]>({
    queryKey: ["/api/projects", project.id, "graphics"],
  });

  const steps = [
    {
      name: "Naming & Domain",
      completed: namingResult?.status === "completed" && !!namingResult.selectedDomain,
      inProgress: namingResult?.status === "running",
    },
    {
      name: "Brand Kit",
      completed: brandKit?.status === "completed",
      inProgress: brandKit?.status === "running",
    },
    {
      name: "Website Plan",
      completed: websitePlan?.status === "completed",
      inProgress: websitePlan?.status === "running",
    },
    {
      name: "Graphics",
      completed: graphics && graphics.length > 0 && graphics.every(g => g.status === "completed"),
      inProgress: graphics && graphics.some(g => g.status === "generating"),
    },
  ];

  const completedSteps = steps.filter((s) => s.completed).length;
  const progress = (completedSteps / steps.length) * 100;

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Project Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {project.businessIdea && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Business Idea</p>
                <p className="text-sm" data-testid="text-business-idea">{project.businessIdea}</p>
              </div>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {project.industry && (
                <div className="flex items-start gap-2">
                  <Building2 className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Industry</p>
                    <p className="text-sm font-medium">{project.industry}</p>
                  </div>
                </div>
              )}
              {project.location && (
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="text-sm font-medium">{project.location}</p>
                  </div>
                </div>
              )}
              {project.targetAudience && (
                <div className="flex items-start gap-2">
                  <Users className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Audience</p>
                    <p className="text-sm font-medium">{project.targetAudience}</p>
                  </div>
                </div>
              )}
              {project.tone && (
                <div className="flex items-start gap-2">
                  <Palette className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Tone</p>
                    <p className="text-sm font-medium">{project.tone}</p>
                  </div>
                </div>
              )}
              {project.budget && (
                <div className="flex items-start gap-2">
                  <DollarSign className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Budget</p>
                    <p className="text-sm font-medium capitalize">{project.budget}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Industry Recommendations */}
        {project.industry && (
          <IndustryRecommendations industry={project.industry} />
        )}

        {namingResult?.selectedDomain && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Selected Domain</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-lg px-4 py-2 font-mono">
                  {namingResult.selectedDomain}
                </Badge>
                <Badge className="bg-green-500/10 text-green-600">Available</Badge>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Launch Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">Overall Progress</span>
                <span className="font-medium">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            <div className="space-y-3">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center gap-3">
                  {step.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : step.inProgress ? (
                    <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground" />
                  )}
                  <span className={`text-sm ${step.completed ? "text-foreground" : "text-muted-foreground"}`}>
                    {step.name}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {brandKit?.status === "completed" && brandKit.colorPalette && brandKit.colorPalette.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Color Palette</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                {brandKit.colorPalette.map((color, index) => (
                  <div
                    key={index}
                    className="w-10 h-10 rounded-md ring-1 ring-black/10"
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
