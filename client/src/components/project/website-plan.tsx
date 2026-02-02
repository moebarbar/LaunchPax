import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Globe,
  Sparkles,
  Loader2,
  FileText,
  Layout,
  Type,
  List,
  Image,
} from "lucide-react";
import type { WebsitePlan as WebsitePlanType, WorkflowJob } from "@shared/schema";

interface WebsitePlanProps {
  projectId: number;
}

export default function WebsitePlan({ projectId }: WebsitePlanProps) {
  const { toast } = useToast();

  const { data: websitePlan, isLoading } = useQuery<WebsitePlanType>({
    queryKey: ["/api/projects", projectId, "website-plan"],
  });

  const { data: workflowJob, refetch: refetchJob } = useQuery<WorkflowJob>({
    queryKey: ["/api/projects", projectId, "workflows", "website-plan", "status"],
    refetchInterval: (query) => {
      const job = query.state.data;
      if (job?.status === "running" || job?.status === "pending") {
        return 2000;
      }
      return false;
    },
  });

  const generateWebsitePlan = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/projects/${projectId}/workflows/website-plan/run`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Generating website plan",
        description: "Creating your website structure...",
      });
      refetchJob();
      queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "website-plan"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate website plan.",
        variant: "destructive",
      });
    },
  });

  const isRunning = workflowJob?.status === "running" || workflowJob?.status === "pending";

  const getSectionIcon = (type: string) => {
    switch (type) {
      case "hero":
        return Layout;
      case "features":
        return List;
      case "cta":
        return Type;
      case "image":
        return Image;
      default:
        return FileText;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!websitePlan || websitePlan.status === "pending") {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Globe className="w-8 h-8 text-primary" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Plan Your Website</h3>
          <p className="text-muted-foreground text-sm mb-6 max-w-md">
            Generate a complete website structure with page layouts, copy, and section content.
          </p>
          <Button
            onClick={() => generateWebsitePlan.mutate()}
            disabled={generateWebsitePlan.isPending || isRunning}
            data-testid="button-generate-website"
          >
            {generateWebsitePlan.isPending || isRunning ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Website Plan
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isRunning) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
          <h3 className="font-semibold mb-2">Creating Website Plan...</h3>
          <p className="text-muted-foreground text-sm">This may take a moment</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Website Structure</h2>
          <p className="text-muted-foreground text-sm">
            {websitePlan.pages?.length || 0} pages generated
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => generateWebsitePlan.mutate()}
          disabled={isRunning}
          data-testid="button-regenerate-website"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Regenerate
        </Button>
      </div>

      {websitePlan.siteSettings && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Site Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              {websitePlan.siteSettings.primaryColor && (
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded border"
                    style={{ backgroundColor: websitePlan.siteSettings.primaryColor }}
                  />
                  <span className="text-sm">Primary: {websitePlan.siteSettings.primaryColor}</span>
                </div>
              )}
              {websitePlan.siteSettings.font && (
                <Badge variant="outline">{websitePlan.siteSettings.font}</Badge>
              )}
              {websitePlan.siteSettings.style && (
                <Badge variant="outline">{websitePlan.siteSettings.style}</Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Accordion type="single" collapsible className="space-y-4">
        {websitePlan.pages?.map((page, pageIndex) => (
          <AccordionItem key={pageIndex} value={`page-${pageIndex}`} className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline" data-testid={`accordion-page-${pageIndex}`}>
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-muted-foreground" />
                <div className="text-left">
                  <p className="font-medium">{page.title}</p>
                  <p className="text-sm text-muted-foreground">/{page.slug}</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4 pb-6">
              <div className="space-y-4">
                {page.sections.map((section, sectionIndex) => {
                  const Icon = getSectionIcon(section.type);
                  return (
                    <Card key={sectionIndex} className="bg-muted/30">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Icon className="w-4 h-4 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0 space-y-2">
                            <Badge variant="outline" className="capitalize">
                              {section.type}
                            </Badge>
                            {section.headline && (
                              <h4 className="font-semibold">{section.headline}</h4>
                            )}
                            {section.content && (
                              <p className="text-sm text-muted-foreground">{section.content}</p>
                            )}
                            {section.items && section.items.length > 0 && (
                              <ul className="list-disc list-inside text-sm text-muted-foreground">
                                {section.items.map((item, i) => (
                                  <li key={i}>{item}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
