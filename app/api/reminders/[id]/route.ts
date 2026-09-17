import { requireUser } from '../../../../lib/auth/require-user';
import { failure, success } from '../../../../lib/api/response';
import { updateReminderSchema } from '../../../../lib/validation/reminder';

type Context = {
  params: Promise<{ id: string }> | { id: string };
};

export async function PATCH(request: Request, context: Context) {
  try {
    const { supabase, user } = await requireUser(request);
    const resolvedParams = await context.params;
    const reminderId = resolvedParams.id;

    const body = await request.json();
    const parsed = updateReminderSchema.safeParse(body);

    if (!parsed.success) {
      return failure('VALIDATION_ERROR', 'Invalid reminder update payload.', 400);
    }

    const completedAt = parsed.data.completed ? new Date().toISOString() : null;

    const { data: updated, error } = await supabase
      .from('reminders')
      .update({ completed_at: completedAt })
      .eq('id', reminderId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error || !updated) {
      return failure('NOT_FOUND', 'Reminder not found.', 404);
    }

    return success(updated);
  } catch (err: any) {
    if (err.code === 'UNAUTHENTICATED' || err.message === 'UNAUTHENTICATED') {
      return failure('UNAUTHENTICATED', 'You must be signed in.', 401);
    }
    return failure('INTERNAL_ERROR', 'Something went wrong.', 500);
  }
}

export async function DELETE(request: Request, context: Context) {
  try {
    const { supabase, user } = await requireUser(request);
    const resolvedParams = await context.params;
    const reminderId = resolvedParams.id;

    const { error } = await supabase
      .from('reminders')
      .delete()
      .eq('id', reminderId)
      .eq('user_id', user.id);

    if (error) {
      return failure('DATABASE_ERROR', 'Unable to delete reminder.', 500);
    }

    return success({ deleted: true, id: reminderId });
  } catch (err: any) {
    if (err.code === 'UNAUTHENTICATED' || err.message === 'UNAUTHENTICATED') {
      return failure('UNAUTHENTICATED', 'You must be signed in.', 401);
    }
    return failure('INTERNAL_ERROR', 'Something went wrong.', 500);
  }
}
