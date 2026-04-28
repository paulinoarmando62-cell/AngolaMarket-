
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, Search, Package, MapPin, Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from 'next-themes';
import { cn } from '../lib/utils';

export function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => setMounted(true), []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-orange-600/20">
                A
              </div>
              <span className="text-xl font-bold text-slate-800 dark:text-white hidden sm:block tracking-tight">
                Angola<span className="text-orange-600">Market</span>
              </span>
            </Link>

            {/* Desktop Search */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Pesquisar produtos..."
                  className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-full py-2 pl-10 pr-4 focus:ring-2 focus:ring-orange-500 focus:bg-white dark:focus:bg-slate-700 transition-all text-sm"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              {mounted && (
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="p-2 text-slate-600 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-500 transition-colors bg-slate-100 dark:bg-slate-800 rounded-xl"
                >
                  {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              )}
              
              <Link to="/cart" className="relative p-2 text-slate-600 dark:text-slate-400 hover:text-orange-600 transition-colors">
                <ShoppingCart className="w-6 h-6" />
                <span className="absolute top-0 right-0 bg-orange-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-white dark:ring-slate-900">
                  0
                </span>
              </Link>
              <Link to="/login" className="hidden sm:flex items-center space-x-1 text-slate-600 dark:text-slate-400 hover:text-orange-600 transition-colors text-sm font-medium">
                <User className="w-5 h-5" />
                <span>Entrar</span>
              </Link>
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-slate-600 dark:text-slate-400 hover:text-orange-600 transition-colors md:hidden"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Search */}
      <div className="md:hidden bg-white dark:bg-slate-900 px-4 py-2 border-b border-slate-100 dark:border-slate-800">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="O que procura hoje?"
            className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-lg py-2 pl-10 pr-4 text-sm"
          />
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-black text-slate-400 py-12 mt-auto border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-bold mb-4 uppercase text-xs tracking-widest">Plataforma</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/register?role=producer" className="hover:text-orange-500 transition-colors">Vender no Marketplace</Link></li>
              <li><Link to="/register?role=affiliate" className="hover:text-orange-500 transition-colors">Programa de Afiliados</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4 uppercase text-xs tracking-widest">Suporte</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-orange-500 transition-colors">Centro de Ajuda</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Termos de Uso</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Privacidade</a></li>
            </ul>
          </div>
          <div className="md:col-span-2">
            <h3 className="text-white font-bold mb-4 uppercase text-xs tracking-widest md:text-right">Luanda, Angola</h3>
            <p className="text-sm md:text-right leading-relaxed max-w-xs md:ml-auto">
              A maior rede de comércio local focada na conveniência e crescimento dos produtores angolanos.
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-800 text-center text-xs">
          © 2026 AngolaMarket. Todos os direitos reservados.
        </div>
      </footer>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-[80%] max-w-xs bg-white dark:bg-slate-900 z-[101] shadow-2xl p-6"
            >
              <div className="flex justify-between items-center mb-8">
                <span className="font-bold text-lg">Menu</span>
                <button onClick={() => setIsMenuOpen(false)} className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-white">
                  ✕
                </button>
              </div>
              <div className="space-y-6">
                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="flex items-center space-x-3 text-slate-800 dark:text-slate-100 font-medium p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors">
                  <User className="w-5 h-5" />
                  <span>Minha Conta</span>
                </Link>
                <Link to="/tracking" onClick={() => setIsMenuOpen(false)} className="flex items-center space-x-3 text-slate-800 dark:text-slate-100 font-medium p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors">
                  <Package className="w-5 h-5" />
                  <span>Rastrear Pedido</span>
                </Link>
                <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-4">Categorias</span>
                  <div className="grid grid-cols-1 gap-2">
                    {['Electrónicos', 'Moda', 'Gastronomia', 'Mobiliário', 'Artesanato'].map(cat => (
                      <button key={cat} className="text-left py-2 px-3 rounded-lg text-slate-600 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all uppercase text-xs font-bold">
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-6">
                  <button 
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="w-full flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm font-bold"
                  >
                    <span>Modo {theme === 'dark' ? 'Claro' : 'Escuro'}</span>
                    {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
