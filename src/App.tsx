import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { OfflineIndicator } from './components/common/OfflineIndicator';

import { HomeView } from './views/HomeView';
import { ProductsView } from './views/ProductsView';
import { ProductDetailView } from './views/ProductDetailView';
import { CartView } from './views/CartView';
import { CheckoutView } from './views/CheckoutView';
import { OrderDetailView } from './views/OrderDetailView';
import { AuthView } from './views/AuthView';
import { CustomerAccountView } from './views/CustomerAccountView';
import { AffiliatePublicView } from './views/AffiliatePublicView';
import { AffiliateDashboardView } from './views/AffiliateDashboardView';
import { ProducerDashboardView } from './views/ProducerDashboardView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { RouteGuard } from './components/common/RouteGuard';
import { Forbidden403View } from './views/Forbidden403View';
import { NotFound404View } from './views/NotFound404View';
import { ServerError500View } from './views/ServerError500View';

const RouterView: React.FC = () => {
  const { currentRoute } = useStore();

  // Parse path and search params
  const [pathname, searchStr] = currentRoute.split('?');
  const searchParams = new URLSearchParams(searchStr || '');

  // 1. Home
  if (pathname === '/' || pathname === '') {
    return <HomeView />;
  }

  // 2. All Products
  if (pathname === '/produtos') {
    return <ProductsView />;
  }

  // 3. Product Detail /produto/:slug
  if (pathname.startsWith('/produto/')) {
    const slug = pathname.replace('/produto/', '').split('/')[0];
    return <ProductDetailView slug={slug} />;
  }

  // 4. Category /categoria/:slug
  if (pathname.startsWith('/categoria/')) {
    const slug = pathname.replace('/categoria/', '').split('/')[0];
    return <ProductsView initialCategorySlug={slug} />;
  }

  // 5. Search /pesquisa?q=...
  if (pathname === '/pesquisa') {
    const query = searchParams.get('q') || '';
    return <ProductsView initialSearchQuery={query} />;
  }

  // 6. Cart & Checkout
  if (pathname === '/carrinho') {
    return <CartView />;
  }
  if (pathname === '/checkout') {
    return <CheckoutView />;
  }

  // 7. Order Details /pedido/:id
  if (pathname.startsWith('/pedido/')) {
    const orderId = pathname.replace('/pedido/', '').split('/')[0];
    return (
      <RouteGuard requireAuth={true}>
        <OrderDetailView orderId={orderId} />
      </RouteGuard>
    );
  }

  // 8. Auth
  if (pathname === '/login') {
    return <AuthView initialMode="login" />;
  }
  if (pathname === '/registar') {
    return <AuthView initialMode="register" />;
  }

  // 9. Customer Account & Orders (Authenticated users only)
  if (pathname === '/minha-conta' || pathname === '/meus-pedidos') {
    return (
      <RouteGuard requireAuth={true}>
        <CustomerAccountView />
      </RouteGuard>
    );
  }

  // 10. Affiliates
  if (pathname === '/afiliados') {
    return <AffiliatePublicView />;
  }
  if (pathname.startsWith('/afiliado')) {
    return (
      <RouteGuard allowedRoles={['affiliate', 'admin']}>
        <AffiliateDashboardView />
      </RouteGuard>
    );
  }

  // 11. Producers
  if (pathname.startsWith('/produtor')) {
    return (
      <RouteGuard allowedRoles={['producer', 'admin']}>
        <ProducerDashboardView />
      </RouteGuard>
    );
  }

  // 12. Admin (Admin only)
  if (pathname.startsWith('/admin')) {
    return (
      <RouteGuard allowedRoles={['admin']}>
        <AdminDashboardView />
      </RouteGuard>
    );
  }

  // 13. System Error Pages
  if (pathname === '/403') {
    return <Forbidden403View />;
  }
  if (pathname === '/404') {
    return <NotFound404View />;
  }
  if (pathname === '/500') {
    return <ServerError500View />;
  }

  // Fallback 404
  return <NotFound404View />;
};

export default function App() {
  return (
    <StoreProvider>
      <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-blue-600 selection:text-white">
        <Header />
        <main className="flex-1">
          <RouterView />
        </main>
        <Footer />
        <MobileBottomNav />
        <OfflineIndicator />
      </div>
    </StoreProvider>
  );
}
