import { useQuery } from '@tanstack/react-query';
import { Shield, Pill, CheckCircle, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardLayout } from '@/components/dashboard-layout';
import { useAuth } from '@/lib/auth-context';
import { Skeleton } from '@/components/ui/skeleton';
import { useLocation } from 'wouter';

export default function PharmacyDashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['/api/pharmacy/stats'],
  });

  if (isLoading) {
    return (
      <DashboardLayout role="pharmacy">
        <div className="space-y-6">
          <div>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="mt-2 h-4 w-96" />
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const statsData = stats || {
    verifiedPrescriptions: 0,
    dispensedToday: 0,
    totalDispensed: 0,
  };

  return (
    <DashboardLayout role="pharmacy">
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-3xl font-bold">{user?.fullName}</h1>
          <p className="mt-2 text-muted-foreground">
            Verify and dispense blockchain-authenticated prescriptions
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Verified Today</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="stat-verified">
                {statsData.verifiedPrescriptions}
              </div>
              <p className="text-xs text-muted-foreground">Blockchain verified</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dispensed Today</CardTitle>
              <Pill className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="stat-dispensed-today">
                {statsData.dispensedToday}
              </div>
              <p className="text-xs text-muted-foreground">Medications provided</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Dispensed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="stat-total-dispensed">
                {statsData.totalDispensed}
              </div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-serif">Pharmacy Workflow</CardTitle>
            <CardDescription>Prescription verification and dispensing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <button
              className="flex w-full items-center gap-3 rounded-md border p-4 text-left transition-colors hover-elevate active-elevate-2"
              onClick={() => setLocation('/dashboard/pharmacy/verify')}
              data-testid="button-verify-prescription"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-chart-5/10">
                <Shield className="h-5 w-5 text-chart-5" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Verify Prescription</p>
                <p className="text-sm text-muted-foreground">
                  Scan QR code or enter prescription ID
                </p>
              </div>
            </button>

            <button
              className="flex w-full items-center gap-3 rounded-md border p-4 text-left transition-colors hover-elevate active-elevate-2"
              onClick={() => setLocation('/dashboard/pharmacy/dispensed')}
              data-testid="button-dispensed-records"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-chart-2/10">
                <Pill className="h-5 w-5 text-chart-2" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Dispensed Records</p>
                <p className="text-sm text-muted-foreground">View dispensing history</p>
              </div>
            </button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-serif">How Verification Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  1
                </div>
                <div>
                  <p className="font-medium">Scan or Enter Prescription ID</p>
                  <p className="text-sm text-muted-foreground">
                    Patient provides prescription from their doctor
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  2
                </div>
                <div>
                  <p className="font-medium">Blockchain Verification</p>
                  <p className="text-sm text-muted-foreground">
                    System validates prescription authenticity via blockchain hash
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  3
                </div>
                <div>
                  <p className="font-medium">Dispense and Record</p>
                  <p className="text-sm text-muted-foreground">
                    Mark as dispensed - transaction logged on blockchain
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
