import React, { useState } from 'react';
import {
  X,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  Camera,
  FileText,
  AlertCircle,
  Share2,
  Send,
  Building,
  ShieldCheck,
  CheckSquare
} from 'lucide-react';
import { Complaint, ComplaintStatus, UserProfile, VolunteerTask } from '../../types';
import { Button } from '../ui/Button';

export interface VolunteerIssueDetailModalProps {
  complaint: Complaint;
  task?: VolunteerTask;
  volunteerProfile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onAddVerification: (notes: string, newStatus?: ComplaintStatus, photoNotes?: string) => void;
  onToggleTaskChecklist?: (taskId: string, checklistId: string) => void;
  onAddFollowUp?: (notes: string) => void;
}

export const VolunteerIssueDetailModal: React.FC<VolunteerIssueDetailModalProps> = ({
  complaint,
  task,
  volunteerProfile,
  isOpen,
  onClose,
  onAddVerification,
  onToggleTaskChecklist,
  onAddFollowUp
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'verify' | 'followup'>('details');
  const [verificationNotes, setVerificationNotes] = useState('');
  const [newStatus, setNewStatus] = useState<ComplaintStatus>(complaint.status);
  const [photoEvidenceNotes, setPhotoEvidenceNotes] = useState('');
  const [followUpNotes, setFollowUpNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const isVerified = volunteerProfile.volunteer_profile?.verification_status === 'verified';

  const handleVerificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationNotes.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      onAddVerification(verificationNotes, newStatus, photoEvidenceNotes);
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  const handleFollowUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUpNotes.trim() || !onAddFollowUp) return;
    setIsSubmitting(true);
    setTimeout(() => {
      onAddFollowUp(followUpNotes);
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="relative bg-white w-full max-w-2xl rounded-2xl border border-[#c8d9d2] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#dce5e1] bg-[#f8faf9]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold font-mono text-[#1864ab] bg-[#e7f5ff] px-2 py-0.5 rounded-md">
                Issue #{complaint.id.toUpperCase()}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full capitalize bg-[#eef3f1] text-[#2c3833]">
                {complaint.category.replace('_', ' ')}
              </span>
            </div>
            <h2 className="text-base font-extrabold text-[#17201d] mt-1 line-clamp-1">
              {complaint.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#66736e] hover:text-[#17201d] hover:bg-[#eef3f1] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#dce5e1] px-6 bg-white">
          <button
            onClick={() => setActiveTab('details')}
            className={`py-3 text-xs font-bold border-b-2 mr-6 transition-all ${
              activeTab === 'details'
                ? 'border-[#1864ab] text-[#1864ab]'
                : 'border-transparent text-[#66736e] hover:text-[#17201d]'
            }`}
          >
            Issue Overview & Checklist
          </button>
          <button
            onClick={() => setActiveTab('verify')}
            className={`py-3 text-xs font-bold border-b-2 mr-6 transition-all flex items-center gap-1.5 ${
              activeTab === 'verify'
                ? 'border-[#1864ab] text-[#1864ab]'
                : 'border-transparent text-[#66736e] hover:text-[#17201d]'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Record Verification</span>
          </button>
          <button
            onClick={() => setActiveTab('followup')}
            className={`py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'followup'
                ? 'border-[#1864ab] text-[#1864ab]'
                : 'border-transparent text-[#66736e] hover:text-[#17201d]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Field Follow-Up</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {activeTab === 'details' && (
            <div className="space-y-5">
              {/* Locality & Authority Meta */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#f8faf9] border border-[#dce5e1] text-xs">
                <div className="flex items-center gap-2 text-[#4a5853]">
                  <MapPin className="w-4 h-4 text-[#1864ab] shrink-0" />
                  <span>
                    <strong>Area:</strong> {complaint.locality || 'Indiranagar'}, {complaint.district || 'Bengaluru'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[#4a5853]">
                  <Building className="w-4 h-4 text-[#1864ab] shrink-0" />
                  <span>
                    <strong>Department:</strong> {complaint.authority_name || 'Municipal Ward Office'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[#4a5853]">
                  <Calendar className="w-4 h-4 text-[#1864ab] shrink-0" />
                  <span>
                    <strong>Reported:</strong> {new Date(complaint.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[#4a5853]">
                  <Clock className="w-4 h-4 text-[#1864ab] shrink-0" />
                  <span>
                    <strong>Current Status:</strong>{' '}
                    <span className="font-bold text-[#1864ab] capitalize">
                      {complaint.status.replace('_', ' ')}
                    </span>
                  </span>
                </div>
              </div>

              {/* Public Description (Privacy Filtered) */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#66736e] mb-1.5">
                  Public Problem Description
                </h3>
                <p className="text-xs text-[#2c3833] leading-relaxed p-3.5 rounded-xl bg-[#fafcfb] border border-[#dce5e1]">
                  {complaint.description}
                </p>
              </div>

              {/* Volunteer Tasks Checklist */}
              {task && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#1864ab] flex items-center gap-1.5">
                      <CheckSquare className="w-4 h-4" />
                      <span>Volunteer Field Verification Checklist</span>
                    </h3>
                    <span className="text-[11px] font-bold text-[#66736e]">
                      {task.checklist.filter(c => c.completed).length} of {task.checklist.length} completed
                    </span>
                  </div>

                  <div className="space-y-1.5 p-3 rounded-xl bg-[#f0f6f3] border border-[#c8d9d2]">
                    {task.checklist.map(item => (
                      <label
                        key={item.id}
                        className="flex items-center gap-2.5 p-2 rounded-lg bg-white border border-[#dce5e1] text-xs font-medium text-[#17201d] cursor-pointer hover:border-[#1864ab] transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={item.completed}
                          onChange={() => onToggleTaskChecklist && onToggleTaskChecklist(task.id, item.id)}
                          className="rounded border-[#dce5e1] text-[#1864ab] focus:ring-[#1864ab]"
                        />
                        <span className={item.completed ? 'line-through text-[#8a9993]' : ''}>
                          {item.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Timeline Trace */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#66736e] mb-2">
                  Verifiable Timeline ({complaint.events.length} events)
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {complaint.events.map(ev => (
                    <div
                      key={ev.id}
                      className="p-2.5 rounded-xl bg-white border border-[#dce5e1] text-xs space-y-0.5"
                    >
                      <div className="flex items-center justify-between text-[10px] text-[#66736e]">
                        <span className="font-bold text-[#1864ab] capitalize">
                          {ev.event_type.replace('_', ' ')}
                        </span>
                        <span>{new Date(ev.occurred_at).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs text-[#2c3833]">{ev.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'verify' && (
            <form onSubmit={handleVerificationSubmit} className="space-y-4">
              {!isVerified && (
                <div className="p-3 rounded-xl bg-[#fff7e6] border border-[#ffe066] flex items-start gap-2.5 text-xs text-[#a96f16]">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <strong>Verification Required:</strong> Your volunteer account is pending review.
                    You can still draft this ground verification note for review by city moderators.
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#17201d] mb-1.5">
                  Ground Verification Observations <span className="text-[#c0392b]">*</span>
                </label>
                <textarea
                  rows={4}
                  value={verificationNotes}
                  onChange={e => setVerificationNotes(e.target.value)}
                  placeholder="Describe your site inspection: e.g. Inspected on-site today at 11:30 AM. Pothole measured 1.2m wide, warning cone installed by community..."
                  required
                  className="w-full p-3 rounded-xl border border-[#dce5e1] text-xs focus:outline-none focus:ring-2 focus:ring-[#1864ab]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17201d] mb-1.5">
                  Update Official Status Recommendation
                </label>
                <select
                  value={newStatus}
                  onChange={e => setNewStatus(e.target.value as ComplaintStatus)}
                  className="w-full p-2.5 rounded-xl border border-[#dce5e1] text-xs focus:outline-none focus:ring-2 focus:ring-[#1864ab] bg-white"
                >
                  <option value="in_progress">In Progress (Work commenced / verified)</option>
                  <option value="resolved">Resolved (Issue confirmed fixed on ground)</option>
                  <option value="acknowledged">Acknowledged by Department</option>
                  <option value="submitted">Submitted (Awaiting initial inspection)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17201d] mb-1.5">
                  Photographic Evidence Description / Link
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={photoEvidenceNotes}
                    onChange={e => setPhotoEvidenceNotes(e.target.value)}
                    placeholder="e.g. 2 geo-tagged photos attached: showing cleared storm drain"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#dce5e1] text-xs focus:outline-none focus:ring-2 focus:ring-[#1864ab]"
                  />
                  <Camera className="w-4 h-4 text-[#8a9993] absolute left-3 top-3" />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button type="button" variant="secondary" onClick={onClose} className="text-xs">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting || !verificationNotes.trim()}
                  className="text-xs font-bold bg-[#1864ab] hover:bg-[#15538e] text-white"
                >
                  {isSubmitting ? 'Recording Audit...' : 'Publish Ground Verification'}
                </Button>
              </div>
            </form>
          )}

          {activeTab === 'followup' && (
            <form onSubmit={handleFollowUpSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#17201d] mb-1.5">
                  Record Department Follow-up Contact
                </label>
                <textarea
                  rows={4}
                  value={followUpNotes}
                  onChange={e => setFollowUpNotes(e.target.value)}
                  placeholder="e.g. Spoke to Junior Engineer Ramesh at Ward 89 office. He confirmed asphalt mixer scheduled for tomorrow morning..."
                  required
                  className="w-full p-3 rounded-xl border border-[#dce5e1] text-xs focus:outline-none focus:ring-2 focus:ring-[#1864ab]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button type="button" variant="secondary" onClick={onClose} className="text-xs">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting || !followUpNotes.trim()}
                  className="text-xs font-bold bg-[#1864ab] hover:bg-[#15538e] text-white"
                >
                  {isSubmitting ? 'Saving...' : 'Record Follow-Up'}
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-3 border-t border-[#dce5e1] bg-[#f8faf9] flex items-center justify-between text-xs text-[#66736e]">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#1864ab]" />
            <span>DPDP Privacy: Citizen contact details are strictly kept private</span>
          </div>
          <Button variant="secondary" onClick={onClose} className="text-xs py-1.5 px-3">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
