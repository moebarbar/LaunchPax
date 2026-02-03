import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, X, Wand2, ChevronDown, ChevronUp, Image } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ImageUploader } from "./image-uploader";
import type { SectionContent } from "@shared/schema";

interface SectionEditorProps {
  projectId: number;
  section: SectionContent;
  pageSlug: string;
  onClose: () => void;
  onUpdate: () => void;
}

const QUICK_PROMPTS: Record<string, string[]> = {
  hero: [
    "Make the headline more bold and impactful",
    "Add urgency to the call-to-action",
    "Make it feel more premium and luxurious",
    "Simplify and make it cleaner",
  ],
  features: [
    "Make features more benefit-focused",
    "Add more specific details and outcomes",
    "Make descriptions punchier and shorter",
    "Highlight unique differentiators",
  ],
  testimonials: [
    "Make testimonials sound more authentic",
    "Add specific metrics and results",
    "Make quotes more emotional and compelling",
    "Diversify the testimonial perspectives",
  ],
  pricing: [
    "Highlight the best value option",
    "Make feature lists more compelling",
    "Add trust signals and guarantees",
    "Simplify the pricing tiers",
  ],
  cta: [
    "Create more urgency",
    "Make the offer more compelling",
    "Add social proof elements",
    "Make the headline more powerful",
  ],
  services: [
    "Add more detail to each service",
    "Highlight unique benefits",
    "Make descriptions more customer-focused",
    "Add outcome-based messaging",
  ],
  stats: [
    "Make numbers more impressive",
    "Add context to the statistics",
    "Include timeframes for credibility",
    "Add social proof elements",
  ],
  team: [
    "Make bios more personable",
    "Highlight expertise and credentials",
    "Add memorable personal details",
    "Make roles clearer",
  ],
  faq: [
    "Address common objections better",
    "Make answers more reassuring",
    "Add more specific details",
    "End answers more confidently",
  ],
  default: [
    "Make it more premium and professional",
    "Add more detail and depth",
    "Make it more conversational",
    "Simplify and clarify the messaging",
  ],
};

export function SectionEditor({ projectId, section, pageSlug, onClose, onUpdate }: SectionEditorProps) {
  const [instruction, setInstruction] = useState("");
  const [showQuickPrompts, setShowQuickPrompts] = useState(true);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const quickPrompts = QUICK_PROMPTS[section.type] || QUICK_PROMPTS.default;

  const refineMutation = useMutation({
    mutationFn: async (prompt: string) => {
      const response = await apiRequest(
        "POST",
        `/api/projects/${projectId}/sections/${section.id}/refine`,
        { instruction: prompt, pageSlug }
      );
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "website-plan"] });
      toast({
        title: "Section updated",
        description: "Your changes have been applied successfully.",
      });
      onUpdate();
      setInstruction("");
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update section",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (instruction.trim()) {
      refineMutation.mutate(instruction.trim());
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    refineMutation.mutate(prompt);
  };

  const getSectionTypeName = (type: string): string => {
    const names: Record<string, string> = {
      hero: "Hero Section",
      features: "Features",
      testimonials: "Testimonials",
      pricing: "Pricing",
      cta: "Call to Action",
      services: "Services",
      team: "Team",
      faq: "FAQ",
      stats: "Statistics",
      gallery: "Gallery",
      contact: "Contact",
      process: "Process",
      case_studies: "Case Studies",
      trust_signals: "Trust Signals",
      benefits: "Benefits",
      comparison: "Comparison",
      brand_story: "Brand Story",
      story: "Story",
      text: "Text",
    };
    return names[type] || type;
  };

  return (
    <Card className="border-2 border-primary/20 bg-card/95 backdrop-blur-sm shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-4 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Wand2 className="w-5 h-5" style={{ color: "hsl(var(--primary))" }} />
          </div>
          <div>
            <CardTitle className="text-lg">Edit Section</CardTitle>
            <Badge variant="secondary" className="mt-1">
              {getSectionTypeName(section.type)}
            </Badge>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} data-testid="button-close-editor">
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
            <label className="text-sm font-medium">Quick Suggestions</label>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowQuickPrompts(!showQuickPrompts)}
              data-testid="button-toggle-quick-prompts"
            >
              {showQuickPrompts ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>
          
          {showQuickPrompts && (
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((prompt, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickPrompt(prompt)}
                  disabled={refineMutation.isPending}
                  className="text-xs"
                  data-testid={`button-quick-prompt-${index}`}
                >
                  <Sparkles className="w-3 h-3 mr-1" />
                  {prompt}
                </Button>
              ))}
            </div>
          )}
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Image className="w-4 h-4" />
              Section Image
            </label>
            <ImageUploader
              projectId={projectId}
              sectionId={section.id}
              pageSlug={pageSlug}
              currentImage={(section.data as any)?.image}
              currentImageB64={(section.data as any)?.imageB64}
              onImageUpdate={onUpdate}
            />
          </div>
          {((section.data as any)?.image || (section.data as any)?.imageB64) && (
            <div className="rounded-lg overflow-hidden border">
              <img 
                src={(section.data as any)?.imageB64 
                  ? `data:image/png;base64,${(section.data as any)?.imageB64}` 
                  : (section.data as any)?.image}
                alt="Section preview"
                className="w-full h-24 object-cover"
              />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Custom Instruction</label>
          <Textarea
            placeholder="Describe how you want to improve this section..."
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            className="min-h-[80px] resize-none"
            disabled={refineMutation.isPending}
            data-testid="input-custom-instruction"
          />
          <p className="text-xs text-muted-foreground">
            Example: "Make the headline more powerful" or "Add more social proof"
          </p>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button 
            variant="outline" 
            onClick={onClose} 
            disabled={refineMutation.isPending}
            data-testid="button-cancel-edit"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!instruction.trim() || refineMutation.isPending}
            data-testid="button-apply-changes"
          >
            {refineMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Refining...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 mr-2" />
                Apply Changes
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface SectionEditableWrapperProps {
  projectId: number;
  section: SectionContent;
  pageSlug: string;
  children: React.ReactNode;
  onUpdate: () => void;
  isEditable?: boolean;
}

export function SectionEditableWrapper({
  projectId,
  section,
  pageSlug,
  children,
  onUpdate,
  isEditable = true,
}: SectionEditableWrapperProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  if (!isEditable) {
    return <>{children}</>;
  }

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      
      <div 
        className="absolute top-4 right-4 z-50 transition-all duration-200"
        style={{ 
          visibility: isHovered && !isEditing ? "visible" : "hidden",
          opacity: isHovered && !isEditing ? 1 : 0,
        }}
      >
        <Button
          size="sm"
          onClick={() => setIsEditing(true)}
          className="shadow-lg"
          data-testid={`button-edit-section-${section.id}`}
        >
          <Wand2 className="w-4 h-4 mr-2" />
          Edit Section
        </Button>
      </div>
      
      <div 
        className="absolute inset-x-4 top-4 z-50 max-w-md"
        style={{ visibility: isEditing ? "visible" : "hidden" }}
      >
        {isEditing && (
          <SectionEditor
            projectId={projectId}
            section={section}
            pageSlug={pageSlug}
            onClose={() => setIsEditing(false)}
            onUpdate={() => {
              setIsEditing(false);
              onUpdate();
            }}
          />
        )}
      </div>
      
      <div 
        className="absolute inset-0 pointer-events-none border-2 border-primary/30 rounded-lg transition-all duration-200"
        style={{ 
          visibility: isHovered && !isEditing ? "visible" : "hidden",
          opacity: isHovered && !isEditing ? 1 : 0,
        }}
      />
    </div>
  );
}
