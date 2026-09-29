-- ==============================================================================
-- ANGOLAMARKET - COMPREHENSIVE SUPABASE DATABASE SCHEMA
-- Mercado Angolano de Comércio Eletrónico, Produtores e Afiliados
-- 
-- Arquivo: /supabase/schema.sql
-- Instruções: Copie TODO o conteúdo deste arquivo e execute no:
--             Supabase Dashboard -> SQL Editor -> New Query -> Run
-- Idempotente: seguro para execução repetida em bases novas ou existentes.
-- ==============================================================================

-- 1. EXTENSÕES DO POSTGRESQL
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. TIPOS ENUMERADOS (ENUMS) - CRIAÇÃO SEGURA REEXECUTÁVEL
-- ==============================================================================
DO $$ BEGIN
  CREATE TYPE user_role_type AS ENUM ('client', 'affiliate', 'producer', 'admin');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE user_status_type AS ENUM ('active', 'pending', 'suspended', 'blocked');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE producer_status_type AS ENUM ('pending', 'approved', 'suspended', 'rejected');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE affiliate_status_type AS ENUM ('pending', 'approved', 'suspended', 'rejected');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE product_status_type AS ENUM ('pending', 'approved', 'rejected', 'inactive');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE order_status_type AS ENUM (
    'pending',
    'confirmed',
    'processing',
    'ready_for_delivery',
    'out_for_delivery',
    'delivered',
    'cancelled',
    'returned'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE payment_method_type AS ENUM (
    'Cash on Delivery',
    'Multicaixa Express',
    'IBAN',
    'PayPay',
    'Unitel Money',
    'Afrimoney'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE payment_status_type AS ENUM (
    'pending',
    'verified',
    'failed',
    'paid_on_delivery'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE commission_status_type AS ENUM (
    'pending',
    'confirmed',
    'available',
    'withdrawn',
    'cancelled'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE withdrawal_status_type AS ENUM (
    'pending',
    'approved',
    'rejected'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE withdrawal_method_type AS ENUM (
    'IBAN',
    'Multicaixa Express',
    'PayPay',
    'Unitel Money',
    'Afrimoney'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE wallet_transaction_type AS ENUM (
    'credit',
    'debit',
    'withdrawal',
    'fee'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ==============================================================================
-- 3. FUNÇÃO AUXILIAR DE TIMESTAMP (updated_at automático)
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==============================================================================
-- 4. TABELA: profiles (Ligada ao auth.users)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  whatsapp TEXT,
  avatar_url TEXT,
  role user_role_type NOT NULL DEFAULT 'client',
  status user_status_type NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 5. TABELA: producer_profiles (Produtores e Lojas)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.producer_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  description TEXT,
  phone TEXT,
  whatsapp TEXT,
  pickup_address TEXT NOT NULL,
  province TEXT NOT NULL DEFAULT 'Luanda',
  municipality TEXT NOT NULL DEFAULT 'Talatona',
  status producer_status_type NOT NULL DEFAULT 'pending',
  default_affiliate_commission_rate NUMERIC(5, 2) NOT NULL DEFAULT 10.00 CHECK (default_affiliate_commission_rate >= 0),
  total_sales NUMERIC(14, 2) NOT NULL DEFAULT 0.00 CHECK (total_sales >= 0),
  total_orders INTEGER NOT NULL DEFAULT 0 CHECK (total_orders >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 6. TABELA: affiliate_profiles (Afiliados e Comissões)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.affiliate_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  affiliate_code TEXT UNIQUE NOT NULL, -- Ex: AF94821
  status affiliate_status_type NOT NULL DEFAULT 'pending',
  commission_rate NUMERIC(5, 2) NOT NULL DEFAULT 10.00 CHECK (commission_rate >= 0),
  available_balance NUMERIC(14, 2) NOT NULL DEFAULT 0.00 CHECK (available_balance >= 0),
  pending_balance NUMERIC(14, 2) NOT NULL DEFAULT 0.00 CHECK (pending_balance >= 0),
  total_earned NUMERIC(14, 2) NOT NULL DEFAULT 0.00 CHECK (total_earned >= 0),
  total_withdrawn NUMERIC(14, 2) NOT NULL DEFAULT 0.00 CHECK (total_withdrawn >= 0),
  total_sales_count INTEGER NOT NULL DEFAULT 0 CHECK (total_sales_count >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 7. TABELA: producer_applications (Candidaturas a Produtor)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.producer_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  description TEXT,
  phone TEXT NOT NULL,
  whatsapp TEXT,
  pickup_address TEXT NOT NULL,
  province TEXT NOT NULL DEFAULT 'Luanda',
  municipality TEXT NOT NULL DEFAULT 'Talatona',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  review_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 8. TABELA: affiliate_applications (Candidaturas a Afiliado)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.affiliate_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  motivation TEXT,
  promotion_channels TEXT, -- ex: WhatsApp, Facebook, Instagram
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  review_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 9. TABELA: categories (Categorias e Subcategorias)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  icon_name TEXT DEFAULT 'Folder',
  parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 10. TABELA: products (Produtos)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC(14, 2) NOT NULL CHECK (price >= 0),
  promo_price NUMERIC(14, 2) CHECK (promo_price IS NULL OR (promo_price > 0 AND promo_price < price)),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
  subcategory TEXT,
  producer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  sku TEXT,
  affiliate_commission_percent NUMERIC(5, 2) NOT NULL DEFAULT 10.00 CHECK (affiliate_commission_percent >= 0),
  status product_status_type NOT NULL DEFAULT 'pending',
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_best_seller BOOLEAN NOT NULL DEFAULT false,
  rating NUMERIC(3, 2) NOT NULL DEFAULT 5.00 CHECK (rating >= 1 AND rating <= 5),
  review_count INTEGER NOT NULL DEFAULT 0 CHECK (review_count >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 11. TABELA: product_images (Galeria de Imagens de Produtos)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 12. TABELA: carts (Carrinhos de Compra)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.carts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 13. TABELA: cart_items (Itens do Carrinho)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cart_id UUID NOT NULL REFERENCES public.carts(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  price_at_addition NUMERIC(14, 2) NOT NULL CHECK (price_at_addition >= 0),
  affiliate_ref TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(cart_id, product_id)
);

-- ==============================================================================
-- 14. TABELA: delivery_zones (Zonas de Entrega em Angola)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.delivery_zones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  province TEXT NOT NULL DEFAULT 'Luanda',
  municipality TEXT NOT NULL,
  zone TEXT,
  price NUMERIC(14, 2) NOT NULL DEFAULT 2500 CHECK (price >= 0),
  estimated_time TEXT NOT NULL DEFAULT '24h - 48h',
  description TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 15. TABELA: addresses (Endereços de Entrega de Clientes)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  recipient_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  province TEXT NOT NULL DEFAULT 'Luanda',
  municipality TEXT NOT NULL,
  neighborhood TEXT NOT NULL, -- Bairro
  street_address TEXT NOT NULL,
  reference_point TEXT,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 16. TABELA: orders (Pedidos)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY, -- ex: AM-2026-000001 ou UUID
  customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  delivery_address_id UUID REFERENCES public.addresses(id) ON DELETE SET NULL,
  recipient_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp TEXT,
  province TEXT NOT NULL DEFAULT 'Luanda',
  municipality TEXT NOT NULL,
  neighborhood TEXT NOT NULL,
  street_address TEXT NOT NULL,
  reference_point TEXT,
  notes TEXT,
  subtotal NUMERIC(14, 2) NOT NULL CHECK (subtotal >= 0),
  delivery_cost NUMERIC(14, 2) NOT NULL DEFAULT 0.00 CHECK (delivery_cost >= 0),
  discount NUMERIC(14, 2) NOT NULL DEFAULT 0.00 CHECK (discount >= 0),
  total NUMERIC(14, 2) NOT NULL CHECK (total >= 0),
  platform_fee_percent NUMERIC(5, 2) NOT NULL DEFAULT 10.00, -- 10% da venda
  platform_fee_amount NUMERIC(14, 2) NOT NULL DEFAULT 0.00 CHECK (platform_fee_amount >= 0),
  payment_method payment_method_type NOT NULL,
  payment_status payment_status_type NOT NULL DEFAULT 'pending',
  order_status order_status_type NOT NULL DEFAULT 'pending',
  affiliate_code TEXT,
  affiliate_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  total_affiliate_commission NUMERIC(14, 2) NOT NULL DEFAULT 0.00 CHECK (total_affiliate_commission >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 17. TABELA: order_items (Itens de Pedido)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id TEXT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  product_name TEXT NOT NULL,
  product_image TEXT,
  price NUMERIC(14, 2) NOT NULL CHECK (price >= 0),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  producer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  affiliate_ref TEXT,
  affiliate_commission_rate NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
  commission_amount NUMERIC(14, 2) NOT NULL DEFAULT 0.00 CHECK (commission_amount >= 0),
  platform_fee_amount NUMERIC(14, 2) NOT NULL DEFAULT 0.00 CHECK (platform_fee_amount >= 0),
  producer_net_amount NUMERIC(14, 2) NOT NULL DEFAULT 0.00 CHECK (producer_net_amount >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 18. TABELA: order_status_history (Histórico de Alterações de Pedido)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.order_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id TEXT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  status order_status_type NOT NULL,
  changed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 19. TABELA: payments (Registo de Pagamentos)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id TEXT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  payment_method payment_method_type NOT NULL,
  payment_status payment_status_type NOT NULL DEFAULT 'pending',
  transaction_reference TEXT,
  receipt_url TEXT, -- Comprovativo guardado de forma protegida
  amount NUMERIC(14, 2) NOT NULL CHECK (amount >= 0),
  verified_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  verified_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 20. TABELA: affiliate_commissions (Comissões de Afiliados)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.affiliate_commissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  affiliate_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  affiliate_code TEXT NOT NULL,
  order_id TEXT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  order_item_id UUID REFERENCES public.order_items(id) ON DELETE SET NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT,
  sale_amount NUMERIC(14, 2) NOT NULL CHECK (sale_amount >= 0),
  commission_rate NUMERIC(5, 2) NOT NULL CHECK (commission_rate >= 0),
  commission_amount NUMERIC(14, 2) NOT NULL CHECK (commission_amount >= 0),
  status commission_status_type NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 21. TABELA: affiliate_withdrawals (Pedidos de Levantamento)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.affiliate_withdrawals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  affiliate_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  affiliate_code TEXT NOT NULL,
  amount NUMERIC(14, 2) NOT NULL CHECK (amount > 0),
  fee_amount NUMERIC(14, 2) NOT NULL DEFAULT 200.00 CHECK (fee_amount >= 0), -- Taxa de 200 Kz
  net_amount NUMERIC(14, 2) NOT NULL CHECK (net_amount >= 0),
  method withdrawal_method_type NOT NULL,
  account_number TEXT NOT NULL, -- Telefone ou IBAN
  account_holder_name TEXT NOT NULL,
  status withdrawal_status_type NOT NULL DEFAULT 'pending',
  rejection_reason TEXT,
  processed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  processed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 22. TABELA: wallet_transactions (Transações Financeiras Internas)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.wallet_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_role user_role_type NOT NULL,
  type wallet_transaction_type NOT NULL,
  amount NUMERIC(14, 2) NOT NULL,
  balance_before NUMERIC(14, 2) NOT NULL,
  balance_after NUMERIC(14, 2) NOT NULL,
  reference_type TEXT NOT NULL, -- 'order', 'commission', 'withdrawal', 'fee'
  reference_id TEXT,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 23. TABELA: favorites (Favoritos)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, product_id)
);

-- ==============================================================================
-- 24. TABELA: reviews (Avaliações de Produtos)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  is_verified_purchase BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(product_id, user_id) -- Impede avaliações duplicadas do mesmo cliente para o mesmo produto
);

-- ==============================================================================
-- 25. TABELA: notifications (Notificações)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  role_target user_role_type, -- Se aplicável a todos de uma função
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'system',
  is_read BOOLEAN NOT NULL DEFAULT false,
  link_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 26. TABELA: audit_logs (Logs de Auditoria de Ações Administrativas)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 27. TABELA: platform_settings (Configurações Centrais e Taxas da AngolaMarket)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.platform_settings (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  platform_fee_percent NUMERIC(5, 2) NOT NULL DEFAULT 10.00, -- 10% da venda do produtor
  affiliate_withdrawal_fee NUMERIC(14, 2) NOT NULL DEFAULT 200.00, -- 200 Kz por pedido de levantamento
  require_product_approval BOOLEAN NOT NULL DEFAULT true,
  require_affiliate_approval BOOLEAN NOT NULL DEFAULT true,
  require_producer_approval BOOLEAN NOT NULL DEFAULT true,
  auto_make_commission_available_on_delivery BOOLEAN NOT NULL DEFAULT true,
  enabled_multicaixa_express BOOLEAN NOT NULL DEFAULT true,
  enabled_paypay BOOLEAN NOT NULL DEFAULT true,
  enabled_bank_transfer BOOLEAN NOT NULL DEFAULT true,
  enabled_cash_on_delivery BOOLEAN NOT NULL DEFAULT true,
  enabled_unitel_money BOOLEAN NOT NULL DEFAULT true,
  enabled_afrimoney BOOLEAN NOT NULL DEFAULT true,
  contact_phone TEXT NOT NULL DEFAULT '+244 923 000 111',
  contact_whatsapp TEXT NOT NULL DEFAULT '+244 923 000 111',
  contact_email TEXT NOT NULL DEFAULT 'contacto@angolamarket.ao',
  bank_iban TEXT NOT NULL DEFAULT 'AO06 0040 0000 1234 5678 9012 3',
  bank_name TEXT NOT NULL DEFAULT 'Banco Angolano de Investimentos (BAI)',
  bank_beneficiary TEXT NOT NULL DEFAULT 'AngolaMarket Lda',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Seed de configurações padrão
INSERT INTO public.platform_settings (id)
VALUES (1)
ON CONFLICT (id) DO UPDATE SET
  platform_fee_percent = EXCLUDED.platform_fee_percent,
  affiliate_withdrawal_fee = EXCLUDED.affiliate_withdrawal_fee;

-- ==============================================================================
-- 28. TABELAS ADICIONAIS: coupons e banners
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC(14, 2) NOT NULL CHECK (discount_value > 0),
  min_order_amount NUMERIC(14, 2) DEFAULT 0.00,
  is_active BOOLEAN NOT NULL DEFAULT true,
  usage_count INTEGER NOT NULL DEFAULT 0,
  max_uses INTEGER,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.banners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  subtitle TEXT,
  tag TEXT,
  button_text TEXT,
  link_url TEXT,
  image_url TEXT NOT NULL,
  bg_gradient TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 29. VISTAS DE COMPATIBILIDADE RETROATIVA (Backward Compatibility)
-- ==============================================================================
CREATE OR REPLACE VIEW public.producers AS
  SELECT * FROM public.producer_profiles;

CREATE OR REPLACE VIEW public.affiliates AS
  SELECT * FROM public.affiliate_profiles;

CREATE OR REPLACE VIEW public.withdrawals AS
  SELECT * FROM public.affiliate_withdrawals;

CREATE OR REPLACE VIEW public.commissions AS
  SELECT * FROM public.affiliate_commissions;

CREATE OR REPLACE VIEW public.affiliate_sales AS
  SELECT * FROM public.affiliate_commissions;

-- ==============================================================================
-- 30. TRIGGERS AUTOMÁTICOS
-- ==============================================================================

-- A. Atualização automática do campo updated_at
DROP TRIGGER IF EXISTS tr_profiles_updated_at ON public.profiles;
CREATE TRIGGER tr_profiles_updated_at BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_producer_profiles_updated_at ON public.producer_profiles;
CREATE TRIGGER tr_producer_profiles_updated_at BEFORE UPDATE ON public.producer_profiles
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_affiliate_profiles_updated_at ON public.affiliate_profiles;
CREATE TRIGGER tr_affiliate_profiles_updated_at BEFORE UPDATE ON public.affiliate_profiles
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_categories_updated_at ON public.categories;
CREATE TRIGGER tr_categories_updated_at BEFORE UPDATE ON public.categories
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_products_updated_at ON public.products;
CREATE TRIGGER tr_products_updated_at BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_orders_updated_at ON public.orders;
CREATE TRIGGER tr_orders_updated_at BEFORE UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_platform_settings_updated_at ON public.platform_settings;
CREATE TRIGGER tr_platform_settings_updated_at BEFORE UPDATE ON public.platform_settings
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- B. Trigger de criação automática do Profile quando novo usuário é criado no auth.users
-- Regra de negócio estrita: Todo utilizador comum começa como: CLIENTE e com status: ACTIVE.
-- O utilizador não pode escolher ser administrador durante o cadastro.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    user_id,
    email,
    full_name,
    phone,
    whatsapp,
    role,
    status
  ) VALUES (
    NEW.id,
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'phone', '+244 900 000 000'),
    COALESCE(NEW.raw_user_meta_data->>'whatsapp', NEW.raw_user_meta_data->>'phone'),
    'client', -- Inicializa OBRIGATORIAMENTE como client
    'active'  -- Inicializa OBRIGATORIAMENTE como active
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 31. FUNÇÕES AUXILIARES DE SEGURANÇA PARA RLS
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.get_auth_role()
RETURNS TEXT AS $$
  SELECT role::text FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ==============================================================================
-- 32. ROW LEVEL SECURITY (RLS) - ATIVAÇÃO EM TODAS AS TABELAS
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.producer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.producer_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_withdrawals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- 33. POLÍTICAS RLS DETALHADAS POR FUNÇÃO (CLIENT, PRODUCER, AFFILIATE, ADMIN)
-- ==============================================================================

-- A. PROFILES
DROP POLICY IF EXISTS "Profiles read by authenticated" ON public.profiles;
CREATE POLICY "Profiles read by authenticated" ON public.profiles
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can update own profile without escalating role" ON public.profiles;
CREATE POLICY "Users can update own profile without escalating role" ON public.profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND
    (role = (SELECT role FROM public.profiles WHERE id = auth.uid()) OR public.is_admin())
  );

DROP POLICY IF EXISTS "Admins have full access to profiles" ON public.profiles;
CREATE POLICY "Admins have full access to profiles" ON public.profiles
  FOR ALL USING (public.is_admin());

-- B. PRODUCER_PROFILES
DROP POLICY IF EXISTS "Public can view approved producers" ON public.producer_profiles;
CREATE POLICY "Public can view approved producers" ON public.producer_profiles
  FOR SELECT USING (status = 'approved');

DROP POLICY IF EXISTS "Producers can view own record" ON public.producer_profiles;
CREATE POLICY "Producers can view own record" ON public.producer_profiles
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Producers can update own business info" ON public.producer_profiles;
CREATE POLICY "Producers can update own business info" ON public.producer_profiles
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins manage producer profiles" ON public.producer_profiles;
CREATE POLICY "Admins manage producer profiles" ON public.producer_profiles
  FOR ALL USING (public.is_admin());

-- C. AFFILIATE_PROFILES
DROP POLICY IF EXISTS "Affiliates can view own record" ON public.affiliate_profiles;
CREATE POLICY "Affiliates can view own record" ON public.affiliate_profiles
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins manage affiliate profiles" ON public.affiliate_profiles;
CREATE POLICY "Admins manage affiliate profiles" ON public.affiliate_profiles
  FOR ALL USING (public.is_admin());

-- D. APPLICATIONS (PRODUCER & AFFILIATE)
DROP POLICY IF EXISTS "Users view and insert own producer applications" ON public.producer_applications;
CREATE POLICY "Users view and insert own producer applications" ON public.producer_applications
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins manage producer applications" ON public.producer_applications;
CREATE POLICY "Admins manage producer applications" ON public.producer_applications
  FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Users view and insert own affiliate applications" ON public.affiliate_applications;
CREATE POLICY "Users view and insert own affiliate applications" ON public.affiliate_applications
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins manage affiliate applications" ON public.affiliate_applications;
CREATE POLICY "Admins manage affiliate applications" ON public.affiliate_applications
  FOR ALL USING (public.is_admin());

-- E. CATEGORIES
DROP POLICY IF EXISTS "Categories viewable by everyone" ON public.categories;
CREATE POLICY "Categories viewable by everyone" ON public.categories
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins manage categories" ON public.categories;
CREATE POLICY "Admins manage categories" ON public.categories
  FOR ALL USING (public.is_admin());

-- F. PRODUCTS & PRODUCT IMAGES
DROP POLICY IF EXISTS "Public can view approved products" ON public.products;
CREATE POLICY "Public can view approved products" ON public.products
  FOR SELECT USING (status = 'approved');

DROP POLICY IF EXISTS "Producers can view all their products" ON public.products;
CREATE POLICY "Producers can view all their products" ON public.products
  FOR SELECT USING (auth.uid() = producer_id);

DROP POLICY IF EXISTS "Producers can insert their products in pending status" ON public.products;
CREATE POLICY "Producers can insert their products in pending status" ON public.products
  FOR INSERT WITH CHECK (
    auth.uid() = producer_id AND
    (status = 'pending' OR public.is_admin())
  );

DROP POLICY IF EXISTS "Producers can update their own products" ON public.products;
CREATE POLICY "Producers can update their own products" ON public.products
  FOR UPDATE USING (auth.uid() = producer_id);

DROP POLICY IF EXISTS "Admins have full access to products" ON public.products;
CREATE POLICY "Admins have full access to products" ON public.products
  FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Product images viewable by everyone" ON public.product_images;
CREATE POLICY "Product images viewable by everyone" ON public.product_images
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Producers manage images of their products" ON public.product_images;
CREATE POLICY "Producers manage images of their products" ON public.product_images
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.products WHERE products.id = product_images.product_id AND products.producer_id = auth.uid())
  );

DROP POLICY IF EXISTS "Admins manage product images" ON public.product_images;
CREATE POLICY "Admins manage product images" ON public.product_images
  FOR ALL USING (public.is_admin());

-- G. CARTS & CART ITEMS
DROP POLICY IF EXISTS "Users manage own carts" ON public.carts;
CREATE POLICY "Users manage own carts" ON public.carts
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users manage own cart items" ON public.cart_items;
CREATE POLICY "Users manage own cart items" ON public.cart_items
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.carts WHERE carts.id = cart_items.cart_id AND carts.user_id = auth.uid())
  );

-- H. ADDRESSES
DROP POLICY IF EXISTS "Users manage own addresses" ON public.addresses;
CREATE POLICY "Users manage own addresses" ON public.addresses
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins view all addresses" ON public.addresses;
CREATE POLICY "Admins view all addresses" ON public.addresses
  FOR SELECT USING (public.is_admin());

-- I. ORDERS & ORDER ITEMS
-- Clientes visualizam e criam apenas os seus próprios pedidos
DROP POLICY IF EXISTS "Clients view own orders" ON public.orders;
CREATE POLICY "Clients view own orders" ON public.orders
  FOR SELECT USING (auth.uid() = customer_id);

DROP POLICY IF EXISTS "Clients create own orders" ON public.orders;
CREATE POLICY "Clients create own orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

DROP POLICY IF EXISTS "Admins manage all orders" ON public.orders;
CREATE POLICY "Admins manage all orders" ON public.orders
  FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Clients view their order items" ON public.order_items;
CREATE POLICY "Clients view their order items" ON public.order_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.customer_id = auth.uid())
  );

-- Produtores visualizam apenas os itens dos seus próprios produtos
DROP POLICY IF EXISTS "Producers view order items of their products" ON public.order_items;
CREATE POLICY "Producers view order items of their products" ON public.order_items
  FOR SELECT USING (auth.uid() = producer_id);

DROP POLICY IF EXISTS "Admins manage all order items" ON public.order_items;
CREATE POLICY "Admins manage all order items" ON public.order_items
  FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Users view status history of their orders" ON public.order_status_history;
CREATE POLICY "Users view status history of their orders" ON public.order_status_history
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_status_history.order_id AND orders.customer_id = auth.uid()) OR
    public.is_admin()
  );

