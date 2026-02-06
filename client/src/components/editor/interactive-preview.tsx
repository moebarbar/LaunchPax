import { useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, Copy, Trash2, Settings, Plus } from "lucide-react";
import type { WebsiteContent, SectionContent, GlobalContent, SeoMeta } from "@shared/schema";
import type { SelectedElement } from "@/pages/visual-editor";
import { EditableSection } from "./editable-section";

interface InteractivePreviewProps {
  websiteContent: WebsiteContent;
  selectedElement: SelectedElement | null;
  hoveredSection: string | null;
  onElementClick: (element: SelectedElement) => void;
  onHoverSection: (sectionId: string | null) => void;
  onElementChange: (path: string, value: any) => void;
}

export function InteractivePreview({
  websiteContent,
  selectedElement,
  hoveredSection,
  onElementClick,
  onHoverSection,
  onElementChange,
}: InteractivePreviewProps) {
  const pages = websiteContent.pages || [];
  const homePage = pages.find(p => p.slug === "home") || pages[0];
  const sections = homePage?.sections || [];
  const siteSettings = websiteContent.siteSettings;
  const globalContent = websiteContent.globalContent;

  const moveSection = useCallback((fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= sections.length) return;
    const newSections = [...sections];
    const [moved] = newSections.splice(fromIndex, 1);
    newSections.splice(toIndex, 0, moved);
    const pageSlug = homePage?.slug || "home";
    const updatedPages = pages.map(p => p.slug === pageSlug ? { ...p, sections: newSections } : p);
    onElementChange("pages", updatedPages);
  }, [sections, pages, homePage, onElementChange]);

  const duplicateSection = useCallback((index: number) => {
    const section = sections[index];
    const newSection = {
      ...JSON.parse(JSON.stringify(section)),
      id: `${section.type}-${Date.now()}`,
    };
    const newSections = [...sections];
    newSections.splice(index + 1, 0, newSection);
    const pageSlug = homePage?.slug || "home";
    const updatedPages = pages.map(p => p.slug === pageSlug ? { ...p, sections: newSections } : p);
    onElementChange("pages", updatedPages);
  }, [sections, pages, homePage, onElementChange]);

  const deleteSection = useCallback((index: number) => {
    const newSections = sections.filter((_, i) => i !== index);
    const pageSlug = homePage?.slug || "home";
    const updatedPages = pages.map(p => p.slug === pageSlug ? { ...p, sections: newSections } : p);
    onElementChange("pages", updatedPages);
  }, [sections, pages, homePage, onElementChange]);

  return (
    <div className="website-editor-preview" data-testid="interactive-preview">
      {sections.map((section, index) => (
        <div
          key={section.id}
          className="relative group/section"
          onMouseEnter={() => onHoverSection(section.id)}
          onMouseLeave={() => onHoverSection(null)}
        >
          {hoveredSection === section.id && (
            <SectionHoverToolbar
              sectionIndex={index}
              totalSections={sections.length}
              sectionType={section.type}
              onMoveUp={() => moveSection(index, index - 1)}
              onMoveDown={() => moveSection(index, index + 1)}
              onDuplicate={() => duplicateSection(index)}
              onDelete={() => deleteSection(index)}
              onSettings={() => onElementClick({
                type: "section",
                sectionId: section.id,
                sectionIndex: index,
                path: `pages[0].sections[${index}]`,
                value: section,
                label: `${formatSectionType(section.type)} Section`,
              })}
            />
          )}

          <EditableSection
            section={section}
            sectionIndex={index}
            selectedElement={selectedElement}
            onElementClick={onElementClick}
            siteSettings={siteSettings}
            globalContent={globalContent}
          />
        </div>
      ))}

      <div className="py-8 flex justify-center">
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => onElementClick({
            type: "section",
            sectionId: "__add_new",
            sectionIndex: sections.length,
            path: "__add_section",
            value: null,
            label: "Add New Section",
          })}
          data-testid="button-add-section"
        >
          <Plus className="w-4 h-4" />
          Add Section
        </Button>
      </div>
    </div>
  );
}

function SectionHoverToolbar({
  sectionIndex,
  totalSections,
  sectionType,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
  onSettings,
}: {
  sectionIndex: number;
  totalSections: number;
  sectionType: string;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onSettings: () => void;
}) {
  return (
    <div
      className="absolute top-2 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 bg-background/95 backdrop-blur border rounded-md shadow-lg px-2 py-1"
      style={{ pointerEvents: "auto" }}
      data-testid={`section-toolbar-${sectionIndex}`}
    >
      <span className="text-xs font-medium text-muted-foreground px-1 select-none">
        {formatSectionType(sectionType)}
      </span>
      <div className="h-4 w-px bg-border" />
      {sectionIndex > 0 && (
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onMoveUp} data-testid={`button-move-up-${sectionIndex}`}>
          <ArrowUp className="w-3.5 h-3.5" />
        </Button>
      )}
      {sectionIndex < totalSections - 1 && (
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onMoveDown} data-testid={`button-move-down-${sectionIndex}`}>
          <ArrowDown className="w-3.5 h-3.5" />
        </Button>
      )}
      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onDuplicate} data-testid={`button-duplicate-${sectionIndex}`}>
        <Copy className="w-3.5 h-3.5" />
      </Button>
      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onSettings} data-testid={`button-settings-${sectionIndex}`}>
        <Settings className="w-3.5 h-3.5" />
      </Button>
      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={onDelete} data-testid={`button-delete-${sectionIndex}`}>
        <Trash2 className="w-3.5 h-3.5" />
      </Button>
    </div>
  );
}

function formatSectionType(type: string): string {
  return type
    .replace(/_/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase());
}
