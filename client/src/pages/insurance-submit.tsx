import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { FileText } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useLocation } from 'wouter';

export default function InsuranceSubmit() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [claim, setClaim] = useState({
    policyNumber: '',
    policyProvider: '',
    claimAmount: '',
    claimType: 'hospitalization',
    description: '',
  });

  const submitClaimMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest('POST', '/api/claims', {
        ...data,
        claimAmount: parseInt(data.claimAmount),
      });
    },
    onSuccess: () => {
      toast({
        title: 'Claim Submitted',
        description: 'Your insurance claim has been recorded on blockchain',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/claims'] });
      queryClient.invalidateQueries({ queryKey: ['/api/insurance/stats'] });
      setLocation('/dashboard/insurance/claims');
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: 'Please try again',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitClaimMutation.mutate(claim);
  };

  return (
    <DashboardLayout role="insurance">
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-3xl font-bold">Submit Insurance Claim</h1>
          <p className="mt-2 text-muted-foreground">
            File a new claim with blockchain verification
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Policy Information</CardTitle>
              <CardDescription>Enter your insurance policy details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="policyNumber">Policy Number</Label>
                  <Input
                    id="policyNumber"
                    value={claim.policyNumber}
                    onChange={(e) => setClaim({ ...claim, policyNumber: e.target.value })}
                    placeholder="e.g., POL-2024-123456"
                    required
                    data-testid="input-policy-number"
                  />
                </div>

                <div>
                  <Label htmlFor="policyProvider">Insurance Provider</Label>
                  <Input
                    id="policyProvider"
                    value={claim.policyProvider}
                    onChange={(e) => setClaim({ ...claim, policyProvider: e.target.value })}
                    placeholder="e.g., HealthCare Insurance Co."
                    required
                    data-testid="input-provider"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Claim Details</CardTitle>
              <CardDescription>Provide information about your claim</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="claimType">Claim Type</Label>
                <Select
                  value={claim.claimType}
                  onValueChange={(value) => setClaim({ ...claim, claimType: value })}
                >
                  <SelectTrigger data-testid="select-claim-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hospitalization">Hospitalization</SelectItem>
                    <SelectItem value="outpatient">Outpatient</SelectItem>
                    <SelectItem value="pharmacy">Pharmacy</SelectItem>
                    <SelectItem value="dental">Dental</SelectItem>
                    <SelectItem value="vision">Vision</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="claimAmount">Claim Amount ($)</Label>
                <Input
                  id="claimAmount"
                  type="number"
                  value={claim.claimAmount}
                  onChange={(e) => setClaim({ ...claim, claimAmount: e.target.value })}
                  placeholder="e.g., 5000"
                  required
                  data-testid="input-amount"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={claim.description}
                  onChange={(e) => setClaim({ ...claim, description: e.target.value })}
                  placeholder="Describe the medical service or treatment"
                  required
                  rows={4}
                  data-testid="textarea-description"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setLocation('/dashboard/insurance')}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitClaimMutation.isPending} data-testid="button-submit-claim">
              {submitClaimMutation.isPending ? 'Submitting...' : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Submit Claim
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
