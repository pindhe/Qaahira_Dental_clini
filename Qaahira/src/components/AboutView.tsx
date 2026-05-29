import React from "react";
import {
  Award,
  Shield,
  CheckCircle2,
  Calendar,
  Users,
  MapPin,
  Star,
} from "lucide-react";
import { Service, Doctor, Testimonial } from "../types";
import ClinicLogo from "./ClinicLogo";

interface AboutViewProps {
  onNavigateToTour: () => void;
  services: Service[];
  doctors: Doctor[];
  testimonials: Testimonial[];
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-[11px] font-semibold text-brand-600 uppercase tracking-[0.14em]">
      <span className="w-6 h-px bg-accent-400" />
      {children}
    </span>
  );
}

function getAverageRating(testimonials: Testimonial[]) {
  const approved = testimonials.filter((t) => t.approved);
  if (approved.length === 0) return "5.0";
  return (approved.reduce((s, t) => s + t.rating, 0) / approved.length).toFixed(1);
}

const MILESTONES = [
  {
    year: "2025",
    title: "Opened in Hargeisa  ",
    text: "Goorti lugu dhawaaqay furitaanka xarunta Qaaahira dentail",
  },
  {
    title: "future plans",
    text: "waxan Mustaqbalka waxan rajeenayna inan balaadhino Xarunta Qaaahira dentail",
  },
];

export default function AboutView({
  onNavigateToTour,
  services,
  doctors,
  testimonials,
}: AboutViewProps) {
  const avgRating = getAverageRating(testimonials);

  const liveStats = [
    { value: String(doctors.length), label: "Specialists", icon: Users },
    { value: avgRating, label: "Patient rating", icon: Star },
    { value: String(services.length), label: "Treatments", icon: Calendar },
  ];

  return (
    <div className="flex flex-col gap-16 pb-8" id="about-view-root">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#3d1210] via-slate-950 to-[#4a1511] text-white">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-brand-500/15 rounded-full blur-3xl" />

        <div className="relative z-10 p-8 sm:p-12 lg:p-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-accent-400 font-medium mb-6">
                <ClinicLogo size="sm" framed={false} className="!w-6 !h-6" />
                About Qaahira Denta Care
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
                Qaahira Dental Clinic{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-500 to-accent-300">
                  Clinical 3D Suite
                </span>
              </h1>

              <p className="mt-5 text-slate-300 text-base leading-relaxed max-w-2xl">
              Qaahira Denta Care waa rug caafimaad oo ilkaha ah oo ku taalla Hargeisa, kana shaqeysa adeegyo casri ah oo lagu daryeelo caafimaadka afka iyo ilkaha.
              </p>

              <div className="flex items-center gap-2 mt-4 text-sm text-slate-400">
                <MapPin className="w-4 h-4 text-accent-500" />
                Hargeisa, near Hargeisa Municipality
              </div>
            </div>

            <div className="relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[340px]">
                <div className="qdc-stage-glow absolute inset-0 rounded-full pointer-events-none scale-110" aria-hidden />
                <div className="relative rounded-2xl border border-white/10 bg-white/[0.04] p-6 sm:p-8 backdrop-blur-sm flex items-center justify-center">
                  <ClinicLogo size="xl" framed={false} className="!w-48 !h-48 sm:!w-56 sm:!h-56 drop-shadow-[0_0_40px_rgba(96,165,250,0.2)]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 border-t border-white/10 bg-white/[0.03]">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-x divide-white/10">
            {liveStats.map(({ value, label, icon: Icon }) => (
              <div key={label} className="flex items-center gap-3 px-6 sm:px-8 py-5">
                <div className="hidden sm:flex w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 items-center justify-center text-accent-500">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold tabular-nums">{value}</p>
                  <p className="text-[11px] text-slate-400">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-2xl">
        <SectionLabel>About Qaahira</SectionLabel>

        <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-[#3d1210] tracking-tight">
          Modern dental care you can trust
        </h2>

        <p className="mt-4 text-sm text-slate-500 leading-relaxed">
          Based in Hargeisa, Qaahira Denta Care provides modern dental services
          focused on patient comfort, safety, and long-term oral health. Our clinic
          combines experienced professionals, digital treatment planning, and strict
          sterilization standards to ensure every patient receives trusted and
          high-quality care.
        </p>

        <ul className="mt-6 space-y-3">
          {[
            "Advanced digital dental consultation and treatment planning",
            "Strict sterilization and hygiene protocols for all instruments",
            "Safe and biocompatible dental materials",
            "Friendly patient-centered care in a modern environment",
          ].map((item) => (
            <li
              key={item}
              className="flex items-start gap-2 text-sm text-slate-600"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* Timeline */}
      <section>
        <div className="mb-8">
          <SectionLabel>Our story</SectionLabel>
          <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-[#3d1210] tracking-tight">
            Milestones that shaped us
          </h2>
        </div>

        <div className="relative border-l-2 border-slate-200 pl-8 ml-3 space-y-8">
          {MILESTONES.map((ms) => (
            <article key={ms.year} className="relative">
              <div className="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-brand-600 border-4 border-white shadow-sm" />
              <div className="bg-white border border-slate-100 rounded-2xl p-5 sm:p-6 shadow-sm max-w-2xl hover:border-brand-100 transition">
                <span className="text-xs font-mono font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded">
                  {ms.year}
                </span>
                <h4 className="font-bold text-slate-900 mt-2 flex items-center gap-2">
                  <Award className="w-4 h-4 text-brand-600" />
                  {ms.title}
                </h4>
                <p className="text-sm text-slate-500 mt-2 leading-relaxed">{ms.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

    </div>
  );
}
