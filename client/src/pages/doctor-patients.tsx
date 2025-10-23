import { useQuery } from '@tanstack/react-query';
import { Users, FileText } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

export default function DoctorPatients() {
  const { data: prescriptions, isLoading } = useQuery({
    queryKey: ['/api/prescriptions'],
  });

  // Extract unique patients from prescriptions
  const patients = prescriptions ? Array.from(
    new Map(
      prescriptions.map((p: any) => [p.patientId, p])
    ).values()
  ) : [];

  const getPrescriptionCount = (patientId: string) => {
    return prescriptions?.filter((p: any) => p.patientId === patientId).length || 0;
  };

  return (
    <DashboardLayout role="doctor">
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-3xl font-bold">My Patients</h1>
          <p className="mt-2 text-muted-foreground">
            Patients you've prescribed medications to
          </p>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        ) : patients.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-3">
            {patients.map((patient: any) => (
              <Card key={patient.patientId} data-testid={`patient-${patient.patientId}`}>
                <CardHeader>
                  <CardTitle className="text-base">Patient</CardTitle>
                  <CardDescription className="font-mono text-xs">
                    ID: {patient.patientId.slice(0, 12)}...
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Prescriptions:</span>
                    <Badge variant="secondary">
                      <FileText className="mr-1 h-3 w-3" />
                      {getPrescriptionCount(patient.patientId)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Users className="h-16 w-16 text-muted-foreground/50" />
              <h3 className="mt-4 font-serif text-xl font-semibold">No patients yet</h3>
              <p className="mt-2 text-center text-sm text-muted-foreground">
                Patients will appear here once you create prescriptions for them
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
