import React, { useState } from 'react';
import { Complaint, ComplaintEvent, ComplaintStatus, SourceLabel, ComplaintNote } from '../types';
import { CATEGORIES_META } from '../lib/constants';
import { OFFICIAL_HELP_DIRECTORY } from '../data/helpDirectory';
import { addComplaintNote, addComplaintAttachment } from '../lib/storage';
import { Button } from './ui/Button';
import { Dialog } from './ui/Dialog';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';
import { Dropdown } from './ui/Dropdown';
import { ComplaintStatus as StatusBadge } from './complaints/ComplaintStatus';
import { ReferenceNumber } from './complaints/ReferenceNumber';
import { ComplaintTimeline } from './complaints/ComplaintTimeline';
import { FollowUpModal } from './complaints/FollowUpModal';
import { PublicShareModal } from './public/PublicShareModal';
import {
  ArrowLeft,
  Calendar,
  Clock,
  ExternalLink,
  Lock,
  MapPin,
  MoreHorizontal,
  Plus,
  Share2,
  Trash2,
  Building,
  CheckCircle2,
  Circle,
  Edit2,
  FileText,
  UploadCloud,
  Check,
  Shield,
  MessageSquare,
  AlertCircle,
  HelpCircle
} from 'lucide-react';

export interface ComplaintDetailViewProps {
  complaint: Complaint;
  onNavigate: (view: string, complaintId?: string) => void;
  onAddEvent: (complaintId: string, eventData: any) => void;
  onAddReminder: (complaintId: string, remindAt: string, message: string) => void;
  onToggleReminder: (complaintId: string, reminderId: string) => void;
  onUpdateComplaint: (id: string, updates: Partial<Complaint>) => void;
  onDeleteComplaint: (id: string) => void;
  language?: 'en' | 'hi';
}

type WorkspaceTab = 'overview' | 'timeline' | 'evidence' | 'follow-ups' | 'authority' | 'notes';

