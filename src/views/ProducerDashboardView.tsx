import React, { useState } from 'react';
import {
  Briefcase,
  Package,
  Plus,
  Edit2,
  Trash2,
  Pause,
  Play,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  X,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Phone,
  Image,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';

export const ProducerDashboardView: React.FC = () => {
  const {
    currentUser,
    products,
    categories,
    orders,
    addProduct,
    updateProduct,
    deleteProduct,
    formatKz,
    platformSettings,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'analytics'>('products');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form state for creating/editing product
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [subcategory, setSubcategory] = useState('');
  const [price, setPrice] = useState<number>(35000);
  const [promoPrice, setPromoPrice] = useState<number | undefined>(undefined);
  const [stock, setStock] = useState<number>(10);
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80');
  const [affiliateCommission, setAffiliateCommission] = useState<number>(10);
  const [pickupAddress, setPickupAddress] = useState(currentUser?.pickupAddress || 'Talatona, Luanda');
  const [phone, setPhone] = useState(currentUser?.phone || '+244 923 000 000');
  const [whatsapp, setWhatsapp] = useState(currentUser?.whatsapp || '+244 923 000 000');

  // Filter products belonging to this producer (or all products if producer is test mode)
  const myProducts = products.filter((p) => p.producerId === currentUser?.id || currentUser?.role === 'admin');

  // Filter orders containing items from this producer
  const myProducerOrders = orders.filter((o) =>
    o.items.some((i) => i.producerId === currentUser?.id || currentUser?.role === 'admin')
  );

  const totalGrossRevenue = myProducerOrders.reduce((sum, o) => {
    const producerItems = o.items.filter((i) => i.producerId === currentUser?.id || currentUser?.role === 'admin');
    return sum + producerItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, 0);

  // Platform fee deduction (Item 17: Taxa da plataforma 10% padrão configurável)
  const platformFeeAmount = Math.round((totalGrossRevenue * platformSettings.platformFeePercent) / 100);

  // Affiliate commissions paid
  const affiliateCommissionPaid = myProducerOrders.reduce((sum, o) => {
    const producerItems = o.items.filter((i) => i.producerId === currentUser?.id || currentUser?.role === 'admin');
    return sum + producerItems.reduce((acc, item) => acc + (item.commissionAmount || 0), 0);
  }, 0);

  const netProducerRevenue = Math.max(0, totalGrossRevenue - platformFeeAmount - affiliateCommissionPaid);

  const openNewProductModal = () => {
    setEditingProduct(null);
    setName('');
    setDescription('');
    setPrice(35000);
    setPromoPrice(undefined);
    setStock(10);
    setAffiliateCommission(10);
    setImageUrl('https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80');
    setModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setDescription(p.description);
    setCategoryId(p.categoryId);
    setSubcategory(p.subcategory || '');
    setPrice(p.price);
    setPromoPrice(p.promoPrice);
    setStock(p.stock);
    setImageUrl(p.images[0] || '');
    setAffiliateCommission(p.affiliateCommissionPercent);
    setPickupAddress(p.pickupAddress || '');
    setPhone(p.producerPhone || '');
    setWhatsapp(p.producerWhatsapp || '');
    setModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const selectedCat = categories.find((c) => c.id === categoryId) || categories[0];

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name,
        description,
        categoryId: selectedCat.id,
        categoryName: selectedCat.name,
        subcategory: subcategory || undefined,
        price,
        promoPrice: promoPrice && promoPrice < price ? promoPrice : undefined,
        discountPercent: promoPrice && promoPrice < price ? Math.round(((price - promoPrice) / price) * 100) : 0,
        stock,
        images: [imageUrl],
        affiliateCommissionPercent: affiliateCommission,
        pickupAddress,
        producerPhone: phone,
        producerWhatsapp: whatsapp,
      });
    } else {
      addProduct({
        slug: '',
        name,
        description,
        categoryId: selectedCat.id,
        categoryName: selectedCat.name,
        subcategory: subcategory || undefined,
        price,
        promoPrice: promoPrice && promoPrice < price ? promoPrice : undefined,
        discountPercent: promoPrice && promoPrice < price ? Math.round(((price - promoPrice) / price) * 100) : 0,
        stock,
        images: [imageUrl],
        producerId: currentUser?.id || 'prod-custom',
        producerName: currentUser?.storeName || currentUser?.name || 'Produtor Nacional',
        producerPhone: phone,
        producerWhatsapp: whatsapp,
        pickupAddress,
        affiliateCommissionPercent: affiliateCommission,
        status: 'active',
      });
    }

    setModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-emerald-800/60 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold bg-emerald-500/30 text-emerald-200 px-3 py-0.5 rounded-full border border-emerald-400/30">
              Painel do Produtor
            </span>
            <span className="text-xs font-bold text-slate-300">
              {currentUser?.storeName || 'Loja de Produtor'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Gestão de Catálogo & Vendas
          </h1>
          <p className="text-xs text-slate-300 max-w-lg">
            Cadastre os seus produtos, acompanhe o estoque em Luanda e gerencie as comissões pagas aos afiliados.
          </p>
        </div>

        <button
          onClick={openNewProductModal}
          className="px-5 py-3 rounded-2xl bg-white text-emerald-950 font-bold text-xs sm:text-sm hover:bg-emerald-50 transition shadow-lg flex items-center gap-2 self-start md:self-auto"
        >
          <Plus className="w-4 h-4 text-emerald-700" />
          <span>Cadastrar Novo Produto</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-500">Receita Líquida do Produtor</span>
          <p className="text-xl sm:text-2xl font-extrabold text-emerald-600">
            {formatKz(netProducerRevenue)}
          </p>
          <span className="text-[11px] text-slate-400 block pt-1">
            Após taxa da plataforma ({platformSettings.platformFeePercent}%) e afiliados
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-500">Vendas Brutas</span>
          <p className="text-xl sm:text-2xl font-extrabold text-slate-900">
            {formatKz(totalGrossRevenue)}
          </p>
          <span className="text-[11px] text-slate-400 block pt-1">
            {myProducerOrders.length} encomendas recebidas
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-500">Comissões Pagas a Afiliados</span>
          <p className="text-xl sm:text-2xl font-extrabold text-purple-600">
            {formatKz(affiliateCommissionPaid)}
          </p>
          <span className="text-[11px] text-slate-400 block pt-1">
            Investimento em divulgação por parceiros
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-500">Total de Produtos Cadastrados</span>
          <p className="text-xl sm:text-2xl font-extrabold text-blue-600">
            {myProducts.length}
          </p>
          <span className="text-[11px] text-slate-400 block pt-1">
            {myProducts.reduce((sum, p) => sum + p.stock, 0)} unidades em estoque
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-xs sm:text-sm font-bold">
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 border-b-2 transition ${
            activeTab === 'products'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Meus Produtos ({myProducts.length})
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 border-b-2 transition ${
            activeTab === 'orders'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Pedidos de Clientes ({myProducerOrders.length})
        </button>
      </div>

      {/* Products Catalog Table */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Produto</th>
                  <th className="py-3 px-4">Categoria</th>
                  <th className="py-3 px-4">Preço (Kz)</th>
                  <th className="py-3 px-4">Estoque</th>
                  <th className="py-3 px-4">Comissão Afiliado</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {myProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400 italic">
                      Ainda não cadastrou produtos. Clique em "Cadastrar Novo Produto" para começar.
                    </td>
                  </tr>
                ) : (
                  myProducts.map((p) => {
                    const effPrice = p.promoPrice || p.price;
                    return (
                      <tr key={p.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img src={p.images[0]} alt={p.name} className="w-12 h-12 rounded-xl object-cover" />
                            <div>
                              <p className="font-bold text-slate-900 line-clamp-1">{p.name}</p>
                              <span className="text-[10px] text-slate-400">ID: {p.id}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-medium">{p.categoryName}</td>
                        <td className="py-3 px-4">
                          <span className="font-bold block">{formatKz(effPrice)}</span>
                          {p.promoPrice && (
                            <span className="text-[10px] text-slate-400 line-through">
                              {formatKz(p.price)}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`font-extrabold ${
                              p.stock <= 3 ? 'text-rose-600' : 'text-slate-900'
                            }`}
                          >
                            {p.stock} un.
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                            {p.affiliateCommissionPercent}% ({formatKz(Math.round((effPrice * p.affiliateCommissionPercent) / 100))})
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              p.status === 'active'
                                ? 'bg-emerald-100 text-emerald-800'
                                : p.status === 'paused'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {p.status === 'active' ? 'Ativo' : p.status === 'paused' ? 'Pausado' : 'Esgotado'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                updateProduct(p.id, {
                                  status: p.status === 'active' ? 'paused' : 'active',
                                });
                              }}
                              className="p-1.5 rounded-lg border text-slate-600 hover:bg-slate-100"
                              title={p.status === 'active' ? 'Pausar produto' : 'Ativar produto'}
                            >
                              {p.status === 'active' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              onClick={() => openEditModal(p)}
                              className="p-1.5 rounded-lg border text-blue-600 hover:bg-blue-50"
                              title="Editar produto"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Deseja mesmo eliminar "${p.name}"?`)) {
                                  deleteProduct(p.id);
                                }
                              }}
                              className="p-1.5 rounded-lg border text-rose-600 hover:bg-rose-50"
                              title="Excluir produto"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Orders TAB */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Pedido</th>
                  <th className="py-3 px-4">Cliente</th>
                  <th className="py-3 px-4">Destino</th>
                  <th className="py-3 px-4">Artigos do Produtor</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {myProducerOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400 italic">
                      Ainda não recebeu pedidos para os seus produtos.
                    </td>
                  </tr>
                ) : (
                  myProducerOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-600">{ord.id}</td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900 block">{ord.customerName}</span>
                        <span className="text-[10px] text-slate-500">{ord.customerPhone}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold block">{ord.municipality}, {ord.province}</span>
                        <span className="text-[10px] text-slate-400">{ord.neighborhood}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        {ord.items.map((i) => (
                          <div key={i.id} className="text-[11px]">
                            {i.quantity}x {i.productName} ({formatKz(i.price)})
                          </div>
                        ))}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                          {ord.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">
                        {new Date(ord.createdAt).toLocaleDateString('pt-AO')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Product Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-4">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900">
              {editingProduct ? 'Editar Produto' : 'Cadastrar Novo Produto'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nome do Produto *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Vestido Samakaka com Tecido Tradicional"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Categoria *</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Subcategoria (Opcional)</label>
                  <input
                    type="text"
                    value={subcategory}
                    onChange={(e) => setSubcategory(e.target.value)}
                    placeholder="Ex: Roupa Feminina, Áudio..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Preço Normal (Kz) *</label>
                  <input
                    type="number"
                    required
                    min={100}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Preço Promo (Opcional)</label>
                  <input
                    type="number"
                    min={0}
                    value={promoPrice || ''}
                    onChange={(e) => setPromoPrice(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="Deixe vazio se sem desconto"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Estoque Disponível *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Comissão do Afiliado (% sobre a venda) *
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={5}
                    max={30}
                    value={affiliateCommission}
                    onChange={(e) => setAffiliateCommission(Number(e.target.value))}
                    className="flex-1 accent-purple-600"
                  />
                  <span className="font-extrabold text-sm text-purple-700 bg-purple-50 px-3 py-1 rounded-lg">
                    {affiliateCommission}%
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Quanto maior a comissão, mais afiliados divulgarão o seu produto nas redes sociais angolanas.
                </p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">URL da Imagem Principal *</label>
                <input
                  type="url"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Descrição Completa *</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detalhes sobre tecido, medidas, garantia, autenticidade..."
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Endereço de Recolha</label>
                  <input
                    type="text"
                    value={pickupAddress}
                    onChange={(e) => setPickupAddress(e.target.value)}
                    placeholder="Ex: Talatona, Morro Bento"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">WhatsApp do Vendedor</label>
                  <input
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="+244 923 000 000"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md"
                >
                  {editingProduct ? 'Guardar Alterações' : 'Publicar Produto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
