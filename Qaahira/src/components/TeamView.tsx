import React from "react";
import { Doctor } from "../types";
import { Star, Award, Clock, ArrowRight, UserCheck, ShieldCheck } from "lucide-react";

interface TeamViewProps {
  doctors: Doctor[];
  onNavigateToContact: () => void;
}

export default function TeamView({ doctors, onNavigateToContact }: TeamViewProps) {
  return (
    <div className="flex flex-col gap-12 pb-12">
      
      {/* Page Header Introduction */}
      <div className="flex flex-col gap-2 max-w-xl">
        <span className="font-mono text-xs text-brand-600 uppercase tracking-wider">Our Clinical Experts</span>
        <h2 className="font-sans text-3xl font-extrabold text-[#3d1210] tracking-tight uppercase">
          Certified Dental Directors
        </h2>
        <p className="font-sans text-xs text-slate-500 leading-relaxed">
          Our senior surgical dentists are international fellows and active medical board members, combining global academic qualifications with a patient-first approach.
        </p>
      </div>

      {/* Grid of Doctor profiles */}
      {doctors.length === 0 ? (
        <div className="text-center py-16 px-6 bg-white border border-dashed border-slate-200 rounded-3xl">
          <UserCheck className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-[#3d1210]">No doctors listed yet</h3>
          <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
            Our clinical team will appear here once profiles are added through the admin panel.
          </p>
        </div>
      ) : (
      <div className="grid grid-cols-1 gap-12">
        {doctors.map((doc) => {
          return (
            <div
              key={doc.doctor_id}
              className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch"
            >
              {/* Doctor Profile Image - 4/12 cols */}
              <div className="lg:col-span-4 relative bg-slate-100 min-h-[300px]">
                <img
                  src={doc.profile_picture_url}
                  alt={doc.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center absolute inset-0"
                />
                
                {/* Micro badge of status */}
                <div className="absolute top-4 left-4 bg-emerald-500/90 text-white backdrop-blur-md p-1 px-3.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider shadow-md">
                  Active Clinical Hours
                </div>
              </div>

              {/* Bio & availability - 8/12 cols */}
              <div className="lg:col-span-8 p-6 lg:p-8 flex flex-col justify-between gap-6">
                
                {/* Top Section: Name and board bio details */}
                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h3 className="font-sans font-bold text-[#3d1210] text-lg lg:text-xl uppercase tracking-wider">
                        {doc.name}
                      </h3>
                      <p className="font-sans text-xs font-semibold text-brand-600 mt-0.5 uppercase tracking-wide">
                        {doc.specialization}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 bg-brand-50 p-1 px-2.5 rounded-lg border border-brand-100 text-brand-600 text-xs font-mono font-semibold">
                      <Award className="w-4 h-4" />
                      BOARD CERTIFIED
                    </div>
                  </div>

                  <p className="text-[11px] font-mono text-slate-400 border-b border-slate-50 pb-3 leading-relaxed">
                    🎓 QUALIFICATIONS: {doc.qualifications}
                  </p>

                  <p className="font-sans text-xs text-slate-500 leading-relaxed mt-1">
                    {doc.bio}
                  </p>
                </div>

                {/* Mid Section: Slots Weekly schedule availability */}
                <div className="p-4 bg-slate-50 rounded-2xl flex flex-col gap-3">
                  <h4 className="font-sans text-[11px] font-bold text-slate-700 uppercase tracking-widest flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-brand-600" />
                    WEEKLY SESSIONS SCHEDULE
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {Object.entries(doc.availability).map(([day, slots]) => {
                      return (
                        <div key={day} className="p-3 bg-white border border-slate-200/50 rounded-xl flex flex-col gap-1.5 shadow-sm">
                          <span className="font-sans text-xs font-semibold text-slate-800 uppercase tracking-wider">{day}</span>
                          <div className="flex flex-wrap gap-1">
                            {slots.map((s) => (
                              <span key={s} className="text-[10px] font-mono text-slate-500 bg-slate-100 p-0.5 px-1.5 rounded">
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom Section: CTA */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-50 pt-5">
                  <div className="flex items-center gap-2 text-slate-400">
                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                    <span className="text-[10px] uppercase font-mono tracking-wider">Patient Records Guaranteed Secure</span>
                  </div>
                  
                  <button
                    onClick={onNavigateToContact}
                    className="p-3 px-6 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 font-sans text-xs text-slate-200 hover:text-white font-semibold uppercase tracking-wider flex items-center gap-2.5 transition"
                    id={`btn-contact-about-${doc.doctor_id}`}
                  >
                    Contact Qaahira Denta Care
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            </div>
          );
        })}
      </div>
      )}

    </div>
  );
}
