import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from "react";
import ErrorBoundary from './components/ErrorBoundary';

const ProtectedRoutes = lazy(() => import('./pages/ProtectedRoutes'));

const Home = lazy(() => import("./pages/HomePage"));
const Contact = lazy(() => import("./pages/Contact"));
const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const SignUpPage = lazy(() => import("./pages/auth/SignUpPage"));
const ProfileForm = lazy(() => import("./pages/auth/ProfileForm"));
const ChangePassword = lazy(() => import("./pages/auth/ChangePassword"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));

const Discovery = lazy(() => import("./pages/dashboard/Discover"));

const Proposals = lazy(() => import("./pages/proposals/ProposalsRefactored"));
const GenerateProposalPage = lazy(() => import("./pages/proposals/GenerateProposalPage"));
const BasicComplianceCheck = lazy(() => import("./pages/proposals/BasicComplianceCheck"));
const AdvancedComplianceCheck = lazy(() => import("./pages/proposals/AdvancedComplianceCheck"));
const Compliance = lazy(() => import("./pages/proposals/Compliance"));

const Dashboard = lazy(() => import("./pages/dashboard/Dashboard"));

const EmployeeProfileDashboard = lazy(() => import("./pages/profile/EmployeeProfileDashboard"));
const EmployeeProfileUpdate = lazy(() => import("./pages/profile/EmployeeProfileUpdate"));
const CompanyProfileDashboard = lazy(() => import("./pages/profile/CompanyProfileDashboardRefactored"));
const CompanyProfileUpdate = lazy(() => import("./pages/profile/CompanyProfileUpdate"));

const SuperAdmin = lazy(() => import("./pages/admin/SuperAdmin"));

const SupportTicket = lazy(() => import("./pages/SupportTicketRefactored"));
const StripePaymentPage = lazy(() => import("./pages/StripePaymentPageRefactored"));

const App = () => {
  return (
    // <ErrorBoundary>
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    }>
      <Routes>
        <Route path="/" element={<><Home /></>} />

        <Route path="/contact" element={<Contact />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/sign_up" element={<SignUpPage />} />
        <Route path="/create-profile" element={<ProfileForm />} />
        <Route path="/change-password" element={<ProtectedRoutes allowedRoles={["company", "Editor", "Viewer", "SuperAdmin"]}>
          <ChangePassword />
        </ProtectedRoutes>} />

        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/discover" element={
          //<ProtectedRoutes allowedRoles={["company", "Editor", "Viewer"]}>
          <Discovery />
          //</ProtectedRoutes>
        } />

        <Route path="/proposals" element={
          //<ProtectedRoutes allowedRoles={["company", "Editor", "Viewer"]}>
          <Proposals />
          //</ProtectedRoutes>
        } />

        <Route path="/proposal_page" element={
          //<ProtectedRoutes allowedRoles={["company", "Editor", "Viewer"]}>
          <GenerateProposalPage />
          //</ProtectedRoutes>
        } />
        <Route path="/compliance-check" element={
          //<ProtectedRoutes allowedRoles={["company", "Editor"]}>
          <Compliance />
          //</ProtectedRoutes>
        } />
        <Route path="/basic-compliance-check" element={
          //<ProtectedRoutes allowedRoles={["company", "Editor", "Viewer"]}>
          <BasicComplianceCheck />
          //</ProtectedRoutes>
        } />
        <Route path="/advanced-compliance-check" element={
          //<ProtectedRoutes allowedRoles={["company", "Editor", "Viewer"]}>
          <AdvancedComplianceCheck />
          //</ProtectedRoutes>
        } />

        <Route path="/dashboard" element={
          //<ProtectedRoutes allowedRoles={["company", "Editor", "Viewer"]}>
          <Dashboard />
          //</ProtectedRoutes>
        } />

        <Route path="/company-profile" element={
          //  <ProtectedRoutes allowedRoles={["company"]}>
          <CompanyProfileDashboard />
          //</ProtectedRoutes>
        } />
        <Route path="/company-profile-update" element={
          //<ProtectedRoutes allowedRoles={["company"]}>
          <CompanyProfileUpdate />
          //</ProtectedRoutes>
        } />

        <Route path="/employee-profile" element={
          //<ProtectedRoutes allowedRoles={["Editor", "Viewer"]}>
          <EmployeeProfileDashboard />
          //</ProtectedRoutes>
        } />
        <Route path="/employee-profile-update" element={
          //<ProtectedRoutes allowedRoles={["Editor", "Viewer"]}>
          <EmployeeProfileUpdate />
          //</ProtectedRoutes>
        } />


        <Route path="/admin" element={
          //<ProtectedRoutes allowedRoles={["SuperAdmin"]}>
          <SuperAdmin />
          //</ProtectedRoutes>
        } />

        <Route path="/support-ticket" element={
          //<ProtectedRoutes allowedRoles={["company", "Editor", "Viewer"]}>
          <SupportTicket />
          //</ProtectedRoutes>
        } />

        <Route path="/payment" element={
          //<ProtectedRoutes allowedRoles={["company", "Editor", "Viewer"]}>
          <StripePaymentPage />
          //  </ProtectedRoutes>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
    //</ErrorBoundary>
  );
};

export default App;
