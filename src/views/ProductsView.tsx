import React, { useState, useMemo } from 'react';
import {
  Filter,
  SlidersHorizontal,
  X,
  Search,
  Star,
  Tag,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/product/ProductCard';

interface Props {
  initialCategorySlug?: string;
  initialSearchQuery?: string;
}

export const ProductsView: React.FC<Props> = ({
  initialCategorySlug,
  initialSearchQuery = '',
}) => {
  const { products, categories, formatKz, currentUser } = useStore();

  const [search, setSearch] = useState(initialSearchQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialCategorySlug || 'all'
  );
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [onlyPromotions, setOnlyPromotions] = useState(false);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [minRating, setMinRating] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(450000);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [showAffiliateCommissions, setShowAffiliateCommissions] = useState(
    currentUser?.role === 'affiliate'
  );

  const activeCategoryObj = categories.find((c) => c.slug === selectedCategory);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => p.isApproved)
      .filter((p) => {
        // Search filter
        if (search.trim()) {
          const q = search.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          const matchCat = p.categoryName.toLowerCase().includes(q);
          const matchProd = p.producerName.toLowerCase().includes(q);
          if (!matchName && !matchDesc && !matchCat && !matchProd) return false;
        }

        // Category filter
        if (selectedCategory !== 'all') {
          const cat = categories.find((c) => c.slug === selectedCategory);
          if (cat && p.categoryId !== cat.id) return false;
        }

        // Subcategory filter
        if (selectedSubcategory !== 'all' && p.subcategory !== selectedSubcategory) {
          return false;
        }

        // Promo only
        if (onlyPromotions && !p.promoPrice) return false;

        // In stock only
        if (onlyInStock && p.stock <= 0) return false;

        // Rating
        if (minRating > 0 && p.rating < minRating) return false;

        // Price
        const effectivePrice = p.promoPrice || p.price;
        if (effectivePrice > maxPrice) return false;

        return true;
      })
      .sort((a, b) => {
        const priceA = a.promoPrice || a.price;
        const priceB = b.promoPrice || b.price;

        if (sortBy === 'price_asc') return priceA - priceB;
        if (sortBy === 'price_desc') return priceB - priceA;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'bestseller') return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
        return 0; // default order
      });
  }, [
    products,
    search,
    selectedCategory,
    selectedSubcategory,
    onlyPromotions,
    onlyInStock,
    minRating,
    maxPrice,
    sortBy,
    categories,
  ]);

  const clearAllFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setSelectedSubcategory('all');
    setOnlyPromotions(false);
    setOnlyInStock(false);
    setMinRating(0);
    setMaxPrice(450000);
    setSortBy('featured');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-100 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            {activeCategoryObj ? activeCategoryObj.name : 'Catálogo de Produtos'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'produto encontrado' : 'produtos encontrados'} em Angola
          </p>
        </div>

        {/* Affiliate Commission Mode Toggle + Sort */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowAffiliateCommissions(!showAffiliateCommissions)}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition border ${
              showAffiliateCommissions
                ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                : 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
            }`}
            title="Exibir estimativa de comissão para afiliados em cada produto"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{showAffiliateCommissions ? 'Modo Afiliado Ativo' : 'Ver Comissões'}</span>
          </button>

          <button
            onClick={() => setMobileFilterOpen(true)}
            className="md:hidden px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 flex items-center gap-1.5"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filtros</span>
          </button>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-50 border border-slate-200 text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          >
            <option value="featured">Destaques</option>
            <option value="bestseller">Mais Vendidos</option>
            <option value="rating">Melhor Avaliados</option>
            <option value="price_asc">Menor Preço</option>
            <option value="price_desc">Maior Preço</option>
          </select>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Desktop Sidebar Filters */}
        <aside className="w-64 shrink-0 hidden md:block space-y-6 bg-white p-5 rounded-3xl border border-slate-100 shadow-xs h-fit sticky top-28">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-sm text-slate-900">Filtros</h3>
            </div>
            <button
              onClick={clearAllFilters}
              className="text-[11px] font-semibold text-rose-600 hover:underline"
            >
              Limpar
            </button>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Categoria
            </h4>
            <div className="space-y-1 text-xs">
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedSubcategory('all');
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg transition ${
                  selectedCategory === 'all'
                    ? 'bg-blue-50 text-blue-700 font-bold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                Todas as Categorias
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setSelectedCategory(c.slug);
                    setSelectedSubcategory('all');
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg transition ${
                    selectedCategory === c.slug
                      ? 'bg-blue-50 text-blue-700 font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Subcategories (if active) */}
          {activeCategoryObj && activeCategoryObj.subcategories.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Subcategoria
              </h4>
              <div className="space-y-1 text-xs">
                <button
                  onClick={() => setSelectedSubcategory('all')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg transition ${
                    selectedSubcategory === 'all'
                      ? 'bg-blue-50 text-blue-700 font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Todas
                </button>
                {activeCategoryObj.subcategories.map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setSelectedSubcategory(sub)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg transition ${
                      selectedSubcategory === sub
                        ? 'bg-blue-50 text-blue-700 font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Price Range Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Preço Máximo
              </h4>
              <span className="text-xs font-bold text-blue-600">
                {formatKz(maxPrice)}
              </span>
            </div>
            <input
              type="range"
              min={10000}
              max={450000}
              step={10000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          {/* Checkbox Options */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyPromotions}
                onChange={(e) => setOnlyPromotions(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span>Apenas Promoções</span>
            </label>

            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span>Em Estoque Imediato</span>
            </label>
          </div>

          {/* Star Rating Filter */}
          <div className="pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Classificação
            </h4>
            <div className="space-y-1 text-xs">
              {[4, 3].map((stars) => (
                <button
                  key={stars}
                  onClick={() => setMinRating(minRating === stars ? 0 : stars)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition ${
                    minRating === stars ? 'bg-amber-50 text-amber-900 font-bold' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{stars} estrelas ou mais</span>
                  </div>
                  {minRating === stars && <span className="text-[10px]">✓</span>}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <main className="flex-1">
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-xs space-y-4">
              <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 mx-auto flex items-center justify-center">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Nenhum produto encontrado
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Não encontramos produtos que correspondam a todos os filtros selecionados. Tente ajustar os critérios de pesquisa.
              </p>
              <button
                onClick={clearAllFilters}
                className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition"
              >
                Limpar Todos os Filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  showAffiliateCommission={showAffiliateCommissions}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filters Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
          <div className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto space-y-5 animate-in slide-in-from-bottom">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Filtros de Pesquisa</h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Categories */}
            <div>
              <p className="text-xs font-bold text-slate-700 uppercase mb-2">Categoria</p>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                    selectedCategory === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  Todas
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.slug)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                      selectedCategory === c.slug
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-2">
                <span>Preço Máximo:</span>
                <span className="text-blue-600">{formatKz(maxPrice)}</span>
              </div>
              <input
                type="range"
                min={10000}
                max={450000}
                step={10000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>

            <div className="flex gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={clearAllFilters}
                className="flex-1 py-3 rounded-2xl bg-slate-100 text-slate-700 text-xs font-bold"
              >
                Limpar
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-3 rounded-2xl bg-blue-600 text-white text-xs font-bold shadow-md"
              >
                Ver {filteredProducts.length} Resultados
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
