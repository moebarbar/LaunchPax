import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Upload, 
  Image, 
  Search, 
  Loader2, 
  X,
  Check,
  Sparkles,
} from "lucide-react";

interface ImageUploaderProps {
  projectId: number;
  sectionId: string;
  pageSlug: string;
  currentImage?: string;
  currentImageB64?: string;
  onImageUpdate: () => void;
}

interface StockPhoto {
  id: string;
  url: string;
  thumbnailUrl: string;
  alt: string;
  photographer: string;
}

export function ImageUploader({ 
  projectId, 
  sectionId, 
  pageSlug, 
  currentImage,
  currentImageB64,
  onImageUpdate 
}: ImageUploaderProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [stockPhotos, setStockPhotos] = useState<StockPhoto[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<StockPhoto | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const hasImage = currentImage || currentImageB64;

  const uploadMutation = useMutation({
    mutationFn: async (imageBase64: string) => {
      const response = await apiRequest(
        "POST",
        `/api/projects/${projectId}/sections/${sectionId}/image`,
        {
          imageBase64,
          pageSlug,
          generateAlt: true,
        }
      );
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Image uploaded successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "website-plan"] });
      onImageUpdate();
      setOpen(false);
    },
    onError: (error: Error) => {
      toast({ 
        title: "Upload failed", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({ 
        title: "Invalid file type", 
        description: "Please select an image file",
        variant: "destructive" 
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({ 
        title: "File too large", 
        description: "Please select an image under 10MB",
        variant: "destructive" 
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(",")[1];
      uploadMutation.mutate(base64);
    };
    reader.readAsDataURL(file);
  };

  const searchStockPhotos = async () => {
    if (!searchQuery.trim()) return;
    
    setSearchLoading(true);
    try {
      const response = await fetch(`/api/stock-photos/search?q=${encodeURIComponent(searchQuery)}&perPage=12`);
      if (!response.ok) throw new Error("Search failed");
      const data = await response.json();
      setStockPhotos(data.photos || []);
    } catch (error) {
      toast({ 
        title: "Search failed", 
        description: "Could not search stock photos",
        variant: "destructive" 
      });
    } finally {
      setSearchLoading(false);
    }
  };

  const selectStockPhoto = async (photo: StockPhoto) => {
    setSelectedPhoto(photo);
    
    try {
      const response = await fetch(photo.url);
      const blob = await response.blob();
      
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(",")[1];
        uploadMutation.mutate(base64);
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      toast({ 
        title: "Failed to select photo", 
        description: "Could not download the selected photo",
        variant: "destructive" 
      });
      setSelectedPhoto(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant={hasImage ? "outline" : "default"} 
          size="sm"
          className="gap-2"
          data-testid="button-upload-image"
        >
          <Image className="h-4 w-4" />
          {hasImage ? "Change Image" : "Add Image"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Image to Section</DialogTitle>
          <DialogDescription>
            Upload your own image or choose from stock photos
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="upload" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload" className="gap-2">
              <Upload className="h-4 w-4" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="stock" className="gap-2">
              <Search className="h-4 w-4" />
              Stock Photos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-4">
            <div 
              className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                data-testid="input-file-upload"
              />
              {uploadMutation.isPending ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-10 w-10 text-primary animate-spin" />
                  <p className="text-sm text-muted-foreground">Uploading and generating SEO metadata...</p>
                </div>
              ) : (
                <>
                  <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-1">Click to upload</p>
                  <p className="text-sm text-muted-foreground">
                    PNG, JPG, GIF up to 10MB
                  </p>
                  <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted-foreground">
                    <Sparkles className="h-3 w-3" />
                    <span>SEO alt text will be auto-generated</span>
                  </div>
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="stock" className="mt-4">
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Search for photos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && searchStockPhotos()}
                data-testid="input-stock-search"
              />
              <Button 
                onClick={searchStockPhotos} 
                disabled={searchLoading}
                data-testid="button-search-stock"
              >
                {searchLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>

            {stockPhotos.length > 0 ? (
              <div className="grid grid-cols-3 gap-3">
                {stockPhotos.map((photo) => (
                  <Card 
                    key={photo.id}
                    className={`cursor-pointer overflow-hidden transition-all hover:ring-2 hover:ring-primary ${
                      selectedPhoto?.id === photo.id ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => !uploadMutation.isPending && selectStockPhoto(photo)}
                    data-testid={`card-stock-photo-${photo.id}`}
                  >
                    <CardContent className="p-0 relative">
                      <img 
                        src={photo.thumbnailUrl} 
                        alt={photo.alt}
                        className="w-full aspect-video object-cover"
                      />
                      {selectedPhoto?.id === photo.id && uploadMutation.isPending && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <Loader2 className="h-6 w-6 text-white animate-spin" />
                        </div>
                      )}
                      {selectedPhoto?.id === photo.id && !uploadMutation.isPending && (
                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                          <Check className="h-8 w-8 text-primary" />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Search className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p>Search for stock photos to get started</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {hasImage && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-muted-foreground mb-2">Current image:</p>
            <img 
              src={currentImageB64 ? `data:image/png;base64,${currentImageB64}` : currentImage}
              alt="Current section image"
              className="w-full max-h-40 object-cover rounded-lg"
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
