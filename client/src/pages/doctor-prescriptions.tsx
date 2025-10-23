import { useQuery } from '@tanstack/react-query';
import { FileText, CheckCircle, Clock, Pill } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export default function DoctorPrescriptions() {
  const { data: prescriptions, isLoading } = useQuery({
    queryKey: ['/api/prescriptions'],
  });

  return (
    <DashboardLayout role="doctor">
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-3xl font-bold">My Prescriptions</h1>
          <p className="mt-2 text-muted-foreground">
            View all e-prescriptions you've created
          </p>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        ) : prescriptions && prescriptions.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {prescriptions.map((prescription: any) => (
              <Card key={prescription.id} data-testid={`prescription-${prescription.id}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">#{prescription.id.slice(0, 8)}</CardTitle>
                      <CardDescription>{prescription.diagnosis}</CardDescription>
                    </div>
                    <Badge variant={prescription.status === 'dispensed' ? 'default' : 'secondary'} className="capitalize">
                      {prescription.status === 'dispensed' ? (
                        <><CheckCircle className="mr-1 h-3 w-3" />Dispensed</>
                      ) : (
                        <><Clock className="mr-1 h-3 w-3" />Pending</>
                      )}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Patient ID</p>
                    <code className="text-sm font-mono">{prescription.patientId.slice(0, 12)}...</code>
                  </div>

                  {prescription.notes && (
                    <div>
                      <p className="text-sm text-muted-foreground">Notes</p>
                      <p className="text-sm">{prescription.notes}</p>
                    </div>
                  )}

                  <div className="pt-2">
                    <p className="text-xs text-muted-foreground">Blockchain Hash:</p>
                    <code className="text-xs font-mono">{prescription.blockchainHash.slice(0, 20)}...</code>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    Created {format(new Date(prescription.createdAt), 'MMM d, yyyy')}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <FileText className="h-16 w-16 text-muted-foreground/50" />
              <h3 className="mt-4 font-serif text-xl font-semibold">No prescriptions yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Create your first e-prescription to get started
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
