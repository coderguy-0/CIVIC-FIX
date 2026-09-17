import React, { useState } from 'react';
import { ComplaintCategory, ComplaintStatus, IssueSeverity, SubmissionChannel } from '../../types';
import { CATEGORIES_META, POPULAR_CATEGORIES, INDIAN_STATES } from '../../lib/constants';
import { OFFICIAL_HELP_DIRECTORY } from '../../data/helpDirectory';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';
import {
  Check,
  ArrowLeft,
  ArrowRight,
  Lock,
  Calendar,
  ShieldCheck,
  MapPin,
  UploadCloud,
  FileText,
  Trash2,
  ExternalLink,
  Info,
  AlertCircle,
  Eye,
  EyeOff,
  Building2
} from 'lucide-react';

export interface ComplaintFormProps {
  onCancel: () => void;
  onSubmit: (data: any) => void;
  language?: 'en' | 'hi';
}

interface UploadedFilePreview {
  id: string;
  name: string;
  size: string;
  type: string;
  dataUrl: string;
}

const STEPS = [
  { num: 1, label: 'Problem' },
  { num: 2, label: 'Location' },
  { num: 3, label: 'Evidence' },
  { num: 4, label: 'Official Authority' },
  { num: 5, label: 'Complaint Tracking' },
  { num: 6, label: 'Public Sharing' },
  { num: 7, label: 'Review' }
];

