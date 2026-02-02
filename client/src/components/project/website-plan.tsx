import { useEffect, useRef } from "react";
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
  Users,
  Mail,
  DollarSign,
  BarChart3,
} from "lucide-react";
import type { WebsiteContent, WorkflowJob, SectionContent } from "@shared/schema";

interface WebsitePlanProps {
  projectId: number;
}

export default function WebsitePlan({ projectId }: WebsitePlanProps) {
  const { toast } = useToast();

  const { data: websiteContent, isLoading, refetch: refetchWebsiteContent } = useQuery<WebsiteContent>({
    queryKey: ["/api/projects", projectId, "website-plan"],
  });

  const { data: workflowJob, refetch: refetchJob } = useQuery<WorkflowJob>({
    queryKey: ["/api/projects", projectId, "workflows", "website-plan", "status"],
    refetchInterval: (query) => {
      const job = query.state.data;
      // Only poll if workflow is actively running
      if (job?.status === "running") {
        return 2000;
      }
      return false;
    },
  });

  // Track previous workflow status to detect completion
  const prevStatusRef = useRef<string | undefined>(undefined);
  
  // Refetch results when workflow completes
  useEffect(() => {
    const currentStatus = workflowJob?.status;
    const prevStatus = prevStatusRef.current;
    
    if (prevStatus === "running" && currentStatus === "completed") {
      refetchWebsiteContent();
    }
    
    prevStatusRef.current = currentStatus;
  }, [workflowJob?.status, refetchWebsiteContent]);

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

  const isRunning = workflowJob?.status === "running";

  const getSectionIcon = (type: string) => {
    switch (type) {
      case "hero":
        return Layout;
      case "features":
        return List;
      case "cta":
        return Type;
      case "contact":
        return Mail;
      case "testimonials":
        return Users;
      case "pricing":
        return DollarSign;
      case "stats":
        return BarChart3;
      case "image":
        return Image;
      default:
        return FileText;
    }
  };

  const renderSectionContent = (section: SectionContent) => {
    const data = section.data || {};
    
    return (
      <div className="space-y-2">
        {data.headline && (
          <h4 className="font-semibold">{data.headline as string}</h4>
        )}
        {data.subheadline && (
          <p className="text-sm text-muted-foreground">{data.subheadline as string}</p>
        )}
        {data.content && (
          <p className="text-sm text-muted-foreground">{data.content as string}</p>
        )}
        {data.description && (
          <p className="text-sm text-muted-foreground">{data.description as string}</p>
        )}
        {data.ctaText && (
          <Badge variant="outline">CTA: {data.ctaText as string}</Badge>
        )}
        {data.items && Array.isArray(data.items) && data.items.length > 0 && (
          <div className="grid gap-2 mt-2">
            {(data.items as Array<{title?: string; description?: string; icon?: string}>).map((item, i) => (
              <div key={i} className="text-sm p-2 bg-muted/30 rounded">
                {item.title && <span className="font-medium">{item.title}</span>}
                {item.description && <span className="text-muted-foreground ml-2">- {item.description}</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!websiteContent || websiteContent.status === "pending") {
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
            {websiteContent.pages?.length || 0} pages generated
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

      {websiteContent.siteSettings && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Site Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              {websiteContent.siteSettings.primaryColor && (
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded border"
                    style={{ backgroundColor: websiteContent.siteSettings.primaryColor }}
                  />
                  <span className="text-sm">Primary: {websiteContent.siteSettings.primaryColor}</span>
                </div>
              )}
              {websiteContent.siteSettings.fontFamily && (
                <Badge variant="outline">Font: {websiteContent.siteSettings.fontFamily}</Badge>
              )}
              {websiteContent.siteSettings.style && (
                <Badge variant="outline">Style: {websiteContent.siteSettings.style}</Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {websiteContent.globalContent && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Global Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {websiteContent.globalContent.siteName && (
              <div>
                <p className="text-sm text-muted-foreground">Site Name</p>
                <p className="font-medium">{websiteContent.globalContent.siteName}</p>
              </div>
            )}
            {websiteContent.globalContent.navigation && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Navigation</p>
                <div className="flex flex-wrap gap-2">
                  {websiteContent.globalContent.navigation.map((nav, i) => (
                    <Badge key={i} variant="outline">{nav.label}</Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Accordion type="single" collapsible className="space-y-4">
        {websiteContent.pages?.map((page, pageIndex) => (
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
              {page.metaDescription && (
                <p className="text-sm text-muted-foreground mb-4 italic">
                  {page.metaDescription}
                </p>
              )}
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
                          <div className="flex-1 min-w-0">
                            <Badge variant="outline" className="capitalize mb-2">
                              {section.type}
                            </Badge>
                            {renderSectionContent(section)}
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
