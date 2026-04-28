
import { ShoppingBag, Star, Zap, ShieldCheck, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

const MOCK_PRODUCTS = [
  { id: '1', name: 'Kit Churrasco Premium', price: 15500, category: 'Gastronomia', image: 'https://images.unsplash.com/photo-1544022613-e84da3565d75?auto=format&fit=crop&q=80&w=400', rating: 4.8 },
  { id: '2', name: 'Smartphone Pro Max', price: 450000, category: 'Electrónicos', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=400', rating: 4.5 },
  { id: '3', name: 'Vestido Tradicional Samakaka', price: 25000, category: 'Moda', image: 'https://images.unsplash.com/photo-1523450001312-faa4e2e37f0f?auto=format&fit=crop&q=80&w=400', rating: 4.9 },
  { id: '4', name: 'Cadeira Gamer Ergonomica', price: 85000, category: 'Mobiliário', image: 'https://images.unsplash.com/photo-1598550476439-6847785fce66?auto=format&fit=crop&q=80&w=400', rating: 4.2 },
];

export function Home() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative h-[500px] rounded-3xl overflow-hidden bg-slate-900 flex items-center shadow-2xl">
        <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1534452286302-2f56b1b5e1cd?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center"></div>
        <div className="relative z-10 px-8 md:px-16 max-w-2xl space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 bg-orange-600/20 text-orange-400 px-4 py-1.5 rounded-full border border-orange-600/30 text-[10px] font-bold uppercase tracking-wider"
          >
            <Zap className="w-3 h-3 fill-orange-400" />
            <span>Entregas Rápidas em Luanda</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight"
          >
            Sua vitrine <span className="text-orange-500 underline decoration-4 underline-offset-8">local</span> em Angola.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-slate-300 text-lg leading-relaxed"
          >
            A plataforma de marketplace que conecta produtores locais e clientes com logística integrada em toda a província de Luanda.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap gap-4"
          >
            <button className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-orange-600/20">
              Explorar Produtos
            </button>
            <Link to="/register?role=producer" className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 px-8 py-4 rounded-2xl font-bold transition-all flex items-center">
              Vender Connosco
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Categories Bar */}
      <section className="flex items-center space-x-4 overflow-x-auto pb-4 scrollbar-hide no-scrollbar pt-2">
        {['Todos', 'Electrónicos', 'Moda', 'Gastronomia', 'Mobiliário', 'Artesanato', 'Beleza'].map((cat, i) => (
          <button 
            key={cat}
            className={`whitespace-nowrap px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
              i === 0 
                ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20' 
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </section>

      {/* Featured Products */}
      <section>
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">Destaques da Semana</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Produtos populares escolhidos para si</p>
          </div>
          <Link to="/" className="text-orange-600 font-bold hover:underline py-2">Ver todos</Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {MOCK_PRODUCTS.map((prod) => (
            <motion.div 
              key={prod.id}
              whileHover={{ y: -8 }}
              className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all border border-slate-100 dark:border-slate-800 group"
            >
              <Link to={`/product/${prod.id}`}>
                <div className="relative h-64 overflow-hidden">
                  <img src={prod.image} alt={prod.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-black text-slate-800 dark:text-white flex items-center shadow-lg">
                    <Star className="w-3 h-3 text-orange-500 fill-orange-500 mr-1" />
                    {prod.rating}
                  </div>
                </div>
              </Link>
              <div className="p-6 space-y-4">
                <span className="text-[10px] font-black text-orange-600 uppercase tracking-[0.2em]">{prod.category}</span>
                <Link to={`/product/${prod.id}`}>
                  <h3 className="font-bold text-slate-800 dark:text-white line-clamp-1 text-lg group-hover:text-orange-600 transition-colors">{prod.name}</h3>
                </Link>
                <div className="flex items-center justify-between pt-4">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-1">Preço</span>
                    <span className="text-xl font-black text-slate-900 dark:text-white leading-none whitespace-nowrap">{prod.price.toLocaleString()} Kz</span>
                  </div>
                  <button className="bg-slate-900 dark:bg-orange-600 hover:bg-orange-600 dark:hover:bg-orange-700 text-white p-3.5 rounded-2xl transition-all shadow-xl shadow-slate-900/10 dark:shadow-orange-600/20">
                    <ShoppingBag className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Platform Features */}
      <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-200 dark:border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-12 shadow-sm">
        <div className="flex items-start space-x-6">
          <div className="bg-orange-100 dark:bg-orange-900/30 p-4 rounded-3xl shrink-0">
            <ShieldCheck className="w-8 h-8 text-orange-600" />
          </div>
          <div>
            <h4 className="font-black text-slate-800 dark:text-white uppercase text-xs tracking-widest mb-2">Pagamento Seguro</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">Múltiplas formas de pagamento angolanas integradas.</p>
          </div>
        </div>
        <div className="flex items-start space-x-6">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-3xl shrink-0">
            <MapPin className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h4 className="font-black text-slate-800 dark:text-white uppercase text-xs tracking-widest mb-2">Logística Própria</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">A AngolaMarket cuida de toda a entrega ao domicílio.</p>
          </div>
        </div>
        <div className="flex items-start space-x-6">
          <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-3xl shrink-0">
            <Zap className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <h4 className="font-black text-slate-800 dark:text-white uppercase text-xs tracking-widest mb-2">Ganhe como Afiliado</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">Partilhe produtos e receba lucros por cada venda.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
