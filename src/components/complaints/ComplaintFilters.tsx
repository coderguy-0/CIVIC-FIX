import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '../ui/Input';

export type FilterType = 'all' | 'active' | 'follow-up' | 'resolved';

export interface ComplaintFiltersProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeFilter: FilterType;
  onFilterChange: (f: FilterType) => void;
  counts: {
    all: number;
    active: number;
    followUp: number;
    resolved: number;
  };
}

export const ComplaintFilters: React.FC<ComplaintFiltersProps> = ({
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
  counts
}) => {
  const filterTabs: { id: FilterType; label: string; count: number }[] = [
    { id: 'all', label: 'All', count: counts.all },
    { id: 'active', label: 'Active', count: counts.active },
    { id: 'follow-up', label: 'Follow-up', count: counts.followUp },
    { id: 'resolved', label: 'Resolved', count: counts.resolved }
  ];

  return (
    <div className="space-y-3">
      {/* Search Input */}
      <div className="w-full">
        <Input
          placeholder="Search complaints by title, locality, reference..."
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {filterTabs.map(tab => {
          const isSelected = activeFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onFilterChange(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 ${
                isSelected
                  ? 'bg-[#17201d] text-white shadow-2xs'
                  : 'bg-white border border-[#dce5e1] text-[#66736e] hover:text-[#17201d] hover:bg-[#eef3f1]'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-[#eef3f1] text-[#66736e]'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