export const ComplaintDetailView: React.FC<ComplaintDetailViewProps> = ({
  complaint,
  onNavigate,
  onAddEvent,
  onAddReminder,
  onToggleReminder,
  onUpdateComplaint,
  onDeleteComplaint,
  language = 'en'
}) => {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('overview');
  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isEditRefModalOpen, setIsEditRefModalOpen] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [isAddEvidenceModalOpen, setIsAddEvidenceModalOpen] = useState(false);

  // Edit Reference state
  const [refInput, setRefInput] = useState(complaint.official_reference || '');
  const [portalInput, setPortalInput] = useState(complaint.official_portal_url || '');
  const [authInput, setAuthInput] = useState(complaint.authority_name || '');

  // Reminder state
  const [reminderDate, setReminderDate] = useState(
    new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [reminderTime, setReminderTime] = useState('10:00');
  const [reminderMsg, setReminderMsg] = useState('Check grievance status on official portal');

  // Notes state
  const [newNoteText, setNewNoteText] = useState('');
  const [localNotes, setLocalNotes] = useState<ComplaintNote[]>(complaint.notes || []);

  // Evidence state
  const [localAttachments, setLocalAttachments] = useState(complaint.attachments || []);
  const [newEvidenceName, setNewEvidenceName] = useState('');

  const catMeta = CATEGORIES_META[complaint.category] || CATEGORIES_META.other;

  // Active reminder
  const activeReminder = complaint.reminders?.find(r => !r.completed_at);
  const followUpDateStr = activeReminder?.remind_at || complaint.next_follow_up_at;

  // Suggested authority lookup
  const matchedAuthority = OFFICIAL_HELP_DIRECTORY.find(
    a => (a.state_code === complaint.state_code || a.state_code === 'ALL') && a.categories.includes(complaint.category)
  ) || OFFICIAL_HELP_DIRECTORY[0];

  // Dynamic Checklist Calculation
  const isDescribed = !!complaint.title && !!complaint.description;
  const hasEvidence = (localAttachments.length > 0);
  const hasChannel = !!complaint.authority_name;
  const isSubmitted = complaint.status !== 'draft' && complaint.status !== 'prepared';
  const hasReference = !!complaint.official_reference;
  const hasResponse = complaint.events.some(e => e.event_type === 'authority_response') || !!complaint.authority_response || complaint.status === 'in_progress' || complaint.status === 'acknowledged';
  const hasFollowUp = complaint.events.some(e => e.event_type === 'follow_up');
  const hasOutcome = complaint.status === 'resolved' || complaint.status === 'closed';

  const checklistItems = [
    { label: 'Describe the issue', completed: isDescribed },
    { label: 'Add evidence', completed: hasEvidence },
    { label: 'Find reporting channel', completed: hasChannel },
    { label: 'Submit complaint', completed: isSubmitted },
    { label: 'Save reference number', completed: hasReference },
    { label: 'Record authority response', completed: hasResponse },
    { label: 'Follow up', completed: hasFollowUp },
    { label: 'Update outcome', completed: hasOutcome }
  ];

  const completedStepsCount = checklistItems.filter(i => i.completed).length;

  const handleSaveFollowUp = (
    complaintId: string,
    data: {
      note: string;
      newStatus: ComplaintStatus;
      officialResponse: 'yes' | 'no' | 'not_sure';
      sourceLabel: SourceLabel;
    }
  ) => {
    onAddEvent(complaintId, {
      event_type: 'follow_up',
      old_status: complaint.status,
      new_status: data.newStatus,
      note: data.note,
      source_label: data.sourceLabel,
      occurred_at: new Date().toISOString()
    });

    if (data.newStatus !== complaint.status) {
      onUpdateComplaint(complaintId, { status: data.newStatus });
    }
  };

  const handleSaveReference = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateComplaint(complaint.id, {
      official_reference: refInput.trim() || undefined,
      official_portal_url: portalInput.trim() || undefined,
      authority_name: authInput.trim() || undefined
    });
    setIsEditRefModalOpen(false);
  };

  const handleCreateReminder = (e: React.FormEvent) => {
    e.preventDefault();
    const fullDate = `${reminderDate}T${reminderTime}:00`;
    onAddReminder(complaint.id, fullDate, reminderMsg.trim());
    setIsReminderModalOpen(false);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    const added = addComplaintNote(complaint.id, newNoteText.trim());
    setLocalNotes([added, ...localNotes]);
    setNewNoteText('');
  };

  const handleAddEvidenceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvidenceName.trim()) return;
    const newAtt = {
      id: `att-${Date.now()}`,
      storage_path: `mock/${newEvidenceName.trim()}`,
      original_name: newEvidenceName.trim(),
      mime_type: 'image/jpeg',
      file_size_bytes: 520000,
      data_url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
      created_at: new Date().toISOString()
    };
    addComplaintAttachment(complaint.id, newAtt);
    setLocalAttachments([...localAttachments, newAtt]);
    onAddEvent(complaint.id, {
      event_type: 'evidence_added',
      note: `Attached new evidence file: ${newEvidenceName.trim()}`,
      source_label: 'Document attached',
      occurred_at: new Date().toISOString()
    });
    setNewEvidenceName('');
    setIsAddEvidenceModalOpen(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* 1. Header Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => onNavigate('complaints')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#66736e] hover:text-[#17201d] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>← My Complaints</span>
        </button>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsFollowUpModalOpen(true)}
            className="text-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Follow-up</span>
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsAddEvidenceModalOpen(true)}
            className="text-xs"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Add Evidence</span>
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsReminderModalOpen(true)}
            className="text-xs"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Set Reminder</span>
          </Button>

          <Dropdown
            trigger={
              <button className="p-2 rounded-xl border border-[#dce5e1] hover:bg-[#eef3f1] text-[#66736e]">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            }
            items={[
              {
                label: 'Edit official references',
                icon: <Edit2 className="w-3.5 h-3.5" />,
                onClick: () => setIsEditRefModalOpen(true)
              },
              {
                label: complaint.is_public_summary_shared ? 'Manage public report' : 'Share public summary',
                icon: <Share2 className="w-3.5 h-3.5" />,
                onClick: () => setIsShareModalOpen(true)
              },
              {
                label: 'Delete complaint',
                icon: <Trash2 className="w-3.5 h-3.5 text-[#c0392b]" />,
                onClick: () => {
                  if (window.confirm('Are you sure you want to delete this complaint record?')) {
                    onDeleteComplaint(complaint.id);
                  }
                },
                destructive: true
              }
            ]}
          />
        </div>
      </div>

      {/* 2. Workspace Title & Status Strip */}
      <div className="bg-white border border-[#dce5e1] rounded-[20px] p-5 sm:p-6 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-[#f6f9f7] text-[#66736e] border border-[#dce5e1]">
                {catMeta.labelEn}
              </span>
              <span className="text-xs text-[#66736e]">
                • {complaint.locality || complaint.district}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#17201d] leading-tight">
              {complaint.title}
            </h1>
          </div>

          <StatusBadge status={complaint.status} size="lg" />
        </div>
      </div>

      {/* 3. "WHAT SHOULD I DO NEXT?" Dynamic Checklist Panel (Section 22) */}
      <div className="bg-white border border-[#dce5e1] rounded-[20px] p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#087f5b]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#17201d]">
              What should I do next?
            </h2>
          </div>
          <span className="text-xs font-bold text-[#087f5b]">
            {completedStepsCount} of {checklistItems.length} steps completed
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-[#f6f9f7] h-1.5 rounded-full overflow-hidden border border-[#dce5e1]">
          <div
            className="bg-[#087f5b] h-full transition-all duration-300"
            style={{ width: `${(completedStepsCount / checklistItems.length) * 100}%` }}
          />
        </div>

        {/* Checklist items grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          {checklistItems.map((item, idx) => (
            <div
              key={item.label}
              className={`flex items-center gap-2 p-2 rounded-xl text-xs ${
                item.completed
                  ? 'bg-[#e7f7f1]/60 text-[#087f5b] font-semibold'
                  : 'bg-[#f6f9f7] text-[#66736e]'
              }`}
            >
              {item.completed ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-[#087f5b] shrink-0" />
              ) : (
                <Circle className="w-3.5 h-3.5 text-[#66736e]/50 shrink-0" />
              )}
              <span className="truncate">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Six Workspace Tabs (Section 23-28) */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-[#dce5e1] pb-2 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'timeline', label: `Timeline (${complaint.events.length})` },
            { id: 'evidence', label: `Evidence (${localAttachments.length})` },
            { id: 'follow-ups', label: 'Follow-ups' },
            { id: 'authority', label: 'Authority' },
            { id: 'notes', label: `Notes (${localNotes.length})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as WorkspaceTab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#087f5b] text-white'
                  : 'text-[#66736e] hover:bg-[#eef3f1] hover:text-[#17201d]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-4 animate-in fade-in">
            {/* Main Record Card */}
            <div className="bg-white border border-[#dce5e1] rounded-[20px] p-5 sm:p-6 shadow-2xs space-y-4">
              <h3 className="text-sm font-bold text-[#17201d]">Complaint Details</h3>

              <p className="text-xs sm:text-sm text-[#17201d] leading-relaxed bg-[#f6f9f7] p-4 rounded-xl border border-[#dce5e1]/60">
                {complaint.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                <div className="p-3 bg-[#f6f9f7] rounded-xl border border-[#dce5e1]/60 space-y-1">
                  <span className="text-[#66736e] font-semibold block">Locality & District</span>
                  <span className="font-bold text-[#17201d] block">
                    {complaint.locality || 'N/A'}, {complaint.district}, {complaint.state_name || complaint.state_code}
                  </span>
                  {complaint.landmark && (
                    <span className="text-[#66736e] block">Landmark: {complaint.landmark}</span>
                  )}
                </div>

                <div className="p-3 bg-[#f6f9f7] rounded-xl border border-[#dce5e1]/60 space-y-1">
                  <span className="text-[#66736e] font-semibold block">Official Authority</span>
                  <span className="font-bold text-[#17201d] block">
                    {complaint.authority_name || matchedAuthority.authority_name}
                  </span>
                  <span className="text-[#087f5b] font-medium block">
                    Portal: {complaint.official_portal_url || matchedAuthority.portal_url}
                  </span>
                </div>

                <div className="p-3 bg-[#f6f9f7] rounded-xl border border-[#dce5e1]/60 space-y-1">
                  <span className="text-[#66736e] font-semibold block">Official Reference (Private)</span>
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-[#17201d]">
                      {complaint.official_reference || 'Not recorded'}
                    </span>
                    <button
                      onClick={() => setIsEditRefModalOpen(true)}
                      className="text-[#087f5b] hover:underline text-[11px] font-bold"
                    >
                      Edit
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-[#f6f9f7] rounded-xl border border-[#dce5e1]/60 space-y-1">
                  <span className="text-[#66736e] font-semibold block">Next Follow-up</span>
                  <span className="font-bold text-[#a96f16] block">
                    {followUpDateStr
                      ? new Date(followUpDateStr).toLocaleDateString([], {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : 'No upcoming follow-up scheduled'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TIMELINE */}
        {activeTab === 'timeline' && (
          <div className="bg-white border border-[#dce5e1] rounded-[20px] p-5 sm:p-6 shadow-2xs space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#17201d]">Chronological Event Timeline</h3>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsFollowUpModalOpen(true)}
                className="text-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Log New Event</span>
              </Button>
            </div>

            <ComplaintTimeline events={complaint.events} />
          </div>
        )}

        {/* TAB 3: EVIDENCE */}
        {activeTab === 'evidence' && (
          <div className="bg-white border border-[#dce5e1] rounded-[20px] p-5 sm:p-6 shadow-2xs space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#17201d]">Evidence & Attachments</h3>
                <p className="text-xs text-[#66736e]">
                  Private documents, receipts, and photos stored locally under DPDP safeguards.
                </p>
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsAddEvidenceModalOpen(true)}
                className="text-xs"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>+ Add Evidence</span>
              </Button>
            </div>

            {localAttachments.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#66736e] bg-[#f6f9f7] rounded-xl">
                No evidence files uploaded yet. Click "+ Add Evidence" to attach photos or PDF receipts.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {localAttachments.map(att => (
                  <div
                    key={att.id}
                    className="p-3.5 rounded-xl border border-[#dce5e1] bg-white flex items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FileText className="w-5 h-5 text-[#087f5b] shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#17201d] truncate">
                          {att.original_name}
                        </p>
                        <div className="flex items-center gap-2 text-[10px] text-[#66736e]">
                          <span>{att.file_size_bytes ? `${Math.round(att.file_size_bytes / 1024)} KB` : '1.2 MB'}</span>
                          <span className="text-[#087f5b] font-bold bg-[#e7f7f1] px-1.5 py-0.2 rounded">
                            Private
                          </span>
                        </div>
                      </div>
                    </div>

                    <a
                      href={att.data_url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-[#087f5b] hover:underline"
                    >
                      View
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: FOLLOW-UPS */}
        {activeTab === 'follow-ups' && (
          <div className="bg-white border border-[#dce5e1] rounded-[20px] p-5 sm:p-6 shadow-2xs space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#17201d]">Follow-up History</h3>
                <p className="text-xs text-[#66736e]">
                  Every interaction, portal check, or phone call recorded for this complaint.
                </p>
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsFollowUpModalOpen(true)}
                className="text-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Follow-up</span>
              </Button>
            </div>

            <div className="space-y-3">
              {complaint.events.filter(e => e.event_type === 'follow_up' || e.event_type === 'authority_response').map(ev => (
                <div
                  key={ev.id}
                  className="p-4 rounded-xl border border-[#dce5e1] bg-[#f6f9f7] space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#17201d]">
                      {ev.event_type === 'authority_response' ? 'Authority Response' : 'Citizen Follow-up'}
                    </span>
                    <span className="text-[#66736e]">
                      {new Date(ev.occurred_at || ev.created_at).toLocaleDateString([], {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <p className="text-[#17201d]/90 font-medium">"{ev.note}"</p>
                  <span className="text-[10px] text-[#087f5b] font-semibold block">
                    Source: {ev.source_label || 'User reported'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: AUTHORITY */}
        {activeTab === 'authority' && (
          <div className="bg-white border border-[#dce5e1] rounded-[20px] p-5 sm:p-6 shadow-2xs space-y-4 animate-in fade-in">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#087f5b] bg-[#e7f7f1] px-2 py-0.5 rounded-md">
                  Official Jurisdiction
                </span>
                <h3 className="text-base font-bold text-[#17201d] mt-1">
                  {complaint.authority_name || matchedAuthority.authority_name}
                </h3>
                <p className="text-xs text-[#66736e]">
                  {matchedAuthority.notes || matchedAuthority.description}
                </p>
              </div>

              <a
                href={complaint.official_portal_url || matchedAuthority.portal_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#087f5b] px-3.5 py-2 rounded-xl hover:bg-[#066b4d] transition-colors shrink-0"
              >
                <span>Open Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-[#dce5e1] text-xs">
              <div className="p-3 bg-[#f6f9f7] rounded-xl border border-[#dce5e1]/60">
                <span className="text-[#66736e] font-semibold block">Official Helpline</span>
                <span className="font-bold text-[#17201d] block mt-0.5">
                  {matchedAuthority.helpline || '1913 / 311'}
                </span>
              </div>

              <div className="p-3 bg-[#f6f9f7] rounded-xl border border-[#dce5e1]/60">
                <span className="text-[#66736e] font-semibold block">Last Verified</span>
                <span className="font-bold text-[#17201d] block mt-0.5">
                  {matchedAuthority.last_checked_date || 'September 2026'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: NOTES */}
        {activeTab === 'notes' && (
          <div className="bg-white border border-[#dce5e1] rounded-[20px] p-5 sm:p-6 shadow-2xs space-y-4 animate-in fade-in">
            <div>
              <h3 className="text-sm font-bold text-[#17201d]">Private Citizen Notes</h3>
              <p className="text-xs text-[#66736e]">
                Personal scratchpad for officer names, inspection observations, or next steps.
              </p>
            </div>

            {/* Add Note Form */}
            <form onSubmit={handleAddNote} className="flex gap-2">
              <input
                type="text"
                value={newNoteText}
                onChange={e => setNewNoteText(e.target.value)}
                placeholder="Write a private note..."
                className="flex-1 text-xs rounded-xl border border-[#dce5e1] p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#087f5b]"
              />
              <Button type="submit" variant="primary" size="sm" className="text-xs">
                <span>Save Note</span>
              </Button>
            </form>

            {/* Notes List */}
            <div className="space-y-2.5 pt-2">
              {localNotes.length === 0 ? (
                <p className="text-xs text-[#66736e] py-3 text-center">No private notes yet.</p>
              ) : (
                localNotes.map(n => (
                  <div
                    key={n.id}
                    className="p-3 rounded-xl bg-[#f6f9f7] border border-[#dce5e1]/60 flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="space-y-0.5">
                      <p className="text-[#17201d] font-medium">{n.note}</p>
                      <span className="text-[10px] text-[#66736e]">
                        {new Date(n.created_at).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* MODALS */}
      {/* 1. Follow-up Modal */}
      {isFollowUpModalOpen && (
        <FollowUpModal
          isOpen={isFollowUpModalOpen}
          onClose={() => setIsFollowUpModalOpen(false)}
          complaint={complaint}
          onSaveFollowUp={handleSaveFollowUp}
        />
      )}

      {/* 2. Public Share Modal */}
      {isShareModalOpen && (
        <PublicShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          complaint={complaint}
          onSaved={() => {
            setIsShareModalOpen(false);
            onUpdateComplaint(complaint.id, { is_public_summary_shared: true });
          }}
        />
      )}

      {/* 3. Edit Reference Modal */}
      <Dialog
        isOpen={isEditRefModalOpen}
        onClose={() => setIsEditRefModalOpen(false)}
        title="Edit Official References"
        description="Update ticket numbers and links received from the municipal authority."
      >
        <form onSubmit={handleSaveReference} className="space-y-4">
          <Input
            label="Official Reference Token / Ticket Number"
            value={refInput}
            onChange={e => setRefInput(e.target.value)}
            placeholder="e.g. MCD/2026/SZ/84920"
          />
          <Input
            label="Authority Name"
            value={authInput}
            onChange={e => setAuthInput(e.target.value)}
            placeholder="e.g. MCD South Zone or BBMP"
          />
          <Input
            label="Official Portal URL"
            value={portalInput}
            onChange={e => setPortalInput(e.target.value)}
            placeholder="https://mcdonline.nic.in"
          />
          <div className="pt-3 border-t border-[#dce5e1] flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setIsEditRefModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save References
            </Button>
          </div>
        </form>
      </Dialog>

      {/* 4. Set Reminder Modal */}
      <Dialog
        isOpen={isReminderModalOpen}
        onClose={() => setIsReminderModalOpen(false)}
        title="Set Follow-up Reminder"
        description="Schedule a notification to check grievance progress."
      >
        <form onSubmit={handleCreateReminder} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Date"
              type="date"
              value={reminderDate}
              onChange={e => setReminderDate(e.target.value)}
              required
            />
            <Input
              label="Time"
              type="time"
              value={reminderTime}
              onChange={e => setReminderTime(e.target.value)}
              required
            />
          </div>
          <Input
            label="Reminder Note"
            value={reminderMsg}
            onChange={e => setReminderMsg(e.target.value)}
            placeholder="e.g. Check if inspection was done"
            required
          />
          <div className="pt-3 border-t border-[#dce5e1] flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setIsReminderModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Set Reminder
            </Button>
          </div>
        </form>
      </Dialog>

      {/* 5. Add Evidence Modal */}
      <Dialog
        isOpen={isAddEvidenceModalOpen}
        onClose={() => setIsAddEvidenceModalOpen(false)}
        title="Add Evidence File"
        description="Attach a photo, screenshot, or PDF receipt to your private complaint record."
      >
        <form onSubmit={handleAddEvidenceSubmit} className="space-y-4">
          <Input
            label="File Name / Label"
            value={newEvidenceName}
            onChange={e => setNewEvidenceName(e.target.value)}
            placeholder="e.g. site_inspection_photo_day4.jpg"
            required
          />
          <div className="p-3 bg-[#e7f7f1] rounded-xl text-xs text-[#087f5b] flex items-center gap-2">
            <Shield className="w-4 h-4 shrink-0" />
            <span>Files are stored privately in your browser and never publicly exposed.</span>
          </div>
          <div className="pt-3 border-t border-[#dce5e1] flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setIsAddEvidenceModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Attach Evidence
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};
