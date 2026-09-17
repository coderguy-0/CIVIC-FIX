import { Complaint, PublicReport } from '../types';

export const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 'cf-comp-001',
    user_id: 'user-default',
    title: 'Hazardous deep pothole on Ring Road near Lajpat Nagar Flyover',
    description: 'Deep road depression and broken tarmac creating a severe hazard for two-wheelers and night traffic. Pothole is approximately 2.5 feet wide and 6 inches deep on the middle lane.',
    category: 'roads',
    status: 'in_progress',
    authority_name: 'Municipal Corporation of Delhi (MCD 311 / PWD)',
    official_reference: 'MCD/2026/SZ/84920',
    official_portal_url: 'https://mcdonline.nic.in',
    state_code: 'DL',
    state_name: 'Delhi',
    district: 'South Delhi',
    locality: 'Lajpat Nagar Ring Road, near Pillar 32',
    latitude: 28.5700,
    longitude: 77.2400,
    next_follow_up_at: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    submitted_at: '2026-09-10T10:30:00Z',
    created_at: '2026-09-10T09:15:00Z',
    updated_at: '2026-09-14T14:20:00Z',
    is_public_summary_shared: true,
    public_report_id: 'pub-rep-001',
    attachments: [
      {
        id: 'att-01',
        storage_path: 'mock/pothole_lajpat.jpg',
        original_name: 'pothole_evidence_day1.jpg',
        mime_type: 'image/jpeg',
        file_size_bytes: 384000,
        data_url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
        created_at: '2026-09-10T09:15:00Z'
      }
    ],
    events: [
      {
        id: 'ev-001',
        complaint_id: 'cf-comp-001',
        event_type: 'created',
        note: 'Issue documented and recorded in CivicFix tracker.',
        source_label: 'User reported',
        occurred_at: '2026-09-10T09:15:00Z',
        created_at: '2026-09-10T09:15:00Z'
      },
      {
        id: 'ev-002',
        complaint_id: 'cf-comp-001',
        event_type: 'status_changed',
        old_status: 'draft',
        new_status: 'submitted',
        note: 'Submitted on MCD 311 portal. Reference ticket MCD/2026/SZ/84920 received via SMS.',
        source_label: 'Document attached',
        occurred_at: '2026-09-10T10:30:00Z',
        created_at: '2026-09-10T10:30:00Z'
      },
      {
        id: 'ev-003',
        complaint_id: 'cf-comp-001',
        event_type: 'authority_response',
        old_status: 'submitted',
        new_status: 'acknowledged',
        note: 'MCD South Zone Junior Engineer (Roads) assigned for site inspection.',
        source_label: 'Official source linked',
        occurred_at: '2026-09-12T11:45:00Z',
        created_at: '2026-09-12T11:45:00Z'
      },
      {
        id: 'ev-004',
        complaint_id: 'cf-comp-001',
        event_type: 'status_changed',
        old_status: 'acknowledged',
        new_status: 'in_progress',
        note: 'Inspection completed; gravel cold-mix patch crew scheduled for night operation.',
        source_label: 'User reported',
        occurred_at: '2026-09-14T14:20:00Z',
        created_at: '2026-09-14T14:20:00Z'
      }
    ],
    reminders: [
      {
        id: 'rem-001',
        complaint_id: 'cf-comp-001',
        remind_at: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        message: 'Check MCD portal if night repair patch was completed and verify road surface.',
        completed_at: null,
        created_at: '2026-09-14T14:20:00Z'
      }
    ]
  },
  {
    id: 'cf-comp-002',
    user_id: 'user-default',
    title: 'Overflowing community garbage container on 100ft Road, Indiranagar',
    description: 'Solid waste container overflowing onto the pedestrian footpath for 3 consecutive days. Rotten food waste attracting stray animals and blocking walkers.',
    category: 'sanitation',
    status: 'acknowledged',
    authority_name: 'Bruhat Bengaluru Mahanagara Palike (BBMP Sahaaya 2.0)',
    official_reference: 'BBMP-2026-SWA-11094',
    official_portal_url: 'https://bbmp.gov.in',
    state_code: 'KA',
    state_name: 'Karnataka',
    district: 'Bengaluru Urban',
    locality: '100 Feet Road, HAL 2nd Stage, Indiranagar',
    latitude: 12.9780,
    longitude: 77.6400,
    next_follow_up_at: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    submitted_at: '2026-09-13T08:00:00Z',
    created_at: '2026-09-13T07:45:00Z',
    updated_at: '2026-09-15T09:10:00Z',
    is_public_summary_shared: true,
    public_report_id: 'pub-rep-002',
    attachments: [
      {
        id: 'att-02',
        storage_path: 'mock/garbage_bin.jpg',
        original_name: 'bin_overflow.jpg',
        mime_type: 'image/jpeg',
        file_size_bytes: 412000,
        data_url: 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=600&q=80',
        created_at: '2026-09-13T07:45:00Z'
      }
    ],
    events: [
      {
        id: 'ev-010',
        complaint_id: 'cf-comp-002',
        event_type: 'created',
        note: 'Record created with photo evidence.',
        source_label: 'User reported',
        occurred_at: '2026-09-13T07:45:00Z',
        created_at: '2026-09-13T07:45:00Z'
      },
      {
        id: 'ev-011',
        complaint_id: 'cf-comp-002',
        event_type: 'status_changed',
        old_status: 'draft',
        new_status: 'submitted',
        note: 'Logged on BBMP Sahaaya 2.0 and Swachhata app. Ref: BBMP-2026-SWA-11094.',
        source_label: 'Document attached',
        occurred_at: '2026-09-13T08:00:00Z',
        created_at: '2026-09-13T08:00:00Z'
      },
      {
        id: 'ev-012',
        complaint_id: 'cf-comp-002',
        event_type: 'authority_response',
        old_status: 'submitted',
        new_status: 'acknowledged',
        note: 'Sanitary Inspector of Ward 82 acknowledged complaint via SMS.',
        source_label: 'Official source linked',
        occurred_at: '2026-09-15T09:10:00Z',
        created_at: '2026-09-15T09:10:00Z'
      }
    ],
    reminders: [
      {
        id: 'rem-002',
        complaint_id: 'cf-comp-002',
        remind_at: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
        message: 'Follow up with BBMP Ward 82 sanitary team if compacting truck does not arrive.',
        completed_at: null,
        created_at: '2026-09-15T09:10:00Z'
      }
    ]
  },
  {
    id: 'cf-comp-003',
    user_id: 'user-default',
    title: 'Dark pedestrian stretch: 4 consecutive streetlights non-functional on Link Road',
    description: 'Four sodium vapor / LED streetlights are blacked out on the colony exit stretch. Very dark and unsafe for women and evening commuters walking back from metro station.',
    category: 'street_lighting',
    status: 'resolved',
    authority_name: 'Brihanmumbai Municipal Corporation (BMC / Adani Electricity)',
    official_reference: 'BMC-LT-2026-44102',
    official_portal_url: 'https://portal.mcgm.gov.in',
    state_code: 'MH',
    state_name: 'Maharashtra',
    district: 'Mumbai Suburban',
    locality: 'New Link Road, Andheri West',
    latitude: 19.1360,
    longitude: 72.8290,
    next_follow_up_at: null,
    submitted_at: '2026-09-02T18:30:00Z',
    resolved_at: '2026-09-06T20:00:00Z',
    created_at: '2026-09-02T18:00:00Z',
    updated_at: '2026-09-06T20:15:00Z',
    is_public_summary_shared: true,
    public_report_id: 'pub-rep-003',
    attachments: [
      {
        id: 'att-03',
        storage_path: 'mock/lights_fixed.jpg',
        original_name: 'repaired_lighting_evidence.jpg',
        mime_type: 'image/jpeg',
        file_size_bytes: 298000,
        data_url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
        created_at: '2026-09-06T20:15:00Z'
      }
    ],
    events: [
      {
        id: 'ev-020',
        complaint_id: 'cf-comp-003',
        event_type: 'created',
        note: 'Issue documented.',
        source_label: 'User reported',
        occurred_at: '2026-09-02T18:00:00Z',
        created_at: '2026-09-02T18:00:00Z'
      },
      {
        id: 'ev-021',
        complaint_id: 'cf-comp-003',
        event_type: 'status_changed',
        old_status: 'draft',
        new_status: 'submitted',
        note: 'Submitted via BMC WhatsApp helpline (+91-8999228999). Ref: BMC-LT-2026-44102.',
        source_label: 'User reported',
        occurred_at: '2026-09-02T18:30:00Z',
        created_at: '2026-09-02T18:30:00Z'
      },
      {
        id: 'ev-022',
        complaint_id: 'cf-comp-003',
        event_type: 'follow_up',
        note: 'Called BMC Ward K-West electrical line technician to confirm feeder box issue.',
        source_label: 'User reported',
        occurred_at: '2026-09-04T12:00:00Z',
        created_at: '2026-09-04T12:00:00Z'
      },
      {
        id: 'ev-023',
        complaint_id: 'cf-comp-003',
        event_type: 'status_changed',
        old_status: 'in_progress',
        new_status: 'resolved',
        note: 'Technician repaired underground cable fault and replaced 2 blown chokes. All 4 lights now glowing.',
        source_label: 'Community confirmed',
        occurred_at: '2026-09-06T20:00:00Z',
        created_at: '2026-09-06T20:15:00Z'
      }
    ],
    reminders: [
      {
        id: 'rem-003',
        complaint_id: 'cf-comp-003',
        remind_at: '2026-09-06T18:00:00Z',
        message: 'Verify streetlights at 8 PM after technician visit.',
        completed_at: '2026-09-06T20:15:00Z',
        created_at: '2026-09-04T12:00:00Z'
      }
    ]
  }
];

