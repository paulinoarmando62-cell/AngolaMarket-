import React from 'react';
import {
  CheckCircle2,
  Clock,
  Truck,
  Package,
  CreditCard,
  MapPin,
  MessageCircle,
  ArrowLeft,
  Copy,
  Check,
  AlertCircle,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { OrderStatus } from '../types';

interface Props {
  orderId: string;
}

export const OrderDetailView: React.FC<Props> = ({ orderId }) => {
  const { orders, formatKz, navigate, platformSettings } = useStore();
  const [copiedRef, setCopiedRef] = React.useState(false);

  const order = orders.find((o) => o.id === orderId) || orders[0];

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Pedido não encontrado</h2>
        <button
          onClick={() => navigate('/meus-pedidos')}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
        >
          Ver Meus Pedidos
        </button>
      </div>
    );
  }

  const orderSteps: OrderStatus[] = [
    'Pedido recebido',
    'Pagamento confirmado',
    'Em preparação',
    'Em entrega',
    'Entregue',
  ];

  const currentStepIndex = order.status === 'Cancelado'
    ? -1
    : orderSteps.findIndex((step) => {
        if (order.status === 'Pagamento pendente') return step === 'Pedido recebido';
        if (order.status === 'Aguardando recolha') return step === 'Em preparação';
        return step === order.status;
      });

  const handleCopyReference = () => {
    if (order.paymentReference) {
      navigator.clipboard.writeText(order.paymentReference);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    }
  };

  const handleWhatsAppSendOrder = () => {
    const phone = platformSettings.contactWhatsapp.replace(/\s+/g, '').replace('+', '');
    const itemsText = order.items.map((i) => `• ${i.quantity}x ${i.productName} (${formatKz(i.price)})`).join('\n');
    const msg = `*Novo Pedido AngolaMarket: ${order.id}*\n\n*Cliente:* ${order.customerName}\n*Telefone:* ${order.customerPhone}\n*Província:* ${order.province} (${order.municipality})\n*Bairro:* ${order.neighborhood}\n*Endereço:* ${order.address}\n\n*Itens:*\n${itemsText}\n\n*Taxa de Entrega:* ${formatKz(order.deliveryCost)}\n*Total:* *${formatKz(order.total)}*\n*Forma de Pagamento:* ${order.paymentMethod}\n*Referência:* ${order.paymentReference || 'N/A'}`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Top Bar with back link */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate('/meus-pedidos')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar aos meus pedidos</span>
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-slate-900">
              Pedido {order.id}
            </h1>
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                order.status === 'Entregue'
                  ? 'bg-emerald-100 text-emerald-800'
                  : order.status === 'Cancelado'
                  ? 'bg-rose-100 text-rose-800'
                  : 'bg-blue-100 text-blue-800'
              }`}
            >
              {order.status}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Data: {new Date(order.createdAt).toLocaleDateString('pt-AO')} às{' '}
            {new Date(order.createdAt).toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        <button
          onClick={handleWhatsAppSendOrder}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 transition shadow-sm self-start sm:self-auto"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Enviar Pedido pelo WhatsApp</span>
        </button>
      </div>

      {/* Visual Tracking Timeline */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-6">
        <h2 className="text-sm font-bold text-slate-900">Estado da Entrega</h2>

        {order.status === 'Cancelado' ? (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <div>
              <p className="font-bold">Este pedido foi cancelado.</p>
              <p className="text-[11px] text-rose-600 mt-0.5">
                Para esclarecimentos ou reagendamento, contacte a nossa equipa de apoio no WhatsApp.
              </p>
            </div>
          </div>
        ) : (
          <div className="relative">
            {/* Progress line */}
            <div className="hidden sm:block absolute top-1/2 left-6 right-6 h-1 bg-slate-100 -translate-y-1/2 z-0">
              <div
                className="h-full bg-blue-600 transition-all duration-500"
                style={{
                  width: `${(Math.max(0, currentStepIndex) / (orderSteps.length - 1)) * 100}%`,
                }}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative z-10">
              {orderSteps.map((step, idx) => {
                const isPassed = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                  <div
                    key={step}
                    className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2"
                  >
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition ${
                        isPassed
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-slate-100 text-slate-400 border border-slate-200'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                    </div>
                    <div>
                      <span
                        className={`text-xs font-bold block ${
                          isCurrent ? 'text-blue-600' : isPassed ? 'text-slate-900' : 'text-slate-400'
                        }`}
                      >
                        {step}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Ordered Items */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
            Artigos Encomendados ({order.items.length})
          </h2>

          <div className="divide-y divide-slate-100">
            {order.items.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className="w-14 h-14 rounded-xl object-cover bg-slate-50 border border-slate-100"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                      {item.productName}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {item.quantity} unidade(s) • {formatKz(item.price)} cada
                    </p>
                    {item.affiliateRef && (
                      <span className="text-[10px] text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded font-mono font-bold mt-1 inline-block">
                        Ref: {item.affiliateRef}
                      </span>
                    )}
                  </div>
                </div>

                <span className="text-xs font-extrabold text-slate-900">
                  {formatKz(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-semibold text-slate-900">{formatKz(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Desconto Cupom:</span>
                <span>-{formatKz(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Taxa de Entrega:</span>
              <span className="font-semibold text-slate-900">{formatKz(order.deliveryCost)}</span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200">
              <span>Total Pago:</span>
              <span className="text-blue-600">{formatKz(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Shipping & Payment Details Card */}
        <div className="lg:col-span-4 space-y-6">
          {/* Payment Instructions Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
              Pagamento ({order.paymentMethod})
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Estado:</span>
                <span
                  className={`font-bold capitalize ${
                    order.paymentStatus === 'verified'
                      ? 'text-emerald-600'
                      : order.paymentStatus === 'paid_on_delivery'
                      ? 'text-blue-600'
                      : 'text-amber-600'
                  }`}
                >
                  {order.paymentStatus === 'verified'
                    ? 'Confirmado'
                    : order.paymentStatus === 'paid_on_delivery'
                    ? 'Na Entrega'
                    : 'Pendente de Verificação'}
                </span>
              </div>

              {order.paymentReference && (
                <div>
                  <span className="text-slate-500 block mb-1">Referência do Pedido:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold bg-slate-100 px-2 py-1 rounded text-xs text-slate-800">
                      {order.paymentReference}
                    </span>
                    <button
                      onClick={handleCopyReference}
                      className="text-blue-600 hover:text-blue-700 text-xs font-semibold flex items-center gap-1"
                    >
                      {copiedRef ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedRef ? 'Copiado' : 'Copiar'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Instructions if Bank Transfer */}
              {order.paymentMethod === 'Transferência bancária' && (
                <div className="mt-3 p-3 rounded-xl bg-blue-50/70 border border-blue-100 text-[11px] text-blue-900 space-y-1">
                  <p className="font-bold">Coordenadas Bancárias AngolaMarket:</p>
                  <p>Banco: {platformSettings.bankName}</p>
                  <p className="font-mono select-all">IBAN: {platformSettings.bankIban}</p>
                  <p>Beneficiário: {platformSettings.bankBeneficiary}</p>
                  <p className="text-[10px] text-blue-700 pt-1">
                    Envie o comprovativo por WhatsApp mencionando a referência {order.id}.
                  </p>
                </div>
              )}

              {/* Instructions if Multicaixa Express */}
              {order.paymentMethod === 'Multicaixa Express' && (
                <div className="mt-3 p-3 rounded-xl bg-blue-50/70 border border-blue-100 text-[11px] text-blue-900 space-y-1">
                  <p className="font-bold">Multicaixa Express:</p>
                  <p>Autorize a transação no seu aplicativo com o número {order.customerPhone}.</p>
                </div>
              )}
            </div>
          </div>

          {/* Delivery Destination */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
              Endereço da Entrega
            </h3>

            <div className="space-y-1 text-xs text-slate-600">
              <p className="font-bold text-slate-900">{order.customerName}</p>
              <p>Telefone: {order.customerPhone}</p>
              {order.customerWhatsapp && <p>WhatsApp: {order.customerWhatsapp}</p>}
              <p className="pt-2 font-medium text-slate-800">
                {order.address}, {order.neighborhood}
              </p>
              <p>
                {order.municipality}, {order.province}
              </p>
              {order.referencePoint && (
                <p className="text-[11px] text-slate-500 italic mt-1">
                  Ponto de referência: {order.referencePoint}
                </p>
              )}
              {order.notes && (
                <p className="text-[11px] text-slate-500 italic mt-1">
                  Obs: {order.notes}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
