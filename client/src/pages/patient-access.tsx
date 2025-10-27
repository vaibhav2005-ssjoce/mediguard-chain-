import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Shield, Plus, X, FileText } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function PatientAccess() {
  const { toast } = useToast();
  const { data: records, isLoading: recordsLoading } = useQuery<any[]>({
    queryKey: ['/api/medical-records'],
  });
  
  const { data: permissions, isLoading: permissionsLoading } = useQuery({
    queryKey: ['/api/access-permissions'],
  });
  
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [grantedToId, setGrantedToId] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const grantAccessMutation = useMutation({
    mutationFn: async (data: { recordId: string; grantedToId: string }) => {
      return await apiRequest('POST', '/api/access-permissions', data);
    },
    onSuccess: () => {
      toast({
        title: 'Access Granted',
        description: 'Permission recorded on blockchain',
      });
      setIsDialogOpen(false);
      setGrantedToId('');
      queryClient.invalidateQueries({ queryKey: ['/api/access-permissions'] });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Failed to grant access',
        description: 'Please try again',
      });
    },
  });

  const revokeAccessMutation = useMutation({
    mutationFn: async (permissionId: string) => {
      return await apiRequest('DELETE', `/api/access-permissions/${permissionId}`, {});
    },
    onSuccess: () => {
      toast({
        title: 'Access Revoked',
        description: 'Permission revoked and logged on blockchain',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/access-permissions'] });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Failed to revoke access',
        description: 'Please try again',
      });
    },
  });

  const handleGrantAccess = () => {
    if (selectedRecord && grantedToId) {
      grantAccessMutation.mutate({
        recordId: selectedRecord.id,
        grantedToId,
      });
    }
  };

  const getPermissionsForRecord = (recordId: string) => {
    const perms = permissions as any[] | undefined;
    return perms?.filter((p: any) => p.recordId === recordId) || [];
  };

  const isLoading = recordsLoading || permissionsLoading;

  return (
    <DashboardLayout role="patient">
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-3xl font-bold">Access Control</h1>
          <p className="mt-2 text-muted-foreground">
            Manage who can access your medical records with blockchain verification
          </p>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        ) : records && records.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {records.map((record: any) => {
              const recordPermissions = getPermissionsForRecord(record.id);
              
              return (
                <Card key={record.id} data-testid={`record-${record.id}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-base">{record.title}</CardTitle>
                        <CardDescription className="capitalize">
                          {record.recordType.replace('_', ' ')}
                        </CardDescription>
                      </div>
                      <Badge variant="outline">
                        <Shield className="mr-1 h-3 w-3" />
                        {recordPermissions.length} Access{recordPermissions.length !== 1 ? 'es' : ''}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {record.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {record.description}
                      </p>
                    )}

                    {recordPermissions.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Granted To:</p>
                        <div className="space-y-2">
                          {recordPermissions.map((perm: any) => (
                            <div key={perm.id} className="flex items-center justify-between rounded-md border p-2">
                              <code className="text-xs font-mono">{perm.grantedToId.slice(0, 12)}...</code>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => revokeAccessMutation.mutate(perm.id)}
                                disabled={revokeAccessMutation.isPending}
                                data-testid={`button-revoke-${perm.id}`}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <Dialog open={isDialogOpen && selectedRecord?.id === record.id} onOpenChange={(open) => {
                      setIsDialogOpen(open);
                      if (open) setSelectedRecord(record);
                      else setGrantedToId('');
                    }}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="w-full" data-testid={`button-grant-access-${record.id}`}>
                          <Plus className="mr-2 h-4 w-4" />
                          Grant Access
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Grant Access to {record.title}</DialogTitle>
                          <DialogDescription>
                            Allow a healthcare provider to view this record
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                          <div>
                            <Label htmlFor="grantedToId">Provider ID (Doctor/Pharmacy/Insurance)</Label>
                            <Input
                              id="grantedToId"
                              value={grantedToId}
                              onChange={(e) => setGrantedToId(e.target.value)}
                              placeholder="Enter provider user ID"
                              data-testid="input-provider-id"
                            />
                          </div>
                          <Button 
                            onClick={handleGrantAccess} 
                            disabled={grantAccessMutation.isPending || !grantedToId}
                            className="w-full"
                            data-testid="button-confirm-grant"
                          >
                            {grantAccessMutation.isPending ? 'Granting...' : 'Grant Access'}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <FileText className="h-16 w-16 text-muted-foreground/50" />
              <h3 className="mt-4 font-serif text-xl font-semibold">No medical records yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Upload medical records to manage access control
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