export const INITIAL_PUBLIC_REPORTS: PublicReport[] = [
  {
    id: 'pub-rep-001',
    complaint_id: 'cf-comp-001',
    user_id: 'user-default',
    public_title: 'Dangerous road pothole near Lajpat Nagar Flyover',
    public_description: 'Approx. 2.5 ft wide pothole on middle lane causing near-accidents for two-wheelers. Officially reported to MCD (In Progress).',
    category: 'roads',
    approximate_location: 'Lajpat Nagar / Ring Road area, South Delhi',
    state_code: 'DL',
    district: 'South Delhi',
    latitude: 28.5700,
    longitude: 77.2400,
    moderation_status: 'approved',
    confirmations_count: 14,
    user_confirmed: false,
    created_at: '2026-09-10T10:35:00Z',
    updated_at: '2026-09-14T14:20:00Z',
    photo_url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'pub-rep-002',
    complaint_id: 'cf-comp-002',
    user_id: 'user-default',
    public_title: 'Overflowing public waste bin blocking walkway on 100ft Road',
    public_description: 'Dumpster uncleared for several days, spilling onto footpath. Officially acknowledged by BBMP Ward 82 sanitation.',
    category: 'sanitation',
    approximate_location: '100ft Road, Indiranagar, Bengaluru',
    state_code: 'KA',
    district: 'Bengaluru Urban',
    latitude: 12.9780,
    longitude: 77.6400,
    moderation_status: 'approved',
    confirmations_count: 8,
    user_confirmed: false,
    created_at: '2026-09-13T08:15:00Z',
    updated_at: '2026-09-15T09:10:00Z',
    photo_url: 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'pub-rep-003',
    complaint_id: 'cf-comp-003',
    user_id: 'user-default',
    public_title: 'Dark pedestrian corridor - 4 streetlights restored',
    public_description: 'Cable fault reported and repaired by municipal electricity wing. Road is now properly illuminated at night.',
    category: 'street_lighting',
    approximate_location: 'New Link Road, Andheri West, Mumbai',
    state_code: 'MH',
    district: 'Mumbai Suburban',
    latitude: 19.1360,
    longitude: 72.8290,
    moderation_status: 'approved',
    confirmations_count: 19,
    user_confirmed: true,
    created_at: '2026-09-02T18:40:00Z',
    updated_at: '2026-09-06T20:15:00Z',
    photo_url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'pub-rep-004',
    complaint_id: 'cf-comp-004',
    user_id: 'user-another',
    public_title: 'Water main leakage wasting thousands of litres daily',
    public_description: 'Underground potable pipe rupture near residential complex entrance creating drinking water wastage and road waterlogging.',
    category: 'water',
    approximate_location: 'Banjara Hills Road No. 12, Hyderabad',
    state_code: 'TS',
    district: 'Hyderabad',
    latitude: 17.4150,
    longitude: 78.4350,
    moderation_status: 'approved',
    confirmations_count: 11,
    user_confirmed: false,
    created_at: '2026-09-14T06:20:00Z',
    updated_at: '2026-09-14T06:20:00Z',
    photo_url: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'pub-rep-005',
    complaint_id: 'cf-comp-005',
    user_id: 'user-moderated',
    public_title: 'Stormwater drain covered in construction debris',
    public_description: 'Pre-monsoon blockage in the primary ward channel. Water backing up during rainfall.',
    category: 'drainage',
    approximate_location: 'Anna Nagar West Extension, Chennai',
    state_code: 'TN',
    district: 'Chennai',
    latitude: 13.0850,
    longitude: 80.2100,
    moderation_status: 'pending',
    confirmations_count: 2,
    user_confirmed: false,
    created_at: '2026-09-16T04:10:00Z',
    updated_at: '2026-09-16T04:10:00Z'
  },
  {
    id: 'pub-rep-006',
    complaint_id: 'cf-comp-006',
    user_id: 'user-spam-check',
    public_title: 'Suspicious commercial billboard with dangling metal rod',
    public_description: 'Heavy metal armature swaying in strong wind above the public bus stand. Poses serious threat to waiting commuters.',
    category: 'public_safety',
    approximate_location: 'Sector 18 Market, Noida',
    state_code: 'UP',
    district: 'Gautam Buddha Nagar',
    latitude: 28.5700,
    longitude: 77.3200,
    moderation_status: 'pending',
    confirmations_count: 5,
    user_confirmed: false,
    created_at: '2026-09-16T08:30:00Z',
    updated_at: '2026-09-16T08:30:00Z'
  }
];
