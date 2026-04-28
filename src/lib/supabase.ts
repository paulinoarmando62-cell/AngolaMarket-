import { createClient } from '@supabase/supabase-js';

const getSupabase = () => {
  let supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'MY_SUPABASE_URL' || supabaseAnonKey === 'MY_SUPABASE_ANON_KEY') {
    throw new Error('As credenciais do Supabase estão em falta ou são inválidas. Por favor, adicione VITE_SUPABASE_URL (com https://) e VITE_SUPABASE_ANON_KEY nos "Settings -> Secrets" do AI Studio.');
  }

  // Ensure URL has protocol and no trailing slash
  if (!supabaseUrl.startsWith('http')) {
    supabaseUrl = `https://${supabaseUrl}`;
  }
  supabaseUrl = supabaseUrl.replace(/\/$/, "");

  return createClient(supabaseUrl, supabaseAnonKey);
};

// Export a proxy that initializes the client on first access
export const supabase = new Proxy({} as any, {
  get: (target, prop) => {
    if (!target._instance) {
      try {
        target._instance = getSupabase();
      } catch (err) {
        // If credentials are missing, we throw the error when the app tries to use supabase
        console.error('Supabase access error:', err);
        throw err;
      }
    }
    return target._instance[prop];
  }
});
