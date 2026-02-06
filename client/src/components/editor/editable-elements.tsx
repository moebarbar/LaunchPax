import { cn } from "@/lib/utils";
import type { SelectedElement } from "@/pages/visual-editor";

interface EditableTextProps {
  value: string;
  path: string;
  label: string;
  className?: string;
  style?: React.CSSProperties;
  selectedElement: SelectedElement | null;
  onElementClick: (element: SelectedElement) => void;
  basePath: string;
  sectionId: string;
  sectionIndex: number;
}

export function EditableText({
  value,
  path,
  label,
  className,
  style,
  selectedElement,
  onElementClick,
  sectionId,
  sectionIndex,
}: EditableTextProps) {
  if (!value) return null;

  const isSelected = selectedElement?.path === path;

  return (
    <div
      className={cn(
        "cursor-pointer transition-all duration-150 rounded-sm relative",
        "hover:outline hover:outline-2 hover:outline-blue-400/50 hover:outline-offset-2",
        isSelected && "outline outline-2 outline-blue-500 outline-offset-2",
        className
      )}
      style={style}
      onClick={(e) => {
        e.stopPropagation();
        onElementClick({
          type: "text",
          sectionId,
          sectionIndex,
          path,
          value,
          label,
        });
      }}
      data-testid={`editable-text-${path.replace(/[\[\].]/g, "-")}`}
    >
      {value}
    </div>
  );
}

interface EditableImageProps {
  src: string;
  alt: string;
  path: string;
  label: string;
  className?: string;
  style?: React.CSSProperties;
  selectedElement: SelectedElement | null;
  onElementClick: (element: SelectedElement) => void;
  basePath: string;
  sectionId: string;
  sectionIndex: number;
}

export function EditableImage({
  src,
  alt,
  path,
  label,
  className,
  style,
  selectedElement,
  onElementClick,
  sectionId,
  sectionIndex,
}: EditableImageProps) {
  if (!src) return null;

  const isSelected = selectedElement?.path === path;

  return (
    <div
      className={cn(
        "cursor-pointer transition-all duration-150 relative",
        "hover:ring-2 hover:ring-blue-400/50 hover:ring-offset-2",
        isSelected && "ring-2 ring-blue-500 ring-offset-2",
      )}
      style={style}
      onClick={(e) => {
        e.stopPropagation();
        onElementClick({
          type: "image",
          sectionId,
          sectionIndex,
          path,
          value: { url: src, alt },
          label,
        });
      }}
      data-testid={`editable-image-${path.replace(/[\[\].]/g, "-")}`}
    >
      <img
        src={src}
        alt={alt}
        className={className}
        loading="lazy"
        onError={(e) => {
          (e.target as HTMLImageElement).src = `https://placehold.co/800x400/1a1a2e/ffffff?text=${encodeURIComponent(label)}`;
        }}
      />
      {isSelected && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
          <span className="text-xs text-white bg-black/60 px-2 py-1 rounded">Click to change</span>
        </div>
      )}
    </div>
  );
}
