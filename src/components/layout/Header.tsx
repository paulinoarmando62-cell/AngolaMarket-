import React, { useState } from 'react';
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  User,
  ShieldCheck,
  Briefcase,
  TrendingUp,
  Heart,
  ChevronDown,
  Bell,
  LogOut,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { PWAInstallButton } from '../common/PWAInstallButton';
import { UserRole } from '../../types';

export const Header: React.FC = () => {
  const {
    currentRoute,
    navigate,
    currentUser,
    cart,
    categories,
    notifications,
    switchUserQuick,
    logout,
    favorites,
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const unreadNotifications = notifications.filter((n) => !n.isRead).length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/pesquisa?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const getRoleBadge = (role?: UserRole) => {
    switch (role) {
      case 'admin':
        return { label: 'Admin', color: 'bg-rose-100 text-rose-800 border-rose-200' };
      case 'producer':
        return { label: 'Produtor', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
      case 'affiliate':
        return { label: 'Afiliado', color: 'bg-purple-100 text-purple-800 border-purple-200' };
      default:
        return { label: 'Cliente', color: 'bg-blue-100 text-blue-800 border-blue-200' };
    }
  };

  const activeBadge = getRoleBadge(currentUser?.role);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-xs">
      {/* Top Banner / Announcement Bar */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              Entregas rápidas em Luanda e províncias de Angola
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-300">
              Pagamentos seguros via <strong>Multicaixa Express</strong> & <strong>PayPay</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Demo Role Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
                className="flex items-center gap-1.5 bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 px-2 py-0.5 rounded text-[11px] font-medium border border-blue-500/40 transition"
              >
                <span>Mudar Perfil de Teste:</span>
                <span className="font-bold text-white capitalize">{currentUser?.role || 'Visitante'}</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {roleSwitcherOpen && (
                <div className="absolute right-0 mt-1 w-56 bg-white text-slate-800 rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in">
                  <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Experimentar como:
                  </div>
                  <button
                    onClick={() => {
                      switchUserQuick('client');
                      setRoleSwitcherOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-blue-50 flex items-center gap-2"
                  >
                    <User className="w-4 h-4 text-blue-600" />
                    <div>
                      <div className="font-semibold">Cliente (Comprador)</div>
                      <div className="text-[10px] text-slate-500">Ana Paula • Fazer compras</div>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      switchUserQuick('affiliate');
                      setRoleSwitcherOpen(false);
                      navigate('/afiliado/dashboard');
                    }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-purple-50 flex items-center gap-2"
                  >
                    <TrendingUp className="w-4 h-4 text-purple-600" />
                    <div>
                      <div className="font-semibold">Afiliado (Divulgador)</div>
                      <div className="text-[10px] text-slate-500">Paulo Afonso • Ganhar comissões</div>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      switchUserQuick('producer');
                      setRoleSwitcherOpen(false);
                      navigate('/produtor/dashboard');
                    }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-emerald-50 flex items-center gap-2"
                  >
                    <Briefcase className="w-4 h-4 text-emerald-600" />
                    <div>
                      <div className="font-semibold">Produtor (Vendedor)</div>
                      <div className="text-[10px] text-slate-500">Kwanza Tech • Cadastrar produtos</div>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      switchUserQuick('admin');
                      setRoleSwitcherOpen(false);
                      navigate('/admin');
                    }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-rose-50 flex items-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4 text-rose-600" />
                    <div>
                      <div className="font-semibold">Administrador Geral</div>
                      <div className="text-[10px] text-slate-500">Gestão global da AngolaMarket</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            <PWAInstallButton variant="minimal" />
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Left: Mobile Menu Toggle + Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100"
            aria-label="Abrir Menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Exclusive AngolaMarket Logo */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2.5 text-left group focus:outline-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm group-hover:bg-blue-700 transition">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-blue-600 transition">
                  Angola<span className="text-blue-600">Market</span>
                </span>
                <span className="text-[9px] font-bold bg-blue-100 text-blue-800 px-1 py-0.5 rounded tracking-wider">
                  AO
                </span>
              </div>
              <span className="hidden sm:block text-[10px] text-slate-500 font-medium">
                O Marketplace Oficial de Angola
              </span>
            </div>
          </button>
        </div>

        {/* Center: Global Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden md:flex flex-1 max-w-xl mx-4 relative"
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquise por telemóveis, samakaka, eletrónicos, marcas..."
            className="w-full pl-11 pr-24 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-full transition"
          >
            Buscar
          </button>
        </form>

        {/* Right Actions: PWA, Favorites, Cart, Account */}
        <div className="flex items-center gap-2 sm:gap-3">
          <PWAInstallButton variant="header" />

          {/* Quick links depending on role */}
          {currentUser?.role === 'affiliate' && (
            <button
              onClick={() => navigate('/afiliado/dashboard')}
              className="hidden lg:flex items-center gap-1.5 text-xs font-semibold bg-purple-50 text-purple-700 hover:bg-purple-100 px-3 py-2 rounded-xl transition border border-purple-200"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              Painel Afiliado
            </button>
          )}

          {currentUser?.role === 'producer' && (
            <button
              onClick={() => navigate('/produtor/dashboard')}
              className="hidden lg:flex items-center gap-1.5 text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-3 py-2 rounded-xl transition border border-emerald-200"
            >
              <Briefcase className="w-3.5 h-3.5" />
              Painel Produtor
            </button>
          )}

          {currentUser?.role === 'admin' && (
            <button
              onClick={() => navigate('/admin')}
              className="hidden lg:flex items-center gap-1.5 text-xs font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 px-3 py-2 rounded-xl transition border border-rose-200"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Painel Admin
            </button>
          )}

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 relative transition"
              aria-label="Notificações"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifications > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full animate-ping" />
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 py-3 px-4 z-50 animate-in fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h4 className="font-bold text-sm text-slate-900">Notificações</h4>
                  <span className="text-[11px] text-blue-600 font-medium">AngolaMarket</span>
                </div>
                <div className="divide-y divide-slate-50 max-h-64 overflow-y-auto mt-2">
                  {notifications.slice(0, 5).map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        if (n.linkUrl) navigate(n.linkUrl);
                        setNotificationsOpen(false);
                      }}
                      className="py-2.5 hover:bg-slate-50 cursor-pointer rounded-lg px-2 text-left"
                    >
                      <p className="text-xs font-bold text-slate-900">{n.title}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Cart Shortcut */}
          <button
            onClick={() => navigate('/carrinho')}
            className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 relative transition"
            aria-label="Carrinho de Compras"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                {cartItemCount}
              </span>
            )}
          </button>

          {/* User Account / Profile Dropdown */}
          <div className="relative">
            {currentUser ? (
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 pl-2 sm:pr-3 rounded-full hover:bg-slate-100 border border-slate-200 transition"
              >
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold overflow-hidden">
                  {currentUser.avatar ? (
                    <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                  ) : (
                    currentUser.name.charAt(0)
                  )}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-semibold text-slate-900 leading-tight max-w-[100px] truncate">
                    {currentUser.name}
                  </div>
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${activeBadge.color}`}>
                    {activeBadge.label}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>
            ) : (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => navigate('/login')}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-blue-600"
                >
                  Entrar
                </button>
                <button
                  onClick={() => navigate('/registar')}
                  className="px-3 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
                >
                  Criar conta
                </button>
              </div>
            )}

            {/* Dropdown Menu */}
            {userDropdownOpen && currentUser && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-sm font-bold text-slate-900">{currentUser.name}</p>
                  <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                  <div className="mt-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${activeBadge.color}`}>
                      Perfil: {activeBadge.label}
                    </span>
                  </div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      navigate('/minha-conta');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <User className="w-4 h-4 text-slate-500" />
                    Minha Conta
                  </button>

                  <button
                    onClick={() => {
                      navigate('/meus-pedidos');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4 text-slate-500" />
                    Meus Pedidos
                  </button>

                  {/* Role Specific Actions */}
                  {currentUser.role === 'affiliate' ? (
                    <button
                      onClick={() => {
                        navigate('/afiliado/dashboard');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-semibold text-purple-700 hover:bg-purple-50 flex items-center gap-2"
                    >
                      <TrendingUp className="w-4 h-4" />
                      Dashboard do Afiliado
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        navigate('/afiliados');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-medium text-purple-700 hover:bg-purple-50 flex items-center gap-2"
                    >
                      <TrendingUp className="w-4 h-4" />
                      Ganhe Dinheiro como Afiliado
                    </button>
                  )}

                  {currentUser.role === 'producer' && (
                    <button
                      onClick={() => {
                        navigate('/produtor/dashboard');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-semibold text-emerald-700 hover:bg-emerald-50 flex items-center gap-2"
                    >
                      <Briefcase className="w-4 h-4" />
                      Dashboard do Produtor
                    </button>
                  )}

                  {currentUser.role === 'admin' && (
                    <button
                      onClick={() => {
                        navigate('/admin');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-semibold text-rose-700 hover:bg-rose-50 flex items-center gap-2"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      Painel Administrativo
                    </button>
                  )}
                </div>

                <div className="border-t border-slate-100 pt-1">
                  <button
                    onClick={() => {
                      logout();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Terminar Sessão
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Bar in Header */}
      <div className="px-4 pb-2.5 md:hidden">
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar na AngolaMarket..."
            className="w-full pl-9 pr-20 py-2 bg-slate-100 rounded-full text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <button
            type="submit"
            className="absolute right-1 top-1 bottom-1 px-3 bg-blue-600 text-white rounded-full text-[11px] font-semibold"
          >
            Buscar
          </button>
        </form>
      </div>

      {/* Categories Horizontal Navigation Bar */}
      <nav className="border-t border-slate-100 bg-white hidden sm:block">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-xs font-semibold text-slate-700">
          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar py-2.5">
            <button
              onClick={() => navigate('/produtos')}
              className={`hover:text-blue-600 whitespace-nowrap transition ${
                currentRoute === '/produtos' ? 'text-blue-600' : ''
              }`}
            >
              Todos os Produtos
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => navigate(`/categoria/${cat.slug}`)}
                className={`hover:text-blue-600 whitespace-nowrap transition ${
                  currentRoute === `/categoria/${cat.slug}` ? 'text-blue-600 font-bold' : ''
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-4 pl-4 shrink-0">
            <button
              onClick={() => navigate('/afiliados')}
              className="text-purple-700 hover:text-purple-800 font-bold flex items-center gap-1 whitespace-nowrap"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              Programa de Afiliados
            </button>
            <button
              onClick={() => navigate('/produtor/dashboard')}
              className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 whitespace-nowrap"
            >
              <Briefcase className="w-3.5 h-3.5" />
              Vender na AngolaMarket
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer Body */}
          <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                  AM
                </div>
                <span className="font-bold text-base text-slate-900">
                  Angola<span className="text-blue-600">Market</span>
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Quick Role Tester in Mobile */}
            <div className="p-3 bg-slate-50 border-b border-slate-200">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Simular Utilizador:
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => {
                    switchUserQuick('client');
                    setMobileMenuOpen(false);
                  }}
                  className={`px-2 py-1.5 text-xs rounded-lg font-semibold text-left ${
                    currentUser?.role === 'client' ? 'bg-blue-600 text-white' : 'bg-white text-slate-700 border'
                  }`}
                >
                  🛒 Cliente
                </button>
                <button
                  onClick={() => {
                    switchUserQuick('affiliate');
                    setMobileMenuOpen(false);
                    navigate('/afiliado/dashboard');
                  }}
                  className={`px-2 py-1.5 text-xs rounded-lg font-semibold text-left ${
                    currentUser?.role === 'affiliate' ? 'bg-purple-600 text-white' : 'bg-white text-slate-700 border'
                  }`}
                >
                  🚀 Afiliado
                </button>
                <button
                  onClick={() => {
                    switchUserQuick('producer');
                    setMobileMenuOpen(false);
                    navigate('/produtor/dashboard');
                  }}
                  className={`px-2 py-1.5 text-xs rounded-lg font-semibold text-left ${
                    currentUser?.role === 'producer' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-700 border'
                  }`}
                >
                  💼 Produtor
                </button>
                <button
                  onClick={() => {
                    switchUserQuick('admin');
                    setMobileMenuOpen(false);
                    navigate('/admin');
                  }}
                  className={`px-2 py-1.5 text-xs rounded-lg font-semibold text-left ${
                    currentUser?.role === 'admin' ? 'bg-rose-600 text-white' : 'bg-white text-slate-700 border'
                  }`}
                >
                  🛡️ Admin
                </button>
              </div>
            </div>

            {/* Links list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Navegação
                </p>
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      navigate('/');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left py-2 text-sm font-semibold text-slate-800"
                  >
                    Início
                  </button>
                  <button
                    onClick={() => {
                      navigate('/produtos');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left py-2 text-sm font-semibold text-slate-800"
                  >
                    Todos os Produtos
                  </button>
                  <button
                    onClick={() => {
                      navigate('/afiliados');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left py-2 text-sm font-semibold text-purple-700 flex items-center justify-between"
                  >
                    <span>Ganhe como Afiliado</span>
                    <span className="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full font-bold">
                      Até 15%
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      navigate('/produtor/dashboard');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left py-2 text-sm font-semibold text-emerald-700"
                  >
                    Venda na AngolaMarket
                  </button>
                </div>
              </div>

              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Categorias
                </p>
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        navigate(`/categoria/${cat.slug}`);
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left py-1.5 text-xs text-slate-600 hover:text-blue-600"
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Install PWA Prompt in Drawer */}
              <div className="pt-2">
                <PWAInstallButton variant="banner" />
              </div>
            </div>

            {/* Bottom User Area */}
            <div className="p-4 border-t border-slate-100 bg-slate-50">
              {currentUser ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                      {currentUser.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 truncate max-w-[130px]">{currentUser.name}</p>
                      <p className="text-[10px] text-slate-500 capitalize">{currentUser.role}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-xs text-rose-600 font-semibold"
                  >
                    Sair
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      navigate('/login');
                      setMobileMenuOpen(false);
                    }}
                    className="py-2 text-xs font-semibold bg-white border rounded-xl text-slate-700"
                  >
                    Entrar
                  </button>
                  <button
                    onClick={() => {
                      navigate('/registar');
                      setMobileMenuOpen(false);
                    }}
                    className="py-2 text-xs font-semibold bg-blue-600 text-white rounded-xl"
                  >
                    Registar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
