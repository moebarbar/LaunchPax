import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import type { Project } from "@shared/schema";

interface SelectedProjectContextValue {
  selectedProjectId: number | null;
  selectedProject: Project | undefined;
  projects: Project[] | undefined;
  isLoadingProjects: boolean;
  selectProject: (id: number | null) => void;
}

const SelectedProjectContext = createContext<SelectedProjectContextValue>({
  selectedProjectId: null,
  selectedProject: undefined,
  projects: undefined,
  isLoadingProjects: false,
  selectProject: () => {},
});

const STORAGE_KEY = "launchpax-selected-project";

function getStoredProjectId(): number | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? parseInt(stored) : null;
  } catch {
    return null;
  }
}

export function SelectedProjectProvider({ children }: { children: React.ReactNode }) {
  const [location, navigate] = useLocation();
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(getStoredProjectId);

  const { data: projects, isLoading: isLoadingProjects } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const { data: selectedProject } = useQuery<Project>({
    queryKey: ["/api/projects", selectedProjectId],
    enabled: !!selectedProjectId,
  });

  useEffect(() => {
    const match = location.match(/^\/project\/(\d+)/);
    if (match) {
      const urlProjectId = parseInt(match[1]);
      if (urlProjectId !== selectedProjectId) {
        setSelectedProjectId(urlProjectId);
        localStorage.setItem(STORAGE_KEY, urlProjectId.toString());
      }
    }
  }, [location]);

  useEffect(() => {
    if (!selectedProjectId && projects && projects.length > 0) {
      const firstProject = projects[0];
      setSelectedProjectId(firstProject.id);
      localStorage.setItem(STORAGE_KEY, firstProject.id.toString());
    }
  }, [projects, selectedProjectId]);

  useEffect(() => {
    if (selectedProjectId && projects && projects.length > 0) {
      const exists = projects.some(p => p.id === selectedProjectId);
      if (!exists) {
        const firstProject = projects[0];
        setSelectedProjectId(firstProject.id);
        localStorage.setItem(STORAGE_KEY, firstProject.id.toString());
      }
    }
  }, [projects, selectedProjectId]);

  const selectProject = useCallback((id: number | null) => {
    setSelectedProjectId(id);
    if (id) {
      localStorage.setItem(STORAGE_KEY, id.toString());
      if (location === "/" || location === "/dashboard" || location.startsWith("/project/")) {
        navigate("/dashboard");
      }
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [location, navigate]);

  return (
    <SelectedProjectContext.Provider value={{
      selectedProjectId,
      selectedProject,
      projects,
      isLoadingProjects,
      selectProject,
    }}>
      {children}
    </SelectedProjectContext.Provider>
  );
}

export function useSelectedProject() {
  return useContext(SelectedProjectContext);
}
