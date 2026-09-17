import { complaintStatus } from '../validation/complaint';

export type Status = ReturnType<typeof complaintStatus.parse>;

const transitions: Record<Status, Status[]> = {
  draft: ['prepared', 'closed'],
  prepared: ['submitted', 'closed'],
  submitted: ['acknowledged', 'in_progress', 'rejected', 'closed'],
  acknowledged: ['in_progress', 'resolved', 'closed'],
  in_progress: ['resolved', 'reopened', 'closed'],
  resolved: ['reopened', 'closed'],
  reopened: ['in_progress', 'resolved', 'closed'],
  rejected: ['reopened', 'closed'],
  closed: ['reopened'],
};

export function canTransition(from: Status, to: Status): boolean {
  if (from === to) return true; // idempotent transition
  return transitions[from]?.includes(to) ?? false;
}

export function getValidTransitions(from: Status): Status[] {
  return transitions[from] || [];
}
