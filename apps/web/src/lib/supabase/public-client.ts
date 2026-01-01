import { createClient } from "@supabase/supabase-js"

export function createPublicSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()

  if (!url) throw new Error("NEXT_PUBLIC_SUPABASE_URL is required")
  if (!anonKey) throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is required")

  return createClient(url, anonKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  })
}
