import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { SelectedElement } from "@/pages/visual-editor";

interface StyleEditorProps {
  element: SelectedElement;
  onChange: (stylePath: string, value: any) => void;
}

export function StyleEditor({ element, onChange }: StyleEditorProps) {
  const currentStyle = (typeof element.value === "object" && element.value?.style) || {};

  return (
    <div className="space-y-6" data-testid="style-editor">
      <div className="space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Colors</h4>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Text Color</Label>
            <Input
              type="color"
              value={currentStyle.color || "#000000"}
              onChange={(e) => onChange("color", e.target.value)}
              className="h-9 mt-1 cursor-pointer"
              data-testid="input-text-color"
            />
          </div>
          <div>
            <Label className="text-xs">Background</Label>
            <Input
              type="color"
              value={currentStyle.backgroundColor || "#ffffff"}
              onChange={(e) => onChange("backgroundColor", e.target.value)}
              className="h-9 mt-1 cursor-pointer"
              data-testid="input-bg-color"
            />
          </div>
        </div>
      </div>

      {element.type === "text" && (
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Typography</h4>

          <div>
            <div className="flex justify-between">
              <Label className="text-xs">Font Size</Label>
              <span className="text-xs text-muted-foreground">{parseInt(currentStyle.fontSize) || 16}px</span>
            </div>
            <Slider
              value={[parseInt(currentStyle.fontSize) || 16]}
              onValueChange={([v]) => onChange("fontSize", `${v}px`)}
              min={12}
              max={96}
              step={1}
              className="mt-2"
              data-testid="slider-font-size"
            />
          </div>

          <div>
            <Label className="text-xs">Font Weight</Label>
            <Select
              value={currentStyle.fontWeight || "400"}
              onValueChange={(v) => onChange("fontWeight", v)}
            >
              <SelectTrigger className="mt-1" data-testid="select-font-weight">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="300">Light (300)</SelectItem>
                <SelectItem value="400">Regular (400)</SelectItem>
                <SelectItem value="500">Medium (500)</SelectItem>
                <SelectItem value="600">Semibold (600)</SelectItem>
                <SelectItem value="700">Bold (700)</SelectItem>
                <SelectItem value="800">Extra Bold (800)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <div className="flex justify-between">
              <Label className="text-xs">Line Height</Label>
              <span className="text-xs text-muted-foreground">{(parseFloat(currentStyle.lineHeight) || 1.5).toFixed(1)}</span>
            </div>
            <Slider
              value={[parseFloat(currentStyle.lineHeight) || 1.5]}
              onValueChange={([v]) => onChange("lineHeight", v.toString())}
              min={1}
              max={3}
              step={0.1}
              className="mt-2"
            />
          </div>

          <div>
            <div className="flex justify-between">
              <Label className="text-xs">Letter Spacing</Label>
              <span className="text-xs text-muted-foreground">{(parseFloat(currentStyle.letterSpacing) || 0).toFixed(2)}em</span>
            </div>
            <Slider
              value={[parseFloat(currentStyle.letterSpacing) || 0]}
              onValueChange={([v]) => onChange("letterSpacing", `${v}em`)}
              min={-0.1}
              max={0.5}
              step={0.01}
              className="mt-2"
            />
          </div>
        </div>
      )}

      <div className="space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Spacing</h4>
        <div>
          <div className="flex justify-between">
            <Label className="text-xs">Padding</Label>
            <span className="text-xs text-muted-foreground">{parseInt(currentStyle.padding) || 0}px</span>
          </div>
          <Slider
            value={[parseInt(currentStyle.padding) || 0]}
            onValueChange={([v]) => onChange("padding", `${v}px`)}
            min={0}
            max={100}
            step={4}
            className="mt-2"
          />
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Borders</h4>
        <div>
          <div className="flex justify-between">
            <Label className="text-xs">Border Radius</Label>
            <span className="text-xs text-muted-foreground">{parseInt(currentStyle.borderRadius) || 0}px</span>
          </div>
          <Slider
            value={[parseInt(currentStyle.borderRadius) || 0]}
            onValueChange={([v]) => onChange("borderRadius", `${v}px`)}
            min={0}
            max={50}
            step={1}
            className="mt-2"
          />
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Effects</h4>
        <div>
          <div className="flex justify-between">
            <Label className="text-xs">Opacity</Label>
            <span className="text-xs text-muted-foreground">{Math.round((parseFloat(currentStyle.opacity) || 1) * 100)}%</span>
          </div>
          <Slider
            value={[parseFloat(currentStyle.opacity) || 1]}
            onValueChange={([v]) => onChange("opacity", v.toString())}
            min={0}
            max={1}
            step={0.05}
            className="mt-2"
          />
        </div>

        <div>
          <Label className="text-xs">Shadow</Label>
          <Select
            value={currentStyle.boxShadow || "none"}
            onValueChange={(v) => onChange("boxShadow", v)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="0 1px 3px rgba(0,0,0,0.12)">Small</SelectItem>
              <SelectItem value="0 4px 16px rgba(0,0,0,0.1)">Medium</SelectItem>
              <SelectItem value="0 10px 30px rgba(0,0,0,0.15)">Large</SelectItem>
              <SelectItem value="0 20px 60px rgba(0,0,0,0.2)">Extra Large</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
