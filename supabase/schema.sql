-- ==============================================================================
-- ANGOLAMARKET - SUPABASE DATABASE SCHEMA WITH ROW LEVEL SECURITY (RLS)
-- Mercado Angolano de Comércio Eletrónico, Produtores e Afiliados
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Custom Types
CREATE TYPE user_role_type AS ENUM ('client', 'affiliate', 'producer', 'admin');
CREATE TYPE user_status_type AS ENUM ('active', 'pending', 'suspended', 'blocked');
CREATE TYPE product_status_type AS ENUM ('draft', 'pending', 'approved', 'rejected', 'inactive');
CREATE TYPE producer_status_type AS ENUM ('pending', 'approved', 'suspended', 'rejected');
CREATE TYPE affiliate_status_type AS ENUM ('pending', 'approved', 'suspended', 'rejected');
CREATE TYPE order_status_type AS ENUM (
  'Pedido recebido',
  'Pagamento pendente',
  'Pagamento confirmado',
  'Em preparação',
  'Aguardando recolha',
  'Em entrega',
  'Entregue',
  'Cancelado'
);
CREATE TYPE payment_method_type AS ENUM (
  'Multicaixa Express',
  'PayPay',
  'Transferência bancária',
  'Pagamento na entrega'
);

-- ==============================================================================
-- 3. PROFILES TABLE (Item 5)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  whatsapp TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'affiliate', 'producer', 'admin')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending', 'suspended', 'blocked')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Keep user_id in sync with id for backward compatibility
CREATE OR REPLACE FUNCTION handle_profile_user_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.user_id IS NULL THEN
    NEW.user_id := NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER tr_profile_user_id
BEFORE INSERT ON profiles
FOR EACH ROW EXECUTE FUNCTION handle_profile_user_id();

-- ==============================================================================
-- 4. CATEGORIES TABLE (Item 8)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 5. PRODUCERS TABLE (Item 11)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS producers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  description TEXT,
  phone TEXT,
  whatsapp TEXT,
  pickup_address TEXT,
  province TEXT NOT NULL DEFAULT 'Luanda',
  municipality TEXT NOT NULL DEFAULT 'Talatona',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'suspended', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 6. AFFILIATES TABLE (Item 12)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS affiliates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  affiliate_code TEXT UNIQUE NOT NULL, -- e.g. AF83921
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'suspended', 'rejected')),
  commission_rate NUMERIC(5, 2) NOT NULL DEFAULT 10.00 CHECK (commission_rate >= 0),
  total_sales NUMERIC(14, 2) NOT NULL DEFAULT 0,
  total_commission NUMERIC(14, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 7. PRODUCTS TABLE (Item 9)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  producer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price NUMERIC(14, 2) NOT NULL CHECK (price >= 0),
  sale_price NUMERIC(14, 2) CHECK (sale_price IS NULL OR sale_price < price),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  commission_rate NUMERIC(5, 2) NOT NULL DEFAULT 10.00 CHECK (commission_rate >= 0),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'approved', 'rejected', 'inactive')),
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 8. PRODUCT IMAGES TABLE (Item 10)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 9. DELIVERY ZONES (Províncias e Municípios de Angola)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS delivery_zones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  province TEXT NOT NULL DEFAULT 'Luanda',
  municipality TEXT NOT NULL,
  zone TEXT NOT NULL,
  price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
  estimated_time TEXT NOT NULL DEFAULT '24h - 48h',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 10. ORDERS & ORDER ITEMS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY, -- e.g. AM-2026-000001
  customer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_whatsapp TEXT,
  province TEXT NOT NULL,
  municipality TEXT NOT NULL,
  neighborhood TEXT NOT NULL,
  address TEXT NOT NULL,
  reference_point TEXT,
  notes TEXT,
  subtotal NUMERIC(14, 2) NOT NULL,
  delivery_cost NUMERIC(14, 2) NOT NULL DEFAULT 0,
  discount NUMERIC(14, 2) NOT NULL DEFAULT 0,
  total NUMERIC(14, 2) NOT NULL,
  status order_status_type NOT NULL DEFAULT 'Pedido recebido',
  payment_method payment_method_type NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'verified', 'failed', 'paid_on_delivery')),
  payment_reference TEXT,
  bank_proof_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  product_name TEXT NOT NULL,
  product_image TEXT,
  price NUMERIC(14, 2) NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  producer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  affiliate_ref TEXT,
  commission_amount NUMERIC(14, 2) DEFAULT 0
);

