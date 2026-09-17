import React from 'react';
import { Home, FileText, Plus, Clock, Compass } from 'lucide-react';

export interface MobileNavProps {
  currentView: string;
  onNavigate: (view: string) => void;
  followUpsCount?: number;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentView,
  onNavigate,
  followUpsCount = 0
}) => {
  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#dce5e1] px-2 py-1 flex items-center justify-around shadow-lg safe-area-bottom"
      aria-label="Mobile Navigation"
    >
      {/* Home */}
      <button
        onClick={() => onNavigate('dashboard')}
        className={`flex flex-col items-center justify-center p-1.5 min-w-[54px] text-[10px] font-semibold transition-colors ${
          currentView === 'dashboard' || currentView === 'home'
            ? 'text-[#087f5b]'
            : 'text-[#66736e] hover:text-[#17201d]'
        }`}
      >
        <Home className="w-5 h-5 mb-0.5" />
        <span>Home</span>
      </button>

      {/* Complaints */}
      <button
        onClick={() => onNavigate('complaints')}
        className={`flex flex-col items-center justify-center p-1.5 min-w-[54px] text-[10px] font-semibold transition-colors ${
          currentView === 'complaints' || currentView === 'complaint-detail'
            ? 'text-[#087f5b]'
            : 'text-[#66736e] hover:text-[#17201d]'
        }`}
      >
        <FileText className="w-5 h-5 mb-0.5" />
        <span>Complaints</span>
      </button>

      {/* Prominent Center + Button */}
      <div className="relative -top-3">
        <button
          onClick={() => onNavigate('new-complaint')}
          className="w-12 h-12 rounded-full bg-[#087f5b] text-white flex items-center justify-center shadow-md hover:bg-[#066b4d] active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-[#087f5b]/30"
          aria-label="New complaint"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>
      </div>

      {/* Follow-ups */}
      <button
        onClick={() => onNavigate('follow-ups')}
        className={`relative flex flex-col items-center justify-center p-1.5 min-w-[54px] text-[10px] font-semibold transition-colors ${
          currentView === 'follow-ups' ? 'text-[#087f5b]' : 'text-[#66736e] hover:text-[#17201d]'
        }`}
      >
        <div className="relative">
          <Clock className="w-5 h-5 mb-0.5" />
          {followUpsCount > 0 && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#a96f16]" />
          )}
        </div>
        <span>Follow-ups</span>
      </button>

      {/* Explore */}
      <button
        onClick={() => onNavigate('explore')}
        className={`flex flex-col items-center justify-center p-1.5 min-w-[54px] text-[10px] font-semibold transition-colors ${
          currentView === 'explore' ? 'text-[#087f5b]' : 'text-[#66736e] hover:text-[#17201d]'
        }`}
      >
        <Compass className="w-5 h-5 mb-0.5" />
        <span>Explore</span>
      </button>
    </nav>
  );
};
