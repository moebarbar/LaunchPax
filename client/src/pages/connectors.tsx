import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Plug,
  CheckCircle2,
  XCircle,
  Globe,
  Sparkles,
  Image,
  RefreshCw,
  Loader2,
  AlertCircle,
  Key,
  Zap,
  Brain,
  Palette,
  Camera,
} from "lucide-react";

interface ConnectorInfo {
  key: string;
  name: string;
  description: string;
  category: string;
  capabilities: string[];
  authType: string;
  requiredEnvVars: string[];
  isConfigured: boolean;
  testStatus?: string;
  lastTestedAt?: string;
}

export default function ConnectorsPage() {
  const { toast } = useToast();

  const { data: connectors, isLoading } = useQuery<ConnectorInfo[]>({
    queryKey: ["/api/connectors"],
  });

  const testConnector = useMutation({
    mutationFn: async (key: string) => {
      const response = await apiRequest("POST", `/api/connectors/${key}/test`);
      return response.json();
    },
    onSuccess: (data, key) => {
      queryClient.invalidateQueries({ queryKey: ["/api/connectors"] });
      if (data.ok) {
        toast({
          title: "Connection successful",
          description: `${key} is working correctly`,
        });
      } else {
        toast({
          title: "Connection failed",
          description: data.message || "Could not connect",
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "Test failed",
        description: "Could not test connection",
        variant: "destructive",
      });
    },
  });

  const getConnectorIcon = (key: string) => {
    switch (key) {
      case "openai":
        return Brain;
      case "claude":
        return Sparkles;
      case "nanobanana":
        return Image;
      case "pexels":
        return Camera;
      default:
        return Plug;
    }
  };

  const getConnectorGradient = (key: string) => {
    switch (key) {
      case "openai":
        return "from-emerald-500 to-teal-600";
      case "claude":
        return "from-orange-500 to-amber-600";
      case "nanobanana":
        return "from-blue-500 to-indigo-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 p-6 space-y-6 overflow-auto">
        <div>
          <h1 className="text-2xl font-bold">LaunchPax Engine</h1>
          <p className="text-muted-foreground">Loading connectors...</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  const aiConnectors = connectors?.filter((c) => c.category === "ai" && !c.key.endsWith("_mock")) || [];
  const otherConnectors = connectors?.filter((c) => c.category !== "ai" || c.key.endsWith("_mock")) || [];
  const configuredAI = aiConnectors.filter((c) => c.isConfigured).length;

  return (
    <div className="flex-1 p-6 space-y-8 overflow-auto">
      <Card className="overflow-hidden border-0 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600">
        <CardContent className="p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">LaunchPax Engine</h1>
                  <p className="text-white/80 text-sm">Multi-Model AI Orchestration</p>
                </div>
              </div>
              <p className="text-white/90 max-w-xl">
                The LaunchPax Engine combines the power of multiple AI models to generate 
                premium-quality websites. Each model contributes its unique strengths for 
                best-in-class results.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="px-4 py-2 rounded-lg bg-white/10 backdrop-blur">
                <div className="text-2xl font-bold text-white">{configuredAI}</div>
                <div className="text-xs text-white/70">Active Models</div>
              </div>
              <div className="px-4 py-2 rounded-lg bg-white/10 backdrop-blur">
                <div className="text-2xl font-bold text-white">{aiConnectors.length}</div>
                <div className="text-xs text-white/70">Available</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">AI Models</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {aiConnectors.map((connector) => {
            const Icon = getConnectorIcon(connector.key);
            const gradient = getConnectorGradient(connector.key);
            return (
              <Card key={connector.key} className="relative overflow-hidden" data-testid={`card-connector-${connector.key}`}>
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient}`} />
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    {connector.isConfigured ? (
                      <Badge className="bg-green-500/10 text-green-600 border-green-200">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground">
                        <XCircle className="w-3 h-3 mr-1" />
                        Inactive
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg mt-3">{connector.name}</CardTitle>
                  <CardDescription className="text-sm">{connector.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {connector.capabilities && connector.capabilities.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {connector.capabilities.slice(0, 3).map((cap) => (
                        <Badge key={cap} variant="secondary" className="text-xs capitalize">
                          {cap.replace(/_/g, " ")}
                        </Badge>
                      ))}
                      {connector.capabilities.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{connector.capabilities.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  {connector.requiredEnvVars.length > 0 && (
                    <div className="text-xs text-muted-foreground">
                      <p className="font-medium mb-1 flex items-center gap-1">
                        <Key className="w-3 h-3" />
                        Required:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {connector.requiredEnvVars.map((envVar) => (
                          <code key={envVar} className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">
                            {envVar}
                          </code>
                        ))}
                      </div>
                    </div>
                  )}

                  {connector.testStatus && (
                    <div className="flex items-center gap-2 text-xs">
                      {connector.testStatus === "ok" ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-green-500" />
                          <span className="text-green-600">Last test passed</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-3 h-3 text-yellow-500" />
                          <span className="text-yellow-600">{connector.testStatus}</span>
                        </>
                      )}
                    </div>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => testConnector.mutate(connector.key)}
                    disabled={testConnector.isPending}
                    data-testid={`button-test-${connector.key}`}
                  >
                    {testConnector.isPending && testConnector.variables === connector.key ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Testing...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Test Connection
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {otherConnectors.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Other Services</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherConnectors.map((connector) => (
              <Card key={connector.key} className="relative" data-testid={`card-connector-${connector.key}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                      {connector.key === "pexels" ? (
                        <Camera className="w-5 h-5 text-muted-foreground" />
                      ) : connector.category === "domains" ? (
                        <Globe className="w-5 h-5 text-muted-foreground" />
                      ) : connector.category === "stockphotos" ? (
                        <Camera className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <Plug className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                    {connector.isConfigured ? (
                      <Badge className="bg-green-500/10 text-green-600">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Configured
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground">
                        <XCircle className="w-3 h-3 mr-1" />
                        Not Configured
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg mt-3">{connector.name}</CardTitle>
                  <CardDescription>{connector.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="capitalize">
                      {connector.category}
                    </Badge>
                  </div>

                  {connector.requiredEnvVars.length > 0 && (
                    <div className="text-xs text-muted-foreground">
                      <p className="font-medium mb-1 flex items-center gap-1">
                        <Key className="w-3 h-3" />
                        Required:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {connector.requiredEnvVars.map((envVar) => (
                          <code key={envVar} className="px-1.5 py-0.5 bg-muted rounded text-xs">
                            {envVar}
                          </code>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => testConnector.mutate(connector.key)}
                    disabled={testConnector.isPending}
                    data-testid={`button-test-${connector.key}`}
                  >
                    {testConnector.isPending && testConnector.variables === connector.key ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Testing...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Test Connection
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <Card className="bg-muted/30">
        <CardContent className="flex items-start gap-4 p-6">
          <Palette className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium mb-1">Configuring Your API Keys</h3>
            <p className="text-sm text-muted-foreground">
              Add your API keys as environment variables to activate each AI model. The LaunchPax Engine 
              automatically orchestrates the best model for each task. Configure <code className="px-1 py-0.5 bg-muted rounded">OPENAI_API_KEY</code>, <code className="px-1 py-0.5 bg-muted rounded">ANTHROPIC_API_KEY</code>, and <code className="px-1 py-0.5 bg-muted rounded">GOOGLE_AI_API_KEY</code> to 
              unlock the full power of multi-model AI generation.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
