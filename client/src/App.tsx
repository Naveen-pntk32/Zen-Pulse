import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Music from "@/pages/music";
import NotFound from "@/pages/not-found";
import supabase from "@/config/supabase";
import { useEffect, useState } from "react";
import AuthDialog from "./components/auth-dialog";


function Router() {
  useEffect(() => {
    async function testConnection() {
      const { data, error } = await supabase.from('tasks').select('*').limit(1);
      if (error) {
        console.error('Supabase connection error:', error);
      } else {
        console.log('Supabase connection successful:', data);
      }
    }
    testConnection();
  }, []);

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/music" component={Music} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }: { data: any }) => {
      setUser(data.session?.user || null);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setUser(session?.user || null);
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <div style={{ position: 'absolute', top: 16, right: 24, zIndex: 1000 }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>Signed in as {user.email}</span>
              <button onClick={handleLogout} style={{ marginLeft: 8 }}>Logout</button>
            </div>
          ) : (
            <>
              <button onClick={() => { setAuthMode('login'); setAuthDialogOpen(true); }} style={{ marginRight: 8 }}>Login</button>
              <button onClick={() => { setAuthMode('signup'); setAuthDialogOpen(true); }}>Sign Up</button>
            </>
          )}
        </div>
        <AuthDialog
          open={authDialogOpen}
          mode={authMode}
          onClose={() => setAuthDialogOpen(false)}
          onAuthSuccess={setUser}
        />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
