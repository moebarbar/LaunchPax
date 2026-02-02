import { useQuery } from "@tanstack/react-query";
import { useParams, useSearch } from "wouter";
import { useState, useEffect, useCallback } from "react";
import WebsiteRenderer from "@/components/website-templates/website-renderer";
import type { WebsiteContent } from "@shared/schema";
import { Loader2 } from "lucide-react";

export default function PublishedSite() {
  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId || "";
  const searchString = useSearch();
  
  const urlParams = new URLSearchParams(searchString);
  const initialPage = urlParams.get("page") || "home";
  
  const [currentPage, setCurrentPage] = useState(initialPage);
  
  const { data: websiteContent, isLoading, error } = useQuery<WebsiteContent>({
    queryKey: ["/api/site", projectId],
    enabled: !!projectId,
  });
  
  const handlePageChange = useCallback((pageSlug: string) => {
    let slug = pageSlug;
    if (slug.startsWith("/")) {
      slug = slug.substring(1);
    }
    if (!slug || slug === "home" || slug === "") {
      slug = "home";
    }
    setCurrentPage(slug);
    window.history.replaceState({}, "", `/site/${projectId}?page=${slug}`);
  }, [projectId]);
  
  useEffect(() => {
    const newParams = new URLSearchParams(searchString);
    const pageFromUrl = newParams.get("page") || "home";
    if (pageFromUrl !== currentPage) {
      setCurrentPage(pageFromUrl);
    }
  }, [searchString]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (error) {
    const errorMessage = (error as any)?.message || "Site not found";
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Site Not Available</h1>
          <p className="text-muted-foreground">
            {errorMessage.includes("403") 
              ? "This site is not published yet." 
              : "The requested site could not be found."}
          </p>
        </div>
      </div>
    );
  }
  
  if (!websiteContent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Site Not Found</h1>
          <p className="text-muted-foreground">The requested site doesn't exist.</p>
        </div>
      </div>
    );
  }
  
  return (
    <WebsiteRenderer 
      content={websiteContent} 
      pageSlug={currentPage}
      isPreview={false} 
      onNavigate={handlePageChange}
    />
  );
}
