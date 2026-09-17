import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Award,
  Bell,
  CheckCircle2,
  ChevronRight,
  Clock,
  Compass,
  FileCheck,
  FileText,
  HelpCircle,
  Lightbulb,
  Lock,
  MapPin,
  Shield,
  Sparkles,
  Trash2,
  Users,
  Wrench
} from 'lucide-react';
import { Complaint, PublicReport } from '../types';

interface HomeViewProps {
  onNavigate: (view: string, complaintId?: string) => void;
  complaints: Complaint[];
  publicReports: PublicReport[];
  language: 'en' | 'hi';
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  complaints,
  publicReports,
  language
}) => {
  const [activeStepTab, setActiveStepTab] = useState(0);

  const proofSteps = [
    {
      num: '01',
      titleEn: 'Spot It',
      titleHi: 'समस्या पहचानें',
      summaryEn: 'Document the problem with an approximate location and photo.',
      summaryHi: 'समस्या का फोटो लें और सामान्य क्षेत्र अंकित करें।',
      icon: MapPin,
      detailEn:
        'Upload a picture of the broken streetlight, pothole, or waste pile. Pick an approximate neighborhood—your home address is never exposed.',
      badgeEn: 'Privacy Guaranteed'
    },
    {
      num: '02',
      titleEn: 'Verify It',
      titleHi: 'सत्यापित करें',
      summaryEn: 'Check for existing reports and community confirmations nearby.',
      summaryHi: 'जांचें कि क्या अन्य पड़ोसियों ने भी इसे दर्ज किया है।',
      icon: Users,
      detailEn:
        'CivicFix shows similar reports in your locality so multiple neighbors can upvote and corroborate the ongoing issue rather than filing disjointed duplicates.',
      badgeEn: 'Anti-Spam Filter'
    },
    {
      num: '03',
      titleEn: 'Find the Right Channel',
      titleHi: 'सही विभाग खोजें',
      summaryEn: 'Instant match with verified government portals & helplines.',
      summaryHi: 'सत्यापित सरकारी पोर्टल, ऐप या हेल्पलाइन तुरंत खोजें।',
      icon: Compass,
      detailEn:
        'Unsure whether to report to MCD, BBMP, PWD, DJB, or Swachhata? Our verified directory recommends the exact official portal, WhatsApp helpline, and SLA guidelines.',
      badgeEn: 'Verified Directory'
    },
    {
      num: '04',
      titleEn: 'Track Progress',
      titleHi: 'प्रगति ट्रैक करें',
      summaryEn: 'Save reference numbers privately and set follow-up reminders.',
      summaryHi: 'टोकन नंबर सुरक्षित रखें और फॉलो-अप रिमाइंडर सेट करें।',
      icon: Clock,
      detailEn:
        'Save your 14-digit official ticket number securely (private to you). Set a smart 7-day reminder to follow up if no municipal crew arrives.',
      badgeEn: 'Private Reference'
    },
    {
      num: '05',
      titleEn: 'Confirm Outcome',
      titleHi: 'निवारण की पुष्टि',
      summaryEn: 'Verify with after-repair photos and clear evidence labels.',
      summaryHi: 'मरम्मत के बाद का फोटो लगाकर निष्पक्ष साक्ष्य दर्ज करें।',
      icon: FileCheck,
      detailEn:
        'CivicFix separates mere claims from real fixes. Mark the issue resolved only when real evidence exists, or reopen the case if the repair was substandard.',
      badgeEn: 'Proof-to-Progress'
    }
  ];

  // Stats calculation
  const approvedReports = publicReports.filter(r => r.moderation_status === 'approved');
  const roadIssues = approvedReports.filter(r => r.category === 'roads').length;
  const wasteReports = approvedReports.filter(r => r.category === 'sanitation').length;
  const lightReports = approvedReports.filter(r => r.category === 'street_lighting').length;
  const waterReports = approvedReports.filter(r => r.category === 'water' || r.category === 'drainage').length;

  return (
    <div className="min-h-screen bg-[#f8faf9] text-slate-900">
      {/* Top Banner: Independent service reminder */}
      <div className="bg-emerald-900 text-emerald-100 text-xs py-2 px-4 text-center font-medium border-b border-emerald-800">
        <span className="inline-flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-emerald-300" />
          {language === 'hi'
            ? 'CivicFix: स्वतंत्र नागरिक ट्रैकिंग मंच — आधिकारिक पोर्टल पर शिकायत दर्ज करने व अनुवर्ती कार्रवाई में आपकी सहायता करता है।'
            : 'CivicFix: An independent civic companion tool to navigate reporting, organize follow-ups, and verify outcomes.'}
        </span>
      </div>

      {/* Hero Section */}
      <section className="relative pt-12 pb-16 lg:pt-16 lg:pb-20 border-b border-slate-200 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.07] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200/80 text-emerald-800 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                {language === 'hi' ? 'भारतीय शहरों के लिए समर्पित' : 'Dedicated to Better Indian Neighborhoods'}
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
                {language === 'hi' ? (
                  <>
                    समस्या पहचानें। दर्ज करें।{' '}
                    <span className="text-emerald-700">समाधान तक ट्रैक करें।</span>
                  </>
                ) : (
                  <>
                    Spot a problem. Report it.{' '}
                    <span className="text-emerald-700">Track the fix.</span>
                  </>
                )}
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                {language === 'hi'
                  ? 'सड़क के गड्ढे, कचरा, बंद स्ट्रीट लाइट या लीकेज? CivicFix आपको सही सरकारी विभाग खोजने, कंप्लेंट टोकन सुरक्षित रखने और समय पर फॉलो-अप करने में मदद करता है।'
                  : 'Potholes, overflowing garbage, broken streetlights, or drainage overflow? CivicFix helps residents document local problems, navigate official channels, and track what happens next without false promises.'}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <button
                  id="hero-track-btn"
                  onClick={() => onNavigate('new-complaint')}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-3 rounded-xl text-base font-semibold shadow-sm transition-all hover:shadow-md flex items-center gap-2"
                >
                  <Wrench className="w-4 h-4 stroke-[2.5]" />
                  {language === 'hi' ? 'समस्या ट्रैक करें' : 'Track a Complaint'}
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  id="hero-explore-btn"
                  onClick={() => onNavigate('explore')}
                  className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 px-5 py-3 rounded-xl text-base font-semibold transition-colors flex items-center gap-2 shadow-xs"
                >
                  <Compass className="w-4 h-4 text-emerald-700" />
                  {language === 'hi' ? 'समुदायिक मुद्दे देखें' : 'Explore Community Issues'}
                </button>

                <button
                  id="hero-dashboard-btn"
                  onClick={() => onNavigate('dashboard')}
                  className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-emerald-800 underline underline-offset-4 py-2 px-1"
                >
                  {language === 'hi' ? 'मेरी शिकायतें देखें →' : 'View My Tracker Dashboard →'}
                </button>
              </div>

              {/* Key Trust Signals */}
              <div className="grid grid-cols-3 gap-3 pt-6 border-t border-slate-200/80 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>
                    <strong>Private</strong> Reference IDs
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>
                    <strong>Verified</strong> Official Links
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>
                    <strong>Proof</strong> Based Progress
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Quick Action Preview Card (As requested in design blueprint) */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 relative">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                      CivicFix Prototype
                    </span>
                    <h2 className="text-base font-bold text-slate-900">
                      {language === 'hi' ? 'सामूहिक नागरिक डैशबोर्ड' : 'Community Issues Snapshot'}
                    </h2>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                    Illustrative Data
                  </span>
                </div>

                {/* Metric grid */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-100">
                    <span className="text-2xl font-extrabold text-amber-900 block leading-tight">
                      {Math.max(12, roadIssues + 9)}
                    </span>
                    <span className="text-xs font-semibold text-amber-800">
                      {language === 'hi' ? 'सड़क व गड्ढे की रिपोर्ट' : 'Road & Pothole Issues'}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-100">
                    <span className="text-2xl font-extrabold text-emerald-900 block leading-tight">
                      {Math.max(8, wasteReports + 6)}
                    </span>
                    <span className="text-xs font-semibold text-emerald-800">
                      {language === 'hi' ? 'कचरा व सफाई रिपोर्ट' : 'Waste & Sanitation'}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-yellow-50/70 border border-yellow-100">
                    <span className="text-2xl font-extrabold text-yellow-900 block leading-tight">
                      {Math.max(7, lightReports + 5)}
                    </span>
                    <span className="text-xs font-semibold text-yellow-800">
                      {language === 'hi' ? 'स्ट्रीट लाइट मुद्दे' : 'Lighting Failures'}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-sky-50/70 border border-sky-100">
                    <span className="text-2xl font-extrabold text-sky-900 block leading-tight">
                      {Math.max(9, waterReports + 5)}
                    </span>
                    <span className="text-xs font-semibold text-sky-800">
                      {language === 'hi' ? 'जल व जल निकासी' : 'Water & Drain Leaks'}
                    </span>
                  </div>
                </div>

                {/* Live mini showcase */}
                <div className="space-y-2.5 mb-5">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-start justify-between gap-3 text-xs">
                    <div>
                      <span className="font-semibold text-slate-800 block">
                        Ring Road Pothole (South Delhi)
                      </span>
                      <span className="text-slate-500">MCD 311 Ref #MCD/2026/SZ • In Progress</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-orange-100 text-orange-800 font-semibold text-[10px]">
                      Follow-up in 2d
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-start justify-between gap-3 text-xs">
                    <div>
                      <span className="font-semibold text-slate-800 block">
                        New Link Road Lights (Mumbai)
                      </span>
                      <span className="text-slate-500">BMC Ref #BMC-LT • Repaired & Verified</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold text-[10px]">
                      Verified Fix
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('explore')}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  {language === 'hi' ? 'सार्वजनिक मैप ब्राउज़ करें' : 'Explore Community Map & Issues'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The "Proof-to-Progress" System (Core Innovation from blueprint) */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
              The Unique Innovation
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3 tracking-tight">
              {language === 'hi' ? 'प्रूफ-टू-प्रोग्रेस प्रणाली' : 'The “Proof-to-Progress” System'}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2">
              {language === 'hi'
                ? 'अधिकांश मंच केवल शिकायत दर्ज करने पर रुक जाते हैं। CivicFix शिकायत दर्ज करने के बाद क्या होता है, उस पर केंद्रित है।'
                : 'Many civic platforms focus on submitting complaints. CivicFix focuses on what happens after someone notices a problem.'}
            </p>
          </div>

          {/* Interactive Steps Showcase */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-8">
            {proofSteps.map((step, idx) => {
              const Icon = step.icon;
              const isSelected = activeStepTab === idx;
              return (
                <button
                  key={step.num}
                  onClick={() => setActiveStepTab(idx)}
                  className={`p-4 rounded-xl text-left border transition-all relative ${
                    isSelected
                      ? 'bg-emerald-50/80 border-emerald-300 shadow-xs ring-1 ring-emerald-500'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100/80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold text-emerald-800">{step.num}</span>
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-700' : 'text-slate-400'}`} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">
                    {language === 'hi' ? step.titleHi : step.titleEn}
                  </h3>
                  <p className="text-[11px] text-slate-500 line-clamp-2">
                    {language === 'hi' ? step.summaryHi : step.summaryEn}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Expanded Step Detail Card */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-700 text-white">
                  Step {proofSteps[activeStepTab].num}
                </span>
                <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                  {proofSteps[activeStepTab].badgeEn}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                {language === 'hi'
                  ? proofSteps[activeStepTab].titleHi
                  : proofSteps[activeStepTab].titleEn}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {proofSteps[activeStepTab].detailEn}
              </p>
            </div>

            <button
              onClick={() => onNavigate('new-complaint')}
              className="bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2.5 rounded-xl text-xs font-semibold shrink-0 flex items-center gap-2 transition-colors"
            >
              <span>{language === 'hi' ? 'अभी आज़माएं' : 'Try this in CivicFix'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* "What Should I Do Next?" - Actionable Resident Guide */}
      <section className="py-16 bg-[#f8faf9] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {language === 'hi' ? '“अब मुझे क्या करना चाहिए?”' : '“What should I do next?”'}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2">
              {language === 'hi'
                ? 'जब भी आप किसी नागरिक समस्या का सामना करें, CivicFix आपको इन 6 स्पष्ट चरणों में मार्गदर्शन देता है:'
                : 'After someone notices a civic issue, CivicFix guides them through a clear, actionable checklist:'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm mb-3">
                1
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                {language === 'hi' ? 'समस्या स्पष्ट लिखें' : 'Describe the issue clearly'}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Mention specific street landmarks, metro pillars, or house numbers. Upload a clear photograph showing the actual hazard.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm mb-3">
                2
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                {language === 'hi' ? 'सही विभाग खोजें' : 'Find relevant official channel'}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Use our verified Help Directory to find whether it falls under your Municipal Corporation, Jal Board, Discom, or National Highway.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm mb-3">
                3
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                {language === 'hi' ? 'पोर्टल पर सीधे दर्ज करें' : 'Submit through official portal'}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                File on the official government website or WhatsApp helpline directly. CivicFix does not pose as a middleman or government authority.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm mb-3">
                4
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                {language === 'hi' ? 'टोकन नंबर सुरक्षित रखें' : 'Save reference number privately'}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Record your official complaint acknowledgement ID in your private CivicFix tracker so it is never misplaced or lost in SMS threads.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm mb-3">
                5
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                {language === 'hi' ? 'फॉलो-अप रिमाइंडर सेट करें' : 'Set a follow-up reminder'}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Schedule a 3, 7, or 14-day reminder. CivicFix alerts you to inspect the site and follow up with the assigned junior engineer.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm mb-3">
                6
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                {language === 'hi' ? 'साक्ष्य सहित पुष्टि करें' : 'Record evidence & verified outcome'}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Capture the resolved site photo. If the problem persists or was superficially patched, record an escalation or reopen event.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What Makes It Different: 5 Tiers of Verified Record */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded">
                Distinction & Transparency
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {language === 'hi' ? 'CivicFix अलग क्यों है?' : 'What makes CivicFix different?'}
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                The core idea is a community-maintained issue history that strictly separates claims from independently verified outcomes. We never claim a complaint is resolved without real evidence.
              </p>

              <div className="pt-2">
                <button
                  onClick={() => onNavigate('help')}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
                >
                  <Compass className="w-4 h-4" />
                  Browse verified authority reporting directories →
                </button>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-3">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">1. Reported Problems</h4>
                  <p className="text-xs text-slate-500">
                    A resident spots a local problem and records details and photos in their private tracker.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">2. Reports Supported by Multiple Residents</h4>
                  <p className="text-xs text-slate-500">
                    Neighbors living in the same vicinity confirm the issue still exists, adding community weight without duplicate noise.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">3. Complaints Submitted to an Authority</h4>
                  <p className="text-xs text-slate-500">
                    The resident files directly on the government portal (e.g. MCD 311, BBMP Sahaaya, Swachhata) and saves the private reference code.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">4. Officially Acknowledged Cases</h4>
                  <p className="text-xs text-slate-500">
                    Official acknowledgement SMS, engineer visit, or tracking status updates received from the municipal department.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-emerald-900">5. Outcomes Supported by Evidence</h4>
                  <p className="text-xs text-emerald-700">
                    Before/After photographs, community verification, or inspection sign-off. Clearly distinguished from unverified claims.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ready to Start CTA */}
      <section className="py-14 bg-emerald-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {language === 'hi'
              ? 'आइए अपने मोहल्ले और शहर को बेहतर बनाएं'
              : 'Let’s improve our neighborhood together'}
          </h2>
          <p className="text-emerald-100 text-sm max-w-xl mx-auto">
            {language === 'hi'
              ? 'एक साधारण समस्या दर्ज करने में 2 मिनट से भी कम समय लगता है। कोई विज्ञापन नहीं, कोई शुल्क नहीं।'
              : 'Keep your complaints organized, never miss a follow-up, and hold public infrastructure to verified outcomes.'}
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('new-complaint')}
              className="bg-white hover:bg-emerald-50 text-emerald-900 px-6 py-3 rounded-xl text-sm font-bold shadow-md transition-colors flex items-center gap-2"
            >
              <Wrench className="w-4 h-4 stroke-[2.5]" />
              {language === 'hi' ? 'नई शिकायत दर्ज करें' : 'Track Your First Issue'}
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className="bg-emerald-900/80 hover:bg-emerald-900 text-white border border-emerald-600 px-5 py-3 rounded-xl text-sm font-semibold transition-colors"
            >
              {language === 'hi' ? 'डैशबोर्ड खोलें' : 'Open My Tracker'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
