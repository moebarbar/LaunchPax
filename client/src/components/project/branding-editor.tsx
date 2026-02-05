import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  Palette,
  Upload,
  Sparkles,
  Loader2,
  Check,
  Image as ImageIcon,
  Wand2,
  Info,
  CheckCircle2,
  Plus,
  X,
} from "lucide-react";
import type { BrandKit as BrandKitType, ColorPaletteItem, Project } from "@shared/schema";

interface BrandingEditorProps {
  projectId: number;
  project: Project;
}

const COLOR_PSYCHOLOGY: Record<string, { meaning: string; industries: string[] }> = {
  blue: {
    meaning: "Trust, professionalism, calm, reliability. Creates a sense of security and dependability.",
    industries: ["Healthcare", "Finance", "Technology", "Corporate"],
  },
  green: {
    meaning: "Growth, health, nature, sustainability. Evokes freshness and environmental awareness.",
    industries: ["Health", "Food", "Environment", "Finance"],
  },
  red: {
    meaning: "Energy, passion, urgency, excitement. Captures attention and stimulates action.",
    industries: ["Food", "Entertainment", "Retail", "Sports"],
  },
  orange: {
    meaning: "Creativity, enthusiasm, warmth, confidence. Friendly and approachable yet energetic.",
    industries: ["Creative", "Food", "Entertainment", "Youth brands"],
  },
  purple: {
    meaning: "Luxury, wisdom, creativity, sophistication. Associated with premium quality and imagination.",
    industries: ["Luxury", "Beauty", "Creative", "Technology"],
  },
  yellow: {
    meaning: "Optimism, happiness, warmth, attention. Bright and cheerful, evokes positive emotions.",
    industries: ["Food", "Entertainment", "Children", "Retail"],
  },
  black: {
    meaning: "Elegance, power, sophistication, luxury. Timeless and authoritative.",
    industries: ["Luxury", "Fashion", "Technology", "Corporate"],
  },
  white: {
    meaning: "Purity, cleanliness, simplicity, modern. Creates spacious, clean aesthetics.",
    industries: ["Healthcare", "Technology", "Luxury", "Minimalist"],
  },
  brown: {
    meaning: "Earthiness, reliability, warmth, natural. Grounded and authentic feel.",
    industries: ["Food", "Agriculture", "Outdoors", "Artisan"],
  },
  teal: {
    meaning: "Calm, sophistication, healing, balance. Modern and professional with a unique touch.",
    industries: ["Healthcare", "Wellness", "Technology", "Creative"],
  },
};

const LOGO_STYLES = [
  { value: "modern", label: "Modern", description: "Clean lines, minimalist, contemporary" },
  { value: "classic", label: "Classic", description: "Timeless, traditional, elegant" },
  { value: "playful", label: "Playful", description: "Fun, friendly, approachable" },
  { value: "minimal", label: "Minimal", description: "Simple, iconic, memorable" },
  { value: "tech", label: "Tech", description: "Futuristic, digital, innovative" },
];

const AI_MODELS = [
  { value: "dalle", label: "DALL-E 3", description: "Best for professional, clean logos" },
  { value: "leonardo", label: "Leonardo AI", description: "Best for stylized, artistic logos" },
];

function getColorCategory(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2 / 255;
  
  if (l < 0.15) return "black";
  if (l > 0.9) return "white";
  
  if (Math.abs(r - g) < 30 && Math.abs(g - b) < 30 && Math.abs(r - b) < 30) {
    return l > 0.5 ? "white" : "black";
  }
  
  if (r > g && r > b) {
    if (g > b * 1.5) return "orange";
    if (g > b) return "brown";
    return "red";
  }
  if (g > r && g > b) return "green";
  if (b > r && b > g) {
    if (r > g * 0.8) return "purple";
    if (g > r * 0.8) return "teal";
    return "blue";
  }
  if (r > b && g > b && r > 200 && g > 200) return "yellow";
  if (r > g && b > g) return "purple";
  
  return "blue";
}