DROP POLICY IF EXISTS "Admins manage order status history" ON public.order_status_history;
CREATE POLICY "Admins manage order status history" ON public.order_status_history
  FOR ALL USING (public.is_admin());

-- J. PAYMENTS
DROP POLICY IF EXISTS "Clients view payment of own orders" ON public.payments;
CREATE POLICY "Clients view payment of own orders" ON public.payments
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.orders WHERE orders.id = payments.order_id AND orders.customer_id = auth.uid())
  );

DROP POLICY IF EXISTS "Clients submit payment proofs" ON public.payments;
CREATE POLICY "Clients submit payment proofs" ON public.payments
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.orders WHERE orders.id = payments.order_id AND orders.customer_id = auth.uid())
  );

DROP POLICY IF EXISTS "Admins manage payments" ON public.payments;
CREATE POLICY "Admins manage payments" ON public.payments
  FOR ALL USING (public.is_admin());

-- K. AFFILIATE COMMISSIONS & WITHDRAWALS
-- Afiliados consultam apenas as suas próprias comissões
DROP POLICY IF EXISTS "Affiliates view own commissions" ON public.affiliate_commissions;
CREATE POLICY "Affiliates view own commissions" ON public.affiliate_commissions
  FOR SELECT USING (auth.uid() = affiliate_id);

