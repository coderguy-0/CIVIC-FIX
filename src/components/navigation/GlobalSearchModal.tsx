import React, { useState, useMemo } from 'react';
import { Complaint, PublicReport, SavedItem } from '../../types';
import { OFFICIAL_HELP_DIRECTORY } from '../../data/helpDirectory';
import { getStoredSavedItems } from '../../lib/storage';
import { CATEGORIES_META } from '../../lib/constants';
import {
  Search,
  FileText,
  Building2,
  Globe,
  Bookmark,
  X,
  ChevronRight,
  ArrowRight
} from 'lucide-react';

export interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  complaints: Complaint[];
  publicReports: PublicReport[];
  onNavigate: (view: string, complaintId?: string) => void;
  onSelectPublicReport?: (report: PublicReport) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  complaints,
  publicReports,
  onNavigate,
  onSelectPublicReport
}) => {
  const [query, setQuery] = useState('');
  const savedItems = useMemo(() => getStoredSavedItems(), [isOpen]);

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { complaints: [], reports: [], authorities: [], saved: [] };

    const matchedComplaints = complaints.filter(
      c =>
        c.title.toLowerCase().includes(q) ||
        (c.locality && c.locality.toLowerCase().includes(q)) ||
        (c.official_reference && c.official_reference.toLowerCase().includes(q))
    ).slice(0, 4);

    const matchedReports = publicReports.filter(
      r =>
        r.public_title.toLowerCase().includes(q) ||
        r.approximate_location.toLowerCase().includes(q)
    ).slice(0, 4);

    const matchedAuthorities = OFFICIAL_HELP_DIRECTORY.filter(
      a =>
        a.authority_name.toLowerCase().includes(q) ||
        (a.notes && a.notes.toLowerCase().includes(q)) ||
        (a.jurisdiction && a.jurisdiction.toLowerCase().includes(q))
    ).slice(0, 4);

    const matchedSaved = savedItems.filter(
      s =>
        s.title.toLowerCase().includes(q) ||
        (s.subtitle && s.subtitle.toLowerCase().includes(q))
    ).slice(0, 3);

    return {
      complaints: matchedComplaints,
      reports: matchedReports,
      authorities: matchedAuthorities,
      saved: matchedSaved
    };
  }, [query, complaints, publicReports, savedItems]);

  if (!isOpen) return null;

  const totalResults =
    searchResults.complaints.length +
    searchResults.reports.length +
    searchResults.authorities.length +
    searchResults.saved.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
      <div
        className="w-full max-w-2xl bg-white rounded-[20px] shadow-2xl border border-[#dce5e1] overflow-hidden flex flex-col max-h-[80vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#dce5e1] flex items-center gap-3 bg-[#f6f9f7]">
          <Search className="w-5 h-5 text-[#087f5b] shrink-0" />
          <input
            type="text"
            placeholder="Search your complaints, public issues, official portals, saved..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent text-sm text-[#17201d] placeholder:text-[#66736e] focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-[#66736e] hover:text-[#17201d] px-1.5 py-0.5 rounded-md hover:bg-[#eef3f1]"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#66736e] hover:bg-[#eef3f1] hover:text-[#17201d]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {query.trim() === '' ? (
            <div className="py-8 text-center space-y-2">
              <Search className="w-8 h-8 mx-auto text-[#66736e]/40" />
              <p className="text-xs font-semibold text-[#17201d]">Search everything in CivicFix</p>
              <p className="text-[11px] text-[#66736e]">
                Type a keyword, municipal authority name (e.g. MCD, BBMP), or grievance title.
              </p>
            </div>
          ) : totalResults === 0 ? (
            <div className="py-8 text-center text-xs text-[#66736e]">
              No matches found for "<span className="font-semibold text-[#17201d]">{query}</span>".
            </div>
          ) : (
            <div className="space-y-5">
              {/* Group 1: My Complaints */}
              {searchResults.complaints.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold text-[#66736e] uppercase tracking-wider px-2">
                    <span>My Complaints ({searchResults.complaints.length})</span>
                    <span className="text-[#087f5b] lowercase font-normal">private records</span>
                  </div>
                  <div className="space-y-1">
                    {searchResults.complaints.map(c => (
                      <button
                        key={c.id}
                        onClick={() => {
                          onClose();
                          onNavigate('complaint-detail', c.id);
                        }}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-[#f6f9f7] flex items-center justify-between gap-3 group transition-colors"
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[#17201d] truncate group-hover:text-[#087f5b]">
                            {c.title}
                          </p>
                          <p className="text-[11px] text-[#66736e]">
                            {c.locality || c.district} • Status: {c.status}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[#66736e] group-hover:text-[#087f5b] shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Group 2: Public Issues */}
              {searchResults.reports.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold text-[#66736e] uppercase tracking-wider px-2">
                    <span>Community Issues ({searchResults.reports.length})</span>
                    <span className="text-[#2563eb] lowercase font-normal">public map</span>
                  </div>
                  <div className="space-y-1">
                    {searchResults.reports.map(r => (
                      <button
                        key={r.id}
                        onClick={() => {
                          onClose();
                          if (onSelectPublicReport) onSelectPublicReport(r);
                          else onNavigate('explore');
                        }}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-[#f6f9f7] flex items-center justify-between gap-3 group transition-colors"
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[#17201d] truncate group-hover:text-[#2563eb]">
                            {r.public_title}
                          </p>
                          <p className="text-[11px] text-[#66736e]">
                            {r.approximate_location} • {r.confirmations_count} confirmations
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[#66736e] group-hover:text-[#2563eb] shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Group 3: Help Directory */}
              {searchResults.authorities.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold text-[#66736e] uppercase tracking-wider px-2">
                    <span>Official Authorities ({searchResults.authorities.length})</span>
                    <span className="text-[#a96f16] lowercase font-normal">directory</span>
                  </div>
                  <div className="space-y-1">
                    {searchResults.authorities.map(a => (
                      <div
                        key={a.id}
                        className="p-2.5 rounded-xl hover:bg-[#f6f9f7] flex items-center justify-between gap-3 group transition-colors"
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[#17201d] truncate">
                            {a.authority_name}
                          </p>
                          <p className="text-[11px] text-[#66736e]">
                            {a.jurisdiction} • Helpline: {a.helpline}
                          </p>
                        </div>
                        <a
                          href={a.portal_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-bold text-[#087f5b] hover:underline flex items-center gap-1 shrink-0"
                        >
                          <span>Open</span>
                          <ArrowRight className="w-3 h-3" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Group 4: Saved Resources */}
              {searchResults.saved.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold text-[#66736e] uppercase tracking-wider px-2">
                    <span>Saved Resources ({searchResults.saved.length})</span>
                  </div>
                  <div className="space-y-1">
                    {searchResults.saved.map(s => (
                      <button
                        key={s.id}
                        onClick={() => {
                          onClose();
                          onNavigate('saved');
                        }}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-[#f6f9f7] flex items-center justify-between gap-3 group transition-colors"
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[#17201d] truncate">
                            {s.title}
                          </p>
                          <p className="text-[11px] text-[#66736e]">
                            {s.category || s.type}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[#66736e] shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#f6f9f7] border-t border-[#dce5e1] text-[11px] text-[#66736e] flex items-center justify-between px-4">
          <span>Global Search indexed across personal & public data</span>
          <span className="font-mono text-[10px] bg-white px-2 py-0.5 rounded border border-[#dce5e1]">
            ESC to close
          </span>
        </div>
      </div>
    </div>
  );
};