-- ==============================================================================
-- 11. AFFILIATE SALES, CLICKS & WITHDRAWALS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS affiliate_clicks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  affiliate_code TEXT NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS affiliate_sales (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  affiliate_code TEXT NOT NULL,
  order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  product_name TEXT NOT NULL,
  sale_amount NUMERIC(14, 2) NOT NULL,
  commission_rate NUMERIC(5, 2) NOT NULL,
  commission_amount NUMERIC(14, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pendente' CHECK (status IN ('Pendente', 'Confirmada', 'Disponível', 'Levantada', 'Cancelada')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS withdrawals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  affiliate_id UUID NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
  affiliate_name TEXT NOT NULL,
  affiliate_code TEXT NOT NULL,
  amount NUMERIC(14, 2) NOT NULL CHECK (amount > 0),
  fee_amount NUMERIC(14, 2) NOT NULL DEFAULT 0,
  net_amount NUMERIC(14, 2) NOT NULL CHECK (net_amount > 0),
  method TEXT NOT NULL CHECK (method IN ('IBAN', 'Multicaixa Express', 'PayPay', 'Unitel Money', 'Afrimoney')),
  account_number TEXT NOT NULL,
  account_holder_name TEXT NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  rejection_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  processed_at TIMESTAMPTZ
);

-- ==============================================================================
-- 12. AUDIT LOGS TABLE (Item 19)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 13. REVIEWS & FAVORITES
-- ==============================================================================
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  is_verified_purchase BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, product_id)
);

-- ==============================================================================
-- 14. PLATFORM SETTINGS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS platform_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  platform_fee_percent NUMERIC(5, 2) NOT NULL DEFAULT 10.00,
  withdrawal_fee_percent NUMERIC(5, 2) NOT NULL DEFAULT 2.00,
  require_product_approval BOOLEAN NOT NULL DEFAULT true,
  require_affiliate_approval BOOLEAN NOT NULL DEFAULT true,
  auto_make_commission_available_on_delivery BOOLEAN NOT NULL DEFAULT true,
  enabled_multicaixa_express BOOLEAN NOT NULL DEFAULT true,
  enabled_paypay BOOLEAN NOT NULL DEFAULT true,
  enabled_bank_transfer BOOLEAN NOT NULL DEFAULT true,
  enabled_cash_on_delivery BOOLEAN NOT NULL DEFAULT true,
  contact_phone TEXT NOT NULL DEFAULT '+244 923 000 111',
  contact_whatsapp TEXT NOT NULL DEFAULT '+244 923 000 111',
  contact_email TEXT NOT NULL DEFAULT 'contacto@angolamarket.ao',
  bank_iban TEXT NOT NULL DEFAULT 'AO06 0040 0000 1234 5678 9012 3',
  bank_name TEXT NOT NULL DEFAULT 'Banco Angolano de Investimentos (BAI)',
  bank_beneficiary TEXT NOT NULL DEFAULT 'AngolaMarket Lda',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT single_row CHECK (id = 1)
);

-- Seed default platform settings
INSERT INTO platform_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- 15. AUTOMATIC USER PROFILE TRIGGER (On Supabase Auth Signup)
-- ==============================================================================
-- Ensures that every user registered in Supabase starts as 'client' with 'active' status.
-- Users CANNOT choose to be administrator during signup (Item 3 & Item 4).
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    user_id,
    full_name,
    phone,
    whatsapp,
    role,
    status
  ) VALUES (
    NEW.id,
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'phone', '+244 900 000 000'),
    COALESCE(NEW.raw_user_meta_data->>'whatsapp', NEW.raw_user_meta_data->>'phone'),
    'client', -- ALWAYS starts as CLIENTE
    'active'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Hook into auth.users (runs automatically in Supabase)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 16. ROW LEVEL SECURITY (RLS) POLICIES (Item 7)
-- ==============================================================================

-- Helper function to check role of currently authenticated user
CREATE OR REPLACE FUNCTION public.get_auth_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE producers ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawals ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;

-- A. PROFILES POLICIES
CREATE POLICY "Public profiles are readable by authenticated users" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile (except role)" ON profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND
    (role = (SELECT role FROM profiles WHERE id = auth.uid()) OR get_auth_role() = 'admin')
  );

CREATE POLICY "Admins have full access to profiles" ON profiles
  FOR ALL USING (get_auth_role() = 'admin');

-- B. CATEGORIES POLICIES
CREATE POLICY "Categories viewable by everyone" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage categories" ON categories
  FOR ALL USING (get_auth_role() = 'admin');

-- C. PRODUCERS POLICIES
CREATE POLICY "Approved producers viewable by everyone" ON producers
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Users can view their own producer record" ON producers
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can submit producer application" ON producers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Producers can update their own record" ON producers
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all producers" ON producers
  FOR ALL USING (get_auth_role() = 'admin');

-- D. AFFILIATES POLICIES
CREATE POLICY "Affiliates can view own affiliate record" ON affiliates
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can submit affiliate application" ON affiliates
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all affiliates" ON affiliates
  FOR ALL USING (get_auth_role() = 'admin');

-- E. PRODUCTS POLICIES
-- Only approved and active products appear publicly (Item 9)
CREATE POLICY "Approved active products are viewable by everyone" ON products
  FOR SELECT USING (is_active = true AND status = 'approved');

CREATE POLICY "Producers can view all their own products" ON products
  FOR SELECT USING (auth.uid() = producer_id);

CREATE POLICY "Producers can insert their own products" ON products
  FOR INSERT WITH CHECK (
    auth.uid() = producer_id AND
    EXISTS (SELECT 1 FROM producers WHERE user_id = auth.uid() AND status = 'approved')
  );

