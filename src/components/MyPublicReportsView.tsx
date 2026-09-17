import React, { useState } from 'react';
import { Complaint, PublicReport } from '../types';
import { Button } from './ui/Button';
import { CATEGORIES_META } from '../lib/constants';
import {
  Share2,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Eye,
  ExternalLink,
  Plus
} from 'lucide-react';

export interface MyPublicReportsViewProps {
  publicReports: PublicReport[];
  complaints: Complaint[];
  onNavigate: (view: string, complaintId?: string) => void;
  language?: 'en' | 'hi';
}

export const MyPublicReportsView: React.FC<MyPublicReportsViewProps> = ({
  publicReports,
  complaints,
  onNavigate,
  language = 'en'
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'hidden' | 'rejected'>('all');

  // Filter public reports that belong to user's complaints
  const userComplaintIds = new Set(complaints.map(c => c.id));
  const myReports = publicReports.filter(r => userComplaintIds.has(r.complaint_id) || r.user_id === 'user-001' || r.user_id === 'user-default');

  const filteredReports = myReports.filter(r => {
    if (activeTab === 'all') return true;
    return r.moderation_status === activeTab;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#e7f7f1] text-[#087f5b] border border-[#a3e3cb]">
            <CheckCircle2 className="w-3 h-3" />
            <span>Public — Approved</span>
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#fff7e6] text-[#a96f16] border border-[#fbd38d]">
            <Clock className="w-3 h-3" />
            <span>Pending Moderation</span>
          </span>
        );
      case 'hidden':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#f6f9f7] text-[#66736e] border border-[#dce5e1]">
            <span>Hidden</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#fff0ee] text-[#c0392b] border border-[#f5c6cb]">
            <AlertTriangle className="w-3 h-3" />
            <span>Rejected</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17201d] tracking-tight">
            My Public Reports
          </h1>
          <p className="text-sm text-[#66736e] mt-1">
            Community-facing summaries you submitted for public corroboration.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => onNavigate('explore')}
          size="sm"
          className="text-xs"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Explore Public Issues</span>
        </Button>
      </div>

      {/* Privacy Separation Assurance */}
      <div className="bg-[#e7f7f1]/60 border border-[#087f5b]/20 rounded-[16px] p-4.5 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-[#087f5b] shrink-0 mt-0.5" />
        <div className="text-xs text-[#17201d]/90 leading-relaxed space-y-1">
          <p className="font-bold text-[#087f5b]">Privacy Architecture Guarantee</p>
          <p>
            Your private complaint tracking notes, official reference tokens, and exact residence address remain strictly confidential. Only this sanitized, moderated public summary is published on the community map for neighbors to corroborate.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#dce5e1] pb-2 overflow-x-auto">
        {(['all', 'approved', 'pending', 'hidden', 'rejected'] as const).map(tab => {
          const count = tab === 'all' ? myReports.length : myReports.filter(r => r.moderation_status === tab).length;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === tab
                  ? 'bg-[#087f5b] text-white'
                  : 'text-[#66736e] hover:bg-[#eef3f1] hover:text-[#17201d]'
              }`}
            >
              <span>{tab}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                activeTab === tab ? 'bg-white/20 text-white' : 'bg-[#eef3f1] text-[#66736e]'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* List */}
      {filteredReports.length === 0 ? (
        <div className="bg-white rounded-[16px] border border-[#dce5e1] p-8 text-center space-y-3 shadow-2xs">
          <Share2 className="w-8 h-8 mx-auto text-[#66736e]/50" />
          <h3 className="text-sm font-bold text-[#17201d]">No public reports in this view</h3>
          <p className="text-xs text-[#66736e] max-w-sm mx-auto">
            You can share a moderated summary from any private complaint workspace to gather community support.
          </p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onNavigate('complaints')}
            className="text-xs mt-2"
          >
            <span>View My Complaints</span>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReports.map(report => {
            const cat = CATEGORIES_META[report.category] || CATEGORIES_META.other;
            const parentComplaint = complaints.find(c => c.id === report.complaint_id);

            return (
              <div
                key={report.id}
                className="bg-white border border-[#dce5e1] rounded-[16px] p-5 shadow-2xs space-y-4 hover:border-[#66736e]/40 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#66736e]">
                        {cat.labelEn}
                      </span>
                      {getStatusBadge(report.moderation_status)}
                    </div>
                    <h3 className="text-base font-bold text-[#17201d]">
                      {report.public_title}
                    </h3>
                    <p className="text-xs text-[#66736e]">
                      Approximate Area: {report.approximate_location}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {parentComplaint && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onNavigate('complaint-detail', parentComplaint.id)}
                        className="text-xs"
                      >
                        <span>Private Workspace</span>
                      </Button>
                    )}
                  </div>
                </div>

                <p className="text-xs text-[#17201d] leading-relaxed bg-[#f6f9f7] p-3 rounded-xl border border-[#dce5e1]/60">
                  {report.public_description}
                </p>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-[#dce5e1]/60">
                  <span className="text-[#087f5b] font-bold">
                    {report.confirmations_count} community confirmation{report.confirmations_count !== 1 ? 's' : ''}
                  </span>
                  <span className="text-[11px] text-[#66736e]">
                    Submitted on {new Date(report.created_at).toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
