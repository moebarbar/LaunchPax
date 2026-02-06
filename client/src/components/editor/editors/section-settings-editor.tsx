import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { SelectedElement } from "@/pages/visual-editor";
import type { WebsiteContent } from "@shared/schema";

interface SectionSettingsEditorProps {
  projectId: number;
  selectedElement: SelectedElement;
  websiteContent: WebsiteContent;
  onChange: (path: string, value: any) => void;
  onClose: () => void;
}

export function SectionSettingsEditor({
  projectId,
  selectedElement,
  websiteContent,
  onChange,
  onClose,
}: SectionSettingsEditorProps) {
  const section = selectedElement.value;
  const data = section?.data || {};
  const basePath = selectedElement.path;

  return (
    <div className="flex flex-col h-full" data-testid="section-settings">
      <div className="flex items-center justify-between gap-2 p-3 border-b flex-shrink-0">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold truncate">{selectedElement.label}</h3>
          <p className="text-xs text-muted-foreground">Section Settings</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} data-testid="button-close-section-settings">
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-4">
        <div>
          <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">Section Type</Label>
          <p className="text-sm font-medium capitalize">{section?.type?.replace(/_/g, " ") || "Unknown"}</p>
        </div>

        {data.headline !== undefined && (
          <div>
            <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">Headline</Label>
            <Input
              value={data.headline || ""}
              onChange={(e) => onChange(`${basePath}.data.headline`, e.target.value)}
              data-testid="input-section-headline"
            />
          </div>
        )}

        {data.subheadline !== undefined && (
          <div>
            <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">Subheadline</Label>
            <Textarea
              value={data.subheadline || ""}
              onChange={(e) => onChange(`${basePath}.data.subheadline`, e.target.value)}
              className="min-h-[80px] text-sm"
              data-testid="input-section-subheadline"
            />
          </div>
        )}

        {data.body !== undefined && (
          <div>
            <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">Body Text</Label>
            <Textarea
              value={data.body || ""}
              onChange={(e) => onChange(`${basePath}.data.body`, e.target.value)}
              className="min-h-[120px] text-sm"
              data-testid="input-section-body"
            />
          </div>
        )}

        {data.ctaText !== undefined && (
          <div>
            <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">CTA Text</Label>
            <Input
              value={data.ctaText || ""}
              onChange={(e) => onChange(`${basePath}.data.ctaText`, e.target.value)}
              data-testid="input-section-cta"
            />
          </div>
        )}

        {data.ctaLink !== undefined && (
          <div>
            <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">CTA Link</Label>
            <Input
              value={data.ctaLink || ""}
              onChange={(e) => onChange(`${basePath}.data.ctaLink`, e.target.value)}
              placeholder="https://..."
              data-testid="input-section-cta-link"
            />
          </div>
        )}

        {(data.items || data.tiers || data.members || data.steps) && (
          <div>
            <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">
              Items ({(data.items || data.tiers || data.members || data.steps || []).length})
            </Label>
            <p className="text-xs text-muted-foreground">
              Click individual items in the preview to edit them directly.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
