
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;
      if (!data.user) throw new Error('Utilizador não encontrado.');

      // Fetch profile to redirect to correct dashboard
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (profileError) throw profileError;

      if (profile) {
        navigate('/dashboard/' + profile.role);
      } else {
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao iniciar sessão.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-20 px-4">
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 shadow-2xl border border-slate-100 dark:border-slate-800 text-center">
        <div className="w-16 h-16 bg-orange-100 dark:bg-orange-950/30 rounded-2xl flex items-center justify-center mx-auto mb-8">
          <Lock className="w-8 h-8 text-orange-600" />
        </div>
        
        <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight mb-2">Bem-vindo de volta</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-10 font-medium tracking-tight">Aceda à sua conta AngolaMarket</p>

        <form onSubmit={handleLogin} className="space-y-6 text-left">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 p-4 rounded-xl flex items-center space-x-2 text-xs border border-red-100 dark:border-red-900/30">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                disabled={isLoading}
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 pl-12 pr-6 outline-none focus:ring-2 focus:ring-orange-500 dark:text-white transition-all disabled:opacity-50" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Palavra-passe</label>
              <button type="button" className="text-[10px] font-black text-orange-600 uppercase tracking-widest hover:underline">Esqueci a senha?</button>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                disabled={isLoading}
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 pl-12 pr-6 outline-none focus:ring-2 focus:ring-orange-500 dark:text-white transition-all shadow-sm disabled:opacity-50" 
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-slate-900 dark:bg-orange-600 hover:bg-orange-600 dark:hover:bg-orange-700 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-orange-600/10 active:scale-[0.98] flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <span>{isLoading ? 'A Entrar...' : 'Entrar no Sistema'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
          <p className="text-sm text-slate-500">
            Ainda não tem conta?{' '}
            <Link to="/register" className="text-orange-600 font-bold hover:underline">Registe-se aqui</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
