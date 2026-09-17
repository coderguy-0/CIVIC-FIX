import { requireUser } from '../../../../../lib/auth/require-user';
import { failure, success } from '../../../../../lib/api/response';

type Context = {
  params: Promise<{ id: string }> | { id: string };
};

export async function POST(request: Request, context: Context) {
  try {
    const { supabase, user } = await requireUser(request);
    const resolvedParams = await context.params;
    const reportId = resolvedParams.id;

    // Check if user already confirmed
    const { data: existing } = await supabase
      .from('public_report_confirmations')
      .select('id')
      .eq('public_report_id', reportId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (existing) {
      // Remove confirmation
      await supabase
        .from('public_report_confirmations')
        .delete()
        .eq('id', existing.id);

      return success({ confirmed: false, message: 'Confirmation removed.' });
    } else {
      // Add confirmation
      await supabase
        .from('public_report_confirmations')
        .insert({
          public_report_id: reportId,
          user_id: user.id,
        });

      return success({ confirmed: true, message: 'Community confirmation recorded.' });
    }
  } catch (err: any) {
    if (err.code === 'UNAUTHENTICATED' || err.message === 'UNAUTHENTICATED') {
      return failure('UNAUTHENTICATED', 'You must be signed in.', 401);
    }
    return failure('INTERNAL_ERROR', 'Unable to toggle confirmation.', 500);
  }
}
