import "server-only"

import { createClient } from "@supabase/supabase-js"

export function createServiceSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()

  if (!url) throw new Error("NEXT_PUBLIC_SUPABASE_URL is required")
  if (!serviceRoleKey) throw new Error("SUPABASE_SERVICE_ROLE_KEY is required")

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  })
}
