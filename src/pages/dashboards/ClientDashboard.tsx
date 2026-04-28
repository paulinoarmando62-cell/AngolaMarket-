
import { Package, Clock, User, CreditCard, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ClientDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Meus Pedidos</h1>
          <p className="text-slate-500">Acompanhe as suas compras e histórico de entregas.</p>
        </div>
        <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-2xl border border-slate-200">
          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-xs">PA</div>
          <span className="text-sm font-bold text-slate-700">Paulino Armando</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Stats */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-4">
              <Package className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pedidos Totais</p>
            <p className="text-2xl font-black text-slate-900 mt-1">14</p>
          </div>
          <div className="bg-slate-900 p-6 rounded-3xl text-white">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-4">
              <CreditCard className="w-5 h-5 text-orange-500" />
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Último Gasto</p>
            <p className="text-2xl font-black text-white mt-1">45.000 Kz</p>
            <p className="text-[10px] text-slate-400 mt-4 leading-relaxed">Pague por transferência IBAN para confirmar as suas encomendas.</p>
          </div>
        </div>

        {/* Order History */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-800 text-sm">Encomendas Recentes</h2>
              <button className="text-xs font-bold text-orange-600">Ver Histórico Completo</button>
            </div>
            
            <div className="divide-y divide-slate-50">
              {[1, 2, 3].map((order) => (
                <div key={order} className="p-6 hover:bg-slate-50 transition-all flex flex-wrap md:flex-nowrap items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center border border-slate-200">
                      <Package className="w-8 h-8 text-slate-300" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-black text-slate-800 uppercase tracking-tight">#AM-{order}2981</span>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${order === 1 ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                          {order === 1 ? 'EM ROTA' : 'ENTREGUE'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-1">Smartphone Pro Max + Capa Protetora</p>
                      <div className="flex items-center space-x-2 mt-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                        <Clock className="w-3 h-3" />
                        <span>Data: 28 Abr, 2026</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-8">
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total</p>
                      <p className="text-lg font-black text-slate-900">45.000 Kz</p>
                    </div>
                    <Link 
                      to={`/tracking/${order}`}
                      className="bg-slate-900 hover:bg-orange-600 text-white p-3 rounded-2xl transition-all shadow-lg shadow-slate-900/10"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-orange-50 p-6 rounded-3xl border border-orange-100 flex items-center justify-between">
            <div className="flex items-center space-x-4 text-orange-800">
              <User className="w-8 h-8 opacity-20" />
              <div>
                <p className="font-bold">Ganhe dinheiro indicando produtos!</p>
                <p className="text-sm opacity-80">Converta o seu perfil em Afiliado e receba comissões.</p>
              </div>
            </div>
            <button className="bg-orange-600 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-orange-600/20">
              Saber mais
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
