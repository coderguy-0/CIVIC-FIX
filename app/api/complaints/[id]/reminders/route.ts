import { requireUser } from '../../../../../lib/auth/require-user';
import { failure, success } from '../../../../../lib/api/response';
import { createReminderSchema } from '../../../../../lib/validation/reminder';

type Context = {
  params: Promise<{ id: string }> | { id: string };
};

export async function POST(request: Request, context: Context) {
  try {
    const { supabase, user } = await requireUser(request);
    const resolvedParams = await context.params;
    const complaintId = resolvedParams.id;

    // Verify complaint exists & user owns it
    const { data: complaint, error: compError } = await supabase
      .from('complaints')
      .select('id')
      .eq('id', complaintId)
      .eq('user_id', user.id)
      .single();

    if (compError || !complaint) {
      return failure('NOT_FOUND', 'Complaint not found.', 404);
    }

    const body = await request.json();
    const parsed = createReminderSchema.safeParse(body);

    if (!parsed.success) {
      return failure(
        'VALIDATION_ERROR',
        'Invalid reminder details.',
        400,
        parsed.error.flatten().fieldErrors
      );
    }

    const remindAtDate = new Date(parsed.data.remindAt);
    if (remindAtDate.getTime() <= Date.now()) {
      return failure('INVALID_DATE', 'Reminder must be scheduled for a future time.', 400);
    }

    const { data: reminder, error: insertError } = await supabase
      .from('reminders')
      .insert({
        complaint_id: complaintId,
        user_id: user.id,
        remind_at: remindAtDate.toISOString(),
        message: parsed.data.message,
      })
      .select()
      .single();

    if (insertError) {
      return failure('DATABASE_ERROR', 'Unable to create reminder.', 500);
    }

    // Also update next_follow_up_at on complaint
    await supabase
      .from('complaints')
      .update({ next_follow_up_at: remindAtDate.toISOString() })
      .eq('id', complaintId);

    return success(reminder, 201);
  } catch (err: any) {
    if (err.code === 'UNAUTHENTICATED' || err.message === 'UNAUTHENTICATED') {
      return failure('UNAUTHENTICATED', 'You must be signed in.', 401);
    }
    return failure('INTERNAL_ERROR', 'Something went wrong.', 500);
  }
}
