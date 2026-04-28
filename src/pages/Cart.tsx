
import { ShoppingCart, ArrowLeft, Trash2, ShieldCheck, ArrowRight, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

const MOCK_CART = [
  { id: '1', name: 'Kit Churrasco Premium', price: 15500, quantity: 1, image: 'https://images.unsplash.com/photo-1544022613-e84da3565d75?auto=format&fit=crop&q=80&w=400' },
  { id: '3', name: 'Vestido Samakaka', price: 25000, quantity: 1, image: 'https://images.unsplash.com/photo-1523450001312-faa4e2e37f0f?auto=format&fit=crop&q=80&w=400' },
];

export function Cart() {
  const total = MOCK_CART.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">O Seu Carrinho</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Tem {MOCK_CART.length} itens prontos para checkout.</p>
        </div>
        <Link to="/" className="text-slate-500 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-500 font-bold text-sm transition-colors flex items-center space-x-2">
          <ArrowLeft className="w-4 h-4" />
          <span>Continuar a Comprar</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence>
            {MOCK_CART.map((item) => (
              <motion.div 
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, x: -100 }}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 flex items-center space-x-6 border border-slate-100 dark:border-slate-800 shadow-sm relative group overflow-hidden"
              >
                <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 border border-slate-100 dark:border-slate-800">
                  <img src={item.image} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg text-slate-800 dark:text-white line-clamp-1">{item.name}</h3>
                    <button className="p-2 text-slate-300 dark:text-slate-600 hover:text-red-500 transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-0.5 sm:p-1">
                      <button className="w-8 h-8 flex items-center justify-center font-bold text-slate-500 hover:text-orange-600 text-sm transition-colors">-</button>
                      <div className="w-10 text-center font-black text-slate-800 dark:text-white text-xs">{item.quantity}</div>
                      <button className="w-8 h-8 flex items-center justify-center font-bold text-slate-500 hover:text-orange-600 text-sm transition-colors">+</button>
                    </div>
                    <p className="font-black text-slate-900 dark:text-white text-lg">{(item.price * item.quantity).toLocaleString()} Kz</p>
                  </div>
                </div>
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </AnimatePresence>

          {MOCK_CART.length === 0 && (
            <div className="py-24 text-center space-y-4">
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto text-slate-300 dark:text-slate-600 shadow-inner">
                <ShoppingCart className="w-10 h-10" />
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-bold">O seu carrinho está vazio.</p>
              <Link to="/" className="inline-block bg-orange-600 text-white px-8 py-3 rounded-2xl font-bold transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-orange-600/20">
                Explorar Produtos
              </Link>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-slate-900 dark:bg-black rounded-[2.5rem] p-8 text-white sticky top-24 space-y-8 border border-slate-800">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-500">Resumo da Encomenda</h2>
            
            <div className="space-y-4 pt-4 border-t border-white/10">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Subtotal</span>
                <span className="font-bold">{total.toLocaleString()} Kz</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Entrega (Luanda)</span>
                <span className="text-green-400 font-bold">Grátis</span>
              </div>
              <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                <span className="text-xs font-black uppercase text-slate-500">Total a Pagar</span>
                <span className="text-3xl font-black text-orange-500">{total.toLocaleString()} Kz</span>
              </div>
            </div>

            <div className="space-y-4">
              <Link 
                to="/checkout"
                className="w-full bg-orange-600 hover:bg-orange-700 py-5 rounded-2xl font-black flex items-center justify-center space-x-3 transition-all shadow-xl shadow-orange-600/20 group uppercase text-xs tracking-widest"
              >
                <span>Finalizar Pedido</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <div className="flex items-center justify-center space-x-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4 text-green-500" />
                <span>Compra Segura e Garantida</span>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-start space-x-3">
              <Package className="w-5 h-5 text-slate-400 mt-1" />
              <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                Ao finalizar, a plataforma entrará em contacto com o produtor para recolha e entrega ao domicílio via AngolaMarket Express.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
