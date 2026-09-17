import React, { useState } from 'react';
import { Complaint } from '../types';
import { Button } from './ui/Button';
import { ComplaintCard } from './complaints/ComplaintCard';
import { ComplaintFilters, FilterType } from './complaints/ComplaintFilters';
import { EmptyState } from './ui/EmptyState';
import { Plus, FileText } from 'lucide-react';

export interface ComplaintsListViewProps {
  complaints: Complaint[];
  onNavigate: (view: string, complaintId?: string) => void;
  language?: 'en' | 'hi';
}

export const ComplaintsListView: React.FC<ComplaintsListViewProps> = ({
  complaints,
  onNavigate,
  language = 'en'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  // Compute filter counts
  const counts = {
    all: complaints.length,
    active: complaints.filter(c => c.status !== 'resolved' && c.status !== 'closed').length,
    followUp: complaints.filter(
      c => c.next_follow_up_at && c.status !== 'resolved' && c.status !== 'closed'
    ).length,
    resolved: complaints.filter(c => c.status === 'resolved' || c.status === 'closed').length
  };

  // Filter complaints
  const filteredComplaints = complaints.filter(c => {
    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = c.title.toLowerCase().includes(q);
      const matchLoc = (c.locality || '').toLowerCase().includes(q);
      const matchRef = (c.official_reference || '').toLowerCase().includes(q);
      const matchAuth = (c.authority_name || '').toLowerCase().includes(q);
      if (!matchTitle && !matchLoc && !matchRef && !matchAuth) return false;
    }

    // Status tab filter
    if (activeFilter === 'active') {
      return c.status !== 'resolved' && c.status !== 'closed';
    }
    if (activeFilter === 'follow-up') {
      return (
        c.status !== 'resolved' &&
        c.status !== 'closed' &&
        (c.next_follow_up_at || (c.reminders && c.reminders.some(r => !r.completed_at)))
      );
    }
    if (activeFilter === 'resolved') {
      return c.status === 'resolved' || c.status === 'closed';
    }

    return true;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17201d] tracking-tight">
            My complaints
          </h1>
          <p className="text-sm text-[#66736e] mt-0.5">
            Track everything in one place.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => onNavigate('new-complaint')}
          className="shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>+ New complaint</span>
        </Button>
      </div>

      {/* Search & Filters */}
      <ComplaintFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        counts={counts}
      />

      {/* Grid of Complaints */}
      {filteredComplaints.length === 0 ? (
        <EmptyState
          icon={<FileText className="w-6 h-6" />}
          title={
            searchQuery
              ? 'No matching complaints found.'
              : activeFilter !== 'all'
              ? `No complaints in the "${activeFilter}" filter.`
              : "You haven't tracked anything yet."
          }
          description={
            searchQuery
              ? 'Try searching with a different word or clearing the search.'
              : 'Keep your civic complaints, references and follow-ups together.'
          }
          action={
            !searchQuery && activeFilter === 'all' ? (
              <Button variant="primary" onClick={() => onNavigate('new-complaint')}>
                + Create complaint
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setActiveFilter('all');
                }}
              >
                Clear filters
              </Button>
            )
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredComplaints.map(complaint => (
            <ComplaintCard
              key={complaint.id}
              complaint={complaint}
              onView={id => onNavigate('complaint-detail', id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
