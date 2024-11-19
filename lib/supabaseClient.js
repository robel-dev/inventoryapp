import { createClient } from '@supabase/supabase-js'

let supabase = null

export function getSupabaseClient() {
  if (supabase) return supabase

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase environment variables are missing')
    return null
  }

  supabase = createClient(supabaseUrl, supabaseAnonKey)
  return supabase
}

