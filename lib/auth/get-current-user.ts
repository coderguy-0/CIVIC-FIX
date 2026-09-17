import { requireUser } from './require-user';

export async function getCurrentUser(request?: Request | any) {
  try {
    const { user, supabase } = await requireUser(request);
    return { user, supabase };
  } catch {
    return { user: null, supabase: null };
  }
}
