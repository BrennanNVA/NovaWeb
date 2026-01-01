import { NextResponse } from "next/server"

export const runtime = "nodejs"

export function GET() {
  return NextResponse.json({
    ok: true,
    service: "web",
    now: new Date().toISOString(),
    env: {
      hasSupabaseUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
      hasSupabaseAnonKey: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
      hasSupabaseServiceRoleKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
      hasCronSecret: Boolean(process.env.CRON_SECRET),
    },
  })
}
