import React, { useState, useEffect } from 'react';
import { SavedItem } from '../types';
import { getStoredSavedItems, saveStoredSavedItems } from '../lib/storage';
import { Button } from './ui/Button';
import {
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  Trash2,
  Building2,
  FileText,
  BookOpen,
  ArrowRight
} from 'lucide-react';

export interface SavedViewProps {
  onNavigate: (view: string, complaintId?: string) => void;
  language?: 'en' | 'hi';
}

export const SavedView: React.FC<SavedViewProps> = ({ onNavigate, language = 'en' }) => {
  const [items, setItems] = useState<SavedItem[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'channel' | 'report' | 'resource'>('all');

  useEffect(() => {
    setItems(getStoredSavedItems());
  }, []);

  const handleRemove = (itemId: string, itemType: string) => {
    const updated = items.filter(i => !(i.item_id === itemId && i.type === itemType));
    setItems(updated);
    saveStoredSavedItems(updated);
  };

  const filtered = items.filter(i => {
    if (activeTab === 'all') return true;
    return i.type === activeTab;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'channel':
        return <Building2 className="w-4 h-4 text-[#087f5b]" />;
      case 'report':
        return <FileText className="w-4 h-4 text-[#2563eb]" />;
      case 'resource':
        return <BookOpen className="w-4 h-4 text-[#a96f16]" />;
      default:
        return <Bookmark className="w-4 h-4 text-[#66736e]" />;
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17201d] tracking-tight">
            Saved Items
          </h1>
          <p className="text-sm text-[#66736e] mt-1">
            Bookmarked official channels, public community reports, and civic resources.
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => onNavigate('help')}
          className="text-xs self-start sm:self-auto"
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Browse Help Directory</span>
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#dce5e1] pb-2 overflow-x-auto">
        {[
          { id: 'all', label: 'All' },
          { id: 'channel', label: 'Official Channels' },
          { id: 'report', label: 'Public Reports' },
          { id: 'resource', label: 'Civic Resources' }
        ].map(tab => {
          const count = tab.id === 'all' ? items.length : items.filter(i => i.type === tab.id).length;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-[#087f5b] text-white'
                  : 'text-[#66736e] hover:bg-[#eef3f1] hover:text-[#17201d]'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-[#eef3f1] text-[#66736e]'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Items list */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-[16px] border border-[#dce5e1] p-8 text-center space-y-3 shadow-2xs">
          <Bookmark className="w-8 h-8 mx-auto text-[#66736e]/40" />
          <h3 className="text-sm font-bold text-[#17201d]">No saved items in this view</h3>
          <p className="text-xs text-[#66736e] max-w-sm mx-auto">
            Bookmark official helpline numbers or complaint portals from the Help Directory for quick 1-click access.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map(item => (
            <div
              key={`${item.type}-${item.item_id}`}
              className="bg-white border border-[#dce5e1] rounded-[16px] p-4.5 shadow-2xs flex flex-col justify-between gap-3 hover:border-[#66736e]/40 transition-colors"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {getIcon(item.type)}
                    <span className="text-[10px] uppercase font-bold text-[#66736e]">
                      {item.category || item.type}
                    </span>
                  </div>
                  <button
                    onClick={() => handleRemove(item.item_id, item.type)}
                    className="text-[#66736e] hover:text-[#c0392b] p-1 transition-colors"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h3 className="text-sm font-bold text-[#17201d] leading-snug">
                  {item.title}
                </h3>

                {item.subtitle && (
                  <p className="text-xs text-[#66736e] line-clamp-2">
                    {item.subtitle}
                  </p>
                )}
              </div>

              <div className="pt-2 border-t border-[#dce5e1]/60 flex items-center justify-between">
                <span className="text-[10px] text-[#66736e]">
                  Saved {new Date(item.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                </span>

                {item.url ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#087f5b] hover:underline"
                  >
                    <span>Open Official Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <button
                    onClick={() => onNavigate(item.type === 'report' ? 'explore' : 'help')}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#087f5b] hover:underline"
                  >
                    <span>View Detail</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
