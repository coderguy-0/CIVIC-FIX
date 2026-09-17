import React, { useState } from 'react';
import { ModerationAction, PublicReport } from '../types';
import { CATEGORIES_META } from '../lib/constants';
import { Button } from './ui/Button';
import { Dialog } from './ui/Dialog';
import { Checkbox } from './ui/Checkbox';
import { Textarea } from './ui/Textarea';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Eye,
  AlertTriangle
} from 'lucide-react';

export interface AdminModerationViewProps {
  publicReports: PublicReport[];
  moderationAudits: ModerationAction[];
  onModerate: (
    reportId: string,
    action: 'approve' | 'reject' | 'hide' | 'restore',
    reason?: string
  ) => void;
  language?: 'en' | 'hi';
}

export const AdminModerationView: React.FC<AdminModerationViewProps> = ({
  publicReports,
  moderationAudits,
  onModerate,
  language = 'en'
}) => {
  const [reviewReport, setReviewReport] = useState<PublicReport | null>(null);

  // Review screen potential concerns checklist
  const [concernPII, setConcernPII] = useState(false);
  const [concernClaim, setConcernClaim] = useState(false);
  const [concernLocation, setConcernLocation] = useState(false);
  const [concernAbuse, setConcernAbuse] = useState(false);
  const [concernSpam, setConcernSpam] = useState(false);
  const [moderatorNote, setModeratorNote] = useState('');

  const pendingReports = publicReports.filter(r => r.moderation_status === 'pending');
  const flaggedReports = publicReports.filter(r => r.moderation_status === 'rejected');
  const approvedReports = publicReports.filter(r => r.moderation_status === 'approved');

  const openReview = (report: PublicReport) => {
    setReviewReport(report);
    setConcernPII(false);
    setConcernClaim(false);
    setConcernLocation(false);
    setConcernAbuse(false);
    setConcernSpam(false);
    setModeratorNote('');
  };

  const handleApprove = () => {
    if (!reviewReport) return;
    onModerate(
      reviewReport.id,
      'approve',
      moderatorNote.trim() || 'Passed content safety guidelines'
    );
    setReviewReport(null);
  };

  const handleReject = () => {
    if (!reviewReport) return;
    const reasons: string[] = [];
    if (concernPII) reasons.push('Personal information (PII)');
    if (concernClaim) reasons.push('Unsupported claim');
    if (concernLocation) reasons.push('Excessive location detail');
    if (concernAbuse) reasons.push('Abusive content');
    if (concernSpam) reasons.push('Spam');
    if (moderatorNote.trim()) reasons.push(moderatorNote.trim());

    onModerate(
      reviewReport.id,
      'reject',
      reasons.length > 0 ? reasons.join('; ') : 'Violates community standards'
    );
    setReviewReport(null);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header with counts */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17201d] tracking-tight">
            Admin Moderation
          </h1>
          <p className="text-sm text-[#66736e] mt-0.5">
            Screen public reports before they appear on the community map.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 rounded-xl bg-[#fff7e6] text-[#a96f16] text-xs font-bold flex items-center gap-1.5 border border-[#a96f16]/20">
            <Clock className="w-3.5 h-3.5" />
            <span>{pendingReports.length} pending reports</span>
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-[#fff0ee] text-[#c0392b] text-xs font-bold flex items-center gap-1.5 border border-[#c0392b]/20">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{flaggedReports.length} rejected/flagged</span>
          </span>
        </div>
      </div>

      {/* Moderation Queue Table */}
      <div className="bg-white rounded-[16px] border border-[#dce5e1] overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-[#dce5e1] flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#17201d] uppercase tracking-wider text-[#66736e]">
            Moderation Queue ({publicReports.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#17201d]">
            <thead className="bg-[#f6f9f7] border-b border-[#dce5e1] text-[#66736e] font-semibold">
              <tr>
                <th className="py-3 px-4">Report</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dce5e1]/60">
              {publicReports.map(report => {
                const catMeta = CATEGORIES_META[report.category] || CATEGORIES_META.other;
                return (
                  <tr key={report.id} className="hover:bg-[#f6f9f7]/60 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#17201d] max-w-xs truncate">
                      {report.public_title}
                    </td>
                    <td className="py-3.5 px-4 text-[#66736e]">
                      {catMeta.labelEn}
                    </td>
                    <td className="py-3.5 px-4 text-[#66736e]">
                      {report.approximate_location}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          report.moderation_status === 'approved'
                            ? 'bg-[#e7f7f1] text-[#087f5b]'
                            : report.moderation_status === 'rejected'
                            ? 'bg-[#fff0ee] text-[#c0392b]'
                            : 'bg-[#fff7e6] text-[#a96f16]'
                        }`}
                      >
                        {report.moderation_status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => openReview(report)}
                        className="text-xs"
                      >
                        Review
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Screen Modal (Section 20 specification) */}
      {reviewReport && (
        <Dialog
          isOpen={!!reviewReport}
          onClose={() => setReviewReport(null)}
          title="Review public report"
          description="Evaluate report content against anti-harassment and PII standards."
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs">
            <div className="bg-[#f6f9f7] p-4 rounded-[12px] border border-[#dce5e1] space-y-2">
              <h3 className="text-sm font-bold text-[#17201d]">
                {reviewReport.public_title}
              </h3>
              <div className="flex items-center gap-3 text-[#66736e]">
                <span>
                  Category: <strong>{CATEGORIES_META[reviewReport.category]?.labelEn}</strong>
                </span>
                <span>•</span>
                <span>
                  Area: <strong>{reviewReport.approximate_location}</strong>
                </span>
              </div>
              <p className="text-[#17201d]/90 leading-relaxed pt-1 whitespace-pre-line">
                {reviewReport.public_description}
              </p>
            </div>

            {/* Potential Concerns Checklist */}
            <div className="space-y-2 pt-2 border-t border-[#dce5e1]">
              <span className="font-bold text-[#17201d] block">Potential concerns:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Checkbox
                  checked={concernPII}
                  onChange={e => setConcernPII(e.target.checked)}
                  label="Personal information (names, phone numbers, exact house #)"
                />
                <Checkbox
                  checked={concernClaim}
                  onChange={e => setConcernClaim(e.target.checked)}
                  label="Unsupported claim or defamatory allegations"
                />
                <Checkbox
                  checked={concernLocation}
                  onChange={e => setConcernLocation(e.target.checked)}
                  label="Excessive location detail (private property)"
                />
                <Checkbox
                  checked={concernAbuse}
                  onChange={e => setConcernAbuse(e.target.checked)}
                  label="Abusive content or profanity"
                />
                <Checkbox
                  checked={concernSpam}
                  onChange={e => setConcernSpam(e.target.checked)}
                  label="Spam or advertisement"
                />
              </div>
            </div>

            <Textarea
              label="Moderator Audit Note"
              placeholder="Reason for approval/rejection recorded into the permanent audit trail..."
              value={moderatorNote}
              onChange={e => setModeratorNote(e.target.value)}
              rows={2}
            />

            {/* Actions */}
            <div className="pt-3 border-t border-[#dce5e1] flex items-center justify-between">
              <Button
                type="button"
                variant="destructive"
                onClick={handleReject}
              >
                <XCircle className="w-4 h-4" />
                <span>Reject</span>
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setReviewReport(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  onClick={handleApprove}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve</span>
                </Button>
              </div>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
};