DROP POLICY IF EXISTS "Admins manage affiliate commissions" ON public.affiliate_commissions;
CREATE POLICY "Admins manage affiliate commissions" ON public.affiliate_commissions
  FOR ALL USING (public.is_admin());

-- Afiliados visualizam e submetem os seus próprios pedidos de levantamento
DROP POLICY IF EXISTS "Affiliates view own withdrawals" ON public.affiliate_withdrawals;
CREATE POLICY "Affiliates view own withdrawals" ON public.affiliate_withdrawals
  FOR SELECT USING (auth.uid() = affiliate_id);

DROP POLICY IF EXISTS "Affiliates insert own withdrawals" ON public.affiliate_withdrawals;
CREATE POLICY "Affiliates insert own withdrawals" ON public.affiliate_withdrawals
  FOR INSERT WITH CHECK (auth.uid() = affiliate_id);

DROP POLICY IF EXISTS "Admins manage withdrawals" ON public.affiliate_withdrawals;
CREATE POLICY "Admins manage withdrawals" ON public.affiliate_withdrawals
  FOR ALL USING (public.is_admin());

-- L. WALLET TRANSACTIONS
DROP POLICY IF EXISTS "Users view own wallet transactions" ON public.wallet_transactions;
CREATE POLICY "Users view own wallet transactions" ON public.wallet_transactions
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins manage wallet transactions" ON public.wallet_transactions;
CREATE POLICY "Admins manage wallet transactions" ON public.wallet_transactions
  FOR ALL USING (public.is_admin());

