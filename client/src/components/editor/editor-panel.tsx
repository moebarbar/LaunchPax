import { X, MousePointer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TextEditor } from "./editors/text-editor";
import { ImageEditor } from "./editors/image-editor";
import { StyleEditor } from "./editors/style-editor";
import { AIAssistEditor } from "./editors/ai-assist-editor";
import { SectionSettingsEditor } from "./editors/section-settings-editor";
import { AddSectionPanel } from "./editors/add-section-panel";
import type { SelectedElement } from "@/pages/visual-editor";
import type { WebsiteContent } from "@shared/schema";

interface EditorPanelProps {
  projectId: number;
  selectedElement: SelectedElement | null;
  websiteContent: WebsiteContent;
  onChange: (path: string, value: any) => void;
  onClose: () => void;
}

export function EditorPanel({
  projectId,
  selectedElement,
  websiteContent,
  onChange,
  onClose,
}: EditorPanelProps) {
  if (!selectedElement) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center" data-testid="editor-empty-state">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <MousePointer className="w-7 h-7 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Select an element</h3>
        <p className="text-sm text-muted-foreground max-w-[240px]">
          Click any text, image, or section on the website preview to start editing.
        </p>
      </div>
    );
  }

  if (selectedElement.path === "__add_section") {
    return (
      <AddSectionPanel
        projectId={projectId}
        websiteContent={websiteContent}
        onChange={onChange}
        onClose={onClose}
      />
    );
  }

  if (selectedElement.type === "section") {
    return (
      <SectionSettingsEditor
        projectId={projectId}
        selectedElement={selectedElement}
        websiteContent={websiteContent}
        onChange={onChange}
        onClose={onClose}
      />
    );
  }

  return (
    <div className="flex flex-col h-full" data-testid="editor-panel">
      <div className="flex items-center justify-between gap-2 p-3 border-b flex-shrink-0">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold truncate">{selectedElement.label}</h3>
          <p className="text-xs text-muted-foreground truncate">{selectedElement.type}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} data-testid="button-close-editor">
          <X className="w-4 h-4" />
        </Button>
      </div>

      <Tabs defaultValue="content" className="flex-1 flex flex-col min-h-0">
        <TabsList className="w-full justify-start px-3 pt-2 bg-transparent flex-shrink-0">
          <TabsTrigger value="content" data-testid="tab-content">Content</TabsTrigger>
          <TabsTrigger value="style" data-testid="tab-style">Style</TabsTrigger>
          <TabsTrigger value="ai" data-testid="tab-ai">AI Assist</TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-auto">
          <TabsContent value="content" className="p-4 mt-0">
            {selectedElement.type === "text" && (
              <TextEditor
                value={selectedElement.value}
                onChange={(newValue: string) => onChange(selectedElement.path, newValue)}
              />
            )}
            {selectedElement.type === "image" && (
              <ImageEditor
                projectId={projectId}
                image={selectedElement.value}
                onChange={(newImage: string | { url: string; alt?: string }) => onChange(selectedElement.path, typeof newImage === "string" ? newImage : newImage.url || newImage)}
              />
            )}
            {selectedElement.type === "button" && (
              <TextEditor
                value={selectedElement.value}
                onChange={(newValue: string) => onChange(selectedElement.path, newValue)}
              />
            )}
          </TabsContent>

          <TabsContent value="style" className="p-4 mt-0">
            <StyleEditor
              element={selectedElement}
              onChange={(stylePath: string, styleValue: string) => {
                const fullPath = selectedElement.path.replace(/\.[^.]+$/, `.style.${stylePath}`);
                onChange(fullPath, styleValue);
              }}
            />
          </TabsContent>

          <TabsContent value="ai" className="p-4 mt-0">
            <AIAssistEditor
              projectId={projectId}
              element={selectedElement}
              onChange={(newValue: string) => onChange(selectedElement.path, newValue)}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
