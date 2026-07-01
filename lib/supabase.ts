import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

// Este cliente se usa en todas las páginas para leer datos de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
