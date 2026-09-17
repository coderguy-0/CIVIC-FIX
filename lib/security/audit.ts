import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../supabase/database.types';

export async function logModerationAction(
  supabase: SupabaseClient<Database>,
  params: {
    moderatorId: string;
    publicReportId: string;
    action: 'approve' | 'reject' | 'hide' | 'restore';
    reason?: string;
  }
) {
  try {
    const { error } = await supabase.from('moderation_actions').insert({
      moderator_id: params.moderatorId,
      public_report_id: params.publicReportId,
      action: params.action,
      reason: params.reason || null,
    });

    if (error) {
      console.error('Failed to write moderation audit log:', error);
    }
  } catch (err) {
    console.error('Audit log exception:', err);
  }
}
