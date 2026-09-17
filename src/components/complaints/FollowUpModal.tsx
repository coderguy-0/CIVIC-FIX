import React, { useState } from 'react';
import { Dialog } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';
import { Complaint, ComplaintStatus, SourceLabel } from '../../types';

export interface FollowUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  complaint: Complaint | null;
  onSaveFollowUp: (
    complaintId: string,
    data: {
      note: string;
      newStatus: ComplaintStatus;
      officialResponse: 'yes' | 'no' | 'not_sure';
      sourceLabel: SourceLabel;
    }
  ) => void;
}

export const FollowUpModal: React.FC<FollowUpModalProps> = ({
  isOpen,
  onClose,
  complaint,
  onSaveFollowUp
}) => {
  const [note, setNote] = useState('');
  const [newStatus, setNewStatus] = useState<ComplaintStatus>(complaint?.status || 'in_progress');
  const [officialResponse, setOfficialResponse] = useState<'yes' | 'no' | 'not_sure'>('no');
  const [error, setError] = useState('');

  // Synchronize status when complaint changes
  React.useEffect(() => {
    if (complaint) {
      setNewStatus(complaint.status);
      setNote('');
      setOfficialResponse('no');
      setError('');
    }
  }, [complaint]);

  if (!complaint) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) {
      setError('Please describe what happened during this follow-up.');
      return;
    }

    let sourceLabel: SourceLabel = 'User reported';
    if (officialResponse === 'yes') {
      sourceLabel = 'Official source linked';
    }

    onSaveFollowUp(complaint.id, {
      note: note.trim(),
      newStatus,
      officialResponse,
      sourceLabel
    });
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Add follow-up"
      description={`Record an action or update for "${complaint.title}"`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* What happened? */}
        <Textarea
          label="What happened?"
          placeholder="e.g., Visited the ward office / called the helpline / inspected the site again..."
          value={note}
          onChange={e => {
            setNote(e.target.value);
            if (error) setError('');
          }}
          error={error}
          rows={4}
          required
        />

        {/* Update status */}
        <Select
          label="Update status"
          value={newStatus}
          onChange={e => setNewStatus(e.target.value as ComplaintStatus)}
          options={[
            { value: 'submitted', label: 'Submitted' },
            { value: 'acknowledged', label: 'Acknowledged' },
            { value: 'in_progress', label: 'In progress' },
            { value: 'resolved', label: 'Resolved' },
            { value: 'reopened', label: 'Reopened' },
            { value: 'closed', label: 'Closed' }
          ]}
        />

        {/* Official response received */}
        <div className="space-y-2 pt-1">
          <label className="block text-xs font-semibold text-[#17201d]">
            Did you receive an official response?
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'yes', label: 'Yes' },
              { id: 'no', label: 'No' },
              { id: 'not_sure', label: 'Not sure' }
            ].map(opt => (
              <label
                key={opt.id}
                className={`flex items-center justify-center p-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition-colors ${
                  officialResponse === opt.id
                    ? 'bg-[#e7f7f1] border-[#087f5b] text-[#087f5b]'
                    : 'bg-white border-[#dce5e1] text-[#66736e] hover:bg-[#eef3f1]'
                }`}
              >
                <input
                  type="radio"
                  name="officialResponse"
                  value={opt.id}
                  checked={officialResponse === opt.id}
                  onChange={() => setOfficialResponse(opt.id as any)}
                  className="sr-only"
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="pt-4 border-t border-[#dce5e1] flex items-center justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Save follow-up
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
