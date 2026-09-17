import React, { useState } from 'react';
import { OfficialHelpChannel } from '../../types';
import { CATEGORIES_META } from '../../lib/constants';
import { ExternalLink, Phone, MessageCircle, Clock, ShieldCheck, Bookmark } from 'lucide-react';
import { Button } from '../ui/Button';
import { isItemSaved, toggleSavedItem } from '../../lib/storage';

export interface HelpDirectoryCardProps {
  channel: OfficialHelpChannel;
  className?: string;
  onBookmarkToggled?: () => void;
}

export const HelpDirectoryCard: React.FC<HelpDirectoryCardProps> = ({
  channel,
  className = '',
  onBookmarkToggled
}) => {
  const [saved, setSaved] = useState(() => isItemSaved(channel.id, 'channel'));

  const handleToggleSave = () => {
    const isNowSaved = toggleSavedItem({
      id: `save-ch-${channel.id}`,
      type: 'channel',
      item_id: channel.id,
      title: channel.authority_name,
      category: channel.jurisdiction || 'Grievance',
      subtitle: channel.notes || channel.description,
      url: channel.portal_url,
      created_at: new Date().toISOString()
    });
    setSaved(isNowSaved);
    if (onBookmarkToggled) onBookmarkToggled();
  };

  return (
    <div
      className={`bg-white border border-[#dce5e1] rounded-[16px] p-5 shadow-2xs hover:shadow-xs transition-all duration-150 flex flex-col justify-between space-y-4 ${className}`}
    >
      <div className="space-y-3">
        {/* Jurisdiction & Verification Tag */}
        <div className="flex items-start justify-between gap-2">
          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#eef3f1] text-[#66736e]">
            {channel.jurisdiction || 'Civic'} • {channel.state_code}
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-[#087f5b] font-semibold bg-[#e7f7f1] px-2 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              <span>Verified {channel.last_checked_date}</span>
            </span>
            <button
              onClick={handleToggleSave}
              className={`p-1 rounded-lg border transition-colors ${
                saved
                  ? 'bg-[#e7f7f1] border-[#a3e3cb] text-[#087f5b]'
                  : 'bg-white border-[#dce5e1] text-[#66736e] hover:text-[#17201d]'
              }`}
              title={saved ? 'Remove bookmark' : 'Bookmark channel'}
            >
              <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Title and Description */}
        <div>
          <h3 className="text-base font-bold text-[#17201d] leading-snug">
            {channel.authority_name}
          </h3>
          <p className="text-xs text-[#66736e] mt-1 line-clamp-2 leading-relaxed">
            {channel.notes || channel.description}
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-1">
          {channel.categories.map(cat => (
            <span
              key={cat}
              className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#f6f9f7] text-[#66736e] border border-[#dce5e1]"
            >
              {CATEGORIES_META[cat]?.labelEn || cat}
            </span>
          ))}
        </div>

        {/* Contact numbers */}
        <div className="space-y-1.5 text-xs text-[#17201d] pt-2 border-t border-[#dce5e1]/60">
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-[#087f5b] shrink-0" />
            <span className="font-semibold">Helpline:</span>
            <span>{channel.helpline}</span>
          </div>

          {(channel.whatsapp_grievance || channel.whatsapp) && (
            <div className="flex items-center gap-2">
              <MessageCircle className="w-3.5 h-3.5 text-[#087f5b] shrink-0" />
              <span className="font-semibold">WhatsApp:</span>
              <span>{channel.whatsapp_grievance || channel.whatsapp}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action link */}
      <div className="pt-3 border-t border-[#dce5e1]/60">
        <a
          href={channel.portal_url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center font-semibold rounded-xl text-xs px-3.5 py-2 gap-2 bg-[#087f5b] text-white hover:bg-[#066b4d] transition-colors"
        >
          <span>Visit official portal</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
