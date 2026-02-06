import { useState, useEffect, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function TextEditor({ value, onChange }: TextEditorProps) {
  const [localValue, setLocalValue] = useState(value);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (newValue: string) => {
    setLocalValue(newValue);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onChange(newValue);
    }, 400);
  };

  return (
    <div className="space-y-4" data-testid="text-editor">
      <div>
        <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">Text Content</Label>
        <Textarea
          value={localValue}
          onChange={(e) => handleChange(e.target.value)}
          className="min-h-[120px] text-sm"
          data-testid="input-text-content"
        />
      </div>

      <div className="text-xs text-muted-foreground">
        {localValue.length} characters
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            const upper = localValue.toUpperCase();
            setLocalValue(upper);
            onChange(upper);
          }}
          data-testid="button-uppercase"
        >
          UPPERCASE
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            const lower = localValue.toLowerCase();
            setLocalValue(lower);
            onChange(lower);
          }}
          data-testid="button-lowercase"
        >
          lowercase
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            const title = localValue
              .toLowerCase()
              .split(" ")
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ");
            setLocalValue(title);
            onChange(title);
          }}
          data-testid="button-titlecase"
        >
          Title Case
        </Button>
      </div>
    </div>
  );
}
