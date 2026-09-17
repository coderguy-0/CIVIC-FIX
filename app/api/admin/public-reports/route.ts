import { requireModerator } from '../../../../lib/auth/require-user';
import { failure, success } from '../../../../lib/api/response';

export async function GET(request: Request) {
  try {
    const { supabase } = await requireModerator(request);
    const url = new URL(request.url);
    const status = url.searchParams.get('status') || 'pending';

    let query = supabase
      .from('public_reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (status !== 'all') {
      query = query.eq('moderation_status', status as any);
    }

    const { data, error } = await query;

    if (error) {
      return failure('DATABASE_ERROR', 'Unable to fetch moderation queue.', 500);
    }

    return success(data || []);
  } catch (err: any) {
    if (err.code === 'UNAUTHENTICATED' || err.message === 'UNAUTHENTICATED') {
      return failure('UNAUTHENTICATED', 'You must be signed in.', 401);
    }
    if (err.code === 'FORBIDDEN') {
      return failure('FORBIDDEN', 'Moderator access required.', 403);
    }
    return failure('INTERNAL_ERROR', 'Something went wrong.', 500);
  }
}
