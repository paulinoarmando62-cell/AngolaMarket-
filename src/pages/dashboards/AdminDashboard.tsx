
import { TrendingUp, Users, Package, CreditCard, CheckCircle, AlertCircle } from 'lucide-react';

export function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard Administrativo</h1>
        <p className="text-slate-500">Controlo total do ecossistema AngolaMarket.</p>
      </div>

      {/* Global Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Volume Total (GMV)', value: '5.200.000 Kz', trend: '+12%', icon: TrendingUp, color: 'text-orange-600' },
          { label: 'Comissão Plataforma', value: '520.000 Kz', trend: '+10%', icon: CreditCard, color: 'text-blue-600' },
          { label: 'Utilizadores', value: '1.240', trend: '+85', icon: Users, color: 'text-purple-600' },
          { label: 'Encomendas Ativas', value: '42', trend: 'Em curso', icon: Package, color: 'text-green-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-black text-slate-900 mt-2">{stat.value}</p>
              <div className="flex items-center mt-4 space-x-2">
                <span className="text-[10px] font-bold bg-slate-100 px-2 py-0.5 rounded-full text-slate-600 italic">{stat.trend}</span>
              </div>
            </div>
            <stat.icon className={`absolute -right-4 -bottom-4 w-24 h-24 ${stat.color} opacity-[0.03] group-hover:scale-110 transition-transform`} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pending Actions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="font-bold text-slate-800 uppercase text-xs tracking-widest">Encomendas em Espera</h2>
              <button className="text-[10px] font-bold text-orange-600 uppercase underline">Ver todas</button>
            </div>
            <div className="divide-y divide-slate-50">
              {[1, 2, 3].map((item) => (
                <div key={item} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                      <Package className="w-5 h-5 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">Encomenda #AM-202{item}</p>
                      <p className="text-xs text-slate-500">Pagamento: IBAN • Valor: 45.000 Kz</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <AlertCircle className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-colors">
                      <CheckCircle className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* System Settings Quick View */}
        <div className="bg-slate-900 rounded-3xl p-8 text-white space-y-8">
          <h2 className="font-bold uppercase text-xs tracking-widest text-slate-500">Configurações Base</h2>
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400 font-medium">Comissão da Plataforma</span>
              <span className="text-lg font-black text-orange-500">10%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400 font-medium">Taxa de Saque (Afiliado)</span>
              <span className="text-lg font-black text-orange-500">200 Kz</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400 font-medium">Produtores Registados</span>
              <span className="text-lg font-black text-blue-400">156</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400 font-medium">Afiliados Ativos</span>
              <span className="text-lg font-black text-purple-400">890</span>
            </div>
          </div>
          <button className="w-full bg-white/10 hover:bg-white/20 border border-white/20 py-3 rounded-xl text-sm font-bold transition-all">
            Relatórios Detalhados
          </button>
        </div>
      </div>
    </div>
  );
}
