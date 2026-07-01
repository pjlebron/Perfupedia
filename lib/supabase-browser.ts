// Usamos el mismo createClient simple que usa el resto del sitio — sin @supabase/ssr
import { createClient } from "@supabase/supabase-js";

export function getSupabaseBrowser() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
