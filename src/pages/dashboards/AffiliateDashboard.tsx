
import { Link2, DollarSign, BarChart3, Wallet, ExternalLink, Copy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { WITHDRAWAL_FEE } from '../../constants';

export function AffiliateDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-sans tracking-tight">Painel do Afiliado</h1>
          <p className="text-slate-500">Promova produtos e acompanhe seus lucros em tempo real.</p>
        </div>
        <div className="bg-orange-600 px-6 py-3 rounded-2xl text-white shadow-xl shadow-orange-600/20 text-right">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Saldo Disponível</p>
          <p className="text-2xl font-black">25.400 Kz</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-4">
            <TrendingUp className="w-5 h-5" />
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Ganhos</p>
          <p className="text-2xl font-black text-slate-900 mt-1">150.000 Kz</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
            <Link2 className="w-5 h-5" />
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cliques em Links</p>
          <p className="text-2xl font-black text-slate-900 mt-1">1.450</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4">
            <BarChart3 className="w-5 h-5" />
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Vendas Convertidas</p>
          <p className="text-2xl font-black text-slate-900 mt-1">12</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Products to Promote */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="font-bold text-slate-800 uppercase text-xs tracking-widest">Melhores Produtos</h2>
            <Link to="/" className="text-[10px] font-bold text-orange-600 uppercase underline">Ver Loja</Link>
          </div>
          <div className="divide-y divide-slate-50">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 flex items-center justify-between group hover:bg-slate-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl overflow-hidden">
                    <img src={`https://images.unsplash.com/photo-1544022613-e84da3565d75?auto=format&fit=crop&q=80&w=100`} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">Cadeira Pro Gaming XT</p>
                    <p className="text-[10px] text-orange-600 font-bold uppercase tracking-wider">Comissão: 15% (12.000 Kz)</p>
                  </div>
                </div>
                <button className="p-2 text-slate-400 group-hover:text-orange-600 transition-colors">
                  <Copy className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Withdrawal Section */}
        <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Wallet className="w-32 h-32" />
          </div>
          <div className="relative z-10">
            <h2 className="font-bold text-xl mb-2">Solicitar Levantamento</h2>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed">
              O saldo será enviado para o IBAN cadastrado no seu perfil em até 24h.
            </p>
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl mb-8 flex justify-between items-center">
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Taxa de Operação</p>
                <p className="text-lg font-bold">{WITHDRAWAL_FEE} Kz</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Valor a Receber</p>
                <p className="text-xl font-black text-orange-500">{(25400 - WITHDRAWAL_FEE).toLocaleString()} Kz</p>
              </div>
            </div>
            <button className="w-full bg-orange-600 hover:bg-orange-700 py-4 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all">
              <span>Levantar agora</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Minimal placeholder for TrendingUp since I used it inside the mapping
function TrendingUp({ className }: { className?: string }) {
  return <BarChart3 className={className} />;
}
