import { useQuery } from '@tanstack/react-query';
import { FileText, Clock, CheckCircle, XCircle, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardLayout } from '@/components/dashboard-layout';
import { useAuth } from '@/lib/auth-context';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';

export default function InsuranceDashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const { data: stats, isLoading } = useQuery<{
    totalClaims: number;
    pendingClaims: number;
    approvedClaims: number;
    rejectedClaims: number;
  }>({
    queryKey: ['/api/insurance/stats'],
  });

  if (isLoading) {
    return (
      <DashboardLayout role="insurance">
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
    totalClaims: 0,
    pendingClaims: 0,
    approvedClaims: 0,
    rejectedClaims: 0,
  };

  return (
    <DashboardLayout role="insurance">
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-3xl font-bold">Welcome, {user?.fullName}</h1>
          <p className="mt-2 text-muted-foreground">
            Manage insurance claims with blockchain transparency
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Claims</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="stat-total-claims">
                {statsData.totalClaims}
              </div>
              <p className="text-xs text-muted-foreground">All submissions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="stat-pending-claims">
                {statsData.pendingClaims}
              </div>
              <p className="text-xs text-muted-foreground">Under review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="stat-approved-claims">
                {statsData.approvedClaims}
              </div>
              <p className="text-xs text-muted-foreground">Successfully processed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="stat-rejected-claims">
                {statsData.rejectedClaims}
              </div>
              <p className="text-xs text-muted-foreground">Declined claims</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Find Best Insurance Plans</CardTitle>
              <CardDescription>Compare and purchase health insurance policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Browse comprehensive health insurance plans from top providers. Compare coverage,
                premiums, and benefits to find the perfect plan for you.
              </p>
              <Button
                className="w-full"
                onClick={() => window.open('https://www.policybazaar.com/health-insurance/', '_blank')}
                data-testid="button-policybazaar"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Browse Plans on PolicyBazaar
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Claim Management</CardTitle>
              <CardDescription>Submit and track insurance claims</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <button
                className="flex w-full items-center gap-3 rounded-md border p-4 text-left transition-colors hover-elevate active-elevate-2"
                onClick={() => setLocation('/dashboard/insurance/submit')}
                data-testid="button-submit-claim"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-chart-4/10">
                  <FileText className="h-5 w-5 text-chart-4" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Submit New Claim</p>
                  <p className="text-sm text-muted-foreground">File a new insurance claim</p>
                </div>
              </button>

              <button
                className="flex w-full items-center gap-3 rounded-md border p-4 text-left transition-colors hover-elevate active-elevate-2"
                onClick={() => setLocation('/dashboard/insurance/claims')}
                data-testid="button-view-claims"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Track My Claims</p>
                  <p className="text-sm text-muted-foreground">View claim status and history</p>
                </div>
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
