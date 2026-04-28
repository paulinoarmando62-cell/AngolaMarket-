
import { useState } from 'react';
import { CreditCard, MapPin, CheckCircle2, ChevronRight, Landmark } from 'lucide-react';
import { PAYMENT_METHODS, MUNICIPALITIES } from '../constants';
import { motion } from 'motion/react';

export function Checkout() {
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('');

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex items-center justify-center space-x-4 mb-12">
        {[1, 2, 3].map(s => (
          <div key={s} className="flex items-center space-x-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-all ${
              s <= step ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20' : 'bg-slate-200 text-slate-400'
            }`}>
              {s < step ? <CheckCircle2 className="w-6 h-6" /> : s}
            </div>
            {s < 3 && <div className={`w-12 h-1 rounded-full ${s < step ? 'bg-orange-600' : 'bg-slate-200'}`} />}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm min-h-[500px] flex flex-col">
        {step === 1 && (
          <div className="space-y-8 flex-1">
            <div className="space-y-1">
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">Endereço de Entrega</h1>
              <p className="text-slate-500 text-sm">Onde devemos entregar a sua encomenda em Luanda?</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Município</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 outline-none focus:ring-2 focus:ring-orange-500">
                  {MUNICIPALITIES['Luanda'].map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Bairro / Rua</label>
                <input type="text" placeholder="Ex: Maianga, Rua 5" className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
              <div className="col-span-1 md:col-span-2 space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Ponto de Referência</label>
                <input type="text" placeholder="Ex: Próximo ao Ginásio X" className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Número de Telefone</label>
                <input type="text" placeholder="+244 9..." className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
            </div>
            <div className="mt-auto pt-8">
              <button 
                onClick={() => setStep(2)}
                className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl flex items-center justify-center space-x-2"
              >
                <span>Continuar para Pagamento</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 flex-1">
            <div className="space-y-1">
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">Método de Pagamento</h1>
              <p className="text-slate-500 text-sm">Como deseja pagar a sua compra?</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {PAYMENT_METHODS.map(m => (
                <button
                  key={m.id}
                  onClick={() => setPaymentMethod(m.id)}
                  className={`p-6 rounded-2xl border-2 text-left transition-all ${
                    paymentMethod === m.id ? 'border-orange-600 bg-orange-50' : 'border-slate-100 bg-slate-50 hover:border-slate-200'
                  }`}
                >
                  <h3 className="font-bold text-slate-800">{m.label}</h3>
                  <p className="text-xs text-slate-500 mt-1">{m.description}</p>
                </button>
              ))}
            </div>
            {paymentMethod === 'iban' && (
              <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl space-y-4">
                <p className="text-xs font-black text-blue-800 uppercase tracking-widest">Informações para Transferência</p>
                <div className="space-y-2">
                  <p className="text-sm font-bold text-blue-900">BANCO: BFA</p>
                  <p className="text-sm font-bold text-blue-900">IBAN: AO06 0000 0000 0000 0000 0</p>
                  <p className="text-sm font-bold text-blue-900">BENEFICIÁRIO: ANGOLAMARKET LDA</p>
                </div>
                <p className="text-[10px] text-blue-600 leading-relaxed italic">
                  * Envie o comprovativo via WhatsApp (+244 9XX XXX XXX) para despacho imediato.
                </p>
              </div>
            )}
            <div className="mt-auto pt-8 flex space-x-4">
              <button onClick={() => setStep(1)} className="px-8 py-4 font-bold text-slate-500">Voltar</button>
              <button 
                onClick={() => setStep(3)}
                className="flex-1 bg-orange-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-orange-600/20"
              >
                Confirmar e Finalizar Encomenda
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center py-12 space-y-8 flex flex-col items-center justify-center h-full">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 10 }}
              className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600"
            >
              <CheckCircle2 className="w-16 h-16" />
            </motion.div>
            <div className="space-y-2">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Pedido Recebido!</h1>
              <p className="text-slate-500 max-w-sm mx-auto">
                A sua encomenda <span className="font-bold text-slate-800">#AM-9428</span> foi registada com sucesso. Verifique o seu e-mail para os próximos passos.
              </p>
            </div>
            <div className="flex space-x-4 pt-8">
              <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold flex items-center space-x-2">
                <span>Rastrear Pedido</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <button onClick={() => window.location.href = '/'} className="bg-white border border-slate-200 text-slate-600 px-8 py-4 rounded-2xl font-bold">
                Voltar à Loja
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
