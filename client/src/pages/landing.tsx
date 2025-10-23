import { Link } from 'wouter';
import { Shield, Lock, FileText, Activity, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme-toggle';
import heroImage from '@assets/generated_images/Medical_professional_reviewing_blockchain_health_data_bf16f2e8.png';

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="font-serif text-xl font-bold">MediGuard</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost" data-testid="link-login">Login</Button>
            </Link>
            <Link href="/register">
              <Button data-testid="link-register">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[600px] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        <div className="relative container mx-auto flex h-full items-center px-4 md:px-8">
          <div className="max-w-2xl text-white">
            <h1 className="font-serif text-5xl font-bold leading-tight md:text-6xl">
              Secure Healthcare Data on the Blockchain
            </h1>
            <p className="mt-6 text-lg text-white/90">
              Take control of your medical records with blockchain-verified security. 
              Share data securely, manage prescriptions, and track insurance claims transparently.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/register">
                <Button size="lg" variant="default" className="bg-primary text-primary-foreground backdrop-blur" data-testid="button-hero-register">
                  Start Free Trial
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-white/30 bg-white/10 text-white backdrop-blur hover:bg-white/20" data-testid="button-hero-learn">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mb-12 text-center">
            <h2 className="font-serif text-3xl font-bold md:text-4xl">
              Healthcare Data Management Reimagined
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Built for patients, doctors, pharmacies, and insurance providers
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-primary/10">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-serif text-xl font-semibold">Patient Control</h3>
              <p className="text-sm text-muted-foreground">
                Upload and manage your medical records. Grant or revoke access to healthcare providers with blockchain-verified consent.
              </p>
            </Card>

            <Card className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-chart-2/10">
                <FileText className="h-6 w-6 text-chart-2" />
              </div>
              <h3 className="mb-2 font-serif text-xl font-semibold">E-Prescriptions</h3>
              <p className="text-sm text-muted-foreground">
                Doctors create verified digital prescriptions. Pharmacies instantly verify authenticity through blockchain verification.
              </p>
            </Card>

            <Card className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-chart-5/10">
                <Shield className="h-6 w-6 text-chart-5" />
              </div>
              <h3 className="mb-2 font-serif text-xl font-semibold">Claim Transparency</h3>
              <p className="text-sm text-muted-foreground">
                Track insurance claims from submission to payment. Every status update is recorded on the blockchain.
              </p>
            </Card>

            <Card className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-chart-4/10">
                <Activity className="h-6 w-6 text-chart-4" />
              </div>
              <h3 className="mb-2 font-serif text-xl font-semibold">Health Insights</h3>
              <p className="text-sm text-muted-foreground">
                AI-powered analysis of your medical data provides personalized health alerts and recommendations.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t bg-muted/30 py-20">
        <div className="container mx-auto px-4 text-center md:px-8">
          <h2 className="font-serif text-3xl font-bold md:text-4xl">
            Ready to Secure Your Health Data?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Join thousands of patients and healthcare providers using MediGuard
          </p>
          <div className="mt-8">
            <Link href="/register">
              <Button size="lg" data-testid="button-cta-register">
                Create Your Account
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground md:px-8">
          <p>&copy; 2025 MediGuard. Blockchain-based healthcare data management.</p>
        </div>
      </footer>
    </div>
  );
}
