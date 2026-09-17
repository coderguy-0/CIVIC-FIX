import { requireUser } from '../../../../lib/auth/require-user';
import { failure, success } from '../../../../lib/api/response';
import { updateComplaintSchema } from '../../../../lib/validation/complaint';
import { getComplaintWithDetails } from '../../../../lib/complaints/queries';
import { updateComplaint } from '../../../../lib/complaints/mutations';

type Context = {
  params: Promise<{ id: string }> | { id: string };
};

export async function GET(request: Request, context: Context) {
  try {
    const { supabase, user } = await requireUser(request);
    const resolvedParams = await context.params;
    const complaintId = resolvedParams.id;

    const { data, error } = await getComplaintWithDetails(supabase, complaintId, user.id);

    if (error || !data) {
      return failure('NOT_FOUND', 'Complaint not found.', 404);
    }

    return success(data);
  } catch (err: any) {
    if (err.code === 'UNAUTHENTICATED' || err.message === 'UNAUTHENTICATED') {
      return failure('UNAUTHENTICATED', 'You must be signed in.', 401);
    }
    return failure('INTERNAL_ERROR', 'Something went wrong.', 500);
  }
}

export async function PATCH(request: Request, context: Context) {
  try {
    const { supabase, user } = await requireUser(request);
    const resolvedParams = await context.params;
    const complaintId = resolvedParams.id;

    const body = await request.json();
    const parsed = updateComplaintSchema.safeParse(body);

    if (!parsed.success) {
      return failure(
        'VALIDATION_ERROR',
        'Invalid complaint information.',
        400,
        parsed.error.flatten().fieldErrors
      );
    }

    const updated = await updateComplaint(supabase, complaintId, user.id, parsed.data);
    return success(updated);
  } catch (err: any) {
    if (err.code === 'UNAUTHENTICATED' || err.message === 'UNAUTHENTICATED') {
      return failure('UNAUTHENTICATED', 'You must be signed in.', 401);
    }
    if (err.code === 'NOT_FOUND') {
      return failure('NOT_FOUND', 'Complaint not found.', 404);
    }
    return failure('DATABASE_ERROR', 'Unable to update the complaint.', 500);
  }
}

export async function DELETE(request: Request, context: Context) {
  try {
    const { supabase, user } = await requireUser(request);
    const resolvedParams = await context.params;
    const complaintId = resolvedParams.id;

    const { error } = await supabase
      .from('complaints')
      .delete()
      .eq('id', complaintId)
      .eq('user_id', user.id);

    if (error) {
      return failure('DATABASE_ERROR', 'Unable to delete complaint.', 500);
    }

    return success({ deleted: true, id: complaintId });
  } catch (err: any) {
    if (err.code === 'UNAUTHENTICATED' || err.message === 'UNAUTHENTICATED') {
      return failure('UNAUTHENTICATED', 'You must be signed in.', 401);
    }
    return failure('INTERNAL_ERROR', 'Something went wrong.', 500);
  }
}
