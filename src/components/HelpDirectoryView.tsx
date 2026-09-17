import React, { useState } from 'react';
import { OFFICIAL_HELP_DIRECTORY } from '../data/helpDirectory';
import { HelpDirectoryCard } from './public/HelpDirectoryCard';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Button } from './ui/Button';
import { EmptyState } from './ui/EmptyState';
import { INDIAN_STATES, POPULAR_CATEGORIES } from '../lib/constants';
import { Search, HelpCircle, Shield, ExternalLink, Phone } from 'lucide-react';

export interface HelpDirectoryViewProps {
  onNavigate: (view: string) => void;
  language?: 'en' | 'hi';
}

export const HelpDirectoryView: React.FC<HelpDirectoryViewProps> = ({
  onNavigate,
  language = 'en'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredDirectory = OFFICIAL_HELP_DIRECTORY.filter(item => {
    if (selectedState !== 'ALL' && item.state_code !== 'ALL' && item.state_code !== selectedState) {
      return false;
    }
    if (
      selectedCategory !== 'all' &&
      !item.categories.includes(selectedCategory as any)
    ) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.authority_name.toLowerCase().includes(q);
      const matchNotes = (item.notes || '').toLowerCase().includes(q);
      const matchJuris = (item.jurisdiction || '').toLowerCase().includes(q);
      if (!matchName && !matchNotes && !matchJuris) return false;
    }
    return true;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17201d] tracking-tight">
          Find the right reporting channel
        </h1>
        <p className="text-sm text-[#66736e] mt-0.5">
          Verified government grievance portals, official hotlines, and citizen charters across India.
        </p>
      </div>

      {/* Search and State Filter */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="flex-1 w-full">
          <Input
            placeholder="Search for a civic service (e.g., CPGRAMS, MCD, Water Board)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        <div className="w-full sm:w-60 shrink-0">
          <Select
            value={selectedState}
            onChange={e => setSelectedState(e.target.value)}
            options={[
              { value: 'ALL', label: 'All India / National' },
              ...INDIAN_STATES.map(s => ({ value: s.code, label: s.name }))
            ]}
          />
        </div>
      </div>

      {/* Popular Chips */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-[#66736e]">Popular categories:</span>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-colors shrink-0 ${
              selectedCategory === 'all'
                ? 'bg-[#17201d] text-white'
                : 'bg-white border border-[#dce5e1] text-[#66736e] hover:bg-[#eef3f1]'
            }`}
          >
            All
          </button>
          {POPULAR_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
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

      {/* Results Grid */}
      {filteredDirectory.length === 0 ? (
        <EmptyState
          icon={<HelpCircle className="w-6 h-6" />}
          title="No reporting channels matched your query."
          description="Try selecting 'All India' or clearing search keywords."
          action={
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setSelectedState('ALL');
                setSelectedCategory('all');
              }}
            >
              Reset filters
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDirectory.map(channel => (
            <HelpDirectoryCard key={channel.id} channel={channel} />
          ))}
        </div>
      )}
    </div>
  );
};
