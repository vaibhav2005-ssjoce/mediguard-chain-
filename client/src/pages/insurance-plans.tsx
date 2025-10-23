import { ExternalLink, FileHeart } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function InsurancePlans() {
  return (
    <DashboardLayout role="insurance">
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-3xl font-bold">Find Best Insurance Plans</h1>
          <p className="mt-2 text-muted-foreground">
            Compare and purchase health insurance policies
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileHeart className="h-6 w-6 text-chart-4" />
              <CardTitle className="font-serif">PolicyBazaar Integration</CardTitle>
            </div>
            <CardDescription>
              Browse comprehensive health insurance plans from top providers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              PolicyBazaar offers a wide selection of health insurance plans. Compare coverage,
              premiums, network hospitals, and benefits to find the perfect plan for you and your family.
            </p>

            <div className="space-y-2">
              <h4 className="font-medium">Features:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Compare 40+ insurance providers</li>
                <li>Instant policy quotes</li>
                <li>Network hospital finder</li>
                <li>Expert advice and support</li>
                <li>Easy claim process guidance</li>
              </ul>
            </div>

            <Button
              className="w-full"
              onClick={() => window.open('https://www.policybazaar.com/health-insurance/', '_blank')}
              data-testid="button-policybazaar"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Browse Plans on PolicyBazaar
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
