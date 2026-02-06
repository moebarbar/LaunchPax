import { useState } from "react";
import { X, Layout, Star, MessageSquare, BarChart3, DollarSign, Users, HelpCircle, Sparkles, Mail, Image, Type, Briefcase, Footprints, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { WebsiteContent } from "@shared/schema";

interface AddSectionPanelProps {
  projectId: number;
  websiteContent: WebsiteContent;
  onChange: (path: string, value: any) => void;
  onClose: () => void;
}

const SECTION_TEMPLATES = [
  { type: "hero", label: "Hero", icon: Layout, description: "Main banner with headline and CTA" },
  { type: "features", label: "Features", icon: Star, description: "Highlight key features or benefits" },
  { type: "services", label: "Services", icon: Briefcase, description: "List of services offered" },
  { type: "testimonials", label: "Testimonials", icon: MessageSquare, description: "Customer reviews and quotes" },
  { type: "stats", label: "Statistics", icon: BarChart3, description: "Key numbers and metrics" },
  { type: "pricing", label: "Pricing", icon: DollarSign, description: "Pricing plans and packages" },
  { type: "team", label: "Team", icon: Users, description: "Team member profiles" },
  { type: "faq", label: "FAQ", icon: HelpCircle, description: "Frequently asked questions" },
  { type: "cta", label: "Call to Action", icon: Sparkles, description: "Conversion-focused section" },
  { type: "contact", label: "Contact", icon: Mail, description: "Contact form or info" },
  { type: "gallery", label: "Gallery", icon: Image, description: "Image gallery or portfolio" },
  { type: "text", label: "Text Block", icon: Type, description: "Custom text content" },
  { type: "process", label: "Process", icon: Footprints, description: "Step-by-step process" },
  { type: "story", label: "Story", icon: BookOpen, description: "Brand story or about section" },
];

function getDefaultData(type: string): Record<string, any> {
  const defaults: Record<string, any> = {
    hero: { headline: "Your Headline Here", subheadline: "Add your compelling subtitle", ctaText: "Get Started", ctaLink: "#" },
    features: { headline: "Features", subheadline: "What makes us different", items: [{ title: "Feature 1", description: "Description of feature 1" }, { title: "Feature 2", description: "Description of feature 2" }, { title: "Feature 3", description: "Description of feature 3" }] },
    services: { headline: "Our Services", items: [{ title: "Service 1", description: "Service description" }, { title: "Service 2", description: "Service description" }] },
    testimonials: { headline: "What Our Clients Say", items: [{ quote: "This is a testimonial quote.", name: "Jane Doe", role: "CEO" }] },
    stats: { headline: "By the Numbers", items: [{ value: "100+", label: "Clients" }, { value: "99%", label: "Satisfaction" }] },
    pricing: { headline: "Simple Pricing", tiers: [{ name: "Starter", price: "$9/mo", description: "Perfect for getting started" }, { name: "Pro", price: "$29/mo", description: "For growing businesses", highlighted: true }] },
    team: { headline: "Meet the Team", members: [{ name: "Team Member", role: "Role" }] },
    faq: { headline: "Frequently Asked Questions", items: [{ question: "Question here?", answer: "Answer here." }] },
    cta: { headline: "Ready to Get Started?", subheadline: "Join thousands of satisfied customers", ctaText: "Start Now" },
    contact: { headline: "Get in Touch", subheadline: "We'd love to hear from you", email: "hello@example.com" },
    gallery: { headline: "Gallery", images: [] },
    text: { headline: "Section Title", body: "Your content here..." },
    process: { headline: "How It Works", steps: [{ title: "Step 1", description: "Description" }, { title: "Step 2", description: "Description" }] },
    story: { headline: "Our Story", body: "Tell your story here..." },
  };
  return defaults[type] || { headline: "New Section" };
}

export function AddSectionPanel({ projectId, websiteContent, onChange, onClose }: AddSectionPanelProps) {
  const { toast } = useToast();

  const addSection = (type: string) => {
    const pages = websiteContent.pages || [];
    const homePage = pages.find(p => p.slug === "home") || pages[0];
    if (!homePage) return;

    const newSection = {
      id: `${type}-${Date.now()}`,
      type,
      data: getDefaultData(type),
    };

    const updatedSections = [...(homePage.sections || []), newSection];
    const updatedPages = pages.map(p => p.slug === homePage.slug ? { ...p, sections: updatedSections } : p);
    onChange("pages", updatedPages);
    toast({ title: `${type.charAt(0).toUpperCase() + type.slice(1)} section added` });
    onClose();
  };

  return (
    <div className="flex flex-col h-full" data-testid="add-section-panel">
      <div className="flex items-center justify-between gap-2 p-3 border-b flex-shrink-0">
        <div>
          <h3 className="text-sm font-semibold">Add Section</h3>
          <p className="text-xs text-muted-foreground">Choose a section type to add</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} data-testid="button-close-add-section">
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-auto p-3">
        <div className="grid grid-cols-2 gap-2">
          {SECTION_TEMPLATES.map((template) => {
            const Icon = template.icon;
            return (
              <button
                key={template.type}
                className="flex flex-col items-center gap-1.5 p-3 rounded-lg border text-center transition-colors hover-elevate cursor-pointer"
                onClick={() => addSection(template.type)}
                data-testid={`button-add-${template.type}`}
              >
                <Icon className="w-5 h-5 text-muted-foreground" />
                <span className="text-xs font-medium">{template.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
