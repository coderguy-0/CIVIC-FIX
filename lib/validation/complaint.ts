import { z } from 'zod';

export const complaintCategory = z.enum([
  'roads',
  'water',
  'sanitation',
  'street_lighting',
  'drainage',
  'electricity',
  'public_safety',
  'other',
]);

export const complaintStatus = z.enum([
  'draft',
  'prepared',
  'submitted',
  'acknowledged',
  'in_progress',
  'resolved',
  'reopened',
  'closed',
  'rejected',
]);

export const createComplaintSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, 'Title must be at least 3 characters')
    .max(160, 'Title must not exceed 160 characters'),

  description: z
    .string()
    .trim()
    .max(5000, 'Description must not exceed 5000 characters')
    .optional()
    .nullable(),

  category: complaintCategory,

  authorityName: z
    .string()
    .trim()
    .max(200)
    .optional()
    .nullable(),

  officialReference: z
    .string()
    .trim()
    .max(200)
    .optional()
    .nullable(),

  officialPortalUrl: z
    .string()
    .url('Invalid official portal URL')
    .max(500)
    .optional()
    .nullable()
    .or(z.literal('')),

  stateCode: z
    .string()
    .trim()
    .max(10)
    .optional()
    .nullable(),

  stateName: z
    .string()
    .trim()
    .max(100)
    .optional()
    .nullable(),

  district: z
    .string()
    .trim()
    .max(120)
    .optional()
    .nullable(),

  locality: z
    .string()
    .trim()
    .max(200)
    .optional()
    .nullable(),

  latitude: z
    .number()
    .min(-90)
    .max(90)
    .nullable()
    .optional(),

  longitude: z
    .number()
    .min(-180)
    .max(180)
    .nullable()
    .optional(),

  status: complaintStatus.default('draft'),

  submittedAt: z
    .string()
    .datetime()
    .nullable()
    .optional(),

  nextFollowUpAt: z
    .string()
    .datetime()
    .nullable()
    .optional(),
});

// Update schema permits only mutable fields and omits immutable fields
export const updateComplaintSchema = createComplaintSchema
  .partial()
  .omit({
    status: true,
  });

export type CreateComplaintInput = z.infer<typeof createComplaintSchema>;
export type UpdateComplaintInput = z.infer<typeof updateComplaintSchema>;
