
export type UserRole = 'admin' | 'producer' | 'affiliate' | 'client' | 'driver';

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  iban?: string;
  balance: number;
  createdAt: number;
  isApproved?: boolean; // For producers/drivers
}

export interface Address {
  province: string;
  municipality: string;
  neighborhood: string;
  street: string;
  reference: string;
}

export interface Product {
  id: string;
  sellerId: string;
  name: string;
  description: string;
  price: number; // In Kz
  stock: number;
  category: string;
  images: string[];
  pickupAddress: Address;
  affiliateCommission: {
    type: 'fixed' | 'percentage';
    value: number;
  };
  createdAt: number;
  status: 'active' | 'inactive';
}

export type OrderStatus = 'confirmed' | 'preparing' | 'collecting' | 'in_transit' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  clientId: string;
  sellerId: string;
  affiliateId?: string;
  productIds: string[];
  items: {
    productId: string;
    quantity: number;
    price: number;
    affiliateCommission: number;
  }[];
  totalAmount: number;
  platformCommission: number; // 10%
  paymentMethod: 'iban' | 'multicaixa' | 'unitel' | 'afrimoney' | 'paypay' | 'cash';
  paymentStatus: 'pending' | 'confirmed' | 'failed';
  deliveryStatus: OrderStatus;
  deliveryAgentId?: string;
  shippingAddress: Address;
  createdAt: number;
  updatedAt: number;
}

export interface AffiliateLink {
  id: string;
  affiliateId: string;
  productId: string;
  code: string; // Unique URL code
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: 'sale' | 'withdrawal' | 'commission' | 'platform_fee';
  status: 'pending' | 'completed' | 'failed';
  createdAt: number;
}
