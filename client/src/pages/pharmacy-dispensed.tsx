import { useQuery } from '@tanstack/react-query';
import { Pill, CheckCircle } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useAuth } from '@/lib/auth-context';

export default function PharmacyDispensed() {
  const { user } = useAuth();
  const { data: prescriptions, isLoading } = useQuery({
    queryKey: ['/api/prescriptions'],
  });

  const dispensedByMe = (Array.isArray(prescriptions) ? prescriptions : []).filter(
    (p: any) => p.dispensedById === user?.id && p.status === 'dispensed'
  );

  return (
    <DashboardLayout role="pharmacy">
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-3xl font-bold">Dispensed Records</h1>
          <p className="mt-2 text-muted-foreground">
            History of prescriptions you've dispensed
          </p>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-40" />
            ))}
          </div>
        ) : dispensedByMe.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {dispensedByMe.map((prescription: any) => (
              <Card key={prescription.id} data-testid={`dispensed-${prescription.id}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">#{prescription.id.slice(0, 8)}</CardTitle>
                      <CardDescription>{prescription.diagnosis}</CardDescription>
                    </div>
                    <Badge className="bg-chart-2">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Dispensed
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Patient ID</p>
                    <code className="text-sm font-mono">{prescription.patientId.slice(0, 12)}...</code>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    Dispensed {format(new Date(prescription.dispensedAt), 'MMM d, yyyy h:mm a')}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Pill className="h-16 w-16 text-muted-foreground/50" />
              <h3 className="mt-4 font-serif text-xl font-semibold">No dispensed records yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Prescriptions you dispense will appear here
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