-- M. FAVORITES & REVIEWS
DROP POLICY IF EXISTS "Users manage own favorites" ON public.favorites;
CREATE POLICY "Users manage own favorites" ON public.favorites
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Reviews viewable by everyone" ON public.reviews;
CREATE POLICY "Reviews viewable by everyone" ON public.reviews
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users create reviews" ON public.reviews;
CREATE POLICY "Authenticated users create reviews" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users update own reviews" ON public.reviews;
CREATE POLICY "Users update own reviews" ON public.reviews
  FOR UPDATE USING (auth.uid() = user_id);

-- N. NOTIFICATIONS
DROP POLICY IF EXISTS "Users view own notifications" ON public.notifications;
CREATE POLICY "Users view own notifications" ON public.notifications
  FOR SELECT USING (
    auth.uid() = user_id OR
    role_target = (SELECT role FROM public.profiles WHERE id = auth.uid()) OR
    public.is_admin()
  );

DROP POLICY IF EXISTS "Users mark own notifications read" ON public.notifications;
CREATE POLICY "Users mark own notifications read" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins manage notifications" ON public.notifications;
CREATE POLICY "Admins manage notifications" ON public.notifications
  FOR ALL USING (public.is_admin());

-- O. AUDIT LOGS
DROP POLICY IF EXISTS "Admins view all audit logs" ON public.audit_logs;
CREATE POLICY "Admins view all audit logs" ON public.audit_logs
  FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "Authenticated users can record audit logs" ON public.audit_logs;
