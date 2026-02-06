import { useSelectedProject } from "@/hooks/use-selected-project";
import { useLocation } from "wouter";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function ProjectSelector() {
  const { selectedProjectId, projects, isLoadingProjects, selectProject } = useSelectedProject();
  const [, navigate] = useLocation();

  if (isLoadingProjects) {
    return <Skeleton className="h-9 w-48" />;
  }

  if (!projects || projects.length === 0) {
    return (
      <Button
        variant="outline"
        className="gap-2"
        onClick={() => navigate("/project/new")}
        data-testid="button-header-new-project"
      >
        <Plus className="w-4 h-4" />
        Create Project
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Select
        value={selectedProjectId?.toString() || ""}
        onValueChange={(val) => {
          if (val === "__new__") {
            navigate("/project/new");
          } else {
            selectProject(parseInt(val));
          }
        }}
      >
        <SelectTrigger
          className="w-[200px] sm:w-[260px]"
          data-testid="select-project"
        >
          <SelectValue placeholder="Select a project" />
        </SelectTrigger>
        <SelectContent>
          {projects.map((project) => (
            <SelectItem
              key={project.id}
              value={project.id.toString()}
              data-testid={`select-project-option-${project.id}`}
            >
              <div className="flex items-center gap-2">
                <span className="truncate">{project.name}</span>
              </div>
            </SelectItem>
          ))}
          <SelectItem value="__new__" data-testid="select-project-new">
            <div className="flex items-center gap-2 text-primary">
              <Plus className="w-3 h-3" />
              <span>New Project</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