function generateColorExplanation(colors: ColorPaletteItem[], industry: string): string {
  if (!colors || colors.length === 0) return "";
  
  const primaryColor = colors[0];
  const category = getColorCategory(primaryColor.hex);
  const psychology = COLOR_PSYCHOLOGY[category] || COLOR_PSYCHOLOGY.blue;
  
  const accentColors = colors.slice(1, 3).map(c => getColorCategory(c.hex));
  const uniqueAccents = Array.from(new Set(accentColors)).filter(c => c !== category);
  
  let explanation = `Your primary color (${primaryColor.name}) is in the ${category} family. ${psychology.meaning}\n\n`;
  explanation += `This color choice works excellently for ${industry.toLowerCase()} businesses because it conveys `;
  
  switch (category) {
    case "blue":
      explanation += "trustworthiness and professionalism - essential qualities your customers look for.";
      break;
    case "green":
      explanation += "growth, health, and natural wellness - core values that resonate with your audience.";
      break;
    case "red":
      explanation += "energy and passion - creating excitement and urgency that drives engagement.";
      break;
    case "orange":
      explanation += "warmth and creativity - making your brand feel approachable and innovative.";
      break;
    case "purple":
      explanation += "luxury and sophistication - elevating your brand's perceived value.";
      break;
    case "teal":
      explanation += "calm professionalism with a unique edge - standing out while remaining trustworthy.";
      break;
    default:
      explanation += "the right emotional connection with your target audience.";
  }
  
  if (uniqueAccents.length > 0) {
    explanation += `\n\nYour accent colors (${uniqueAccents.join(", ")}) complement the primary palette by adding `;
    explanation += uniqueAccents.includes("orange") || uniqueAccents.includes("yellow") 
      ? "energy and warmth" 
      : uniqueAccents.includes("green") 
        ? "freshness and balance"
        : "depth and visual interest";
    explanation += " to create a complete, professional color scheme.";
  }
  
  return explanation;
}

