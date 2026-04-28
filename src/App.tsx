import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
import { DriverDashboard } from './pages/dashboards/DriverDashboard';
import { OrderTracking } from './pages/OrderTracking';
import { useState, useEffect } from 'react';

export default function App() {
  const [isAdminConfigured, setIsAdminConfigured] = useState<boolean>(true); // Should be fetched from Firestore

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
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
            <Route path="driver" element={<DriverDashboard />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
