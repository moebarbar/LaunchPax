import { useState, useEffect, useRef } from "react";
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
  Eye,
  ExternalLink,
  Monitor,
  Smartphone,
  Share2,
  Copy,
  Check,
  Rocket,
  CheckCircle,
  Wand2,
  MousePointer,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SectionEditor } from "./section-editor";
import { CTAEditor } from "./cta-editor";
import { GlobalStyleEditor } from "./global-style-editor";
import { EditableSectionsPanel } from "./editable-sections-panel";
import { QualityDashboard } from "./quality-dashboard";
import TechyBuildProgress from "@/components/techy-build-progress";
import { Paintbrush } from "lucide-react";
import type { WebsiteContent, WorkflowJob, SectionContent } from "@shared/schema";

interface WebsitePlanProps {
  projectId: number;
}

interface QualityReportData {
  hasReport: boolean;
  scores?: {
    overall: number;
    layout: number;
    typography: number;
    creativity: number;
    heroImpact: number;
    contentQuality: number;
    visualDepth: number;
  };
  verdict?: 'excellent' | 'good' | 'needs_improvement' | 'poor';
  passesGate?: boolean;
  passCount?: number;
  weakSectionsCount?: number;
  genericPatterns?: string[];
  message?: string;
  skipped?: boolean;
  error?: string;
}

type ViewMode = "desktop" | "mobile";

