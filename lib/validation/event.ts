import { z } from 'zod';
import { complaintStatus } from './complaint';

export const eventTypeEnum = z.enum([
  'status_changed',
  'follow_up',
  'authority_response',
  'evidence_added',
  'note_added',
  'reopened',
  'closed',
]);

export const createEventSchema = z.object({
  eventType: eventTypeEnum,

  note: z
    .string()
    .trim()
    .max(3000, 'Note must not exceed 3000 characters')
    .optional()
    .nullable(),

  newStatus: complaintStatus.optional().nullable(),

  sourceLabel: z
    .string()
    .trim()
    .max(100)
    .default('User reported')
    .optional(),

  occurredAt: z
    .string()
    .datetime()
    .optional(),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;