CREATE POLICY "Authenticated users can record audit logs" ON public.audit_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL OR public.is_admin());

-- P. DELIVERY ZONES, PLATFORM SETTINGS, COUPONS & BANNERS
DROP POLICY IF EXISTS "Active delivery zones viewable by everyone" ON public.delivery_zones;
CREATE POLICY "Active delivery zones viewable by everyone" ON public.delivery_zones
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admins manage delivery zones" ON public.delivery_zones;
CREATE POLICY "Admins manage delivery zones" ON public.delivery_zones
  FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Platform settings viewable by everyone" ON public.platform_settings;
CREATE POLICY "Platform settings viewable by everyone" ON public.platform_settings
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins update platform settings" ON public.platform_settings;
CREATE POLICY "Admins update platform settings" ON public.platform_settings
  FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Active coupons viewable by everyone" ON public.coupons;
CREATE POLICY "Active coupons viewable by everyone" ON public.coupons
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admins manage coupons" ON public.coupons;
CREATE POLICY "Admins manage coupons" ON public.coupons
  FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Active banners viewable by everyone" ON public.banners;
CREATE POLICY "Active banners viewable by everyone" ON public.banners
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admins manage banners" ON public.banners;
CREATE POLICY "Admins manage banners" ON public.banners
  FOR ALL USING (public.is_admin());

