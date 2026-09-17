import { z } from 'zod';

export const createReminderSchema = z.object({
  remindAt: z.string().datetime(),

  message: z
    .string()
    .trim()
    .min(1, 'Message cannot be empty')
    .max(500, 'Message cannot exceed 500 characters'),
});

export const updateReminderSchema = z.object({
  completed: z.boolean(),
});

export type CreateReminderInput = z.infer<typeof createReminderSchema>;
export type UpdateReminderInput = z.infer<typeof updateReminderSchema>;
