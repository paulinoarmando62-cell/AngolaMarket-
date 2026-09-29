import React from 'react';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  MessageCircle,
  Smartphone,
  Phone,
  Mail,
  MapPin,
  TrendingUp,
  Briefcase,
  Database,
  ArrowRight,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { PWAInstallButton } from '../common/PWAInstallButton';

export const Footer: React.FC = () => {
  const { navigate, categories, platformSettings } = useStore();

  const handleWhatsAppContact = () => {
    const phone = platformSettings.contactWhatsapp.replace(/\s+/g, '').replace('+', '');
    const text = encodeURIComponent('Olá AngolaMarket! Gostaria de obter informações sobre os vossos produtos e entregas.');
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-24 md:pb-12 border-t border-slate-800">
      {/* Trust & Guarantee Highlights */}
      <div className="max-w-7xl mx-auto px-4 mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6 rounded-2xl bg-slate-900 border border-slate-800/80">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-blue-600/10 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Entregas em Angola</h4>
              <p className="text-xs text-slate-400 mt-0.5">Talatona, Kilamba, Viana e províncias</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-blue-600/10 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Pagamento 100% Seguro</h4>
              <p className="text-xs text-slate-400 mt-0.5">Multicaixa Express, PayPay e IBAN</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-purple-600/10 text-purple-400 flex items-center justify-center shrink-0 border border-purple-500/20">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Programa de Afiliados</h4>
              <p className="text-xs text-slate-400 mt-0.5">Comissões diretas para a sua conta</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-600/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Produtores Locais</h4>
              <p className="text-xs text-slate-400 mt-0.5">Produtos autênticos certificados</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
        {/* Brand Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-white">
              Angola<span className="text-blue-500">Market</span>
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
            A maior plataforma angolana que liga produtores nacionais, clientes exigentes e afiliados de sucesso. Compre online com a confiança do Multicaixa Express e rapidez na entrega.
          </p>

          {/* WhatsApp Direct Support CTA */}
          <div className="pt-2">
            <button
              onClick={handleWhatsAppContact}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Falar com AngolaMarket no WhatsApp</span>
            </button>
          </div>

          {/* PWA Button */}
          <div className="pt-1">
            <PWAInstallButton variant="footer" />
          </div>
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
            Categorias
          </h4>
          <ul className="space-y-2.5 text-xs text-slate-400">
            {categories.slice(0, 5).map((cat) => (
              <li key={cat.id}>
                <button
                  onClick={() => navigate(`/categoria/${cat.slug}`)}
                  className="hover:text-blue-400 transition"
                >
                  {cat.name}
                </button>
              </li>
            ))}
            <li>
              <button
                onClick={() => navigate('/produtos')}
                className="text-blue-400 hover:text-blue-300 font-semibold"
              >
                Ver Todas as Categorias &rarr;
              </button>
            </li>
          </ul>
        </div>

        {/* Ecosystem: Afiliados & Produtores */}
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
            Ecossistema
          </h4>
          <ul className="space-y-2.5 text-xs text-slate-400">
            <li>
              <button
                onClick={() => navigate('/afiliados')}
                className="hover:text-purple-400 transition flex items-center gap-1"
              >
                <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
                <span>Ganhe como Afiliado</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/afiliado/dashboard')}
                className="hover:text-purple-400 transition"
              >
                Painel do Afiliado
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/produtor/dashboard')}
                className="hover:text-emerald-400 transition flex items-center gap-1"
              >
                <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
                <span>Venda como Produtor</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/admin')}
                className="hover:text-rose-400 transition"
              >
                Painel Administrativo
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/meus-pedidos')}
                className="hover:text-white transition"
              >
                Acompanhar Pedido
              </button>
            </li>
          </ul>
        </div>

        {/* Contact & Payment Badges */}
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
            Apoio & Contacto
          </h4>
          <div className="space-y-2.5 text-xs text-slate-400 mb-6">
            <p className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-blue-400" />
              {platformSettings.contactPhone}
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-blue-400" />
              {platformSettings.contactEmail}
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              Luanda, Angola
            </p>
          </div>

          <h5 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">
            Métodos Aceites
          </h5>
          <div className="flex flex-wrap gap-1.5">
            <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-[11px] font-semibold text-slate-200">
              Multicaixa Express
            </span>
            <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-[11px] font-semibold text-slate-200">
              PayPay Angola
            </span>
            <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-[11px] font-semibold text-slate-200">
              BAI / BFA / IBAN
            </span>
            <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-[11px] font-semibold text-slate-200">
              Entrega / TPA
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Copyright & Architecture notice */}
      <div className="max-w-7xl mx-auto px-4 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
        <p>© 2026 AngolaMarket. Todos os direitos reservados. Feito para Angola.</p>
        <div className="flex items-center gap-4 text-[11px]">
          <span className="flex items-center gap-1 text-slate-400">
            <Database className="w-3 h-3 text-emerald-400" />
            Supabase Architecture & RLS
          </span>
          <span className="flex items-center gap-1 text-slate-400">
            <Smartphone className="w-3 h-3 text-blue-400" />
            PWA Progressive Web App
          </span>
        </div>
      </div>
    </footer>
  );
};
