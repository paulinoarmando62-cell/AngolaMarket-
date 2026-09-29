import React, { useState } from 'react';
import {
  User,
  ShoppingBag,
  Heart,
  MapPin,
  Star,
  Settings,
  LogOut,
  ChevronRight,
  TrendingUp,
  Briefcase,
  ShieldCheck,
  KeyRound,
  Lock,
  CheckCircle2,
  Clock,
  Building,
  Check,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/product/ProductCard';

export const CustomerAccountView: React.FC = () => {
  const {
    currentUser,
    orders,
    products,
    favorites,
    reviews,
    formatKz,
    logout,
    navigate,
    applyToBecomeAffiliate,
    applyToBecomeProducer,
    updateUserProfile,
    updatePassword,
  } = useStore();

  const [activeTab, setActiveTab] = useState<
    'orders' | 'favorites' | 'profile' | 'security' | 'producer' | 'reviews'
  >('orders');

  // Profile fields
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [whatsapp, setWhatsapp] = useState(currentUser?.whatsapp || '');
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Security / Password change fields (Item 2)
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdMsg, setPwdMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Producer application fields (Item 11)
  const [businessName, setBusinessName] = useState(currentUser?.storeName || '');
  const [description, setDescription] = useState('');
  const [producerPhone, setProducerPhone] = useState(currentUser?.phone || '+244 9');
  const [producerWhatsapp, setProducerWhatsapp] = useState(currentUser?.whatsapp || '+244 9');
  const [pickupAddress, setPickupAddress] = useState(currentUser?.pickupAddress || '');
  const [province, setProvince] = useState('Luanda');
  const [municipality, setMunicipality] = useState('Talatona');
  const [producerFeedback, setProducerFeedback] = useState<string | null>(null);

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  const userOrders = orders.filter((o) => o.customerId === currentUser.id);
  const favoriteProducts = products.filter((p) => favorites.includes(p.id));
  const userReviews = reviews.filter((r) => r.userId === currentUser.id);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({ name, phone, whatsapp, fullName: name });
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 2500);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPwdMsg(null);

    if (newPassword.length < 6) {
      setPwdMsg({ text: 'A nova palavra-passe deve conter pelo menos 6 caracteres.', type: 'error' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwdMsg({ text: 'As palavras-passe introduzidas não coincidem.', type: 'error' });
      return;
    }

    const res = updatePassword(newPassword);
    setPwdMsg({ text: res.message, type: res.success ? 'success' : 'error' });
    if (res.success) {
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  const handleProducerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim() || !pickupAddress.trim()) {
      setProducerFeedback('Por favor preencha o nome da loja e o endereço de recolha.');
      return;
    }

    const res = applyToBecomeProducer({
      businessName: businessName.trim(),
      description: description.trim(),
      phone: producerPhone.trim(),
      whatsapp: producerWhatsapp.trim(),
      pickupAddress: pickupAddress.trim(),
      province,
      municipality,
    });

    setProducerFeedback(res.message);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Account Hero Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-extrabold text-2xl shadow-md overflow-hidden">
            {currentUser.avatar ? (
              <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
            ) : (
              currentUser.name.charAt(0)
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                {currentUser.name}
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase">
                {currentUser.status || 'Ativo'}
              </span>
            </div>
            <p className="text-xs text-slate-500">{currentUser.email}</p>
            <div className="flex flex-wrap items-center gap-2 mt-1.5">
              <span className="text-[11px] font-bold bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full uppercase border border-blue-200">
                Função: {currentUser.role}
              </span>
              {currentUser.affiliateCode && (
                <span className="text-[11px] font-mono font-bold bg-purple-50 text-purple-700 px-2.5 py-0.5 rounded-full border border-purple-200">
                  Código Afiliado: {currentUser.affiliateCode}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Quick Role Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {currentUser.role === 'client' && (
            <>
              {currentUser.affiliateStatus === 'pending' ? (
                <span className="px-3 py-2 rounded-xl bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200 flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>Afiliado em Análise</span>
                </span>
              ) : (
                <button
                  onClick={() => navigate('/afiliados')}
                  className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5"
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>Quero ser Afiliado</span>
                </button>
              )}

              {currentUser.producerStatus === 'pending' ? (
                <span className="px-3 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>Produtor em Análise</span>
                </span>
              ) : (
                <button
                  onClick={() => setActiveTab('producer')}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5"
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Vender como Produtor</span>
                </button>
              )}
            </>
          )}

          {currentUser.role === 'affiliate' && (
            <button
              onClick={() => navigate('/afiliado/dashboard')}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5"
            >
              <TrendingUp className="w-4 h-4" />
              <span>Painel de Afiliado</span>
            </button>
          )}

          {currentUser.role === 'producer' && (
            <button
              onClick={() => navigate('/produtor/dashboard')}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5"
            >
              <Briefcase className="w-4 h-4" />
              <span>Painel do Produtor</span>
            </button>
          )}

          {currentUser.role === 'admin' && (
            <button
              onClick={() => navigate('/admin')}
              className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Painel de Admin</span>
            </button>
          )}

          <button
            onClick={logout}
            className="px-4 py-2.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-bold transition border border-rose-200 flex items-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>Sair</span>
          </button>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex border-b border-slate-200 overflow-x-auto no-scrollbar gap-2 sm:gap-6 text-xs sm:text-sm font-bold">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 px-2 border-b-2 transition whitespace-nowrap ${
            activeTab === 'orders'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Meus Pedidos ({userOrders.length})
        </button>

        <button
          onClick={() => setActiveTab('favorites')}
          className={`pb-3 px-2 border-b-2 transition whitespace-nowrap ${
            activeTab === 'favorites'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Favoritos ({favoriteProducts.length})
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 px-2 border-b-2 transition whitespace-nowrap ${
            activeTab === 'profile'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Dados do Perfil
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`pb-3 px-2 border-b-2 transition whitespace-nowrap ${
            activeTab === 'security'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Segurança & Senha
        </button>

        {currentUser.role === 'client' && (
          <button
            onClick={() => setActiveTab('producer')}
            className={`pb-3 px-2 border-b-2 transition whitespace-nowrap ${
              activeTab === 'producer'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Seja Produtor
          </button>
        )}

        <button
          onClick={() => setActiveTab('reviews')}
          className={`pb-3 px-2 border-b-2 transition whitespace-nowrap ${
            activeTab === 'reviews'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Minhas Avaliações ({userReviews.length})
        </button>
      </div>

      {/* TAB CONTENT: Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {userOrders.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-xs space-y-3">
              <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-900">Nenhum pedido realizado ainda</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Explore os nossos produtos com entrega rápida em Luanda e províncias de Angola.
              </p>
              <button
                onClick={() => navigate('/produtos')}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition"
              >
                Começar a Comprar
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {userOrders.map((ord) => (
                <div
                  key={ord.id}
                  onClick={() => navigate(`/pedido/${ord.id}`)}
                  className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs hover:shadow-md hover:border-blue-200 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-slate-900">
                        {ord.id}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          ord.status === 'Entregue'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {ord.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      {ord.items.length} artigo(s) • Entregar em {ord.municipality}, {ord.province}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Data: {new Date(ord.createdAt).toLocaleDateString('pt-AO')}
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">Total:</span>
                      <span className="text-sm font-extrabold text-slate-900">
                        {formatKz(ord.total)}
                      </span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: Favorites */}
      {activeTab === 'favorites' && (
        <div>
          {favoriteProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-xs space-y-3">
              <Heart className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-900">Nenhum produto guardado</h3>
              <p className="text-xs text-slate-500">
                Toque no coração dos produtos que você gostar para guardá-los aqui.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {favoriteProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: Profile Form */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs max-w-xl">
          <h3 className="text-base font-bold text-slate-900 mb-4">Informações do Perfil</h3>

          {profileSuccess && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-semibold flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>Perfil atualizado com sucesso!</span>
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nome Completo</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email (Identificador único)</label>
              <input
                type="email"
                disabled
                value={currentUser.email}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Telefone Principal</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">WhatsApp</label>
              <input
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white"
              />
            </div>

            <button
              type="submit"
              className="py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition shadow-xs"
            >
              Guardar Alterações
            </button>
          </form>
        </div>
      )}

      {/* TAB CONTENT: Security & Password (Item 2) */}
      {activeTab === 'security' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs max-w-xl space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">Alteração de Palavra-passe</h3>
            <p className="text-xs text-slate-500">Mantenha a sua conta da AngolaMarket segura.</p>
          </div>

          {pwdMsg && (
            <div
              className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                pwdMsg.type === 'success'
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border border-rose-200 text-rose-800'
              }`}
            >
              {pwdMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              <span>{pwdMsg.text}</span>
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nova Palavra-passe *</label>
              <input
                type="password"
                required
                placeholder="Mínimo 6 caracteres"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Confirmar Nova Palavra-passe *</label>
              <input
                type="password"
                required
                placeholder="Repita a nova palavra-passe"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white"
              />
            </div>

            <button
              type="submit"
              className="py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition shadow-xs flex items-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>Atualizar Palavra-passe</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB CONTENT: Producer Application (Item 11) */}
      {activeTab === 'producer' && currentUser.role === 'client' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs max-w-2xl space-y-6">
          <div>
            <div className="flex items-center gap-2 text-emerald-600">
              <Building className="w-5 h-5" />
              <h3 className="text-base font-bold text-slate-900">Candidatura para Produtor / Vendedor</h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Cadastre a sua empresa ou marca local para vender produtos na AngolaMarket. O pedido é avaliado pelo administrador.
            </p>
          </div>

          {producerFeedback && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-xs font-semibold">
              {producerFeedback}
            </div>
          )}

          {currentUser.producerStatus === 'pending' ? (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
              <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-xs text-amber-900">Candidatura em Análise Administrativa</h4>
                <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
                  A sua loja "{currentUser.storeName}" está a ser analisada pelo administrador. Quando aprovada, o seu perfil mudará automaticamente para Produtor e poderá cadastrar produtos.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleProducerSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nome da Loja / Marca *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Atelier Samakaka Luanda"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Descrição do Negócio</label>
                <textarea
                  rows={3}
                  placeholder="Descreva que tipo de produtos produz ou vende em Angola..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Telefone Comercial *</label>
                  <input
                    type="tel"
                    required
                    value={producerPhone}
                    onChange={(e) => setProducerPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">WhatsApp Comercial *</label>
                  <input
                    type="tel"
                    required
                    value={producerWhatsapp}
                    onChange={(e) => setProducerWhatsapp(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Província *</label>
                  <select
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white"
                  >
                    <option value="Luanda">Luanda</option>
                    <option value="Benguela">Benguela</option>
                    <option value="Huambo">Huambo</option>
                    <option value="Huíla">Huíla</option>
                    <option value="Cabinda">Cabinda</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Município *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Talatona, Kilamba, Maianga"
                    value={municipality}
                    onChange={(e) => setMunicipality(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Endereço de Recolha de Mercadoria *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Rua Comandante Gika, Bairro Alvalade, Prédio 12"
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white"
                />
              </div>

              <button
                type="submit"
                className="py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition shadow-xs flex items-center gap-2"
              >
                <Briefcase className="w-4 h-4" />
                <span>Submeter Candidatura de Produtor</span>
              </button>
            </form>
          )}
        </div>
      )}

      {/* TAB CONTENT: Reviews */}
      {activeTab === 'reviews' && (
        <div className="space-y-4 max-w-2xl">
          {userReviews.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-xs space-y-2">
              <Star className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-900">Ainda não fez nenhuma avaliação</h3>
              <p className="text-xs text-slate-500">
                Após receber os seus pedidos, avalie os produtos para ajudar outros compradores em Angola.
              </p>
            </div>
          ) : (
            userReviews.map((rev) => (
              <div key={rev.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${s <= rev.rating ? 'fill-amber-400' : 'text-slate-200'}`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-slate-400">{rev.date}</span>
                </div>
                <p className="text-xs text-slate-700">{rev.comment}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
