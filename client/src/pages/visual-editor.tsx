import { useState, useCallback } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Undo2, Redo2, Eye, Monitor, Smartphone, PanelRightClose, PanelRight } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { InteractivePreview } from "@/components/editor/interactive-preview";
import { EditorPanel } from "@/components/editor/editor-panel";
import { useEditorKeyboardShortcuts } from "@/components/editor/keyboard-shortcuts";
import type { WebsiteContent } from "@shared/schema";

export interface SelectedElement {
  type: "text" | "image" | "section" | "block" | "button";
  sectionId: string;
  sectionIndex: number;
  path: string;
  value: any;
  label: string;
  fieldKey?: string;
}

export interface EditHistory {
  past: any[];
  future: any[];
}

export default function VisualEditorPage() {
  const params = useParams<{ id: string }>();
  const projectId = parseInt(params.id || "0");
  const { toast } = useToast();
  const { user, isLoading: authLoading } = useAuth();
  const [, navigate] = useLocation();

  const [selectedElement, setSelectedElement] = useState<SelectedElement | null>(null);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [editHistory, setEditHistory] = useState<EditHistory>({ past: [], future: [] });
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
  const [editorOpen, setEditorOpen] = useState(true);
  const [mobileView, setMobileView] = useState<"preview" | "editor">("preview");

  const { data: websiteContent, isLoading } = useQuery<WebsiteContent>({
    queryKey: ["/api/projects", projectId, "website-plan"],
    enabled: !!user,
  });

  const handleElementClick = useCallback((element: SelectedElement) => {
    if (websiteContent) {
      setEditHistory(prev => ({
        past: [...prev.past.slice(-20), JSON.parse(JSON.stringify(websiteContent))],
        future: [],
      }));
    }
    setSelectedElement(element);
    setEditorOpen(true);
    if (window.innerWidth < 1024) {
      setMobileView("editor");
    }
  }, [websiteContent]);

  const handleElementChange = useCallback(async (path: string, value: any) => {
    try {
      const prevData = queryClient.getQueryData<WebsiteContent>(["/api/projects", projectId, "website-plan"]);
      
      const updated = applyUpdateToContent(prevData, path, value);
      queryClient.setQueryData(["/api/projects", projectId, "website-plan"], updated);

      await apiRequest("PATCH", `/api/projects/${projectId}/website/element`, {
        path,
        value,
      });
    } catch (error) {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "website-plan"] });
      toast({
        title: "Update failed",
        description: "Your change couldn't be saved. Please try again.",
        variant: "destructive",
      });
    }
  }, [projectId, toast]);

  const handleUndo = useCallback(() => {
    if (editHistory.past.length === 0) return;
    const previous = editHistory.past[editHistory.past.length - 1];
    const current = queryClient.getQueryData<WebsiteContent>(["/api/projects", projectId, "website-plan"]);
    setEditHistory(prev => ({
      past: prev.past.slice(0, -1),
      future: [current, ...prev.future].slice(0, 20),
    }));
    queryClient.setQueryData(["/api/projects", projectId, "website-plan"], previous);
    apiRequest("PATCH", `/api/projects/${projectId}/website/element`, {
      path: "__full_restore",
      value: previous,
    }).catch(() => {});
  }, [editHistory, projectId]);

  const handleRedo = useCallback(() => {
    if (editHistory.future.length === 0) return;
    const next = editHistory.future[0];
    const current = queryClient.getQueryData<WebsiteContent>(["/api/projects", projectId, "website-plan"]);
    setEditHistory(prev => ({
      past: [...prev.past, current],
      future: prev.future.slice(1),
    }));
    queryClient.setQueryData(["/api/projects", projectId, "website-plan"], next);
    apiRequest("PATCH", `/api/projects/${projectId}/website/element`, {
      path: "__full_restore",
      value: next,
    }).catch(() => {});
  }, [editHistory, projectId]);

  useEditorKeyboardShortcuts({
    onUndo: handleUndo,
    onRedo: handleRedo,
    onEscape: () => setSelectedElement(null),
  });

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>
    );
  }

  if (!user) {
    navigate("/");
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="space-y-4 text-center">
          <Skeleton className="h-12 w-12 rounded-full mx-auto" />
          <Skeleton className="h-4 w-48 mx-auto" />
          <p className="text-sm text-muted-foreground">Loading editor...</p>
        </div>
      </div>
    );
  }

  if (!websiteContent || !websiteContent.pages?.length) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold">No website content found</h2>
          <p className="text-muted-foreground">Generate your website first before using the visual editor.</p>
          <Link href={`/project/${projectId}`}>
            <Button data-testid="button-back-to-project">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Project
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-muted/30" data-testid="visual-editor-page">
      <div className="flex items-center justify-between gap-2 px-3 py-2 border-b bg-background flex-shrink-0 z-20">
        <div className="flex items-center gap-2 flex-wrap">
          <Link href={`/project/${projectId}`}>
            <Button variant="ghost" size="sm" data-testid="button-back-project">
              <ArrowLeft className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Back</span>
            </Button>
          </Link>
          <div className="h-5 w-px bg-border hidden sm:block" />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleUndo}
            disabled={editHistory.past.length === 0}
            data-testid="button-undo"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRedo}
            disabled={editHistory.future.length === 0}
            data-testid="button-redo"
            title="Redo (Ctrl+Shift+Z)"
          >
            <Redo2 className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center border rounded-md overflow-hidden">
            <Button
              variant={viewMode === "desktop" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("desktop")}
              className="rounded-none"
              data-testid="button-view-desktop"
            >
              <Monitor className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "mobile" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("mobile")}
              className="rounded-none"
              data-testid="button-view-mobile"
            >
              <Smartphone className="w-4 h-4" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              const token = (websiteContent as any).previewToken;
              if (token) window.open(`/preview/${token}`, "_blank");
            }}
            data-testid="button-preview-external"
            title="Open preview"
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setEditorOpen(prev => !prev)}
            data-testid="button-toggle-editor"
            title={editorOpen ? "Hide editor panel" : "Show editor panel"}
            className="hidden lg:flex"
          >
            {editorOpen ? <PanelRightClose className="w-4 h-4" /> : <PanelRight className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      <div className="lg:hidden flex border-b bg-background">
        <button
          className={`flex-1 py-2 text-sm font-medium text-center transition-colors ${mobileView === "preview" ? "border-b-2 border-primary text-foreground" : "text-muted-foreground"}`}
          onClick={() => setMobileView("preview")}
          data-testid="button-mobile-preview"
        >
          Preview
        </button>
        <button
          className={`flex-1 py-2 text-sm font-medium text-center transition-colors ${mobileView === "editor" ? "border-b-2 border-primary text-foreground" : "text-muted-foreground"}`}
          onClick={() => setMobileView("editor")}
          data-testid="button-mobile-editor"
        >
          Editor
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden min-h-0">
        <div
          className={`flex-1 overflow-auto ${mobileView === "editor" ? "hidden lg:block" : ""}`}
          style={{ flexBasis: editorOpen ? "60%" : "100%" }}
        >
          <div
            className={`mx-auto transition-all duration-300 ${
              viewMode === "mobile" ? "max-w-[400px]" : ""
            }`}
            style={{ minHeight: "100%" }}
          >
            <InteractivePreview
              websiteContent={websiteContent}
              selectedElement={selectedElement}
              hoveredSection={hoveredSection}
              onElementClick={handleElementClick}
              onHoverSection={setHoveredSection}
              onElementChange={handleElementChange}
            />
          </div>
        </div>

        {editorOpen && (
          <div
            className={`border-l bg-background overflow-auto ${
              mobileView === "preview" ? "hidden lg:block" : "w-full lg:w-auto"
            }`}
            style={{ flexBasis: "40%", maxWidth: "480px", minWidth: "320px" }}
          >
            <EditorPanel
              projectId={projectId}
              selectedElement={selectedElement}
              websiteContent={websiteContent}
              onChange={handleElementChange}
              onClose={() => setSelectedElement(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function applyUpdateToContent(content: any, path: string, value: any): any {
  if (!content) return content;
  if (path === "__full_restore") return value;

  const cloned = JSON.parse(JSON.stringify(content));
  const pathParts = path.split(".");

  let current: any = cloned;
  for (let i = 0; i < pathParts.length - 1; i++) {
    const part = pathParts[i];
    const arrayMatch = part.match(/^(.+)\[(\d+)\]$/);
    if (arrayMatch) {
      const [, arrayName, index] = arrayMatch;
      if (!current[arrayName]) return cloned;
      current = current[arrayName][parseInt(index)];
    } else {
      if (current[part] === undefined) current[part] = {};
      current = current[part];
    }
    if (!current) return cloned;
  }

  const finalKey = pathParts[pathParts.length - 1];
  const finalArrayMatch = finalKey.match(/^(.+)\[(\d+)\]$/);
  if (finalArrayMatch) {
    const [, arrayName, index] = finalArrayMatch;
    if (current[arrayName]) {
      current[arrayName][parseInt(index)] = value;
    }
  } else {
    current[finalKey] = value;
  }

  return cloned;
}