CREATE POLICY "Producers can update their own products" ON products
  FOR UPDATE USING (auth.uid() = producer_id);

CREATE POLICY "Admins have full access to products" ON products
  FOR ALL USING (get_auth_role() = 'admin');

-- F. PRODUCT IMAGES POLICIES
CREATE POLICY "Product images viewable by everyone" ON product_images
  FOR SELECT USING (true);

CREATE POLICY "Producers can manage images of their products" ON product_images
  FOR ALL USING (
    EXISTS (SELECT 1 FROM products WHERE products.id = product_images.product_id AND products.producer_id = auth.uid())
  );

CREATE POLICY "Admins have full access to product images" ON product_images
  FOR ALL USING (get_auth_role() = 'admin');

-- G. ORDERS POLICIES
-- Client can only view their own orders (Item 7)
CREATE POLICY "Clients can view own orders" ON orders
  FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "Clients can create own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Admins can view and manage all orders" ON orders
  FOR ALL USING (get_auth_role() = 'admin');

-- H. ORDER ITEMS POLICIES
CREATE POLICY "Clients can view their own order items" ON order_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.customer_id = auth.uid())
  );

-- Producer can only view order items of their own products (Item 7)
CREATE POLICY "Producers can view order items of their products" ON order_items
  FOR SELECT USING (auth.uid() = producer_id);

CREATE POLICY "Admins can manage all order items" ON order_items
  FOR ALL USING (get_auth_role() = 'admin');

-- I. AFFILIATE CLICKS, SALES & WITHDRAWALS POLICIES
-- Affiliate can only consult their own clicks, sales and withdrawals (Item 7)
CREATE POLICY "Affiliates can view their own clicks" ON affiliate_clicks
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM affiliates WHERE affiliates.affiliate_code = affiliate_clicks.affiliate_code AND affiliates.user_id = auth.uid())
  );

CREATE POLICY "Affiliates can view their own sales" ON affiliate_sales
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM affiliates WHERE affiliates.affiliate_code = affiliate_sales.affiliate_code AND affiliates.user_id = auth.uid())
  );

CREATE POLICY "Affiliates can view own withdrawals" ON withdrawals
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM affiliates WHERE affiliates.id = withdrawals.affiliate_id AND affiliates.user_id = auth.uid())
  );

CREATE POLICY "Affiliates can submit withdrawal request" ON withdrawals
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM affiliates WHERE affiliates.id = withdrawals.affiliate_id AND affiliates.user_id = auth.uid())
  );

CREATE POLICY "Admins have full access to affiliate clicks, sales, withdrawals" ON affiliate_sales
  FOR ALL USING (get_auth_role() = 'admin');

CREATE POLICY "Admins manage withdrawals" ON withdrawals
  FOR ALL USING (get_auth_role() = 'admin');

-- J. AUDIT LOGS POLICIES
CREATE POLICY "Admins can view all audit logs" ON audit_logs
  FOR SELECT USING (get_auth_role() = 'admin');

CREATE POLICY "Authenticated users can insert audit logs" ON audit_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- K. REVIEWS & FAVORITES POLICIES
CREATE POLICY "Reviews viewable by everyone" ON reviews
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can add reviews" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage own favorites" ON favorites
  FOR ALL USING (auth.uid() = user_id);

-- L. DELIVERY ZONES & SETTINGS
CREATE POLICY "Active delivery zones viewable by everyone" ON delivery_zones
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins manage delivery zones" ON delivery_zones
  FOR ALL USING (get_auth_role() = 'admin');

CREATE POLICY "Platform settings viewable by everyone" ON platform_settings
  FOR SELECT USING (true);

CREATE POLICY "Admins update platform settings" ON platform_settings
  FOR ALL USING (get_auth_role() = 'admin');

-- ==============================================================================
-- 17. SUPABASE STORAGE BUCKETS SETUP (Item 10)
-- ==============================================================================
-- Execute in Supabase SQL editor to create the public storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies
CREATE POLICY "Public product images are viewable by everyone"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

CREATE POLICY "Producers and Admins can upload product images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'product-images' AND
    (public.get_auth_role() IN ('producer', 'admin'))
  );

CREATE POLICY "Users can upload their own avatars"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Public avatars viewable by everyone"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

-- ==============================================================================
-- 18. SAFE FIRST ADMINISTRATOR DESIGNATION (Item 4)
-- ==============================================================================
-- Como criar o primeiro administrador de forma segura:
-- 1. O primeiro utilizador cria uma conta normalmente pelo formulário (que cria com role = 'client').
-- 2. No SQL Editor do Supabase, o proprietário do projeto executa o comando abaixo:
--
-- UPDATE public.profiles
-- SET role = 'admin'
-- WHERE email = 'admin@angolamarket.ao'; -- substitua pelo seu email cadastrado
--
-- 3. A partir deste momento, este administrador tem permissão para promover
--    outros utilizadores para administrador diretamente pelo Painel Administrativo.
