import './App.css'
import Router from './router'
import { ThemeProvider } from "@/components/theme-provider"
import './db/supabase';
import { TooltipProvider } from './components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';
import { BrowserRouter } from 'react-router-dom';
import { initializeAuth, useAuthStore } from './stores/authStore';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const setIsLoading = useAuthStore(state => state.setLoading);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const init = async () => {
      setIsLoading(true);
      const { data: { subscription } } = await initializeAuth();
      unsubscribe = () => subscription.unsubscribe();
      setIsInitialized(true);
      setIsLoading(false);
    };

    init();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [setIsLoading]);

  if (!isInitialized) {
    return <Loader2 className='animate-spin' />;
  }

  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
          <TooltipProvider>
            <Router />
            <Toaster />
          </TooltipProvider>
      </ThemeProvider>      
    </BrowserRouter>
  )
}

export default App;