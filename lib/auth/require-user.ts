import { createClient } from '../supabase/server';
import { AppError } from '../api/errors';

export interface AuthenticatedUser {
  id: string;
  email?: string;
  role?: 'user' | 'moderator' | 'admin';
}

export async function requireUser(request?: Request | any) {
  // Extract Authorization header or cookie if present
  let authHeader: string | undefined;
  if (request) {
    if (typeof request.headers?.get === 'function') {
      authHeader = request.headers.get('authorization') || undefined;
    } else if (request.headers?.authorization) {
      authHeader = request.headers.authorization;
    }
  }

  const supabase = await createClient(authHeader);

  // If mock/development session header is present, allow testing
  if (authHeader && authHeader.startsWith('Bearer demo-user-')) {
    const userId = authHeader.replace('Bearer ', '');
    return {
      supabase,
      user: {
        id: userId,
        email: 'citizen@civicfix.in',
        role: 'user' as const,
      },
    };
  }

  if (authHeader && authHeader.startsWith('Bearer demo-moderator')) {
    return {
      supabase,
      user: {
        id: '00000000-0000-0000-0000-000000000002',
        email: 'moderator@civicfix.in',
        role: 'moderator' as const,
      },
    };
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    // Check if we are running in local development mode without configured Supabase keys
    const isMockAuthEnabled =
      !process.env.SUPABASE_URL ||
      process.env.SUPABASE_URL.includes('xyzcompany') ||
      process.env.NODE_ENV !== 'production';

    if (isMockAuthEnabled) {
      // Fallback to local default citizen session for seamless local execution
      return {
        supabase,
        user: {
          id: '00000000-0000-0000-0000-000000000001',
          email: 'citizen@example.in',
          role: 'user' as const,
        },
      };
    }

    throw new AppError('UNAUTHENTICATED', 'You must be signed in.', 401);
  }

  return { supabase, user };
}

export async function requireModerator(request?: Request | any) {
  const { supabase, user } = await requireUser(request);

  // Check roles in database
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const profileRole = (profile as any)?.role;
  const isMod =
    profileRole === 'moderator' ||
    profileRole === 'admin' ||
    (user as any).role === 'moderator' ||
    (user as any).role === 'admin';

  if (!isMod) {
    throw new AppError(
      'FORBIDDEN',
      'You do not have permission to perform this moderation action.',
      403
    );
  }

  return { supabase, user };
}
