import { createClient } from '@supabase/supabase-js';

// Supabase client initialization using Vite environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-project.supabase.co' &&
  !supabaseUrl.includes('placeholder')
);

// If keys exist, create standard supabase client; otherwise provide a stubbed client to prevent runtime crash
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : (null as unknown as ReturnType<typeof createClient>);

export interface SupabaseConfigStatus {
  isConfigured: boolean;
  url: string;
  hasAnonKey: boolean;
}

export function getSupabaseConfigStatus(): SupabaseConfigStatus {
  return {
    isConfigured: isSupabaseConfigured,
    url: isSupabaseConfigured
      ? supabaseUrl
      : 'Ambiente de Teste Local (Configurar VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no ficheiro .env para conexão direta)',
    hasAnonKey: Boolean(supabaseAnonKey),
  };
}

/**
 * Storage helpers for uploading product images & user avatars
 */
export async function uploadProductImage(
  file: File,
  productId: string
): Promise<{ url: string | null; error: string | null }> {
  if (!isSupabaseConfigured || !supabase) {
    // When running in local demo mode, return an object URL or simulated image
    return {
      url: URL.createObjectURL(file),
      error: null,
    };
  }

  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${productId}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(fileName, file, { upsert: true });

    if (uploadError) {
      return { url: null, error: uploadError.message };
    }

    const { data } = supabase.storage.from('product-images').getPublicUrl(fileName);
    return { url: data.publicUrl, error: null };
  } catch (err: unknown) {
    return {
      url: null,
      error: err instanceof Error ? err.message : 'Erro ao carregar imagem para o Supabase Storage',
    };
  }
}

export async function uploadAvatar(
  file: File,
  userId: string
): Promise<{ url: string | null; error: string | null }> {
  if (!isSupabaseConfigured || !supabase) {
    return {
      url: URL.createObjectURL(file),
      error: null,
    };
  }

  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/avatar-${Date.now()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, { upsert: true });

    if (uploadError) {
      return { url: null, error: uploadError.message };
    }

    const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
    return { url: data.publicUrl, error: null };
  } catch (err: unknown) {
    return {
      url: null,
      error: err instanceof Error ? err.message : 'Erro ao carregar avatar',
    };
  }
}

