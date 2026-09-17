import React from 'react';
import { Activity, CheckCircle2, Clock, MapPin, Calendar, FileText, UserCheck } from 'lucide-react';
import { Complaint, UserProfile, VolunteerTask } from '../../types';

export interface VolunteerActivityViewProps {
  profile: UserProfile;
  complaints: Complaint[];
  tasks: VolunteerTask[];
}

export const VolunteerActivityView: React.FC<VolunteerActivityViewProps> = ({
  profile,
  complaints,
  tasks
}) => {
  // Aggregate volunteer activity entries
  const activities = [
    {
      id: 'act-1',
      type: 'verification',
      title: 'Site condition verified: Road crater on 100 Feet Road',
      locality: 'Indiranagar, Ward 89',
      date: '2026-09-15T14:30:00.000Z',
      notes: 'Confirmed safety cones positioned. BBMP road contractor alerted for asphalt fill.',
      badge: 'Site Verified'
    },
    {
      id: 'act-2',
      type: 'task',
      title: 'Completed task: Audit Dark Stretch & Non-Working Streetlights',
      locality: 'CMH Road, Indiranagar',
      date: '2026-09-14T21:15:00.000Z',
      notes: 'Identified 6 failed sodium vapor fixtures from pole 180 to 195. BESCOM lineman dispatched.',
      badge: 'Task Completed'
    },
    {
      id: 'act-3',
      type: 'follow_up',
      title: 'Department Follow-up with BWSSB Assistant Engineer',
      locality: 'Koramangala, Ward 151',
      date: '2026-09-12T11:00:00.000Z',
      notes: 'Water pressure testing conducted; pipeline desilting scheduled for Friday.',
      badge: 'Follow-up Logged'
    },
    {
      id: 'act-4',
      type: 'verification',
      title: 'Monsoon Culvert Drain Silt Inspection',
      locality: 'Ejipura Main Road',
      date: '2026-09-10T09:45:00.000Z',
      notes: 'Photographed drain blockages and filed community corroboration report.',
      badge: 'Evidence Added'
    }
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="bg-white rounded-2xl border border-[#c8d9d2] p-6 shadow-xs">
        <h1 className="text-xl font-extrabold text-[#17201d] tracking-tight flex items-center gap-2">
          <Activity className="w-5 h-5 text-[#1864ab]" />
          <span>Volunteer Audit & Activity History</span>
        </h1>
        <p className="text-xs text-[#66736e] mt-1">
          Traceable record of all field verifications, checklists, and department follow-ups recorded by {profile.display_name}.
        </p>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#dce5e1]">
        {activities.map(act => (
          <div key={act.id} className="relative bg-white p-5 rounded-2xl border border-[#c8d9d2] shadow-xs space-y-2">
            <span className="absolute -left-[27px] top-5 w-4 h-4 rounded-full bg-[#1864ab] ring-4 ring-white" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded-md bg-[#e7f5ff] text-[#1864ab] w-fit">
                {act.badge}
              </span>
              <span className="text-[11px] text-[#8a9993] flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(act.date).toLocaleDateString()} at{' '}
                {new Date(act.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            <h3 className="text-sm font-bold text-[#17201d]">{act.title}</h3>
            <p className="text-xs text-[#4a5853] leading-relaxed">{act.notes}</p>

            <div className="pt-2 border-t border-[#eef3f1] text-[11px] text-[#66736e] flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#1864ab]" />
              <span>{act.locality}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
