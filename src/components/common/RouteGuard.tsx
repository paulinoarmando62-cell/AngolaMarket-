import React from 'react';
import { useStore } from '../../context/StoreContext';
import { UserRole } from '../../types';
import { Forbidden403View } from '../../views/Forbidden403View';

interface RouteGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requireAuth?: boolean;
}

export const RouteGuard: React.FC<RouteGuardProps> = ({
  children,
  allowedRoles,
  requireAuth = true,
}) => {
  const { currentUser, navigate, currentRoute } = useStore();

  if (requireAuth && !currentUser) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center border border-slate-100 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto font-bold text-xl">
            AM
          </div>
          <h2 className="text-lg font-bold text-slate-900">Autenticação Necessária</h2>
          <p className="text-xs text-slate-500">
            Inicie sessão com a sua conta da AngolaMarket para aceder a esta página.
          </p>
          <button
            onClick={() => navigate(`/login?redirect=${encodeURIComponent(currentRoute)}`)}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs transition shadow-xs"
          >
            Ir para Iniciar Sessão
          </button>
        </div>
      </div>
    );
  }

  if (allowedRoles && currentUser) {
    const hasRole = allowedRoles.includes(currentUser.role);
    if (!hasRole) {
      return <Forbidden403View requiredRole={allowedRoles.join(' ou ')} />;
    }
  }

  return <>{children}</>;
};
