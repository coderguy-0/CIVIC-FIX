import { VolunteerTask } from '../types';

export const INITIAL_VOLUNTEER_TASKS: VolunteerTask[] = [
  {
    id: 'vt-1',
    complaint_id: 'cf-001',
    title: 'Verify Deep Potholes on 100 Feet Road',
    description: 'Check if barricades were installed by BBMP and take photos of current road condition near 12th Main junction.',
    category: 'roads',
    location: '100 Feet Rd, Indiranagar, Bengaluru',
    status: 'in_progress',
    assigned_to: 'vol-default',
    due_date: '2026-09-20T18:00:00.000Z',
    checklist: [
      { id: 'c1', label: 'Check physical location and GPS marker', completed: true },
      { id: 'c2', label: 'Verify depth and width of road crater', completed: true },
      { id: 'c3', label: 'Photograph current state with date timestamp', completed: false },
      { id: 'c4', label: 'Confirm if contractor asphalt work has commenced', completed: false },
      { id: 'c5', label: 'Record follow-up notes for ward engineer', completed: false }
    ],
    created_at: '2026-09-15T09:00:00.000Z'
  },
  {
    id: 'vt-2',
    complaint_id: 'cf-002',
    title: 'Inspect Low Water Pressure in 5th Block',
    description: 'Verify complaints from 14 residents regarding sewage smell in morning municipal supply pipeline.',
    category: 'water',
    location: '5th Block, Koramangala, Bengaluru',
    status: 'pending',
    assigned_to: 'vol-default',
    due_date: '2026-09-22T12:00:00.000Z',
    checklist: [
      { id: 'c1', label: 'Check location water meter valve', completed: false },
      { id: 'c2', label: 'Interview 2 affected neighbors on pressure drop', completed: false },
      { id: 'c3', label: 'Collect water clarity/odor sample photo', completed: false },
      { id: 'c4', label: 'Submit verification report to BWSSB assistant engineer', completed: false }
    ],
    created_at: '2026-09-14T11:30:00.000Z'
  },
  {
    id: 'vt-3',
    complaint_id: 'cf-003',
    title: 'Audit Dark Stretch & Non-Working Streetlights',
    description: 'Night inspection of 6 sodium-vapor lights reported dead near Metro pillar 180 to 195.',
    category: 'street_lighting',
    location: 'CMH Road, Indiranagar, Bengaluru',
    status: 'completed',
    assigned_to: 'vol-default',
    due_date: '2026-09-16T21:00:00.000Z',
    checklist: [
      { id: 'c1', label: 'Night time illumination inspection', completed: true },
      { id: 'c2', label: 'Identify exact pole asset numbers', completed: true },
      { id: 'c3', label: 'Record photo evidence in low light', completed: true },
      { id: 'c4', label: 'Escalate to BESCOM nodal officer', completed: true }
    ],
    created_at: '2026-09-12T14:20:00.000Z'
  },
  {
    id: 'vt-4',
    complaint_id: 'cf-004',
    title: 'Check Monsoon Overflow at Storm Drain Culvert',
    description: 'Evaluate plastic blockage at primary storm drain outlet before next rain forecast.',
    category: 'drainage',
    location: 'Ejipura Main Road, Bengaluru',
    status: 'pending',
    assigned_to: 'vol-default',
    due_date: '2026-09-24T17:00:00.000Z',
    checklist: [
      { id: 'c1', label: 'Survey silt accumulation height', completed: false },
      { id: 'c2', label: 'Take upstream and downstream photos', completed: false },
      { id: 'c3', label: 'Note risk to ground floor households', completed: false }
    ],
    created_at: '2026-09-16T08:15:00.000Z'
  }
];
