import React, { useState } from 'react';
import { X, Copy, Check, Share2, MessageCircle, TrendingUp, Sparkles } from 'lucide-react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';

interface Props {
  product: Product;
  onClose: () => void;
}

export const AffiliateLinkModal: React.FC<Props> = ({ product, onClose }) => {
  const { currentUser, formatKz, recordAffiliateClick } = useStore();
  const [copied, setCopied] = useState(false);

  // If user has an affiliate code, use it. Otherwise fallback to demo affiliate or prompt
  const affiliateCode = currentUser?.affiliateCode || 'AF88492';
  const effectivePrice = product.promoPrice || product.price;
  const commPercent = product.affiliateCommissionPercent || 10;
  const commissionAmount = Math.round((effectivePrice * commPercent) / 100);

  const fullUrl = `${window.location.origin}/produto/${product.slug}?ref=${affiliateCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    recordAffiliateClick(affiliateCode, product.id);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const text = `🔥 *Oferta Especial na AngolaMarket!* \n\n*${product.name}*\n💰 De ${formatKz(product.price)} por apenas *${formatKz(effectivePrice)}*!\n\n🚚 Entregas rápidas em Luanda e províncias com pagamento por Multicaixa Express e PayPay.\n\n👉 Compre através do meu link exclusivo:\n${fullUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    recordAffiliateClick(affiliateCode, product.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl relative border border-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Link de Afiliado Oficial</h3>
            <p className="text-xs text-slate-500">Divulgue e ganhe comissões automáticas</p>
          </div>
        </div>

        {/* Product Snapshot & Commission Box */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 mb-4 flex items-center gap-3">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-14 h-14 rounded-lg object-cover shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-900 truncate">{product.name}</p>
            <p className="text-xs text-slate-500 mt-0.5">Preço: {formatKz(effectivePrice)}</p>
            <div className="mt-1 flex items-center gap-1.5 text-xs font-extrabold text-purple-700">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>Ganha {formatKz(commissionAmount)} ({commPercent}%) por venda!</span>
            </div>
          </div>
        </div>

        {/* Your Affiliate Code */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            O seu Código de Afiliado:
          </label>
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-bold bg-purple-50 text-purple-800 px-3 py-1.5 rounded-lg border border-purple-200">
              {affiliateCode}
            </span>
            <span className="text-[11px] text-slate-500">
              (Rastreamento automático de cookies e checkout)
            </span>
          </div>
        </div>

        {/* Affiliate Link Input & Copy */}
        <div className="mb-5">
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Link Promocional Personalizado:
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={fullUrl}
              className="flex-1 px-3 py-2 text-xs bg-slate-100 rounded-xl border border-slate-200 text-slate-700 font-mono select-all focus:outline-hidden"
            />
            <button
              onClick={handleCopyLink}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Action Buttons: WhatsApp Share */}
        <div className="space-y-2">
          <button
            onClick={handleWhatsAppShare}
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Divulgar no WhatsApp com Texto Pronto</span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-2 px-4 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