export const ComplaintForm: React.FC<ComplaintFormProps> = ({
  onCancel,
  onSubmit,
  language = 'en'
}) => {
  const [step, setStep] = useState<number>(1);

  // Step 1: Problem
  const [category, setCategory] = useState<ComplaintCategory>('roads');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<IssueSeverity>('moderate');

  // Step 2: Location
  const [stateCode, setStateCode] = useState('DL');
  const [district, setDistrict] = useState('South Delhi');
  const [locality, setLocality] = useState('');
  const [landmark, setLandmark] = useState('');

  // Step 3: Evidence
  const [files, setFiles] = useState<UploadedFilePreview[]>([
    {
      id: 'mock-file-1',
      name: 'PHOTO_SITE_EVIDENCE_01.jpg',
      size: '1.8 MB',
      type: 'image/jpeg',
      dataUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80'
    }
  ]);

  // Step 4: Official Authority
  const [selectedAuthorityName, setSelectedAuthorityName] = useState('');

  // Step 5: Complaint Tracking
  const [isSubmitted, setIsSubmitted] = useState<'yes' | 'no'>('yes');
  const [officialReference, setOfficialReference] = useState('');
  const [submissionChannel, setSubmissionChannel] = useState<SubmissionChannel>('website');
  const [submissionDate, setSubmissionDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [authorityResponse, setAuthorityResponse] = useState('');
  const [nextFollowUpDate, setNextFollowUpDate] = useState(
    new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [nextFollowUpTime, setNextFollowUpTime] = useState('10:00');

  // Step 6: Public Sharing (Default OFF)
  const [isPublicSharing, setIsPublicSharing] = useState(false);
  const [publicTitle, setPublicTitle] = useState('');
  const [publicDescription, setPublicDescription] = useState('');

  // Validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Matched authority channel based on category & state
  const suggestedAuthority = OFFICIAL_HELP_DIRECTORY.find(
    a => (a.state_code === stateCode || a.state_code === 'ALL') && a.categories.includes(category)
  ) || OFFICIAL_HELP_DIRECTORY[0];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files;
    if (!uploaded || uploaded.length === 0) return;
    const newFiles: UploadedFilePreview[] = Array.from(uploaded).map((f: File, i) => ({
      id: `file-${Date.now()}-${i}`,
      name: f.name,
      size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
      type: f.type,
      dataUrl: URL.createObjectURL(f)
    }));
    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  // Next / Back Navigation
  const validateStep = (currentStep: number): boolean => {
    const errs: Record<string, string> = {};
    if (currentStep === 1) {
      if (!title.trim()) errs.title = 'Please enter what happened.';
      if (!description.trim()) errs.description = 'Please describe the problem.';
    }
    if (currentStep === 2) {
      if (!district.trim()) errs.district = 'District is required.';
      if (!locality.trim()) errs.locality = 'Locality is required.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(step)) return;

    // Prefill public sharing when moving to step 6
    if (step === 5 && !publicTitle) {
      setPublicTitle(title);
      setPublicDescription(description.substring(0, 160));
    }

    if (step < 7) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleFinalSubmit = () => {
    const selectedStateObj = INDIAN_STATES.find(s => s.code === stateCode);
    const stateName = selectedStateObj ? selectedStateObj.name : stateCode;

    const fullFollowUpStr =
      nextFollowUpDate && nextFollowUpTime
        ? `${nextFollowUpDate}T${nextFollowUpTime}:00`
        : nextFollowUpDate
        ? `${nextFollowUpDate}T10:00:00`
        : null;

    const initialStatus: ComplaintStatus =
      isSubmitted === 'yes' ? 'submitted' : 'prepared';

    const finalAuthority =
      selectedAuthorityName.trim() || suggestedAuthority.authority_name;

    const payload = {
      title: title.trim(),
      description: description.trim(),
      category,
      status: initialStatus,
      severity,
      state_code: stateCode,
      state_name: stateName,
      district: district.trim(),
      locality: locality.trim(),
      landmark: landmark.trim() || undefined,
      authority_name: finalAuthority,
      official_reference:
        isSubmitted === 'yes' && officialReference.trim()
          ? officialReference.trim()
          : undefined,
      official_portal_url: suggestedAuthority.portal_url,
      submission_channel: isSubmitted === 'yes' ? submissionChannel : undefined,
      authority_response: isSubmitted === 'yes' && authorityResponse.trim() ? authorityResponse.trim() : undefined,
      submitted_at: isSubmitted === 'yes' ? new Date(submissionDate).toISOString() : null,
      next_follow_up_at: fullFollowUpStr ? new Date(fullFollowUpStr).toISOString() : null,
      is_public_summary_shared: isPublicSharing,
      public_title: isPublicSharing ? (publicTitle.trim() || title.trim()) : undefined,
      public_description: isPublicSharing ? (publicDescription.trim() || description.trim()) : undefined,
      attachments: files.map(f => ({
        id: f.id,
        storage_path: `private/${f.name}`,
        original_name: f.name,
        mime_type: f.type,
        file_size_bytes: 1024 * 1024,
        data_url: f.dataUrl,
        created_at: new Date().toISOString()
      }))
    };

    onSubmit(payload);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      {/* Step Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#087f5b]">
              Step {step} of 7: {STEPS[step - 1].label}
            </span>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="text-xs text-[#66736e] hover:text-[#17201d] font-semibold"
          >
            Cancel
          </button>
        </div>

        {/* Progress pills */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {STEPS.map(s => (
            <div
              key={s.num}
              className={`h-1.5 rounded-full transition-all duration-200 ${
                s.num <= step ? 'bg-[#087f5b]' : 'bg-[#dce5e1]'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main Step Form Card */}
      <div className="bg-white border border-[#dce5e1] rounded-[20px] p-5 sm:p-7 shadow-xs">
        <form onSubmit={handleNext} className="space-y-6">
          {/* STEP 1: Problem */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <h2 className="text-xl font-extrabold text-[#17201d]">
                  1. Describe the Problem
                </h2>
                <p className="text-xs text-[#66736e] mt-1">
                  Specify the category, issue title, and description for your records.
                </p>
              </div>

              {/* Category Grid */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#17201d]">
                  Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {POPULAR_CATEGORIES.map(cat => {
                    const meta = CATEGORIES_META[cat.id] || CATEGORIES_META.other;
                    const isSelected = category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategory(cat.id)}
                        className={`p-3 rounded-xl border text-left text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-[#e7f7f1] border-[#087f5b] text-[#087f5b]'
                            : 'bg-[#f6f9f7] border-[#dce5e1] text-[#17201d] hover:border-[#66736e]/40'
                        }`}
                      >
                        {meta.labelEn}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title */}
              <Input
                label="Complaint Title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Hazardous deep pothole on Ring Road near flyover"
                error={errors.title}
                required
              />

              {/* Description */}
              <Textarea
                label="Detailed Description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Explain the civic hazard, exact road or streetlight number, duration of the issue..."
                rows={4}
                error={errors.description}
                required
              />

              {/* Severity (Low / Moderate / High for personal organization only) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#17201d]">
                  Severity (for personal organization only)
                </label>
                <p className="text-[11px] text-[#66736e]">
                  This is for your private task sorting and does not dictate municipal priority.
                </p>
                <div className="grid grid-cols-3 gap-2 pt-1">
                  {[
                    { id: 'low', label: 'Low', desc: 'Minor inconvenience' },
                    { id: 'moderate', label: 'Moderate', desc: 'Active disruption' },
                    { id: 'high', label: 'High', desc: 'Severe hazard / safety risk' }
                  ].map(lvl => (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => setSeverity(lvl.id as IssueSeverity)}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        severity === lvl.id
                          ? 'bg-[#17201d] text-white border-[#17201d]'
                          : 'bg-[#f6f9f7] border-[#dce5e1] text-[#17201d] hover:bg-[#eef3f1]'
                      }`}
                    >
                      <span className="block text-xs font-bold">{lvl.label}</span>
                      <span className={`block text-[10px] ${severity === lvl.id ? 'text-white/80' : 'text-[#66736e]'}`}>
                        {lvl.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Location */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <h2 className="text-xl font-extrabold text-[#17201d]">
                  2. Problem Location
                </h2>
                <p className="text-xs text-[#66736e] mt-1">
                  Specify where the municipal issue is physically located.
                </p>
              </div>

              {/* Privacy Warning Banner */}
              <div className="p-3.5 rounded-xl bg-[#fff7e6] border border-[#fbd38d] flex items-start gap-3 text-xs text-[#a96f16]">
                <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
                <p>
                  <strong>Privacy Rule:</strong> Do not enter your personal home or apartment address unless it is necessary for your complaint. Exact residence coordinates remain private.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="State / UT"
                  value={stateCode}
                  onChange={e => setStateCode(e.target.value)}
                  options={INDIAN_STATES.map(s => ({ value: s.code, label: s.name }))}
                />

                <Input
                  label="District"
                  value={district}
                  onChange={e => setDistrict(e.target.value)}
                  placeholder="e.g. South Delhi"
                  error={errors.district}
                  required
                />
              </div>

              <Input
                label="Locality / Sector / Neighborhood"
                value={locality}
                onChange={e => setLocality(e.target.value)}
                placeholder="e.g. Lajpat Nagar Ring Road, Near Pillar 32"
                error={errors.locality}
                required
              />

              <Input
                label="Landmark (Optional)"
                value={landmark}
                onChange={e => setLandmark(e.target.value)}
                placeholder="e.g. Opposite Metro Station Gate 2"
              />
            </div>
          )}

          {/* STEP 3: Evidence */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <h2 className="text-xl font-extrabold text-[#17201d]">
                  3. Evidence & Attachments
                </h2>
                <p className="text-xs text-[#66736e] mt-1">
                  Attach photos, screenshots, or official submission receipts.
                </p>
              </div>

              {/* Privacy Note */}
              <div className="p-3.5 rounded-xl bg-[#e7f7f1] border border-[#a3e3cb] flex items-start gap-3 text-xs text-[#087f5b]">
                <Lock className="w-4 h-4 shrink-0 mt-0.5" />
                <p>
                  <strong>Evidence is private by default:</strong> Attached photos and receipts are stored in your private local vault and never published without explicit consent.
                </p>
              </div>

              {/* Upload Dropzone */}
              <label className="border-2 border-dashed border-[#dce5e1] hover:border-[#087f5b] rounded-[16px] p-6 text-center block cursor-pointer bg-[#f6f9f7] hover:bg-[#eef3f1] transition-colors">
                <UploadCloud className="w-8 h-8 mx-auto text-[#087f5b] mb-2" />
                <span className="block text-xs font-bold text-[#17201d]">
                  Click to select photos or documents
                </span>
                <span className="block text-[11px] text-[#66736e] mt-0.5">
                  Supports JPG, PNG, PDF receipts up to 10MB
                </span>
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {/* File Cards */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#17201d] block">
                  Attached Files ({files.length})
                </span>
                {files.map(f => (
                  <div
                    key={f.id}
                    className="p-3 rounded-xl border border-[#dce5e1] bg-white flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FileText className="w-4 h-4 text-[#087f5b] shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#17201d] truncate">
                          {f.name}
                        </p>
                        <div className="flex items-center gap-2 text-[10px] text-[#66736e]">
                          <span>{f.size}</span>
                          <span className="inline-flex items-center gap-1 font-bold text-[#087f5b] bg-[#e7f7f1] px-1.5 py-0.2 rounded-md">
                            <Lock className="w-2.5 h-2.5" />
                            <span>Private</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFile(f.id)}
                      className="p-1 rounded-md text-[#66736e] hover:text-[#c0392b] hover:bg-[#fff0ee]"
                      title="Remove file"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Official Authority */}
          {step === 4 && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <h2 className="text-xl font-extrabold text-[#17201d]">
                  4. Suggested Official Authority
                </h2>
                <p className="text-xs text-[#66736e] mt-1">
                  Official reporting channel recommended for your category and jurisdiction.
                </p>
              </div>

              {/* Important disclaimer */}
              <div className="p-3.5 rounded-xl bg-[#f6f9f7] border border-[#dce5e1] flex items-start gap-3 text-xs text-[#66736e]">
                <Info className="w-4 h-4 text-[#087f5b] shrink-0 mt-0.5" />
                <p>
                  <strong>Notice:</strong> CivicFix is an independent citizen tracking tool. You submit complaints directly on the official portal and save the reference number here to manage follow-ups.
                </p>
              </div>

              {/* Suggested Authority Card */}
              <div className="p-4 rounded-xl border-2 border-[#087f5b]/30 bg-white space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase font-bold text-[#087f5b] bg-[#e7f7f1] px-2 py-0.5 rounded-md">
                      Suggested Channel
                    </span>
                    <h3 className="text-base font-bold text-[#17201d]">
                      {suggestedAuthority.authority_name}
                    </h3>
                    <p className="text-xs text-[#66736e]">
                      Jurisdiction: {suggestedAuthority.jurisdiction} • {suggestedAuthority.state_code}
                    </p>
                  </div>

                  <a
                    href={suggestedAuthority.portal_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#087f5b] bg-[#e7f7f1] px-3 py-1.5 rounded-xl hover:bg-[#d5f2e6] transition-colors"
                  >
                    <span>Open Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="pt-2 border-t border-[#dce5e1]/60 text-xs text-[#17201d] space-y-1">
                  <p>
                    <strong>Helpline:</strong> {suggestedAuthority.helpline}
                  </p>
                  {suggestedAuthority.notes && (
                    <p className="text-[#66736e]">{suggestedAuthority.notes}</p>
                  )}
                  <p className="text-[11px] text-[#66736e]">
                    Last verified: {suggestedAuthority.last_checked_date}
                  </p>
                </div>
              </div>

              {/* Override Authority Name if user filed elsewhere */}
              <Input
                label="Custom Authority Name (if different from suggested above)"
                value={selectedAuthorityName}
                onChange={e => setSelectedAuthorityName(e.target.value)}
                placeholder={suggestedAuthority.authority_name}
              />
            </div>
          )}

          {/* STEP 5: Complaint Tracking */}
          {step === 5 && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <h2 className="text-xl font-extrabold text-[#17201d]">
                  5. Complaint Tracking Information
                </h2>
                <p className="text-xs text-[#66736e] mt-1">
                  Record official ticket numbers and schedule your next follow-up.
                </p>
              </div>

              {/* Has it been submitted? */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#17201d]">
                  Have you already submitted this complaint to the authority?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setIsSubmitted('yes')}
                    className={`p-3 rounded-xl border text-center font-bold text-xs transition-all ${
                      isSubmitted === 'yes'
                        ? 'bg-[#087f5b] text-white border-[#087f5b]'
                        : 'bg-[#f6f9f7] border-[#dce5e1] text-[#17201d]'
                    }`}
                  >
                    Yes, I have submitted it
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsSubmitted('no')}
                    className={`p-3 rounded-xl border text-center font-bold text-xs transition-all ${
                      isSubmitted === 'no'
                        ? 'bg-[#087f5b] text-white border-[#087f5b]'
                        : 'bg-[#f6f9f7] border-[#dce5e1] text-[#17201d]'
                    }`}
                  >
                    No, saving as prepared draft
                  </button>
                </div>
              </div>

              {isSubmitted === 'yes' && (
                <div className="space-y-4 pt-2 border-t border-[#dce5e1]">
                  <Input
                    label="Official Reference / Token Number"
                    value={officialReference}
                    onChange={e => setOfficialReference(e.target.value)}
                    placeholder="e.g. MCD/2026/SZ/84920 or SMS Token"
                    hint="Stored privately in your encrypted browser storage."
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Select
                      label="Submission Channel"
                      value={submissionChannel}
                      onChange={e => setSubmissionChannel(e.target.value as SubmissionChannel)}
                      options={[
                        { value: 'website', label: 'Official Website Portal' },
                        { value: 'app', label: 'Mobile App (e.g. 311 / Swachhata)' },
                        { value: 'email', label: 'Email' },
                        { value: 'phone', label: 'Helpline / Phone Call' },
                        { value: 'in_person', label: 'In Person / Ward Office' },
                        { value: 'other', label: 'Other Channel' }
                      ]}
                    />

                    <Input
                      label="Submission Date"
                      type="date"
                      value={submissionDate}
                      onChange={e => setSubmissionDate(e.target.value)}
                    />
                  </div>

                  <Textarea
                    label="Authority Initial Response / Status (Optional)"
                    value={authorityResponse}
                    onChange={e => setAuthorityResponse(e.target.value)}
                    placeholder="e.g. SMS received: Assigned to Junior Engineer Ward 42 for site inspection"
                    rows={2}
                  />
                </div>
              )}

              {/* Follow-up schedule */}
              <div className="pt-2 border-t border-[#dce5e1] space-y-2">
                <label className="block text-xs font-bold text-[#17201d]">
                  Next Follow-up Reminder
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Follow-up Date"
                    type="date"
                    value={nextFollowUpDate}
                    onChange={e => setNextFollowUpDate(e.target.value)}
                  />
                  <Input
                    label="Reminder Time"
                    type="time"
                    value={nextFollowUpTime}
                    onChange={e => setNextFollowUpTime(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: Public Sharing (Default OFF) */}
          {step === 6 && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <h2 className="text-xl font-extrabold text-[#17201d]">
                  6. Community Corroboration & Public Sharing
                </h2>
                <p className="text-xs text-[#66736e] mt-1">
                  Optionally share a sanitized community summary to gather neighbor confirmations.
                </p>
              </div>

              {/* Strict Privacy Assurance Box */}
              <div className="p-4 rounded-xl bg-[#e7f7f1] border border-[#a3e3cb] space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#087f5b]">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Privacy Boundary Guarantee</span>
                </div>
                <p className="text-xs text-[#17201d]/80 leading-relaxed">
                  Your private complaint tracking records, private reference tokens, and evidence photos remain strictly confidential. Only a separate sanitized summary is submitted for volunteer review and public map display.
                </p>
              </div>

              {/* Toggle Checkbox (Default OFF) */}
              <div className="p-4 rounded-xl border border-[#dce5e1] bg-[#f6f9f7] space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPublicSharing}
                    onChange={e => setIsPublicSharing(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-[#087f5b] focus:ring-[#087f5b]"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#17201d] block">
                      Share a public summary of this issue
                    </span>
                    <span className="text-[11px] text-[#66736e] block mt-0.5">
                      Publish a moderated report so nearby residents can confirm the issue and build civic visibility.
                    </span>
                  </div>
                </label>

                {isPublicSharing && (
                  <div className="pt-3 border-t border-[#dce5e1] space-y-3 animate-in fade-in">
                    <Input
                      label="Public Title"
                      value={publicTitle}
                      onChange={e => setPublicTitle(e.target.value)}
                      placeholder="e.g. Pothole on Ring Road near Lajpat Nagar"
                    />

                    <Textarea
                      label="Public Summary"
                      value={publicDescription}
                      onChange={e => setPublicDescription(e.target.value)}
                      placeholder="Sanitized summary visible to neighbors without personal identification"
                      rows={3}
                    />

                    <p className="text-[11px] text-[#66736e]">
                      Approximate Location on Map: <strong className="text-[#17201d]">{locality}, {district}</strong>
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 7: Review */}
          {step === 7 && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <h2 className="text-xl font-extrabold text-[#17201d]">
                  7. Review Complaint Record
                </h2>
                <p className="text-xs text-[#66736e] mt-1">
                  Confirm your private record details before saving to your Civic Action Dashboard.
                </p>
              </div>

              <div className="space-y-3 text-xs bg-[#f6f9f7] p-5 rounded-[16px] border border-[#dce5e1]">
                <div className="flex items-center justify-between pb-3 border-b border-[#dce5e1]">
                  <span className="text-[#66736e] font-semibold">Category & Severity</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#087f5b] uppercase">{category}</span>
                    <span className="px-2 py-0.5 rounded-md bg-[#eef3f1] font-bold text-[#17201d] uppercase text-[10px]">
                      {severity}
                    </span>
                  </div>
                </div>

                <div className="pb-3 border-b border-[#dce5e1] space-y-1">
                  <span className="text-[#66736e] font-semibold block">Title</span>
                  <span className="font-bold text-sm text-[#17201d] block">{title}</span>
                  <p className="text-[#66736e]">{description}</p>
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-[#dce5e1]">
                  <span className="text-[#66736e] font-semibold">Location</span>
                  <span className="font-bold text-[#17201d]">
                    {locality}, {district}, {stateCode}
                  </span>
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-[#dce5e1]">
                  <span className="text-[#66736e] font-semibold">Official Authority</span>
                  <span className="font-bold text-[#17201d]">
                    {selectedAuthorityName || suggestedAuthority.authority_name}
                  </span>
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-[#dce5e1]">
                  <span className="text-[#66736e] font-semibold">Official Reference</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-[#17201d]">
                      {officialReference || 'Draft / Not yet assigned'}
                    </span>
                    <span className="text-[10px] text-[#087f5b] bg-[#e7f7f1] px-1.5 py-0.2 rounded font-bold">
                      Private
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-[#dce5e1]">
                  <span className="text-[#66736e] font-semibold">Evidence</span>
                  <span className="font-bold text-[#17201d]">{files.length} file(s) attached</span>
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-[#dce5e1]">
                  <span className="text-[#66736e] font-semibold">Next Follow-up</span>
                  <span className="font-bold text-[#a96f16]">
                    {nextFollowUpDate} at {nextFollowUpTime}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#66736e] font-semibold">Public Sharing</span>
                  <span className={`font-bold ${isPublicSharing ? 'text-[#087f5b]' : 'text-[#66736e]'}`}>
                    {isPublicSharing ? 'Enabled (Moderated Summary)' : 'Off (Strictly Private)'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Form Navigation Controls */}
          <div className="pt-4 border-t border-[#dce5e1] flex items-center justify-between">
            {step > 1 ? (
              <Button type="button" variant="secondary" onClick={handleBack} size="sm">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </Button>
            ) : (
              <Button type="button" variant="ghost" onClick={onCancel} size="sm">
                <span>Cancel</span>
              </Button>
            )}

            {step < 7 ? (
              <Button type="submit" variant="primary" size="sm">
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            ) : (
              <Button
                type="button"
                variant="primary"
                onClick={handleFinalSubmit}
                size="sm"
                className="bg-[#087f5b] hover:bg-[#066b4d]"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Complaint</span>
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
