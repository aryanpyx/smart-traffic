import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Sidebar, SidebarProvider, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger } from "@/components/ui/sidebar";
import { authService } from "@/lib/auth";
import { TrafficCone, LayoutDashboard, Map, Bot, BarChart3, Settings, User } from "lucide-react";
import { Link, useLocation } from "wouter";

// Pages
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import MapView from "@/pages/map";
import AIControl from "@/pages/ai-control";
import Analytics from "@/pages/analytics";
import NotFound from "@/pages/not-found";

function AppSidebar() {
  const [location] = useLocation();
  const currentUser = authService.getCurrentUser();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/map', label: 'Live Map', icon: Map },
    { path: '/ai-control', label: 'AI Control', icon: Bot },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  const handleLogout = () => {
    authService.logout();
    window.location.href = '/login';
  };

  return (
    <Sidebar className="w-64">
      <SidebarHeader className="p-6 border-b">
        <div className="flex items-center space-x-3">
          <TrafficCone className="text-primary w-6 h-6" />
          <span className="font-semibold text-lg">Traffic Control</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="flex-1">
        <SidebarMenu className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;
            
            return (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton asChild isActive={isActive}>
                  <Link 
                    href={item.path}
                    className="flex items-center space-x-3 p-3 rounded-lg w-full"
                    data-testid={`nav-${item.label.toLowerCase().replace(' ', '-')}`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      
      {/* User Profile */}
      <div className="p-4 border-t">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium">{currentUser?.username || 'Admin User'}</p>
            <p className="text-xs text-muted-foreground">{currentUser?.role || 'Traffic Authority'}</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          data-testid="button-logout"
        >
          Logout
        </button>
      </div>
    </Sidebar>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = authService.isAuthenticated();
  
  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }
  
  return <>{children}</>;
}

function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background">
        <AppSidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            <div className="md:hidden mb-4">
              <SidebarTrigger />
            </div>
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      
      <Route path="/">
        {() => <Redirect to="/dashboard" />}
      </Route>
      
      <Route path="/dashboard">
        <ProtectedRoute>
          <AuthenticatedLayout>
            <Dashboard />
          </AuthenticatedLayout>
        </ProtectedRoute>
      </Route>
      
      <Route path="/map">
        <ProtectedRoute>
          <AuthenticatedLayout>
            <MapView />
          </AuthenticatedLayout>
        </ProtectedRoute>
      </Route>
      
      <Route path="/ai-control">
        <ProtectedRoute>
          <AuthenticatedLayout>
            <AIControl />
          </AuthenticatedLayout>
        </ProtectedRoute>
      </Route>
      
      <Route path="/analytics">
        <ProtectedRoute>
          <AuthenticatedLayout>
            <Analytics />
          </AuthenticatedLayout>
        </ProtectedRoute>
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
