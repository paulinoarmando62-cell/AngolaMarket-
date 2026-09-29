import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  UserRole,
  UserStatus,
  Product,
  Category,
  CartItem,
  Order,
  OrderStatus,
  PaymentMethod,
  DeliveryZone,
  AffiliateSale,
  WithdrawalRequest,
  WithdrawalMethod,
  Coupon,
  Banner,
  Review,
  NotificationItem,
  PlatformSettings,
  AuditLog,
  ProducerApplication,
} from '../types';
import {
  INITIAL_ADMIN,
  INITIAL_PRODUCERS,
  INITIAL_AFFILIATES,
  INITIAL_CLIENTS,
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_DELIVERY_ZONES,
  INITIAL_ORDERS,
  INITIAL_AFFILIATE_SALES,
  INITIAL_WITHDRAWALS,
  INITIAL_COUPONS,
  INITIAL_BANNERS,
  INITIAL_REVIEWS,
  INITIAL_NOTIFICATIONS,
  INITIAL_PLATFORM_SETTINGS,
  INITIAL_AUDIT_LOGS,
  INITIAL_PRODUCER_APPLICATIONS,
} from '../lib/mockData';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

interface StoreContextType {
  // Navigation & Routing
  currentRoute: string;
  navigate: (route: string) => void;
  affiliateRefFromUrl: string | null;

  // Auth & Roles
  currentUser: UserProfile | null;
  users: UserProfile[];
  login: (email: string, password?: string) => { success: boolean; message?: string; role?: UserRole; redirectUrl?: string };
  register: (userData: Partial<UserProfile>, password?: string) => { success: boolean; message?: string; redirectUrl?: string };
  logout: () => void;
  switchUserQuick: (role: UserRole) => void;
  updateUserProfile: (data: Partial<UserProfile>) => void;
  updatePassword: (newPassword: string) => { success: boolean; message: string };
  requestPasswordReset: (email: string) => { success: boolean; message: string };

  // RBAC & User Administration
  promoteToAdmin: (userId: string) => { success: boolean; message: string };
  updateUserStatus: (userId: string, status: UserStatus) => void;

  // Audit Logs
  auditLogs: AuditLog[];
  addAuditLog: (action: string, entity: string, entityId: string, metadata?: Record<string, unknown>) => void;

  // Producer Applications
  producerApplications: ProducerApplication[];
  applyToBecomeProducer: (data: {
    businessName: string;
    description: string;
    phone: string;
    whatsapp: string;
    pickupAddress: string;
    province: string;
    municipality: string;
  }) => { success: boolean; message: string };
  approveProducer: (userId: string, approved: boolean) => void;

  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviewCount' | 'isApproved'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  approveProduct: (id: string, approve: boolean) => void;

  // Categories
  categories: Category[];
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  // Cart & Checkout
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, affiliateRef?: string) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  selectedDeliveryZone: DeliveryZone | null;
  setSelectedDeliveryZone: (zone: DeliveryZone | null) => void;
  deliveryCost: number;
  discountAmount: number;
  cartTotal: number;

  // Orders
  orders: Order[];
  createOrder: (orderData: {
    customerName: string;
    customerPhone: string;
    customerWhatsapp?: string;
    province: string;
    municipality: string;
    neighborhood: string;
    address: string;
    referencePoint?: string;
    notes?: string;
    paymentMethod: PaymentMethod;
  }) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updateOrderPayment: (orderId: string, paymentStatus: 'verified' | 'failed' | 'paid_on_delivery', reference?: string) => void;

  // Delivery Zones
  deliveryZones: DeliveryZone[];
  updateDeliveryZone: (id: string, updates: Partial<DeliveryZone>) => void;
  addDeliveryZone: (zone: Omit<DeliveryZone, 'id'>) => void;

  // Affiliates & Commissions
  affiliates: UserProfile[];
  affiliateSales: AffiliateSale[];
  withdrawals: WithdrawalRequest[];
  recordAffiliateClick: (affiliateCode: string, productId: string) => void;
  requestWithdrawal: (data: {
    amount: number;
    method: WithdrawalMethod;
    accountNumber: string;
    accountHolderName: string;
    notes?: string;
  }) => { success: boolean; message: string };
  approveWithdrawal: (withdrawalId: string) => void;
  rejectWithdrawal: (withdrawalId: string, reason: string) => void;
  applyToBecomeAffiliate: () => { success: boolean; message: string };
  approveAffiliate: (affiliateId: string, approved: boolean) => void;

  // Settings & Configuration
  platformSettings: PlatformSettings;
  updatePlatformSettings: (settings: Partial<PlatformSettings>) => void;

  // Reviews & Favorites
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'date'>) => void;
  favorites: string[];
  toggleFavorite: (productId: string) => void;

  // Banners & Coupons
  banners: Banner[];
  coupons: Coupon[];
  addCoupon: (coupon: Omit<Coupon, 'id' | 'usageCount'>) => void;
  toggleCoupon: (id: string) => void;

  // Notifications
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Utilities
  formatKz: (amount: number) => string;
  resetAllToDemoData: () => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

