import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Palette, Type, Paintbrush, Loader2, Save, RotateCcw } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { WebsiteContent, SiteSettings } from "@shared/schema";

interface GlobalStyleEditorProps {
  projectId: number;
  websiteContent: WebsiteContent | null;
  brandKit?: {
    colorPalette?: { name: string; hex: string; usage: string }[];
    fontPairings?: { heading: string; body: string; name: string }[];
  } | null;
  onUpdate?: () => void;
}

const FONT_OPTIONS = [
  { value: "Inter", label: "Inter (Modern)" },
  { value: "Playfair Display", label: "Playfair Display (Elegant)" },
  { value: "Montserrat", label: "Montserrat (Professional)" },
  { value: "Poppins", label: "Poppins (Friendly)" },
  { value: "Space Grotesk", label: "Space Grotesk (Tech)" },
  { value: "DM Sans", label: "DM Sans (Clean)" },
  { value: "Oswald", label: "Oswald (Bold)" },
  { value: "Lora", label: "Lora (Classic)" },
  { value: "Cormorant Garamond", label: "Cormorant Garamond (Luxury)" },
  { value: "Work Sans", label: "Work Sans (Neutral)" },
];

const STYLE_PRESETS = [
  { value: "modern", label: "Modern" },
  { value: "minimal", label: "Minimal" },
  { value: "bold", label: "Bold" },
  { value: "classic", label: "Classic" },
  { value: "elegant", label: "Elegant" },
  { value: "tech", label: "Tech" },
  { value: "creative", label: "Creative" },
  { value: "professional", label: "Professional" },
];

const FONT_PAIRINGS = [
  { name: "Bold & Modern", heading: "Space Grotesk", body: "Inter", description: "Impactful headlines with clean body text" },
  { name: "Elegant Classic", heading: "Cormorant Garamond", body: "Lora", description: "Timeless sophistication for luxury brands" },
  { name: "Friendly & Fun", heading: "Poppins", body: "Inter", description: "Approachable and playful feel" },
  { name: "Clean Minimal", heading: "DM Sans", body: "DM Sans", description: "Cohesive, clean design" },
  { name: "Tech Forward", heading: "Space Grotesk", body: "Inter", description: "Technical and developer-focused" },
  { name: "Luxury Serif", heading: "Playfair Display", body: "Lora", description: "High-end editorial style" },
  { name: "Creative Edge", heading: "Oswald", body: "Work Sans", description: "Unique and artistic expression" },
  { name: "Professional Trust", heading: "Montserrat", body: "Inter", description: "Corporate and trustworthy" },
];

