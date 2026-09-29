import React, { useState } from 'react';
import { Download, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface Props {
  variant?: 'header' | 'banner' | 'footer' | 'minimal';
}

export const PWAInstallButton: React.FC<Props> = ({ variant = 'header' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = () => {
    if (isInstallable) {
      install();
    } else if (isIOS) {
      setShowIOSGuide(true);
    } else {
      // Fallback instruction for browsers without beforeinstallprompt
      alert('Para instalar a AngolaMarket no seu dispositivo, abra as opções do navegador (três pontinhos ou partilha) e selecione "Adicionar ao ecrã principal".');
    }
  };

  return (
    <>
      {variant === 'header' && (
        <button
          onClick={handleInstallClick}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors border border-blue-200"
          title="Instalar App AngolaMarket no seu telemóvel ou PC"
        >
          <Smartphone className="w-3.5 h-3.5 text-blue-600" />
          <span>Instalar App</span>
        </button>
      )}

      {variant === 'footer' && (
        <button
          onClick={handleInstallClick}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-white text-blue-700 hover:bg-blue-50 transition shadow-sm border border-blue-100"
        >
          <Download className="w-4 h-4 text-blue-600" />
          <span>Instalar AngolaMarket (PWA)</span>
        </button>
      )}

      {variant === 'banner' && (
        <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white p-3 rounded-2xl flex items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold">Instale a App AngolaMarket</p>
              <p className="text-xs text-blue-100">Acesso ultrarrápido a compras e vendas no seu telemóvel sem gastar espaço</p>
            </div>
          </div>
          <button
            onClick={handleInstallClick}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white text-blue-800 hover:bg-blue-50 transition shrink-0 shadow-sm"
          >
            Instalar
          </button>
        </div>
      )}

      {variant === 'minimal' && (
        <button
          onClick={handleInstallClick}
          className="flex items-center gap-2 text-xs text-blue-600 font-medium hover:underline"
        >
          <Download className="w-3.5 h-3.5" />
          Instalar no Telemóvel
        </button>
      )}

      {/* iOS Safari Guided Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl relative">
            <button
              onClick={() => setShowIOSGuide(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Instalar no iPhone / iPad</h3>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              Adicione a AngolaMarket ao seu ecrã principal para ter a experiência de uma aplicação nativa rápida:
            </p>
            <div className="mt-4 space-y-3 bg-slate-50 p-3.5 rounded-xl text-xs text-slate-700">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">1</span>
                <span>Toque no botão <strong>Partilhar</strong> (ícone do quadrado com a seta para cima) na barra do Safari.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">2</span>
                <span>Deslize a lista e toque em <strong>"Ecrã Principal"</strong> (Add to Home Screen).</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">3</span>
                <span>Toque em <strong>"Adicionar"</strong> no canto superior direito.</span>
              </div>
            </div>
            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-5 w-full rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  );
};
