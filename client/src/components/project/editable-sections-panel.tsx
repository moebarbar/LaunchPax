import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  GripVertical, 
  Plus, 
  Trash2, 
  Copy, 
  ChevronUp, 
  ChevronDown, 
  Wand2, 
  Layout, 
  Type, 
  Users, 
  Star, 
  DollarSign, 
  HelpCircle, 
  Image, 
  BarChart3, 
  Mail, 
  MessageSquare, 
  Loader2,
  ArrowUp,
  ArrowDown,
  Sparkles,
} from "lucide-react";
import { SectionEditor } from "./section-editor";
import type { WebsiteContent, SectionContent } from "@shared/schema";

interface EditableSectionsPanelProps {
  projectId: number;
  websiteContent: WebsiteContent;
  onUpdate: () => void;
}

const SECTION_TYPES = [
  { value: "hero", label: "Hero Section", icon: Layout, description: "Main banner with headline and CTA" },
  { value: "features", label: "Features", icon: Star, description: "Highlight key features or benefits" },
  { value: "services", label: "Services", icon: Wand2, description: "List of services offered" },
  { value: "testimonials", label: "Testimonials", icon: MessageSquare, description: "Customer reviews and quotes" },
  { value: "stats", label: "Statistics", icon: BarChart3, description: "Key numbers and metrics" },
  { value: "pricing", label: "Pricing", icon: DollarSign, description: "Pricing plans and packages" },
  { value: "team", label: "Team", icon: Users, description: "Team member profiles" },
  { value: "faq", label: "FAQ", icon: HelpCircle, description: "Frequently asked questions" },
  { value: "cta", label: "Call to Action", icon: Sparkles, description: "Conversion-focused section" },
  { value: "contact", label: "Contact", icon: Mail, description: "Contact form or info" },
  { value: "gallery", label: "Gallery", icon: Image, description: "Image gallery or portfolio" },
  { value: "text", label: "Text Block", icon: Type, description: "Custom text content" },
];

const getSectionIcon = (type: string) => {
  const sectionType = SECTION_TYPES.find(s => s.value === type);
  return sectionType?.icon || Layout;
};

const getSectionLabel = (type: string) => {
  const sectionType = SECTION_TYPES.find(s => s.value === type);
  return sectionType?.label || type;
};

