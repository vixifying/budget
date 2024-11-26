import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { store } from './store/store';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Settings from './pages/Settings';
import { useEffect } from 'react';
import { fetchCategories } from './store/categoriesSlice';
import { fetchTransactions } from './store/transactionsSlice';
import { useToast } from './hooks/use-toast';

function AppContent() {
  const { toast } = useToast();

  useEffect(() => {
    const initializeData = async () => {
      try {
        await Promise.all([
          store.dispatch(fetchCategories()),
          store.dispatch(fetchTransactions())
        ]);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load initial data. Please refresh the page.",
        });
      }
    };

    initializeData();
  }, [toast]);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </Router>
  );
}

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <AppContent />
        <Toaster />
      </ThemeProvider>
    </Provider>
  );
}

export default App;