export function GlobalStyleEditor({ projectId, websiteContent, brandKit, onUpdate }: GlobalStyleEditorProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const currentSettings = websiteContent?.siteSettings || {};
  
  const [settings, setSettings] = useState<SiteSettings>({
    primaryColor: currentSettings.primaryColor || "#835C3B",
    secondaryColor: currentSettings.secondaryColor || "#FBF6E3",
    accentColor: currentSettings.accentColor || "#D94C4C",
    backgroundColor: currentSettings.backgroundColor || "#FDF3E3",
    surfaceColor: currentSettings.surfaceColor || "#EEE2D0",
    textColor: currentSettings.textColor || "#835C3B",
    mutedTextColor: currentSettings.mutedTextColor || "#A08060",
    borderColor: currentSettings.borderColor || "#D4C4B0",
    fontFamily: currentSettings.fontFamily || "Inter",
    headingFont: currentSettings.headingFont || "Inter",
    style: currentSettings.style || "modern",
    colorScheme: currentSettings.colorScheme || "light",
  });
  
  useEffect(() => {
    if (currentSettings) {
      setSettings(prev => ({
        ...prev,
        ...currentSettings,
      }));
    }
  }, [websiteContent?.siteSettings]);
  
  const updateMutation = useMutation({
    mutationFn: async (newSettings: SiteSettings) => {
      const response = await apiRequest(
        "PATCH",
        `/api/projects/${projectId}/website-settings`,
        { siteSettings: newSettings }
      );
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Styles updated",
        description: "Your website styles have been saved.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "website-content"] });
      onUpdate?.();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update styles",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const handleColorChange = (key: keyof SiteSettings, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };
  
  const handleFontChange = (key: keyof SiteSettings, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };
  
  const applyBrandKitColor = (colorIndex: number, settingKey: keyof SiteSettings) => {
    const color = brandKit?.colorPalette?.[colorIndex];
    if (color) {
      setSettings(prev => ({ ...prev, [settingKey]: color.hex }));
    }
  };
  
  const resetToDefault = () => {
    if (currentSettings) {
      setSettings({
        primaryColor: currentSettings.primaryColor,
        secondaryColor: currentSettings.secondaryColor,
        accentColor: currentSettings.accentColor,
        backgroundColor: currentSettings.backgroundColor,
        surfaceColor: currentSettings.surfaceColor,
        textColor: currentSettings.textColor,
        mutedTextColor: currentSettings.mutedTextColor,
        borderColor: currentSettings.borderColor,
        fontFamily: currentSettings.fontFamily || "Inter",
        headingFont: currentSettings.headingFont || "Inter",
        style: currentSettings.style || "modern",
        colorScheme: currentSettings.colorScheme || "light",
      });
    }
  };
  
  const hasChanges = JSON.stringify(settings) !== JSON.stringify(currentSettings);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Paintbrush className="h-5 w-5" />
          Global Style Editor
        </CardTitle>
        <CardDescription>
          Customize colors, fonts, and visual style for your entire website
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="colors" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="colors" className="flex items-center gap-2" data-testid="tab-colors">
              <Palette className="h-4 w-4" />
              Colors
            </TabsTrigger>
            <TabsTrigger value="typography" className="flex items-center gap-2" data-testid="tab-typography">
              <Type className="h-4 w-4" />
              Typography
            </TabsTrigger>
            <TabsTrigger value="style" className="flex items-center gap-2" data-testid="tab-style">
              <Paintbrush className="h-4 w-4" />
              Style
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="colors" className="mt-6 space-y-6">
            {/* Brand Kit Colors */}
            {brandKit?.colorPalette && brandKit.colorPalette.length > 0 && (
              <div className="space-y-3">
                <Label className="text-sm font-medium">Your Brand Kit Colors</Label>
                <div className="flex flex-wrap gap-2">
                  {brandKit.colorPalette.map((color, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        // Cycle through settings
                        const keys: (keyof SiteSettings)[] = ['backgroundColor', 'primaryColor', 'secondaryColor', 'accentColor', 'surfaceColor'];
                        const key = keys[index % keys.length];
                        handleColorChange(key, color.hex);
                      }}
                      className="group relative"
                      title={`${color.name}: ${color.usage}`}
                      data-testid={`brandkit-color-${index}`}
                    >
                      <div
                        className="w-10 h-10 rounded-lg ring-2 ring-transparent hover:ring-primary transition-all"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                        {color.name}
                      </span>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">Click a color to apply it. These are from your brand kit.</p>
              </div>
            )}
            
            {/* Color Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="backgroundColor">Background Color</Label>
                <div className="flex gap-2">
                  <div
                    className="w-10 h-10 rounded-lg border"
                    style={{ backgroundColor: settings.backgroundColor }}
                  />
                  <Input
                    id="backgroundColor"
                    type="text"
                    value={settings.backgroundColor || ""}
                    onChange={(e) => handleColorChange("backgroundColor", e.target.value)}
                    placeholder="#FDF3E3"
                    className="flex-1"
                    data-testid="input-background-color"
                  />
                  <Input
                    type="color"
                    value={settings.backgroundColor || "#FDF3E3"}
                    onChange={(e) => handleColorChange("backgroundColor", e.target.value)}
                    className="w-10 h-10 p-1 rounded cursor-pointer"
                    data-testid="picker-background-color"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="primaryColor">Primary/Text Color</Label>
                <div className="flex gap-2">
                  <div
                    className="w-10 h-10 rounded-lg border"
                    style={{ backgroundColor: settings.primaryColor }}
                  />
                  <Input
                    id="primaryColor"
                    type="text"
                    value={settings.primaryColor || ""}
                    onChange={(e) => handleColorChange("primaryColor", e.target.value)}
                    placeholder="#835C3B"
                    className="flex-1"
                    data-testid="input-primary-color"
                  />
                  <Input
                    type="color"
                    value={settings.primaryColor || "#835C3B"}
                    onChange={(e) => handleColorChange("primaryColor", e.target.value)}
                    className="w-10 h-10 p-1 rounded cursor-pointer"
                    data-testid="picker-primary-color"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="secondaryColor">Secondary/Highlight Color</Label>
                <div className="flex gap-2">
                  <div
                    className="w-10 h-10 rounded-lg border"
                    style={{ backgroundColor: settings.secondaryColor }}
                  />
                  <Input
                    id="secondaryColor"
                    type="text"
                    value={settings.secondaryColor || ""}
                    onChange={(e) => handleColorChange("secondaryColor", e.target.value)}
                    placeholder="#FBF6B"
                    className="flex-1"
                    data-testid="input-secondary-color"
                  />
                  <Input
                    type="color"
                    value={settings.secondaryColor || "#FBF6B"}
                    onChange={(e) => handleColorChange("secondaryColor", e.target.value)}
                    className="w-10 h-10 p-1 rounded cursor-pointer"
                    data-testid="picker-secondary-color"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="accentColor">Accent/CTA Color</Label>
                <div className="flex gap-2">
                  <div
                    className="w-10 h-10 rounded-lg border"
                    style={{ backgroundColor: settings.accentColor }}
                  />
                  <Input
                    id="accentColor"
                    type="text"
                    value={settings.accentColor || ""}
                    onChange={(e) => handleColorChange("accentColor", e.target.value)}
                    placeholder="#D94C4C"
                    className="flex-1"
                    data-testid="input-accent-color"
                  />
                  <Input
                    type="color"
                    value={settings.accentColor || "#D94C4C"}
                    onChange={(e) => handleColorChange("accentColor", e.target.value)}
                    className="w-10 h-10 p-1 rounded cursor-pointer"
                    data-testid="picker-accent-color"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="surfaceColor">Surface/Card Color</Label>
                <div className="flex gap-2">
                  <div
                    className="w-10 h-10 rounded-lg border"
                    style={{ backgroundColor: settings.surfaceColor }}
                  />
                  <Input
                    id="surfaceColor"
                    type="text"
                    value={settings.surfaceColor || ""}
                    onChange={(e) => handleColorChange("surfaceColor", e.target.value)}
                    placeholder="#EEE2D0"
                    className="flex-1"
                    data-testid="input-surface-color"
                  />
                  <Input
                    type="color"
                    value={settings.surfaceColor || "#EEE2D0"}
                    onChange={(e) => handleColorChange("surfaceColor", e.target.value)}
                    className="w-10 h-10 p-1 rounded cursor-pointer"
                    data-testid="picker-surface-color"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="mutedTextColor">Muted Text Color</Label>
                <div className="flex gap-2">
                  <div
                    className="w-10 h-10 rounded-lg border"
                    style={{ backgroundColor: settings.mutedTextColor }}
                  />
                  <Input
                    id="mutedTextColor"
                    type="text"
                    value={settings.mutedTextColor || ""}
                    onChange={(e) => handleColorChange("mutedTextColor", e.target.value)}
                    placeholder="#A08060"
                    className="flex-1"
                    data-testid="input-muted-text-color"
                  />
                  <Input
                    type="color"
                    value={settings.mutedTextColor || "#A08060"}
                    onChange={(e) => handleColorChange("mutedTextColor", e.target.value)}
                    className="w-10 h-10 p-1 rounded cursor-pointer"
                    data-testid="picker-muted-text-color"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="borderColor">Border Color</Label>
                <div className="flex gap-2">
                  <div
                    className="w-10 h-10 rounded-lg border"
                    style={{ backgroundColor: settings.borderColor }}
                  />
                  <Input
                    id="borderColor"
                    type="text"
                    value={settings.borderColor || ""}
                    onChange={(e) => handleColorChange("borderColor", e.target.value)}
                    placeholder="#D4C4B0"
                    className="flex-1"
                    data-testid="input-border-color"
                  />
                  <Input
                    type="color"
                    value={settings.borderColor || "#D4C4B0"}
                    onChange={(e) => handleColorChange("borderColor", e.target.value)}
                    className="w-10 h-10 p-1 rounded cursor-pointer"
                    data-testid="picker-border-color"
                  />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="typography" className="mt-6 space-y-6">
            {/* Font Pairing Presets */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Quick Font Pairings</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {FONT_PAIRINGS.map((pairing, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSettings(prev => ({
                        ...prev,
                        headingFont: pairing.heading,
                        fontFamily: pairing.body,
                      }));
                    }}
                    className={`p-3 rounded-lg border text-left transition-all hover-elevate ${
                      settings.headingFont === pairing.heading && settings.fontFamily === pairing.body
                        ? "ring-2 ring-primary border-primary"
                        : ""
                    }`}
                    data-testid={`font-pairing-${index}`}
                  >
                    <div className="font-medium text-sm" style={{ fontFamily: pairing.heading }}>
                      {pairing.name}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {pairing.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="headingFont">Heading Font</Label>
                <Select
                  value={settings.headingFont || "Inter"}
                  onValueChange={(value) => handleFontChange("headingFont", value)}
                >
                  <SelectTrigger id="headingFont" data-testid="select-heading-font">
                    <SelectValue placeholder="Select heading font" />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_OPTIONS.map((font) => (
                      <SelectItem key={font.value} value={font.value}>
                        <span style={{ fontFamily: font.value }}>{font.label}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Used for headlines and section titles</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bodyFont">Body Font</Label>
                <Select
                  value={settings.fontFamily || "Inter"}
                  onValueChange={(value) => handleFontChange("fontFamily", value)}
                >
                  <SelectTrigger id="bodyFont" data-testid="select-body-font">
                    <SelectValue placeholder="Select body font" />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_OPTIONS.map((font) => (
                      <SelectItem key={font.value} value={font.value}>
                        <span style={{ fontFamily: font.value }}>{font.label}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Used for paragraphs and descriptions</p>
              </div>
            </div>
            
            {/* Typography Preview */}
            <Card className="p-6" style={{ 
              backgroundColor: settings.backgroundColor,
              color: settings.textColor || settings.primaryColor 
            }}>
              <h3 
                className="text-2xl font-bold mb-2" 
                style={{ fontFamily: settings.headingFont }}
              >
                Typography Preview
              </h3>
              <p 
                className="text-base leading-relaxed"
                style={{ fontFamily: settings.fontFamily }}
              >
                This is how your body text will look. The quick brown fox jumps over the lazy dog.
                Good typography makes content easy to read and visually appealing.
              </p>
            </Card>
          </TabsContent>
          
          <TabsContent value="style" className="mt-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="style">Design Style Preset</Label>
              <Select
                value={settings.style || "modern"}
                onValueChange={(value) => setSettings(prev => ({ ...prev, style: value }))}
              >
                <SelectTrigger id="style" data-testid="select-style-preset">
                  <SelectValue placeholder="Select style preset" />
                </SelectTrigger>
                <SelectContent>
                  {STYLE_PRESETS.map((style) => (
                    <SelectItem key={style.value} value={style.value}>
                      {style.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">This affects overall design aesthetics and default font pairings</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="colorScheme">Color Scheme</Label>
              <Select
                value={settings.colorScheme || "light"}
                onValueChange={(value: "light" | "dark" | "auto") => setSettings(prev => ({ ...prev, colorScheme: value }))}
              >
                <SelectTrigger id="colorScheme" data-testid="select-color-scheme">
                  <SelectValue placeholder="Select color scheme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="auto">Auto (follows system)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t">
          <Button
            variant="outline"
            onClick={resetToDefault}
            disabled={!hasChanges || updateMutation.isPending}
            data-testid="button-reset-styles"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          
          <Button
            onClick={() => updateMutation.mutate(settings)}
            disabled={!hasChanges || updateMutation.isPending}
            data-testid="button-save-styles"
          >
            {updateMutation.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
