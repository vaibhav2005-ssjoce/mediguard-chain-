import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Upload, FileText, Download, Eye } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

export default function PatientRecords() {
  const { toast } = useToast();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    recordType: 'lab_report',
    file: null as File | null,
  });

  const { data: records, isLoading } = useQuery({
    queryKey: ['/api/medical-records'],
  });

  const uploadMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const formDataObj = new FormData();
      formDataObj.append('title', data.title);
      formDataObj.append('description', data.description);
      formDataObj.append('recordType', data.recordType);
      if (data.file) {
        formDataObj.append('file', data.file);
      }

      const token = localStorage.getItem('token');
      const response = await fetch('/api/medical-records', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataObj,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Medical record uploaded successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/medical-records'] });
      queryClient.invalidateQueries({ queryKey: ['/api/patient/stats'] });
      setIsUploadOpen(false);
      setFormData({ title: '', description: '', recordType: 'lab_report', file: null });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Upload failed',
        description: 'There was an error uploading your file',
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, file: e.target.files[0] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.file) {
      toast({
        variant: 'destructive',
        title: 'No file selected',
        description: 'Please select a file to upload',
      });
      return;
    }
    uploadMutation.mutate(formData);
  };

  return (
    <DashboardLayout role="patient">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold">Medical Records</h1>
            <p className="mt-2 text-muted-foreground">
              Upload and manage your medical documents
            </p>
          </div>
          <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-upload-record">
                <Upload className="mr-2 h-4 w-4" />
                Upload Record
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Medical Record</DialogTitle>
                <DialogDescription>
                  Add a new medical document to your health records
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Blood Test Results"
                    required
                    data-testid="input-record-title"
                  />
                </div>

                <div>
                  <Label htmlFor="recordType">Record Type</Label>
                  <Select
                    value={formData.recordType}
                    onValueChange={(value) => setFormData({ ...formData, recordType: value })}
                  >
                    <SelectTrigger data-testid="select-record-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lab_report">Lab Report</SelectItem>
                      <SelectItem value="prescription">Prescription</SelectItem>
                      <SelectItem value="imaging">Imaging (X-ray, MRI, CT)</SelectItem>
                      <SelectItem value="discharge_summary">Discharge Summary</SelectItem>
                      <SelectItem value="vaccination">Vaccination Record</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="e.g., BP: 120/80, Glucose: 95 mg/dL"
                    data-testid="textarea-description"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Include health metrics for AI analysis (BP, glucose, cholesterol, etc.)
                  </p>
                </div>

                <div>
                  <Label htmlFor="file">File</Label>
                  <Input
                    id="file"
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.jpg,.jpeg,.png"
                    required
                    data-testid="input-file"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsUploadOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={uploadMutation.isPending} data-testid="button-submit-upload">
                    {uploadMutation.isPending ? 'Uploading...' : 'Upload'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        ) : records && records.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {records.map((record: any) => (
              <Card key={record.id} data-testid={`card-record-${record.id}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <CardTitle className="text-base">{record.title}</CardTitle>
                    </div>
                  </div>
                  <CardDescription className="capitalize">
                    {record.recordType.replace('_', ' ')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {record.description && (
                    <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
                      {record.description}
                    </p>
                  )}
                  <div className="mb-4 text-xs text-muted-foreground">
                    Uploaded {format(new Date(record.uploadedAt), 'MMM d, yyyy')}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1" data-testid="button-view-record">
                      <Eye className="mr-2 h-3 w-3" />
                      View
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1" data-testid="button-download-record">
                      <Download className="mr-2 h-3 w-3" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <FileText className="h-16 w-16 text-muted-foreground/50" />
              <h3 className="mt-4 font-serif text-xl font-semibold">No medical records yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Upload your first medical document to get started
              </p>
              <Button className="mt-6" onClick={() => setIsUploadOpen(true)} data-testid="button-upload-first">
                <Upload className="mr-2 h-4 w-4" />
                Upload Record
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