const STORAGE_PREFIX = 'angolamarket_v1_';

function getStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(STORAGE_PREFIX + key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage`, e);
    return defaultValue;
  }
}

function setStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error writing ${key} to localStorage`, e);
  }
}

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation / Route state
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    return window.location.pathname && window.location.pathname !== '/'
      ? window.location.pathname + window.location.search
      : '/';
  });

  const [affiliateRefFromUrl, setAffiliateRefFromUrl] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('ref') || null;
  });

  // Handle URL changes & popstate
  const navigate = (route: string) => {
    setCurrentRoute(route);
    window.history.pushState({}, '', route);
    // Parse affiliate ref if present
    try {
      const url = new URL(route, window.location.origin);
      const ref = url.searchParams.get('ref');
      if (ref) {
        setAffiliateRefFromUrl(ref);
      }
    } catch {
      // fallback
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(window.location.pathname + window.location.search);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Primary State initialized from localStorage or Mock data
  const [allUsers, setAllUsers] = useState<UserProfile[]>(() =>
    getStorage('users', [INITIAL_ADMIN, ...INITIAL_PRODUCERS, ...INITIAL_AFFILIATES, ...INITIAL_CLIENTS])
  );

  // Default active user is the first client (Ana Paula) to give immediate interactive experience, or stored user
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() =>
    getStorage('current_user', INITIAL_CLIENTS[0])
  );

  const [products, setProducts] = useState<Product[]>(() =>
    getStorage('products', INITIAL_PRODUCTS)
  );

  const [categories, setCategories] = useState<Category[]>(() =>
    getStorage('categories', INITIAL_CATEGORIES)
  );

  const [cart, setCart] = useState<CartItem[]>(() =>
    getStorage('cart', [])
  );

  const [orders, setOrders] = useState<Order[]>(() =>
    getStorage('orders', INITIAL_ORDERS)
  );

  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>(() =>
    getStorage('delivery_zones', INITIAL_DELIVERY_ZONES)
  );

  const [selectedDeliveryZone, setSelectedDeliveryZone] = useState<DeliveryZone | null>(() =>
    INITIAL_DELIVERY_ZONES[0]
  );

  const [affiliateSales, setAffiliateSales] = useState<AffiliateSale[]>(() =>
    getStorage('affiliate_sales', INITIAL_AFFILIATE_SALES)
  );

  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>(() =>
    getStorage('withdrawals', INITIAL_WITHDRAWALS)
  );

  const [coupons, setCoupons] = useState<Coupon[]>(() =>
    getStorage('coupons', INITIAL_COUPONS)
  );

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  const [banners, setBanners] = useState<Banner[]>(() =>
    getStorage('banners', INITIAL_BANNERS)
  );

  const [reviews, setReviews] = useState<Review[]>(() =>
    getStorage('reviews', INITIAL_REVIEWS)
  );

  const [favorites, setFavorites] = useState<string[]>(() =>
    getStorage('favorites', ['prod-p1', 'prod-p3'])
  );

  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    getStorage('notifications', INITIAL_NOTIFICATIONS)
  );

  const [platformSettings, setPlatformSettings] = useState<PlatformSettings>(() =>
    getStorage('platform_settings', INITIAL_PLATFORM_SETTINGS)
  );

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() =>
    getStorage('audit_logs', INITIAL_AUDIT_LOGS)
  );

  const [producerApplications, setProducerApplications] = useState<ProducerApplication[]>(() =>
    getStorage('producer_applications', INITIAL_PRODUCER_APPLICATIONS)
  );

  // Auto-sync state to localStorage
  useEffect(() => setStorage('users', allUsers), [allUsers]);
  useEffect(() => setStorage('current_user', currentUser), [currentUser]);
  useEffect(() => setStorage('products', products), [products]);
  useEffect(() => setStorage('categories', categories), [categories]);
  useEffect(() => setStorage('cart', cart), [cart]);
  useEffect(() => setStorage('orders', orders), [orders]);
  useEffect(() => setStorage('delivery_zones', deliveryZones), [deliveryZones]);
  useEffect(() => setStorage('affiliate_sales', affiliateSales), [affiliateSales]);
  useEffect(() => setStorage('withdrawals', withdrawals), [withdrawals]);
  useEffect(() => setStorage('coupons', coupons), [coupons]);
  useEffect(() => setStorage('banners', banners), [banners]);
  useEffect(() => setStorage('reviews', reviews), [reviews]);
  useEffect(() => setStorage('favorites', favorites), [favorites]);
  useEffect(() => setStorage('notifications', notifications), [notifications]);
  useEffect(() => setStorage('platform_settings', platformSettings), [platformSettings]);
  useEffect(() => setStorage('audit_logs', auditLogs), [auditLogs]);
  useEffect(() => setStorage('producer_applications', producerApplications), [producerApplications]);

  // Helper to add audit logs
  const addAuditLog = (
    action: string,
    entity: string,
    entityId: string,
    metadata?: Record<string, unknown>
  ) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      userId: currentUser?.id,
      userEmail: currentUser?.email,
      userName: currentUser?.name,
      action,
      entity,
      entityId,
      metadata: metadata || {},
      createdAt: new Date().toISOString(),
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    // If Supabase is connected, record audit log in remote database table
    if (isSupabaseConfigured && supabase) {
      supabase
        .from('audit_logs')
        .insert([
          {
            user_id: currentUser?.id,
            action,
            entity,
            entity_id: entityId,
            metadata: metadata || {},
          },
        ])
        .then();
    }
  };

  // Auth Functions
  const login = (
    email: string,
    password?: string
  ): { success: boolean; message?: string; role?: UserRole; redirectUrl?: string } => {
    const cleanEmail = email.trim().toLowerCase();
    const found = allUsers.find((u) => u.email.toLowerCase() === cleanEmail);

    if (found) {
      if (found.status === 'blocked' || found.status === 'suspended') {
        return {
          success: false,
          message: 'Esta conta encontra-se suspensa ou bloqueada. Contacte o suporte da AngolaMarket.',
        };
      }

      setCurrentUser(found);
      addAuditLog('USER_LOGIN', 'profiles', found.id, { email: found.email, role: found.role });

      let redirectUrl = '/minha-conta';
      if (found.role === 'admin') redirectUrl = '/admin';
      else if (found.role === 'affiliate') redirectUrl = '/afiliado/dashboard';
      else if (found.role === 'producer') redirectUrl = '/produtor/dashboard';

      return { success: true, role: found.role, redirectUrl };
    }

    // Auto-create client user if not exists for frictionless testing
    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      userId: `user-${Date.now()}`,
      email: cleanEmail,
      name: cleanEmail.split('@')[0],
      fullName: cleanEmail.split('@')[0],
      phone: '+244 923 000 000',
      whatsapp: '+244 923 000 000',
      role: 'client',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setAllUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    addAuditLog('USER_AUTO_CREATED', 'profiles', newUser.id, { email: newUser.email });

    return { success: true, role: 'client', redirectUrl: '/minha-conta' };
  };

  const register = (
    userData: Partial<UserProfile>,
    password?: string
  ): { success: boolean; message?: string; redirectUrl?: string } => {
    if (!userData.email || !userData.name) {
      return { success: false, message: 'Nome e email são obrigatórios.' };
    }

    // Item 3: Um usuário comum começa como: CLIENTE.
    // O usuário não pode escolher ser administrador durante o cadastro.
    const role: UserRole = 'client';
    const status: UserStatus = 'active';

    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      userId: `user-${Date.now()}`,
      email: userData.email.trim(),
      name: userData.name.trim(),
      fullName: userData.name.trim(),
      phone: userData.phone?.trim() || '+244 900 000 000',
      whatsapp: userData.whatsapp?.trim() || userData.phone?.trim() || '+244 900 000 000',
      role,
      status,
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setAllUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);

    addAuditLog('USER_REGISTRATION', 'profiles', newUser.id, { email: newUser.email, role: 'client' });

    // Create welcome notification
    addNotification({
      userId: newUser.id,
      roleTarget: 'client',
      title: `Bem-vindo(a) à AngolaMarket, ${newUser.name}!`,
      message: 'A sua conta de Cliente foi criada com sucesso.',
      type: 'system',
      linkUrl: '/minha-conta',
    });

    return { success: true, redirectUrl: '/minha-conta' };
  };

  const requestPasswordReset = (email: string): { success: boolean; message: string } => {
    const cleanEmail = email.trim().toLowerCase();
    const user = allUsers.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!user) {
      return { success: false, message: 'Nenhuma conta encontrada com este endereço de email.' };
    }
    addAuditLog('PASSWORD_RESET_REQUESTED', 'profiles', user.id, { email: user.email });
    return {
      success: true,
      message: `Enviámos as instruções de recuperação para ${email}. Verifique a sua caixa de correio.`,
    };
  };

  const updatePassword = (newPassword: string): { success: boolean; message: string } => {
    if (!currentUser) {
      return { success: false, message: 'Precisa de ter sessão iniciada para alterar a senha.' };
    }
    if (!newPassword || newPassword.length < 6) {
      return { success: false, message: 'A nova senha deve ter pelo menos 6 caracteres.' };
    }
    addAuditLog('PASSWORD_UPDATED', 'profiles', currentUser.id, { email: currentUser.email });
    return { success: true, message: 'Senha atualizada com sucesso!' };
  };

  // RBAC: Promover usuário a admin (Item 4: apenas um administrador existente pode criar novos administradores)
  const promoteToAdmin = (userId: string): { success: boolean; message: string } => {
    if (currentUser?.role !== 'admin') {
      return {
        success: false,
        message: 'Apenas administradores existentes podem promover outros utilizadores para Administrador.',
      };
    }
    const target = allUsers.find((u) => u.id === userId);
    if (!target) {
      return { success: false, message: 'Utilizador não encontrado.' };
    }

    setAllUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: 'admin' as UserRole, updatedAt: new Date().toISOString() } : u))
    );

    addAuditLog('ADMIN_PROMOTION', 'profiles', userId, {
      promotedEmail: target.email,
      promotedBy: currentUser.email,
    });

    return { success: true, message: `O utilizador ${target.name} é agora um Administrador.` };
  };

  const updateUserStatus = (userId: string, status: UserStatus) => {
    if (currentUser?.role !== 'admin') return;

    setAllUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status, updatedAt: new Date().toISOString() } : u))
    );

    if (currentUser && currentUser.id === userId) {
      setCurrentUser((prev) => (prev ? { ...prev, status } : null));
    }

    addAuditLog('USER_STATUS_CHANGE', 'profiles', userId, { status });
  };

  const logout = () => {
    setCurrentUser(null);
    navigate('/');
  };

  const switchUserQuick = (role: UserRole) => {
    let target = allUsers.find((u) => u.role === role);
    if (!target) {
      if (role === 'admin') target = INITIAL_ADMIN;
      else if (role === 'producer') target = INITIAL_PRODUCERS[0];
      else if (role === 'affiliate') target = INITIAL_AFFILIATES[0];
      else target = INITIAL_CLIENTS[0];
    }
    setCurrentUser(target);
  };

  const updateUserProfile = (data: Partial<UserProfile>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...data };
    setCurrentUser(updated);
    setAllUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updated : u)));
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1, affiliateRef?: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      const effectiveRef = affiliateRef || affiliateRefFromUrl || undefined;
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity, affiliateRef: item.affiliateRef || effectiveRef }
            : item
        );
      }
      return [...prev, { product, quantity, affiliateRef: effectiveRef }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setCart([]);

  const cartSubtotal = cart.reduce((acc, item) => {
    const itemPrice = item.product.promoPrice || item.product.price;
    return acc + itemPrice * item.quantity;
  }, 0);

  const deliveryCost = selectedDeliveryZone ? selectedDeliveryZone.price : 2500;

  const applyCoupon = (code: string) => {
    const found = coupons.find((c) => c.code.toUpperCase() === code.trim().toUpperCase() && c.isActive);
    if (!found) {
      return { success: false, message: 'Cupom inválido ou expirado.' };
    }
    if (found.minOrderAmount && cartSubtotal < found.minOrderAmount) {
      return {
        success: false,
        message: `Este cupom requer um pedido mínimo de ${formatKz(found.minOrderAmount)}.`,
      };
    }
    setAppliedCoupon(found);
    return { success: true, message: `Cupom ${found.code} aplicado com sucesso!` };
  };

  const removeCoupon = () => setAppliedCoupon(null);

  const discountAmount = appliedCoupon
    ? appliedCoupon.discountType === 'percentage'
      ? Math.round((cartSubtotal * appliedCoupon.discountValue) / 100)
      : appliedCoupon.discountValue
    : 0;

  const cartTotal = Math.max(0, cartSubtotal - discountAmount + (cart.length > 0 ? deliveryCost : 0));

  // Orders
  const createOrder = (orderData: {
    customerName: string;
    customerPhone: string;
    customerWhatsapp?: string;
    province: string;
    municipality: string;
    neighborhood: string;
    address: string;
    referencePoint?: string;
    notes?: string;
    paymentMethod: PaymentMethod;
  }): Order => {
    // Generate unique order number AM-2026-00000X
    const orderNumber = `AM-2026-${String(orders.length + 1).padStart(6, '0')}`;

    const newOrder: Order = {
      id: orderNumber,
      customerId: currentUser?.id || `guest-${Date.now()}`,
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      customerWhatsapp: orderData.customerWhatsapp || orderData.customerPhone,
      province: orderData.province,
      municipality: orderData.municipality,
      neighborhood: orderData.neighborhood,
      address: orderData.address,
      referencePoint: orderData.referencePoint,
      notes: orderData.notes,
      items: cart.map((item, idx) => {
        const itemPrice = item.product.promoPrice || item.product.price;
        const commRate = item.product.affiliateCommissionPercent || 10;
        const commAmount = Math.round((itemPrice * item.quantity * commRate) / 100);
        return {
          id: `item-${Date.now()}-${idx}`,
          productId: item.product.id,
          productName: item.product.name,
          productImage: item.product.images[0],
          price: itemPrice,
          quantity: item.quantity,
          producerId: item.product.producerId,
          affiliateRef: item.affiliateRef || affiliateRefFromUrl || undefined,
          commissionAmount: commAmount,
        };
      }),
      subtotal: cartSubtotal,
      deliveryCost,
      discount: discountAmount,
      total: cartTotal,
      status: 'Pedido recebido',
      paymentMethod: orderData.paymentMethod,
      paymentStatus: orderData.paymentMethod === 'Pagamento na entrega' ? 'paid_on_delivery' : 'pending',
      paymentReference: `${orderData.paymentMethod.substring(0, 3).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Attribute Affiliate Sales if items had an affiliate ref
    newOrder.items.forEach((item) => {
      if (item.affiliateRef) {
        const matchingAff = allUsers.find((u) => u.affiliateCode === item.affiliateRef);
        const commAmount = item.commissionAmount || Math.round((item.price * item.quantity * 0.1));
        const newSale: AffiliateSale = {
          id: `sale-${Date.now()}-${Math.random().toString(36).substring(7)}`,
          affiliateCode: item.affiliateRef,
          orderId: orderNumber,
          productId: item.productId,
          productName: item.productName,
          saleAmount: item.price * item.quantity,
          commissionRate: 10,
          commissionAmount: commAmount,
          status: 'Pendente',
          createdAt: new Date().toISOString(),
        };
        setAffiliateSales((prev) => [newSale, ...prev]);

        // Notify Affiliate
        if (matchingAff) {
          addNotification({
            userId: matchingAff.id,
            roleTarget: 'affiliate',
            title: 'Nova Venda de Afiliado Gerada!',
            message: `A sua divulgação gerou uma venda no pedido ${orderNumber}. Comissão estimada: ${formatKz(commAmount)}.`,
            type: 'commission',
            linkUrl: '/afiliado/dashboard',
          });
        }
      }
    });

    // Notify Producers
    const uniqueProducers = Array.from(new Set(newOrder.items.map((i) => i.producerId)));
    uniqueProducers.forEach((pId) => {
      addNotification({
        userId: pId,
        roleTarget: 'producer',
        title: `Novo Pedido Recebido (${orderNumber})`,
        message: `Recebeu uma nova encomenda contendo produtos da sua loja.`,
        type: 'order',
        linkUrl: '/produtor/pedidos',
      });
    });

    // Notify Admin
    addNotification({
      roleTarget: 'admin',
      title: `Novo Pedido na Plataforma (${orderNumber})`,
      message: `Cliente ${orderData.customerName} realizou um pedido de ${formatKz(cartTotal)}.`,
      type: 'order',
      linkUrl: '/admin/pedidos',
    });

    // Notify Customer
    addNotification({
      userId: newOrder.customerId,
      roleTarget: 'client',
      title: `Pedido ${orderNumber} Confirmado!`,
      message: `Recebemos o seu pedido com sucesso. Acompanhe a entrega em Meus Pedidos.`,
      type: 'order',
      linkUrl: `/pedido/${orderNumber}`,
    });

    // Deduct stock for each product ordered
    setProducts((prev) =>
      prev.map((prod) => {
        const orderedItem = newOrder.items.find((i) => i.productId === prod.id);
        if (orderedItem) {
          const newStock = Math.max(0, prod.stock - orderedItem.quantity);
          return {
            ...prod,
            stock: newStock,
            status: newStock === 0 ? 'out_of_stock' : prod.status,
          };
        }
        return prod;
      })
    );

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setAppliedCoupon(null);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const updated = { ...ord, status, updatedAt: new Date().toISOString() };
          
          // If status is 'Entregue', release affiliate commissions to 'Disponível'
          if (status === 'Entregue' && platformSettings.autoMakeCommissionAvailableOnDelivery) {
            setAffiliateSales((sales) =>
              sales.map((s) => (s.orderId === orderId ? { ...s, status: 'Disponível' } : s))
            );
          }
          return updated;
        }
        return ord;
      })
    );
  };

  const updateOrderPayment = (
    orderId: string,
    paymentStatus: 'verified' | 'failed' | 'paid_on_delivery',
    reference?: string
  ) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId
          ? {
              ...ord,
              paymentStatus,
              paymentReference: reference || ord.paymentReference,
              status: paymentStatus === 'verified' ? 'Pagamento confirmado' : ord.status,
              updatedAt: new Date().toISOString(),
            }
          : ord
      )
    );
  };

  // Products
  const addProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviewCount' | 'isApproved'>) => {
    const slug = productData.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const newProd: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      slug: `${slug}-${Math.floor(100 + Math.random() * 900)}`,
      rating: 5.0,
      reviewCount: 0,
      isApproved: !platformSettings.requireProductApproval,
      createdAt: new Date().toISOString(),
    };

    setProducts((prev) => [newProd, ...prev]);

    addNotification({
      roleTarget: 'admin',
      title: 'Novo Produto Cadastrado',
      message: `O produtor ${newProd.producerName} cadastrou o produto "${newProd.name}".`,
      type: 'product',
      linkUrl: '/admin/produtos',
    });
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const approveProduct = (id: string, approve: boolean) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isApproved: approve } : p))
    );
  };

  // Categories
  const addCategory = (categoryData: Omit<Category, 'id'>) => {
    const newCat: Category = {
      ...categoryData,
      id: `cat-${Date.now()}`,
    };
    setCategories((prev) => [...prev, newCat]);
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  // Delivery Zones
  const updateDeliveryZone = (id: string, updates: Partial<DeliveryZone>) => {
    setDeliveryZones((prev) => prev.map((z) => (z.id === id ? { ...z, ...updates } : z)));
  };

  const addDeliveryZone = (zoneData: Omit<DeliveryZone, 'id'>) => {
    const newZone: DeliveryZone = {
      ...zoneData,
      id: `zone-${Date.now()}`,
    };
    setDeliveryZones((prev) => [...prev, newZone]);
  };

  // Affiliates & Withdrawals
  const recordAffiliateClick = (affiliateCode: string, productId: string) => {
    // Increment affiliate clicks count
    console.log(`[Affiliate Click] Ref: ${affiliateCode} on Product: ${productId}`);
  };

  const requestWithdrawal = (data: {
    amount: number;
    method: WithdrawalMethod;
    accountNumber: string;
    accountHolderName: string;
    notes?: string;
  }): { success: boolean; message: string } => {
    if (!currentUser || currentUser.role !== 'affiliate') {
      return { success: false, message: 'Apenas afiliados podem solicitar levantamentos.' };
    }

    // Calculate current available balance
    const availableBalance = affiliateSales
      .filter((s) => s.affiliateCode === currentUser.affiliateCode && s.status === 'Disponível')
      .reduce((sum, s) => sum + s.commissionAmount, 0);

    const alreadyWithdrawnOrPending = withdrawals
      .filter((w) => w.affiliateId === currentUser.id && (w.status === 'pending' || w.status === 'approved'))
      .reduce((sum, w) => sum + w.amount, 0);

    const netAvailable = Math.max(0, availableBalance - alreadyWithdrawnOrPending);

    if (data.amount <= 0) {
      return { success: false, message: 'Valor deve ser superior a zero.' };
    }

    if (data.amount > netAvailable) {
      return {
        success: false,
        message: `Saldo insuficiente. Disponível para levantamento: ${formatKz(netAvailable)}.`,
      };
    }

    const feeAmount = Math.round((data.amount * platformSettings.withdrawalFeePercent) / 100);
    const netAmount = data.amount - feeAmount;

    const newReq: WithdrawalRequest = {
      id: `with-${Date.now()}`,
      affiliateId: currentUser.id,
      affiliateName: currentUser.name,
      affiliateCode: currentUser.affiliateCode || 'AF-USER',
      amount: data.amount,
      feeAmount,
      netAmount,
      method: data.method,
      accountNumber: data.accountNumber,
      accountHolderName: data.accountHolderName,
      notes: data.notes,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setWithdrawals((prev) => [newReq, ...prev]);

    addNotification({
      roleTarget: 'admin',
      title: 'Novo Pedido de Levantamento',
      message: `Afiliado ${currentUser.name} solicitou levantamento de ${formatKz(data.amount)} via ${data.method}.`,
      type: 'withdrawal',
      linkUrl: '/admin/levantamentos',
    });

    return { success: true, message: 'Solicitação de levantamento enviada com sucesso para análise do administrador.' };
  };

  const approveWithdrawal = (withdrawalId: string) => {
    if (currentUser?.role !== 'admin') return;

    setWithdrawals((prev) =>
      prev.map((w) =>
        w.id === withdrawalId
          ? { ...w, status: 'approved', processedAt: new Date().toISOString() }
          : w
      )
    );

    addAuditLog('WITHDRAWAL_APPROVAL', 'withdrawals', withdrawalId);
  };

  const rejectWithdrawal = (withdrawalId: string, reason: string) => {
    if (currentUser?.role !== 'admin') return;

    setWithdrawals((prev) =>
      prev.map((w) =>
        w.id === withdrawalId
          ? { ...w, status: 'rejected', rejectionReason: reason, processedAt: new Date().toISOString() }
          : w
      )
    );

    addAuditLog('WITHDRAWAL_REJECTION', 'withdrawals', withdrawalId, { reason });
  };

  // Item 13: Candidatura a Afiliado
  // Cliente → Solicitar ser afiliado → Administrador analisa → Aprovar/Rejeitar
  const applyToBecomeAffiliate = (): { success: boolean; message: string } => {
    if (!currentUser) {
      return { success: false, message: 'Precisa de iniciar sessão primeiro.' };
    }
    if (currentUser.role === 'affiliate') {
      return { success: false, message: 'Você já é um afiliado oficial da AngolaMarket.' };
    }
    if (currentUser.affiliateStatus === 'pending') {
      return { success: false, message: 'A sua candidatura a afiliado já se encontra em análise pelo administrador.' };
    }

    const updatedUser: UserProfile = {
      ...currentUser,
      affiliateStatus: 'pending',
      updatedAt: new Date().toISOString(),
    };

    setCurrentUser(updatedUser);
    setAllUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updatedUser : u)));

    addAuditLog('AFFILIATE_APPLICATION', 'affiliates', currentUser.id, {
      name: currentUser.name,
      email: currentUser.email,
    });

    addNotification({
      roleTarget: 'admin',
      title: 'Nova Candidatura de Afiliado',
      message: `O cliente ${currentUser.name} (${currentUser.email}) solicitou adesão ao programa de afiliados da AngolaMarket.`,
      type: 'commission',
      linkUrl: '/admin',
    });

    return {
      success: true,
      message: 'Candidatura enviada com sucesso! O administrador irá analisar e aprovar o seu perfil de afiliado.',
    };
  };

  const approveAffiliate = (affiliateId: string, approved: boolean) => {
    if (currentUser?.role !== 'admin') return;

    const code = `AF${Math.floor(10000 + Math.random() * 90000)}`;

    setAllUsers((prev) =>
      prev.map((u) => {
        if (u.id === affiliateId) {
          const updated: UserProfile = {
            ...u,
            role: approved ? 'affiliate' : u.role,
            affiliateApproved: approved,
            affiliateStatus: approved ? 'approved' : 'rejected',
            affiliateCode: approved ? (u.affiliateCode || code) : u.affiliateCode,
            updatedAt: new Date().toISOString(),
          };
          if (currentUser && currentUser.id === affiliateId) {
            setCurrentUser(updated);
          }
          return updated;
        }
        return u;
      })
    );

    addAuditLog(approved ? 'AFFILIATE_APPROVAL' : 'AFFILIATE_REJECTION', 'affiliates', affiliateId, {
      approved,
      affiliateCode: code,
    });

    addNotification({
      userId: affiliateId,
      title: approved ? 'Candidatura de Afiliado Aprovada!' : 'Candidatura de Afiliado Recusada',
      message: approved
        ? `Parabéns! A sua candidatura a afiliado foi aprovada. O seu código oficial é ${code}.`
        : 'A sua candidatura a afiliado não pôde ser aprovada neste momento.',
      type: 'commission',
      linkUrl: approved ? '/afiliado/dashboard' : '/minha-conta',
    });
  };

  // Item 11: Candidatura e Aprovação de Produtor
  const applyToBecomeProducer = (data: {
    businessName: string;
    description: string;
    phone: string;
    whatsapp: string;
    pickupAddress: string;
    province: string;
    municipality: string;
  }): { success: boolean; message: string } => {
    if (!currentUser) {
      return { success: false, message: 'Precisa de iniciar sessão primeiro.' };
    }
    if (currentUser.role === 'producer') {
      return { success: false, message: 'Você já é um produtor oficial registado.' };
    }

    const newApp: ProducerApplication = {
      id: `app-prod-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      businessName: data.businessName,
      description: data.description,
      phone: data.phone,
      whatsapp: data.whatsapp,
      pickupAddress: data.pickupAddress,
      province: data.province,
      municipality: data.municipality,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setProducerApplications((prev) => [newApp, ...prev]);

    const updatedUser: UserProfile = {
      ...currentUser,
      producerStatus: 'pending',
      storeName: data.businessName,
      pickupAddress: data.pickupAddress,
      province: data.province,
      municipality: data.municipality,
      updatedAt: new Date().toISOString(),
    };

    setCurrentUser(updatedUser);
    setAllUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updatedUser : u)));

    addAuditLog('PRODUCER_APPLICATION', 'producers', currentUser.id, {
      businessName: data.businessName,
      province: data.province,
    });

    addNotification({
      roleTarget: 'admin',
      title: 'Nova Candidatura de Produtor',
      message: `A loja/empresa "${data.businessName}" (${currentUser.name}) solicitou aprovação para vender na AngolaMarket.`,
      type: 'product',
      linkUrl: '/admin',
    });

    return {
      success: true,
      message: 'Candidatura de produtor enviada com sucesso! O administrador irá analisar a sua loja.',
    };
  };

  const approveProducer = (userId: string, approved: boolean) => {
    if (currentUser?.role !== 'admin') return;

    setProducerApplications((prev) =>
      prev.map((app) => (app.userId === userId ? { ...app, status: approved ? 'approved' : 'rejected' } : app))
    );

    setAllUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const updated: UserProfile = {
            ...u,
            role: approved ? 'producer' : u.role,
            producerApproved: approved,
            producerStatus: approved ? 'approved' : 'rejected',
            updatedAt: new Date().toISOString(),
          };
          if (currentUser && currentUser.id === userId) {
            setCurrentUser(updated);
          }
          return updated;
        }
        return u;
      })
    );

    addAuditLog(approved ? 'PRODUCER_APPROVAL' : 'PRODUCER_REJECTION', 'producers', userId, { approved });

    addNotification({
      userId,
      title: approved ? 'Conta de Produtor Aprovada!' : 'Candidatura de Produtor Recusada',
      message: approved
        ? 'A sua loja foi aprovada! Já pode aceder ao Painel do Produtor e começar a cadastrar produtos.'
        : 'A sua candidatura de produtor não foi aceite.',
      type: 'product',
      linkUrl: approved ? '/produtor/dashboard' : '/minha-conta',
    });
  };

  // Settings
  const updatePlatformSettings = (newSettings: Partial<PlatformSettings>) => {
    setPlatformSettings((prev) => ({ ...prev, ...newSettings }));
  };

  // Reviews
  const addReview = (reviewData: Omit<Review, 'id' | 'date'>) => {
    const newRev: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };
    setReviews((prev) => [newRev, ...prev]);

    // Recalculate product rating
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === reviewData.productId) {
          const productReviews = [...reviews.filter((r) => r.productId === p.id), newRev];
          const avg = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
          return {
            ...p,
            rating: Math.round(avg * 10) / 10,
            reviewCount: productReviews.length,
          };
        }
        return p;
      })
    );
  };

  // Favorites
  const toggleFavorite = (productId: string) => {
    setFavorites((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  // Coupons
  const addCoupon = (couponData: Omit<Coupon, 'id' | 'usageCount'>) => {
    const newC: Coupon = {
      ...couponData,
      id: `coup-${Date.now()}`,
      usageCount: 0,
    };
    setCoupons((prev) => [...prev, newC]);
  };

  const toggleCoupon = (id: string) => {
    setCoupons((prev) => prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c)));
  };

  // Notifications
  const addNotification = (item: Omit<NotificationItem, 'id' | 'isRead' | 'createdAt'>) => {
    const newN: NotificationItem = {
      ...item,
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [newN, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  // Currency Formatter
  const formatKz = (amount: number): string => {
    if (isNaN(amount)) return '0 Kz';
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
      maximumFractionDigits: 0,
    })
      .format(amount)
      .replace('AOA', 'Kz')
      .trim();
  };

  // Reset to initial demo data
  const resetAllToDemoData = () => {
    localStorage.clear();
    setAllUsers([INITIAL_ADMIN, ...INITIAL_PRODUCERS, ...INITIAL_AFFILIATES, ...INITIAL_CLIENTS]);
    setCurrentUser(INITIAL_CLIENTS[0]);
    setProducts(INITIAL_PRODUCTS);
    setCategories(INITIAL_CATEGORIES);
    setCart([]);
    setOrders(INITIAL_ORDERS);
    setDeliveryZones(INITIAL_DELIVERY_ZONES);
    setSelectedDeliveryZone(INITIAL_DELIVERY_ZONES[0]);
    setAffiliateSales(INITIAL_AFFILIATE_SALES);
    setWithdrawals(INITIAL_WITHDRAWALS);
    setCoupons(INITIAL_COUPONS);
    setBanners(INITIAL_BANNERS);
    setReviews(INITIAL_REVIEWS);
    setFavorites(['prod-p1', 'prod-p3']);
    setNotifications(INITIAL_NOTIFICATIONS);
    setPlatformSettings(INITIAL_PLATFORM_SETTINGS);
    alert('Dados da AngolaMarket restaurados para o padrão de demonstração!');
  };

  const affiliates = allUsers.filter((u) => u.role === 'affiliate');

  return (
    <StoreContext.Provider
      value={{
        currentRoute,
        navigate,
        affiliateRefFromUrl,
        currentUser,
        users: allUsers,
        login,
        register,
        logout,
        switchUserQuick,
        updateUserProfile,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        approveProduct,
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartSubtotal,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        selectedDeliveryZone,
        setSelectedDeliveryZone,
        deliveryCost,
        discountAmount,
        cartTotal,
        orders,
        createOrder,
        updateOrderStatus,
        updateOrderPayment,
        deliveryZones,
        updateDeliveryZone,
        addDeliveryZone,
        affiliates,
        affiliateSales,
        withdrawals,
        recordAffiliateClick,
        requestWithdrawal,
        approveWithdrawal,
        rejectWithdrawal,
        applyToBecomeAffiliate,
        approveAffiliate,
        platformSettings,
        updatePlatformSettings,
        reviews,
        addReview,
        favorites,
        toggleFavorite,
        banners,
        coupons,
        addCoupon,
        toggleCoupon,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        formatKz,
        resetAllToDemoData,
        auditLogs,
        addAuditLog,
        producerApplications,
        applyToBecomeProducer,
        approveProducer,
        promoteToAdmin,
        updateUserStatus,
        updatePassword,
        requestPasswordReset,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
};
