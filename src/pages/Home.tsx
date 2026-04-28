
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
      <section className="relative h-[500px] rounded-3xl overflow-hidden bg-slate-900 flex items-center">
        <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1534452286302-2f56b1b5e1cd?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center"></div>
        <div className="relative z-10 px-8 md:px-16 max-w-2xl space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 bg-orange-600/20 text-orange-400 px-4 py-1.5 rounded-full border border-orange-600/30 text-xs font-bold uppercase tracking-wider"
          >
            <Zap className="w-3 h-3 fill-orange-400" />
            <span>Entregas Rápidas em Luanda</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold text-white leading-tight"
          >
            Sua vitrine <span className="text-orange-500 underline decoration-4 underline-offset-8">escolhida</span> para o mercado Angolano.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-slate-300 text-lg"
          >
            A plataforma de marketplace que conecta produtores locais e clientes com logística integrada de ponta a ponta.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap gap-4"
          >
            <button className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg shadow-orange-600/20">
              Explorar Produtos
            </button>
            <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 px-8 py-3 rounded-full font-bold transition-all">
              Vender Connosco
            </button>
          </motion.div>
        </div>
      </section>

      {/* Categories Bar */}
      <section className="flex items-center space-x-6 overflow-x-auto pb-4 scrollbar-hide no-scrollbar">
        {['Todos', 'Electrónicos', 'Moda', 'Gastronomia', 'Mobiliário', 'Artesanato', 'Beleza'].map((cat, i) => (
          <button 
            key={cat}
            className={`whitespace-nowrap px-6 py-2 rounded-full text-sm font-bold transition-all ${
              i === 0 ? 'bg-orange-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </section>

      {/* Featured Products */}
      <section>
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Destaques da Semana</h2>
            <p className="text-slate-500">Produtos populares escolhidos para si</p>
          </div>
          <Link to="/products" className="text-orange-600 font-bold hover:underline">Ver todos</Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_PRODUCTS.map((prod) => (
            <motion.div 
              key={prod.id}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100 group"
            >
              <div className="relative h-56 overflow-hidden">
                <img src={prod.image} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-slate-800 flex items-center">
                  <Star className="w-3 h-3 text-orange-500 fill-orange-500 mr-1" />
                  {prod.rating}
                </div>
              </div>
              <div className="p-4 space-y-3">
                <span className="text-[10px] font-bold text-orange-600 uppercase tracking-widest">{prod.category}</span>
                <h3 className="font-bold text-slate-800 line-clamp-1">{prod.name}</h3>
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <span className="text-xs text-slate-400 block">Preço</span>
                    <span className="text-lg font-black text-slate-900">{prod.price.toLocaleString()} Kz</span>
                  </div>
                  <button className="bg-slate-900 hover:bg-orange-600 text-white p-2 rounded-xl transition-all">
                    <ShoppingBag className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Platform Features */}
      <section className="bg-white rounded-3xl p-8 border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex items-start space-x-4">
          <div className="bg-orange-100 p-3 rounded-2xl">
            <ShieldCheck className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h4 className="font-bold text-slate-800">Pagamento Seguro</h4>
            <p className="text-sm text-slate-500">Múltiplas formas de pagamento integradas.</p>
          </div>
        </div>
        <div className="flex items-start space-x-4">
          <div className="bg-blue-100 p-3 rounded-2xl">
            <MapPin className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h4 className="font-bold text-slate-800">Logística Própria</h4>
            <p className="text-sm text-slate-500">Recolhemos e entregamos para si.</p>
          </div>
        </div>
        <div className="flex items-start space-x-4">
          <div className="bg-green-100 p-3 rounded-2xl">
            <Zap className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h4 className="font-bold text-slate-800">Ganhe como Afiliado</h4>
            <p className="text-sm text-slate-500">Partilhe produtos e receba comissões.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
