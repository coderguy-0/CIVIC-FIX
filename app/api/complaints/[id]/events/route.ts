import { requireUser } from '../../../../../lib/auth/require-user';
import { failure, success } from '../../../../../lib/api/response';
import { createEventSchema } from '../../../../../lib/validation/event';
import { addComplaintEvent } from '../../../../../lib/complaints/mutations';
import { checkRateLimit } from '../../../../../lib/security/rate-limit';

type Context = {
  params: Promise<{ id: string }> | { id: string };
};

export async function GET(request: Request, context: Context) {
  try {
    const { supabase, user } = await requireUser(request);
    const resolvedParams = await context.params;
    const complaintId = resolvedParams.id;

    // Verify ownership
    const { data: complaint, error: compError } = await supabase
      .from('complaints')
      .select('id')
      .eq('id', complaintId)
      .eq('user_id', user.id)
      .single();

    if (compError || !complaint) {
      return failure('NOT_FOUND', 'Complaint not found.', 404);
    }

    const { data: events, error } = await supabase
      .from('complaint_events')
      .select('*')
      .eq('complaint_id', complaintId)
      .order('occurred_at', { ascending: false });

    if (error) {
      return failure('DATABASE_ERROR', 'Unable to fetch events.', 500);
    }

    return success(events || []);
  } catch (err: any) {
    if (err.code === 'UNAUTHENTICATED' || err.message === 'UNAUTHENTICATED') {
      return failure('UNAUTHENTICATED', 'You must be signed in.', 401);
    }
    return failure('INTERNAL_ERROR', 'Something went wrong.', 500);
  }
}

export async function POST(request: Request, context: Context) {
  try {
    const { supabase, user } = await requireUser(request);
    const resolvedParams = await context.params;
    const complaintId = resolvedParams.id;

    // Rate limit: max 20 events per minute
    const rateCheck = checkRateLimit(`event_${user.id}`, 20, 60);
    if (!rateCheck.allowed) {
      return failure('RATE_LIMITED', 'Too many events added. Please wait a moment.', 429);
    }

    const body = await request.json();
    const parsed = createEventSchema.safeParse(body);

    if (!parsed.success) {
      return failure(
        'VALIDATION_ERROR',
        'Invalid event parameters.',
        400,
        parsed.error.flatten().fieldErrors
      );
    }

    const newEvent = await addComplaintEvent(supabase, complaintId, user.id, parsed.data);
    return success(newEvent, 201);
  } catch (err: any) {
    if (err.code === 'UNAUTHENTICATED' || err.message === 'UNAUTHENTICATED') {
      return failure('UNAUTHENTICATED', 'You must be signed in.', 401);
    }
    if (err.code === 'NOT_FOUND') {
      return failure('NOT_FOUND', 'Complaint not found.', 404);
    }
    if (err.code === 'INVALID_TRANSITION') {
      return failure('INVALID_TRANSITION', err.message, 400);
    }
    console.error('event_create_error', err);
    return failure('DATABASE_ERROR', 'Unable to add event to complaint timeline.', 500);
  }
}
