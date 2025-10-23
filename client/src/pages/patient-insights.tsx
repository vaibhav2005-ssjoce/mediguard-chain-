import { useQuery } from '@tanstack/react-query';
import { Activity, AlertCircle, Info } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { format } from 'date-fns';

export default function PatientInsights() {
  const { data: insights, isLoading } = useQuery({
    queryKey: ['/api/health-insights'],
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return <AlertCircle className="h-5 w-5" />;
      case 'medium':
      case 'low':
        return <Info className="h-5 w-5" />;
      default:
        return <Activity className="h-5 w-5" />;
    }
  };

  return (
    <DashboardLayout role="patient">
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-3xl font-bold">Health Insights</h1>
          <p className="mt-2 text-muted-foreground">
            AI-powered analysis and recommendations based on your health data
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        ) : insights && insights.length > 0 ? (
          <div className="space-y-4">
            {insights.map((insight: any) => (
              <Alert key={insight.id} variant={getSeverityColor(insight.severity)} data-testid={`insight-${insight.id}`}>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {getSeverityIcon(insight.severity)}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <AlertTitle className="mb-0">{insight.title}</AlertTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="capitalize whitespace-nowrap">
                          {insight.severity}
                        </Badge>
                        {!insight.isRead && (
                          <Badge variant="default" className="bg-primary">New</Badge>
                        )}
                      </div>
                    </div>
                    <AlertDescription className="text-sm">
                      {insight.description}
                    </AlertDescription>
                    {insight.recommendations && (
                      <div className="mt-3 rounded-md bg-background/50 p-3">
                        <p className="text-sm font-medium">Recommendations:</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {insight.recommendations}
                        </p>
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(insight.createdAt), 'MMM d, yyyy h:mm a')}
                    </p>
                  </div>
                </div>
              </Alert>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Activity className="h-16 w-16 text-muted-foreground/50" />
              <h3 className="mt-4 font-serif text-xl font-semibold">No health insights yet</h3>
              <p className="mt-2 text-center text-sm text-muted-foreground">
                Upload medical records with health metrics (blood pressure, glucose, etc.) <br />
                to receive personalized AI-powered health insights
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
