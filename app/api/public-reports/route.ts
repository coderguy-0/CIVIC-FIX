import { requireUser } from '../../../lib/auth/require-user';
import { failure, success } from '../../../lib/api/response';
import { createPublicReportSchema } from '../../../lib/validation/public-report';
import { checkRateLimit } from '../../../lib/security/rate-limit';

export async function GET(request: Request) {
  try {
    const { supabase } = await requireUser(request);
    const url = new URL(request.url);
    const category = url.searchParams.get('category');
    const stateCode = url.searchParams.get('stateCode');
    const search = url.searchParams.get('q');
    const limit = Math.min(Number(url.searchParams.get('limit') || 20), 50);
    const offset = Math.max(Number(url.searchParams.get('offset') || 0), 0);

    let query = supabase
      .from('public_reports')
      .select(
        `
        id,
        public_title,
        public_description,
        category,
        approximate_location,
        state_code,
        district,
        latitude,
        longitude,
        confirmations_count,
        moderation_status,
        created_at,
        updated_at
      `,
        { count: 'exact' }
      )
      .eq('moderation_status', 'approved')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (category && category !== 'all') {
      query = query.eq('category', category as any);
    }

    if (stateCode && stateCode !== 'ALL') {
      query = query.eq('state_code', stateCode);
    }

    if (search) {
      query = query.ilike('public_title', `%${search}%`);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('public_reports_get_error', error);
      return failure('DATABASE_ERROR', 'Unable to load public reports.', 500);
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
    console.error('public_reports_err', err);
    return failure('INTERNAL_ERROR', 'Something went wrong.', 500);
  }
}

export async function POST(request: Request) {
  try {
    const { supabase, user } = await requireUser(request);

    // Rate limiting: 5 public reports per hour
    const rateCheck = checkRateLimit(`public_report_${user.id}`, 5, 3600);
    if (!rateCheck.allowed) {
      return failure(
        'RATE_LIMITED',
        `Rate limit exceeded. Please wait ${Math.ceil(rateCheck.resetInSeconds / 60)} minutes before sharing another public summary.`,
        429
      );
    }

    const body = await request.json();
    const parsed = createPublicReportSchema.safeParse(body);

    if (!parsed.success) {
      return failure(
        'VALIDATION_ERROR',
        'Invalid public report details.',
        400,
        parsed.error.flatten().fieldErrors
      );
    }

    const { complaintId, publicTitle, publicDescription, approximateLocation } = parsed.data;

    // 1. Verify complaint exists and belongs to authenticated user
    const { data: complaint, error: compError } = await supabase
      .from('complaints')
      .select('id, category, state_code, district, latitude, longitude')
      .eq('id', complaintId)
      .eq('user_id', user.id)
      .single();

    if (compError || !complaint) {
      return failure('NOT_FOUND', 'Private complaint not found or access denied.', 404);
    }

    // 2. Verify no existing public report exists for this complaint
    const { data: existing } = await supabase
      .from('public_reports')
      .select('id')
      .eq('complaint_id', complaintId)
      .maybeSingle();

    if (existing) {
      return failure('ALREADY_EXISTS', 'A public summary already exists for this complaint.', 409);
    }

    // 3. Create public report (moderation_status starts as 'pending')
    const { data: newReport, error: insertError } = await supabase
      .from('public_reports')
      .insert({
        complaint_id: complaintId,
        user_id: user.id,
        public_title: publicTitle,
        public_description: publicDescription,
        category: complaint.category,
        approximate_location: approximateLocation,
        state_code: complaint.state_code,
        district: complaint.district,
        latitude: complaint.latitude,
        longitude: complaint.longitude,
        moderation_status: 'pending',
      })
      .select()
      .single();

    if (insertError) {
      console.error('public_report_insert_error', insertError);
      return failure('DATABASE_ERROR', 'Unable to create public summary.', 500);
    }

    // 4. Update complaint flag
    await supabase
      .from('complaints')
      .update({ is_public_summary_shared: true })
      .eq('id', complaintId)
      .eq('user_id', user.id);

    return success(
      {
        ...newReport,
        message: 'Summary submitted for moderation. It will appear on Explore once approved.',
      },
      201
    );
  } catch (err: any) {
    if (err.code === 'UNAUTHENTICATED' || err.message === 'UNAUTHENTICATED') {
      return failure('UNAUTHENTICATED', 'You must be signed in.', 401);
    }
    return failure('INTERNAL_ERROR', 'Something went wrong.', 500);
  }
}
