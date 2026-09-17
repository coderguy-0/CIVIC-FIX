import React, { useState, useMemo } from 'react';
import { PublicReport, ComplaintCategory } from '../types';
import { CATEGORIES_META } from '../lib/constants';
import {
  MapPin,
  Layers,
  Info,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Filter,
  Eye,
  Search,
  Compass
} from 'lucide-react';
import { Button } from './ui/Button';

export interface CivicMapViewProps {
  publicReports: PublicReport[];
  onNavigate: (view: string, complaintId?: string) => void;
  onOpenReportDetail?: (report: PublicReport) => void;
  language?: 'en' | 'hi';
}

const LAYER_CONFIG: { category: ComplaintCategory; label: string; color: string; bg: string }[] = [
  { category: 'roads', label: 'Roads & Potholes', color: '#c0392b', bg: '#fde8e8' },
  { category: 'sanitation', label: 'Garbage & Sanitation', color: '#d97706', bg: '#fef3c7' },
  { category: 'drainage', label: 'Drainage & Sewage', color: '#2563eb', bg: '#dbeafe' },
  { category: 'water', label: 'Water Supply', color: '#0284c7', bg: '#e0f2fe' },
  { category: 'street_lighting', label: 'Street Lighting', color: '#087f5b', bg: '#e7f7f1' },
  { category: 'electricity', label: 'Electricity & Power', color: '#7c3aed', bg: '#ede9fe' },
  { category: 'public_safety', label: 'Public Safety', color: '#dc2626', bg: '#fee2e2' }
];

