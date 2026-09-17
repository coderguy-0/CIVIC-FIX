import React from 'react';
import { AlertCircle, CheckCircle2, Heart, Lock, Shield } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
  language: 'en' | 'hi';
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, language }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Independent Service Disclaimer Banner */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 mb-10 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            <span className="font-semibold text-white">
              {language === 'hi' ? 'स्वतंत्र नागरिक मंच अस्वीकरण:' : 'Independent Citizen Platform Disclaimer:'}
            </span>{' '}
            {language === 'hi'
              ? 'CivicFix एक स्वतंत्र नागरिक शिकायत ट्रैकर और साक्ष्य संकलन मंच है। CivicFix कोई सरकारी प्राधिकरण नहीं है। यह मंच शिकायतों को व्यवस्थित रखने, आधिकारिक पोर्टल खोजने और उनके समाधान की निगरानी में नागरिकों की सहायता करता है।'
              : 'CivicFix is an independent civic follow-up and follow-through utility. It is not an official government agency and does not guarantee resolution. Official filings and determinations remain within the statutory jurisdiction of respective municipal and state authorities.'}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Brand & Mission */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">CivicFix</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              “Spot a problem. Report it. Track the fix.”
              <br />
              {language === 'hi'
                ? 'भारतीय शहरों में रोजमर्रा की नागरिक समस्याओं के व्यवस्थित समाधान हेतु।'
                : "India's independent civic follow-up and follow-through tracker."}
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <Lock className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'गोपनीयता-प्रथम डिज़ाइन' : 'Privacy-First Architecture'}</span>
            </div>
          </div>

          {/* Col 2: Core Platform Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              {language === 'hi' ? 'मुख्य पृष्ठ' : 'Navigation'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  {language === 'hi' ? 'होम' : 'Home'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  {language === 'hi' ? 'मेरी शिकायतें व टाइमलाइन' : 'My Complaints & Tracker'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('new-complaint')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  {language === 'hi' ? 'नई समस्या दर्ज करें' : 'Track New Issue'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('explore')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  {language === 'hi' ? 'समुदायिक मैप व मुद्दे' : 'Community Issue Map'}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Civic Resources */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              {language === 'hi' ? 'सरकारी डायरेक्टरी' : 'Official Portals'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('help')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  CPGRAMS (National Grievances)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('help')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Swachhata-MoHUA (Sanitation & Lights)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('help')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  MCD 311 / BBMP / BMC Portals
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('help')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Highway Helpline 1033 (NHAI)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Privacy & DPDP */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              {language === 'hi' ? 'गोपनीयता व सुरक्षा' : 'Privacy & Trust'}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-start gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Reference IDs kept private to owner</span>
              </li>
              <li className="flex items-start gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Only approximate locality shared publicly</span>
              </li>
              <li className="flex items-start gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Pre-moderation against harassment & spam</span>
              </li>
              <li className="pt-1">
                <button
                  onClick={() => onNavigate('settings')}
                  className="text-emerald-400 hover:underline inline-flex items-center gap-1 font-medium"
                >
                  Data Export & Deletion Controls →
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <div>
            © 2026 CivicFix Prototype. Built for Indian civic empowerment.
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('settings')} className="hover:text-white">
              Data Protection
            </button>
            <span>•</span>
            <button onClick={() => onNavigate('admin')} className="hover:text-white">
              Moderation Log
            </button>
            <span>•</span>
            <span className="flex items-center gap-1 text-slate-400">
              ₹0 software budget startup prototype
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
