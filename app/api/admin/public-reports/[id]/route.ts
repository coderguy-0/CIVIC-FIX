import { requireModerator } from '../../../../../lib/auth/require-user';
import { failure, success } from '../../../../../lib/api/response';
import { moderateReportSchema } from '../../../../../lib/validation/public-report';
import { logModerationAction } from '../../../../../lib/security/audit';

type Context = {
  params: Promise<{ id: string }> | { id: string };
};

export async function PATCH(request: Request, context: Context) {
  try {
    const { supabase, user } = await requireModerator(request);
    const resolvedParams = await context.params;
    const reportId = resolvedParams.id;

    const body = await request.json();
    const parsed = moderateReportSchema.safeParse(body);

    if (!parsed.success) {
      return failure(
        'VALIDATION_ERROR',
        'Invalid moderation payload.',
        400,
        parsed.error.flatten().fieldErrors
      );
    }

    const { action, reason } = parsed.data;

    const newStatus =
      action === 'approve'
        ? 'approved'
        : action === 'reject'
        ? 'rejected'
        : action === 'hide'
        ? 'hidden'
        : 'approved';

    // Update public report status
    const { data: updatedReport, error: updateError } = await supabase
      .from('public_reports')
      .update({
        moderation_status: newStatus,
        moderation_notes: reason || null,
      })
      .eq('id', reportId)
      .select()
      .single();

    if (updateError || !updatedReport) {
      return failure('NOT_FOUND', 'Public report not found.', 404);
    }

    // Record audit log
    await logModerationAction(supabase, {
      moderatorId: user.id,
      publicReportId: reportId,
      action,
      reason,
    });

    return success({
      report: updatedReport,
      moderatedBy: user.id,
      action,
    });
  } catch (err: any) {
    if (err.code === 'UNAUTHENTICATED' || err.message === 'UNAUTHENTICATED') {
      return failure('UNAUTHENTICATED', 'You must be signed in.', 401);
    }
    if (err.code === 'FORBIDDEN') {
      return failure('FORBIDDEN', 'Moderator access required.', 403);
    }
    return failure('INTERNAL_ERROR', 'Unable to moderate report.', 500);
  }
}
