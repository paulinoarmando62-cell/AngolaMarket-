import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/usePWAInstall';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-16 sm:bottom-4 left-4 right-4 sm:right-auto z-50 flex items-center justify-between gap-3 rounded-xl bg-slate-900/95 text-white px-4 py-2.5 text-xs font-medium shadow-2xl backdrop-blur-md border border-slate-700 animate-in slide-in-from-bottom">
      <div className="flex items-center gap-2">
        <WifiOff className="w-4 h-4 text-amber-400" />
        <span>Modo Offline — Navegação com dados em cache da AngolaMarket.</span>
      </div>
      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
    </div>
  );
};
