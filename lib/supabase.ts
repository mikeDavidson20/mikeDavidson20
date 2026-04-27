import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { env } from './env';
import type { Database } from '@/types/database';

let browserClient: SupabaseClient<Database> | null = null;
let adminClient: SupabaseClient<Database> | null = null;

function assertSupabasePublicEnv() {
  if (!env.supabaseUrl || !env.supabaseAnonKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY.');
  }
}

function assertSupabaseAdminEnv() {
  if (!env.supabaseUrl || !env.supabaseServiceRole) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.');
  }
}

export function getSupabaseBrowserClient() {
  if (!browserClient) {
    assertSupabasePublicEnv();
    browserClient = createClient<Database>(env.supabaseUrl, env.supabaseAnonKey);
  }
  return browserClient;
}

export function getSupabaseAdminClient() {
  if (!adminClient) {
    assertSupabaseAdminEnv();
    adminClient = createClient<Database>(env.supabaseUrl, env.supabaseServiceRole, {
      auth: { persistSession: false, autoRefreshToken: false }
    });
  }
  return adminClient;
}
