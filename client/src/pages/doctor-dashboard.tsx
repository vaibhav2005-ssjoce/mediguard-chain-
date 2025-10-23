import { useQuery } from '@tanstack/react-query';
import { FileText, Users, CheckCircle, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardLayout } from '@/components/dashboard-layout';
import { useAuth } from '@/lib/auth-context';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['/api/doctor/stats'],
  });

  if (isLoading) {
    return (
      <DashboardLayout role="doctor">
        <div className="space-y-6">
          <div>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="mt-2 h-4 w-96" />
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const statsData = stats || {
    totalPrescriptions: 0,
    pendingPrescriptions: 0,
    dispensedPrescriptions: 0,
    totalPatients: 0,
  };

  return (
    <DashboardLayout role="doctor">
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-3xl font-bold">
            Dr. {user?.fullName}
            {user?.specialization && (
              <span className="ml-2 text-xl font-normal text-muted-foreground">
                • {user.specialization}
              </span>
            )}
          </h1>
          <p className="mt-2 text-muted-foreground">
            Create and manage blockchain-verified e-prescriptions
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Prescriptions</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="stat-total-prescriptions">
                {statsData.totalPrescriptions}
              </div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="stat-pending">
                {statsData.pendingPrescriptions}
              </div>
              <p className="text-xs text-muted-foreground">Awaiting pharmacy</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dispensed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="stat-dispensed">
                {statsData.dispensedPrescriptions}
              </div>
              <p className="text-xs text-muted-foreground">Completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Patients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="stat-patients">
                {statsData.totalPatients}
              </div>
              <p className="text-xs text-muted-foreground">Under care</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-serif">Quick Actions</CardTitle>
            <CardDescription>Common prescription management tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <button
              className="flex w-full items-center gap-3 rounded-md border p-4 text-left transition-colors hover-elevate active-elevate-2"
              onClick={() => setLocation('/dashboard/doctor/prescribe')}
              data-testid="button-create-prescription"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-chart-2/10">
                <FileText className="h-5 w-5 text-chart-2" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Create New Prescription</p>
                <p className="text-sm text-muted-foreground">
                  Write and verify e-prescription on blockchain
                </p>
              </div>
            </button>

            <button
              className="flex w-full items-center gap-3 rounded-md border p-4 text-left transition-colors hover-elevate active-elevate-2"
              onClick={() => setLocation('/dashboard/doctor/prescriptions')}
              data-testid="button-view-prescriptions"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                <CheckCircle className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium">View My Prescriptions</p>
                <p className="text-sm text-muted-foreground">See all issued prescriptions</p>
              </div>
            </button>

            <button
              className="flex w-full items-center gap-3 rounded-md border p-4 text-left transition-colors hover-elevate active-elevate-2"
              onClick={() => setLocation('/dashboard/doctor/patients')}
              data-testid="button-view-patients"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-chart-4/10">
                <Users className="h-5 w-5 text-chart-4" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Patient Records</p>
                <p className="text-sm text-muted-foreground">Access patient information</p>
              </div>
            </button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
