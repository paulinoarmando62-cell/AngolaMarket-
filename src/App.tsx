import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { ProductDetails } from './pages/ProductDetails';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { AdminSetup } from './pages/AdminSetup';
import { AdminDashboard } from './pages/dashboards/AdminDashboard';
import { ProducerDashboard } from './pages/dashboards/ProducerDashboard';
import { AffiliateDashboard } from './pages/dashboards/AffiliateDashboard';
import { ClientDashboard } from './pages/dashboards/ClientDashboard';
import { OrderTracking } from './pages/OrderTracking';
import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';

export default function App() {
  const [isAdminConfigured, setIsAdminConfigured] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const { count, error } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'admin');
        
        if (error) {
          // If table doesn't exist or other error, assume not configured for now
          setIsAdminConfigured(false);
          return;
        }
        setIsAdminConfigured((count || 0) > 0);
      } catch (err) {
        setIsAdminConfigured(false);
      }
    };
    checkAdmin();
  }, []);

  if (isAdminConfigured === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={isAdminConfigured ? <Home /> : <Navigate to="/setup-admin" replace />} />
            <Route path="product/:id" element={<ProductDetails />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="tracking/:id" element={<OrderTracking />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            
            {/* First time setup route - only accessible if not configured */}
            {!isAdminConfigured && (
              <Route path="setup-admin" element={<AdminSetup />} />
            )}

            {/* Dashboard Routes */}
            <Route path="dashboard">
              <Route path="admin" element={<AdminDashboard />} />
              <Route path="producer" element={<ProducerDashboard />} />
              <Route path="affiliate" element={<AffiliateDashboard />} />
              <Route path="client" element={<ClientDashboard />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
