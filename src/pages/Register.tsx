
import { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { User, Store, UserPlus, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { supabase } from '../lib/supabase';
import { UserRole } from '../types';

export function Register() {
  const [searchParams] = useSearchParams();
  const initialRole = (searchParams.get('role') as UserRole) || 'client';
  const navigate = useNavigate();
  
  const [role, setRole] = useState<UserRole>(initialRole);
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Falha ao criar conta.');

      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email,
          name,
          role,
          balance: 0,
        });

      if (profileError) throw profileError;

      navigate('/dashboard/' + role);
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta.');
    } finally {
      setIsLoading(false);
    }
  };

  const roles = [
    { id: 'client', label: 'Cliente', icon: User, desc: 'Quero comprar produtos e receber em casa.' },
    { id: 'producer', label: 'Produtor', icon: Store, desc: 'Tenho produtos e quero vender e entregar.' },
    { id: 'affiliate', label: 'Afiliado', icon: UserPlus, desc: 'Quero ganhar dinheiro promovendo produtos.' },
  ];

  return (
    <div className="max-w-2xl mx-auto py-12">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-800">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Criar Nova Conta</h1>
          <div className="flex space-x-1">
            {[1, 2].map((s) => (
              <div key={s} className={`h-1.5 w-8 rounded-full ${s === step ? 'bg-orange-600' : 'bg-slate-200 dark:bg-slate-700'}`} />
            ))}
          </div>
        </div>

        {step === 1 ? (
          <div className="space-y-6">
            <div className="space-y-4">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Escolha o seu perfil</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {roles.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setRole(r.id as UserRole)}
                    className={`p-6 rounded-2xl border-2 text-left transition-all relative overflow-hidden group ${
                      role === r.id 
                        ? 'border-orange-600 bg-orange-50 dark:bg-orange-950/20' 
                        : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 bg-slate-50 dark:bg-slate-800/50'
                    }`}
                  >
                    <r.icon className={`w-8 h-8 mb-4 ${role === r.id ? 'text-orange-600' : 'text-slate-400'}`} />
                    <h3 className="font-bold text-slate-800 dark:text-white text-sm">{r.label}</h3>
                    <p className="text-[10px] text-slate-500 mt-1 leading-tight">{r.desc}</p>
                    {role === r.id && (
                      <motion.div layoutId="check" className="absolute top-4 right-4">
                        <CheckCircle2 className="w-5 h-5 text-orange-600" />
                      </motion.div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={() => setStep(2)}
              className="w-full bg-slate-900 dark:bg-orange-600 text-white font-bold py-4 rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-orange-600/10"
            >
              <span>Continuar Registo</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <form className="space-y-6" onSubmit={handleRegister}>
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-xl text-xs border border-red-100 dark:border-red-900/30">
                {error}
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Nome Completo</label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-orange-500 dark:text-white" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">WhatsApp / Telefone</label>
                <input 
                  type="text" 
                  placeholder="+244" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-orange-500 dark:text-white" 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">E-mail</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-orange-500 dark:text-white" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Palavra-passe</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-orange-500 dark:text-white" 
              />
            </div>

            <div className="flex items-center space-x-4">
              <button 
                type="button"
                onClick={() => setStep(1)}
                className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold px-6 py-4 rounded-xl"
              >
                Voltar
              </button>
              <button 
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-600/20 transition-all flex items-center justify-center"
              >
                {isLoading ? 'A Processar...' : `Concluir Registo (${roles.find(r => r.id === role)?.label})`}
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