export const CivicMapView: React.FC<CivicMapViewProps> = ({
  publicReports,
  onNavigate,
  onOpenReportDetail,
  language = 'en'
}) => {
  // Enabled category layers
  const [activeCategories, setActiveCategories] = useState<Set<ComplaintCategory>>(
    new Set(['roads', 'sanitation', 'drainage', 'water', 'street_lighting', 'electricity', 'public_safety'])
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReport, setSelectedReport] = useState<PublicReport | null>(null);

  const toggleCategory = (cat: ComplaintCategory) => {
    setActiveCategories(prev => {
      const next = new Set(prev);
      if (next.has(cat)) {
        if (next.size > 1) next.delete(cat);
      } else {
        next.add(cat);
      }
      return next;
    });
  };

  // Only approved public reports with approximate locations
  const approvedReports = useMemo(() => {
    return publicReports.filter(r => r.moderation_status === 'approved');
  }, [publicReports]);

  // Filtered by layer & search
  const visibleReports = useMemo(() => {
    return approvedReports.filter(r => {
      if (!activeCategories.has(r.category)) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = r.public_title.toLowerCase().includes(q);
        const matchLoc = r.approximate_location.toLowerCase().includes(q);
        return matchTitle || matchLoc;
      }
      return true;
    });
  }, [approvedReports, activeCategories, searchQuery]);

  // Approximate spatial coordinates mapping for visual simulation map
  // Delhi / NCR base anchor (28.5 to 28.7 lat, 77.1 to 77.3 lng)
  const getCoordinatesForReport = (report: PublicReport, index: number) => {
    if (report.latitude && report.longitude) {
      return { lat: report.latitude, lng: report.longitude };
    }
    // Deterministic spread based on index and id
    const seed = (report.id.charCodeAt(report.id.length - 1) || index) * 7;
    const baseLat = 28.58 + (seed % 15) * 0.015;
    const baseLng = 77.18 + ((seed * 3) % 15) * 0.018;
    return { lat: baseLat, lng: baseLng };
  };

  // Normalized % position on map canvas (500x380 px virtual bounds)
  const getPinPosition = (report: PublicReport, index: number) => {
    const { lat, lng } = getCoordinatesForReport(report, index);
    // Map bounding box: lat [28.50, 28.75], lng [77.10, 77.35]
    const minLat = 28.50;
    const maxLat = 28.75;
    const minLng = 77.10;
    const maxLng = 77.35;

    const x = Math.min(92, Math.max(8, ((lng - minLng) / (maxLng - minLng)) * 100));
    const y = Math.min(90, Math.max(10, 100 - ((lat - minLat) / (maxLat - minLat)) * 100));
    return { x, y };
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17201d] tracking-tight">
              Civic Map
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#e7f7f1] text-[#087f5b] border border-[#a3e3cb]">
              Neighborhood Grid
            </span>
          </div>
          <p className="text-sm text-[#66736e] mt-1">
            Browse approximate public issue locations across city sectors.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            onClick={() => onNavigate('new-complaint')}
            size="sm"
            className="text-xs"
          >
            <span>+ Report Issue</span>
          </Button>
        </div>
      </div>

      {/* Privacy Notice Banner */}
      <div className="p-3.5 rounded-xl bg-white border border-[#dce5e1] flex items-start sm:items-center gap-3 shadow-2xs">
        <ShieldCheck className="w-5 h-5 text-[#087f5b] shrink-0 mt-0.5 sm:mt-0" />
        <div className="text-xs text-[#66736e]">
          <strong className="text-[#17201d] font-bold">Privacy Protected:</strong> All map pins reflect approximate neighborhood sectors or public intersections. Personal residential addresses and private complaint references are never plotted on the map.
        </div>
      </div>

      {/* Main Map Container: Sidebar Controls + Interactive Map Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Layers & Filters (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#66736e] absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search locality or issue..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#dce5e1] bg-white focus:outline-none focus:ring-2 focus:ring-[#087f5b]"
            />
          </div>

          {/* Map Layers Card */}
          <div className="bg-white border border-[#dce5e1] rounded-[16px] p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#dce5e1]">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#087f5b]" />
                <span className="text-xs font-bold text-[#17201d] uppercase tracking-wider">
                  Map Layers
                </span>
              </div>
              <span className="text-[11px] text-[#66736e] font-semibold">
                {visibleReports.length} issues visible
              </span>
            </div>

            <div className="space-y-1.5">
              {LAYER_CONFIG.map(layer => {
                const isChecked = activeCategories.has(layer.category);
                const count = approvedReports.filter(r => r.category === layer.category).length;

                return (
                  <button
                    key={layer.category}
                    onClick={() => toggleCategory(layer.category)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors text-left ${
                      isChecked
                        ? 'bg-[#f6f9f7] text-[#17201d] border border-[#dce5e1]'
                        : 'bg-white text-[#66736e] opacity-60 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: layer.color }}
                      />
                      <span>{layer.label}</span>
                    </div>

                    <span className="text-[10px] px-1.5 py-0.5 rounded-md font-bold bg-[#eef3f1] text-[#66736e]">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Report Preview Card */}
          {selectedReport ? (
            <div className="bg-white border-2 border-[#087f5b] rounded-[16px] p-4 shadow-sm space-y-3 animate-in fade-in zoom-in-95">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] uppercase font-bold text-[#087f5b] bg-[#e7f7f1] px-2 py-0.5 rounded-md">
                  {CATEGORIES_META[selectedReport.category]?.labelEn || 'Public Issue'}
                </span>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="text-xs text-[#66736e] hover:text-[#17201d] font-bold"
                >
                  ✕
                </button>
              </div>

              <div>
                <h4 className="text-sm font-bold text-[#17201d] leading-snug">
                  {selectedReport.public_title}
                </h4>
                <p className="text-xs text-[#66736e] mt-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#087f5b] shrink-0" />
                  <span>{selectedReport.approximate_location}</span>
                </p>
              </div>

              <div className="pt-2 border-t border-[#dce5e1] flex items-center justify-between text-xs">
                <span className="text-[#66736e] font-medium">
                  {selectedReport.confirmations_count} neighbors confirmed
                </span>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    if (onOpenReportDetail) {
                      onOpenReportDetail(selectedReport);
                    } else {
                      onNavigate('explore');
                    }
                  }}
                  className="text-xs py-1"
                >
                  <span>View Details</span>
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-[#dce5e1] rounded-[16px] p-5 text-center text-xs text-[#66736e] space-y-1">
              <Compass className="w-6 h-6 mx-auto text-[#087f5b]/60 mb-2" />
              <p className="font-bold text-[#17201d]">Click any map pin</p>
              <p>Inspect public report details and community confirmations.</p>
            </div>
          )}
        </div>

        {/* Right Column: Visual Map Stage (8 cols) */}
        <div className="lg:col-span-8">
          <div className="bg-white border border-[#dce5e1] rounded-[20px] shadow-xs overflow-hidden">
            {/* Map Top Bar */}
            <div className="bg-[#f6f9f7] px-4 py-2.5 border-b border-[#dce5e1] flex items-center justify-between text-xs text-[#66736e]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#087f5b] animate-pulse" />
                <span className="font-semibold text-[#17201d]">Urban Civic Layer: Delhi NCR / South Zone</span>
              </div>
              <span className="font-mono text-[11px]">28.6139° N, 77.2090° E</span>
            </div>

            {/* Map Canvas with Sector Grid and Geographic Landmarks */}
            <div className="relative w-full h-[460px] sm:h-[520px] bg-[#edf2ef] overflow-hidden select-none">
              {/* Subtle Grid Lines simulating urban road network */}
              <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="civic-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#cfded6" strokeWidth="1" />
                  </pattern>
                  <pattern id="major-roads" width="160" height="160" patternUnits="userSpaceOnUse">
                    <path d="M 160 0 L 0 0 0 160" fill="none" stroke="#bacbc1" strokeWidth="2" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#civic-grid)" />
                <rect width="100%" height="100%" fill="url(#major-roads)" />

                {/* Simulated arterial roads */}
                <path d="M 0 140 Q 250 180, 500 130 T 900 200" fill="none" stroke="#a2b9ac" strokeWidth="6" opacity="0.6" />
                <path d="M 150 0 Q 200 250, 300 550" fill="none" stroke="#a2b9ac" strokeWidth="5" opacity="0.6" />
                <path d="M 450 0 Q 420 300, 600 550" fill="none" stroke="#a2b9ac" strokeWidth="4" opacity="0.5" />

                {/* Blue River / Water body canal simulation */}
                <path d="M 650 0 Q 600 200, 750 400 T 800 550" fill="none" stroke="#bae6fd" strokeWidth="18" opacity="0.7" />
              </svg>

              {/* Geographic Neighborhood Labels */}
              <div className="absolute top-10 left-12 text-[10px] font-bold text-[#66736e]/60 tracking-wider uppercase pointer-events-none">
                West District · Sector 4
              </div>
              <div className="absolute top-8 right-24 text-[10px] font-bold text-[#66736e]/60 tracking-wider uppercase pointer-events-none">
                Yamuna River Basin
              </div>
              <div className="absolute bottom-12 left-16 text-[10px] font-bold text-[#66736e]/60 tracking-wider uppercase pointer-events-none">
                South Outer Ring Rd
              </div>
              <div className="absolute bottom-16 right-16 text-[10px] font-bold text-[#66736e]/60 tracking-wider uppercase pointer-events-none">
                Okhla Ind Area
              </div>

              {/* Plotted Interactive Pins */}
              {visibleReports.map((report, idx) => {
                const pos = getPinPosition(report, idx);
                const isSelected = selectedReport?.id === report.id;
                const layer = LAYER_CONFIG.find(l => l.category === report.category) || LAYER_CONFIG[0];

                return (
                  <div
                    key={report.id}
                    style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-20 transition-transform duration-200"
                  >
                    <button
                      onClick={() => setSelectedReport(report)}
                      className={`group relative flex items-center justify-center rounded-full transition-all focus:outline-none ${
                        isSelected
                          ? 'ring-4 ring-white shadow-lg scale-125 z-30'
                          : 'hover:scale-115 hover:z-25'
                      }`}
                      style={{
                        backgroundColor: layer.color,
                        width: isSelected ? '34px' : '28px',
                        height: isSelected ? '34px' : '28px'
                      }}
                      title={`${report.public_title} (${report.approximate_location})`}
                    >
                      <MapPin className="w-4 h-4 text-white drop-shadow-xs" />

                      {/* Tooltip on hover */}
                      <span className="absolute bottom-full mb-2 hidden group-hover:block z-40 bg-[#17201d] text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg whitespace-nowrap shadow-md pointer-events-none">
                        {report.public_title.length > 32
                          ? report.public_title.substring(0, 32) + '...'
                          : report.public_title}
                        <span className="block text-[9px] text-[#a3e3cb] font-normal">
                          {report.approximate_location}
                        </span>
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Map Legend Footer */}
            <div className="px-4 py-3 bg-white border-t border-[#dce5e1] flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-[#66736e] font-semibold text-[11px]">Legend:</span>
                {LAYER_CONFIG.slice(0, 5).map(l => (
                  <div key={l.category} className="flex items-center gap-1.5 text-[11px] text-[#17201d]">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: l.color }} />
                    <span>{l.label}</span>
                  </div>
                ))}
              </div>

              <span className="text-[11px] text-[#66736e]">
                Click any pin to inspect verified community status.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
