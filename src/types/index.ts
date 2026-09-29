export type UserRole = 'admin' | 'producer' | 'affiliate' | 'client';
export type UserStatus = 'active' | 'pending' | 'suspended' | 'blocked';
export type ProductStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'inactive';

export interface UserProfile {
  id: string;
  userId?: string;
  email: string;
  name: string;
  fullName?: string;
  phone: string;
  whatsapp?: string;
  role: UserRole;
  status?: UserStatus;
  avatar?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt?: string;
  // Specific to producers
  storeName?: string;
  businessName?: string;
  description?: string;
  pickupAddress?: string;
  province?: string;
  municipality?: string;
  producerApproved?: boolean;
  producerStatus?: 'pending' | 'approved' | 'rejected' | 'suspended';
  // Specific to affiliates
  affiliateCode?: string;
  affiliateApproved?: boolean;
  affiliateStatus?: 'pending' | 'approved' | 'rejected' | 'suspended';
  commissionRate?: number;
  totalSales?: number;
  totalCommission?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  description?: string;
  imageUrl?: string;
  parentId?: string | null;
  isActive?: boolean;
  sortOrder?: number;
  subcategories: string[];
  productCount?: number;
  orderIndex: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuditLog {
  id: string;
  userId?: string;
  userEmail?: string;
  userName?: string;
  action: string;
  entity: string;
  entityId: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface ProducerApplication {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  businessName: string;
  description: string;
  phone: string;
  whatsapp: string;
  pickupAddress: string;
  province: string;
  municipality: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  reviewedBy?: string;
  reviewNotes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AffiliateApplication {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  motivation?: string;
  promotionChannels?: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  reviewedBy?: string;
  reviewNotes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ProducerProfile {
  id: string;
  userId: string;
  businessName: string;
  description?: string;
  phone?: string;
  whatsapp?: string;
  pickupAddress: string;
  province: string;
  municipality: string;
  status: 'pending' | 'approved' | 'suspended' | 'rejected';
  defaultAffiliateCommissionRate: number;
  totalSales: number;
  totalOrders: number;
  createdAt: string;
  updatedAt: string;
}

export interface AffiliateProfile {
  id: string;
  userId: string;
  affiliateCode: string;
  status: 'pending' | 'approved' | 'suspended' | 'rejected';
  commissionRate: number;
  availableBalance: number;
  pendingBalance: number;
  totalEarned: number;
  totalWithdrawn: number;
  totalSalesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  id: string;
  userId: string;
  recipientName: string;
  phone: string;
  province: string;
  municipality: string;
  neighborhood: string;
  streetAddress: string;
  referencePoint?: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartRecord {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItemRecord {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  priceAtAddition: number;
  affiliateRef?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderStatusHistory {
  id: string;
  orderId: string;
  status: OrderStatus;
  changedBy?: string;
  notes?: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  orderId: string;
  paymentMethod: PaymentMethod;
  paymentStatus: 'pending' | 'verified' | 'failed' | 'paid_on_delivery';
  transactionReference?: string;
  receiptUrl?: string;
  amount: number;
  verifiedBy?: string;
  verifiedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WalletTransaction {
  id: string;
  userId: string;
  userRole: UserRole;
  type: 'credit' | 'debit' | 'withdrawal' | 'fee';
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  referenceType: 'order' | 'commission' | 'withdrawal' | 'adjustment';
  referenceId?: string;
  description: string;
  createdAt: string;
}

export interface ProductImage {
  id: string;
  productId: string;
  imageUrl: string;
  altText?: string;
  sortOrder: number;
  createdAt: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number; // in Kwanzas (Kz)
  promoPrice?: number;
  discountPercent?: number;
  categoryId: string;
  categoryName: string;
  subcategory?: string;
  stock: number;
  images: string[];
  producerId: string;
  producerName: string;
  producerPhone?: string;
  producerWhatsapp?: string;
  pickupAddress?: string;
  affiliateCommissionPercent: number; // e.g. 10 for 10%
  rating: number;
  reviewCount: number;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isApproved: boolean;
  isActive?: boolean;
  productStatus?: ProductStatus;
  status: 'active' | 'paused' | 'out_of_stock';
  createdAt: string;
  updatedAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  affiliateRef?: string; // Track which affiliate referred this product
}

export type OrderStatus =
  | 'Pedido recebido'
  | 'Pagamento pendente'
  | 'Pagamento confirmado'
  | 'Em preparação'
  | 'Aguardando recolha'
  | 'Em entrega'
  | 'Entregue'
  | 'Cancelado';

export type PaymentMethod =
  | 'Multicaixa Express'
  | 'PayPay'
  | 'Transferência bancária'
  | 'Pagamento na entrega';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  producerId: string;
  affiliateRef?: string;
  commissionAmount?: number;
}

export interface Order {
  id: string; // e.g. AM-2026-000001
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerWhatsapp?: string;
  province: string;
  municipality: string;
  neighborhood: string; // Bairro
  address: string;
  referencePoint?: string;
  notes?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryCost: number;
  discount: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: 'pending' | 'verified' | 'failed' | 'paid_on_delivery';
  paymentReference?: string;
  bankProofUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DeliveryZone {
  id: string;
  province: string;
  municipality: string;
  zone: string;
  price: number; // in Kz
  estimatedTime: string; // e.g. "24h - 48h"
  isActive: boolean;
}

export interface AffiliateClick {
  id: string;
  affiliateCode: string;
  productId: string;
  timestamp: string;
  ipPlaceholder?: string;
}

export interface AffiliateSale {
  id: string;
  affiliateCode: string;
  orderId: string;
  productId: string;
  productName: string;
  saleAmount: number;
  commissionRate: number; // percentage
  commissionAmount: number;
  status: 'Pendente' | 'Confirmada' | 'Disponível' | 'Levantada' | 'Cancelada';
  createdAt: string;
}

export interface Commission {
  id: string;
  affiliateCode: string;
  affiliateId: string;
  orderId: string;
  amount: number;
  status: 'Pendente' | 'Confirmada' | 'Disponível' | 'Levantada' | 'Cancelada';
  createdAt: string;
  updatedAt: string;
}

export type AffiliateCommission = Commission;
export type AffiliateWithdrawal = WithdrawalRequest;

export type WithdrawalMethod =
  | 'IBAN'
  | 'Multicaixa Express'
  | 'PayPay'
  | 'Unitel Money'
  | 'Afrimoney';

export interface WithdrawalRequest {
  id: string;
  affiliateId: string;
  affiliateName: string;
  affiliateCode: string;
  amount: number;
  feeAmount: number;
  netAmount: number;
  method: WithdrawalMethod;
  accountNumber: string; // Phone or IBAN
  accountHolderName: string;
  notes?: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  createdAt: string;
  processedAt?: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number; // 1-5
  comment: string;
  date: string;
  isVerifiedPurchase: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount?: number;
  isActive: boolean;
  usageCount: number;
  expiresAt?: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  buttonText: string;
  linkUrl: string;
  imageUrl: string;
  bgGradient: string;
  isActive: boolean;
}

export interface NotificationItem {
  id: string;
  userId?: string; // target user or 'all' or role
  roleTarget?: UserRole | 'all';
  title: string;
  message: string;
  type: 'order' | 'commission' | 'withdrawal' | 'product' | 'system';
  isRead: boolean;
  createdAt: string;
  linkUrl?: string;
}

export interface PlatformSettings {
  platformFeePercent: number; // Initial 10%
  withdrawalFeePercent: number; // e.g. 2%
  requireProductApproval: boolean;
  requireAffiliateApproval: boolean;
  autoMakeCommissionAvailableOnDelivery: boolean;
  enabledPaymentMethods: {
    multicaixaExpress: boolean;
    payPay: boolean;
    bankTransfer: boolean;
    cashOnDelivery: boolean;
  };
  contactPhone: string;
  contactWhatsapp: string;
  contactEmail: string;
  bankIban: string;
  bankName: string;
  bankBeneficiary: string;
}
