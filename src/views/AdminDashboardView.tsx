import React, { useState } from 'react';
import {
  ShieldCheck,
  Users,
  Package,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Truck,
  CreditCard,
  Settings,
  FolderTree,
  Tag,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Database,
  RefreshCw,
  Copy,
  Check,
  History,
  UserCheck,
  Building,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { OrderStatus, PaymentMethod, DeliveryZone, Category, Product } from '../types';

export const AdminDashboardView: React.FC = () => {
  const {
    currentUser,
    users,
    products,
    orders,
    categories,
    deliveryZones,
    withdrawals,
    coupons,
    platformSettings,
    updatePlatformSettings,
    updateOrderStatus,
    updateOrderPayment,
    approveProduct,
    deleteProduct,
    addCategory,
    updateCategory,
    deleteCategory,
    updateDeliveryZone,
    addDeliveryZone,
    approveWithdrawal,
    rejectWithdrawal,
    approveAffiliate,
    formatKz,
    resetAllToDemoData,
    addCoupon,
    toggleCoupon,
    auditLogs,
    producerApplications,
    approveProducer,
    promoteToAdmin,
    updateUserStatus,
  } = useStore();

  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'orders'
    | 'products'
    | 'categories'
    | 'approvals'
    | 'users'
    | 'withdrawals'
    | 'audit'
    | 'deliveries'
    | 'settings'
    | 'database'
  >('overview');

  // Stats calculation
  const totalClients = users.filter((u) => u.role === 'client').length;
  const totalAffiliates = users.filter((u) => u.role === 'affiliate').length;
  const totalProducers = users.filter((u) => u.role === 'producer').length;

  const totalGrossSales = orders.reduce((sum, o) => sum + o.total, 0);
  const platformRevenue = Math.round((totalGrossSales * platformSettings.platformFeePercent) / 100);

  const pendingOrdersCount = orders.filter((o) => o.status === 'Pedido recebido' || o.status === 'Pagamento pendente').length;
  const pendingWithdrawalsCount = withdrawals.filter((w) => w.status === 'pending').length;
  const pendingProductsCount = products.filter((p) => !p.isApproved).length;

  const pendingProducerApps = producerApplications.filter((a) => a.status === 'pending');
  const pendingAffiliateApps = users.filter((u) => u.affiliateStatus === 'pending');
  const totalPendingApprovals = pendingProducerApps.length + pendingAffiliateApps.length + pendingProductsCount;

  // Modals / sub-state
  const [newCatName, setNewCatName] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('');
  const [newCatSubs, setNewCatSubs] = useState('');

  const [newZoneProvince, setNewZoneProvince] = useState('Luanda');
  const [newZoneMun, setNewZoneMun] = useState('');
  const [newZoneName, setNewZoneName] = useState('');
  const [newZonePrice, setNewZonePrice] = useState(2500);
  const [newZoneTime, setNewZoneTime] = useState('24 horas');

  const [copiedSql, setCopiedSql] = useState(false);
  const [promoteNotice, setPromoteNotice] = useState<string | null>(null);

  // Status Filter in orders
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');

  const filteredOrders = orders.filter((o) =>
    orderStatusFilter === 'all' ? true : o.status === orderStatusFilter
  );

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    addCategory({
      name: newCatName.trim(),
      slug: newCatSlug.trim() || newCatName.toLowerCase().replace(/\s+/g, '-'),
      iconName: 'Folder',
      subcategories: newCatSubs.split(',').map((s) => s.trim()).filter(Boolean),
      orderIndex: categories.length + 1,
    });
    setNewCatName('');
    setNewCatSlug('');
    setNewCatSubs('');
  };

  const handleAddZone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newZoneMun.trim()) return;
    addDeliveryZone({
      province: newZoneProvince,
      municipality: newZoneMun.trim(),
      zone: newZoneName.trim() || newZoneMun.trim(),
      price: Number(newZonePrice),
      estimatedTime: newZoneTime.trim(),
      isActive: true,
    });
    setNewZoneMun('');
    setNewZoneName('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Top Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold bg-rose-500/30 text-rose-300 px-3 py-0.5 rounded-full border border-rose-400/30">
              Painel de Controlo Global
            </span>
            <span className="text-xs text-slate-400">Ambiente de Produção AngolaMarket</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Administração Central AngolaMarket
          </h1>
          <p className="text-xs text-slate-400 max-w-lg">
            Gestão unificada de clientes, produtores, afiliados, taxas da plataforma e entregas em Angola.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={resetAllToDemoData}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition border border-slate-700"
            title="Repor todos os dados iniciais de demonstração"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Restaurar Demo</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-400">Receita Plataforma</span>
          <p className="text-lg font-extrabold text-blue-600">{formatKz(platformRevenue)}</p>
          <span className="text-[10px] text-slate-400 block">{platformSettings.platformFeePercent}% taxa produtor</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-400">Vendas Totais</span>
          <p className="text-lg font-extrabold text-slate-900">{formatKz(totalGrossSales)}</p>
          <span className="text-[10px] text-slate-400 block">{orders.length} pedidos</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-400">Total Utilizadores</span>
          <p className="text-lg font-extrabold text-slate-900">{users.length}</p>
          <span className="text-[10px] text-slate-400 block">{totalClients} Clientes</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-400">Afiliados Ativos</span>
          <p className="text-lg font-extrabold text-purple-700">{totalAffiliates}</p>
          <span className="text-[10px] text-slate-400 block">Rede de divulgação</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-400">Produtores / Lojas</span>
          <p className="text-lg font-extrabold text-emerald-700">{totalProducers}</p>
          <span className="text-[10px] text-slate-400 block">{products.length} produtos</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-400">Ações Pendentes</span>
          <div className="flex items-center gap-1.5">
            <span className="text-lg font-extrabold text-rose-600">
              {pendingOrdersCount + pendingWithdrawalsCount + pendingProductsCount}
            </span>
            <span className="text-[10px] text-slate-500">
              ({pendingWithdrawalsCount} levantamentos)
            </span>
          </div>
          <span className="text-[10px] text-slate-400 block">Requerem atenção</span>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex border-b border-slate-200 gap-4 sm:gap-6 text-xs sm:text-sm font-bold overflow-x-auto no-scrollbar">
        {[
          { id: 'overview', label: 'Visão Geral' },
          { id: 'orders', label: `Pedidos (${orders.length})` },
          { id: 'products', label: `Produtos (${products.length})` },
          { id: 'categories', label: `Categorias (${categories.length})` },
          { id: 'approvals', label: `Aprovações (${totalPendingApprovals})` },
          { id: 'users', label: `Utilizadores (${users.length})` },
          { id: 'withdrawals', label: `Levantamentos (${pendingWithdrawalsCount})` },
          { id: 'audit', label: `Auditoria (${auditLogs.length})` },
          { id: 'deliveries', label: `Zonas de Entrega (${deliveryZones.length})` },
          { id: 'settings', label: 'Taxas & Pagamentos' },
          { id: 'database', label: 'Supabase & SQL' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-3 border-b-2 transition whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Orders in Admin */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Últimos Pedidos Registados</h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-semibold text-blue-600 hover:underline"
                >
                  Ver Todos
                </button>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                {orders.slice(0, 5).map((o) => (
                  <div key={o.id} className="py-3 flex items-center justify-between">
                    <div>
                      <span className="font-mono font-bold text-blue-600">{o.id}</span>
                      <p className="font-semibold text-slate-900">{o.customerName}</p>
                      <p className="text-[10px] text-slate-400">{o.municipality}, {o.province}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-extrabold text-slate-900">{formatKz(o.total)}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 block mt-1">
                        {o.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pending Withdrawals in Admin */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">
                  Levantamentos de Afiliados ({pendingWithdrawalsCount} Pendentes)
                </h3>
                <button
                  onClick={() => setActiveTab('withdrawals')}
                  className="text-xs font-semibold text-purple-600 hover:underline"
                >
                  Gerir Levantamentos
                </button>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                {withdrawals.slice(0, 5).map((w) => (
                  <div key={w.id} className="py-3 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900">{w.affiliateName}</p>
                      <p className="text-[10px] text-slate-500 font-mono">
                        {w.method} • {w.accountNumber}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-extrabold text-purple-700">{formatKz(w.netAmount)}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full block mt-1 ${
                          w.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {w.status === 'approved' ? 'Pago' : 'Aguardando Aprovação'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: Orders Management */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden space-y-4">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Gestão de Pedidos dos Clientes</h3>
              <p className="text-xs text-slate-500">
                Altere o estado de preparação, entrega e confirme pagamentos por Multicaixa Express
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-semibold">Filtrar Estado:</span>
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 font-medium"
              >
                <option value="all">Todos os Estados</option>
                <option value="Pedido recebido">Pedido recebido</option>
                <option value="Pagamento pendente">Pagamento pendente</option>
                <option value="Pagamento confirmado">Pagamento confirmado</option>
                <option value="Em preparação">Em preparação</option>
                <option value="Aguardando recolha">Aguardando recolha</option>
                <option value="Em entrega">Em entrega</option>
                <option value="Entregue">Entregue</option>
                <option value="Cancelado">Cancelado</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">ID Pedido</th>
                  <th className="py-3 px-4">Cliente</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Pagamento</th>
                  <th className="py-3 px-4">Estado Atual</th>
                  <th className="py-3 px-4 text-right">Alterar Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600">{o.id}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 block">{o.customerName}</span>
                      <span className="text-[10px] text-slate-500">{o.customerPhone}</span>
                    </td>
                    <td className="py-3.5 px-4 font-extrabold">{formatKz(o.total)}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold block">{o.paymentMethod}</span>
                      <span className="text-[10px] text-slate-500">Ref: {o.paymentReference || 'N/A'}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                        {o.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <select
                        value={o.status}
                        onChange={(e) => updateOrderStatus(o.id, e.target.value as OrderStatus)}
                        className="px-2.5 py-1 text-xs rounded-xl bg-slate-50 border border-slate-200 font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Pedido recebido">Pedido recebido</option>
                        <option value="Pagamento pendente">Pagamento pendente</option>
                        <option value="Pagamento confirmado">Pagamento confirmado</option>
                        <option value="Em preparação">Em preparação</option>
                        <option value="Aguardando recolha">Aguardando recolha</option>
                        <option value="Em entrega">Em entrega</option>
                        <option value="Entregue">Entregue (Libera Comissão)</option>
                        <option value="Cancelado">Cancelado</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: Products Management */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Catálogo Global de Produtos</h3>
              <p className="text-xs text-slate-500">
                Aprovação, destaque e remoção de produtos cadastrados por produtores
              </p>
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              {products.length} Produtos
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Produto</th>
                  <th className="py-3 px-4">Produtor</th>
                  <th className="py-3 px-4">Preço (Kz)</th>
                  <th className="py-3 px-4">Estoque</th>
                  <th className="py-3 px-4">Comissão</th>
                  <th className="py-3 px-4">Aprovação</th>
                  <th className="py-3 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img src={p.images[0]} alt={p.name} className="w-10 h-10 rounded-xl object-cover" />
                        <div>
                          <p className="font-bold text-slate-900 line-clamp-1">{p.name}</p>
                          <span className="text-[10px] text-slate-400">{p.categoryName}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium">{p.producerName}</td>
                    <td className="py-3 px-4 font-bold">{formatKz(p.promoPrice || p.price)}</td>
                    <td className="py-3 px-4">{p.stock} un.</td>
                    <td className="py-3 px-4 font-bold text-purple-700">{p.affiliateCommissionPercent}%</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => approveProduct(p.id, !p.isApproved)}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          p.isApproved
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {p.isApproved ? 'Aprovado' : 'Aguardando'}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          if (confirm(`Remover "${p.name}"?`)) deleteProduct(p.id);
                        }}
                        className="p-1.5 rounded-lg border text-rose-600 hover:bg-rose-50"
                        title="Eliminar produto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: Categories Management */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          {/* Add Category Form */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Adicionar Nova Categoria</h3>
            <form onSubmit={handleAddCategory} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <input
                type="text"
                required
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="Nome da categoria (ex: Desporto)"
                className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200"
              />
              <input
                type="text"
                value={newCatSubs}
                onChange={(e) => setNewCatSubs(e.target.value)}
                placeholder="Subcategorias separadas por vírgula (ex: Calçado, Bolas)"
                className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200"
              />
              <button
                type="submit"
                className="py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition shadow-xs"
              >
                Criar Categoria
              </button>
            </form>
          </div>

          {/* Categories List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((c) => (
              <div
                key={c.id}
                className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-slate-900">{c.name}</h4>
                    <button
                      onClick={() => {
                        if (confirm(`Eliminar categoria "${c.name}"?`)) deleteCategory(c.id);
                      }}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">/{c.slug}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Subcategorias:</span>
                  <div className="flex flex-wrap gap-1">
                    {c.subcategories.map((sub) => (
                      <span
                        key={sub}
                        className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: Approvals & Candidatures (Items 9, 11, 13) */}
      {activeTab === 'approvals' && (
        <div className="space-y-8">
          {/* 1. Pending Producer Applications */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Building className="w-5 h-5 text-emerald-600" />
                  <span>Candidaturas de Produtores ({pendingProducerApps.length})</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Lojas e produtores locais que solicitaram aprovação para vender na AngolaMarket
                </p>
              </div>
            </div>

            {pendingProducerApps.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                Nenhuma candidatura de produtor pendente no momento.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {pendingProducerApps.map((app) => (
                  <div key={app.id} className="p-6 hover:bg-slate-50/50 transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{app.businessName}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                          Pendente
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">
                        Responsável: <strong>{app.userName}</strong> ({app.userEmail}) • Tel: {app.phone} • WhatsApp: {app.whatsapp}
                      </p>
                      <p className="text-xs text-slate-500">
                        Localização: {app.pickupAddress}, {app.municipality}, {app.province}
                      </p>
                      {app.description && (
                        <p className="text-xs text-slate-400 italic">"{app.description}"</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => approveProducer(app.userId, true)}
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-xs flex items-center gap-1.5"
                      >
                        <Check className="w-4 h-4" />
                        <span>Aprovar Produtor</span>
                      </button>
                      <button
                        onClick={() => approveProducer(app.userId, false)}
                        className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs transition border border-rose-200"
                      >
                        Rejeitar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 2. Pending Affiliate Applications */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <span>Candidaturas de Afiliados ({pendingAffiliateApps.length})</span>
              </h3>
              <p className="text-xs text-slate-500">
                Clientes que solicitaram acesso para divulgar produtos e ganhar comissões
              </p>
            </div>

            {pendingAffiliateApps.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                Nenhuma candidatura de afiliado pendente no momento.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {pendingAffiliateApps.map((u) => (
                  <div key={u.id} className="p-6 hover:bg-slate-50/50 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{u.name}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                          Adesão Afiliado
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Email: {u.email} • Tel: {u.phone}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => approveAffiliate(u.id, true)}
                        className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition shadow-xs flex items-center gap-1.5"
                      >
                        <Check className="w-4 h-4" />
                        <span>Aprovar Afiliado</span>
                      </button>
                      <button
                        onClick={() => approveAffiliate(u.id, false)}
                        className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs transition border border-rose-200"
                      >
                        Rejeitar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 3. Pending Products to Approve */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                <span>Produtos a Aguardar Moderação ({pendingProductsCount})</span>
              </h3>
              <p className="text-xs text-slate-500">
                Produtos cadastrados por produtores que requerem validação antes de ficarem públicos
              </p>
            </div>

            {pendingProductsCount === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                Todos os produtos estão aprovados e publicados.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {products
                  .filter((p) => !p.isApproved)
                  .map((p) => (
                    <div key={p.id} className="p-6 hover:bg-slate-50/50 transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={p.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'}
                          alt={p.name}
                          className="w-14 h-14 object-cover rounded-xl border border-slate-200"
                        />
                        <div className="space-y-1">
                          <h4 className="font-bold text-sm text-slate-900">{p.name}</h4>
                          <p className="text-xs text-slate-500">
                            Produtor: <strong>{p.producerName}</strong> • Categoria: {p.categoryName} • Estoque: {p.stock} un
                          </p>
                          <p className="text-xs font-extrabold text-blue-600">{formatKz(p.price)}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => approveProduct(p.id, true)}
                          className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-xs flex items-center gap-1.5"
                        >
                          <Check className="w-4 h-4" />
                          <span>Aprovar Produto</span>
                        </button>
                        <button
                          onClick={() => approveProduct(p.id, false)}
                          className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs transition border border-rose-200"
                        >
                          Rejeitar
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB: Users Management (Items 3, 4, 5, 6) */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden space-y-4">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Utilizadores & Controlo de Acesso (RBAC)</h3>
              <p className="text-xs text-slate-500">
                Gestão de Clientes, Afiliados, Produtores e Administradores. Apenas administradores existentes podem promover outros administradores.
              </p>
            </div>

            {promoteNotice && (
              <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
                {promoteNotice}
              </span>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Utilizador</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Telefone</th>
                  <th className="py-3 px-4">Função</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4">Código / Loja</th>
                  <th className="py-3 px-4 text-right">Ações Administrativas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        <span>{u.name}</span>
                        {u.id === currentUser?.id && (
                          <span className="text-[9px] font-bold bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                            Você
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">{u.email}</td>
                    <td className="py-3.5 px-4 font-mono">{u.phone}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          u.role === 'admin'
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : u.role === 'affiliate'
                            ? 'bg-purple-100 text-purple-800 border border-purple-200'
                            : u.role === 'producer'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-blue-100 text-blue-800 border border-blue-200'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          u.status === 'blocked'
                            ? 'bg-rose-100 text-rose-800'
                            : u.status === 'suspended'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {u.status || 'Ativo'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px]">
                      {u.affiliateCode || u.storeName || '—'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Item 4: Promover a Administrador */}
                        {u.role !== 'admin' && (
                          <button
                            onClick={() => {
                              if (confirm(`Promover ${u.name} (${u.email}) para Administrador Geral?`)) {
                                const res = promoteToAdmin(u.id);
                                setPromoteNotice(res.message);
                                setTimeout(() => setPromoteNotice(null), 3000);
                              }
                            }}
                            className="px-2 py-1 text-[10px] font-bold rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition"
                            title="Promover utilizador a Administrador"
                          >
                            + Promover a Admin
                          </button>
                        )}

                        {/* Suspensão / Bloqueio */}
                        {u.role !== 'admin' && (
                          <button
                            onClick={() => {
                              const newSt = u.status === 'suspended' ? 'active' : 'suspended';
                              updateUserStatus(u.id, newSt);
                            }}
                            className={`px-2 py-1 text-[10px] font-bold rounded-lg border transition ${
                              u.status === 'suspended'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {u.status === 'suspended' ? 'Reativar' : 'Suspender'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: Withdrawals Management */}
      {activeTab === 'withdrawals' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">
              Aprovação Manual de Levantamentos de Comissões
            </h3>
            <p className="text-xs text-slate-500">
              Taxa administrativa atual: <strong>{platformSettings.withdrawalFeePercent}%</strong>
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Afiliado</th>
                  <th className="py-3 px-4">Bruto</th>
                  <th className="py-3 px-4">Taxa</th>
                  <th className="py-3 px-4">Líquido a Pagar</th>
                  <th className="py-3 px-4">Método / Dados</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {withdrawals.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 block">{w.affiliateName}</span>
                      <span className="text-[10px] text-slate-400 font-mono">ID: {w.affiliateCode}</span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold">{formatKz(w.amount)}</td>
                    <td className="py-3.5 px-4 text-slate-400">-{formatKz(w.feeAmount)}</td>
                    <td className="py-3.5 px-4 font-extrabold text-purple-700">{formatKz(w.netAmount)}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold block">{w.method}</span>
                      <span className="font-mono text-[10px] text-slate-600 block">{w.accountNumber}</span>
                      <span className="text-[10px] text-slate-400">Titular: {w.accountHolderName}</span>
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
                        {w.status === 'approved' ? 'Aprovado & Pago' : w.status === 'rejected' ? 'Rejeitado' : 'Pendente'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {w.status === 'pending' && (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => approveWithdrawal(w.id)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px]"
                          >
                            Aprovar
                          </button>
                          <button
                            onClick={() => rejectWithdrawal(w.id, 'Dados bancários inválidos')}
                            className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px]"
                          >
                            Rejeitar
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: Delivery Zones & Pricing (Item 8) */}
      {activeTab === 'deliveries' && (
        <div className="space-y-6">
          {/* Add Zone */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Cadastrar Nova Zona de Entrega</h3>
            <form onSubmit={handleAddZone} className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
              <select
                value={newZoneProvince}
                onChange={(e) => setNewZoneProvince(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200"
              >
                <option value="Luanda">Luanda</option>
                <option value="Benguela">Benguela</option>
                <option value="Huambo">Huambo</option>
                <option value="Huíla">Huíla</option>
                <option value="Cabinda">Cabinda</option>
              </select>

              <input
                type="text"
                required
                value={newZoneMun}
                onChange={(e) => setNewZoneMun(e.target.value)}
                placeholder="Município (ex: Camama)"
                className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200"
              />

              <input
                type="text"
                value={newZoneName}
                onChange={(e) => setNewZoneName(e.target.value)}
                placeholder="Bairros abrangidos"
                className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200"
              />

              <input
                type="number"
                required
                value={newZonePrice}
                onChange={(e) => setNewZonePrice(Number(e.target.value))}
                placeholder="Preço em Kz"
                className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold"
              />

              <button
                type="submit"
                className="py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition shadow-xs"
              >
                Adicionar Zona
              </button>
            </form>
          </div>

          {/* Zones Table with live price editor */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Tabela de Preços de Entrega em Angola</h3>
              <p className="text-xs text-slate-500">
                Altere os valores de entrega diretamente nos campos abaixo (não são fixos no código)
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Província</th>
                    <th className="py-3 px-4">Município</th>
                    <th className="py-3 px-4">Zona / Bairros</th>
                    <th className="py-3 px-4">Preço Configurável (Kz)</th>
                    <th className="py-3 px-4">Prazo Estimado</th>
                    <th className="py-3 px-4 text-right">Ativo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {deliveryZones.map((z) => (
                    <tr key={z.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{z.province}</td>
                      <td className="py-3.5 px-4 font-semibold">{z.municipality}</td>
                      <td className="py-3.5 px-4 text-slate-500">{z.zone}</td>
                      <td className="py-3.5 px-4">
                        <input
                          type="number"
                          step={100}
                          value={z.price}
                          onChange={(e) => updateDeliveryZone(z.id, { price: Number(e.target.value) })}
                          className="w-28 px-2 py-1 rounded-lg bg-slate-50 border border-slate-200 font-extrabold text-blue-600 focus:bg-white"
                        />
                      </td>
                      <td className="py-3.5 px-4">
                        <input
                          type="text"
                          value={z.estimatedTime}
                          onChange={(e) => updateDeliveryZone(z.id, { estimatedTime: e.target.value })}
                          className="w-32 px-2 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-600"
                        />
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <input
                          type="checkbox"
                          checked={z.isActive}
                          onChange={(e) => updateDeliveryZone(z.id, { isActive: e.target.checked })}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB: Settings & Fees (Item 17 & 7) */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Platform Fee & Withdrawal Fee */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Taxas da Plataforma AngolaMarket
            </h3>
            <p className="text-xs text-slate-500">
              Configure as percentagens cobradas sobre as vendas de produtores e levantamentos
            </p>

            <div className="space-y-4 pt-2 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Taxa da Plataforma sobre Vendas do Produtor (%):
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={0}
                    max={50}
                    value={platformSettings.platformFeePercent}
                    onChange={(e) =>
                      updatePlatformSettings({ platformFeePercent: Number(e.target.value) })
                    }
                    className="w-24 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-extrabold text-base text-blue-600"
                  />
                  <span className="text-slate-500">
                    Valor atual: <strong>{platformSettings.platformFeePercent}%</strong> (Padrão: 10%)
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Taxa de Levantamento de Afiliados (%):
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={0}
                    max={20}
                    value={platformSettings.withdrawalFeePercent}
                    onChange={(e) =>
                      updatePlatformSettings({ withdrawalFeePercent: Number(e.target.value) })
                    }
                    className="w-24 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-extrabold text-base text-purple-600"
                  />
                  <span className="text-slate-500">
                    Valor atual: <strong>{platformSettings.withdrawalFeePercent}%</strong>
                  </span>
                </div>
              </div>

              <div className="pt-2 space-y-2 border-t border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={platformSettings.requireProductApproval}
                    onChange={(e) =>
                      updatePlatformSettings({ requireProductApproval: e.target.checked })
                    }
                    className="rounded text-blue-600"
                  />
                  <span>Exigir aprovação de produtos antes de ficarem públicos</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={platformSettings.autoMakeCommissionAvailableOnDelivery}
                    onChange={(e) =>
                      updatePlatformSettings({
                        autoMakeCommissionAvailableOnDelivery: e.target.checked,
                      })
                    }
                    className="rounded text-blue-600"
                  />
                  <span>Disponibilizar comissão de afiliado automaticamente ao marcar como "Entregue"</span>
                </label>
              </div>
            </div>
          </div>

          {/* Payment Methods Activation Toggle (Item 7) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Métodos de Pagamento Ativos
            </h3>
            <p className="text-xs text-slate-500">
              Ative ou desative métodos no checkout para os clientes
            </p>

            <div className="space-y-3 pt-2 text-xs">
              <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
                <div>
                  <span className="font-bold text-slate-900 block">Multicaixa Express</span>
                  <span className="text-[11px] text-slate-500">Pagamento móvel angolano</span>
                </div>
                <input
                  type="checkbox"
                  checked={platformSettings.enabledPaymentMethods.multicaixaExpress}
                  onChange={(e) =>
                    updatePlatformSettings({
                      enabledPaymentMethods: {
                        ...platformSettings.enabledPaymentMethods,
                        multicaixaExpress: e.target.checked,
                      },
                    })
                  }
                  className="rounded text-blue-600 w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
                <div>
                  <span className="font-bold text-slate-900 block">PayPay Angola</span>
                  <span className="text-[11px] text-slate-500">Carteira digital PayPay</span>
                </div>
                <input
                  type="checkbox"
                  checked={platformSettings.enabledPaymentMethods.payPay}
                  onChange={(e) =>
                    updatePlatformSettings({
                      enabledPaymentMethods: {
                        ...platformSettings.enabledPaymentMethods,
                        payPay: e.target.checked,
                      },
                    })
                  }
                  className="rounded text-blue-600 w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
                <div>
                  <span className="font-bold text-slate-900 block">Transferência Bancária (IBAN)</span>
                  <span className="text-[11px] text-slate-500">BAI / BFA com envio de comprovativo</span>
                </div>
                <input
                  type="checkbox"
                  checked={platformSettings.enabledPaymentMethods.bankTransfer}
                  onChange={(e) =>
                    updatePlatformSettings({
                      enabledPaymentMethods: {
                        ...platformSettings.enabledPaymentMethods,
                        bankTransfer: e.target.checked,
                      },
                    })
                  }
                  className="rounded text-blue-600 w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
                <div>
                  <span className="font-bold text-slate-900 block">Pagamento na Entrega</span>
                  <span className="text-[11px] text-slate-500">Numerário ou TPA móvel do estafeta</span>
                </div>
                <input
                  type="checkbox"
                  checked={platformSettings.enabledPaymentMethods.cashOnDelivery}
                  onChange={(e) =>
                    updatePlatformSettings({
                      enabledPaymentMethods: {
                        ...platformSettings.enabledPaymentMethods,
                        cashOnDelivery: e.target.checked,
                      },
                    })
                  }
                  className="rounded text-blue-600 w-4 h-4"
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* TAB: Supabase & Database Architecture (Item 19) */}
      {activeTab === 'database' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Arquitetura Supabase & Row Level Security (RLS)
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Esquema relacional completo para 21 tabelas com políticas de segurança por função.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full border border-emerald-200">
                Arquivo /supabase/schema.sql Pronto
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-900 block mb-1">Tabelas Preparadas:</span>
              <p className="text-slate-500 leading-relaxed text-[11px]">
                profiles, products, product_images, categories, orders, order_items, delivery_zones, affiliates, affiliate_links, affiliate_clicks, affiliate_sales, commissions, withdrawals, producer_wallets, affiliate_wallets, reviews, favorites, cart_items, coupons, banners, platform_settings.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-900 block mb-1">Políticas RLS:</span>
              <p className="text-slate-500 leading-relaxed text-[11px]">
                Row Level Security configurada para que clientes só visualizem as suas encomendas, produtores gerenciem os seus produtos, e afiliados acessem apenas as suas comissões.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-900 block mb-1">Conexão em Produção:</span>
              <p className="text-slate-500 leading-relaxed text-[11px]">
                Basta definir <code>VITE_SUPABASE_URL</code> e <code>VITE_SUPABASE_ANON_KEY</code> no seu arquivo <code>.env</code> para sincronização direta com a sua nuvem Supabase.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 text-slate-200 space-y-2 text-xs font-mono">
            <div className="flex justify-between items-center text-slate-400">
              <span>Pré-visualização do script SQL (/supabase/schema.sql)</span>
              <span className="text-[10px] text-emerald-400">PostgreSQL / Supabase 100% Compatível</span>
            </div>
            <pre className="text-[11px] overflow-x-auto text-emerald-300 max-h-48 p-2 bg-slate-950 rounded-xl">
{`-- Criar tipos enum e tabelas
CREATE TYPE app_role AS ENUM ('admin', 'producer', 'affiliate', 'client');
CREATE TABLE profiles (id UUID PRIMARY KEY REFERENCES auth.users(id), role app_role...);
CREATE TABLE products (id UUID PRIMARY KEY, price NUMERIC(14,2)...);
CREATE TABLE orders (id TEXT PRIMARY KEY, customer_id UUID, total NUMERIC...);
CREATE TABLE affiliate_sales (id UUID, affiliate_code TEXT, commission_amount NUMERIC...);
-- RLS Ativado em todas as tabelas
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Clients can view own orders" ON orders FOR SELECT USING (auth.uid() = customer_id);`}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