export function EditableSectionsPanel({ projectId, websiteContent, onUpdate }: EditableSectionsPanelProps) {
  const [editingSection, setEditingSection] = useState<SectionContent | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<string | null>(null);
  const [selectedNewSectionType, setSelectedNewSectionType] = useState<string>("");
  const [insertPosition, setInsertPosition] = useState<number>(0);
  const { toast } = useToast();
  const qc = useQueryClient();

  const pages = websiteContent?.pages || [];
  const homePage = pages.find(p => p.slug === "home") || pages[0];
  const sections = homePage?.sections || [];

  const updateSectionsMutation = useMutation({
    mutationFn: async (updatedSections: SectionContent[]) => {
      const response = await apiRequest(
        "PATCH",
        `/api/projects/${projectId}/website-content`,
        {
          pages: pages.map(page => 
            page.slug === (homePage?.slug || "home")
              ? { ...page, sections: updatedSections }
              : page
          )
        }
      );
      return response.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/projects", projectId, "website-plan"] });
      onUpdate();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update sections",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const addSectionMutation = useMutation({
    mutationFn: async ({ type, position }: { type: string; position: number }) => {
      const newSection: SectionContent = {
        id: `section-${Date.now()}`,
        type: type as SectionContent["type"],
        data: getDefaultDataForType(type),
      };
      
      const updatedSections = [...sections];
      updatedSections.splice(position, 0, newSection);
      const reorderedSections = updatedSections;
      
      const response = await apiRequest(
        "PATCH",
        `/api/projects/${projectId}/website-content`,
        {
          pages: pages.map(page => 
            page.slug === (homePage?.slug || "home")
              ? { ...page, sections: reorderedSections }
              : page
          )
        }
      );
      return response.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/projects", projectId, "website-plan"] });
      toast({
        title: "Section added",
        description: "New section has been added to your page.",
      });
      setAddDialogOpen(false);
      setSelectedNewSectionType("");
      onUpdate();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to add section",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const moveSection = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= sections.length) return;
    
    const updatedSections = [...sections];
    const [movedSection] = updatedSections.splice(index, 1);
    updatedSections.splice(newIndex, 0, movedSection);
    
    updateSectionsMutation.mutate(updatedSections);
  };

  const duplicateSection = (index: number) => {
    const sectionToDuplicate = sections[index];
    const duplicatedSection: SectionContent = {
      ...sectionToDuplicate,
      id: `section-${Date.now()}`,
    };
    
    const updatedSections = [...sections];
    updatedSections.splice(index + 1, 0, duplicatedSection);
    
    updateSectionsMutation.mutate(updatedSections);
    toast({
      title: "Section duplicated",
      description: "A copy of the section has been created.",
    });
  };

  const deleteSection = (sectionId: string) => {
    const updatedSections = sections.filter(s => s.id !== sectionId);
    
    updateSectionsMutation.mutate(updatedSections);
    setDeleteDialogOpen(null);
    toast({
      title: "Section deleted",
      description: "The section has been removed from your page.",
    });
  };

  const getDefaultDataForType = (type: string): Record<string, unknown> => {
    switch (type) {
      case "hero":
        return {
          headline: "Your Headline Here",
          subheadline: "Add your compelling subheadline",
          primaryCta: { text: "Get Started", href: "#" },
          secondaryCta: { text: "Learn More", href: "#about" },
        };
      case "features":
        return {
          title: "Our Features",
          subtitle: "Why choose us",
          items: [
            { title: "Feature 1", description: "Description of feature 1", icon: "star" },
            { title: "Feature 2", description: "Description of feature 2", icon: "zap" },
            { title: "Feature 3", description: "Description of feature 3", icon: "shield" },
          ],
        };
      case "testimonials":
        return {
          title: "What Our Customers Say",
          items: [
            { quote: "Amazing service!", author: "Customer Name", role: "CEO, Company", rating: 5 },
          ],
        };
      case "stats":
        return {
          title: "By The Numbers",
          items: [
            { value: "100+", label: "Customers" },
            { value: "50+", label: "Projects" },
            { value: "99%", label: "Satisfaction" },
          ],
        };
      case "pricing":
        return {
          title: "Pricing Plans",
          subtitle: "Choose the plan that works for you",
          plans: [
            { name: "Basic", price: "$9", period: "/month", features: ["Feature 1", "Feature 2"], cta: { text: "Start Free", href: "#" } },
            { name: "Pro", price: "$29", period: "/month", features: ["All Basic features", "Feature 3"], popular: true, cta: { text: "Get Pro", href: "#" } },
          ],
        };
      case "cta":
        return {
          headline: "Ready to Get Started?",
          subheadline: "Join thousands of satisfied customers",
          primaryCta: { text: "Get Started", href: "#" },
        };
      case "contact":
        return {
          title: "Contact Us",
          subtitle: "Get in touch with our team",
          email: "hello@example.com",
          phone: "+1 (555) 123-4567",
        };
      case "services":
        return {
          title: "Our Services",
          subtitle: "What we offer",
          items: [
            { title: "Service 1", description: "Description of service 1", icon: "briefcase" },
            { title: "Service 2", description: "Description of service 2", icon: "code" },
          ],
        };
      case "team":
        return {
          title: "Meet Our Team",
          members: [
            { name: "Team Member", role: "Position", bio: "Short bio here" },
          ],
        };
      case "faq":
        return {
          title: "Frequently Asked Questions",
          items: [
            { question: "What is your service?", answer: "Our service provides..." },
            { question: "How does it work?", answer: "It works by..." },
          ],
        };
      case "gallery":
        return {
          title: "Our Gallery",
          images: [],
        };
      case "text":
        return {
          title: "Section Title",
          content: "Your content goes here...",
        };
      default:
        return {};
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-4">
          <div>
            <CardTitle className="text-lg">Section Manager</CardTitle>
            <CardDescription>
              Reorder, add, edit, or remove sections from your page
            </CardDescription>
          </div>
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-add-section">
                <Plus className="w-4 h-4 mr-2" />
                Add Section
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Section</DialogTitle>
                <DialogDescription>
                  Choose a section type and where to insert it
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Section Type</label>
                  <Select value={selectedNewSectionType} onValueChange={setSelectedNewSectionType}>
                    <SelectTrigger data-testid="select-section-type">
                      <SelectValue placeholder="Choose a section type" />
                    </SelectTrigger>
                    <SelectContent>
                      {SECTION_TYPES.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <type.icon className="w-4 h-4" />
                            <span>{type.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Insert Position</label>
                  <Select value={insertPosition.toString()} onValueChange={(v) => setInsertPosition(parseInt(v))}>
                    <SelectTrigger data-testid="select-insert-position">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">At the beginning</SelectItem>
                      {sections.map((section, index) => (
                        <SelectItem key={section.id} value={(index + 1).toString()}>
                          After {getSectionLabel(section.type)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={() => addSectionMutation.mutate({ type: selectedNewSectionType, position: insertPosition })}
                  disabled={!selectedNewSectionType || addSectionMutation.isPending}
                  data-testid="button-confirm-add-section"
                >
                  {addSectionMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    "Add Section"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {sections.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Layout className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No sections yet. Add your first section to get started.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {sections.map((section, index) => {
                const Icon = getSectionIcon(section.type);
                return (
                  <div 
                    key={section.id}
                    className="flex items-center gap-3 p-3 rounded-lg border bg-card hover-elevate"
                    data-testid={`section-item-${section.id}`}
                  >
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <GripVertical className="w-4 h-4 cursor-grab" />
                      <span className="text-sm font-medium w-6 text-center">{index + 1}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className="p-1.5 rounded-md bg-primary/10">
                        <Icon className="w-4 h-4" style={{ color: "hsl(var(--primary))" }} />
                      </div>
                      <span className="font-medium truncate">{getSectionLabel(section.type)}</span>
                      <Badge variant="secondary" className="text-xs">
                        {section.type}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => moveSection(index, "up")}
                        disabled={index === 0 || updateSectionsMutation.isPending}
                        data-testid={`button-move-up-${section.id}`}
                      >
                        <ArrowUp className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => moveSection(index, "down")}
                        disabled={index === sections.length - 1 || updateSectionsMutation.isPending}
                        data-testid={`button-move-down-${section.id}`}
                      >
                        <ArrowDown className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingSection(section)}
                        data-testid={`button-edit-${section.id}`}
                      >
                        <Wand2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => duplicateSection(index)}
                        disabled={updateSectionsMutation.isPending}
                        data-testid={`button-duplicate-${section.id}`}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Dialog open={deleteDialogOpen === section.id} onOpenChange={(open) => setDeleteDialogOpen(open ? section.id : null)}>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            data-testid={`button-delete-${section.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Delete Section</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to delete this {getSectionLabel(section.type)} section? 
                              This action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setDeleteDialogOpen(null)}>
                              Cancel
                            </Button>
                            <Button 
                              variant="destructive" 
                              onClick={() => deleteSection(section.id)}
                              data-testid="button-confirm-delete"
                            >
                              Delete
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
      
      {editingSection && (
        <SectionEditor
          projectId={projectId}
          section={editingSection}
          pageSlug={homePage?.slug || "home"}
          onClose={() => setEditingSection(null)}
          onUpdate={() => {
            setEditingSection(null);
            onUpdate();
          }}
        />
      )}
    </div>
  );
}
