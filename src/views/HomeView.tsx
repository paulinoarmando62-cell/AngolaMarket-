import React, { useState } from 'react';
import {
  TrendingUp,
  Briefcase,
  ShieldCheck,
  Truck,
  CreditCard,
  Percent,
  Flame,
  Award,
  ChevronRight,
  ArrowRight,
  Smartphone,
  Star,
  CheckCircle2,
  Clock,
  MapPin,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/product/ProductCard';
import { PWAInstallButton } from '../components/common/PWAInstallButton';

export const HomeView: React.FC = () => {
  const {
    products,
    categories,
    banners,
    navigate,
    deliveryZones,
    formatKz,
  } = useStore();

  const [activeBannerIndex, setActiveBannerIndex] = useState(0);

  const featuredProducts = products.filter((p) => p.isFeatured && p.isApproved);
  const bestSellers = products.filter((p) => p.isBestSeller && p.isApproved);
  const onSaleProducts = products.filter((p) => p.promoPrice && p.isApproved);

  const activeBanner = banners[activeBannerIndex] || banners[0];

  return (
    <div className="space-y-12 pb-16">
      {/* 1. Main Hero Promotional Banner */}
      <section className="max-w-7xl mx-auto px-4 pt-4">
        <div className="relative rounded-3xl overflow-hidden shadow-xl min-h-[380px] md:min-h-[440px] flex items-center bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-950 text-white">
          {/* Background subtle image overlay */}
          <div
            className="absolute inset-0 opacity-20 bg-cover bg-center mix-blend-overlay"
            style={{ backgroundImage: `url(${activeBanner.imageUrl})` }}
          />

          <div className="relative z-10 max-w-2xl px-6 py-10 sm:px-12 space-y-4">
            <span className="inline-block px-3 py-1 rounded-full text-[11px] font-extrabold tracking-wider uppercase bg-blue-500/30 text-blue-200 border border-blue-400/30 backdrop-blur-xs">
              {activeBanner.tag}
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              {activeBanner.title}
            </h1>

            <p className="text-sm sm:text-base text-blue-100 max-w-lg leading-relaxed">
              {activeBanner.subtitle}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => navigate(activeBanner.linkUrl)}
                className="px-6 py-3 rounded-2xl bg-white text-blue-900 font-bold text-sm hover:bg-blue-50 transition shadow-lg flex items-center gap-2 group"
              >
                <span>{activeBanner.buttonText}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => navigate('/afiliados')}
                className="px-5 py-3 rounded-2xl bg-blue-700/60 hover:bg-blue-700 text-white font-semibold text-sm transition border border-white/20 flex items-center gap-1.5"
              >
                <TrendingUp className="w-4 h-4 text-purple-300" />
                <span>Programa de Afiliados</span>
              </button>
            </div>
          </div>

          {/* Banner Selector Dots */}
          <div className="absolute bottom-4 right-6 sm:right-12 flex items-center gap-2 z-20">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveBannerIndex(idx)}
                className={`h-2.5 rounded-full transition-all ${
                  activeBannerIndex === idx
                    ? 'w-8 bg-white'
                    : 'w-2.5 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Banner ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 2. Popular Categories Carousel / Grid */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Categorias em Destaque
            </h2>
            <p className="text-xs text-slate-500">
              Encontre tudo o que precisa dos melhores fornecedores e produtores angolanos
            </p>
          </div>
          <button
            onClick={() => navigate('/produtos')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>Ver Todas</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigate(`/categoria/${cat.slug}`)}
              className="p-4 rounded-2xl bg-white border border-slate-100 shadow-xs hover:shadow-md hover:border-blue-200 transition text-center group flex flex-col items-center justify-center gap-2"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition block">
                  {cat.name}
                </span>
                <span className="text-[10px] text-slate-400">
                  {cat.subcategories.length} subcategorias
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 3. Produtos em Destaque */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
              ★
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Produtos em Destaque
              </h2>
              <p className="text-xs text-slate-500">
                Seleção de artigos com alta procura e entregas prioritárias
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/produtos')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>Explorar</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {featuredProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. High-Impact Callout: "Ganhe Dinheiro como Afiliado" */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="rounded-3xl p-6 sm:p-10 bg-gradient-to-br from-purple-900 via-slate-900 to-blue-950 text-white relative overflow-hidden shadow-xl border border-purple-800/40">
          <div className="relative z-10 max-w-xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-400/30">
              <TrendingUp className="w-3.5 h-3.5" />
              Programa Oficial de Afiliados AngolaMarket
            </span>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ganhe Dinheiro Sem Sair de Casa Divulgando Produtos Angolanos
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Receba até <strong>15% de comissão</strong> por cada venda gerada através do seu link exclusivo. Transfira os seus ganhos diretamente para a sua conta via <strong>Multicaixa Express</strong> ou <strong>IBAN</strong> com total transparência.
            </p>

            <div className="grid grid-cols-3 gap-3 pt-2 pb-2">
              <div className="bg-white/10 rounded-xl p-3 text-center backdrop-blur-xs">
                <span className="block text-base sm:text-lg font-extrabold text-white">Até 15%</span>
                <span className="text-[10px] text-slate-300">Comissão por Venda</span>
              </div>
              <div className="bg-white/10 rounded-xl p-3 text-center backdrop-blur-xs">
                <span className="block text-base sm:text-lg font-extrabold text-white">MCX / IBAN</span>
                <span className="text-[10px] text-slate-300">Levantamento Rápido</span>
              </div>
              <div className="bg-white/10 rounded-xl p-3 text-center backdrop-blur-xs">
                <span className="block text-base sm:text-lg font-extrabold text-white">0 Kz</span>
                <span className="text-[10px] text-slate-300">Cadastro Gratuito</span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => navigate('/afiliados')}
                className="px-6 py-3 rounded-2xl bg-purple-500 hover:bg-purple-600 text-white font-bold text-xs sm:text-sm transition shadow-lg flex items-center gap-2"
              >
                <span>Quero Ser Afiliado</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate('/afiliado/dashboard')}
                className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition"
              >
                Ver Painel de Afiliado
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Super Promoções & Descontos */}
      {onSaleProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold">
                <Percent className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                  Produtos em Promoção
                </h2>
                <p className="text-xs text-slate-500">
                  Preços reduzidos por tempo limitado com entrega garantida
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/produtos')}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
            >
              <span>Ver Promoções</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {onSaleProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* 6. Mais Vendidos em Angola */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Produtos Mais Vendidos
              </h2>
              <p className="text-xs text-slate-500">
                Os artigos favoritos e mais encomendados pelos angolanos
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/produtos')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>Ver Todos</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {bestSellers.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 7. Área para Produtores Locais (Vender na AngolaMarket) */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="rounded-3xl p-6 sm:p-10 bg-slate-900 text-white relative overflow-hidden shadow-lg border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-lg">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              <Briefcase className="w-3.5 h-3.5" />
              Para Lojas, Fabricantes e Produtores Angolanos
            </span>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Venda os Seus Produtos em Toda a Angola
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Conecte a sua marca a milhares de compradores e aproveite o poder do nosso exército de afiliados que divulgam o seu catálogo todos os dias. Você cuida da produção, nós tratamos do marketplace.
            </p>

            <div className="flex flex-wrap gap-4 pt-1 text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Painel exclusivo de vendas
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Gestão simplificada de estoque
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Recebimentos garantidos
              </span>
            </div>
          </div>

          <div className="w-full md:w-auto flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            <button
              onClick={() => navigate('/produtor/dashboard')}
              className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition shadow-lg text-center"
            >
              Aceder ao Painel do Produtor
            </button>
            <button
              onClick={() => navigate('/registar')}
              className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition text-center"
            >
              Criar Conta de Produtor
            </button>
          </div>
        </div>
      </section>

      {/* 8. Delivery Coverage & Prices in Luanda & Provinces */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-600" />
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Tabela Transparente de Entregas em Angola
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Valores oficiais calculados dinamicamente no checkout conforme a sua zona
              </p>
            </div>
            <span className="text-xs font-semibold text-blue-700 bg-blue-100 px-3 py-1 rounded-full shrink-0">
              Taxas Configuráveis
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {deliveryZones.slice(0, 8).map((zone) => (
              <div
                key={zone.id}
                className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">
                      {zone.municipality}
                    </span>
                    <span className="text-[11px] font-extrabold text-blue-600">
                      {formatKz(zone.price)}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                    {zone.zone}
                  </p>
                </div>
                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {zone.estimatedTime}
                  </span>
                  <span className="text-slate-600 font-medium">{zone.province}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. AngolaMarket Core Benefits */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-xl mx-auto mb-8">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Por que escolher a AngolaMarket?
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Construído para simplificar o comércio eletrónico nacional com segurança e proximidade.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center font-bold">
              <CreditCard className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">Multicaixa Express & PayPay</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Pague com os métodos mais utilizados em Angola sem complicações ou riscos.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center font-bold">
              <Truck className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">Entregas em até 24h</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Rede de distribuição rápida em Luanda e rotas interprovinciais organizadas.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center font-bold">
              <Award className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">Apoio a Produtores Nacionais</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Valorizamos o artesanato, café, moda Samakaka e empreendedores de Angola.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 mx-auto flex items-center justify-center font-bold">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">Comissões Transparentes</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Afiliados acompanham cliques, pedidos e saldo em tempo real com levantamento fácil.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
