import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Palette,
  Sparkles,
  Loader2,
  Type,
  MessageSquare,
  Quote,
  Target,
} from "lucide-react";
import type { BrandKit as BrandKitType, WorkflowJob } from "@shared/schema";

interface BrandKitProps {
  projectId: number;
}

export default function BrandKit({ projectId }: BrandKitProps) {
  const { toast } = useToast();

  const { data: brandKit, isLoading } = useQuery<BrandKitType>({
    queryKey: ["/api/projects", projectId, "brand-kit"],
  });

  const { data: workflowJob, refetch: refetchJob } = useQuery<WorkflowJob>({
    queryKey: ["/api/projects", projectId, "workflows", "brand-kit", "status"],
    refetchInterval: (query) => {
      const job = query.state.data;
      if (job?.status === "running" || job?.status === "pending") {
        return 2000;
      }
      return false;
    },
  });

  const generateBrandKit = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/projects/${projectId}/workflows/brand-kit/run`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Generating brand kit",
        description: "Building your brand identity...",
      });
      refetchJob();
      queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "brand-kit"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate brand kit.",
        variant: "destructive",
      });
    },
  });

  const isRunning = workflowJob?.status === "running" || workflowJob?.status === "pending";

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!brandKit || brandKit.status === "pending") {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Palette className="w-8 h-8 text-primary" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Build Your Brand Identity</h3>
          <p className="text-muted-foreground text-sm mb-6 max-w-md">
            Generate a complete brand kit including voice, taglines, colors, typography, and messaging pillars.
          </p>
          <Button
            onClick={() => generateBrandKit.mutate()}
            disabled={generateBrandKit.isPending || isRunning}
            data-testid="button-generate-brand-kit"
          >
            {generateBrandKit.isPending || isRunning ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Brand Kit
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isRunning) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
          <h3 className="font-semibold mb-2">Building Your Brand...</h3>
          <p className="text-muted-foreground text-sm">This may take a moment</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={() => generateBrandKit.mutate()}
          disabled={isRunning}
          data-testid="button-regenerate-brand"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Regenerate
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessageSquare className="w-5 h-5" />
              Brand Voice
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed" data-testid="text-brand-voice">
              {brandKit.brandVoice || "Not generated yet"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Quote className="w-5 h-5" />
              Elevator Pitch
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed italic" data-testid="text-elevator-pitch">
              "{brandKit.elevatorPitch || "Not generated yet"}"
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="w-5 h-5" />
            Taglines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {brandKit.taglines && brandKit.taglines.length > 0 ? (
              brandKit.taglines.map((tagline, index) => (
                <Badge key={index} variant="outline" className="text-sm py-1 px-3" data-testid={`badge-tagline-${index}`}>
                  {tagline}
                </Badge>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">No taglines generated</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Palette className="w-5 h-5" />
            Color Palette
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {brandKit.colorPalette && brandKit.colorPalette.length > 0 ? (
              brandKit.colorPalette.map((color, index) => (
                <div key={index} className="space-y-2" data-testid={`color-${index}`}>
                  <div
                    className="aspect-square rounded-lg ring-1 ring-black/10"
                    style={{ backgroundColor: color.hex }}
                  />
                  <div className="text-center">
                    <p className="text-sm font-medium">{color.name}</p>
                    <p className="text-xs text-muted-foreground font-mono">{color.hex}</p>
                    <p className="text-xs text-muted-foreground">{color.usage}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm col-span-full">No colors generated</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Type className="w-5 h-5" />
            Typography
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {brandKit.fontPairings && brandKit.fontPairings.length > 0 ? (
              brandKit.fontPairings.map((pairing, index) => (
                <Card key={index} className="bg-muted/30">
                  <CardContent className="p-4 space-y-2">
                    <p className="text-xs text-muted-foreground">Pairing {index + 1}</p>
                    <p className="font-semibold">{pairing.heading}</p>
                    <p className="text-sm text-muted-foreground">{pairing.body}</p>
                    {pairing.accent && (
                      <p className="text-xs text-muted-foreground">Accent: {pairing.accent}</p>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-muted-foreground text-sm col-span-full">No font pairings generated</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Target className="w-5 h-5" />
            Messaging Pillars
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-4">
            {brandKit.messagingPillars && brandKit.messagingPillars.length > 0 ? (
              brandKit.messagingPillars.map((pillar, index) => (
                <Card key={index} className="bg-muted/30">
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2">{pillar.title}</h4>
                    <p className="text-sm text-muted-foreground">{pillar.description}</p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-muted-foreground text-sm col-span-full">No messaging pillars generated</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
