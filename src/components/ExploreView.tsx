import React, { useState, useEffect, useRef } from 'react';
import { PublicReport } from '../types';
import { PublicReportCard } from './public/PublicReportCard';
import { PublicReportFilters } from './public/PublicReportFilters';
import { PublicReportDetailModal } from './public/PublicReportDetailModal';
import { EmptyState } from './ui/EmptyState';
import { Button } from './ui/Button';
import { CATEGORIES_META } from '../lib/constants';
import { Map, Grid, AlertCircle, Compass, Info } from 'lucide-react';
import L from 'leaflet';

export interface ExploreViewProps {
  publicReports: PublicReport[];
  onToggleConfirmation: (reportId: string) => void;
  onNavigate: (view: string, id?: string) => void;
  language?: 'en' | 'hi';
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  publicReports,
  onToggleConfirmation,
  onNavigate,
  language = 'en'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'cards' | 'map'>('cards');
  const [selectedReport, setSelectedReport] = useState<PublicReport | null>(null);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  // Only approved reports appear on public explore
  const approvedReports = publicReports.filter(r => r.moderation_status === 'approved');

  // Filter
  const filteredReports = approvedReports.filter(report => {
    if (selectedState !== 'ALL' && report.state_code && report.state_code !== selectedState) {
      return false;
    }
    if (selectedCategory !== 'all' && report.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = report.public_title.toLowerCase().includes(q);
      const matchLoc = report.approximate_location.toLowerCase().includes(q);
      const matchDesc = report.public_description.toLowerCase().includes(q);
      if (!matchTitle && !matchLoc && !matchDesc) return false;
    }
    return true;
  });

  // Setup Leaflet map when switched to 'map'
  useEffect(() => {
    if (viewMode !== 'map' || !mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current).setView([22.5, 78.9], 5);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18
      }).addTo(map);
      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear old markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    const bounds: L.LatLngExpression[] = [];

    filteredReports.forEach(r => {
      if (r.latitude && r.longitude) {
        const marker = L.marker([r.latitude, r.longitude]).addTo(map);
        marker.bindPopup(`
          <div style="font-family: inherit; padding: 4px; max-width: 220px;">
            <p style="margin: 0; font-size: 10px; font-weight: bold; text-transform: uppercase; color: #087f5b;">
              ${CATEGORIES_META[r.category]?.labelEn || r.category}
            </p>
            <h4 style="margin: 3px 0; font-size: 12px; font-weight: bold; color: #17201d;">
              ${r.public_title}
            </h4>
            <p style="margin: 0; font-size: 11px; color: #66736e;">
              ${r.approximate_location}
            </p>
            <p style="margin: 4px 0 0 0; font-size: 10px; font-weight: 600; color: #087f5b;">
              👍 ${r.confirmations_count} confirmations
            </p>
          </div>
        `);
        marker.on('click', () => setSelectedReport(r));
        markersRef.current.push(marker);
        bounds.push([r.latitude, r.longitude]);
      }
    });

    if (bounds.length > 0) {
      map.fitBounds(L.latLngBounds(bounds), { padding: [40, 40], maxZoom: 14 });
    }

    return () => {
      // Keep map instance alive during brief rerenders
    };
  }, [viewMode, filteredReports]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17201d] tracking-tight">
            Explore community issues
          </h1>
          <p className="text-sm text-[#66736e] mt-0.5">
            Public summaries shared by CivicFix users.
          </p>
        </div>

        {/* View Toggle (Grid / Map) */}
        <div className="flex items-center gap-1 bg-white border border-[#dce5e1] p-1 rounded-xl shrink-0">
          <button
            onClick={() => setViewMode('cards')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              viewMode === 'cards'
                ? 'bg-[#17201d] text-white'
                : 'text-[#66736e] hover:text-[#17201d]'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Cards</span>
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              viewMode === 'map'
                ? 'bg-[#17201d] text-white'
                : 'text-[#66736e] hover:text-[#17201d]'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            <span>Map</span>
          </button>
        </div>
      </div>

      {/* Independent Platform Disclaimer Banner */}
      <div className="bg-[#edf5ff] border border-[#2563a6]/20 rounded-[16px] p-4 flex items-start gap-3 text-xs text-[#2563a6]">
        <Info className="w-4 h-4 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block">CivicFix Independence & Anti-Spam Notice:</span>
          <span>
            These summaries are user-contributed and pre-moderated to protect privacy. Community confirmations reflect citizen observation and do not imply official department verification.
          </span>
        </div>
      </div>

      {/* Filters */}
      <PublicReportFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedState={selectedState}
        onStateChange={setSelectedState}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* Content based on View Mode */}
      {viewMode === 'cards' ? (
        filteredReports.length === 0 ? (
          <EmptyState
            icon={<Compass className="w-6 h-6" />}
            title="No public issues found."
            description="Try a different category or area, or clear your search terms."
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
            {filteredReports.map(report => (
              <PublicReportCard
                key={report.id}
                report={report}
                onView={r => setSelectedReport(r)}
                onConfirm={id => onToggleConfirmation(id)}
              />
            ))}
          </div>
        )
      ) : (
        <div className="bg-white rounded-[16px] border border-[#dce5e1] overflow-hidden h-[500px] shadow-2xs relative">
          <div ref={mapContainerRef} className="w-full h-full" />
        </div>
      )}

      {/* Report Detail Modal */}
      <PublicReportDetailModal
        isOpen={!!selectedReport}
        onClose={() => setSelectedReport(null)}
        report={selectedReport}
        onConfirmIssue={id => {
          onToggleConfirmation(id);
          if (selectedReport && selectedReport.id === id) {
            setSelectedReport({
              ...selectedReport,
              user_confirmed: !selectedReport.user_confirmed,
              confirmations_count: selectedReport.user_confirmed
                ? selectedReport.confirmations_count - 1
                : selectedReport.confirmations_count + 1
            });
          }
        }}
      />
    </div>
  );
};
