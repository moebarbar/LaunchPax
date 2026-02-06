import { Link, useLocation, useSearch } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useSelectedProject } from "@/hooks/use-selected-project";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Rocket,
  LayoutDashboard,
  Type,
  Palette,
  Globe,
  Image,
  Activity,
  Settings,
  Plug,
  LogOut,
  ChevronUp,
  Plus,
  PenTool,
} from "lucide-react";

const globalNavItems = [
  { title: "Connectors", url: "/connectors", icon: Plug },
  { title: "Settings", url: "/settings", icon: Settings },
];

const projectNavItems = [
  { title: "Overview", tab: "overview", icon: LayoutDashboard },
  { title: "Naming & Domain", tab: "naming", icon: Type },
  { title: "Brand Kit", tab: "brand", icon: Palette },
  { title: "Website", tab: "website", icon: Globe },
  { title: "Graphics", tab: "graphics", icon: Image },
  { title: "Activity", tab: "activity", icon: Activity },
  { title: "Site Settings", tab: "settings", icon: Settings },
];

export function AppSidebar() {
  const [location, navigate] = useLocation();
  const { user } = useAuth();
  const { selectedProject } = useSelectedProject();

  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return "U";
  };

  const getUserDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user?.email || "User";
  };

  const searchString = useSearch();
  const currentTab = new URLSearchParams(searchString).get("tab") || "overview";

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link href="/dashboard">
          <div className="flex items-center gap-2 cursor-pointer" data-testid="link-home">
            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
              <Rocket className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg">LaunchPax</span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {selectedProject && (
          <SidebarGroup>
            <SidebarGroupLabel className="truncate">
              {selectedProject.name}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {projectNavItems.map((item) => (
                  <SidebarMenuItem key={item.tab}>
                    <SidebarMenuButton
                      asChild
                      isActive={
                        (location === "/" || location === "/dashboard") &&
                        currentTab === item.tab
                      }
                    >
                      <Link
                        href={`/dashboard?tab=${item.tab}`}
                        data-testid={`link-project-${item.tab}`}
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
              <div className="mt-2 px-2">
                <Link href={`/project/${selectedProject.id}/editor`}>
                  <Button variant="outline" className="w-full gap-2" data-testid="button-visual-editor">
                    <PenTool className="w-4 h-4" />
                    Visual Editor
                  </Button>
                </Link>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {globalNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.url}
                  >
                    <Link href={item.url} data-testid={`link-${item.title.toLowerCase()}`}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupContent>
            <Link href="/project/new">
              <Button className="w-full" data-testid="button-new-project">
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Button>
            </Link>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 w-full p-2 rounded-md hover-elevate" data-testid="button-user-menu">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.profileImageUrl || undefined} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm font-medium truncate">{getUserDisplayName()}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem asChild>
              <Link href="/settings" className="cursor-pointer" data-testid="link-user-settings">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <a href="/api/logout" className="cursor-pointer text-destructive" data-testid="button-logout">
                <LogOut className="w-4 h-4 mr-2" />
                Log out
              </a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
