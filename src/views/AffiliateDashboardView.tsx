import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  MousePointer,
  ShoppingBag,
  Percent,
  ArrowUpRight,
  Share2,
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
  Plus,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { WithdrawalMethod, Product } from '../types';
import { AffiliateLinkModal } from '../components/product/AffiliateLinkModal';

export const AffiliateDashboardView: React.FC = () => {
  const {
    currentUser,
    products,
    affiliateSales,
    withdrawals,
    requestWithdrawal,
    formatKz,
    platformSettings,
    navigate,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'sales' | 'withdrawals'>('overview');
  const [withdrawalModalOpen, setWithdrawalModalOpen] = useState(false);
  const [selectedProductForLink, setSelectedProductForLink] = useState<Product | null>(null);

  // Withdrawal form state
  const [withdrawAmount, setWithdrawAmount] = useState<number>(20000);
  const [withdrawMethod, setWithdrawMethod] = useState<WithdrawalMethod>('Multicaixa Express');
  const [accountNumber, setAccountNumber] = useState(currentUser?.phone || '+244 945 111 222');
  const [accountHolderName, setAccountHolderName] = useState(currentUser?.name || '');
  const [withdrawNotes, setWithdrawNotes] = useState('');
  const [withdrawStatusMsg, setWithdrawStatusMsg] = useState<{ text: string; success: boolean } | null>(null);

  const affiliateCode = currentUser?.affiliateCode || 'AF88492';

  // Calculate Metrics
  const mySales = affiliateSales.filter((s) => s.affiliateCode === affiliateCode);
  const totalSalesCount = mySales.length;
  const grossSalesVolume = mySales.reduce((acc, s) => acc + s.saleAmount, 0);

  // Commission States
  const pendingCommission = mySales
    .filter((s) => s.status === 'Pendente' || s.status === 'Confirmada')
    .reduce((acc, s) => acc + s.commissionAmount, 0);

  const availableCommissionRaw = mySales
    .filter((s) => s.status === 'Disponível')
    .reduce((acc, s) => acc + s.commissionAmount, 0);

  const myWithdrawals = withdrawals.filter(
    (w) => w.affiliateCode === affiliateCode || w.affiliateId === currentUser?.id
  );

  const alreadyWithdrawnTotal = myWithdrawals
    .filter((w) => w.status === 'approved')
    .reduce((acc, w) => acc + w.amount, 0);

  const pendingWithdrawalsTotal = myWithdrawals
    .filter((w) => w.status === 'pending')
    .reduce((acc, w) => acc + w.amount, 0);

  const netAvailableBalance = Math.max(
    0,
    availableCommissionRaw - (alreadyWithdrawnTotal + pendingWithdrawalsTotal)
  );

  const totalEarnedHistorical = mySales.reduce((acc, s) => acc + s.commissionAmount, 0);

  // Realistic mock conversion numbers
  const simulatedClicks = Math.max(34, totalSalesCount * 14 + 18);
  const conversionRate = simulatedClicks > 0
    ? ((totalSalesCount / simulatedClicks) * 100).toFixed(1)
    : '0.0';

  const feeAmount = Math.round((withdrawAmount * platformSettings.withdrawalFeePercent) / 100);
  const netWithdrawAmount = Math.max(0, withdrawAmount - feeAmount);

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawStatusMsg(null);

    const res = requestWithdrawal({
      amount: Number(withdrawAmount),
      method: withdrawMethod,
      accountNumber,
      accountHolderName,
      notes: withdrawNotes,
    });

    setWithdrawStatusMsg({ text: res.message, success: res.success });
    if (res.success) {
      setTimeout(() => {
        setWithdrawalModalOpen(false);
        setWithdrawStatusMsg(null);
      }, 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Top Banner & Header */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-purple-800/60 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold bg-purple-500/30 text-purple-200 px-3 py-0.5 rounded-full border border-purple-400/30">
              Painel Oficial de Afiliado
            </span>
            <span className="text-xs font-mono font-bold bg-white/10 px-2 py-0.5 rounded">
              ID: {affiliateCode}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Olá, {currentUser?.name || 'Afiliado'}!
          </h1>
          <p className="text-xs text-slate-300 max-w-lg">
            Acompanhe os seus cliques, vendas indicadas e solicite levantamentos para a sua conta via Multicaixa Express ou IBAN.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setWithdrawalModalOpen(true)}
            disabled={netAvailableBalance <= 0}
            className="px-5 py-3 rounded-2xl bg-white text-purple-950 font-bold text-xs sm:text-sm hover:bg-purple-50 transition shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowUpRight className="w-4 h-4 text-purple-700" />
            <span>Solicitar Levantamento</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Saldo Disponível */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-500">Saldo Disponível</span>
          <p className="text-xl sm:text-2xl font-extrabold text-emerald-600">
            {formatKz(netAvailableBalance)}
          </p>
          <span className="text-[11px] text-slate-400 block pt-1">
            Pronto para levantar via MCX/IBAN
          </span>
        </div>

        {/* Comissões Pendentes */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-500">Comissões Pendentes</span>
          <p className="text-xl sm:text-2xl font-extrabold text-amber-500">
            {formatKz(pendingCommission)}
          </p>
          <span className="text-[11px] text-slate-400 block pt-1">
            Libera após entrega do pedido
          </span>
        </div>

        {/* Total Ganho Histórico */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-500">Total Histórico Ganho</span>
          <p className="text-xl sm:text-2xl font-extrabold text-slate-900">
            {formatKz(totalEarnedHistorical)}
          </p>
          <span className="text-[11px] text-slate-400 block pt-1">
            {formatKz(grossSalesVolume)} em vendas geradas
          </span>
        </div>

        {/* Cliques & Conversão */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-500">Cliques & Conversão</span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-extrabold text-purple-700">
              {simulatedClicks}
            </span>
            <span className="text-xs font-bold text-slate-600">({conversionRate}%)</span>
          </div>
          <span className="text-[11px] text-slate-400 block pt-1">
            {totalSalesCount} pedidos convertidos
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-4 sm:gap-8 text-xs sm:text-sm font-bold overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 border-b-2 transition whitespace-nowrap ${
            activeTab === 'overview'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Visão Geral & Gráficos
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 border-b-2 transition whitespace-nowrap ${
            activeTab === 'products'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Produtos para Divulgar ({products.length})
        </button>

        <button
          onClick={() => setActiveTab('sales')}
          className={`pb-3 border-b-2 transition whitespace-nowrap ${
            activeTab === 'sales'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Histórico de Vendas ({mySales.length})
        </button>

        <button
          onClick={() => setActiveTab('withdrawals')}
          className={`pb-3 border-b-2 transition whitespace-nowrap ${
            activeTab === 'withdrawals'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Levantamentos ({myWithdrawals.length})
        </button>
      </div>

      {/* TAB: Overview & Charts */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Visual Performance Bars (Vendas e Comissões por Período) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Desempenho de Vendas e Comissões Recentes
                </h3>
                <p className="text-xs text-slate-500">Evolução semanal de comissões e cliques</p>
              </div>
              <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-3 py-1 rounded-full">
                Últimos 30 Dias
              </span>
            </div>

            {/* CSS-based bar chart representation */}
            <div className="space-y-4 pt-2">
              {[
                { period: 'Semana 1', sales: 45000, comm: 4500, clicks: 82, pct: 40 },
                { period: 'Semana 2', sales: 98000, comm: 9800, clicks: 145, pct: 65 },
                { period: 'Semana 3', sales: 165000, comm: 18500, clicks: 230, pct: 85 },
                { period: 'Semana 4 (Atual)', sales: 345000, comm: 27600, clicks: 310, pct: 100 },
              ].map((item) => (
                <div key={item.period} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>{item.period}</span>
                    <span className="text-purple-700 font-bold">
                      +{formatKz(item.comm)} de comissão ({item.clicks} cliques)
                    </span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full transition-all duration-500"
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Promote Catalog preview */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                Produtos Mais Lucrativos para Divulgar
              </h3>
              <button
                onClick={() => setActiveTab('products')}
                className="text-xs font-bold text-purple-600 hover:text-purple-700"
              >
                Ver Todos os Produtos &rarr;
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.slice(0, 3).map((p) => {
                const effPrice = p.promoPrice || p.price;
                const comm = Math.round((effPrice * (p.affiliateCommissionPercent || 10)) / 100);
                return (
                  <div
                    key={p.id}
                    className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between gap-3"
                  >
                    <img src={p.images[0]} alt={p.name} className="w-16 h-16 rounded-xl object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">{p.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{formatKz(effPrice)}</p>
                      <span className="text-[11px] font-bold text-purple-700 block mt-1">
                        Comissão: +{formatKz(comm)}
                      </span>
                    </div>
                    <button
                      onClick={() => setSelectedProductForLink(p)}
                      className="px-3 py-1.5 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 transition shrink-0"
                    >
                      Gerar Link
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB: Products to Promote */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <p className="text-xs text-slate-500">
            Clique em "Gerar Link" em qualquer produto para obter a sua hiperligação personalizada com o seu código de afiliado ({affiliateCode}).
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p) => {
              const effPrice = p.promoPrice || p.price;
              const comm = Math.round((effPrice * (p.affiliateCommissionPercent || 10)) / 100);
              return (
                <div
                  key={p.id}
                  className="bg-white p-4 rounded-3xl border border-slate-100 shadow-xs flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <img src={p.images[0]} alt={p.name} className="w-16 h-16 rounded-2xl object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] text-blue-600 font-bold uppercase">{p.categoryName}</span>
                      <h4 className="text-xs font-bold text-slate-900 truncate">{p.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{formatKz(effPrice)}</p>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-between text-xs">
                    <span className="text-purple-800 font-bold">Comissão ({p.affiliateCommissionPercent}%):</span>
                    <span className="text-purple-900 font-extrabold text-sm">{formatKz(comm)}</span>
                  </div>

                  <button
                    onClick={() => setSelectedProductForLink(p)}
                    className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-xs"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Gerar Link de Afiliado</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB: Sales History */}
      {activeTab === 'sales' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">Histórico de Comissões</h3>
            <p className="text-xs text-slate-500">Todas as compras realizadas através do seu link</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Pedido</th>
                  <th className="py-3 px-4">Produto</th>
                  <th className="py-3 px-4">Valor da Venda</th>
                  <th className="py-3 px-4">Comissão</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {mySales.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400 italic">
                      Ainda não possui vendas registadas. Divulgue o seu link para começar a faturar!
                    </td>
                  </tr>
                ) : (
                  mySales.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-600">{s.orderId}</td>
                      <td className="py-3.5 px-4 font-medium text-slate-900">{s.productName}</td>
                      <td className="py-3.5 px-4">{formatKz(s.saleAmount)}</td>
                      <td className="py-3.5 px-4 font-extrabold text-emerald-600">
                        +{formatKz(s.commissionAmount)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            s.status === 'Disponível'
                              ? 'bg-emerald-100 text-emerald-800'
                              : s.status === 'Pendente'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {s.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">
                        {new Date(s.createdAt).toLocaleDateString('pt-AO')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: Withdrawals */}
      {activeTab === 'withdrawals' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Solicitações de Levantamento</h3>
              <p className="text-xs text-slate-500">
                Processadas pelo administrador da AngolaMarket para IBAN ou Multicaixa Express
              </p>
            </div>
            <button
              onClick={() => setWithdrawalModalOpen(true)}
              disabled={netAvailableBalance <= 0}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition disabled:opacity-50"
            >
              Novo Levantamento
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Valor Bruto</th>
                  <th className="py-3 px-4">Taxa ({platformSettings.withdrawalFeePercent}%)</th>
                  <th className="py-3 px-4">Valor Líquido</th>
                  <th className="py-3 px-4">Método / Conta</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {myWithdrawals.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400 italic">
                      Nenhum levantamento solicitado até o momento.
                    </td>
                  </tr>
                ) : (
                  myWithdrawals.map((w) => (
                    <tr key={w.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-4 font-mono text-slate-400">{w.id}</td>
                      <td className="py-3.5 px-4 font-semibold">{formatKz(w.amount)}</td>
                      <td className="py-3.5 px-4 text-slate-500">-{formatKz(w.feeAmount)}</td>
                      <td className="py-3.5 px-4 font-extrabold text-slate-900">{formatKz(w.netAmount)}</td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold block">{w.method}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{w.accountNumber}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            w.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : w.status === 'rejected'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {w.status === 'approved'
                            ? 'Aprovado / Pago'
                            : w.status === 'rejected'
                            ? 'Rejeitado'
                            : 'Em Análise'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">
                        {new Date(w.createdAt).toLocaleDateString('pt-AO')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Solicitar Levantamento */}
      {withdrawalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setWithdrawalModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-base font-bold text-slate-900">Solicitar Levantamento</h3>
              <p className="text-xs text-slate-500">
                Disponível para saque: <strong className="text-emerald-600">{formatKz(netAvailableBalance)}</strong>
              </p>
            </div>

            <form onSubmit={handleWithdrawSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Valor a Levantar (Kz) *
                </label>
                <input
                  type="number"
                  min={1000}
                  max={netAvailableBalance}
                  required
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Método de Levantamento *
                </label>
                <select
                  value={withdrawMethod}
                  onChange={(e) => setWithdrawMethod(e.target.value as WithdrawalMethod)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Multicaixa Express">Multicaixa Express</option>
                  <option value="IBAN">Transferência Bancária (IBAN)</option>
                  <option value="PayPay">PayPay Angola</option>
                  <option value="Unitel Money">Unitel Money</option>
                  <option value="Afrimoney">Afrimoney</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Número de Telemóvel ou IBAN *
                </label>
                <input
                  type="text"
                  required
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="Ex: +244 923... ou AO06..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nome Completo do Titular da Conta *
                </label>
                <input
                  type="text"
                  required
                  value={accountHolderName}
                  onChange={(e) => setAccountHolderName(e.target.value)}
                  placeholder="Nome exatamente como consta no banco"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Observações (Opcional)
                </label>
                <input
                  type="text"
                  value={withdrawNotes}
                  onChange={(e) => setWithdrawNotes(e.target.value)}
                  placeholder="Ex: Conta BAI principal"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-hidden"
                />
              </div>

              {/* Fee & Net preview */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                <div className="flex justify-between text-slate-500">
                  <span>Taxa Administrativa ({platformSettings.withdrawalFeePercent}%):</span>
                  <span>-{formatKz(feeAmount)}</span>
                </div>
                <div className="flex justify-between font-extrabold text-slate-900 pt-1 border-t border-slate-200">
                  <span>Valor Líquido a Receber:</span>
                  <span className="text-purple-700 text-sm">{formatKz(netWithdrawAmount)}</span>
                </div>
              </div>

              {withdrawStatusMsg && (
                <p
                  className={`p-2.5 rounded-xl text-xs font-semibold ${
                    withdrawStatusMsg.success
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  {withdrawStatusMsg.text}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs transition shadow-lg"
              >
                Confirmar Solicitação de Levantamento
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Selected Product Affiliate Modal */}
      {selectedProductForLink && (
        <AffiliateLinkModal
          product={selectedProductForLink}
          onClose={() => setSelectedProductForLink(null)}
        />
      )}
    </div>
  );
};
