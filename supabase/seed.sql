-- ==============================================================================
-- CivicFix Backend v1.0 - Seed Data
-- ==============================================================================

-- Create a mock test user in auth.users if not already exists (for local testing)
-- In production Supabase, users are created through Supabase Auth (Sign Up).

-- Sample Public Reports (Pre-moderated for Explore Map)
INSERT INTO public.public_reports (
  id,
  user_id,
  public_title,
  public_description,
  category,
  approximate_location,
  state_code,
  district,
  latitude,
  longitude,
  moderation_status,
  confirmations_count
) VALUES
(
  'e29d749a-7c98-4720-94d3-7d2d34a4cb01',
  '00000000-0000-0000-0000-000000000001',
  'Streetlights not functioning on Outer Ring Road Flyover',
  'Four consecutive sodium vapor lamps are completely dark between the entry ramp and junction, making evening vehicle merging hazardous.',
  'street_lighting',
  'Near Munirka Flyover Ramp, Outer Ring Road, New Delhi',
  'DL',
  'New Delhi',
  28.5562,
  77.1734,
  'approved',
  14
),
(
  'e29d749a-7c98-4720-94d3-7d2d34a4cb02',
  '00000000-0000-0000-0000-000000000001',
  'Deep roadway crater following recent monsoon showers',
  'Asphalt subsided creating a 1.5-foot trench right in the left bus lane. Two two-wheelers skidded this morning.',
  'roads',
  'Opposite 80 Feet Road Junction, Koramangala 4th Block, Bengaluru',
  'KA',
  'Bengaluru Urban',
  12.9352,
  77.6245,
  'approved',
  27
),
(
  'e29d749a-7c98-4720-94d3-7d2d34a4cb03',
  '00000000-0000-0000-0000-000000000001',
  'Uncollected municipal garbage bins overflowing on pedestrian path',
  'Secondary waste container has not been cleared for over 48 hours. Waste is spilling onto the school walking zone.',
  'sanitation',
  'Near Shivaji Park Post Office, Dadar West, Mumbai',
  'MH',
  'Mumbai',
  19.0269,
  72.8378,
  'approved',
  19
),
(
  'e29d749a-7c98-4720-94d3-7d2d34a4cb04',
  '00000000-0000-0000-0000-000000000001',
  'Drinking water pipeline leakage wasting potable water',
  'Clean underground feeder line burst with continuous water bubbling through the pavement into the storm drain.',
  'water',
  'Avenue 3, Banjara Hills Road No. 10, Hyderabad',
  'TS',
  'Hyderabad',
  17.4156,
  78.4350,
  'approved',
  8
),
(
  'e29d749a-7c98-4720-94d3-7d2d34a4cb05',
  '00000000-0000-0000-0000-000000000001',
  'Pending moderation: Low hanging transformer wires near market',
  'Secondary power cables sagging below 8 feet near fruit vendor stalls after the storm.',
  'electricity',
  'Sector 18 Market, Noida',
  'UP',
  'Gautam Buddha Nagar',
  28.5708,
  77.3271,
  'pending',
  0
)
ON CONFLICT (id) DO NOTHING;
