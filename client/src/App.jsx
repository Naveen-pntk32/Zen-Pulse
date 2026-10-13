import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { Layout } from "@/components/layout/Layout";

// System Resilience Overlays
import { OfflineDetector } from "@/components/system/OfflineDetector";
import { SessionExpiredModal } from "@/components/system/SessionExpiredModal";
import { CookieConsentBanner } from "@/components/system/CookieConsentBanner";

// 01. Public & Marketing Suite
import LandingPage from "@/pages/landing";
import FeaturesPage from "@/pages/features";
import PricingPage from "@/pages/pricing";
import AboutPage from "@/pages/about";
import ContactPage from "@/pages/contact";
import FAQPage from "@/pages/faq";
import ChangelogPage from "@/pages/changelog";

// 02. Legal, Trust & Compliance Suite (15 Essentials)
import TermsPage from "@/pages/terms";
import PrivacyPage from "@/pages/privacy";
import CookiePolicyPage from "@/pages/cookies";
import CookieSettingsPage from "@/pages/cookie-settings";
import RefundPolicyPage from "@/pages/refund-policy";
import CancellationPolicyPage from "@/pages/cancellation-policy";
import AcceptableUsePage from "@/pages/acceptable-use";
import SecurityPage from "@/pages/security";
import SecurityReportPage from "@/pages/security-report";
import AccessibilityPage from "@/pages/accessibility";
import DPAPage from "@/pages/dpa";

// 03. Authentication & Identity Suite
import LoginPage from "@/pages/auth/login";
import RegisterPage from "@/pages/auth/register";
import ForgotPasswordPage from "@/pages/auth/forgot-password";
import ResetPasswordPage from "@/pages/auth/reset-password";
import VerifyEmailPage from "@/pages/auth/verify-email";
import VerifyOTPPage from "@/pages/auth/verify-otp";
import AcceptInvitePage from "@/pages/auth/accept-invite";

// 04. Customer Lifecycle & Revenue Retention Suite
import OnboardingPage from "@/pages/lifecycle/onboarding";
import UpgradePage from "@/pages/lifecycle/upgrade";
import DowngradePage from "@/pages/lifecycle/downgrade";
import CancelSubscriptionPage from "@/pages/lifecycle/cancel-subscription";
import CheckoutSuccessPage from "@/pages/lifecycle/checkout-success";
import CheckoutFailedPage from "@/pages/lifecycle/checkout-failed";
import CheckoutPendingPage from "@/pages/lifecycle/checkout-pending";
import SupportPage from "@/pages/support";
import HelpPage from "@/pages/help";

// 05. Core Authenticated Application Suite
import TasksPage from "@/pages/tasks";
import CompletedTasksPage from "@/pages/completed-tasks";
import PomodoroPage from "@/pages/pomodoro";
import HabitTrackerPage from "@/pages/habits";
import SearchPage from "@/pages/search";
import ProfilePage from "@/pages/profile";
import SettingsPage from "@/pages/settings";
import NotificationsPage from "@/pages/notifications";
import ActivityPage from "@/pages/activity";

// 06. Admin & Governance Suite
import AdminDashboardPage from "@/pages/admin/dashboard";
import AdminUsersPage from "@/pages/admin/users";
import AdminRolesPage from "@/pages/admin/roles";
import AdminAuditLogsPage from "@/pages/admin/audit-logs";

// 07. System Resilience & Edge-Case States
import ForbiddenPage from "@/pages/system/forbidden-403";
import ServerErrorPage from "@/pages/system/server-error-500";
import MaintenancePage from "@/pages/system/maintenance";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Layout>
      <Switch>
        {/* 01. Public Marketing Suite */}
        <Route path="/" component={LandingPage} />
        <Route path="/features" component={FeaturesPage} />
        <Route path="/pricing" component={PricingPage} />
        <Route path="/about" component={AboutPage} />
        <Route path="/contact" component={ContactPage} />
        <Route path="/faq" component={FAQPage} />
        <Route path="/changelog" component={ChangelogPage} />

        {/* 02. Legal, Trust & Compliance Suite */}
        <Route path="/terms" component={TermsPage} />
        <Route path="/privacy" component={PrivacyPage} />
        <Route path="/cookies" component={CookiePolicyPage} />
        <Route path="/cookie-settings" component={CookieSettingsPage} />
        <Route path="/refund-policy" component={RefundPolicyPage} />
        <Route path="/cancellation-policy" component={CancellationPolicyPage} />
        <Route path="/acceptable-use" component={AcceptableUsePage} />
        <Route path="/security" component={SecurityPage} />
        <Route path="/security/report" component={SecurityReportPage} />
        <Route path="/accessibility" component={AccessibilityPage} />
        <Route path="/dpa" component={DPAPage} />

        {/* 03. Authentication & Identity Suite */}
        <Route path="/login" component={LoginPage} />
        <Route path="/register" component={RegisterPage} />
        <Route path="/forgot-password" component={ForgotPasswordPage} />
        <Route path="/reset-password" component={ResetPasswordPage} />
        <Route path="/verify-email" component={VerifyEmailPage} />
        <Route path="/verify-otp" component={VerifyOTPPage} />
        <Route path="/invite/accept" component={AcceptInvitePage} />

        {/* 04. Customer Lifecycle & Revenue Retention */}
        <Route path="/onboarding" component={OnboardingPage} />
        <Route path="/upgrade" component={UpgradePage} />
        <Route path="/downgrade" component={DowngradePage} />
        <Route path="/billing/cancel" component={CancelSubscriptionPage} />
        <Route path="/checkout/success" component={CheckoutSuccessPage} />
        <Route path="/checkout/failed" component={CheckoutFailedPage} />
        <Route path="/checkout/pending" component={CheckoutPendingPage} />
        <Route path="/support" component={SupportPage} />
        <Route path="/help" component={HelpPage} />

        {/* 05. Core Authenticated Application */}
        <Route path="/tasks" component={TasksPage} />
        <Route path="/tasks/completed" component={CompletedTasksPage} />
        <Route path="/tasks/:listId" component={TasksPage} />
        <Route path="/pomodoro" component={PomodoroPage} />
        <Route path="/habits" component={HabitTrackerPage} />
        <Route path="/search" component={SearchPage} />
        <Route path="/profile" component={ProfilePage} />
        <Route path="/settings" component={SettingsPage} />
        <Route path="/notifications" component={NotificationsPage} />
        <Route path="/activity" component={ActivityPage} />

        {/* 06. Admin & Governance Suite */}
        <Route path="/admin" component={AdminDashboardPage} />
        <Route path="/admin/users" component={AdminUsersPage} />
        <Route path="/admin/roles" component={AdminRolesPage} />
        <Route path="/admin/audit-logs" component={AdminAuditLogsPage} />

        {/* 07. Reliability & System States */}
        <Route path="/403" component={ForbiddenPage} />
        <Route path="/500" component={ServerErrorPage} />
        <Route path="/maintenance" component={MaintenancePage} />

        {/* Global Fallback Route */}
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <OfflineDetector />
          <SessionExpiredModal />
          <CookieConsentBanner />
          <Router />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
