
import { useState } from 'react';
import { CreditCard, MapPin, CheckCircle2, ChevronRight, Landmark } from 'lucide-react';
import { PAYMENT_METHODS, MUNICIPALITIES } from '../constants';
import { motion, AnimatePresence } from 'motion/react';

export function Checkout() {
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('');

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      {/* Stepper */}
      <div className="flex items-center justify-center space-x-4 mb-16">
        {[1, 2, 3].map(s => (
          <div key={s} className="flex items-center space-x-2">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm transition-all shadow-sm ${
              s <= step ? 'bg-orange-600 text-white shadow-xl shadow-orange-600/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
            }`}>
              {s < step ? <CheckCircle2 className="w-6 h-6" /> : `0${s}`}
            </div>
            {s < 3 && <div className={`w-12 h-1.5 rounded-full ${s < step ? 'bg-orange-600' : 'bg-slate-100 dark:bg-slate-800'}`} />}
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 md:p-12 border border-slate-100 dark:border-slate-800 shadow-sm min-h-[550px] flex flex-col transition-all relative overflow-hidden">
        {step === 1 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 flex-1">
            <div className="space-y-2">
              <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">Onde entregamos?</h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium tracking-tight">Especifique o local de entrega em Luanda.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 italic">Município</label>
                <select className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4.5 px-6 outline-none focus:ring-2 focus:ring-orange-500 dark:text-white transition-all appearance-none cursor-pointer">
                  {MUNICIPALITIES['Luanda'].map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 italic">Bairro / Rua</label>
                <input type="text" placeholder="Ex: Maianga, Rua 5" className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4.5 px-6 outline-none focus:ring-2 focus:ring-orange-500 dark:text-white transition-all" />
              </div>
              <div className="col-span-1 md:col-span-2 space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 italic">Ponto de Referência</label>
                <input type="text" placeholder="Ex: Próximo ao Ginásio X" className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4.5 px-6 outline-none focus:ring-2 focus:ring-orange-500 dark:text-white transition-all shadow-sm" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 italic">Número de Telefone</label>
                <input type="text" placeholder="+244 9..." className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4.5 px-6 outline-none focus:ring-2 focus:ring-orange-500 dark:text-white transition-all" />
              </div>
            </div>
            <div className="mt-auto pt-10">
              <button 
                onClick={() => setStep(2)}
                className="w-full bg-slate-900 dark:bg-orange-600 hover:bg-orange-600 dark:hover:bg-orange-700 text-white font-black py-5 rounded-2xl flex items-center justify-center space-x-3 transition-all shadow-xl shadow-orange-500/10 active:scale-[0.98] uppercase text-xs tracking-widest"
              >
                <span>Continuar para Pagamento</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8 flex-1">
            <div className="space-y-2">
              <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">Como deseja pagar?</h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium tracking-tight">Apoie os produtores locais de forma segura.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {PAYMENT_METHODS.map(m => (
                <button
                  key={m.id}
                  onClick={() => setPaymentMethod(m.id)}
                  className={`p-8 rounded-3xl border-2 text-left transition-all relative overflow-hidden group ${
                    paymentMethod === m.id 
                      ? 'border-orange-600 bg-orange-50 dark:bg-orange-950/20' 
                      : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:border-slate-200'
                  }`}
                >
                  <h3 className="font-bold text-slate-800 dark:text-white">{m.label}</h3>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mt-2">{m.description}</p>
                </button>
              ))}
            </div>
            
            <AnimatePresence mode="wait">
              {paymentMethod === 'iban' && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 p-8 rounded-[2rem] space-y-4"
                >
                  <p className="text-[10px] font-black text-blue-800 dark:text-blue-400 uppercase tracking-widest">Informações para Transferência</p>
                  <div className="space-y-2 font-mono text-sm">
                    <p className="text-blue-900 dark:text-blue-300 flex justify-between uppercase"><span>Banco:</span> <span className="font-black">BFA / BAI</span></p>
                    <p className="text-blue-900 dark:text-blue-300 flex justify-between uppercase"><span>IBAN:</span> <span className="font-black">AO06 0000 0000 0000 0000 0</span></p>
                    <p className="text-blue-900 dark:text-blue-300 flex justify-between uppercase"><span>Titular:</span> <span className="font-black">AngolaMarket Marketplace</span></p>
                  </div>
                  <p className="text-[10px] text-blue-600 dark:text-blue-500 pt-2 leading-relaxed italic font-medium">
                    * Após o pagamento, envie o comprovativo pelo painel do cliente ou via WhatsApp para despacho imediato.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-auto pt-10 flex flex-col sm:flex-row gap-4">
              <button onClick={() => setStep(1)} className="px-10 py-5 font-black text-slate-400 dark:text-slate-600 hover:text-slate-800 dark:hover:text-slate-300 uppercase text-xs tracking-widest transition-colors">Voltar</button>
              <button 
                onClick={() => setStep(3)}
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-black py-5 rounded-2xl shadow-xl shadow-orange-600/20 active:scale-[0.98] uppercase text-xs tracking-widest"
              >
                Confirmar Encomenda
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <div className="text-center py-12 space-y-10 flex flex-col items-center justify-center h-full">
            <motion.div 
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', damping: 10, stiffness: 100 }}
              className="w-32 h-32 bg-green-100 dark:bg-green-950/30 rounded-[2.5rem] flex items-center justify-center text-green-600 dark:text-green-500 shadow-inner"
            >
              <CheckCircle2 className="w-16 h-16" />
            </motion.div>
            <div className="space-y-4">
              <h1 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight">Pedido Confirmado!</h1>
              <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto text-lg leading-relaxed font-medium">
                A sua encomenda <span className="font-black text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg ml-1">#AM-9428</span> foi registada. A nossa equipa entrará em contacto em breve.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 pt-10">
              <button className="bg-slate-900 dark:bg-orange-600 hover:bg-orange-600 text-white px-10 py-5 rounded-2xl font-black flex items-center justify-center space-x-3 shadow-xl transition-all uppercase text-xs tracking-widest active:scale-[0.98]">
                <span>Rastrear Agora</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <button onClick={() => window.location.href = '/'} className="bg-white dark:bg-slate-800 dark:text-white border border-slate-200 dark:border-slate-800 text-slate-600 px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-50 dark:hover:bg-slate-700 transition-all transition-colors active:scale-[0.98]">
                Voltar à Loja
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
