import { createClient } from "@supabase/supabase-js";

const env = import.meta.env;

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("[Supabase] Missing required Vite env vars:", {
    VITE_SUPABASE_URL: supabaseUrl,
    VITE_SUPABASE_ANON_KEY: supabaseAnonKey ? "[set]" : undefined,
  });
}

export const supabase = createClient(supabaseUrl ?? "", supabaseAnonKey ?? "");
