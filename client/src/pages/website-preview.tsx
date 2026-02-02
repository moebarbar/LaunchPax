import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import WebsiteRenderer from "@/components/website-templates/website-renderer";
import type { WebsiteContent } from "@shared/schema";
import { Loader2 } from "lucide-react";

export default function WebsitePreview() {
  const params = useParams<{ token: string }>();
  const token = params.token || "";
  
  const { data: websiteContent, isLoading, error } = useQuery<WebsiteContent>({
    queryKey: ["/api/preview", token],
    enabled: !!token,
  });
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (error || !websiteContent || websiteContent.status === "pending") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">No Preview Available</h1>
          <p className="text-muted-foreground">Generate website content first to see a preview.</p>
        </div>
      </div>
    );
  }
  
  return <WebsiteRenderer content={websiteContent} isPreview={true} />;
}
