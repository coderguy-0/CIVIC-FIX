import React from 'react';
import { User, ShieldCheck, Mail, Phone, MapPin, Building, Clock, Sparkles, LogOut } from 'lucide-react';
import { UserProfile } from '../../types';
import { Button } from '../ui/Button';

export interface VolunteerProfileViewProps {
  profile: UserProfile;
  onToggleVerificationStatus: () => void;
  onLogout: () => void;
}

export const VolunteerProfileView: React.FC<VolunteerProfileViewProps> = ({
  profile,
  onToggleVerificationStatus,
  onLogout
}) => {
  const vol = profile.volunteer_profile;
  const isVerified = vol?.verification_status === 'verified';

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-12">
      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-[#c8d9d2] p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#eef3f1]">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#1864ab] text-white flex items-center justify-center text-xl font-bold">
              {profile.display_name ? profile.display_name.charAt(0).toUpperCase() : 'V'}
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-[#17201d]">{profile.display_name}</h1>
              <p className="text-xs text-[#66736e]">{profile.email}</p>
              <div className="mt-1">
                {isVerified ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#e7f7f1] text-[#087f5b] border border-[#a3e3cb]">
                    <ShieldCheck className="w-3 h-3" />
                    Verified Community Volunteer
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#fff7e6] text-[#a96f16] border border-[#ffe066]">
                    <Clock className="w-3 h-3" />
                    Verification Under Review
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={onToggleVerificationStatus}
            className="px-3.5 py-2 text-xs font-bold rounded-xl bg-[#f0f6f3] hover:bg-[#e2ede7] text-[#1864ab] border border-[#c8d9d2] transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isVerified ? 'Simulate Pending' : 'Simulate Verified'}</span>
          </button>
        </div>

        {/* Volunteer Coordinates & Ward */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-[#f8faf9] border border-[#dce5e1] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#66736e]">
              Assigned Locality / Wards
            </span>
            <div className="flex items-center gap-1.5 font-semibold text-[#17201d]">
              <MapPin className="w-4 h-4 text-[#1864ab]" />
              <span>{vol?.locality || 'Indiranagar & Koramangala'}</span>
            </div>
            <p className="text-[10px] text-[#66736e]">Bengaluru, Karnataka</p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#f8faf9] border border-[#dce5e1] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#66736e]">
              Organization / Institution
            </span>
            <div className="flex items-center gap-1.5 font-semibold text-[#17201d]">
              <Building className="w-4 h-4 text-[#1864ab]" />
              <span>{vol?.organization || 'Bengaluru Civic Action Group'}</span>
            </div>
            <p className="text-[10px] text-[#66736e]">Community Partner</p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#f8faf9] border border-[#dce5e1] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#66736e]">
              Phone Number
            </span>
            <div className="flex items-center gap-1.5 font-semibold text-[#17201d]">
              <Phone className="w-4 h-4 text-[#1864ab]" />
              <span>{profile.phone || '+91 98765 11223'}</span>
            </div>
            <p className="text-[10px] text-[#66736e]">Used for emergency ward alerts</p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#f8faf9] border border-[#dce5e1] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#66736e]">
              Weekly Availability
            </span>
            <div className="flex items-center gap-1.5 font-semibold text-[#17201d]">
              <Clock className="w-4 h-4 text-[#1864ab]" />
              <span>{vol?.availability || 'Weekends & weekday evenings (10 hrs)'}</span>
            </div>
            <p className="text-[10px] text-[#66736e]">Active field duty hours</p>
          </div>
        </div>

        {/* Motivation */}
        <div className="p-4 rounded-xl bg-[#f8faf9] border border-[#dce5e1] space-y-1 text-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#66736e]">
            Volunteer Motivation
          </span>
          <p className="text-xs text-[#2c3833] leading-relaxed">
            {vol?.motivation ||
              'Committed to ground-verifying citizen complaints, alerting BBMP ward engineers, and preventing recurring monsoon waterlogging.'}
          </p>
        </div>

        {/* Interests & Languages */}
        <div className="space-y-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#66736e] block mb-1.5">
              Areas of Interest
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(vol?.interests || ['Roads', 'Water', 'Sanitation', 'Street Lighting', 'Drainage']).map(
                interest => (
                  <span
                    key={interest}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#e7f5ff] text-[#1864ab] border border-[#a5d8ff]"
                  >
                    {interest}
                  </span>
                )
              )}
            </div>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#66736e] block mb-1.5">
              Spoken Languages
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(vol?.languages || ['English', 'Kannada', 'Hindi']).map(lang => (
                <span
                  key={lang}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#f0f6f3] text-[#2c3833] border border-[#dce5e1]"
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Sign Out Button */}
        <div className="pt-4 border-t border-[#eef3f1] flex justify-end">
          <Button
            variant="secondary"
            onClick={onLogout}
            className="text-xs font-bold text-[#c0392b] border-[#f5c6cb] hover:bg-[#fff0ee] flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout from Volunteer Portal</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
