import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/database";

export function isSupabaseAdminConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY &&
    process.env.SUPABASE_SERVICE_ROLE_KEY !== "your-service-role-key-here"
  );
}

/**
 * Creates a privileged administrative Supabase client using the SERVICE ROLE key.
 * 
 * SECURITY MANDATE:
 * - This function MUST ONLY be called on the server (Server Actions, Route Handlers).
 * - Never expose SUPABASE_SERVICE_ROLE_KEY in client bundles or return this client to the browser.
 * - Always authenticate and authorize the requesting user session before calling admin operations.
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Supabase Admin client requested but SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL is not set."
    );
  }

  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

