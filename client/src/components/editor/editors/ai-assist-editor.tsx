import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Sparkles, Wand2, Loader2, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { SelectedElement } from "@/pages/visual-editor";

interface AIAssistEditorProps {
  projectId: number;
  element: SelectedElement;
  onChange: (value: any) => void;
}

export function AIAssistEditor({ projectId, element, onChange }: AIAssistEditorProps) {
  const [prompt, setPrompt] = useState("");
  const [isRefining, setIsRefining] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { toast } = useToast();

  const handleAIRefine = async () => {
    if (!prompt.trim()) return;
    setIsRefining(true);
    try {
      const res = await apiRequest("POST", `/api/projects/${projectId}/editor/ai-refine`, {
        currentValue: element.value,
        elementType: element.type,
        instruction: prompt,
      });
      const data = await res.json();
      if (data.refined) {
        onChange(data.refined);
        setPrompt("");
        toast({ title: "Content refined" });
      }
    } catch {
      toast({ title: "AI refinement failed. Try again.", variant: "destructive" });
    } finally {
      setIsRefining(false);
    }
  };

  const handleQuickAction = async (action: string) => {
    setIsRefining(true);
    try {
      const res = await apiRequest("POST", `/api/projects/${projectId}/editor/ai-quick-action`, {
        currentValue: element.value,
        elementType: element.type,
        action,
      });
      const data = await res.json();
      if (data.result) {
        onChange(data.result);
        toast({ title: "Content updated" });
      }
    } catch {
      toast({ title: "Action failed. Try again.", variant: "destructive" });
    } finally {
      setIsRefining(false);
    }
  };

  const handleGenerateVariations = async () => {
    setIsRefining(true);
    try {
      const res = await apiRequest("POST", `/api/projects/${projectId}/editor/ai-variations`, {
        currentValue: element.value,
        elementType: element.type,
        count: 3,
      });
      const data = await res.json();
      if (data.variations) {
        setSuggestions(data.variations);
      }
    } catch {
      toast({ title: "Failed to generate variations.", variant: "destructive" });
    } finally {
      setIsRefining(false);
    }
  };

  return (
    <div className="space-y-6" data-testid="ai-assist-editor">
      <div className="space-y-3">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">AI Refinement</Label>
        <p className="text-xs text-muted-foreground">
          Tell AI how to improve this {element.type}
        </p>
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., 'Make it more professional', 'Add urgency', 'Simplify the language'..."
          className="min-h-[80px] text-sm"
          data-testid="input-ai-prompt"
        />
        <Button
          className="w-full"
          onClick={handleAIRefine}
          disabled={isRefining || !prompt.trim()}
          data-testid="button-ai-refine"
        >
          {isRefining ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Wand2 className="w-4 h-4 mr-2" />}
          {isRefining ? "Refining..." : "Refine with AI"}
        </Button>
      </div>

      <div className="space-y-3">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Quick Actions</Label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { key: "make_shorter", label: "Shorter" },
            { key: "make_longer", label: "Longer" },
            { key: "more_professional", label: "Professional" },
            { key: "more_casual", label: "Casual" },
            { key: "add_urgency", label: "Add Urgency" },
            { key: "simplify", label: "Simplify" },
          ].map(({ key, label }) => (
            <Button
              key={key}
              variant="outline"
              size="sm"
              onClick={() => handleQuickAction(key)}
              disabled={isRefining}
              data-testid={`button-quick-${key}`}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Variations</Label>
        <Button
          variant="outline"
          className="w-full"
          onClick={handleGenerateVariations}
          disabled={isRefining}
          data-testid="button-generate-variations"
        >
          {isRefining ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
          Generate 3 Variations
        </Button>

        {suggestions.length > 0 && (
          <div className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="p-3 border rounded-lg cursor-pointer transition-colors hover-elevate text-sm"
                onClick={() => {
                  onChange(suggestion);
                  setSuggestions([]);
                  toast({ title: "Variation applied" });
                }}
                data-testid={`variation-${index}`}
              >
                <p className="line-clamp-3">{suggestion}</p>
                <span className="text-xs text-primary mt-1 inline-block">Use this version</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
