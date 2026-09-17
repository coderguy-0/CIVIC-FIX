import { ComplaintCategory, ComplaintStatus, SourceLabel } from '../types';

export interface CategoryMeta {
  key: ComplaintCategory;
  labelEn: string;
  labelHi: string;
  iconName: string;
  colorBg: string;
  colorText: string;
  colorBorder: string;
  description: string;
}

export const CATEGORIES_META: Record<ComplaintCategory, CategoryMeta> = {
  roads: {
    key: 'roads',
    labelEn: 'Roads & Potholes',
    labelHi: 'सड़कें और गड्ढे',
    iconName: 'Construction',
    colorBg: 'bg-amber-50',
    colorText: 'text-amber-800',
    colorBorder: 'border-amber-200',
    description: 'Potholes, broken asphalt, missing manhole covers, speed bumps'
  },
  sanitation: {
    key: 'sanitation',
    labelEn: 'Sanitation & Waste',
    labelHi: 'सफाई और कचरा',
    iconName: 'Trash2',
    colorBg: 'bg-emerald-50',
    colorText: 'text-emerald-800',
    colorBorder: 'border-emerald-200',
    description: 'Overflowing dumpsters, uncollected garbage, open dumping'
  },
  street_lighting: {
    key: 'street_lighting',
    labelEn: 'Street Lighting',
    labelHi: 'स्ट्रीट लाइट',
    iconName: 'Lightbulb',
    colorBg: 'bg-yellow-50',
    colorText: 'text-yellow-800',
    colorBorder: 'border-yellow-200',
    description: 'Defective streetlights, dark roads, broken timer sensors'
  },
  water: {
    key: 'water',
    labelEn: 'Water Supply',
    labelHi: 'पेयजल आपूर्ति',
    iconName: 'Droplets',
    colorBg: 'bg-sky-50',
    colorText: 'text-sky-800',
    colorBorder: 'border-sky-200',
    description: 'Pipeline leakage, low pressure, contaminated water supply'
  },
  drainage: {
    key: 'drainage',
    labelEn: 'Drainage & Sewage',
    labelHi: 'जल निकासी व सीवर',
    iconName: 'Waves',
    colorBg: 'bg-cyan-50',
    colorText: 'text-cyan-800',
    colorBorder: 'border-cyan-200',
    description: 'Blocked storm drains, waterlogging, open sewer lines'
  },
  electricity: {
    key: 'electricity',
    labelEn: 'Electricity & Cables',
    labelHi: 'बिजली व केबल',
    iconName: 'Zap',
    colorBg: 'bg-purple-50',
    colorText: 'text-purple-800',
    colorBorder: 'border-purple-200',
    description: 'Hanging wires, damaged feeder boxes, transformer sparks'
  },
  public_safety: {
    key: 'public_safety',
    labelEn: 'Public Safety',
    labelHi: 'सार्वजनिक सुरक्षा',
    iconName: 'ShieldAlert',
    colorBg: 'bg-rose-50',
    colorText: 'text-rose-800',
    colorBorder: 'border-rose-200',
    description: 'Dangerous construction, encroachments, broken footpaths'
  },
  other: {
    key: 'other',
    labelEn: 'Other Civic Issue',
    labelHi: 'अन्य नागरिक समस्या',
    iconName: 'HelpCircle',
    colorBg: 'bg-slate-100',
    colorText: 'text-slate-800',
    colorBorder: 'border-slate-200',
    description: 'Park maintenance, stray animals, noise, civic amenities'
  }
};

export interface StatusMeta {
  key: ComplaintStatus;
  labelEn: string;
  labelHi: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  description: string;
}