export default function BrandingEditor({ projectId, project }: BrandingEditorProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [editedColors, setEditedColors] = useState<ColorPaletteItem[]>([]);
  const [isEditingColors, setIsEditingColors] = useState(false);
  const [logoStyle, setLogoStyle] = useState("modern");
  const [selectedModel, setSelectedModel] = useState("dalle");
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);

  const { data: brandKit, isLoading } = useQuery<BrandKitType>({
    queryKey: ["/api/projects", projectId, "brand-kit"],
  });

  const businessProfile = project.businessProfile as any;
  const industry = businessProfile?.industry || "business";

  const updateBrandKit = useMutation({
    mutationFn: async (data: Partial<BrandKitType>) => {
      const response = await apiRequest("PATCH", `/api/projects/${projectId}/brand-kit`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "brand-kit"] });
      toast({ title: "Brand kit updated", description: "Your changes have been saved." });
    },
    onError: (error: Error) => {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
    },
  });

  const generateLogo = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/projects/${projectId}/brand-kit/generate-logo`, {
        style: logoStyle,
        model: selectedModel,
      });
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "brand-kit"] });
      toast({ 
        title: "Logo generated", 
        description: `Your new logo was created using ${data.provider === "dalle" ? "DALL-E 3" : "Leonardo AI"}.` 
      });
    },
    onError: (error: Error) => {
      toast({ title: "Logo generation failed", description: error.message, variant: "destructive" });
    },
  });

  const handleFileUpload = async (file: File, type: "logo" | "favicon") => {
    if (type === "logo") setUploadingLogo(true);
    else setUploadingFavicon(true);

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = (e.target?.result as string)?.split(",")[1];
        if (!base64) throw new Error("Failed to read file");

        const response = await apiRequest("POST", `/api/projects/${projectId}/brand-kit/upload-logo`, {
          imageBase64: base64,
          type,
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Upload failed");
        }

        queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "brand-kit"] });
        toast({ title: `${type === "logo" ? "Logo" : "Favicon"} uploaded`, description: "Your image has been saved." });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast({ 
        title: "Upload failed", 
        description: error instanceof Error ? error.message : "Failed to upload image",
        variant: "destructive" 
      });
    } finally {
      if (type === "logo") setUploadingLogo(false);
      else setUploadingFavicon(false);
    }
  };

  const handleApproveColors = () => {
    const colorsToApprove = isEditingColors ? editedColors : brandKit?.colorPalette;
    const explanation = generateColorExplanation(colorsToApprove || [], industry);
    
    updateBrandKit.mutate({
      colorPalette: colorsToApprove,
      colorsApproved: true,
      colorExplanation: explanation,
    });
    setIsEditingColors(false);
  };

  const startEditingColors = () => {
    setEditedColors(brandKit?.colorPalette || []);
    setIsEditingColors(true);
  };

  const updateColor = (index: number, field: keyof ColorPaletteItem, value: string) => {
    setEditedColors(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addColor = () => {
    setEditedColors(prev => [...prev, { name: "New Color", hex: "#6366f1", usage: "Accent" }]);
  };

  const removeColor = (index: number) => {
    setEditedColors(prev => prev.filter((_, i) => i !== index));
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (!brandKit || brandKit.status === "pending") {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <Palette className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Generate a brand kit first to access branding customization.</p>
        </CardContent>
      </Card>
    );
  }

  const displayColors = isEditingColors ? editedColors : (brandKit.colorPalette || []);
  const colorExplanation = brandKit.colorExplanation || generateColorExplanation(displayColors, industry);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="colors" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="colors" className="flex items-center gap-2" data-testid="tab-brand-colors">
            <Palette className="h-4 w-4" />
            Brand Colors
          </TabsTrigger>
          <TabsTrigger value="logo" className="flex items-center gap-2" data-testid="tab-logo-favicon">
            <ImageIcon className="h-4 w-4" />
            Logo & Favicon
          </TabsTrigger>
        </TabsList>

        <TabsContent value="colors" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    Brand Color Palette
                    {brandKit.colorsApproved && (
                      <Badge variant="outline" className="ml-2 text-green-600 border-green-600">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Approved
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription>
                    {brandKit.colorsApproved 
                      ? "Your brand colors are approved and ready for logo generation"
                      : "Review and approve your brand colors to generate a matching logo"}
                  </CardDescription>
                </div>
                {!isEditingColors && (
                  <Button variant="outline" size="sm" onClick={startEditingColors} data-testid="button-edit-colors">
                    Edit Colors
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {displayColors.map((color, index) => (
                  <div key={index} className="space-y-2" data-testid={`color-swatch-${index}`}>
                    {isEditingColors ? (
                      <div className="relative">
                        <div className="flex items-center gap-1 mb-2">
                          <Input
                            type="color"
                            value={color.hex}
                            onChange={(e) => updateColor(index, "hex", e.target.value)}
                            className="w-full h-16 p-1 rounded-lg cursor-pointer"
                            data-testid={`color-picker-${index}`}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute -top-2 -right-2 h-6 w-6 bg-destructive text-destructive-foreground rounded-full"
                            onClick={() => removeColor(index)}
                            data-testid={`remove-color-${index}`}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                        <Input
                          value={color.name}
                          onChange={(e) => updateColor(index, "name", e.target.value)}
                          placeholder="Color name"
                          className="text-xs"
                          data-testid={`color-name-${index}`}
                        />
                        <Input
                          value={color.usage}
                          onChange={(e) => updateColor(index, "usage", e.target.value)}
                          placeholder="Usage"
                          className="text-xs mt-1"
                          data-testid={`color-usage-${index}`}
                        />
                      </div>
                    ) : (
                      <>
                        <div
                          className="aspect-square rounded-lg ring-1 ring-black/10"
                          style={{ backgroundColor: color.hex }}
                        />
                        <div className="text-center">
                          <p className="text-sm font-medium">{color.name}</p>
                          <p className="text-xs text-muted-foreground font-mono">{color.hex}</p>
                          <p className="text-xs text-muted-foreground">{color.usage}</p>
                        </div>
                      </>
                    )}
                  </div>
                ))}
                {isEditingColors && (
                  <button
                    onClick={addColor}
                    className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center gap-2 hover-elevate"
                    data-testid="button-add-color"
                  >
                    <Plus className="w-6 h-6 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Add Color</span>
                  </button>
                )}
              </div>

              <Card className="bg-muted/30">
                <CardContent className="py-4">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-sm mb-1">Why These Colors?</p>
                      <p className="text-sm text-muted-foreground whitespace-pre-line">
                        {colorExplanation}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-3 justify-end">
                {isEditingColors && (
                  <>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsEditingColors(false)}
                      data-testid="button-cancel-edit"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleApproveColors}
                      disabled={updateBrandKit.isPending}
                      data-testid="button-save-colors"
                    >
                      {updateBrandKit.isPending ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Check className="w-4 h-4 mr-2" />
                      )}
                      Save & Approve Colors
                    </Button>
                  </>
                )}
                {!isEditingColors && !brandKit.colorsApproved && (
                  <Button 
                    onClick={handleApproveColors}
                    disabled={updateBrandKit.isPending}
                    data-testid="button-approve-colors"
                  >
                    {updateBrandKit.isPending ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                    )}
                    Approve These Colors
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logo" className="mt-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ImageIcon className="w-5 h-5" />
                  Logo
                </CardTitle>
                <CardDescription>
                  Upload your own logo or generate one with AI
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {brandKit.logoUrl ? (
                  <div className="relative aspect-square rounded-lg border bg-white p-4 flex items-center justify-center">
                    <img 
                      src={brandKit.logoUrl} 
                      alt="Brand logo" 
                      className="max-w-full max-h-full object-contain"
                      data-testid="img-logo-preview"
                    />
                  </div>
                ) : (
                  <div className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center gap-2">
                    <ImageIcon className="w-12 h-12 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground">No logo yet</p>
                  </div>
                )}

                <div className="space-y-3">
                  <Label className="text-sm font-medium">Upload Logo</Label>
                  <div className="flex gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, "logo");
                      }}
                      disabled={uploadingLogo}
                      className="flex-1"
                      data-testid="input-upload-logo"
                    />
                    {uploadingLogo && <Loader2 className="w-5 h-5 animate-spin" />}
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or generate with AI</span>
                  </div>
                </div>

                {!brandKit.colorsApproved ? (
                  <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                    <p className="text-sm text-amber-800 dark:text-amber-200">
                      Please approve your brand colors first before generating a logo. This ensures the logo matches your color scheme.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label className="text-sm">Logo Style</Label>
                      <Select value={logoStyle} onValueChange={setLogoStyle}>
                        <SelectTrigger data-testid="select-logo-style">
                          <SelectValue placeholder="Select style" />
                        </SelectTrigger>
                        <SelectContent>
                          {LOGO_STYLES.map((style) => (
                            <SelectItem key={style.value} value={style.value}>
                              <div>
                                <span className="font-medium">{style.label}</span>
                                <span className="text-muted-foreground ml-2">- {style.description}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm">AI Model</Label>
                      <Select value={selectedModel} onValueChange={setSelectedModel}>
                        <SelectTrigger data-testid="select-ai-model">
                          <SelectValue placeholder="Select AI model" />
                        </SelectTrigger>
                        <SelectContent>
                          {AI_MODELS.map((model) => (
                            <SelectItem key={model.value} value={model.value}>
                              <div>
                                <span className="font-medium">{model.label}</span>
                                <span className="text-muted-foreground ml-2">- {model.description}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button 
                      onClick={() => generateLogo.mutate()}
                      disabled={generateLogo.isPending}
                      className="w-full"
                      data-testid="button-generate-logo"
                    >
                      {generateLogo.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Generating Logo...
                        </>
                      ) : (
                        <>
                          <Wand2 className="w-4 h-4 mr-2" />
                          Generate Logo with AI
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sparkles className="w-5 h-5" />
                  Favicon
                </CardTitle>
                <CardDescription>
                  Upload a favicon for browser tabs (recommended: 512x512 PNG)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {brandKit.faviconUrl ? (
                  <div className="relative w-32 h-32 rounded-lg border bg-white p-2 mx-auto flex items-center justify-center">
                    <img 
                      src={brandKit.faviconUrl} 
                      alt="Favicon" 
                      className="max-w-full max-h-full object-contain"
                      data-testid="img-favicon-preview"
                    />
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-lg border-2 border-dashed border-muted-foreground/30 mx-auto flex flex-col items-center justify-center gap-2">
                    <Sparkles className="w-8 h-8 text-muted-foreground/50" />
                    <p className="text-xs text-muted-foreground">No favicon</p>
                  </div>
                )}

                <div className="space-y-3">
                  <Label className="text-sm font-medium">Upload Favicon</Label>
                  <div className="flex gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, "favicon");
                      }}
                      disabled={uploadingFavicon}
                      className="flex-1"
                      data-testid="input-upload-favicon"
                    />
                    {uploadingFavicon && <Loader2 className="w-5 h-5 animate-spin" />}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    For best results, use a square image (PNG or ICO format). The image will be resized to 512x512.
                  </p>
                </div>

                {brandKit.logoUrl && !brandKit.faviconUrl && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      fetch(brandKit.logoUrl!)
                        .then(res => res.blob())
                        .then(blob => {
                          const reader = new FileReader();
                          reader.onload = async (e) => {
                            const base64 = (e.target?.result as string)?.split(",")[1];
                            if (base64) {
                              await apiRequest("POST", `/api/projects/${projectId}/brand-kit/upload-logo`, {
                                imageBase64: base64,
                                type: "favicon",
                              });
                              queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "brand-kit"] });
                              toast({ title: "Favicon created", description: "Your logo has been adapted as a favicon." });
                            }
                          };
                          reader.readAsDataURL(blob);
                        });
                    }}
                    data-testid="button-use-logo-as-favicon"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Use Logo as Favicon
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
