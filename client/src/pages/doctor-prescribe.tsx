import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { FileText, Plus, X } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useLocation } from 'wouter';

interface Medication {
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export default function DoctorPrescribe() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [prescription, setPrescription] = useState({
    patientId: '',
    diagnosis: '',
    notes: '',
  });
  const [medications, setMedications] = useState<Medication[]>([
    { medicationName: '', dosage: '', frequency: '', duration: '', instructions: '' },
  ]);

  const createPrescriptionMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest('POST', '/api/prescriptions', data);
    },
    onSuccess: () => {
      toast({
        title: 'Prescription created',
        description: 'E-prescription has been verified on blockchain',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/prescriptions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/doctor/stats'] });
      setLocation('/dashboard/doctor/prescriptions');
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Failed to create prescription',
        description: 'Please try again',
      });
    },
  });

  const addMedication = () => {
    setMedications([...medications, { medicationName: '', dosage: '', frequency: '', duration: '', instructions: '' }]);
  };

  const removeMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  const updateMedication = (index: number, field: keyof Medication, value: string) => {
    const updated = [...medications];
    updated[index] = { ...updated[index], [field]: value };
    setMedications(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createPrescriptionMutation.mutate({ prescription, medications });
  };

  return (
    <DashboardLayout role="doctor">
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-3xl font-bold">Create E-Prescription</h1>
          <p className="mt-2 text-muted-foreground">
            Write a blockchain-verified digital prescription
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Patient Information</CardTitle>
              <CardDescription>Enter patient ID and diagnosis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="patientId">Patient ID</Label>
                <Input
                  id="patientId"
                  value={prescription.patientId}
                  onChange={(e) => setPrescription({ ...prescription, patientId: e.target.value })}
                  placeholder="Enter patient ID"
                  required
                  data-testid="input-patient-id"
                />
              </div>

              <div>
                <Label htmlFor="diagnosis">Diagnosis</Label>
                <Input
                  id="diagnosis"
                  value={prescription.diagnosis}
                  onChange={(e) => setPrescription({ ...prescription, diagnosis: e.target.value })}
                  placeholder="e.g., Hypertension, Type 2 Diabetes"
                  required
                  data-testid="input-diagnosis"
                />
              </div>

              <div>
                <Label htmlFor="notes">Clinical Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={prescription.notes}
                  onChange={(e) => setPrescription({ ...prescription, notes: e.target.value })}
                  placeholder="Additional notes or instructions"
                  data-testid="textarea-notes"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="font-serif">Medications</CardTitle>
                  <CardDescription>Add prescribed medications</CardDescription>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={addMedication} data-testid="button-add-medication">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Medication
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {medications.map((med, index) => (
                <div key={index} className="rounded-md border p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <h4 className="font-medium">Medication {index + 1}</h4>
                    {medications.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMedication(index)}
                        data-testid={`button-remove-medication-${index}`}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label>Medication Name</Label>
                      <Input
                        value={med.medicationName}
                        onChange={(e) => updateMedication(index, 'medicationName', e.target.value)}
                        placeholder="e.g., Lisinopril"
                        required
                        data-testid={`input-medication-name-${index}`}
                      />
                    </div>

                    <div>
                      <Label>Dosage</Label>
                      <Input
                        value={med.dosage}
                        onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                        placeholder="e.g., 10mg"
                        required
                        data-testid={`input-dosage-${index}`}
                      />
                    </div>

                    <div>
                      <Label>Frequency</Label>
                      <Input
                        value={med.frequency}
                        onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                        placeholder="e.g., Once daily"
                        required
                        data-testid={`input-frequency-${index}`}
                      />
                    </div>

                    <div>
                      <Label>Duration</Label>
                      <Input
                        value={med.duration}
                        onChange={(e) => updateMedication(index, 'duration', e.target.value)}
                        placeholder="e.g., 30 days"
                        required
                        data-testid={`input-duration-${index}`}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Label>Instructions</Label>
                      <Textarea
                        value={med.instructions}
                        onChange={(e) => updateMedication(index, 'instructions', e.target.value)}
                        placeholder="e.g., Take with food"
                        data-testid={`textarea-instructions-${index}`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setLocation('/dashboard/doctor')}>
              Cancel
            </Button>
            <Button type="submit" disabled={createPrescriptionMutation.isPending} data-testid="button-submit-prescription">
              {createPrescriptionMutation.isPending ? 'Creating...' : 'Create Prescription'}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
