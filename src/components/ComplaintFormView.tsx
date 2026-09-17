import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  Bell,
  Camera,
  CheckCircle2,
  Compass,
  FileText,
  Info,
  Lock,
  MapPin,
  Shield,
  Upload,
  Wrench,
  X
} from 'lucide-react';
import { Complaint, ComplaintCategory, ComplaintStatus } from '../types';
import { CATEGORIES_META } from '../lib/constants';
import { OFFICIAL_HELP_DIRECTORY, POPULAR_INDIAN_CITIES } from '../data/helpDirectory';

interface ComplaintFormViewProps {
  onNavigate: (view: string, complaintId?: string) => void;
  onSubmitComplaint: (data: any) => Complaint;
  language: 'en' | 'hi';
}

export const ComplaintFormView: React.FC<ComplaintFormViewProps> = ({
  onNavigate,
  onSubmitComplaint,
  language
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ComplaintCategory>('roads');
  const [description, setDescription] = useState('');

  // Location fields
  const [selectedCity, setSelectedCity] = useState<string>('Delhi NCT');
  const [locality, setLocality] = useState('');
  const [district, setDistrict] = useState('South Delhi');
  const [stateCode, setStateCode] = useState('DL');
  const [stateName, setStateName] = useState('Delhi');

  // Authority & Reference
  const [authorityName, setAuthorityName] = useState('');
  const [officialReference, setOfficialReference] = useState('');
  const [officialPortalUrl, setOfficialPortalUrl] = useState('');
  const [status, setStatus] = useState<ComplaintStatus>('prepared');
  const [initialEventNote, setInitialEventNote] = useState('');

  // Reminder
  const [reminderDays, setReminderDays] = useState<number>(7);

  // Photo
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoMeta, setPhotoMeta] = useState<{ name: string; type: string; size: number } | null>(null);

  // Public summary consent
  const [isPublicShared, setIsPublicShared] = useState(false);

  // Error validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-suggest official authority when category or state changes
  const matchedAuthorities = OFFICIAL_HELP_DIRECTORY.filter(
    auth =>
      (auth.state_code === stateCode || auth.state_code === 'ALL') &&
      auth.categories.includes(category)
  );

  const handleCityChange = (cityName: string) => {
    setSelectedCity(cityName);
    const found = POPULAR_INDIAN_CITIES.find(c => c.name === cityName);
    if (found) {
      setStateCode(found.stateCode);
      if (found.stateCode === 'DL') {
        setStateName('Delhi');
        setDistrict('South Delhi');
      } else if (found.stateCode === 'KA') {
        setStateName('Karnataka');
        setDistrict('Bengaluru Urban');
      } else if (found.stateCode === 'MH') {
        setStateName('Maharashtra');
        setDistrict('Mumbai');
      } else if (found.stateCode === 'TS') {
        setStateName('Telangana');
        setDistrict('Hyderabad');
      } else if (found.stateCode === 'TN') {
        setStateName('Tamil Nadu');
        setDistrict('Chennai');
      } else if (found.stateCode === 'UP') {
        setStateName('Uttar Pradesh');
        setDistrict('Gautam Buddha Nagar');
      }
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Photo size exceeds 5MB limit.');
      return;
    }

    setPhotoMeta({
      name: file.name,
      type: file.type,
      size: file.size
    });

    const reader = new FileReader();
    reader.onload = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleQuickMatchAuthority = (auth: typeof matchedAuthorities[0]) => {
    setAuthorityName(auth.authority_name);
    setOfficialPortalUrl(auth.portal_url);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!title.trim() || title.length < 3) {
      newErrors.title = 'Please enter a clear title (at least 3 characters)';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const payload = {
      user_id: 'user-default',
      title: title.trim(),
      description: description.trim(),
      category,
      status,
      authority_name: authorityName.trim() || undefined,
      official_reference: officialReference.trim() || undefined,
      official_portal_url: officialPortalUrl.trim() || undefined,
      state_code: stateCode,
      state_name: stateName,
      district: district.trim() || undefined,
      locality: locality.trim() || undefined,
      initial_event_note: initialEventNote.trim() || undefined,
      reminder_days: reminderDays > 0 ? reminderDays : undefined,
      is_public_summary_shared: isPublicShared,
      photo_file: photoPreview && photoMeta ? { ...photoMeta, data_url: photoPreview } : undefined
    };

    const created = onSubmitComplaint(payload);
    onNavigate('complaint-detail', created.id);
  };

  return (
    <div className="min-h-screen bg-[#f8faf9] py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Navigation back */}
        <div className="mb-6">
          <button
            onClick={() => onNavigate('dashboard')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{language === 'hi' ? 'डैशबोर्ड पर वापस जाएं' : 'Back to Dashboard'}</span>
          </button>
        </div>

        {/* Header */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 mb-6">
          <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Wrench className="w-4 h-4" />
            <span>Civic Action Intake</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {language === 'hi' ? 'नागरिक समस्या दर्ज करें' : 'Record a Neighborhood Problem'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {language === 'hi'
              ? 'समस्या की जानकारी सहेजें, संबंधित सरकारी विभाग खोजें, और फॉलो-अप रिमाइंडर सेट करें।'
              : 'Document the issue, find the official reporting channel, and set your private tracking follow-up.'}
          </p>

          <div className="mt-4 p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-start gap-2.5 text-xs text-emerald-900">
            <Lock className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Private by default:</span> Your official reference codes, notes, and exact identity are strictly private to your tracker. Only optional, generalized summaries are shared if you explicitly choose.
            </div>
          </div>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Issue Details */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-extrabold">
                1
              </span>
              <span>{language === 'hi' ? 'समस्या का विवरण' : 'Issue Details'}</span>
            </h2>

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Issue Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={e => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors({ ...errors, title: '' });
                }}
                placeholder="e.g. Dangerous 2-foot pothole on Outer Ring Road near Pillar 45"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all"
              />
              {errors.title && <p className="text-xs text-rose-600 mt-1">{errors.title}</p>}
            </div>

            {/* Category Select */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Problem Category <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(Object.keys(CATEGORIES_META) as ComplaintCategory[]).map(catKey => {
                  const cat = CATEGORIES_META[catKey];
                  const isSelected = category === catKey;
                  return (
                    <button
                      type="button"
                      key={catKey}
                      onClick={() => setCategory(catKey)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500 text-emerald-950 font-semibold'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100/70'
                      }`}
                    >
                      <div className="text-xs font-bold leading-tight">{cat.labelEn}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{cat.labelHi}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Detailed Description (Optional)
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe the severity, duration, and whether it poses a hazard to pedestrians, traffic, or public health..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Section 2: Location Information */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-extrabold">
                2
              </span>
              <span>{language === 'hi' ? 'स्थान व क्षेत्र' : 'Approximate Location'}</span>
            </h2>

            <p className="text-xs text-slate-500">
              No exact GPS coordinates or private home numbers are required. Enter your general locality or nearest landmark.
            </p>

            {/* City Preset */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                City / Region Preset
              </label>
              <select
                value={selectedCity}
                onChange={e => handleCityChange(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              >
                {POPULAR_INDIAN_CITIES.map(c => (
                  <option key={c.name} value={c.name}>
                    {c.name} ({c.stateCode})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Locality / Landmark / Ward
                </label>
                <input
                  type="text"
                  value={locality}
                  onChange={e => setLocality(e.target.value)}
                  placeholder="e.g. Sector 14 Main Road, near Community Center"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  District / Municipal Zone
                </label>
                <input
                  type="text"
                  value={district}
                  onChange={e => setDistrict(e.target.value)}
                  placeholder="e.g. South Delhi / Zone 3"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Official Channel Finder & Reference Token */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-extrabold">
                3
              </span>
              <span>{language === 'hi' ? 'सरकारी विभाग व टोकन' : 'Official Channel & Reference'}</span>
            </h2>

            {/* Smart Suggested Authorities */}
            {matchedAuthorities.length > 0 && (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-emerald-700" />
                  Recommended official channels for this issue:
                </span>
                <div className="space-y-1.5">
                  {matchedAuthorities.slice(0, 3).map(auth => (
                    <div
                      key={auth.id}
                      className="p-2.5 rounded-lg bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                    >
                      <div>
                        <span className="font-semibold text-slate-900 block">
                          {auth.authority_name}
                        </span>
                        <span className="text-slate-500">
                          Helpline: {auth.helpline} • Last verified: {auth.last_checked_date}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <a
                          href={auth.portal_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-700 hover:underline font-semibold"
                        >
                          Visit Portal ↗
                        </a>
                        <button
                          type="button"
                          onClick={() => handleQuickMatchAuthority(auth)}
                          className="px-2.5 py-1 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-semibold"
                        >
                          Use Channel
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Authority Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Responsible Authority / Department
                </label>
                <input
                  type="text"
                  value={authorityName}
                  onChange={e => setAuthorityName(e.target.value)}
                  placeholder="e.g. Municipal Corporation of Delhi (MCD 311)"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Official Portal / App Link (Optional)
                </label>
                <input
                  type="url"
                  value={officialPortalUrl}
                  onChange={e => setOfficialPortalUrl(e.target.value)}
                  placeholder="https://mcdonline.nic.in"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>

            {/* Official Complaint Reference Token (Private) */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-900">
                  Official Complaint Reference / Ticket ID
                </label>
                <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  Private to you only
                </span>
              </div>
              <input
                type="text"
                value={officialReference}
                onChange={e => setOfficialReference(e.target.value)}
                placeholder="e.g. MCD/2026/SZ/84920 or SWA-118290"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm font-mono font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
              <p className="text-[11px] text-slate-500">
                If you already received an SMS token from the authority, record it here. If you haven't filed yet, you can leave it blank and add it later!
              </p>
            </div>

            {/* Initial Status */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Current Status
              </label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as ComplaintStatus)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              >
                <option value="draft">Draft (Planning report)</option>
                <option value="prepared">Ready to Submit to Authority</option>
                <option value="submitted">Already Submitted on Government Portal</option>
                <option value="acknowledged">Acknowledged by Department</option>
                <option value="in_progress">Work In Progress</option>
              </select>
            </div>
          </div>

          {/* Section 4: Photo Attachment & Reminder */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-extrabold">
                4
              </span>
              <span>{language === 'hi' ? 'फोटो साक्ष्य व रिमाइंडर' : 'Photo Evidence & Reminders'}</span>
            </h2>

            {/* Photo upload */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Attach Photo Evidence (Optional)
              </label>
              {photoPreview ? (
                <div className="relative inline-block border border-slate-200 rounded-xl overflow-hidden bg-slate-100">
                  <img
                    src={photoPreview}
                    alt="Uploaded evidence preview"
                    className="w-48 h-32 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPhotoPreview(null);
                      setPhotoMeta(null);
                    }}
                    className="absolute top-2 right-2 p-1 bg-slate-900/80 text-white rounded-full hover:bg-rose-600 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <label className="border-2 border-dashed border-slate-200 hover:border-emerald-500 rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer bg-slate-50 hover:bg-emerald-50/40 transition-colors">
                  <Camera className="w-6 h-6 text-slate-400 mb-1.5" />
                  <span className="text-xs font-semibold text-slate-700">
                    Click to upload photo or drag & drop
                  </span>
                  <span className="text-[11px] text-slate-400 mt-0.5">JPG, PNG up to 5MB</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Reminder timing */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <label className="block text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-emerald-700" />
                Schedule Follow-up Reminder
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { days: 3, label: '3 days (Urgent sanitation / cable)' },
                  { days: 7, label: '7 days (Standard municipal SLA)' },
                  { days: 14, label: '14 days (Potholes / road repair)' },
                  { days: 0, label: 'No reminder' }
                ].map(opt => (
                  <button
                    type="button"
                    key={opt.days}
                    onClick={() => setReminderDays(opt.days)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      reminderDays === opt.days
                        ? 'bg-emerald-700 text-white border-emerald-700 font-semibold'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 5: Public Summary Opt-In (Privacy-Centric) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-extrabold">
                5
              </span>
              <span>{language === 'hi' ? 'सामुदायिक साक्ष्य शेयरिंग' : 'Community Sharing (Optional)'}</span>
            </h2>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <input
                type="checkbox"
                id="public-summary-opt-in"
                checked={isPublicShared}
                onChange={e => setIsPublicShared(e.target.checked)}
                className="mt-1 w-4 h-4 text-emerald-700 rounded border-slate-300 focus:ring-emerald-600"
              />
              <label htmlFor="public-summary-opt-in" className="text-xs text-slate-700 leading-relaxed cursor-pointer">
                <span className="font-bold text-slate-900 block mb-0.5">
                  Share an anonymous, moderated summary to the Community Issues map
                </span>
                Allows nearby neighbors to see that this problem is reported and confirm it exists.
                <br />
                <span className="text-slate-500">
                  🔒 <strong>Privacy Guarantee:</strong> Your name, phone number, private reference code, and exact street address will <strong>never</strong> be published. All public posts go through our moderation queue first.
                </span>
              </label>
            </div>
          </div>

          {/* Action Submission */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              id="submit-complaint-btn"
              className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-sm transition-colors flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save & Open Tracking Timeline</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
