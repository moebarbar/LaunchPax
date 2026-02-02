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
  Palette,
  Sparkles,
  Image,
  RefreshCw,
  Loader2,
  AlertCircle,
  Key,
} from "lucide-react";

interface ConnectorInfo {
  key: string;
  name: string;
  description: string;
  category: string;
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "domains":
        return Globe;
      case "branding":
        return Palette;
      case "ai":
        return Sparkles;
      case "graphics":
        return Image;
      default:
        return Plug;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "domains":
        return "bg-blue-500/10 text-blue-600";
      case "branding":
        return "bg-pink-500/10 text-pink-600";
      case "ai":
        return "bg-purple-500/10 text-purple-600";
      case "graphics":
        return "bg-orange-500/10 text-orange-600";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 p-6 space-y-6 overflow-auto">
        <div>
          <h1 className="text-2xl font-bold">Connectors</h1>
          <p className="text-muted-foreground">Manage your API integrations</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  const configuredCount = connectors?.filter((c) => c.isConfigured).length || 0;

  return (
    <div className="flex-1 p-6 space-y-6 overflow-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Connectors</h1>
          <p className="text-muted-foreground">
            {configuredCount} of {connectors?.length || 0} connectors configured
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {connectors?.map((connector) => {
          const Icon = getCategoryIcon(connector.category);
          return (
            <Card key={connector.key} className="relative" data-testid={`card-connector-${connector.key}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
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
                  <Badge variant="outline" className={getCategoryColor(connector.category)}>
                    {connector.category}
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    {connector.authType}
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

      <Card className="bg-muted/30">
        <CardContent className="flex items-start gap-4 p-6">
          <AlertCircle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium mb-1">Adding New Connectors</h3>
            <p className="text-sm text-muted-foreground">
              To configure a connector, add the required environment variables to your project settings.
              The platform will automatically detect and enable the connector once the variables are set.
              Connectors without API keys will use mock mode for demonstration purposes.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
