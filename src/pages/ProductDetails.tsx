
import { ShoppingCart, ArrowLeft, ShieldCheck, Truck, Store, Info, Star, Share2 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { PAYMENT_METHODS } from '../constants';

export function ProductDetails() {
  const { id } = useParams();

  return (
    <div className="space-y-12">
      <Link to="/" className="inline-flex items-center space-x-2 text-slate-500 hover:text-orange-600 font-bold text-sm transition-colors group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Voltar à Loja</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images */}
        <div className="space-y-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="aspect-square bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm"
          >
            <img src="https://images.unsplash.com/photo-1544022613-e84da3565d75?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover" />
          </motion.div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="aspect-square bg-white rounded-xl border border-slate-200 overflow-hidden cursor-pointer hover:border-orange-500 transition-colors">
                <img src="https://images.unsplash.com/photo-1544022613-e84da3565d75?auto=format&fit=crop&q=80&w=200" className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest">GASTRONOMIA</span>
              <div className="flex items-center space-x-1 text-orange-500">
                <Star className="w-4 h-4 fill-orange-500" />
                <span className="text-sm font-bold text-slate-800">4.8</span>
                <span className="text-xs text-slate-400 font-medium">(24 revisões)</span>
              </div>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">Kit Churrasco Premium - Seleção Especial Luanda</h1>
            <div className="flex items-end space-x-2">
              <p className="text-3xl font-black text-orange-600">15.500 Kz</p>
              <p className="text-slate-400 text-sm line-through mb-1">18.000 Kz</p>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-3xl p-6 space-y-6 shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-slate-700">
                <Truck className="w-5 h-5 text-orange-600" />
                <span className="text-sm font-bold">Entrega imediata disponível para Luanda</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-700">
                <Store className="w-5 h-5 text-orange-600" />
                <span className="text-sm">Vendido por <span className="font-bold underline">Talho Central de Talatona</span></span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 flex items-center bg-slate-100 rounded-2xl p-1 shrink-0">
                <button className="w-12 h-12 flex items-center justify-center font-bold text-slate-600 hover:text-orange-600">-</button>
                <div className="flex-1 text-center font-black text-slate-800">1</div>
                <button className="w-12 h-12 flex items-center justify-center font-bold text-slate-600 hover:text-orange-600">+</button>
              </div>
              <button className="flex-[2] bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-orange-600/20 transition-all flex items-center justify-center space-x-3">
                <ShoppingCart className="w-6 h-6" />
                <span>Adicionar ao Carrinho</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-xs font-black text-slate-400 uppercase tracking-widest pl-1">
              <Info className="w-4 h-4" />
              <span>Descrição do Produto</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              O nosso Kit Churrasco Premium é preparado no dia da entrega. Inclui picanha argentina, maminha, linguiça toscana e o nosso molho chimichurri artesanal. Ideal para eventos em família ou no convívio com amigos em Luanda.
            </p>
          </div>

          <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <ShieldCheck className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Compra Garantida</p>
                <p className="text-xs text-slate-500">O seu dinheiro está seguro connosco.</p>
              </div>
            </div>
            <button className="p-3 text-slate-400 hover:text-orange-600 transition-colors">
              <Share2 className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Suggested Payment Methods */}
      <section className="bg-slate-50 rounded-3xl p-8 border border-slate-200">
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6">Métodos de Pagamento Aceites</h3>
        <div className="flex flex-wrap gap-4">
          {PAYMENT_METHODS.map(m => (
            <div key={m.id} className="bg-white px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600">
              {m.label}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
