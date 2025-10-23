import { useQuery } from '@tanstack/react-query';
import { FileText, Clock, CheckCircle, XCircle, DollarSign } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export default function InsuranceClaims() {
  const { data: claims, isLoading } = useQuery({
    queryKey: ['/api/claims'],
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'submitted':
        return <Badge variant="secondary"><Clock className="mr-1 h-3 w-3" />Submitted</Badge>;
      case 'under_review':
        return <Badge variant="default"><FileText className="mr-1 h-3 w-3" />Under Review</Badge>;
      case 'approved':
        return <Badge variant="default" className="bg-chart-2"><CheckCircle className="mr-1 h-3 w-3" />Approved</Badge>;
      case 'paid':
        return <Badge variant="default" className="bg-chart-2"><DollarSign className="mr-1 h-3 w-3" />Paid</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="mr-1 h-3 w-3" />Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout role="insurance">
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-3xl font-bold">My Claims</h1>
          <p className="mt-2 text-muted-foreground">
            Track your insurance claims with blockchain transparency
          </p>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        ) : claims && claims.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {claims.map((claim: any) => (
              <Card key={claim.id} data-testid={`claim-${claim.id}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">Claim #{claim.id.slice(0, 8)}</CardTitle>
                      <CardDescription className="capitalize">
                        {claim.claimType.replace('_', ' ')}
                      </CardDescription>
                    </div>
                    {getStatusBadge(claim.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Policy Provider</p>
                    <p className="font-medium">{claim.policyProvider}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Claim Amount</p>
                    <p className="text-lg font-semibold">${claim.claimAmount.toLocaleString()}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Description</p>
                    <p className="text-sm line-clamp-2">{claim.description}</p>
                  </div>

                  {claim.reviewNotes && (
                    <div>
                      <p className="text-sm text-muted-foreground">Review Notes</p>
                      <p className="text-sm">{claim.reviewNotes}</p>
                    </div>
                  )}

                  <div className="pt-2 text-xs text-muted-foreground">
                    Submitted {format(new Date(claim.submittedAt), 'MMM d, yyyy')}
                  </div>

                  <div className="pt-2">
                    <p className="text-xs text-muted-foreground">Blockchain Hash:</p>
                    <code className="text-xs font-mono">{claim.blockchainHash.slice(0, 20)}...</code>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <FileText className="h-16 w-16 text-muted-foreground/50" />
              <h3 className="mt-4 font-serif text-xl font-semibold">No claims submitted yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Submit your first insurance claim to get started
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
