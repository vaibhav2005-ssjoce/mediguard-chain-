import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Shield, CheckCircle, FileText } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Badge } from '@/components/ui/badge';

export default function PharmacyVerify() {
  const { toast } = useToast();
  const [prescriptionId, setPrescriptionId] = useState('');
  const [verifiedPrescription, setVerifiedPrescription] = useState<any>(null);

  const verifyMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/prescriptions/${id}/verify`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Verification failed');
      return response.json();
    },
    onSuccess: (data) => {
      setVerifiedPrescription(data);
      toast({
        title: 'Prescription Verified',
        description: 'Blockchain verification successful',
      });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Verification Failed',
        description: 'Invalid prescription ID or not found',
      });
    },
  });

  const dispenseMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest('POST', `/api/prescriptions/${id}/dispense`, {});
    },
    onSuccess: () => {
      toast({
        title: 'Prescription Dispensed',
        description: 'Transaction recorded on blockchain',
      });
      setVerifiedPrescription(null);
      setPrescriptionId('');
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Dispense Failed',
        description: 'Please try again',
      });
    },
  });

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    verifyMutation.mutate(prescriptionId);
  };

  const handleDispense = () => {
    if (verifiedPrescription) {
      dispenseMutation.mutate(verifiedPrescription.id);
    }
  };

  return (
    <DashboardLayout role="pharmacy">
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-3xl font-bold">Verify Prescription</h1>
          <p className="mt-2 text-muted-foreground">
            Verify prescription authenticity via blockchain
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-serif">Enter Prescription ID</CardTitle>
            <CardDescription>Scan QR code or manually enter prescription ID</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <Label htmlFor="prescriptionId">Prescription ID</Label>
                <Input
                  id="prescriptionId"
                  value={prescriptionId}
                  onChange={(e) => setPrescriptionId(e.target.value)}
                  placeholder="Enter prescription ID"
                  required
                  data-testid="input-prescription-id"
                />
              </div>
              <Button type="submit" disabled={verifyMutation.isPending} data-testid="button-verify">
                {verifyMutation.isPending ? 'Verifying...' : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Verify Prescription
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {verifiedPrescription && (
          <Card className="border-chart-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="font-serif">Verified Prescription</CardTitle>
                <Badge variant="default" className="bg-chart-2">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Blockchain Verified
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Prescription ID</p>
                  <p className="font-mono text-sm">{verifiedPrescription.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant="outline" className="capitalize">{verifiedPrescription.status}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Diagnosis</p>
                  <p className="font-medium">{verifiedPrescription.diagnosis}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Blockchain Hash</p>
                  <p className="font-mono text-xs">{verifiedPrescription.blockchainHash.slice(0, 16)}...</p>
                </div>
              </div>

              {verifiedPrescription.notes && (
                <div>
                  <p className="text-sm text-muted-foreground">Clinical Notes</p>
                  <p className="text-sm">{verifiedPrescription.notes}</p>
                </div>
              )}

              <div>
                <h4 className="mb-3 font-medium">Medications</h4>
                <div className="space-y-3">
                  {verifiedPrescription.items && verifiedPrescription.items.map((item: any, index: number) => (
                    <div key={index} className="rounded-md border p-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">{item.medicationName}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.dosage} • {item.frequency} • {item.duration}
                          </p>
                          {item.instructions && (
                            <p className="mt-1 text-sm">{item.instructions}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {verifiedPrescription.status === 'pending' && (
                <div className="flex justify-end pt-4">
                  <Button onClick={handleDispense} disabled={dispenseMutation.isPending} data-testid="button-dispense">
                    {dispenseMutation.isPending ? 'Dispensing...' : 'Mark as Dispensed'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
