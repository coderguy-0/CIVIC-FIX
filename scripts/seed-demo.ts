/**
 * Idempotent CivicFix demo seeder.
 * Creates the four demo accounts (auth + profiles) when a service role key is present.
 * Safe to re-run. Does not inject demo data into ordinary accounts.
 */
import { DEMO_ACCOUNTS } from '../src/lib/demoAccounts';
import { createAdminClient } from '../lib/supabase/server';

async function seed() {
  const admin = createAdminClient();
  for (const account of DEMO_ACCOUNTS) {
    const { data: existing } = await admin.auth.admin.listUsers();
    const users: { id: string; email?: string | null }[] = existing?.users ?? [];
    const found = users.find((u) => u.email === account.email);
    let userId = found?.id;
    if (!userId) {
      const created = await admin.auth.admin.createUser({
        email: account.email,
        password: account.password,
        email_confirm: true,
        user_metadata: { full_name: account.profile.display_name, is_demo: true },
      });
      userId = created.data.user?.id;
    }
    if (!userId) continue;
    await admin.from('profiles').upsert({
      id: userId,
      display_name: account.profile.display_name,
      email: account.email,
      phone: account.profile.phone,
      city: account.profile.city,
      state: account.profile.state,
      role: account.profile.role,
    });
    if (account.profile.role === 'volunteer' && account.profile.volunteer_profile) {
      await admin.from('volunteer_profiles').upsert({
        user_id: userId,
        verification_status: 'verified',
        locality: account.profile.volunteer_profile.locality,
        organization: account.profile.volunteer_profile.organization,
        motivation: account.profile.volunteer_profile.motivation,
        availability: account.profile.volunteer_profile.availability,
        languages: account.profile.volunteer_profile.languages,
        interests: account.profile.volunteer_profile.interests,
      });
    }
    console.log(`Seeded ${account.email}`);
  }
}

seed().catch((err) => {
  console.error('Demo seed skipped or failed (expected without live Supabase):', err.message);
  process.exit(0);
});
