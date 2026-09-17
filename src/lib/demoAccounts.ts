import { UserProfile } from '../types';

export const IS_DEV_DEMO_HELPER = typeof process === 'undefined' || process.env.NODE_ENV !== 'production';

export const DEMO_ACCOUNTS = [
  {
    id: 'demo-user-1',
    email: 'demo.user1@civicfix.demo',
    password: 'CivicFix@Demo2026User1',
    profile: {
      id: 'demo-user-1',
      display_name: 'Aarav Sharma',
      email: 'demo.user1@civicfix.demo',
      phone: '+91 98100 11111',
      city: 'New Delhi',
      state: 'Delhi',
      role: 'user' as const,
      preferred_language: 'en' as const,
      created_at: '2026-08-01T10:00:00.000Z',
    } satisfies UserProfile,
  },
  {
    id: 'demo-user-2',
    email: 'demo.user2@civicfix.demo',
    password: 'CivicFix@Demo2026User2',
    profile: {
      id: 'demo-user-2',
      display_name: 'Priya Verma',
      email: 'demo.user2@civicfix.demo',
      phone: '+91 98100 22222',
      city: 'New Delhi',
      state: 'Delhi',
      role: 'user' as const,
      preferred_language: 'en' as const,
      created_at: '2026-08-05T10:00:00.000Z',
    } satisfies UserProfile,
  },
  {
    id: 'demo-volunteer-1',
    email: 'demo.volunteer1@civicfix.demo',
    password: 'CivicFix@Demo2026Vol1',
    profile: {
      id: 'demo-volunteer-1',
      display_name: 'Arjun Mehta',
      email: 'demo.volunteer1@civicfix.demo',
      phone: '+91 98100 33333',
      city: 'New Delhi',
      state: 'Delhi',
      role: 'volunteer' as const,
      preferred_language: 'en' as const,
      created_at: '2026-07-20T10:00:00.000Z',
      volunteer_profile: {
        user_id: 'demo-volunteer-1',
        verification_status: 'verified',
        locality: 'Sector 22',
        organization: 'Civic Action Collective',
        motivation: 'Help verify and follow up on civic issues in my locality.',
        availability: 'Weekends and weekday evenings',
        languages: ['English', 'Hindi'],
        interests: ['Street Lighting', 'Drainage', 'Sanitation'],
        created_at: '2026-07-20T10:00:00.000Z',
        updated_at: '2026-09-01T10:00:00.000Z',
      },
    } satisfies UserProfile,
  },
  {
    id: 'demo-volunteer-2',
    email: 'demo.volunteer2@civicfix.demo',
    password: 'CivicFix@Demo2026Vol2',
    profile: {
      id: 'demo-volunteer-2',
      display_name: 'Sara Khan',
      email: 'demo.volunteer2@civicfix.demo',
      phone: '+91 98100 44444',
      city: 'New Delhi',
      state: 'Delhi',
      role: 'volunteer' as const,
      preferred_language: 'en' as const,
      created_at: '2026-07-22T10:00:00.000Z',
      volunteer_profile: {
        user_id: 'demo-volunteer-2',
        verification_status: 'verified',
        locality: 'Dwarka',
        organization: 'Neighbourhood Watch',
        motivation: 'Document public civic issues and support community follow-up.',
        availability: 'Weekends',
        languages: ['English', 'Hindi', 'Urdu'],
        interests: ['Roads', 'Street Lighting', 'Public Safety'],
        created_at: '2026-07-22T10:00:00.000Z',
        updated_at: '2026-09-01T10:00:00.000Z',
      },
    } satisfies UserProfile,
  },
];

export function findDemoAccount(email: string, password?: string) {
  const normalized = email.trim().toLowerCase();
  const account = DEMO_ACCOUNTS.find((a) => a.email === normalized);
  if (!account) return null;
  if (password !== undefined && account.password !== password) return null;
  return account;
}