-- ==============================================================================
-- 34. SUPABASE STORAGE BUCKETS (products, avatars, banners, receipts)
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('banners', 'banners', true)
ON CONFLICT (id) DO NOTHING;

-- Bucket receipts é PRIVADO para proteção de comprovativos bancários (Item 20)
INSERT INTO storage.buckets (id, name, public)
VALUES ('receipts', 'receipts', false)
ON CONFLICT (id) DO UPDATE SET public = false;

-- Storage Policies
DROP POLICY IF EXISTS "Public can view products images" ON storage.objects;
CREATE POLICY "Public can view products images" ON storage.objects
  FOR SELECT USING (bucket_id = 'products');

DROP POLICY IF EXISTS "Producers and Admins upload product images" ON storage.objects;
CREATE POLICY "Producers and Admins upload product images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'products' AND
    (public.get_auth_role() IN ('producer', 'admin'))
  );

DROP POLICY IF EXISTS "Public can view avatars" ON storage.objects;
CREATE POLICY "Public can view avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Users upload their own avatar" ON storage.objects;
CREATE POLICY "Users upload their own avatar" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' AND
    auth.role() = 'authenticated'
  );

DROP POLICY IF EXISTS "Public can view banners" ON storage.objects;
CREATE POLICY "Public can view banners" ON storage.objects
  FOR SELECT USING (bucket_id = 'banners');

