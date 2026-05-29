import React from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  ArrowUpRight,
  Bot,
  Home,
  Info,
  Stethoscope,
  Users,
  Images,
  MessageSquare,
  ChevronRight,
} from "lucide-react";
import { ClinicSettings } from "../types";
import ClinicLogo from "./ClinicLogo";

interface FooterProps {
  onNavigate: (view: string) => void;
  settings?: ClinicSettings | null;
}

const EXPLORE_LINKS = [
  { id: "home", label: "Home", icon: Home },
  { id: "about", label: "About", icon: Info },
  { id: "services", label: "Services", icon: Stethoscope },
  { id: "team", label: "Doctors", icon: Users },
  { id: "gallery", label: "Portfolio", icon: Images },
  { id: "contact", label: "Contact", icon: MessageSquare },
] as const;

export default function Footer({ onNavigate, settings }: FooterProps) {
  const navigate = (view: string) => {
    onNavigate(view);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clinicName = settings?.clinic_name ?? "Qaahira Denta Care";
  const tagline = settings?.tagline ?? "Clinical 3D Suite";
  const city = settings?.city ?? "Hargeisa";
  const address = settings?.address ?? "Hargeisa, near Dawlada Hoose ee Hargaysa";
  const phonePrimary = settings?.phone_primary ?? "+252 63 6249555";
  const phoneSecondary = settings?.phone_secondary ?? "+252 63 4953675";
  const email = settings?.email ?? "kharash420@gmail.com";
  const hoursDays = settings?.hours_days ?? "Sat – Thu";
  const hoursMorning = settings?.hours_morning ?? "07:00 – 12:00";
  const hoursAfternoon = settings?.hours_afternoon ?? "16:00 – 20:00";
  const footerCopy =
    settings?.footer_tagline ??
    "Modern dental care with digital treatment planning, strict sterilization, and patient-centred service — right here in Hargeisa.";
  const mapDirectionsUrl = settings
    ? `https://www.google.com/maps/dir/?api=1&destination=${settings.map_lat},${settings.map_lng}`
    : "https://www.google.com/maps/dir/?api=1&destination=9.5616,44.0718";

  const tel = (phone: string) => phone.replace(/[\s-]/g, "");

  return (
    <footer className="bg-[#3d1210] text-white border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            <button
              type="button"
              onClick={() => navigate("home")}
              className="flex items-center gap-3 text-left group w-fit"
              id="footer-brand-logo"
            >
              <ClinicLogo size="md" />
              <div>
                <span className="font-bold text-sm uppercase tracking-tight block leading-none">
                  {clinicName}
                </span>
                <span className="text-[10px] text-accent-500 font-mono tracking-[0.14em] uppercase block mt-1.5">
                  {tagline} · {city}
                </span>
              </div>
            </button>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">{footerCopy}</p>

          </div>

          {/* Explore */}
          <div className="lg:col-span-3">
            <div className="flex items-center gap-2 mb-5">
              <span className="w-6 h-px bg-brand-500/50" />
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-300">
                Explore
              </h4>
            </div>

            <nav
              className="grid grid-cols-1 sm:grid-cols-2 gap-2"
              aria-label="Site navigation"
            >
              {EXPLORE_LINKS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  id={`footer-link-${id}`}
                  onClick={() => navigate(id)}
                  className="group flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-left transition hover:border-slate-700/80 hover:bg-white/[0.04]"
                >
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-slate-700/60 bg-slate-900/60 text-accent-500 transition group-hover:border-brand-500/30 group-hover:bg-brand-500/10">
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <span className="flex min-w-0 flex-1 items-center justify-between gap-2">
                    <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                      {label}
                    </span>
                    <ChevronRight className="h-3.5 w-3.5 flex-shrink-0 text-slate-600 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:text-accent-500 group-hover:opacity-100" />
                  </span>
                </button>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-2 mb-5">
              <span className="w-6 h-px bg-brand-500/50" />
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-300">
                Visit us
              </h4>
            </div>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <MapPin className="w-4 h-4 text-accent-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-slate-300">{address}</p>
                  <a
                    href={mapDirectionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-1 text-xs text-accent-500 hover:text-accent-400 transition"
                    id="footer-link-directions"
                  >
                    Get directions
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                </div>
              </li>
              <li className="flex gap-3">
                <Phone className="w-4 h-4 text-accent-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-slate-300 font-mono space-y-0.5">
                  <a href={`tel:${tel(phonePrimary)}`} className="block hover:text-accent-500 transition">
                    {phonePrimary}
                  </a>
                  {phoneSecondary && (
                    <a href={`tel:${tel(phoneSecondary)}`} className="block hover:text-accent-500 transition">
                      {phoneSecondary}
                    </a>
                  )}
                </div>
              </li>
              <li className="flex gap-3">
                <Mail className="w-4 h-4 text-accent-500 flex-shrink-0 mt-0.5" />
                <a
                  href={`mailto:${email}`}
                  className="text-sm text-slate-300 hover:text-accent-500 transition"
                >
                  {email}
                </a>
              </li>
              <li className="flex gap-3">
                <Clock className="w-4 h-4 text-accent-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-slate-400">
                  <p>{hoursDays} · {hoursMorning}</p>
                  <p className="mt-0.5">{hoursDays} · {hoursAfternoon}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800/80 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col-reverse sm:flex-row items-center sm:items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => navigate("admin")}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition self-start sm:self-auto"
            id="btn-footer-clinician-portal"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Staff portal
          </button>

          <p className="text-xs text-slate-500 text-center sm:text-right">
            © {new Date().getFullYear()} {clinicName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
