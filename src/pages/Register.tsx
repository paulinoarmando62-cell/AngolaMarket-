
import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { User, Store, UserPlus, Truck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

export function Register() {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') || 'client';
  const [role, setRole] = useState(initialRole);
  const [step, setStep] = useState(1);

  const roles = [
    { id: 'client', label: 'Cliente', icon: User, desc: 'Quero comprar produtos e receber em casa.' },
    { id: 'producer', label: 'Produtor', icon: Store, desc: 'Tenho produtos e quero vender e entregar.' },
    { id: 'affiliate', label: 'Afiliado', icon: UserPlus, desc: 'Quero ganhar dinheiro promovendo produtos.' },
    { id: 'driver', label: 'Entregador', icon: Truck, desc: 'Quero fazer entregas em Luanda.' },
  ];

  return (
    <div className="max-w-2xl mx-auto py-12">
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-2xl font-bold text-slate-800">Criar Nova Conta</h1>
          <div className="flex space-x-1">
            {[1, 2].map((s) => (
              <div key={s} className={`h-1.5 w-8 rounded-full ${s === step ? 'bg-orange-600' : 'bg-slate-200'}`} />
            ))}
          </div>
        </div>

        {step === 1 ? (
          <div className="space-y-6">
            <div className="space-y-4">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Escolha o seu perfil</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {roles.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setRole(r.id)}
                    className={`p-6 rounded-2xl border-2 text-left transition-all relative overflow-hidden group ${
                      role === r.id ? 'border-orange-600 bg-orange-50' : 'border-slate-100 hover:border-slate-200 bg-slate-50'
                    }`}
                  >
                    <r.icon className={`w-8 h-8 mb-4 ${role === r.id ? 'text-orange-600' : 'text-slate-400'}`} />
                    <h3 className="font-bold text-slate-800">{r.label}</h3>
                    <p className="text-xs text-slate-500 mt-1">{r.desc}</p>
                    {role === r.id && (
                      <motion.div layoutId="check" className="absolute top-4 right-4">
                        <CheckCircle2 className="w-6 h-6 text-orange-600" />
                      </motion.div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={() => setStep(2)}
              className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl flex items-center justify-center space-x-2"
            >
              <span>Continuar Registo</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <form className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Nome Completo</label>
                <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">WhatsApp / Telefone</label>
                <input type="text" placeholder="+244" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">E-mail</label>
              <input type="email" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-orange-500" />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Palavra-passe</label>
              <input type="password" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-orange-500" />
            </div>

            <div className="flex items-center space-x-4">
              <button 
                type="button"
                onClick={() => setStep(1)}
                className="bg-slate-100 text-slate-600 font-bold px-6 py-4 rounded-xl"
              >
                Voltar
              </button>
              <button 
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-600/20 transition-all font-bold"
              >
                Concluir Registo ({roles.find(r => r.id === role)?.label})
              </button>
            </div>
          </form>
        )}

        <div className="mt-8 pt-8 border-t border-slate-100 text-center">
          <p className="text-slate-500 text-sm">
            Já tem uma conta? <Link to="/login" className="text-orange-600 font-bold hover:underline">Entre aqui</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
