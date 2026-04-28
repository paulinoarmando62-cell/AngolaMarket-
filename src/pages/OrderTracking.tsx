
import { Package, MapPin, Truck, CheckCircle2, Clock, Map } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { motion } from 'motion/react';

const STATUS_STEPS = [
  { id: 'confirmed', label: 'Pedido Confirmado', date: '28 Abr, 09:30' },
  { id: 'preparing', label: 'Em Preparação', date: '28 Abr, 11:20' },
  { id: 'collecting', label: 'Em Recolha', date: 'Pendente' },
  { id: 'in_transit', label: 'Em Rota de Entrega', date: 'Pendente' },
  { id: 'delivered', label: 'Entregue', date: 'Pendente' },
];

export function OrderTracking() {
  const { id } = useParams();
  const currentStatus = 'preparing';

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Pedido #AM-{id}</h1>
          <p className="text-slate-500 text-sm">Status Atual: <span className="font-bold text-orange-600 uppercase">Em Preparação</span></p>
        </div>
        <div className="bg-white px-4 py-2 rounded-2xl border border-slate-200">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Entrega Estimada</p>
          <p className="text-sm font-black text-slate-800">Hoje, até às 18:30</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Timeline */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-8">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>Linha do Tempo</span>
          </h2>
          
          <div className="relative space-y-12 pl-8">
            {/* Divider Line */}
            <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-slate-100" />
            
            {STATUS_STEPS.map((step, i) => {
              const isPast = STATUS_STEPS.findIndex(s => s.id === currentStatus) >= i;
              const isCurrent = step.id === currentStatus;

              return (
                <div key={step.id} className="relative flex items-center justify-between">
                  {/* Dot */}
                  <div className={`absolute -left-[17px] w-8 h-8 rounded-full border-4 border-white shadow-sm flex items-center justify-center transition-all ${
                    isPast ? 'bg-orange-600' : 'bg-slate-200'
                  }`}>
                    {isPast && <CheckCircle2 className="w-4 h-4 text-white" />}
                  </div>
                  
                  <div className="flex-1 ml-6">
                    <p className={`text-sm font-bold ${isPast ? 'text-slate-900' : 'text-slate-400'}`}>
                      {step.label}
                      {isCurrent && <span className="ml-2 bg-orange-100 text-orange-600 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">ATUAL</span>}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1 font-medium italic">{step.date}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Details & Help */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-3xl p-8 text-white space-y-6">
            <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Informações de Entrega</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-orange-500 shrink-0 mt-1" />
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Local</p>
                  <p className="text-sm font-medium leading-relaxed">Talatona, Condomínio Jardim de Rosas, Bloco A2</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Truck className="w-5 h-5 text-orange-500 shrink-0 mt-1" />
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tipo</p>
                  <p className="text-sm font-medium">Logística Interna AngolaMarket</p>
                </div>
              </div>
            </div>
            <button className="w-full bg-white/10 hover:bg-white/20 border border-white/20 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all">
              Contactar Suporte
            </button>
          </div>

          <div className="bg-orange-50 border border-orange-100 rounded-3xl p-6 flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-orange-600 shadow-sm">
              <Map className="w-8 h-8" />
            </div>
            <div>
              <p className="font-bold text-orange-900 text-sm">Visualizar no Mapa</p>
              <p className="text-xs text-orange-700 opacity-70">Acompanhe o estafeta em tempo real assim que ele sair para entrega.</p>
            </div>
            <button className="text-orange-600 font-bold text-xs uppercase underline">Abrir Mapa</button>
          </div>
        </div>
      </div>
    </div>
  );
}
