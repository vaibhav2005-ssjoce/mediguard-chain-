import { useQuery } from '@tanstack/react-query';
import { Shield, Clock } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export default function PatientBlockchain() {
  const { data: transactions, isLoading } = useQuery<any[]>({
    queryKey: ['/api/blockchain/transactions'],
  });

  const getActionColor = (action: string) => {
    if (action.includes('grant')) return 'bg-chart-2/10 text-chart-2';
    if (action.includes('revoke')) return 'bg-destructive/10 text-destructive';
    if (action.includes('upload')) return 'bg-primary/10 text-primary';
    return 'bg-muted/50 text-foreground';
  };

  return (
    <DashboardLayout role="patient">
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-3xl font-bold">Blockchain Transaction Log</h1>
          <p className="mt-2 text-muted-foreground">
            Immutable record of all your healthcare data activities
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
        ) : transactions && transactions.length > 0 ? (
          <div className="space-y-4">
            {transactions.map((tx: any) => (
              <Card key={tx.id} data-testid={`tx-${tx.id}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-primary" />
                      <div>
                        <CardTitle className="text-base capitalize">
                          {tx.actionType.replace(/_/g, ' ')}
                        </CardTitle>
                        <CardDescription className="capitalize">
                          {tx.resourceType.replace(/_/g, ' ')}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className={getActionColor(tx.actionType)} variant="secondary">
                      Verified
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Transaction Hash:</span>
                      <code className="rounded bg-muted px-2 py-1 font-mono text-xs">
                        {tx.transactionHash.slice(0, 16)}...{tx.transactionHash.slice(-8)}
                      </code>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Previous Hash:</span>
                      <code className="rounded bg-muted px-2 py-1 font-mono text-xs">
                        {tx.previousHash === 'genesis' ? 'Genesis' : `${tx.previousHash.slice(0, 16)}...`}
                      </code>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Timestamp:</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {format(new Date(tx.timestamp), 'MMM d, yyyy h:mm a')}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Shield className="h-16 w-16 text-muted-foreground/50" />
              <h3 className="mt-4 font-serif text-xl font-semibold">No transactions yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Your blockchain activity will appear here
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
