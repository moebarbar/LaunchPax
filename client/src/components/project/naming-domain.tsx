import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Sparkles,
  Loader2,
  Globe,
  Star,
  Check,
  Filter,
  Search,
} from "lucide-react";
import type { Project, NamingResult, WorkflowJob } from "@shared/schema";

interface NamingDomainProps {
  projectId: number;
  project: Project;
}

export default function NamingDomain({ projectId, project }: NamingDomainProps) {
  const { toast } = useToast();
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");

  const { data: namingResult, isLoading } = useQuery<NamingResult>({
    queryKey: ["/api/projects", projectId, "naming-domain", "results"],
  });

  const { data: workflowJob, refetch: refetchJob } = useQuery<WorkflowJob>({
    queryKey: ["/api/projects", projectId, "workflows", "naming-domain", "status"],
    refetchInterval: (query) => {
      const job = query.state.data;
      if (job?.status === "running" || job?.status === "pending") {
        return 2000;
      }
      return false;
    },
  });

  const runWorkflow = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/projects/${projectId}/workflows/naming-domain/run`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Workflow started",
        description: "Generating names and checking domains...",
      });
      refetchJob();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to start workflow. Please try again.",
        variant: "destructive",
      });
    },
  });

  const toggleFavorite = useMutation({
    mutationFn: async (domain: string) => {
      const response = await apiRequest("POST", `/api/projects/${projectId}/naming-domain/favorites`, { domain });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "naming-domain", "results"] });
    },
  });

  const selectDomain = useMutation({
    mutationFn: async (domain: string) => {
      const response = await apiRequest("POST", `/api/projects/${projectId}/naming-domain/select`, { domain });
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Domain selected!", description: "Your domain has been saved." });
      queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "naming-domain", "results"] });
    },
  });

  const isRunning = workflowJob?.status === "running" || workflowJob?.status === "pending";

  const filteredDomains = namingResult?.availableDomains?.filter((d) => {
    if (showAvailableOnly && !d.available) return false;
    if (searchFilter && !d.domain.toLowerCase().includes(searchFilter.toLowerCase())) return false;
    return true;
  }) || [];

  const isFavorite = (domain: string) => namingResult?.favorites?.includes(domain);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Name & Domain Generator
          </CardTitle>
          <CardDescription>
            Generate business names and check domain availability instantly
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!namingResult || namingResult.status === "pending" ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Ready to Generate Names</h3>
              <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
                We'll generate creative business names based on your project details and check domain availability.
              </p>
              <Button
                onClick={() => runWorkflow.mutate()}
                disabled={runWorkflow.isPending || isRunning}
                data-testid="button-generate-names"
              >
                {runWorkflow.isPending || isRunning ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Names
                  </>
                )}
              </Button>
            </div>
          ) : isRunning ? (
            <div className="text-center py-8">
              <Loader2 className="w-12 h-12 text-primary mx-auto mb-4 animate-spin" />
              <h3 className="font-semibold mb-2">Generating Names...</h3>
              <p className="text-muted-foreground text-sm">
                {workflowJob?.progress || 0}% complete
              </p>
            </div>
          ) : (
            <>
              {namingResult.selectedDomain && (
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-700 dark:text-green-400">Selected Domain</p>
                      <p className="text-lg font-mono font-bold">{namingResult.selectedDomain}</p>
                    </div>
                    <Badge className="bg-green-500">Selected</Badge>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search domains..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    className="pl-10"
                    data-testid="input-search-domains"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="available-only"
                    checked={showAvailableOnly}
                    onCheckedChange={(checked) => setShowAvailableOnly(!!checked)}
                  />
                  <label htmlFor="available-only" className="text-sm">
                    Available only
                  </label>
                </div>
                <Button
                  variant="outline"
                  onClick={() => runWorkflow.mutate()}
                  disabled={isRunning}
                  data-testid="button-regenerate"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Regenerate
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {namingResult && namingResult.status === "completed" && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                Domain Results ({filteredDomains.length})
              </CardTitle>
              <Badge variant="outline">
                {namingResult.availableDomains?.filter(d => d.available).length || 0} available
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-2">
                {filteredDomains.map((domain, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      domain.available
                        ? "bg-card hover-elevate cursor-pointer"
                        : "bg-muted/50 opacity-60"
                    } ${namingResult.selectedDomain === domain.domain ? "ring-2 ring-primary" : ""}`}
                    data-testid={`domain-item-${index}`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        onClick={() => toggleFavorite.mutate(domain.domain)}
                        className="flex-shrink-0"
                        data-testid={`button-favorite-${index}`}
                      >
                        <Star
                          className={`w-5 h-5 ${
                            isFavorite(domain.domain)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-muted-foreground"
                          }`}
                        />
                      </button>
                      <span className="font-mono text-sm truncate">{domain.domain}</span>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      {domain.price && (
                        <span className="text-sm text-muted-foreground">
                          ${domain.price}/yr
                        </span>
                      )}
                      {domain.available ? (
                        namingResult.selectedDomain === domain.domain ? (
                          <Badge className="bg-primary">
                            <Check className="w-3 h-3 mr-1" />
                            Selected
                          </Badge>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => selectDomain.mutate(domain.domain)}
                            data-testid={`button-select-${index}`}
                          >
                            Select
                          </Button>
                        )
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground">
                          Taken
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
                {filteredDomains.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No domains match your filters
                  </p>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
