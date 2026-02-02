import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Image,
  Sparkles,
  Loader2,
  Instagram,
  Facebook,
  Copy,
  Check,
} from "lucide-react";
import type { GraphicAsset, WorkflowJob } from "@shared/schema";

interface GraphicsProps {
  projectId: number;
}

export default function Graphics({ projectId }: GraphicsProps) {
  const { toast } = useToast();
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const { data: graphics, isLoading, refetch: refetchGraphics } = useQuery<GraphicAsset[]>({
    queryKey: ["/api/projects", projectId, "graphics"],
  });

  const { data: workflowJob, refetch: refetchJob } = useQuery<WorkflowJob>({
    queryKey: ["/api/projects", projectId, "workflows", "graphics", "status"],
    refetchInterval: (query) => {
      const job = query.state.data;
      // Only poll if workflow is actively running
      if (job?.status === "running") {
        return 2000;
      }
      return false;
    },
  });

  // Track previous workflow status to detect completion
  const prevStatusRef = useRef<string | undefined>(undefined);
  
  // Refetch results when workflow completes
  useEffect(() => {
    const currentStatus = workflowJob?.status;
    const prevStatus = prevStatusRef.current;
    
    if (prevStatus === "running" && currentStatus === "completed") {
      refetchGraphics();
    }
    
    prevStatusRef.current = currentStatus;
  }, [workflowJob?.status, refetchGraphics]);

  const generateGraphics = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/projects/${projectId}/workflows/graphics/run`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Generating graphics",
        description: "Creating your marketing assets...",
      });
      refetchJob();
      queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "graphics"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate graphics.",
        variant: "destructive",
      });
    },
  });

  const isRunning = workflowJob?.status === "running";

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "instagram_post":
      case "story":
        return Instagram;
      case "facebook_ad":
        return Facebook;
      default:
        return Image;
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "instagram_post":
        return "bg-pink-500/10 text-pink-600";
      case "story":
        return "bg-purple-500/10 text-purple-600";
      case "facebook_ad":
        return "bg-blue-500/10 text-blue-600";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const copyToClipboard = async (text: string, id: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast({ title: "Copied!", description: "Text copied to clipboard" });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (!graphics || graphics.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Image className="w-8 h-8 text-primary" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Ready-to-Post Graphics</h3>
          <p className="text-muted-foreground text-sm mb-6 max-w-md">
            Generate design briefs and copy for Instagram posts, Stories, and Facebook ads.
          </p>
          <Button
            onClick={() => generateGraphics.mutate()}
            disabled={generateGraphics.isPending || isRunning}
            data-testid="button-generate-graphics"
          >
            {generateGraphics.isPending || isRunning ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Graphics
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
          <h3 className="font-semibold mb-2">Creating Graphics...</h3>
          <p className="text-muted-foreground text-sm">This may take a moment</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Marketing Graphics</h2>
          <p className="text-muted-foreground text-sm">
            {graphics.length} assets generated
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => generateGraphics.mutate()}
          disabled={isRunning}
          data-testid="button-regenerate-graphics"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Regenerate
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {graphics.map((graphic) => {
          const Icon = getTypeIcon(graphic.type);
          return (
            <Card key={graphic.id} className="overflow-hidden" data-testid={`card-graphic-${graphic.id}`}>
              <div
                className="aspect-square bg-gradient-to-br from-primary/20 via-primary/10 to-transparent flex items-center justify-center relative"
              >
                {graphic.imageUrl ? (
                  <img
                    src={graphic.imageUrl}
                    alt={graphic.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-6">
                    <Icon className="w-12 h-12 text-primary/50 mx-auto mb-3" />
                    <p className="text-xs text-muted-foreground">
                      {graphic.dimensions}
                    </p>
                  </div>
                )}
                <Badge
                  variant="outline"
                  className={`absolute top-3 right-3 ${getTypeBadgeColor(graphic.type)}`}
                >
                  {graphic.type.replace("_", " ")}
                </Badge>
              </div>
              <CardContent className="p-4 space-y-3">
                <h3 className="font-medium">{graphic.name}</h3>
                {graphic.copyText && (
                  <div className="relative">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {graphic.copyText}
                    </p>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute -top-1 -right-1"
                      onClick={() => copyToClipboard(graphic.copyText || "", graphic.id)}
                      data-testid={`button-copy-${graphic.id}`}
                    >
                      {copiedId === graphic.id ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                )}
                {graphic.designBrief && (
                  <div className="text-xs text-muted-foreground p-2 bg-muted/50 rounded">
                    <p className="font-medium mb-1">Design Brief:</p>
                    <p className="line-clamp-2">{graphic.designBrief}</p>
                  </div>
                )}
                <Badge variant="outline" className="capitalize">
                  {graphic.status}
                </Badge>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
