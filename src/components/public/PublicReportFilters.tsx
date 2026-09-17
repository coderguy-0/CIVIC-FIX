import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { INDIAN_STATES, POPULAR_CATEGORIES } from '../../lib/constants';

export interface PublicReportFiltersProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedState: string;
  onStateChange: (s: string) => void;
  selectedCategory: string;
  onCategoryChange: (c: string) => void;
}

export const PublicReportFilters: React.FC<PublicReportFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedState,
  onStateChange,
  selectedCategory,
  onCategoryChange
}) => {
  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="flex-1 w-full">
          <Input
            placeholder="Search public community issues..."
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        <div className="w-full sm:w-56 shrink-0">
          <Select
            value={selectedState}
            onChange={e => onStateChange(e.target.value)}
            options={[{ value: 'ALL', label: 'All India' }, ...INDIAN_STATES.map(s => ({ value: s.code, label: s.name }))]}
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        <button
          onClick={() => onCategoryChange('all')}
          className={`px-3 py-1.5 rounded-xl font-semibold transition-colors shrink-0 ${
            selectedCategory === 'all'
              ? 'bg-[#17201d] text-white'
              : 'bg-white border border-[#dce5e1] text-[#66736e] hover:bg-[#eef3f1]'
          }`}
        >
          All categories
        </button>
        {POPULAR_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-colors shrink-0 ${
              selectedCategory === cat.id
                ? 'bg-[#17201d] text-white'
                : 'bg-white border border-[#dce5e1] text-[#66736e] hover:bg-[#eef3f1]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
};
