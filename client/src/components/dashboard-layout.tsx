import { ReactNode } from 'react';
import { useLocation } from 'wouter';
import { 
  LayoutDashboard, FileText, Pill, FileHeart, 
  Lock, Activity, LogOut, Shield, Settings
} from 'lucide-react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  SidebarProvider,
  SidebarTrigger,
  SidebarHeader,
  SidebarFooter
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ThemeToggle } from './theme-toggle';
import { useAuth } from '@/lib/auth-context';

interface DashboardLayoutProps {
  children: ReactNode;
  role: 'patient' | 'doctor' | 'pharmacy' | 'insurance';
}

const navigationItems = {
  patient: [
    { title: 'Overview', icon: LayoutDashboard, path: '/dashboard/patient' },
    { title: 'Medical Records', icon: FileText, path: '/dashboard/patient/records' },
    { title: 'Access Control', icon: Lock, path: '/dashboard/patient/access' },
    { title: 'Health Insights', icon: Activity, path: '/dashboard/patient/insights' },
    { title: 'Blockchain Log', icon: Shield, path: '/dashboard/patient/blockchain' },
  ],
  doctor: [
    { title: 'Overview', icon: LayoutDashboard, path: '/dashboard/doctor' },
    { title: 'Create Prescription', icon: FileText, path: '/dashboard/doctor/prescribe' },
    { title: 'My Prescriptions', icon: FileHeart, path: '/dashboard/doctor/prescriptions' },
    { title: 'Patients', icon: Activity, path: '/dashboard/doctor/patients' },
  ],
  pharmacy: [
    { title: 'Overview', icon: LayoutDashboard, path: '/dashboard/pharmacy' },
    { title: 'Verify Prescription', icon: Shield, path: '/dashboard/pharmacy/verify' },
    { title: 'Dispensed Records', icon: Pill, path: '/dashboard/pharmacy/dispensed' },
  ],
  insurance: [
    { title: 'Overview', icon: LayoutDashboard, path: '/dashboard/insurance' },
    { title: 'Find Plans', icon: FileHeart, path: '/dashboard/insurance/plans' },
    { title: 'Submit Claim', icon: FileText, path: '/dashboard/insurance/submit' },
    { title: 'My Claims', icon: Activity, path: '/dashboard/insurance/claims' },
  ],
};

export function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const [location, setLocation] = useLocation();
  const { user, logout } = useAuth();
  const items = navigationItems[role];

  const handleLogout = () => {
    logout();
    setLocation('/login');
  };

  const style = {
    '--sidebar-width': '16rem',
    '--sidebar-width-icon': '3rem',
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const roleColors = {
    patient: 'bg-primary/10 text-primary',
    doctor: 'bg-chart-2/10 text-chart-2',
    pharmacy: 'bg-chart-5/10 text-chart-5',
    insurance: 'bg-chart-4/10 text-chart-4',
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <Sidebar>
          <SidebarHeader className="border-b p-4">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="font-serif text-lg font-bold">MediGuard</span>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        onClick={() => setLocation(item.path)}
                        isActive={location === item.path}
                        data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t p-4">
            <div className="mb-3 flex items-center gap-3">
              <Avatar>
                <AvatarFallback className={roleColors[role]}>
                  {user?.fullName ? getInitials(user.fullName) : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium">{user?.fullName}</p>
                <p className="text-xs capitalize text-muted-foreground">{role}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={handleLogout}
              data-testid="button-logout"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </SidebarFooter>
        </Sidebar>

        <div className="flex flex-1 flex-col">
          <header className="flex h-16 items-center justify-between border-b px-6">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <div className="flex items-center gap-2">
              <ThemeToggle />
            </div>
          </header>
          <main className="flex-1 overflow-auto bg-background p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
