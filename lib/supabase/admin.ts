import { createClient, createServiceRoleClient } from './server';

/**
 * Verifies the current user is an authenticated admin.
 * 1. Checks auth session via cookies (anon client)
 * 2. Verifies user exists in admins table
 * 3. Returns service-role client for admin write operations
 */
export async function verifyAdminAndGetClient() {
  // Step 1: Verify auth session
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error('Unauthorized: You must be logged in.');
  }

  // Step 2: Verify user is in admins table
  const { data: admin, error: adminError } = await supabase
    .from('admins')
    .select('id, role')
    .eq('id', user.id)
    .maybeSingle();

  if (adminError || !admin) {
    throw new Error('Forbidden: You do not have admin access.');
  }

  // Step 3: Return service role client for admin operations (bypasses RLS for writes)
  return createServiceRoleClient();
}
