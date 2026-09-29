import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const ServerError500View: React.FC = () => {
  const { navigate } = useStore();

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center bg-white rounded-3xl p-8 border border-slate-100 shadow-xs space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
            Erro 500
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Erro no servidor.
          </h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            Ocorreu uma falha temporária ao comunicar com o servidor. Por favor recarregue a página ou tente novamente dentro de instantes.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
          <button
            onClick={() => window.location.reload()}
            className="flex-1 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Recarregar</span>
          </button>

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
