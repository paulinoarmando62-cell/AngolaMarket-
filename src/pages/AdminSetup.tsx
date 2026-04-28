import { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, ArrowRight, Lock, Mail, User, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

export function AdminSetup() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setError('');

    try {
      // 1. Sign up user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Falha ao criar utilizador.');

      // 2. Create profile entry with admin role
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email,
          name,
          role: 'admin',
          balance: 0,
          created_at: new Date().toISOString()
        });

      if (profileError) {
        // Check if it's a "relation does not exist" error
        if (profileError.code === '42P01' || profileError.message?.includes('not found')) {
          throw new Error('A tabela "profiles" não existe no Supabase. Por favor, crie a tabela no SQL Editor do Supabase primeiro.');
        }
        throw profileError;
      }

      // 3. Success!
      setStep(3);
      setTimeout(() => {
        window.location.href = '/'; // Reload to clear setup state in App.tsx
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro ao configurar o administrador.');
      console.error('Setup Error:', err);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-20 px-4">
      <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-12 shadow-2xl border border-slate-100 dark:border-slate-800 text-center relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-orange-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl" />

        {step === 1 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="w-20 h-20 bg-orange-600 rounded-[2rem] flex items-center justify-center mx-auto shadow-xl shadow-orange-600/20 rotate-12">
              <Shield className="w-10 h-10 text-white -rotate-12" />
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight">Primeira Configuração</h1>
              <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto text-lg leading-relaxed">
                Bem-vindo à AngolaMarket. Para começar, precisamos de configurar a sua conta de administrador mestre.
              </p>
            </div>
            <button 
              onClick={() => setStep(2)}
              className="bg-slate-900 dark:bg-orange-600 hover:bg-orange-600 dark:hover:bg-orange-700 text-white px-10 py-5 rounded-2xl font-black transition-all flex items-center space-x-3 mx-auto shadow-xl"
            >
              <span>Configurar Agora</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.form 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            onSubmit={handleCreateAdmin}
            className="text-left space-y-6 max-w-md mx-auto"
          >
            <div className="space-y-2 text-center mb-10">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Conta Admin</h2>
              <p className="text-sm text-slate-500">Defina os seus dados de acesso mestre</p>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 p-6 rounded-2xl space-y-4 border border-red-100 dark:border-red-900/30">
                <div className="flex items-center space-x-2 text-sm font-bold">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>Erro de Configuração</span>
                </div>
                <p className="text-xs leading-relaxed opacity-80">{error}</p>
                {(error.includes('profiles') || error.includes('path')) && (
                  <div className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-red-200 dark:border-red-900/50">
                    <p className="text-[10px] font-black uppercase tracking-widest mb-2 text-slate-400">Execute este SQL no Supabase:</p>
                    <pre className="text-[10px] font-mono bg-slate-100 dark:bg-slate-900 p-2 rounded overflow-x-auto text-slate-600 dark:text-slate-300">
{`create table profiles (
  id uuid references auth.users not null primary key,
  email text,
  name text,
  role text,
  balance numeric default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);`}
                    </pre>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Nome do Proprietário</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  required
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-orange-500 dark:text-white" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">E-mail Profissional</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  required
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@angolamarket.com"
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-orange-500 dark:text-white" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Senha de Segurança</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  required
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-orange-500 dark:text-white" 
                />
              </div>
            </div>

            <button 
              disabled={isCreating}
              className="w-full bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-orange-600/20"
            >
              {isCreating ? 'A Inicializar Sistema...' : 'Finalizar Configuração'}
            </button>
          </motion.form>
        )}

        {step === 3 && (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-4">
            <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto" />
            <h2 className="text-3xl font-black text-slate-800 dark:text-white">Sistema Configurado!</h2>
            <p className="text-slate-500 dark:text-slate-400">O administrador principal foi criado com sucesso. A redirecionar...</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
