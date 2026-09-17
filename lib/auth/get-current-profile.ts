import { requireUser } from './require-user';

export async function getCurrentProfile(request?: Request | any) {
  const { supabase, user } = await requireUser(request);
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  return {
    id: user.id,
    email: user.email,
    role: (profile as any)?.role || (user as any).role || 'user',
    ...((profile as object) || {}),
  };
}
