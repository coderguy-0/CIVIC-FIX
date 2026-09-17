import { AppError } from '../api/errors';
import { getCurrentProfile } from './get-current-profile';

export async function requireRole(
  roles: string | string[],
  request?: Request | any
) {
  const profile = await getCurrentProfile(request);
  const allowed = Array.isArray(roles) ? roles : [roles];
  if (!allowed.includes(profile.role)) {
    throw new AppError('FORBIDDEN', "You don't have permission to access this page.", 403);
  }
  return profile;
}
