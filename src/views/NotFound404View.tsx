import React from 'react';
import { FileQuestion, Home, Search } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const NotFound404View: React.FC = () => {
  const { navigate } = useStore();

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center bg-white rounded-3xl p-8 border border-slate-100 shadow-xs space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
          <FileQuestion className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
            Erro 404
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Página não encontrada.
          </h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            A página que procura não existe ou foi movida. Explore as milhares de ofertas disponíveis na AngolaMarket.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
          <button
            onClick={() => navigate('/produtos')}
            className="flex-1 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>Ver Produtos</span>
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
