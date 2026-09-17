import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../supabase/database.types';
import { CreateComplaintInput, UpdateComplaintInput } from '../validation/complaint';
import { CreateEventInput } from '../validation/event';
import { canTransition } from './status';
import { AppError } from '../api/errors';

export async function createComplaint(
  supabase: SupabaseClient<Database>,
  userId: string,
  input: CreateComplaintInput
) {
  const { data, error } = await supabase
    .from('complaints')
    .insert({
      user_id: userId,
      title: input.title,
      description: input.description || null,
      category: input.category,
      authority_name: input.authorityName || null,
      official_reference: input.officialReference || null,
      official_portal_url: input.officialPortalUrl || null,
      state_code: input.stateCode || null,
      state_name: input.stateName || null,
      district: input.district || null,
      locality: input.locality || null,
      latitude: input.latitude || null,
      longitude: input.longitude || null,
      status: input.status || 'draft',
      submitted_at: input.submittedAt || null,
      next_follow_up_at: input.nextFollowUpAt || null,
    })
    .select()
    .single();

  if (error) throw error;

  // Insert initial creation event
  await supabase.from('complaint_events').insert({
    complaint_id: data.id,
    user_id: userId,
    event_type: 'status_changed',
    old_status: null,
    new_status: data.status,
    note: 'Complaint recorded in CivicFix tracker.',
    source_label: 'User reported',
    occurred_at: new Date().toISOString(),
  });

  return data;
}

export async function updateComplaint(
  supabase: SupabaseClient<Database>,
  complaintId: string,
  userId: string,
  input: UpdateComplaintInput
) {
  const { data, error } = await supabase
    .from('complaints')
    .update({
      title: input.title,
      description: input.description,
      category: input.category,
      authority_name: input.authorityName,
      official_reference: input.officialReference,
      official_portal_url: input.officialPortalUrl,
      state_code: input.stateCode,
      state_name: input.stateName,
      district: input.district,
      locality: input.locality,
      latitude: input.latitude,
      longitude: input.longitude,
      submitted_at: input.submittedAt,
      next_follow_up_at: input.nextFollowUpAt,
    })
    .eq('id', complaintId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function addComplaintEvent(
  supabase: SupabaseClient<Database>,
  complaintId: string,
  userId: string,
  input: CreateEventInput
) {
  // 1. Fetch current complaint status & verify ownership
  const { data: currentComplaint, error: fetchError } = await supabase
    .from('complaints')
    .select('id, status')
    .eq('id', complaintId)
    .eq('user_id', userId)
    .single();

  if (fetchError || !currentComplaint) {
    throw new AppError('NOT_FOUND', 'Complaint not found.', 404);
  }

  // 2. Validate status transition if a new status is specified
  if (input.newStatus && input.newStatus !== currentComplaint.status) {
    if (!canTransition(currentComplaint.status, input.newStatus)) {
      throw new AppError(
        'INVALID_TRANSITION',
        `Cannot transition from "${currentComplaint.status}" to "${input.newStatus}".`,
        400
      );
    }

    // Update complaint status
    const updatePayload: any = { status: input.newStatus };
    if (input.newStatus === 'resolved') {
      updatePayload.resolved_at = new Date().toISOString();
    } else if (input.newStatus === 'closed') {
      updatePayload.closed_at = new Date().toISOString();
    }

    await supabase
      .from('complaints')
      .update(updatePayload)
      .eq('id', complaintId)
      .eq('user_id', userId);
  }

  // 3. Insert timeline event
  const { data: event, error: eventError } = await supabase
    .from('complaint_events')
    .insert({
      complaint_id: complaintId,
      user_id: userId,
      event_type: input.eventType,
      old_status: currentComplaint.status,
      new_status: input.newStatus || currentComplaint.status,
      note: input.note || null,
      source_label: input.sourceLabel || 'User reported',
      occurred_at: input.occurredAt || new Date().toISOString(),
    })
    .select()
    .single();

  if (eventError) throw eventError;
  return event;
}