export const STATUS_META: Record<ComplaintStatus, StatusMeta> = {
  draft: {
    key: 'draft',
    labelEn: 'Draft',
    labelHi: 'ड्राफ्ट',
    badgeBg: 'bg-slate-100',
    badgeText: 'text-slate-700',
    badgeBorder: 'border-slate-200',
    description: 'Preparing your complaint record.'
  },
  prepared: {
    key: 'prepared',
    labelEn: 'Ready to Submit',
    labelHi: 'दाखिल हेतु तैयार',
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-700',
    badgeBorder: 'border-blue-200',
    description: 'Details saved. Ready to file with official department.'
  },
  submitted: {
    key: 'submitted',
    labelEn: 'Submitted to Authority',
    labelHi: 'विभाग में दर्ज',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-800',
    badgeBorder: 'border-amber-200',
    description: 'Recorded filing with official channel.'
  },
  acknowledged: {
    key: 'acknowledged',
    labelEn: 'Acknowledged',
    labelHi: 'स्वीकृत / टोकन प्राप्त',
    badgeBg: 'bg-indigo-50',
    badgeText: 'text-indigo-700',
    badgeBorder: 'border-indigo-200',
    description: 'Official token generated or official confirmation received.'
  },
  in_progress: {
    key: 'in_progress',
    labelEn: 'In Progress',
    labelHi: 'कार्रवाई जारी',
    badgeBg: 'bg-orange-50',
    badgeText: 'text-orange-800',
    badgeBorder: 'border-orange-200',
    description: 'Inspection or repair work actively underway.'
  },
  resolved: {
    key: 'resolved',
    labelEn: 'Resolved & Verified',
    labelHi: 'समाधान संपन्न',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-800',
    badgeBorder: 'border-emerald-200',
    description: 'Repair completed and verified on site.'
  },
  reopened: {
    key: 'reopened',
    labelEn: 'Reopened',
    labelHi: 'पुनः खोला गया',
    badgeBg: 'bg-rose-50',
    badgeText: 'text-rose-800',
    badgeBorder: 'border-rose-200',
    description: 'Issue recurred or previous fix was inadequate.'
  },
  closed: {
    key: 'closed',
    labelEn: 'Closed',
    labelHi: 'बंद',
    badgeBg: 'bg-slate-100',
    badgeText: 'text-slate-600',
    badgeBorder: 'border-slate-200',
    description: 'Tracking completed.'
  }
};

export const SOURCE_LABELS_META: Record<SourceLabel, { label: string; bg: string; text: string }> = {
  'User reported': { label: 'User Reported', bg: 'bg-slate-100', text: 'text-slate-700' },
  'Document attached': { label: 'Document Attached', bg: 'bg-sky-100', text: 'text-sky-800' },
  'Community confirmed': { label: 'Community Confirmed', bg: 'bg-teal-100', text: 'text-teal-800' },
  'Official source linked': { label: 'Official Source Linked', bg: 'bg-purple-100', text: 'text-purple-800' },
  'Official integration': { label: 'Official Integration', bg: 'bg-emerald-100', text: 'text-emerald-800' }
};

export const INDIAN_STATES: { code: string; name: string }[] = [
  { code: 'DL', name: 'Delhi' },
  { code: 'KA', name: 'Karnataka' },
  { code: 'MH', name: 'Maharashtra' },
  { code: 'TN', name: 'Tamil Nadu' },
  { code: 'TS', name: 'Telangana' },
  { code: 'UP', name: 'Uttar Pradesh' },
  { code: 'HR', name: 'Haryana' },
  { code: 'WB', name: 'West Bengal' },
  { code: 'GJ', name: 'Gujarat' },
  { code: 'RJ', name: 'Rajasthan' },
  { code: 'MP', name: 'Madhya Pradesh' },
  { code: 'KL', name: 'Kerala' },
  { code: 'AP', name: 'Andhra Pradesh' },
  { code: 'PB', name: 'Punjab' },
  { code: 'BR', name: 'Bihar' },
  { code: 'OD', name: 'Odisha' },
  { code: 'AS', name: 'Assam' },
  { code: 'JH', name: 'Jharkhand' },
  { code: 'CT', name: 'Chhattisgarh' },
  { code: 'UK', name: 'Uttarakhand' },
  { code: 'GA', name: 'Goa' },
  { code: 'HP', name: 'Himachal Pradesh' },
  { code: 'JK', name: 'Jammu & Kashmir' },
  { code: 'CH', name: 'Chandigarh' }
];

export const POPULAR_CATEGORIES: { id: ComplaintCategory; label: string }[] = [
  { id: 'roads', label: 'Roads & Potholes' },
  { id: 'street_lighting', label: 'Street Lighting' },
  { id: 'sanitation', label: 'Sanitation & Waste' },
  { id: 'water', label: 'Water Supply' },
  { id: 'drainage', label: 'Drainage & Sewage' },
  { id: 'electricity', label: 'Electricity & Cables' },
  { id: 'public_safety', label: 'Public Safety' }
];

