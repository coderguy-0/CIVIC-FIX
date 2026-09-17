import React, { useState } from 'react';
import {
  ShieldAlert,
  Clock,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Calendar,
  CheckSquare,
  Sparkles,
  Search,
  Filter,
  ArrowUpRight,
  UserCheck,
  Building,
  HelpCircle,
  FileCheck2,
  Users
} from 'lucide-react';
import { Complaint, ComplaintStatus, UserProfile, VolunteerTask } from '../../types';
import { VolunteerIssueDetailModal } from './VolunteerIssueDetailModal';

export interface VolunteerDashboardViewProps {
  profile: UserProfile;
  complaints: Complaint[];
  tasks: VolunteerTask[];
  onToggleVerificationStatus: () => void;
  onAddVerificationEvent: (complaintId: string, notes: string, status?: ComplaintStatus) => void;
  onToggleChecklist: (taskId: string, checklistId: string) => void;
  onNavigate: (view: string) => void;
}

export const VolunteerDashboardView: React.FC<VolunteerDashboardViewProps> = ({
  profile,
  complaints,
  tasks,
  onToggleVerificationStatus,
  onAddVerificationEvent,
  onToggleChecklist,
  onNavigate
}) => {
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeSubTab, setActiveSubTab] = useState<'assigned' | 'tasks' | 'nearby'>('assigned');

  const isVerified = profile.volunteer_profile?.verification_status === 'verified';
  const openTasks = tasks.filter(t => t.status !== 'completed');

  // Filter complaints for volunteer
  const filteredComplaints = complaints.filter(c => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.locality && c.locality.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || c.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleOpenIssue = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
  };

  const handleAddVerification = (notes: string, status?: ComplaintStatus) => {
    if (selectedComplaint) {
      onAddVerificationEvent(selectedComplaint.id, notes, status);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Welcome Banner */}
      <div className="bg-white rounded-2xl border border-[#c8d9d2] p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-extrabold bg-[#e7f5ff] text-[#1864ab] mb-2">
              <Users className="w-3.5 h-3.5" />
              <span>Community Volunteer Hub</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#17201d] tracking-tight">
              Welcome, {profile.display_name}
            </h1>
            <p className="text-xs sm:text-sm text-[#4a5853] mt-1">
              Help make local civic issues more visible and actionable across Bengaluru wards.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('tasks')}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#1864ab] hover:bg-[#15538e] text-white shadow-xs transition-colors flex items-center gap-1.5"
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>View Open Tasks ({openTasks.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Verification Status Notice */}
      {!isVerified ? (
        <div className="p-4 sm:p-5 rounded-2xl bg-[#fff9db] border border-[#ffe066] text-[#7a4e00] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-[#f08c00] shrink-0 mt-0.5" />
            <div>
              <h2 className="text-xs sm:text-sm font-extrabold text-[#5c3b00]">
                Volunteer Verification In Progress
              </h2>
              <p className="text-xs text-[#7a4e00] mt-0.5 max-w-2xl leading-relaxed">
                Your volunteer account is currently under verification. Some formal volunteer field actions
                remain marked provisional until municipal community verification is complete.
              </p>
            </div>
          </div>
          <button
            onClick={onToggleVerificationStatus}
            className="px-3.5 py-2 text-xs font-bold rounded-xl bg-white hover:bg-[#fff3bf] text-[#7a4e00] border border-[#ffd43b] shrink-0 shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#f08c00]" />
            <span>Simulate Approval</span>
          </button>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-[#e7f7f1] border border-[#a3e3cb] text-[#087f5b] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-xs font-bold">
            <UserCheck className="w-4 h-4 text-[#087f5b]" />
            <span>You are a Verified Community Volunteer for Indiranagar & Koramangala.</span>
          </div>
          <button
            onClick={onToggleVerificationStatus}
            className="text-[11px] font-bold text-[#087f5b] hover:underline"
          >
            Toggle to Pending (Demo)
          </button>
        </div>
      )}

      {/* Statistics Cards (Matches Section 18) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white border border-[#c8d9d2] shadow-xs">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#66736e]">
            Assigned Issues
          </span>
          <div className="text-2xl font-black text-[#17201d] mt-1">
            {complaints.length > 0 ? complaints.length : 8}
          </div>
          <span className="text-[10px] text-[#1864ab] font-medium">In your ward area</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#c8d9d2] shadow-xs">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#66736e]">
            Open Tasks
          </span>
          <div className="text-2xl font-black text-[#1864ab] mt-1">{openTasks.length}</div>
          <span className="text-[10px] text-[#66736e] font-medium">Require site visits</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#c8d9d2] shadow-xs">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#66736e]">
            Pending Verification
          </span>
          <div className="text-2xl font-black text-[#a96f16] mt-1">2</div>
          <span className="text-[10px] text-[#66736e] font-medium">Awaiting audit</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#c8d9d2] shadow-xs">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#66736e]">
            Follow-Ups
          </span>
          <div className="text-2xl font-black text-[#087f5b] mt-1">4</div>
          <span className="text-[10px] text-[#66736e] font-medium">Department contacts</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#c8d9d2] shadow-xs col-span-2 sm:col-span-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#66736e]">
            Helped Resolve
          </span>
          <div className="text-2xl font-black text-[#17201d] mt-1">17</div>
          <span className="text-[10px] text-[#087f5b] font-medium">Verified fixed</span>
        </div>
      </div>

      {/* Main Section: Assigned Issues & Field Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Issues List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#c8d9d2]">
            <div className="flex rounded-xl bg-[#f2f6f4] p-1 border border-[#e1eae5]">
              <button
                onClick={() => setActiveSubTab('assigned')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeSubTab === 'assigned'
                    ? 'bg-white text-[#1864ab] shadow-xs'
                    : 'text-[#66736e] hover:text-[#17201d]'
                }`}
              >
                Assigned Issues ({filteredComplaints.length})
              </button>
              <button
                onClick={() => setActiveSubTab('nearby')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeSubTab === 'nearby'
                    ? 'bg-white text-[#1864ab] shadow-xs'
                    : 'text-[#66736e] hover:text-[#17201d]'
                }`}
              >
                Nearby Wards
              </button>
            </div>

            {/* Search and Category Filter */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:w-48">
                <input
                  type="text"
                  placeholder="Filter issues..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-7 pr-3 py-1.5 text-xs rounded-xl border border-[#dce5e1] focus:outline-none focus:ring-2 focus:ring-[#1864ab]"
                />
                <Search className="w-3.5 h-3.5 text-[#8a9993] absolute left-2 top-2" />
              </div>
            </div>
          </div>

          {/* Complaints List Cards */}
          <div className="space-y-3">
            {filteredComplaints.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-[#dce5e1]">
                <p className="text-xs text-[#66736e]">No complaints matching this filter.</p>
              </div>
            ) : (
              filteredComplaints.map(complaint => {
                const task = tasks.find(t => t.complaint_id === complaint.id);
                return (
                  <div
                    key={complaint.id}
                    className="p-4 sm:p-5 rounded-2xl bg-white border border-[#c8d9d2] hover:border-[#1864ab] transition-all shadow-xs space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-mono font-bold text-[#1864ab] bg-[#e7f5ff] px-2 py-0.5 rounded-md">
                            #{complaint.id.toUpperCase()}
                          </span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize bg-[#eef3f1] text-[#2c3833]">
                            {complaint.category.replace('_', ' ')}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              complaint.status === 'resolved'
                                ? 'bg-[#e7f7f1] text-[#087f5b]'
                                : complaint.status === 'in_progress'
                                ? 'bg-[#e7f5ff] text-[#1864ab]'
                                : 'bg-[#fff7e6] text-[#a96f16]'
                            }`}
                          >
                            {complaint.status.replace('_', ' ')}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-[#17201d] leading-snug">
                          {complaint.title}
                        </h3>
                      </div>
                    </div>

                    <p className="text-xs text-[#4a5853] line-clamp-2 leading-relaxed">
                      {complaint.description}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#eef3f1] text-xs text-[#66736e]">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#1864ab]" />
                          {complaint.locality || 'Indiranagar'}, {complaint.district || 'Bengaluru'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(complaint.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenIssue(complaint)}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#1864ab] hover:bg-[#15538e] text-white transition-colors flex items-center gap-1"
                        >
                          <span>Ground Audit</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right 1 Col: Urgent Tasks & Checklist */}
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-[#c8d9d2] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#eef3f1]">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-[#1864ab]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#17201d]">
                  Field Tasks ({openTasks.length})
                </h3>
              </div>
              <button
                onClick={() => onNavigate('tasks')}
                className="text-[11px] font-semibold text-[#1864ab] hover:underline"
              >
                View all
              </button>
            </div>

            <div className="space-y-3">
              {tasks.slice(0, 3).map(t => (
                <div key={t.id} className="p-3 rounded-xl bg-[#f8faf9] border border-[#dce5e1] space-y-2">
                  <div className="flex items-start justify-between gap-1">
                    <p className="text-xs font-bold text-[#17201d]">{t.title}</p>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                        t.status === 'completed'
                          ? 'bg-[#e7f7f1] text-[#087f5b]'
                          : 'bg-[#e7f5ff] text-[#1864ab]'
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#66736e] line-clamp-1">{t.location}</p>

                  <div className="space-y-1 pt-1 border-t border-[#dce5e1]/60">
                    {t.checklist.slice(0, 3).map(c => (
                      <label
                        key={c.id}
                        className="flex items-center gap-2 text-[11px] text-[#2c3833] cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={c.completed}
                          onChange={() => onToggleChecklist(t.id, c.id)}
                          className="rounded border-[#dce5e1] text-[#1864ab] focus:ring-[#1864ab]"
                        />
                        <span className={c.completed ? 'line-through text-[#8a9993]' : ''}>
                          {c.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Volunteer Guidelines Reminder Card */}
          <div className="bg-[#f0f9f5] p-4 rounded-2xl border border-[#b8e5d5] text-xs space-y-2">
            <h4 className="font-bold text-[#087f5b] flex items-center gap-1.5">
              <FileCheck2 className="w-4 h-4" />
              <span>Community Ground Code</span>
            </h4>
            <p className="text-[11px] text-[#2c3833] leading-relaxed">
              Always respect citizen privacy. Never ask citizens for OTPs or personal credentials.
              Ground photos must solely document public infrastructure defects.
            </p>
          </div>
        </div>
      </div>

      {/* Detail & Ground Verification Modal */}
      {selectedComplaint && (
        <VolunteerIssueDetailModal
          complaint={selectedComplaint}
          task={tasks.find(t => t.complaint_id === selectedComplaint.id)}
          volunteerProfile={profile}
          isOpen={!!selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
          onAddVerification={handleAddVerification}
          onToggleTaskChecklist={onToggleChecklist}
        />
      )}
    </div>
  );
};
