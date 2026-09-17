import React, { useState } from 'react';
import { Dialog } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Textarea';
import { Input } from '../ui/Input';
import { Complaint } from '../../types';
import { Check, Lock, ShieldCheck, AlertCircle } from 'lucide-react';

export interface PublicShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  complaint: Complaint;
  onSubmitForModeration: (
    complaintId: string,
    publicData: {
      publicTitle: string;
      publicDescription: string;
      approximateLocation: string;
    }
  ) => void;
}

export const PublicShareModal: React.FC<PublicShareModalProps> = ({
  isOpen,
  onClose,
  complaint,
  onSubmitForModeration
}) => {
  const [publicTitle, setPublicTitle] = useState(complaint.title);
  const [publicDescription, setPublicDescription] = useState(complaint.description);
  const [approxLocation, setApproxLocation] = useState(
    complaint.locality || complaint.district || 'Neighborhood'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitForModeration(complaint.id, {
      publicTitle: publicTitle.trim(),
      publicDescription: publicDescription.trim(),
      approximateLocation: approxLocation.trim()
    });
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Share a public summary"
      description="Help neighbors corroborate this issue without exposing your private tracking data."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Privacy distinction guarantees */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-[12px] bg-[#f6f9f7] border border-[#dce5e1] text-xs">
          <div className="space-y-1.5">
            <span className="font-bold text-[#087f5b] flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Publicly visible
            </span>
            <ul className="text-[11px] text-[#17201d] space-y-0.5 list-disc list-inside">
              <li>Category ({complaint.category})</li>
              <li>General area only</li>
              <li>Public description</li>
            </ul>
          </div>

          <div className="space-y-1.5">
            <span className="font-bold text-[#66736e] flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-[#087f5b]" /> Not publicly visible
            </span>
            <ul className="text-[11px] text-[#66736e] space-y-0.5 list-disc list-inside">
              <li>Reference number</li>
              <li>Personal follow-up notes</li>
              <li>Private attachments</li>
              <li>Your account/email</li>
            </ul>
          </div>
        </div>

        <Input
          label="Public summary title"
          value={publicTitle}
          onChange={e => setPublicTitle(e.target.value)}
          required
        />

        <Textarea
          label="Public description"
          value={publicDescription}
          onChange={e => setPublicDescription(e.target.value)}
          hint="Do not include house numbers, names, or personal contact info."
          rows={3}
          required
        />

        <Input
          label="General area / landmark"
          value={approxLocation}
          onChange={e => setApproxLocation(e.target.value)}
          hint="e.g. Near Community Center, Main Road"
          required
        />

        <div className="p-3 bg-[#e7f7f1] rounded-[12px] border border-[#087f5b]/20 flex items-start gap-2 text-xs text-[#087f5b]">
          <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            CivicFix moderators will review this summary before it appears on the public explore map to protect privacy.
          </span>
        </div>

        <div className="pt-3 border-t border-[#dce5e1] flex items-center justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Submit for moderation
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
