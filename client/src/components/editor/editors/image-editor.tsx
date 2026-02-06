import { useState, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Search, Sparkles, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface ImageEditorProps {
  projectId: number;
  image: { url: string; alt?: string } | string;
  onChange: (image: any) => void;
}

interface StockPhoto {
  id: string;
  url: string;
  thumbnailUrl: string;
  alt: string;
  photographer: string;
}

export function ImageEditor({ projectId, image, onChange }: ImageEditorProps) {
  const imgUrl = typeof image === "string" ? image : image?.url || "";
  const imgAlt = typeof image === "string" ? "" : image?.alt || "";
  const [searchQuery, setSearchQuery] = useState("");
  const [stockPhotos, setStockPhotos] = useState<StockPhoto[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleStockPhotoSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const res = await fetch(`/api/stock-photos/search?query=${encodeURIComponent(searchQuery)}&count=9`);
      if (res.ok) {
        const photos = await res.json();
        setStockPhotos(photos);
      }
    } catch {
      toast({ title: "Search failed", variant: "destructive" });
    } finally {
      setIsSearching(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("projectId", String(projectId));

      const res = await fetch("/api/upload/image", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        onChange(data.url || data.imageUrl);
        toast({ title: "Image uploaded" });
      } else {
        toast({ title: "Upload failed", variant: "destructive" });
      }
    } catch {
      toast({ title: "Upload failed", variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  const handleAIGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await apiRequest("POST", "/api/ai/generate-image", {
        prompt: imgAlt || searchQuery || "professional business image",
        style: "photographic",
        projectId,
      });
      const data = await res.json();
      if (data.url) {
        onChange(data.url);
        toast({ title: "Image generated" });
      }
    } catch {
      toast({ title: "Generation failed. Try again later.", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4" data-testid="image-editor">
      {imgUrl && (
        <div>
          <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">Current Image</Label>
          <div className="rounded-lg overflow-hidden border">
            <img
              src={imgUrl}
              alt={imgAlt || "Current image"}
              className="w-full h-40 object-cover"
              onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/400x200/e2e8f0/94a3b8?text=Image"; }}
            />
          </div>
        </div>
      )}

      <div>
        <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">Alt Text (SEO)</Label>
        <Input
          value={imgAlt}
          onChange={(e) => onChange({ url: imgUrl, alt: e.target.value })}
          placeholder="Describe this image..."
          data-testid="input-alt-text"
        />
      </div>

      <div>
        <Label className="text-xs font-medium text-muted-foreground mb-2 block">Change Image</Label>
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="upload" className="flex-1 gap-1.5">
              <Upload className="w-3.5 h-3.5" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="stock" className="flex-1 gap-1.5">
              <Search className="w-3.5 h-3.5" />
              Stock
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex-1 gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              AI
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file);
              }}
            />
            <Button
              variant="outline"
              className="w-full"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              data-testid="button-upload-image"
            >
              {isUploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
              {isUploading ? "Uploading..." : "Choose file"}
            </Button>
          </TabsContent>

          <TabsContent value="stock" className="mt-3 space-y-3">
            <div className="flex gap-2">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search stock photos..."
                onKeyDown={(e) => e.key === "Enter" && handleStockPhotoSearch()}
                data-testid="input-stock-search"
              />
              <Button onClick={handleStockPhotoSearch} disabled={isSearching} size="sm" data-testid="button-stock-search">
                {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search"}
              </Button>
            </div>
            {stockPhotos.length > 0 && (
              <div className="grid grid-cols-3 gap-2 max-h-[240px] overflow-auto">
                {stockPhotos.map((photo) => (
                  <div
                    key={photo.id}
                    className="cursor-pointer rounded-md overflow-hidden border hover:ring-2 hover:ring-primary transition-all"
                    onClick={() => {
                      onChange(photo.url);
                      toast({ title: "Stock photo selected" });
                    }}
                    data-testid={`stock-photo-${photo.id}`}
                  >
                    <img src={photo.thumbnailUrl || photo.url} alt={photo.alt} className="w-full h-20 object-cover" />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="ai" className="mt-3 space-y-3">
            <p className="text-xs text-muted-foreground">
              Generate a new image using AI based on the alt text description.
            </p>
            <Button
              className="w-full"
              onClick={handleAIGenerate}
              disabled={isGenerating}
              data-testid="button-ai-generate"
            >
              {isGenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
              {isGenerating ? "Generating..." : "Generate AI Image"}
            </Button>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
