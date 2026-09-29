import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  ShieldCheck,
  CreditCard,
  Truck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Smartphone,
  Building,
  Banknote,
  AlertCircle,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { PaymentMethod } from '../types';

export const CheckoutView: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    deliveryCost,
    discountAmount,
    cartTotal,
    selectedDeliveryZone,
    deliveryZones,
    setSelectedDeliveryZone,
    createOrder,
    navigate,
    formatKz,
    currentUser,
    platformSettings,
  } = useStore();

  const [fullName, setFullName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '+244 923 ');
  const [whatsapp, setWhatsapp] = useState(currentUser?.whatsapp || '+244 923 ');
  const [province, setProvince] = useState(selectedDeliveryZone?.province || 'Luanda');
  const [municipality, setMunicipality] = useState(selectedDeliveryZone?.municipality || 'Talatona');
  const [neighborhood, setNeighborhood] = useState('Morro Bento');
  const [address, setAddress] = useState('Rua Principal, Casa 12');
  const [referencePoint, setReferencePoint] = useState('Próximo à bomba de combustível Sonangol');
  const [notes, setNotes] = useState('');

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Multicaixa Express');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (cart.length === 0) {
    navigate('/carrinho');
    return null;
  }

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim() || !phone.trim() || !address.trim() || !neighborhood.trim()) {
      setErrorMessage('Por favor preencha todos os campos obrigatórios de entrega.');
      return;
    }

    setIsSubmitting(true);

    try {
      const order = createOrder({
        customerName: fullName.trim(),
        customerPhone: phone.trim(),
        customerWhatsapp: whatsapp.trim() || phone.trim(),
        province,
        municipality,
        neighborhood: neighborhood.trim(),
        address: address.trim(),
        referencePoint: referencePoint.trim(),
        notes: notes.trim(),
        paymentMethod,
      });

      // Celebration confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // fallback
      }

      // Navigate to order tracking view
      navigate(`/pedido/${order.id}`);
    } catch (err) {
      console.error(err);
      setErrorMessage('Ocorreu um erro ao processar o seu pedido. Tente novamente.');
      setIsSubmitting(false);
    }
  };

  const enabledMethods = platformSettings.enabledPaymentMethods;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Finalizar Pedido (Checkout)
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Informe os seus dados de entrega em Angola e escolha a forma de pagamento segura
        </p>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Customer & Address Information */}
        <div className="lg:col-span-8 space-y-6">
          {/* Contact Details */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                1
              </span>
              <h2 className="text-sm font-bold text-slate-900">
                Informações de Contacto
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ex: Ana Paula dos Santos"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Número de Telefone (Chamadas) *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+244 923 000 000"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Número de WhatsApp (Para atualizações da entrega)
                </label>
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="+244 923 000 000"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                2
              </span>
              <h2 className="text-sm font-bold text-slate-900">
                Endereço de Entrega
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Província *
                </label>
                <select
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Luanda">Luanda</option>
                  <option value="Benguela">Benguela</option>
                  <option value="Huambo">Huambo</option>
                  <option value="Huíla">Huíla</option>
                  <option value="Cabinda">Cabinda</option>
                  <option value="Cuanza Sul">Cuanza Sul</option>
                  <option value="Outra Província">Outra Província</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Município / Zona *
                </label>
                <select
                  value={municipality}
                  onChange={(e) => {
                    const mun = e.target.value;
                    setMunicipality(mun);
                    const matching = deliveryZones.find((z) => z.municipality === mun);
                    if (matching) setSelectedDeliveryZone(matching);
                  }}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                >
                  {deliveryZones.map((z) => (
                    <option key={z.id} value={z.municipality}>
                      {z.municipality} ({formatKz(z.price)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Bairro *
                </label>
                <input
                  type="text"
                  required
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  placeholder="Ex: Talatona, Morro Bento, Golfe 2, Maianga..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Endereço Detalhado (Rua, Prédio, Casa) *
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Ex: Rua 21 de Janeiro, Prédio C, Apto 14"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ponto de Referência
                </label>
                <input
                  type="text"
                  value={referencePoint}
                  onChange={(e) => setReferencePoint(e.target.value)}
                  placeholder="Ex: Próximo à farmácia, defronte ao colégio..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Observações para a entrega
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ex: Ligar 15 minutos antes de chegar"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                3
              </span>
              <h2 className="text-sm font-bold text-slate-900">
                Forma de Pagamento em Angola
              </h2>
            </div>

            <div className="space-y-2.5">
              {/* Multicaixa Express */}
              {enabledMethods.multicaixaExpress && (
                <label
                  className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition ${
                    paymentMethod === 'Multicaixa Express'
                      ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'Multicaixa Express'}
                    onChange={() => setPaymentMethod('Multicaixa Express')}
                    className="mt-1 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">
                        Multicaixa Express (MCX)
                      </span>
                      <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                        Mais Utilizado
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Confirme o pagamento diretamente no seu aplicativo Multicaixa Express com o seu número de telemóvel.
                    </p>
                  </div>
                </label>
              )}

              {/* PayPay */}
              {enabledMethods.payPay && (
                <label
                  className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition ${
                    paymentMethod === 'PayPay'
                      ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'PayPay'}
                    onChange={() => setPaymentMethod('PayPay')}
                    className="mt-1 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <span className="text-xs font-bold text-slate-900">
                      PayPay Angola
                    </span>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Pagamento rápido e seguro utilizando a carteira digital PayPay Angola.
                    </p>
                  </div>
                </label>
              )}

              {/* Transferência Bancária */}
              {enabledMethods.bankTransfer && (
                <label
                  className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition ${
                    paymentMethod === 'Transferência bancária'
                      ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'Transferência bancária'}
                    onChange={() => setPaymentMethod('Transferência bancária')}
                    className="mt-1 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <span className="text-xs font-bold text-slate-900">
                      Transferência Bancária (IBAN BAI / BFA)
                    </span>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Transferência por internet banking ou multicaixa. As coordenadas serão fornecidas no final.
                    </p>
                  </div>
                </label>
              )}

              {/* Pagamento na Entrega */}
              {enabledMethods.cashOnDelivery && (
                <label
                  className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition ${
                    paymentMethod === 'Pagamento na entrega'
                      ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'Pagamento na entrega'}
                    onChange={() => setPaymentMethod('Pagamento na entrega')}
                    className="mt-1 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <span className="text-xs font-bold text-slate-900">
                      Pagamento na Entrega (TPA ou Numerário)
                    </span>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Pague no momento da recepção do produto via cartão pelo terminal TPA do estafeta ou dinheiro vivo.
                    </p>
                  </div>
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Right: Order Summary Breakdown */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
              Produtos ({cart.reduce((t, i) => t + i.quantity, 0)})
            </h3>

            {/* Items mini list */}
            <div className="space-y-3 max-h-56 overflow-y-auto pr-1 divide-y divide-slate-50">
              {cart.map((item) => {
                const itemPrice = item.product.promoPrice || item.product.price;
                return (
                  <div key={item.product.id} className="pt-2 flex items-center gap-3">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-12 h-12 rounded-xl object-cover bg-slate-50 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {item.product.name}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {item.quantity}x {formatKz(itemPrice)}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-slate-900 shrink-0">
                      {formatKz(itemPrice * item.quantity)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Cost breakdown */}
            <div className="space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-semibold text-slate-900">{formatKz(cartSubtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Desconto:</span>
                  <span>-{formatKz(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Taxa de Entrega ({municipality}):</span>
                <span className="font-semibold text-slate-900">{formatKz(deliveryCost)}</span>
              </div>

              <div className="flex justify-between text-base font-extrabold text-slate-900 pt-3 border-t border-slate-200">
                <span>Total Final:</span>
                <span className="text-blue-600">{formatKz(cartTotal)}</span>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg transition disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              <span>{isSubmitting ? 'A Processar...' : 'Confirmar e Finalizar Encomenda'}</span>
            </button>

            <div className="p-3 rounded-2xl bg-slate-50 text-[11px] text-slate-500 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Garantia AngolaMarket</span>
              </div>
              <p>Receba exatamente o que encomendou ou tenha o seu reembolso garantido.</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
