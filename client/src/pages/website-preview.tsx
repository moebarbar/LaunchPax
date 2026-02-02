import { useQuery } from "@tanstack/react-query";
import { useParams, useSearch } from "wouter";
import { useState, useEffect, useCallback } from "react";
import WebsiteRenderer from "@/components/website-templates/website-renderer";
import type { WebsiteContent } from "@shared/schema";
import { Loader2 } from "lucide-react";

export default function WebsitePreview() {
  const params = useParams<{ token: string }>();
  const token = params.token || "";
  const searchString = useSearch();
  
  const urlParams = new URLSearchParams(searchString);
  const initialPage = urlParams.get("page") || "home";
  
  const [currentPage, setCurrentPage] = useState(initialPage);
  
  const { data: websiteContent, isLoading, error } = useQuery<WebsiteContent>({
    queryKey: ["/api/preview", token],
    enabled: !!token,
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
    window.history.replaceState({}, "", `/preview/${token}?page=${slug}`);
  }, [token]);
  
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
  
  return (
    <WebsiteRenderer 
      content={websiteContent} 
      pageSlug={currentPage}
      isPreview={true} 
      onNavigate={handlePageChange}
    />
  );
}
