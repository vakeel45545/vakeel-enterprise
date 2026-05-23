import { createClient as createServerClient } from './server';

/**
 * Verifies the current user is authenticated, then returns the server client.
 * The admin layout already gates access to /admin routes.
 */
export async function verifyAdminAndGetClient() {
  const supabase = await createServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error('Unauthorized: You must be logged in.');
  }

  return supabase;
}
