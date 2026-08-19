import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { Layout } from "@/components/layout/Layout";
import ProfilePage from "@/pages/profile";
import TasksPage from "@/pages/tasks";
import CompletedTasksPage from "@/pages/completed-tasks";
import PomodoroPage from "@/pages/pomodoro";
import HabitTrackerPage from "@/pages/habits";
import SearchPage from "@/pages/search";
import SettingsPage from "@/pages/settings";
import Music from "@/pages/music";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={() => <Redirect to="/pomodoro" />} />
        <Route path="/profile" component={ProfilePage} />
        <Route path="/tasks" component={TasksPage} />
        <Route path="/tasks/completed" component={CompletedTasksPage} />
        <Route path="/tasks/:listId" component={TasksPage} />
        <Route path="/pomodoro" component={PomodoroPage} />
        <Route path="/habits" component={HabitTrackerPage} />
        <Route path="/search" component={SearchPage} />
        <Route path="/settings" component={SettingsPage} />
        <Route path="/music" component={Music} />
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
          <Router />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