export default function WebsitePlan({ projectId }: WebsitePlanProps) {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<ViewMode>("desktop");
  const [activeTab, setActiveTab] = useState("structure");
  const [copied, setCopied] = useState(false);

  const copyShareUrl = async (previewToken: string) => {
    const baseUrl = window.location.origin;
    const shareUrl = `${baseUrl}/preview/${previewToken}`;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast({
      title: "Link copied!",
      description: "Share this link with anyone to show your website.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

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

  // Quality report query
  const { data: qualityReport, refetch: refetchQualityReport } = useQuery<QualityReportData>({
    queryKey: ["/api/projects", projectId, "quality-report"],
    enabled: !!websiteContent,
  });

  // Track previous workflow status to detect completion
  const prevStatusRef = useRef<string | undefined>(undefined);
  
  // Refetch results when workflow completes or fails
  useEffect(() => {
    const currentStatus = workflowJob?.status;
    const prevStatus = prevStatusRef.current;
    
    // Refetch on any status change from running
    if (prevStatus === "running" && (currentStatus === "completed" || currentStatus === "failed")) {
      refetchWebsiteContent();
      refetchQualityReport();
    }
    
    prevStatusRef.current = currentStatus;
  }, [workflowJob?.status, refetchWebsiteContent, refetchQualityReport]);
  
  // Also refetch when progress reaches 100 (in case status update is delayed)
  const prevProgressRef = useRef<number | null | undefined>(undefined);
  useEffect(() => {
    const currentProgress = workflowJob?.progress;
    const prevProgress = prevProgressRef.current;
    
    if (prevProgress !== 100 && currentProgress === 100) {
      // Wait a moment for the backend to fully update, then refetch
      setTimeout(() => {
        refetchWebsiteContent();
        refetchQualityReport();
      }, 1000);
    }
    
    prevProgressRef.current = currentProgress;
  }, [workflowJob?.progress, refetchWebsiteContent, refetchQualityReport]);

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

  const publishWebsite = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/projects/${projectId}/publish`);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Website published!",
        description: "Your website is now live and accessible to anyone with the link.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "website-plan"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to publish website.",
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
      case "services":
        return List;
      case "team":
        return Users;
      case "faq":
        return FileText;
      case "gallery":
        return Image;
      case "text":
        return Type;
      default:
        return FileText;
    }
  };

  const renderSectionContent = (section: SectionContent) => {
    const data = (section.data || {}) as Record<string, unknown>;
    
    const headline = typeof data.headline === "string" ? data.headline : null;
    const subheadline = typeof data.subheadline === "string" ? data.subheadline : null;
    const content = typeof data.content === "string" ? data.content : null;
    const description = typeof data.description === "string" ? data.description : null;
    const ctaText = typeof data.ctaText === "string" ? data.ctaText : null;
    const items = Array.isArray(data.items) ? data.items as Array<{title?: string; description?: string; icon?: string}> : null;
    
    return (
      <div className="space-y-2">
        {headline ? <h4 className="font-semibold">{headline}</h4> : null}
        {subheadline ? <p className="text-sm text-muted-foreground">{subheadline}</p> : null}
        {content ? <p className="text-sm text-muted-foreground">{content}</p> : null}
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
        {ctaText ? <Badge variant="outline">CTA: {ctaText}</Badge> : null}
        {items && items.length > 0 ? (
          <div className="grid gap-2 mt-2">
            {items.map((item, i) => (
              <div key={i} className="text-sm p-2 bg-muted/30 rounded">
                {item.title ? <span className="font-medium">{item.title}</span> : null}
                {item.description ? <span className="text-muted-foreground ml-2">- {item.description}</span> : null}
              </div>
            ))}
          </div>
        ) : null}
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
    if (isRunning) {
      return (
        <Card>
          <CardContent className="py-8">
            <TechyBuildProgress 
              workflowType="website" 
              progress={workflowJob?.progress || 0} 
              isRunning={true}
            />
          </CardContent>
        </Card>
      );
    }
    
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
            disabled={generateWebsitePlan.isPending}
            data-testid="button-generate-website"
          >
            {generateWebsitePlan.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Starting...
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-lg font-semibold">Website Structure</h2>
          <p className="text-muted-foreground text-sm">
            {websiteContent.pages?.length || 0} pages generated
          </p>
        </div>
        <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={() => window.open(`/preview/${websiteContent.previewToken}`, '_blank')}
            data-testid="button-preview-website"
            className="w-full sm:w-auto"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Open Preview
          </Button>
          <Button
            variant="outline"
            onClick={() => websiteContent.previewToken && copyShareUrl(websiteContent.previewToken)}
            data-testid="button-share-website"
            className="w-full sm:w-auto"
          >
            {copied ? (
              <Check className="w-4 h-4 mr-2" />
            ) : (
              <Share2 className="w-4 h-4 mr-2" />
            )}
            {copied ? "Copied!" : "Share"}
          </Button>
          {websiteContent.isPublished ? (
            <Button
              variant="default"
              onClick={() => websiteContent.publishedUrl && window.open(websiteContent.publishedUrl, '_blank')}
              data-testid="button-view-live-site"
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              View Live Site
            </Button>
          ) : (
            <Button
              onClick={() => publishWebsite.mutate()}
              disabled={publishWebsite.isPending}
              data-testid="button-publish-website"
              className="w-full sm:w-auto"
            >
              {publishWebsite.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <Rocket className="w-4 h-4 mr-2" />
                  Publish
                </>
              )}
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => generateWebsitePlan.mutate()}
            disabled={isRunning}
            data-testid="button-regenerate-website"
            className="w-full sm:w-auto"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Regenerate
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 max-w-[750px]">
          <TabsTrigger value="structure" data-testid="tab-website-structure">
            <Layout className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Structure</span>
          </TabsTrigger>
          <TabsTrigger value="edit" data-testid="tab-website-edit">
            <Wand2 className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Edit</span>
          </TabsTrigger>
          <TabsTrigger value="buttons" data-testid="tab-website-buttons">
            <MousePointer className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Buttons</span>
          </TabsTrigger>
          <TabsTrigger value="preview" data-testid="tab-website-preview">
            <Eye className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Preview</span>
          </TabsTrigger>
          <TabsTrigger value="styles" data-testid="tab-website-styles">
            <Paintbrush className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Styles</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
              <CardTitle className="text-lg">Live Preview</CardTitle>
              <div className="flex items-center gap-1 border rounded-md p-1">
                <Button
                  variant={viewMode === "desktop" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("desktop")}
                  data-testid="button-view-desktop"
                  className="h-7 px-2"
                >
                  <Monitor className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "mobile" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("mobile")}
                  data-testid="button-view-mobile"
                  className="h-7 px-2"
                >
                  <Smartphone className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div 
                className={`mx-auto border rounded-lg overflow-hidden bg-background transition-all ${
                  viewMode === "mobile" ? "max-w-[375px]" : "w-full"
                }`}
                style={{ height: "600px" }}
              >
                <iframe
                  src={`/preview/${websiteContent.previewToken}`}
                  className="w-full h-full border-0"
                  title="Website Preview"
                  data-testid="iframe-website-preview"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="edit" className="mt-4">
          <EditableSectionsPanel 
            projectId={projectId}
            websiteContent={websiteContent}
            onUpdate={() => refetchWebsiteContent()}
          />
        </TabsContent>

        <TabsContent value="buttons" className="mt-4">
          <CTAEditor 
            projectId={projectId}
            websiteContent={websiteContent}
            onUpdate={() => refetchWebsiteContent()}
          />
        </TabsContent>

        <TabsContent value="styles" className="mt-4">
          <GlobalStyleEditor 
            projectId={projectId}
            websiteContent={websiteContent}
            onUpdate={() => refetchWebsiteContent()}
          />
        </TabsContent>

        <TabsContent value="structure" className="mt-4 space-y-6">
          
          <QualityDashboard
            scores={qualityReport?.hasReport ? qualityReport.scores : undefined}
            verdict={qualityReport?.hasReport ? qualityReport.verdict : undefined}
            passesGate={qualityReport?.hasReport ? qualityReport.passesGate : undefined}
            passCount={qualityReport?.hasReport ? qualityReport.passCount : undefined}
            sectionsImproved={qualityReport?.hasReport ? qualityReport.weakSectionsCount : undefined}
            genericPatterns={qualityReport?.hasReport ? qualityReport.genericPatterns : undefined}
            isLoading={isRunning}
            skipped={qualityReport?.skipped}
            error={qualityReport?.error}
          />

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
        </TabsContent>
      </Tabs>
    </div>
  );
}

