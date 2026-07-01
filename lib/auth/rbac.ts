import { createClient } from '@/lib/supabase/server';

export type UserRole = 
  | 'super_admin' 
  | 'content_manager' 
  | 'seo_manager' 
  | 'editor' 
  | 'reviewer' 
  | 'writer' 
  | 'viewer';

const ROLE_HIERARCHY: Record<UserRole, number> = {
  viewer: 1,
  writer: 2,
  reviewer: 3,
  seo_manager: 4,
  editor: 5,
  content_manager: 6,
  super_admin: 7
};

/**
 * Get the current user's role from the database.
 */
export async function getCurrentUserRole(): Promise<UserRole | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  const { data: roleData } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single();

  return (roleData?.role as UserRole) || null;
}

/**
 * Check if the current user has at least the required role.
 * (e.g. requires 'editor', user has 'super_admin' -> true)
 */
export async function hasPermission(requiredRole: UserRole): Promise<boolean> {
  const userRole = await getCurrentUserRole();
  if (!userRole) return false;

  const userLevel = ROLE_HIERARCHY[userRole] || 0;
  const requiredLevel = ROLE_HIERARCHY[requiredRole] || 0;

  return userLevel >= requiredLevel;
}
