import { Switch, Route, Redirect } from 'wouter';
import { queryClient } from './lib/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider, useAuth } from './lib/auth-context';
import { ThemeProvider } from './components/theme-provider';

import NotFound from '@/pages/not-found';
import Landing from '@/pages/landing';
import Login from '@/pages/login';
import Register from '@/pages/register';
import PatientDashboard from '@/pages/patient-dashboard';
import PatientRecords from '@/pages/patient-records';
import PatientAccess from '@/pages/patient-access';
import PatientBlockchain from '@/pages/patient-blockchain';
import PatientInsights from '@/pages/patient-insights';
import DoctorDashboard from '@/pages/doctor-dashboard';
import DoctorPrescribe from '@/pages/doctor-prescribe';
import DoctorPrescriptions from '@/pages/doctor-prescriptions';
import DoctorPatients from '@/pages/doctor-patients';
import PharmacyDashboard from '@/pages/pharmacy-dashboard';
import PharmacyVerify from '@/pages/pharmacy-verify';
import PharmacyDispensed from '@/pages/pharmacy-dispensed';
import InsuranceDashboard from '@/pages/insurance-dashboard';
import InsurancePlans from '@/pages/insurance-plans';
import InsuranceSubmit from '@/pages/insurance-submit';
import InsuranceClaims from '@/pages/insurance-claims';

function ProtectedRoute({ component: Component, role, ...rest }: any) {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }
  
  if (role && user?.role !== role) {
    return <Redirect to="/" />;
  }
  
  return <Component {...rest} />;
}

function Router() {
  const { isAuthenticated } = useAuth();
  
  return (
    <Switch>
      <Route path="/" component={isAuthenticated ? () => <Redirect to={`/dashboard/${useAuth().user?.role}`} /> : Landing} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      
      {/* Patient Routes */}
      <Route path="/dashboard/patient">
        {() => <ProtectedRoute component={PatientDashboard} role="patient" />}
      </Route>
      <Route path="/dashboard/patient/records">
        {() => <ProtectedRoute component={PatientRecords} role="patient" />}
      </Route>
      <Route path="/dashboard/patient/access">
        {() => <ProtectedRoute component={PatientAccess} role="patient" />}
      </Route>
      <Route path="/dashboard/patient/insights">
        {() => <ProtectedRoute component={PatientInsights} role="patient" />}
      </Route>
      <Route path="/dashboard/patient/blockchain">
        {() => <ProtectedRoute component={PatientBlockchain} role="patient" />}
      </Route>
      
      {/* Doctor Routes */}
      <Route path="/dashboard/doctor">
        {() => <ProtectedRoute component={DoctorDashboard} role="doctor" />}
      </Route>
      <Route path="/dashboard/doctor/prescribe">
        {() => <ProtectedRoute component={DoctorPrescribe} role="doctor" />}
      </Route>
      <Route path="/dashboard/doctor/prescriptions">
        {() => <ProtectedRoute component={DoctorPrescriptions} role="doctor" />}
      </Route>
      <Route path="/dashboard/doctor/patients">
        {() => <ProtectedRoute component={DoctorPatients} role="doctor" />}
      </Route>
      
      {/* Pharmacy Routes */}
      <Route path="/dashboard/pharmacy">
        {() => <ProtectedRoute component={PharmacyDashboard} role="pharmacy" />}
      </Route>
      <Route path="/dashboard/pharmacy/verify">
        {() => <ProtectedRoute component={PharmacyVerify} role="pharmacy" />}
      </Route>
      <Route path="/dashboard/pharmacy/dispensed">
        {() => <ProtectedRoute component={PharmacyDispensed} role="pharmacy" />}
      </Route>
      
      {/* Insurance Routes */}
      <Route path="/dashboard/insurance">
        {() => <ProtectedRoute component={InsuranceDashboard} role="insurance" />}
      </Route>
      <Route path="/dashboard/insurance/plans">
        {() => <ProtectedRoute component={InsurancePlans} role="insurance" />}
      </Route>
      <Route path="/dashboard/insurance/submit">
        {() => <ProtectedRoute component={InsuranceSubmit} role="insurance" />}
      </Route>
      <Route path="/dashboard/insurance/claims">
        {() => <ProtectedRoute component={InsuranceClaims} role="insurance" />}
      </Route>
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
