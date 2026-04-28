
export function AdminSetup() {
  return (
    <div className="max-w-xl mx-auto py-12">
      <div className="bg-white rounded-3xl p-10 shadow-sm border border-slate-100">
        <div className="mb-8">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-4 font-bold text-xl font-mono">
            01
          </div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Primeira Configuração</h1>
          <p className="text-slate-500 mt-2">Configure a conta de Administrador principal do AngolaMarket.</p>
        </div>

        <form className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Nome Completo</label>
              <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Telefone (Admin)</label>
              <input type="text" placeholder="+244" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">E-mail Principal</label>
            <input type="email" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-purple-500" />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Senha do Sistema</label>
            <input type="password" placeholder="Mínimo 8 caracteres" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-purple-500" />
          </div>

          <div className="bg-purple-50 border border-purple-100 p-4 rounded-2xl">
            <p className="text-xs text-purple-700 leading-relaxed font-medium">
              Nota: Após esta configuração, o acesso ao registo de administradores será desativado automaticamente para garantir a segurança da plataforma.
            </p>
          </div>

          <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-600/20 transition-all">
            Finalizar Instalação
          </button>
        </form>
      </div>
    </div>
  );
}
