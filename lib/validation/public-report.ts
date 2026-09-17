import { z } from 'zod';

export const createPublicReportSchema = z.object({
  complaintId: z.string().uuid('Invalid complaint ID'),

  publicTitle: z
    .string()
    .trim()
    .min(5, 'Title must be at least 5 characters')
    .max(160, 'Title must not exceed 160 characters'),

  publicDescription: z
    .string()
    .trim()
    .min(10, 'Public description must provide sufficient context')
    .max(2000, 'Description must not exceed 2000 characters'),

  approximateLocation: z
    .string()
    .trim()
    .min(3, 'Location description must be at least 3 characters')
    .max(200, 'Location must not exceed 200 characters'),
});

export const moderateReportSchema = z.object({
  action: z.enum(['approve', 'reject', 'hide', 'restore']),
  reason: z
    .string()
    .trim()
    .max(500)
    .optional(),
  concerns: z
    .array(z.string())
    .optional(),
});

export type CreatePublicReportInput = z.infer<typeof createPublicReportSchema>;
export type ModerateReportInput = z.infer<typeof moderateReportSchema>;
