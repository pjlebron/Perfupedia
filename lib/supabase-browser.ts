// Reutilizamos el mismo cliente del sitio público — ya tiene las vars configuradas
// y funciona en producción
import { supabase } from "@/lib/supabase";
export function getSupabaseBrowser() {
  return supabase;
}
