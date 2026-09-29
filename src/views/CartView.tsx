import React, { useState } from 'react';
import {
  Trash2,
  ArrowRight,
  ShoppingBag,
  Tag,
  Check,
  Truck,
  ShieldCheck,
  ChevronLeft,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CartView: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    deliveryCost,
    discountAmount,
    cartTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    deliveryZones,
    selectedDeliveryZone,
    setSelectedDeliveryZone,
    navigate,
    formatKz,
  } = useStore();

  const [couponCode, setCouponCode] = useState('');
  const [couponMessage, setCouponMessage] = useState<{ text: string; success: boolean } | null>(null);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const res = applyCoupon(couponCode);
    setCouponMessage({ text: res.message, success: res.success });
    if (res.success) setCouponCode('');
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-blue-50 text-blue-600 mx-auto flex items-center justify-center">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-900">O seu carrinho está vazio</h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Aproveite as melhores ofertas em telemóveis, computadores, moda Samakaka e produtos angolanos com entrega rápida.
          </p>
        </div>
        <button
          onClick={() => navigate('/produtos')}
          className="px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition shadow-lg inline-flex items-center gap-2"
        >
          <span>Explorar Catálogo de Produtos</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Carrinho de Compras
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Reveja os seus artigos antes de prosseguir para o checkout seguro
          </p>
        </div>
        <button
          onClick={() => navigate('/produtos')}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Continuar a Comprar</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-xs divide-y divide-slate-100 overflow-hidden">
            {cart.map((item) => {
              const effectivePrice = item.product.promoPrice || item.product.price;
              const itemTotal = effectivePrice * item.quantity;

              return (
                <div
                  key={item.product.id}
                  className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-20 h-20 rounded-2xl object-cover shrink-0 bg-slate-50 border border-slate-100"
                    />
                    <div>
                      <span className="text-[11px] font-semibold text-blue-600 uppercase">
                        {item.product.categoryName}
                      </span>
                      <h3
                        onClick={() => navigate(`/produto/${item.product.slug}`)}
                        className="text-sm font-bold text-slate-900 hover:text-blue-600 cursor-pointer line-clamp-2"
                      >
                        {item.product.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Preço unitário: {formatKz(effectivePrice)}
                      </p>
                      {item.affiliateRef && (
                        <span className="inline-block mt-1 text-[10px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded font-mono font-bold">
                          Ref Afiliado: {item.affiliateRef}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity & Item Subtotal */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                    <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-lg bg-white text-slate-700 hover:bg-slate-100 font-bold text-xs flex items-center justify-center shadow-xs"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-bold text-xs text-slate-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-lg bg-white text-slate-700 hover:bg-slate-100 font-bold text-xs flex items-center justify-center shadow-xs"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right min-w-[100px]">
                      <span className="text-sm font-extrabold text-slate-900 block">
                        {formatKz(itemTotal)}
                      </span>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 transition"
                      title="Remover do carrinho"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Summary & Coupon */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-5">
            <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
              Resumo do Pedido
            </h3>

            {/* Delivery Zone Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-blue-600" />
                <span>Zona de Entrega em Angola:</span>
              </label>
              <select
                value={selectedDeliveryZone?.id || ''}
                onChange={(e) => {
                  const z = deliveryZones.find((dz) => dz.id === e.target.value);
                  if (z) setSelectedDeliveryZone(z);
                }}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                {deliveryZones.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.province} - {z.municipality} ({formatKz(z.price)})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-500 mt-1">
                Estimativa: {selectedDeliveryZone?.estimatedTime || '24h - 48h'}
              </p>
            </div>

            {/* Coupon Code Input */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-blue-600" />
                <span>Cupom de Desconto:</span>
              </label>

              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>{appliedCoupon.code} aplicado</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-rose-600 hover:underline font-semibold"
                  >
                    Remover
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Ex: BEMVINDO10"
                    className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 font-mono uppercase focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition"
                  >
                    Aplicar
                  </button>
                </form>
              )}

              {couponMessage && (
                <p
                  className={`text-[11px] mt-1.5 font-medium ${
                    couponMessage.success ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {couponMessage.text}
                </p>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-2.5 pt-3 border-t border-slate-100 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal dos Produtos:</span>
                <span className="font-semibold text-slate-900">{formatKz(cartSubtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Desconto Aplicado:</span>
                  <span>-{formatKz(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Taxa de Entrega ({selectedDeliveryZone?.municipality || 'Luanda'}):</span>
                <span className="font-semibold text-slate-900">{formatKz(deliveryCost)}</span>
              </div>

              <div className="flex justify-between text-base font-extrabold text-slate-900 pt-3 border-t border-slate-200">
                <span>Total a Pagar:</span>
                <span className="text-blue-600">{formatKz(cartTotal)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg transition"
            >
              <span>Finalizar Pedido</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Security assurance */}
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 text-center">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Pagamento seguro via Multicaixa Express ou PayPay</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
