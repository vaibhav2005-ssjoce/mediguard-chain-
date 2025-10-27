import { useQuery } from '@tanstack/react-query';
import { FileText, Shield, Activity, Upload, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardLayout } from '@/components/dashboard-layout';
import { useAuth } from '@/lib/auth-context';
import { Skeleton } from '@/components/ui/skeleton';

type PatientStats = {
  totalRecords: number;
  sharedRecords: number;
  totalInsights: number;
  blockchainTransactions: number;
};

export default function PatientDashboard() {
  const { user } = useAuth();

  const { data: stats, isLoading } = useQuery<PatientStats>({
    queryKey: ['/api/patient/stats'],
  });

  if (isLoading) {
    return (
      <DashboardLayout role="patient">
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
    totalRecords: 0,
    sharedRecords: 0,
    totalInsights: 0,
    blockchainTransactions: 0,
  };

  return (
    <DashboardLayout role="patient">
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-3xl font-bold">Welcome, {user?.fullName}</h1>
          <p className="mt-2 text-muted-foreground">
            Manage your medical records and control who has access
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Medical Records</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="stat-total-records">
                {statsData.totalRecords}
              </div>
              <p className="text-xs text-muted-foreground">Total uploaded files</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Shared Access</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="stat-shared-records">
                {statsData.sharedRecords}
              </div>
              <p className="text-xs text-muted-foreground">Active permissions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Health Insights</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="stat-insights">
                {statsData.totalInsights}
              </div>
              <p className="text-xs text-muted-foreground">AI-generated alerts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Blockchain Log</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="stat-transactions">
                {statsData.blockchainTransactions}
              </div>
              <p className="text-xs text-muted-foreground">Verified transactions</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Quick Actions</CardTitle>
              <CardDescription>Common tasks for managing your health data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <button
                className="flex w-full items-center gap-3 rounded-md border p-4 text-left transition-colors hover-elevate active-elevate-2"
                data-testid="button-upload-record"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                  <Upload className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Upload Medical Record</p>
                  <p className="text-sm text-muted-foreground">Add new lab reports or documents</p>
                </div>
              </button>

              <button
                className="flex w-full items-center gap-3 rounded-md border p-4 text-left transition-colors hover-elevate active-elevate-2"
                data-testid="button-manage-access"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-chart-2/10">
                  <Shield className="h-5 w-5 text-chart-2" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Manage Access</p>
                  <p className="text-sm text-muted-foreground">Grant or revoke permissions</p>
                </div>
              </button>

              <button
                className="flex w-full items-center gap-3 rounded-md border p-4 text-left transition-colors hover-elevate active-elevate-2"
                data-testid="button-view-insights"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-chart-4/10">
                  <Activity className="h-5 w-5 text-chart-4" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">View Health Insights</p>
                  <p className="text-sm text-muted-foreground">AI-powered health analysis</p>
                </div>
              </button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Recent Activity</CardTitle>
              <CardDescription>Latest blockchain transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {statsData.blockchainTransactions === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Shield className="h-12 w-12 text-muted-foreground/50" />
                    <p className="mt-3 text-sm font-medium">No transactions yet</p>
                    <p className="text-xs text-muted-foreground">
                      Your blockchain activity will appear here
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    View detailed transaction history in the Blockchain Log section
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
