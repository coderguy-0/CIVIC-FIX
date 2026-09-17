import { requireUser } from '../../../lib/auth/require-user';
import { createComplaintSchema } from '../../../lib/validation/complaint';
import { failure, success } from '../../../lib/api/response';
import { checkRateLimit } from '../../../lib/security/rate-limit';
import { createComplaint } from '../../../lib/complaints/mutations';
import { getComplaints } from '../../../lib/complaints/queries';

export async function GET(request: Request) {
  try {
    const { supabase, user } = await requireUser(request);

    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const category = url.searchParams.get('category');
    const limit = Number(url.searchParams.get('limit') || 20);
    const offset = Number(url.searchParams.get('offset') || 0);

    const { data, error, count } = await getComplaints(supabase, {
      userId: user.id,
      status,
      category,
      limit,
      offset,
    });

    if (error) {
      console.error('complaint_list_error', error);
      return failure('DATABASE_ERROR', 'Unable to load complaints.', 500);
    }

    return success({
      items: data || [],
      pagination: {
        limit,
        offset,
        total: count ?? (data?.length || 0),
      },
    });
  } catch (err: any) {
    if (err.code === 'UNAUTHENTICATED' || err.message === 'UNAUTHENTICATED') {
      return failure('UNAUTHENTICATED', 'You must be signed in.', 401);
    }
    console.error('complaint_get_error', err);
    return failure('INTERNAL_ERROR', 'Something went wrong.', 500);
  }
}

export async function POST(request: Request) {
  try {
    const { supabase, user } = await requireUser(request);

    // Rate limiting: 10 complaints per minute per user
    const rateCheck = checkRateLimit(`create_complaint_${user.id}`, 10, 60);
    if (!rateCheck.allowed) {
      return failure(
        'RATE_LIMITED',
        `Rate limit reached. Please wait ${rateCheck.resetInSeconds} seconds before adding another complaint.`,
        429
      );
    }

    const body = await request.json();
    const parsed = createComplaintSchema.safeParse(body);

    if (!parsed.success) {
      return failure(
        'VALIDATION_ERROR',
        'Please check the complaint details.',
        400,
        parsed.error.flatten().fieldErrors
      );
    }

    const newComplaint = await createComplaint(supabase, user.id, parsed.data);
    return success(newComplaint, 201);
  } catch (err: any) {
    if (err.code === 'UNAUTHENTICATED' || err.message === 'UNAUTHENTICATED') {
      return failure('UNAUTHENTICATED', 'You must be signed in.', 401);
    }
    console.error('complaint_create_error', err);
    return failure('DATABASE_ERROR', 'Unable to save the complaint.', 500);
  }
}