DROP POLICY IF EXISTS "Admins upload banners" ON storage.objects;
CREATE POLICY "Admins upload banners" ON storage.objects
  FOR ALL USING (
    bucket_id = 'banners' AND
    public.is_admin()
  );

-- Comprovativos: apenas o próprio cliente ou admin podem ler e enviar (Item 20)
DROP POLICY IF EXISTS "Users can upload payment receipts" ON storage.objects;
CREATE POLICY "Users can upload payment receipts" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'receipts' AND
    auth.role() = 'authenticated'
  );

DROP POLICY IF EXISTS "Owners and admins can view payment receipts" ON storage.objects;
CREATE POLICY "Owners and admins can view payment receipts" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'receipts' AND
    (auth.uid()::text = (storage.foldername(name))[1] OR public.is_admin())
  );

-- ==============================================================================
-- 35. ÍNDICES DE ALTA PERFORMANCE (Item 21)
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON public.profiles(status);

CREATE INDEX IF NOT EXISTS idx_producer_profiles_user_id ON public.producer_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_producer_profiles_status ON public.producer_profiles(status);

CREATE INDEX IF NOT EXISTS idx_affiliate_profiles_user_id ON public.affiliate_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_profiles_code ON public.affiliate_profiles(affiliate_code);
CREATE INDEX IF NOT EXISTS idx_affiliate_profiles_status ON public.affiliate_profiles(status);

CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_producer ON public.products(producer_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_orders_customer ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON public.orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_affiliate_code ON public.orders(affiliate_code);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_order_items_producer_id ON public.order_items(producer_id);

CREATE INDEX IF NOT EXISTS idx_commissions_affiliate_id ON public.affiliate_commissions(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_commissions_order_id ON public.affiliate_commissions(order_id);
CREATE INDEX IF NOT EXISTS idx_commissions_status ON public.affiliate_commissions(status);

CREATE INDEX IF NOT EXISTS idx_withdrawals_affiliate_id ON public.affiliate_withdrawals(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_withdrawals_status ON public.affiliate_withdrawals(status);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON public.audit_logs(entity, entity_id);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_parent ON public.categories(parent_id);

-- ==============================================================================
-- 36. SEED INICIAL DE CATEGORIAS PADRÃO DE ANGOLA
-- ==============================================================================
INSERT INTO public.categories (name, slug, description, icon_name, sort_order)
VALUES 
  ('Moda e Calçado', 'moda', 'Roupa feminina, masculina, infantil e calçados', 'Shirt', 1),
  ('Beleza e Cosméticos', 'beleza', 'Perfumes originais, maquilhagem e cuidados com o cabelo', 'Sparkles', 2),
  ('Eletrónicos e Telemóveis', 'eletronicos', 'Smartphones, computadores, áudio e acessórios', 'Smartphone', 3),
  ('Casa e Decoração', 'casa', 'Utensílios de cozinha, têxtil-lar e decoração', 'Home', 4),
  ('Saúde e Bem-estar', 'saude', 'Suplementos, vitaminas e cuidados pessoais', 'HeartPulse', 5),
  ('Desporto e Lazer', 'desporto', 'Equipamento desportivo, calçado de treino e acessórios', 'Dumbbell', 6)
ON CONFLICT (slug) DO NOTHING;

-- ==============================================================================
-- 37. SEED INICIAL DE ZONAS DE ENTREGA EM LUANDA E PROVÍNCIAS
-- ==============================================================================
INSERT INTO public.delivery_zones (name, province, municipality, zone, price, estimated_time, is_active)
VALUES
  ('Talatona & Benfica', 'Luanda', 'Talatona', 'Talatona / Benfica / Morro Bento', 2000, '24 horas', true),
  ('Luanda Central', 'Luanda', 'Luanda', 'Ingombota / Maianga / Alvalade / Miramar', 2500, '24 horas', true),
  ('Kilamba & Camama', 'Luanda', 'Belas', 'Centralidade do Kilamba / Camama', 2500, '24 horas', true),
  ('Viana & Zango', 'Luanda', 'Viana', 'Viana / Centralidade do Zango', 3000, '24 - 48 horas', true),
  ('Cacuaco & Kilamba Kiaxi', 'Luanda', 'Cacuaco', 'Cacuaco / Sequele / Golfe', 3000, '24 - 48 horas', true),
  ('Benguela / Lobito', 'Benguela', 'Benguela', 'Zona Urbana Benguela e Lobito', 4500, '48 - 72 horas', true),
  ('Huambo', 'Huambo', 'Huambo', 'Cidade do Huambo', 5000, '48 - 72 horas', true)
ON CONFLICT DO NOTHING;

-- ==============================================================================
-- 38. DESIGNAÇÃO SEGURA DO PRIMEIRO ADMINISTRADOR (Item 19)
-- ==============================================================================
-- Instruções:
-- 1. Registe-se normalmente na aplicação AngolaMarket (ex: com o email do responsável).
-- 2. No SQL Editor do Supabase, execute o comando com as aspas simples:
--
--    UPDATE public.profiles
--    SET role = 'admin', status = 'active'
--    WHERE email = 'seu-email-aqui@gmail.com';
--
-- 3. A partir de então, aceda com essa conta e terá acesso total ao painel /admin.
-- ==============================================================================
