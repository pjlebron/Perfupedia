import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Este cliente se usa en todas las páginas para leer datos de Supabase
// (perfumes, marcas, notas, artículos, etc.)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
