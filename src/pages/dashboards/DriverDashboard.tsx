
import { Package, MapPin, Truck, CheckCircle, Clock, Navigation } from 'lucide-react';

export function DriverDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Painel de Entregas</h1>
          <p className="text-slate-500">Gestão de recolhas e entregas em Luanda.</p>
        </div>
        <div className="flex items-center space-x-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-xs font-bold ring-1 ring-green-200">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span>Disponível / Online</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Tasks */}
        <div className="space-y-6">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>Tarefas para Hoje</span>
          </h2>
          
          {[1, 2].map((task) => (
            <div key={task} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden group">
              <div className="p-6 bg-orange-50 border-b border-orange-100 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <Package className="text-orange-600 w-6 h-6" />
                  <span className="font-black text-slate-900">#AM-ORDER-{task}452</span>
                </div>
                <span className="text-[10px] font-bold bg-orange-600 text-white px-2 py-0.5 rounded-full">AGUARDANDO RECOLHA</span>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Pickup */}
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
                    <span className="text-xs font-bold">1</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ponto de Recolha (Produtor)</p>
                    <p className="text-sm font-bold text-slate-800 mt-1">Armazém Bengo - Talatona, Rua 4, Luanda</p>
                    <div className="flex items-center space-x-2 mt-2 text-[10px] text-slate-500 font-medium">
                      <MapPin className="w-3 h-3" />
                      <span>Ref: Frente ao Banco Sol</span>
                    </div>
                  </div>
                  <button className="bg-slate-900 text-white p-2 rounded-lg">
                    <Navigation className="w-4 h-4" />
                  </button>
                </div>

                {/* Divider Line */}
                <div className="ml-4 border-l-2 border-dashed border-slate-200 h-8" />

                {/* Dropoff */}
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-orange-100 shrink-0 flex items-center justify-center border border-orange-200">
                    <span className="text-xs font-bold text-orange-600">2</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Entrega Final (Cliente)</p>
                    <p className="text-sm font-bold text-slate-800 mt-1">Condomínio Jardim de Rosas - Bloco A2, Luanda</p>
                    <div className="flex items-center space-x-2 mt-2 text-[10px] text-slate-500 font-medium">
                      <MapPin className="w-3 h-3" />
                      <span>Ref: Portaria 3</span>
                    </div>
                  </div>
                  <button className="bg-slate-900 text-white p-2 rounded-lg">
                    <Navigation className="w-4 h-4" />
                  </button>
                </div>

                <div className="pt-6 border-t border-slate-50">
                  <button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-xl font-bold transition-all shadow-md">
                    Confirmar Recolha Com Sucesso
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats & History */}
        <div className="space-y-6">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center space-x-2">
            <CheckCircle className="w-4 h-4" />
            <span>Resumo de Atividade</span>
          </h2>
          
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm grid grid-cols-2 gap-8">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Hoje</p>
              <p className="text-3xl font-black text-slate-900">08</p>
              <p className="text-[10px] text-green-600 font-bold mt-2">ENTREGUES</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Ganhos (Dia)</p>
              <p className="text-3xl font-black text-slate-900">4.500 <span className="text-sm">Kz</span></p>
              <p className="text-[10px] text-slate-400 font-bold mt-2">TAXA DE ENTREGA</p>
            </div>
          </div>

          <div className="bg-slate-50 rounded-3xl p-6 space-y-4">
            <h3 className="font-bold text-slate-800 text-sm">Próximas Disponíveis</h3>
            <div className="space-y-3">
              {[1, 2].map(i => (
                <div key={i} className="bg-white p-4 rounded-2xl flex justify-between items-center border border-white">
                  <div>
                    <p className="text-xs font-bold">Viana - Centro</p>
                    <p className="text-[10px] text-slate-400 italic">2.5km de si</p>
                  </div>
                  <button className="text-[10px] font-black uppercase text-orange-600 bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-100">
                    ACEITAR
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
