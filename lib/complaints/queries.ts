import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../supabase/database.types';

export async function getComplaints(
  supabase: SupabaseClient<Database>,
  params: {
    userId: string;
    status?: string | null;
    category?: string | null;
    limit?: number;
    offset?: number;
  }
) {
  const limit = Math.min(params.limit || 20, 50);
  const offset = Math.max(params.offset || 0, 0);

  let query = supabase
    .from('complaints')
    .select(
      `
      id,
      title,
      description,
      category,
      status,
      authority_name,
      official_reference,
      official_portal_url,
      locality,
      state_code,
      state_name,
      district,
      next_follow_up_at,
      is_public_summary_shared,
      created_at,
      updated_at
      `,
      { count: 'exact' }
    )
    .eq('user_id', params.userId)
    .order('updated_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (params.status) {
    query = query.eq('status', params.status as any);
  }

  if (params.category) {
    query = query.eq('category', params.category as any);
  }

  return await query;
}

export async function getComplaintWithDetails(
  supabase: SupabaseClient<Database>,
  complaintId: string,
  userId: string
) {
  return await supabase
    .from('complaints')
    .select(
      `
      *,
      complaint_events (
        id,
        event_type,
        old_status,
        new_status,
        note,
        source_label,
        occurred_at,
        created_at
      ),
      reminders (
        id,
        remind_at,
        message,
        completed_at
      )
    `
    )
    .eq('id', complaintId)
    .eq('user_id', userId)
    .single();
}
