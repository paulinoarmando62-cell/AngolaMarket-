import React from 'react';
import { Home, Grid, ShoppingCart, TrendingUp, User } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const MobileBottomNav: React.FC = () => {
  const { currentRoute, navigate, cart, currentUser } = useStore();
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const isHome = currentRoute === '/';
  const isProducts = currentRoute.startsWith('/produtos') || currentRoute.startsWith('/categoria') || currentRoute.startsWith('/pesquisa');
  const isCart = currentRoute === '/carrinho' || currentRoute === '/checkout';
  const isAffiliates = currentRoute.startsWith('/afiliado');
  const isAccount = currentRoute.startsWith('/minha-conta') || currentRoute.startsWith('/meus-pedidos') || currentRoute.startsWith('/login') || currentRoute.startsWith('/registar');

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 md:hidden py-1.5 px-2">
      <div className="flex items-center justify-around">
        <button
          onClick={() => navigate('/')}
          className={`flex flex-col items-center gap-1 py-1 px-3 text-[10px] font-semibold transition ${
            isHome ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Início</span>
        </button>

        <button
          onClick={() => navigate('/produtos')}
          className={`flex flex-col items-center gap-1 py-1 px-3 text-[10px] font-semibold transition ${
            isProducts ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Grid className="w-5 h-5" />
          <span>Produtos</span>
        </button>

        <button
          onClick={() => navigate('/carrinho')}
          className={`flex flex-col items-center gap-1 py-1 px-3 text-[10px] font-semibold relative transition ${
            isCart ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <ShoppingCart className="w-5 h-5" />
          {cartCount > 0 && (
            <span className="absolute top-0 right-3 bg-blue-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
          <span>Carrinho</span>
        </button>

        <button
          onClick={() =>
            navigate(currentUser?.role === 'affiliate' ? '/afiliado/dashboard' : '/afiliados')
          }
          className={`flex flex-col items-center gap-1 py-1 px-3 text-[10px] font-semibold transition ${
            isAffiliates ? 'text-purple-600' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <TrendingUp className="w-5 h-5" />
          <span>Afiliados</span>
        </button>

        <button
          onClick={() => navigate(currentUser ? '/minha-conta' : '/login')}
          className={`flex flex-col items-center gap-1 py-1 px-3 text-[10px] font-semibold transition ${
            isAccount ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <User className="w-5 h-5" />
          <span>{currentUser ? 'Conta' : 'Entrar'}</span>
        </button>
      </div>
    </nav>
  );
};
