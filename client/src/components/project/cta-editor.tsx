import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Save, 
  Loader2, 
  MousePointer,
  Link as LinkIcon,
  Edit2,
  Check
} from "lucide-react";

interface CTAInfo {
  sectionId: string;
  sectionType: string;
  pageSlug: string;
  field: string;
  text: string;
  link?: string;
}

interface CTAEditorProps {
  projectId: number;
  websiteContent: {
    pages?: Array<{
      slug: string;
      title: string;
      sections: Array<{
        id: string;
        type: string;
        data: Record<string, unknown>;
      }>;
    }> | null;
  };
  onUpdate?: () => void;
}

export function CTAEditor({ projectId, websiteContent, onUpdate }: CTAEditorProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [ctas, setCtas] = useState<CTAInfo[]>([]);
  const [editingCta, setEditingCta] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{ text: string; link?: string }>({ text: "" });

  // Extract all CTAs from website content
  useEffect(() => {
    const extractedCtas: CTAInfo[] = [];
    
    if (websiteContent?.pages) {
      for (const page of websiteContent.pages) {
        for (const section of page.sections) {
          const data = section.data || {};
          
          // Extract CTAs based on section type
          if (section.type === "hero") {
            if (data.ctaText) {
              extractedCtas.push({
                sectionId: section.id,
                sectionType: "Hero",
                pageSlug: page.slug,
                field: "ctaText",
                text: data.ctaText as string,
                link: data.ctaLink as string,
              });
            }
            if (data.secondaryCtaText) {
              extractedCtas.push({
                sectionId: section.id,
                sectionType: "Hero (Secondary)",
                pageSlug: page.slug,
                field: "secondaryCtaText",
                text: data.secondaryCtaText as string,
                link: data.secondaryCtaLink as string,
              });
            }
          }
          
          if (section.type === "cta") {
            if (data.buttonText) {
              extractedCtas.push({
                sectionId: section.id,
                sectionType: "CTA Section",
                pageSlug: page.slug,
                field: "buttonText",
                text: data.buttonText as string,
                link: data.buttonLink as string,
              });
            }
          }
          
          if (section.type === "pricing") {
            const plans = data.plans as Array<{ name: string; ctaText?: string }> || [];
            plans.forEach((plan, index) => {
              if (plan.ctaText) {
                extractedCtas.push({
                  sectionId: section.id,
                  sectionType: `Pricing (${plan.name})`,
                  pageSlug: page.slug,
                  field: `plans.${index}.ctaText`,
                  text: plan.ctaText,
                });
              }
            });
          }
        }
      }
    }
    
    setCtas(extractedCtas);
  }, [websiteContent]);

  const updateCta = useMutation({
    mutationFn: async ({ sectionId, pageSlug, field, text, link }: { 
      sectionId: string; 
      pageSlug: string; 
      field: string;
      text: string;
      link?: string;
    }) => {
      // Get the current section data
      const page = websiteContent?.pages?.find(p => p.slug === pageSlug);
      const section = page?.sections.find(s => s.id === sectionId);
      
      if (!section) throw new Error("Section not found");
      
      // Update the field in the section data
      const updatedData = { ...section.data };
      
      if (field.includes(".")) {
        // Handle nested fields like plans.0.ctaText
        const parts = field.split(".");
        let current: any = updatedData;
        for (let i = 0; i < parts.length - 1; i++) {
          const key = isNaN(Number(parts[i])) ? parts[i] : Number(parts[i]);
          current = current[key];
        }
        current[parts[parts.length - 1]] = text;
      } else {
        (updatedData as any)[field] = text;
        // Also update the link if it's a CTA with a link field
        if (link !== undefined) {
          const linkField = field.replace("Text", "Link").replace("text", "link");
          (updatedData as any)[linkField] = link;
        }
      }
      
      const response = await apiRequest("PATCH", `/api/projects/${projectId}/sections/${sectionId}`, {
        data: updatedData,
        pageSlug,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "website-content"] });
      toast({
        title: "Button updated",
        description: "Your changes have been saved.",
      });
      setEditingCta(null);
      onUpdate?.();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update button. Please try again.",
        variant: "destructive",
      });
    },
  });

  const startEditing = (cta: CTAInfo) => {
    setEditingCta(`${cta.sectionId}-${cta.field}`);
    setEditValues({ text: cta.text, link: cta.link });
  };

  const saveEdit = (cta: CTAInfo) => {
    updateCta.mutate({
      sectionId: cta.sectionId,
      pageSlug: cta.pageSlug,
      field: cta.field,
      text: editValues.text,
      link: editValues.link,
    });
  };

  const cancelEdit = () => {
    setEditingCta(null);
    setEditValues({ text: "" });
  };

  // Group CTAs by page
  const ctasByPage = ctas.reduce((acc, cta) => {
    if (!acc[cta.pageSlug]) acc[cta.pageSlug] = [];
    acc[cta.pageSlug].push(cta);
    return acc;
  }, {} as Record<string, CTAInfo[]>);

  if (ctas.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No buttons found in your website content yet.
          <br />
          Generate your website first to customize buttons.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <MousePointer className="w-5 h-5" />
          Edit Buttons & CTAs
        </h3>
        <p className="text-sm text-muted-foreground">
          Customize all call-to-action buttons across your website
        </p>
      </div>

      {Object.entries(ctasByPage).map(([pageSlug, pageCtas]) => (
        <Card key={pageSlug}>
          <CardHeader className="py-3">
            <CardTitle className="text-base capitalize flex items-center gap-2">
              <Badge variant="outline">{pageSlug}</Badge>
              <span className="text-muted-foreground font-normal">Page</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pageCtas.map((cta, index) => {
              const isEditing = editingCta === `${cta.sectionId}-${cta.field}`;
              
              return (
                <div key={`${cta.sectionId}-${cta.field}`}>
                  {index > 0 && <Separator className="my-4" />}
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">
                        {cta.sectionType}
                      </span>
                      {!isEditing && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => startEditing(cta)}
                          data-testid={`button-edit-cta-${cta.sectionId}`}
                        >
                          <Edit2 className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      )}
                    </div>
                    
                    {isEditing ? (
                      <div className="space-y-3 p-4 bg-muted rounded-lg">
                        <div>
                          <Label htmlFor={`cta-text-${cta.sectionId}`}>Button Text</Label>
                          <Input
                            id={`cta-text-${cta.sectionId}`}
                            value={editValues.text}
                            onChange={(e) => setEditValues({ ...editValues, text: e.target.value })}
                            placeholder="Enter button text"
                            data-testid={`input-cta-text-${cta.sectionId}`}
                          />
                        </div>
                        
                        {cta.link !== undefined && (
                          <div>
                            <Label htmlFor={`cta-link-${cta.sectionId}`}>Button Link</Label>
                            <div className="flex items-center gap-2">
                              <LinkIcon className="w-4 h-4 text-muted-foreground" />
                              <Input
                                id={`cta-link-${cta.sectionId}`}
                                value={editValues.link || ""}
                                onChange={(e) => setEditValues({ ...editValues, link: e.target.value })}
                                placeholder="Enter link URL (e.g., /contact or https://...)"
                                data-testid={`input-cta-link-${cta.sectionId}`}
                              />
                            </div>
                          </div>
                        )}
                        
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => saveEdit(cta)}
                            disabled={updateCta.isPending}
                            data-testid={`button-save-cta-${cta.sectionId}`}
                          >
                            {updateCta.isPending ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Check className="w-4 h-4 mr-1" />
                            )}
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={cancelEdit}
                            data-testid={`button-cancel-cta-${cta.sectionId}`}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <Button className="pointer-events-none">
                          {cta.text}
                        </Button>
                        {cta.link && (
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <LinkIcon className="w-3 h-3" />
                            {cta.link}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
