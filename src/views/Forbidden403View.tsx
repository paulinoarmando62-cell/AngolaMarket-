import React from 'react';
import { ShieldAlert, ArrowLeft, Home, LogIn } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface Props {
  requiredRole?: string;
}

export const Forbidden403View: React.FC<Props> = ({ requiredRole }) => {
  const { currentUser, navigate } = useStore();

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center bg-white rounded-3xl p-8 border border-slate-100 shadow-xs space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-100">
            Erro 403
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Acesso não autorizado.
          </h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            {currentUser ? (
              <>
                A sua conta atual ({currentUser.email}) tem a função de{' '}
                <strong className="text-slate-800 uppercase">{currentUser.role}</strong> e não
                possui permissão para aceder a esta área restrita
                {requiredRole ? ` (necessário perfil ${requiredRole.toUpperCase()})` : ''}.
              </>
            ) : (
              'Precisa de iniciar sessão com uma conta autorizada para aceder a esta secção.'
            )}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
          {!currentUser ? (
            <button
              onClick={() => navigate('/login')}
              className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Iniciar Sessão</span>
            </button>
          ) : (
            <button
              onClick={() => navigate('/minha-conta')}
              className="flex-1 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
            >
              Minha Conta
            </button>
          )}

          <button
            onClick={() => navigate('/')}
            className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-xs"
          >
            <Home className="w-4 h-4" />
            <span>Voltar para a página inicial</span>
          </button>
        </div>
      </div>
    </div>
  );
};
