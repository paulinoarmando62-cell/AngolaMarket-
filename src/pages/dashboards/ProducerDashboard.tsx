
import { Package, Plus, MapPin, DollarSign, Tag, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { MUNICIPALITIES } from '../../constants';

export function ProducerDashboard() {
  const [showAddProduct, setShowAddProduct] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Painel do Produtor</h1>
          <p className="text-slate-500">Gira os seus produtos e acompanhe as suas vendas.</p>
        </div>
        <button 
          onClick={() => setShowAddProduct(true)}
          className="bg-orange-600 text-white px-6 py-3 rounded-xl font-bold flex items-center space-x-2 shadow-lg shadow-orange-600/20"
        >
          <Plus className="w-5 h-5" />
          <span>Novo Produto</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Vendas Totais', value: '450.000 Kz', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Saldo Disponível', value: '120.000 Kz', icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Produtos Ativos', value: '12', icon: Package, color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'Comissões Pagas', value: '45.000 Kz', icon: Tag, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Product List Placeholder */}
      <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="font-bold text-slate-800">Meus Produtos</h2>
          <select className="bg-slate-50 border-none rounded-lg text-xs font-bold px-4 py-2">
            <option>Todos os Status</option>
            <option>Ativos</option>
            <option>Sem Stock</option>
          </select>
        </div>
        <div className="p-12 text-center">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
            <Package className="w-8 h-8" />
          </div>
          <p className="text-slate-500 text-sm">Ainda não cadastrou nenhum produto.</p>
          <button onClick={() => setShowAddProduct(true)} className="text-orange-600 font-bold text-sm mt-2 hover:underline">Comece agora</button>
        </div>
      </div>

      {/* Add Product Modal (Simple View) */}
      {showAddProduct && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-bold text-slate-800 uppercase tracking-tight">Registar Novo Produto</h2>
              <button onClick={() => setShowAddProduct(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            
            <div className="p-8 overflow-y-auto space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Basic Info */}
                <div className="space-y-6">
                  <h3 className="text-xs font-black text-orange-600 uppercase tracking-widest border-b border-orange-100 pb-2">Informações Básicas</h3>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Nome do Produto</label>
                      <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Preço (Kz)</label>
                        <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Stock</label>
                        <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Comissão de Afiliado</label>
                      <div className="flex space-x-2">
                        <input type="number" placeholder="Valor" className="flex-1 bg-slate-50 border border-slate-200 rounded-xl py-3 px-4" />
                        <select className="bg-slate-100 border-none rounded-xl px-4 font-bold text-xs">
                          <option>%</option>
                          <option>Kz</option>
                        </select>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">Nota: Máximo permitido é 30%.</p>
                    </div>
                  </div>
                </div>

                {/* Pickup Address */}
                <div className="space-y-6">
                  <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest border-b border-blue-100 pb-2">Endereço de Recolha (Logística)</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Província</label>
                        <select className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4">
                          <option>Luanda</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Município</label>
                        <select className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4">
                          {MUNICIPALITIES['Luanda'].map(m => <option key={m}>{m}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Bairro / Rua</label>
                      <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Ponto de Referência</label>
                      <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end space-x-4">
              <button 
                onClick={() => setShowAddProduct(false)}
                className="px-8 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-200"
              >
                Cancelar
              </button>
              <button 
                className="bg-orange-600 text-white px-12 py-3 rounded-xl font-bold shadow-lg shadow-orange-600/20"
              >
                Salvar Produto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
