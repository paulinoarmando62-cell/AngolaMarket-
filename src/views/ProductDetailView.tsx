import React, { useState } from 'react';
import {
  Star,
  ShoppingCart,
  Zap,
  TrendingUp,
  MessageCircle,
  Truck,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  Clock,
  MapPin,
  Share2,
  Heart,
  ChevronRight,
  Info,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/product/ProductCard';
import { AffiliateLinkModal } from '../components/product/AffiliateLinkModal';

interface Props {
  slug: string;
}

export const ProductDetailView: React.FC<Props> = ({ slug }) => {
  const {
    products,
    categories,
    addToCart,
    navigate,
    formatKz,
    deliveryZones,
    reviews,
    addReview,
    currentUser,
    favorites,
    toggleFavorite,
    platformSettings,
  } = useStore();

  const product = products.find((p) => p.slug === slug) || products[0];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedZoneId, setSelectedZoneId] = useState(deliveryZones[0]?.id || '');
  const [affiliateModalOpen, setAffiliateModalOpen] = useState(false);

  // Review form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const effectivePrice = product.promoPrice || product.price;
  const isFav = favorites.includes(product.id);
  const productReviews = reviews.filter((r) => r.productId === product.id);

  const selectedZone = deliveryZones.find((z) => z.id === selectedZoneId) || deliveryZones[0];

  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.categoryId === product.categoryId)
    .slice(0, 4);

  const isAffiliate = currentUser?.role === 'affiliate';
  const commissionAmount = Math.round(
    (effectivePrice * (product.affiliateCommissionPercent || 10)) / 100
  );

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    addReview({
      productId: product.id,
      userId: currentUser?.id || `user-guest-${Date.now()}`,
      userName: currentUser?.name || 'Cliente Verificado',
      rating: reviewRating,
      comment: reviewComment.trim(),
      isVerifiedPurchase: true,
    });
    setReviewComment('');
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 3000);
  };

  // WhatsApp Actions
  const handleContactProducer = () => {
    const phone = (product.producerWhatsapp || product.producerPhone || platformSettings.contactWhatsapp)
      .replace(/\s+/g, '')
      .replace('+', '');
    const message = encodeURIComponent(
      `Olá! Tenho interesse no produto "${product.name}" anunciado na AngolaMarket. Poderia tirar algumas dúvidas?`
    );
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  const handleContactSupport = () => {
    const phone = platformSettings.contactWhatsapp.replace(/\s+/g, '').replace('+', '');
    const message = encodeURIComponent(
      `Olá AngolaMarket! Preciso de ajuda relativamente ao produto "${product.name}" (Ref: ${product.id}).`
    );
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <button onClick={() => navigate('/')} className="hover:text-blue-600">
          Início
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <button
          onClick={() => navigate(`/categoria/${product.categoryId}`)}
          className="hover:text-blue-600"
        >
          {product.categoryName}
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-800 font-semibold truncate max-w-[200px] sm:max-w-md">
          {product.name}
        </span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left: Product Images Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-square w-full rounded-3xl overflow-hidden bg-slate-50 border border-slate-100 shadow-xs relative">
            <img
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.discountPercent && product.discountPercent > 0 && (
              <span className="absolute top-4 left-4 bg-rose-600 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-md">
                -{product.discountPercent}% DESCONTO
              </span>
            )}
            <button
              onClick={() => toggleFavorite(product.id)}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 backdrop-blur-md shadow-md hover:bg-white text-slate-600 hover:text-rose-600 transition"
              aria-label="Favoritar"
            >
              <Heart className={`w-5 h-5 ${isFav ? 'fill-rose-600 text-rose-600' : ''}`} />
            </button>
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 shrink-0 transition ${
                    activeImageIndex === idx ? 'border-blue-600 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details & Purchase Actions */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                {product.categoryName}
              </span>
              {product.stock > 0 ? (
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Em estoque ({product.stock} disponíveis)
                </span>
              ) : (
                <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full">
                  Esgotado
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 leading-tight">
              {product.name}
            </h1>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-3 mt-2.5">
              <div className="flex items-center gap-1 text-amber-500">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= Math.round(product.rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-slate-700">
                {product.rating.toFixed(1)}
              </span>
              <span className="text-xs text-slate-400">
                • {product.reviewCount} avaliações de clientes
              </span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-xs text-slate-500 font-medium">Preço em Kwanzas:</span>
            <div className="flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {formatKz(effectivePrice)}
              </span>
              {product.promoPrice && (
                <span className="text-sm text-slate-400 line-through">
                  {formatKz(product.price)}
                </span>
              )}
            </div>
          </div>

          {/* Affiliate Highlight Banner (Prominently displayed) */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-900 to-indigo-950 text-white shadow-md space-y-2 border border-purple-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-300" />
                <span className="text-xs font-bold tracking-wide uppercase text-purple-200">
                  Ganhos de Afiliado AngolaMarket
                </span>
              </div>
              <span className="text-xs font-extrabold bg-purple-500/30 text-purple-200 px-2 py-0.5 rounded-full border border-purple-400/30">
                {product.affiliateCommissionPercent}% Comissão
              </span>
            </div>
            <p className="text-sm font-extrabold text-white">
              Ganhe <span className="text-amber-300">{formatKz(commissionAmount)}</span> por cada venda deste produto!
            </p>
            <p className="text-[11px] text-purple-200 leading-snug">
              Basta partilhar o seu link exclusivo. Quando o cliente comprar, a comissão é creditada na sua conta de afiliado.
            </p>
            <button
              onClick={() => setAffiliateModalOpen(true)}
              className="mt-2 w-full py-2.5 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-xs"
            >
              <Share2 className="w-4 h-4" />
              <span>Gerar Meu Link de Afiliado</span>
            </button>
          </div>

          {/* Producer / Seller Details */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                {product.producerName.charAt(0)}
              </div>
              <div>
                <p className="text-[11px] text-slate-400">Vendido e enviado por:</p>
                <p className="text-xs font-bold text-slate-900">{product.producerName}</p>
                <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {product.pickupAddress || 'Luanda, Angola'}
                </p>
              </div>
            </div>

            <button
              onClick={handleContactProducer}
              className="px-3 py-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold flex items-center gap-1.5 transition border border-emerald-200 shrink-0"
              title="Falar diretamente com o produtor no WhatsApp"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Contactar Vendedor</span>
            </button>
          </div>

          {/* Purchase Actions (Quantity + Buttons) */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-700">Quantidade:</span>
              <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-lg bg-white text-slate-700 hover:bg-slate-100 font-bold text-sm flex items-center justify-center shadow-xs"
                >
                  -
                </button>
                <span className="w-10 text-center font-bold text-sm text-slate-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-8 h-8 rounded-lg bg-white text-slate-700 hover:bg-slate-100 font-bold text-sm flex items-center justify-center shadow-xs"
                >
                  +
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="py-3.5 px-6 rounded-2xl bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-bold text-sm flex items-center justify-center gap-2 transition"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Adicionar ao Carrinho</span>
              </button>

              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>Comprar Agora</span>
              </button>
            </div>
          </div>

          {/* Interactive Delivery Calculator (Luanda / Provinces) */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-600" />
                <h4 className="text-xs font-bold text-slate-900">
                  Calcular Custo & Prazo de Entrega
                </h4>
              </div>
              <span className="text-[11px] text-blue-600 font-medium">Angola</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <select
                value={selectedZoneId}
                onChange={(e) => setSelectedZoneId(e.target.value)}
                className="flex-1 px-3 py-2 text-xs rounded-xl bg-white border border-slate-200 text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                {deliveryZones.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.province} — {z.municipality} ({formatKz(z.price)})
                  </option>
                ))}
              </select>
            </div>

            {selectedZone && (
              <div className="p-3 bg-white rounded-xl border border-slate-100 text-xs flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900">
                    Custo de envio: {formatKz(selectedZone.price)}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Prazo estimado: {selectedZone.estimatedTime}
                  </p>
                </div>
                <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-1 rounded-md">
                  {selectedZone.municipality}
                </span>
              </div>
            )}
          </div>

          {/* Direct Support via WhatsApp */}
          <div className="pt-1 flex items-center justify-between text-xs text-slate-500">
            <span>Dúvidas antes de encomendar?</span>
            <button
              onClick={handleContactSupport}
              className="text-emerald-600 font-bold hover:underline flex items-center gap-1"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Falar com AngolaMarket
            </button>
          </div>
        </div>
      </div>

      {/* Description & Technical Specs */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-4">
        <h3 className="text-lg font-bold text-slate-900">Descrição do Produto</h3>
        <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
          {product.description}
        </p>

        <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-slate-50">
            <span className="text-slate-400 block mb-0.5">Categoria Oficial</span>
            <span className="font-bold text-slate-800">{product.categoryName}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50">
            <span className="text-slate-400 block mb-0.5">Subcategoria</span>
            <span className="font-bold text-slate-800">{product.subcategory || 'Geral'}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50">
            <span className="text-slate-400 block mb-0.5">Disponibilidade</span>
            <span className="font-bold text-emerald-700">Pronta Entrega em Luanda</span>
          </div>
        </div>
      </section>

      {/* Customer Reviews & Submit Review */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Avaliações de Clientes ({productReviews.length})
            </h3>
            <p className="text-xs text-slate-500">
              Opiniões verificadas de quem comprou e testou este produto em Angola
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            <span className="text-2xl font-extrabold text-slate-900">{product.rating.toFixed(1)}</span>
            <span className="text-xs text-slate-400">/ 5.0</span>
          </div>
        </div>

        {/* Existing Reviews List */}
        <div className="space-y-4">
          {productReviews.length === 0 ? (
            <p className="text-xs text-slate-400 italic">
              Este produto ainda não possui avaliações. Seja o primeiro a avaliar!
            </p>
          ) : (
            productReviews.map((rev) => (
              <div key={rev.id} className="p-4 rounded-2xl bg-slate-50 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{rev.userName}</span>
                    {rev.isVerifiedPurchase && (
                      <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-100 px-2 py-0.2 rounded-full">
                        Compra Verificada
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400">{rev.date}</span>
                </div>
                <div className="flex items-center gap-1 text-amber-400">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3.5 h-3.5 ${s <= rev.rating ? 'fill-amber-400' : 'text-slate-200'}`}
                    />
                  ))}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
              </div>
            ))
          )}
        </div>

        {/* Submit Review Form */}
        <div className="pt-6 border-t border-slate-100">
          <h4 className="text-sm font-bold text-slate-900 mb-3">Deixe a sua Avaliação</h4>
          {reviewSubmitted ? (
            <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold">
              Obrigado pela sua avaliação! Foi adicionada com sucesso.
            </div>
          ) : (
            <form onSubmit={handleReviewSubmit} className="space-y-3 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-600">Sua classificação:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="p-1"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= reviewRating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Conte o que achou da qualidade, entrega e atendimento..."
                rows={3}
                className="w-full p-3 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs"
              >
                Publicar Avaliação
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="space-y-5">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900">
            Produtos Relacionados
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Affiliate Link Generation Modal */}
      {affiliateModalOpen && (
        <AffiliateLinkModal product={product} onClose={() => setAffiliateModalOpen(false)} />
      )}
    </div>
  );
};
