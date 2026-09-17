import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

import { createComplaintSchema, updateComplaintSchema } from './lib/validation/complaint';
import { createEventSchema } from './lib/validation/event';
import { createReminderSchema, updateReminderSchema } from './lib/validation/reminder';
import { createPublicReportSchema, moderateReportSchema } from './lib/validation/public-report';
import { requireUser, requireModerator } from './lib/auth/require-user';
import { checkRateLimit } from './lib/security/rate-limit';
import { getComplaints, getComplaintWithDetails } from './lib/complaints/queries';
import { createComplaint, updateComplaint, addComplaintEvent } from './lib/complaints/mutations';
import { logModerationAction } from './lib/security/audit';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // ============================================================================
  // SYSTEM HEALTH
  // ============================================================================
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'civicfix-api',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    });
  });

  // ============================================================================
  // AUTHENTICATION & ROLE-BASED ACCESS CONTROL
  // ============================================================================
  app.post('/api/auth/login', async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({
          error: { code: 'VALIDATION_ERROR', message: 'Email and password are required.' },
        });
      }

      const { findDemoAccount } = await import('./src/lib/demoAccounts');
      const account = findDemoAccount(String(email), String(password));
      if (!account) {
        return res.status(401).json({
          error: { code: 'INVALID_CREDENTIALS', message: 'Incorrect email or password.' },
        });
      }

      // Role is always taken from stored profile, never from the request body.
      const role = account.profile.role;
      const redirectUrl =
        role === 'volunteer' ? '/app/volunteer' : role === 'admin' || role === 'moderator' ? '/app/admin' : '/app/user';

      res.json({
        data: {
          user: account.profile,
          token: `cf_token_${account.id}_${Date.now()}`,
          redirectUrl,
        },
      });
    } catch (err) {
      res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Authentication failed.' } });
    }
  });

  app.post('/api/auth/signup', async (req: Request, res: Response) => {
    try {
      const { fullName, email, password, role, locality, motivation } = req.body;

      if (!fullName || !email || !password) {
        return res.status(400).json({
          error: { code: 'VALIDATION_ERROR', message: 'Full name, email, and password are required.' },
        });
      }

      const serverEnforcedRole = role === 'volunteer' ? 'volunteer' : 'user';
      const redirectUrl = serverEnforcedRole === 'volunteer' ? '/app/volunteer' : '/app/user';
      const userId = `${serverEnforcedRole}_${Date.now()}`;

      res.status(201).json({
        data: {
          user: {
            id: userId,
            email: String(email).trim().toLowerCase(),
            display_name: String(fullName).trim(),
            role: serverEnforcedRole,
            city: req.body.city || 'Bengaluru',
            state: req.body.state || 'Karnataka',
            preferred_language: 'en',
            created_at: new Date().toISOString(),
            volunteer_profile:
              serverEnforcedRole === 'volunteer'
                ? {
                    user_id: userId,
                    verification_status: 'pending',
                    locality: locality || '',
                    motivation: motivation || '',
                    organization: req.body.organization || '',
                    availability: req.body.availability || 'Weekends & weekday evenings',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                  }
                : undefined,
          },
          token: `cf_token_${userId}_${Date.now()}`,
          redirectUrl,
        },
      });
    } catch (err) {
      res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Signup failed.' } });
    }
  });

  app.get('/api/auth/session', async (req: Request, res: Response) => {
    try {
      const { user } = await requireUser(req);
      const role = user.role || 'user';
      const redirectUrl = role === 'volunteer' ? '/app/volunteer' : '/app/user';

      res.json({
        data: {
          user: {
            id: user.id,
            email: user.email,
            display_name: role === 'volunteer' ? 'Priya Patel' : 'Aarav Sharma',
            role,
          },
          redirectUrl,
        },
      });
    } catch {
      res.status(401).json({ error: { code: 'UNAUTHENTICATED', message: 'No active session.' } });
    }
  });

  app.post('/api/auth/logout', (_req: Request, res: Response) => {
    res.json({ data: { message: 'Logged out successfully.' } });
  });

  app.post('/api/auth/forgot-password', (req: Request, res: Response) => {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Valid email required.' } });
    }
    res.json({ data: { message: `Password reset link dispatched to ${email}.` } });
  });

  app.post('/api/auth/reset-password', (req: Request, res: Response) => {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Password must be at least 6 characters.' } });
    }
    res.json({ data: { message: 'Password successfully updated.' } });
  });

  // ============================================================================
  // VOLUNTEER SPECIFIC API
  // ============================================================================
  app.get('/api/volunteer/dashboard-stats', async (_req: Request, res: Response) => {
    res.json({
      data: {
        assignedIssues: 8,
        openTasks: 3,
        pendingVerification: 2,
        followUps: 4,
        helpedResolve: 17,
      },
    });
  });

  // ============================================================================
  // COMPLAINTS API
  // ============================================================================
  app.get('/api/complaints', async (req: Request, res: Response) => {
    try {
      const { supabase, user } = await requireUser(req);
      const status = req.query.status as string | undefined;
      const category = req.query.category as string | undefined;
      const limit = Number(req.query.limit || 20);
      const offset = Number(req.query.offset || 0);

      const { data, error, count } = await getComplaints(supabase, {
        userId: user.id,
        status,
        category,
        limit,
        offset,
      });

      if (error) {
        return res.status(500).json({ error: { code: 'DATABASE_ERROR', message: 'Unable to load complaints.' } });
      }

      res.json({
        data: {
          items: data || [],
          pagination: { limit, offset, total: count ?? (data?.length || 0) },
        },
      });
    } catch (err: any) {
      if (err.code === 'UNAUTHENTICATED' || err.message === 'UNAUTHENTICATED') {
        return res.status(401).json({ error: { code: 'UNAUTHENTICATED', message: 'You must be signed in.' } });
      }
      res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Something went wrong.' } });
    }
  });

  app.post('/api/complaints', async (req: Request, res: Response) => {
    try {
      const { supabase, user } = await requireUser(req);

      const rateCheck = checkRateLimit(`complaint_${user.id}`, 10, 60);
      if (!rateCheck.allowed) {
        return res.status(429).json({
          error: {
            code: 'RATE_LIMITED',
            message: `Rate limit reached. Please wait ${rateCheck.resetInSeconds} seconds.`,
          },
        });
      }

      const parsed = createComplaintSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Please check the complaint details.',
            details: parsed.error.flatten().fieldErrors,
          },
        });
      }

      const newComplaint = await createComplaint(supabase, user.id, parsed.data);
      res.status(201).json({ data: newComplaint });
    } catch (err: any) {
      if (err.code === 'UNAUTHENTICATED' || err.message === 'UNAUTHENTICATED') {
        return res.status(401).json({ error: { code: 'UNAUTHENTICATED', message: 'You must be signed in.' } });
      }
      res.status(500).json({ error: { code: 'DATABASE_ERROR', message: 'Unable to save the complaint.' } });
    }
  });

  app.get('/api/complaints/:id', async (req: Request, res: Response) => {
    try {
      const { supabase, user } = await requireUser(req);
      const { data, error } = await getComplaintWithDetails(supabase, req.params.id, user.id);

      if (error || !data) {
        return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Complaint not found.' } });
      }

      res.json({ data });
    } catch (err: any) {
      if (err.code === 'UNAUTHENTICATED' || err.message === 'UNAUTHENTICATED') {
        return res.status(401).json({ error: { code: 'UNAUTHENTICATED', message: 'You must be signed in.' } });
      }
      res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Something went wrong.' } });
    }
  });

  app.patch('/api/complaints/:id', async (req: Request, res: Response) => {
    try {
      const { supabase, user } = await requireUser(req);
      const parsed = updateComplaintSchema.safeParse(req.body);

      if (!parsed.success) {
        return res.status(400).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid complaint information.',
            details: parsed.error.flatten().fieldErrors,
          },
        });
      }

      const updated = await updateComplaint(supabase, req.params.id, user.id, parsed.data);
      res.json({ data: updated });
    } catch (err: any) {
      if (err.code === 'UNAUTHENTICATED' || err.message === 'UNAUTHENTICATED') {
        return res.status(401).json({ error: { code: 'UNAUTHENTICATED', message: 'You must be signed in.' } });
      }
      res.status(500).json({ error: { code: 'DATABASE_ERROR', message: 'Unable to update complaint.' } });
    }
  });

  app.delete('/api/complaints/:id', async (req: Request, res: Response) => {
    try {
      const { supabase, user } = await requireUser(req);
      const { error } = await supabase
        .from('complaints')
        .delete()
        .eq('id', req.params.id)
        .eq('user_id', user.id);

      if (error) {
        return res.status(500).json({ error: { code: 'DATABASE_ERROR', message: 'Unable to delete complaint.' } });
      }

      res.json({ data: { deleted: true, id: req.params.id } });
    } catch (err: any) {
      if (err.code === 'UNAUTHENTICATED' || err.message === 'UNAUTHENTICATED') {
        return res.status(401).json({ error: { code: 'UNAUTHENTICATED', message: 'You must be signed in.' } });
      }
      res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Something went wrong.' } });
    }
  });

  // ============================================================================
  // COMPLAINT TIMELINE & EVENTS API
  // ============================================================================
  app.get('/api/complaints/:id/events', async (req: Request, res: Response) => {
    try {
      const { supabase, user } = await requireUser(req);
      const { data: complaint, error: compError } = await supabase
        .from('complaints')
        .select('id')
        .eq('id', req.params.id)
        .eq('user_id', user.id)
        .single();

      if (compError || !complaint) {
        return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Complaint not found.' } });
      }

      const { data: events, error } = await supabase
        .from('complaint_events')
        .select('*')
        .eq('complaint_id', req.params.id)
        .order('occurred_at', { ascending: false });

      if (error) {
        return res.status(500).json({ error: { code: 'DATABASE_ERROR', message: 'Unable to load events.' } });
      }

      res.json({ data: events || [] });
    } catch (err: any) {
      if (err.code === 'UNAUTHENTICATED' || err.message === 'UNAUTHENTICATED') {
        return res.status(401).json({ error: { code: 'UNAUTHENTICATED', message: 'You must be signed in.' } });
      }
      res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Something went wrong.' } });
    }
  });

  app.post('/api/complaints/:id/events', async (req: Request, res: Response) => {
    try {
      const { supabase, user } = await requireUser(req);
      const parsed = createEventSchema.safeParse(req.body);

      if (!parsed.success) {
        return res.status(400).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid event details.',
            details: parsed.error.flatten().fieldErrors,
          },
        });
      }

      const event = await addComplaintEvent(supabase, req.params.id, user.id, parsed.data);
      res.status(201).json({ data: event });
    } catch (err: any) {
      if (err.code === 'UNAUTHENTICATED' || err.message === 'UNAUTHENTICATED') {
        return res.status(401).json({ error: { code: 'UNAUTHENTICATED', message: 'You must be signed in.' } });
      }
      if (err.code === 'NOT_FOUND') {
        return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Complaint not found.' } });
      }
      if (err.code === 'INVALID_TRANSITION') {
        return res.status(400).json({ error: { code: 'INVALID_TRANSITION', message: err.message } });
      }
      res.status(500).json({ error: { code: 'DATABASE_ERROR', message: 'Unable to add timeline event.' } });
    }
  });

  // ============================================================================
  // REMINDERS API
  // ============================================================================
  app.post('/api/complaints/:id/reminders', async (req: Request, res: Response) => {
    try {
      const { supabase, user } = await requireUser(req);
      const parsed = createReminderSchema.safeParse(req.body);

      if (!parsed.success) {
        return res.status(400).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid reminder parameters.',
            details: parsed.error.flatten().fieldErrors,
          },
        });
      }

      const remindAtDate = new Date(parsed.data.remindAt);
      if (remindAtDate.getTime() <= Date.now()) {
        return res.status(400).json({
          error: { code: 'INVALID_DATE', message: 'Reminder must be scheduled for a future time.' },
        });
      }

      const { data: reminder, error } = await supabase
        .from('reminders')
        .insert({
          complaint_id: req.params.id,
          user_id: user.id,
          remind_at: remindAtDate.toISOString(),
          message: parsed.data.message,
        })
        .select()
        .single();

      if (error) {
        return res.status(500).json({ error: { code: 'DATABASE_ERROR', message: 'Unable to create reminder.' } });
      }

      res.status(201).json({ data: reminder });
    } catch (err: any) {
      if (err.code === 'UNAUTHENTICATED' || err.message === 'UNAUTHENTICATED') {
        return res.status(401).json({ error: { code: 'UNAUTHENTICATED', message: 'You must be signed in.' } });
      }
      res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Something went wrong.' } });
    }
  });

  app.patch('/api/reminders/:id', async (req: Request, res: Response) => {
    try {
      const { supabase, user } = await requireUser(req);
      const parsed = updateReminderSchema.safeParse(req.body);

      if (!parsed.success) {
        return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Invalid payload.' } });
      }

      const completedAt = parsed.data.completed ? new Date().toISOString() : null;
      const { data: reminder, error } = await supabase
        .from('reminders')
        .update({ completed_at: completedAt })
        .eq('id', req.params.id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error || !reminder) {
        return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Reminder not found.' } });
      }

      res.json({ data: reminder });
    } catch (err: any) {
      if (err.code === 'UNAUTHENTICATED' || err.message === 'UNAUTHENTICATED') {
        return res.status(401).json({ error: { code: 'UNAUTHENTICATED', message: 'You must be signed in.' } });
      }
      res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Something went wrong.' } });
    }
  });

  // ============================================================================
  // PUBLIC REPORTS & COMMUNITY API
  // ============================================================================
  app.get('/api/public-reports', async (req: Request, res: Response) => {
    try {
      const { supabase } = await requireUser(req);
      const category = req.query.category as string | undefined;
      const stateCode = req.query.stateCode as string | undefined;
      const search = req.query.q as string | undefined;
      const limit = Math.min(Number(req.query.limit || 20), 50);
      const offset = Math.max(Number(req.query.offset || 0), 0);

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
        return res.status(500).json({ error: { code: 'DATABASE_ERROR', message: 'Unable to load public reports.' } });
      }

      res.json({
        data: {
          items: data || [],
          pagination: { limit, offset, total: count ?? (data?.length || 0) },
        },
      });
    } catch (err: any) {
      res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Something went wrong.' } });
    }
  });

  app.post('/api/public-reports', async (req: Request, res: Response) => {
    try {
      const { supabase, user } = await requireUser(req);
      const parsed = createPublicReportSchema.safeParse(req.body);

      if (!parsed.success) {
        return res.status(400).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid public report details.',
            details: parsed.error.flatten().fieldErrors,
          },
        });
      }

      const { complaintId, publicTitle, publicDescription, approximateLocation } = parsed.data;

      const { data: complaint, error: compError } = await supabase
        .from('complaints')
        .select('id, category, state_code, district, latitude, longitude')
        .eq('id', complaintId)
        .eq('user_id', user.id)
        .single();

      if (compError || !complaint) {
        return res.status(404).json({
          error: { code: 'NOT_FOUND', message: 'Private complaint not found or access denied.' },
        });
      }

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
        return res.status(500).json({ error: { code: 'DATABASE_ERROR', message: 'Unable to create public summary.' } });
      }

      await supabase
        .from('complaints')
        .update({ is_public_summary_shared: true })
        .eq('id', complaintId);

      res.status(201).json({
        data: {
          ...newReport,
          message: 'Summary submitted for moderation. It will appear on Explore once approved.',
        },
      });
    } catch (err: any) {
      if (err.code === 'UNAUTHENTICATED' || err.message === 'UNAUTHENTICATED') {
        return res.status(401).json({ error: { code: 'UNAUTHENTICATED', message: 'You must be signed in.' } });
      }
      res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Something went wrong.' } });
    }
  });

  // ============================================================================
  // ADMIN MODERATION API
  // ============================================================================
  app.get('/api/admin/public-reports', async (req: Request, res: Response) => {
    try {
      const { supabase } = await requireModerator(req);
      const status = (req.query.status as string) || 'pending';

      let query = supabase.from('public_reports').select('*').order('created_at', { ascending: false });
      if (status !== 'all') {
        query = query.eq('moderation_status', status as any);
      }

      const { data, error } = await query;
      if (error) {
        return res.status(500).json({ error: { code: 'DATABASE_ERROR', message: 'Unable to load moderation queue.' } });
      }

      res.json({ data: data || [] });
    } catch (err: any) {
      if (err.code === 'FORBIDDEN') {
        return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Moderator access required.' } });
      }
      res.status(401).json({ error: { code: 'UNAUTHENTICATED', message: 'You must be signed in.' } });
    }
  });

  app.patch('/api/admin/public-reports/:id', async (req: Request, res: Response) => {
    try {
      const { supabase, user } = await requireModerator(req);
      const parsed = moderateReportSchema.safeParse(req.body);

      if (!parsed.success) {
        return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Invalid payload.' } });
      }

      const { action, reason } = parsed.data;
      const newStatus =
        action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : action === 'hide' ? 'hidden' : 'approved';

      const { data: updated, error } = await supabase
        .from('public_reports')
        .update({ moderation_status: newStatus, moderation_notes: reason || null })
        .eq('id', req.params.id)
        .select()
        .single();

      if (error || !updated) {
        return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Report not found.' } });
      }

      await logModerationAction(supabase, {
        moderatorId: user.id,
        publicReportId: req.params.id,
        action,
        reason,
      });

      res.json({ data: { report: updated, action, moderatedBy: user.id } });
    } catch (err: any) {
      if (err.code === 'FORBIDDEN') {
        return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Moderator access required.' } });
      }
      res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Unable to moderate report.' } });
    }
  });

  // ============================================================================
  // VITE MIDDLEWARE (SPA & ASSET SERVING)
  // ============================================================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CivicFix Backend & Frontend running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
