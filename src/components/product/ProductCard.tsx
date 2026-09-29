import React, { useState } from 'react';
import { Star, ShoppingCart, Heart, TrendingUp, Share2, Check } from 'lucide-react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { AffiliateLinkModal } from './AffiliateLinkModal';

interface Props {
  product: Product;
  showAffiliateCommission?: boolean;
}

export const ProductCard: React.FC<Props> = ({
  product,
  showAffiliateCommission = false,
}) => {
  const {
    navigate,
    addToCart,
    formatKz,
    favorites,
    toggleFavorite,
    currentUser,
  } = useStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const isFav = favorites.includes(product.id);
  const effectivePrice = product.promoPrice || product.price;
  const commissionKz = Math.round((effectivePrice * (product.affiliateCommissionPercent || 10)) / 100);

  const isAffiliateUser = currentUser?.role === 'affiliate' || showAffiliateCommission;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const handleCardClick = () => {
    navigate(`/produto/${product.slug}`);
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className="group bg-white rounded-2xl border border-slate-100 shadow-xs hover:shadow-xl hover:border-blue-200 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer relative"
      >
        {/* Top Badges & Wishlist */}
        <div className="relative aspect-square w-full bg-slate-50 overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />

          {/* Discount Tag */}
          {product.discountPercent && product.discountPercent > 0 && (
            <span className="absolute top-2.5 left-2.5 bg-rose-600 text-white text-[11px] font-extrabold px-2 py-0.5 rounded-full shadow-xs">
              -{product.discountPercent}%
            </span>
          )}

          {/* Feito em Angola or Best Seller Badge */}
          {product.categoryId === 'cat-feito-angola' && (
            <span className="absolute top-2.5 right-2.5 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
              Feito em Angola
            </span>
          )}

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(product.id);
            }}
            className={`absolute bottom-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition ${
              isFav
                ? 'bg-rose-50 text-rose-600'
                : 'bg-white/80 text-slate-500 hover:text-rose-600 hover:bg-white'
            }`}
            aria-label="Guardar nos favoritos"
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-600' : ''}`} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            {/* Category & Rating */}
            <div className="flex items-center justify-between gap-1 text-[11px] text-slate-400 mb-1.5">
              <span className="font-semibold text-blue-600 uppercase tracking-wide truncate">
                {product.categoryName}
              </span>
              <div className="flex items-center gap-1 text-slate-700 font-semibold shrink-0">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{product.rating.toFixed(1)}</span>
                <span className="text-slate-400 text-[10px]">({product.reviewCount})</span>
              </div>
            </div>

            {/* Product Title */}
            <h3 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
              {product.name}
            </h3>

            {/* Producer info */}
            <p className="text-[11px] text-slate-400 mt-1 truncate">
              Por: <span className="text-slate-600 font-medium">{product.producerName}</span>
            </p>
          </div>

          <div className="mt-3">
            {/* Affiliate Commission Callout Box if Affiliate or explicit */}
            {isAffiliateUser && (
              <div className="mb-2 p-1.5 rounded-xl bg-purple-50 border border-purple-200/80 flex items-center justify-between gap-1 text-[11px]">
                <div className="flex items-center gap-1 text-purple-800 font-bold truncate">
                  <TrendingUp className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  <span>Comissão: +{formatKz(commissionKz)}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setModalOpen(true);
                  }}
                  className="px-2 py-0.5 rounded-lg bg-purple-600 text-white font-bold text-[10px] hover:bg-purple-700 transition shrink-0"
                  title="Gerar link de afiliado deste produto"
                >
                  Link
                </button>
              </div>
            )}

            {/* Pricing Section */}
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-base font-extrabold text-slate-900">
                {formatKz(effectivePrice)}
              </span>
              {product.promoPrice && (
                <span className="text-xs text-slate-400 line-through">
                  {formatKz(product.price)}
                </span>
              )}
            </div>

            {/* Action Button: Add to Cart */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                  product.stock === 0
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : addedAnimation
                    ? 'bg-emerald-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                }`}
              >
                {product.stock === 0 ? (
                  <span>Esgotado</span>
                ) : addedAnimation ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Adicionado!</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Adicionar</span>
                  </>
                )}
              </button>

              {/* Share / Affiliate link button shortcut */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setModalOpen(true);
                }}
                className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-blue-600 hover:bg-slate-50 transition"
                title="Partilhar ou gerar link de afiliado"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Affiliate Link Generation Modal */}
      {modalOpen && (
        <AffiliateLinkModal product={product} onClose={() => setModalOpen(false)} />
      )}
    </>
  );
};
