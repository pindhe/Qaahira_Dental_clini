import React from "react";
import {
  ArrowRight,
  Star,
  Heart,
  Activity,
  Shield,
  MapPin,
  Phone,
  Clock,
  CheckCircle2,
  Award,
  Users,
  Calendar,
  Quote,
  Sparkles,
  Stethoscope,
  Microscope,
  MessageSquare,
  type LucideIcon,
} from "lucide-react";
import { Service, Doctor, Testimonial } from "../types";

interface HomeViewProps {
  onNavigate: (view: string) => void;
  onNavigateToService: (serviceId: string) => void;
  services: Service[];
  doctors: Doctor[];
  testimonials: Testimonial[];
}

const MAP_DIRECTIONS_URL =
  "https://www.google.com/maps/place/Qaahira+Denta+care/@9.5615759,44.071199,148m/data=!3m1!1e3!4m14!1m7!3m6!1s0x1628bf0b5c760ca3:0x6e2b6afec05ab86a!2sQaahira+Denta+care!8m2!3d9.5615997!4d44.0718104!16s%2Fg%2F11ms4clnzt!3m5!1s0x1628bf0b5c760ca3:0x6e2b6afec05ab86a!8m2!3d9.5615997!4d44.0718104!16s%2Fg%2F11ms4clnzt?entry=ttu";

const MAP_EMBED_URL =
  "https://maps.google.com/maps?q=9.5615997,44.0718104&hl=en&z=17&output=embed";

const TRUST_METRICS = [
  { value: "15+", label: "Years of excellence", icon: Award },
  { value: "12K+", label: "Patients treated", icon: Users },
  { value: "98%", label: "Satisfaction rate", icon: Heart },
  { value: "24/7", label: "Emergency cover", icon: Shield },
];

interface CareStep {
  step: string;
  title: string;
  desc: string;
  meta: string;
  icon: LucideIcon;
}

function getServiceIcon(model3D_id: string): LucideIcon {
  const icons: Record<string, LucideIcon> = {
    implant: Stethoscope,
    root_canal: Activity,
    aligner: Sparkles,
    veneer: Heart,
    crown_bridge: Shield,
    tooth_extraction: Microscope,
  };
  return icons[model3D_id] ?? Shield;
}

function buildCareJourney(services: Service[], doctors: Doctor[]): CareStep[] {
  const categories = [...new Set(services.map((s) => s.category))];
  const featuredServices = services.slice(0, 3).map((s) => s.service_name);
  const avgDuration =
    services.length > 0
      ? Math.round(services.reduce((sum, s) => sum + s.estimated_duration_minutes, 0) / services.length)
      : 45;
  const specialistLine =
    doctors.length > 0
      ? doctors
          .slice(0, 2)
          .map((d) => d.name.replace(/^Dr\.\s*/i, "Dr. "))
          .join(" & ")
      : "our clinical team";

  return [
    {
      step: "01",
      title: "Consultation & diagnosis",
      desc:
        doctors.length > 0
          ? `Start with ${specialistLine}. We assess your case with digital imaging and a full clinical review before any treatment begins.`
          : "Comprehensive exam with digital X-rays and CBCT imaging when clinically indicated.",
      meta: `${doctors.length} specialist${doctors.length === 1 ? "" : "s"} on staff`,
      icon: Stethoscope,
    },
    {
      step: "02",
      title: "Personalized treatment plan",
      desc:
        services.length > 0
          ? `Select from ${services.length} live clinic services across ${categories.length} departments — including ${featuredServices.join(", ")}${services.length > 3 ? ", and more" : ""}.`
          : "Clear options, transparent pricing, and 3D visualization of your proposed procedure.",
      meta: `${categories.length} clinical department${categories.length === 1 ? "" : "s"}`,
      icon: Microscope,
    },
    {
      step: "03",
      title: "Expert care & follow-up",
      desc:
        services.length > 0
          ? `Procedures average ~${avgDuration} minutes with published price ranges and structured post-treatment follow-up from our team.`
          : "Precision treatment in a sterile environment with structured post-procedure support.",
      meta: services[0]?.price_range ? `Plans from ${services[0].price_range.split("-")[0]?.trim()}` : "Transparent pricing",
      icon: CheckCircle2,
    },
  ];
}

function CareJourneySection({ services, doctors }: { services: Service[]; doctors: Doctor[] }) {
  const steps = buildCareJourney(services, doctors);
  const categories = [...new Set(services.map((s) => s.category))];

  return (
    <section className="relative overflow-hidden rounded-3xl border border-slate-100 bg-gradient-to-b from-white to-slate-50/80 p-8 sm:p-10">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
        <div className="max-w-2xl">
          <SectionLabel>Your journey</SectionLabel>
          <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-[#3d1210] tracking-tight">
            How we care for you
          </h2>
          <p className="mt-3 text-sm text-slate-500 leading-relaxed">
            A live patient pathway built from our current team of {doctors.length} specialists and{" "}
            {services.length} active clinical services.
          </p>
        </div>

        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 self-start lg:self-auto max-w-md">
            {categories.map((cat) => (
              <span
                key={cat}
                className="text-[10px] font-semibold uppercase tracking-wide text-slate-600 bg-white border border-slate-200 px-2.5 py-1 rounded-full"
              >
                {cat}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 relative">
        <div className="hidden md:block absolute top-14 left-[18%] right-[18%] h-px bg-gradient-to-r from-transparent via-brand-200 to-transparent" aria-hidden />

        {steps.map(({ step, title, desc, meta, icon: Icon }) => (
          <article
            key={step}
            className="relative p-6 sm:p-7 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md hover:border-brand-100 transition-all duration-300 text-center"
          >
            <div className="w-12 h-12 mx-auto rounded-2xl bg-[#3d1210] text-white flex items-center justify-center mb-4 shadow-lg shadow-slate-900/10">
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono font-bold text-brand-600 tracking-widest">{step}</span>
            <h3 className="mt-1.5 text-base font-bold text-slate-900">{title}</h3>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed">{desc}</p>
            <p className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-semibold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full">
              <CheckCircle2 className="w-3 h-3" />
              {meta}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ServicesSection({
  services,
  onNavigate,
  onNavigateToService,
}: {
  services: Service[];
  onNavigate: (view: string) => void;
  onNavigateToService: (serviceId: string) => void;
}) {
  const categories = [...new Set(services.map((s) => s.category))];
  const with3D = services.filter((s) => s.model3D_id).length;

  return (
    <section className="flex flex-col gap-8">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
        <div className="max-w-xl">
          <SectionLabel>Clinical services</SectionLabel>
          <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-[#3d1210] tracking-tight">
            Specialized restorative care
          </h2>
          <p className="mt-3 text-sm text-slate-500 leading-relaxed">
            All treatments below are loaded from our live clinic catalogue — pricing, duration, and FAQs update
            automatically.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-3 px-4 py-3 bg-white border border-slate-100 rounded-2xl shadow-sm text-sm">
            <span className="font-bold text-[#3d1210] tabular-nums">{services.length}</span>
            <span className="text-slate-500">services · {categories.length} departments</span>
            {with3D > 0 && (
              <>
                <span className="text-slate-200">|</span>
                <span className="text-brand-600 font-medium">{with3D} with 3D preview</span>
              </>
            )}
          </div>
          <button
            onClick={() => onNavigate("services")}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-500 transition"
            id="link-all-services"
          >
            View all services
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {services.length === 0 ? (
        <div className="text-center py-16 px-6 bg-white border border-dashed border-slate-200 rounded-2xl">
          <Shield className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-500">Clinical services will appear here once loaded from the clinic database.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((serv) => {
            const Icon = getServiceIcon(serv.model3D_id);
            return (
              <article
                key={serv.service_id}
                className="group flex flex-col bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-lg hover:border-brand-100 transition-all duration-300 overflow-hidden"
              >
                {serv.image_url ? (
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <img
                      src={serv.image_url}
                      alt={serv.service_name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white/80 to-transparent" />
                  </div>
                ) : (
                  <div className="h-1 bg-gradient-to-r from-brand-500 via-accent-400 to-accent-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}

                <div className="p-5 flex flex-col flex-1 gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-brand-600 group-hover:bg-brand-50 group-hover:border-brand-100 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    {serv.model3D_id && (
                      <span className="text-[9px] font-bold uppercase tracking-wider text-accent-600 bg-accent-50 border border-accent-100 px-2 py-0.5 rounded-full">
                        3D
                      </span>
                    )}
                  </div>

                  <span className="self-start text-[10px] font-semibold uppercase tracking-widest text-brand-600 bg-brand-50 px-2.5 py-1 rounded-md">
                    {serv.category}
                  </span>

                  <h3 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-brand-700 transition-colors">
                    {serv.service_name}
                  </h3>

                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 flex-1">{serv.description}</p>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {serv.estimated_duration_minutes > 0 && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded">
                        <Clock className="w-3 h-3" />
                        ~{serv.estimated_duration_minutes} min
                      </span>
                    )}
                    {serv.price_range && (
                      <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        {serv.price_range}
                      </span>
                    )}
                    {serv.faqs?.length > 0 && (
                      <span className="text-[10px] font-medium text-slate-400 bg-slate-50 px-2 py-0.5 rounded">
                        {serv.faqs.length} FAQs
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => onNavigateToService(serv.service_id)}
                  className="flex items-center justify-between px-5 py-3.5 border-t border-slate-50 text-xs font-semibold text-brand-600 hover:bg-brand-50/50 transition"
                  id={`btn-home-serv-${serv.service_id}`}
                >
                  View treatment details
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

function getDoctorAvailabilityStats(doctor: Doctor) {
  const days = Object.keys(doctor.availability ?? {});
  const slotCount = days.reduce((sum, day) => sum + (doctor.availability[day]?.length ?? 0), 0);
  return { days, dayCount: days.length, slotCount };
}

function getTeamStats(doctors: Doctor[]) {
  const specializations = [...new Set(doctors.map((d) => d.specialization))];
  const stats = doctors.reduce(
    (acc, doc) => {
      const { slotCount, dayCount } = getDoctorAvailabilityStats(doc);
      return {
        totalSlots: acc.totalSlots + slotCount,
        clinicDays: acc.clinicDays + dayCount,
      };
    },
    { totalSlots: 0, clinicDays: 0 }
  );
  return { ...stats, specializations };
}

function getDoctorIcon(specialization: string): LucideIcon {
  const lower = specialization.toLowerCase();
  if (lower.includes("orthodont") || lower.includes("aligner")) return Sparkles;
  if (lower.includes("pediatric") || lower.includes("general")) return Heart;
  if (lower.includes("surgeon") || lower.includes("implant")) return Stethoscope;
  return Microscope;
}

function DoctorsSection({
  doctors,
  onNavigate,
}: {
  doctors: Doctor[];
  onNavigate: (view: string) => void;
}) {
  const { totalSlots, clinicDays, specializations } = getTeamStats(doctors);

  return (
    <section className="relative overflow-hidden rounded-3xl border border-slate-100 bg-gradient-to-b from-slate-50 via-white to-white p-8 sm:p-10">
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-50/60 rounded-full blur-3xl pointer-events-none" aria-hidden />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
        <div className="max-w-xl">
          <SectionLabel>Our specialists</SectionLabel>
          <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-[#3d1210] tracking-tight">
            Meet our clinical team
          </h2>
          <p className="mt-3 text-sm text-slate-500 leading-relaxed">
            {doctors.length > 0
              ? `${doctors.length} clinicians on staff with ${totalSlots} bookable slots across ${clinicDays} clinic days — loaded live from our scheduling database.`
              : "Our specialist profiles and availability are synced from the clinic system."}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {doctors.length > 0 && (
            <div className="flex items-center gap-3 px-4 py-3 bg-white border border-slate-100 rounded-2xl shadow-sm text-sm">
              <span className="font-bold text-[#3d1210] tabular-nums">{doctors.length}</span>
              <span className="text-slate-500">doctors · {totalSlots} open slots</span>
            </div>
          )}
          <button
            onClick={() => onNavigate("team")}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-500 transition"
          >
            View full team
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {specializations.length > 0 && (
        <div className="relative z-10 flex flex-wrap gap-2 mb-8">
          {specializations.map((spec) => (
            <span
              key={spec}
              className="text-[10px] font-semibold text-slate-600 bg-white border border-slate-200 px-2.5 py-1 rounded-full"
            >
              {spec}
            </span>
          ))}
        </div>
      )}

      {doctors.length === 0 ? (
        <div className="relative z-10 text-center py-16 px-6 bg-white border border-dashed border-slate-200 rounded-2xl">
          <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-500">Clinical team profiles will appear here once loaded from the clinic database.</p>
        </div>
      ) : (
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doc) => {
            const { days, dayCount, slotCount } = getDoctorAvailabilityStats(doc);
            const Icon = getDoctorIcon(doc.specialization);

            return (
              <article
                key={doc.doctor_id}
                className="group flex flex-col bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:border-brand-100 transition-all duration-300"
              >
                <div className="h-1 bg-gradient-to-r from-[#3d1210] via-brand-600 to-accent-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative h-52 sm:h-56 overflow-hidden bg-slate-100">
                  <img
                    src={doc.profile_picture_url}
                    alt={doc.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent" />
                  <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-sm border border-white/80 text-[10px] font-semibold text-slate-700 shadow-sm">
                    <Icon className="w-3 h-3 text-brand-600" />
                    {dayCount} day{dayCount === 1 ? "" : "s"} · {slotCount} slots
                  </div>
                </div>

                <div className="p-5 sm:p-6 flex flex-col flex-1 gap-4">
                  <div>
                    <h3 className="font-bold text-[#3d1210] text-base leading-snug">{doc.name}</h3>
                    <p className="text-xs font-semibold text-brand-600 mt-1.5">{doc.specialization}</p>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{doc.qualifications}</p>
                  </div>

                  {doc.bio && (
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 flex-1">{doc.bio}</p>
                  )}

                  {days.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {days.map((day) => (
                        <span
                          key={day}
                          className="text-[10px] font-medium text-slate-500 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md"
                        >
                          {day.slice(0, 3)}
                          <span className="text-slate-300 mx-0.5">·</span>
                          {doc.availability[day]?.length ?? 0}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-2 pt-1">
                    <button
                      onClick={() => onNavigate("team")}
                      className="flex-1 py-2.5 text-xs font-semibold text-center border border-slate-200 hover:border-brand-600 hover:text-brand-600 hover:bg-brand-50/50 rounded-xl transition"
                      id={`btn-home-doc-${doc.doctor_id}`}
                    >
                      View profile
                    </button>
                    <button
                      onClick={() => onNavigate("contact")}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-white bg-[#3d1210] hover:bg-slate-800 rounded-xl transition"
                      id={`btn-home-contact-doc-${doc.doctor_id}`}
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Contact us
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-[11px] font-semibold text-brand-600 uppercase tracking-[0.14em]">
      <span className="w-6 h-px bg-accent-400" />
      {children}
    </span>
  );
}

const BLINK_DOTS = ["#3b82f6", "#60a5fa", "#93c5fd", "#93c5fd", "#60a5fa", "#3b82f6"];

function AnatomyStage() {
  return (
    <div className="flex flex-col items-center w-full">
      <div className="relative w-full max-w-[320px] mx-auto">
        <div className="qdc-stage-glow absolute inset-0 rounded-full pointer-events-none" aria-hidden />

        <div className="relative w-[280px] h-[320px] mx-auto group">
          <span className="qdc-ring1 absolute w-[240px] h-[240px] top-8 left-1/2 -translate-x-1/2 rounded-full border border-accent-400/30 pointer-events-none" />
          <span className="qdc-ring2 absolute w-[280px] h-[280px] top-0 left-1/2 -translate-x-1/2 rounded-full border border-accent-400/15 pointer-events-none" />
          <div className="qdc-scan absolute left-[8%] right-[8%] h-0.5 bg-gradient-to-r from-transparent via-accent-300 to-transparent z-10 pointer-events-none" />
          <div className="qdc-molar relative z-[1] flex items-center justify-center h-[280px]">
            <img
              src="/images/tooth-3d-molar.png"
              alt="Clinical 3D molar model"
              className="w-[230px] h-auto object-contain drop-shadow-[0_0_32px_rgba(147,197,253,0.35)] drop-shadow-[0_24px_48px_rgba(0,0,0,0.45)] brightness-110"
              draggable={false}
            />
          </div>
          <div className="qdc-shadow absolute bottom-2 left-1/2 -translate-x-1/2 w-[130px] h-[20px] rounded-full bg-[radial-gradient(ellipse,rgba(96,165,250,0.25)_0%,transparent_70%)]" />
        </div>
      </div>

      <div className="mt-6 w-full max-w-[260px] flex flex-col items-center gap-3">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-accent-500/50 to-transparent shadow-[0_0_12px_rgba(96,165,250,0.4)]" />
        <p className="text-[10px] text-white/30 font-mono tracking-[0.18em] uppercase">
          Hover to pause rotation
        </p>
      </div>
    </div>
  );
}

function ThreeDTeethSection() {

  return (
    <section className="relative overflow-hidden rounded-3xl bg-[#050a14] p-6 sm:p-8 lg:p-10 border border-brand-950/40">
      <div
        className="absolute inset-0 opacity-[0.2] bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_50%,#000_60%,transparent_100%)]"
        aria-hidden
      />
      <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/8 rounded-full blur-3xl pointer-events-none" aria-hidden />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-500/5 rounded-full blur-3xl pointer-events-none" aria-hidden />

      {/* Reference-style header */}
      <div className="relative z-10 text-center mb-8 lg:mb-10">
        <span className="font-mono text-[10px] text-accent-500 uppercase tracking-[0.14em]">
          Qahira Dental Clinic
        </span>
        <div className="flex items-center justify-center gap-2 mt-2 flex-wrap">
          {BLINK_DOTS.map((c, i) => (
            <span
              key={`l-${i}`}
              className="w-1.5 h-1.5 rounded-full inline-block"
              style={{ background: c, animation: `qdc-blink 1.4s ${i * 0.25}s infinite` }}
            />
          ))}
          <span className="text-xs sm:text-sm font-medium text-slate-200 tracking-wide mx-1">
            3D Anatomy Pre-Visualiser
          </span>
          {[...BLINK_DOTS].reverse().map((c, i) => (
            <span
              key={`r-${i}`}
              className="w-1.5 h-1.5 rounded-full inline-block"
              style={{ background: c, animation: `qdc-blink 1.4s ${i * 0.25 + 0.8}s infinite` }}
            />
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
          Clinical 3D tooth model preview.
        </p>
      </div>

      <div className="relative z-10 flex justify-center">
        <AnatomyStage />
      </div>
    </section>
  );
}

function StarRating({ rating, size = "md" }: { rating: number; size?: "sm" | "md" }) {
  const starClass = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";
  return (
    <div className="flex items-center gap-0.5 text-amber-400" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`${starClass} ${i < rating ? "fill-current" : "fill-none text-slate-200"}`}
        />
      ))}
    </div>
  );
}

function patientInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function TestimonialsSection({
  testimonials,
  onNavigate,
}: {
  testimonials: Testimonial[];
  onNavigate: (view: string) => void;
}) {
  const count = testimonials.length;
  const averageRating =
    count > 0
      ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / count).toFixed(1)
      : "5.0";

  return (
    <section className="relative overflow-hidden rounded-3xl border border-slate-100 bg-gradient-to-b from-slate-50 via-white to-white p-8 sm:p-10">
      <div
        className="absolute top-0 right-0 w-72 h-72 bg-brand-100/40 rounded-full blur-3xl pointer-events-none"
        aria-hidden
      />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
        <div className="max-w-xl">
          <SectionLabel>Patient stories</SectionLabel>
          <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-[#3d1210] tracking-tight">
            Trusted by our community
          </h2>
          <p className="mt-3 text-sm text-slate-500 leading-relaxed">
            Real feedback from patients who chose Qaahira Denta Care for implants, aligners, and family dentistry.
          </p>
        </div>

        <div className="flex items-center gap-4 p-4 sm:p-5 bg-white border border-slate-100 rounded-2xl shadow-sm self-start lg:self-auto">
          <div className="text-center sm:text-left">
            <p className="text-3xl font-bold text-[#3d1210] tabular-nums leading-none">{averageRating}</p>
            <StarRating rating={Math.round(Number(averageRating))} size="sm" />
          </div>
          <div className="w-px h-10 bg-slate-100" aria-hidden />
          <div>
            <p className="text-sm font-semibold text-slate-800">{count}+ verified reviews</p>
            <p className="text-xs text-slate-400 mt-0.5">Google & clinic feedback</p>
          </div>
        </div>
      </div>

      {count === 0 ? (
        <div className="text-center py-14 px-6 bg-white border border-dashed border-slate-200 rounded-2xl">
          <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-500">Patient stories will appear here once approved.</p>
        </div>
      ) : (
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {testimonials.map((test, index) => (
            <blockquote
              key={test.testimonial_id}
              className={`group relative flex flex-col bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-lg hover:border-brand-100 transition-all duration-300 overflow-hidden ${
                index === 0 ? "lg:ring-1 lg:ring-brand-100" : ""
              }`}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-500 via-accent-400 to-accent-400 opacity-80" />

              <div className="p-6 sm:p-7 flex flex-col flex-1 gap-5">
                <div className="flex items-start justify-between gap-3">
                  <StarRating rating={test.rating} />
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-[10px] font-semibold text-emerald-700 uppercase tracking-wide">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified
                  </span>
                </div>

                <Quote className="w-9 h-9 text-brand-100" aria-hidden />

                <p className="text-sm text-slate-600 leading-relaxed flex-1 relative -mt-2">
                  {test.content}
                </p>

                <footer className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3d1210] to-brand-700 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-brand-900/10">
                    {patientInitials(test.patient_name)}
                  </div>
                  <div className="min-w-0">
                    <cite className="not-italic block font-semibold text-slate-900 text-sm truncate">
                      {test.patient_name}
                    </cite>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {new Date(test.created_at).toLocaleDateString(undefined, {
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </footer>
              </div>
            </blockquote>
          ))}
        </div>
      )}

      <div className="relative z-10 mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
        <p className="text-sm text-slate-500 text-center sm:text-left">
          Had a great visit? We&apos;d love to hear from you.
        </p>
        <button
          onClick={() => onNavigate("contact")}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#3d1210] hover:bg-slate-800 text-white rounded-xl text-sm font-semibold transition shadow-sm min-w-[220px] justify-center"
          id="btn-home-submit-review"
        >
          Share your experience
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}

export default function HomeView({
  onNavigate,
  onNavigateToService,
  services,
  doctors,
  testimonials,
}: HomeViewProps) {
  const approvedTestimonials = testimonials.filter((t) => t.approved).slice(0, 3);

  return (
    <div className="flex flex-col gap-20 pb-16">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#3d1210] via-slate-950 to-[#4a1511] text-white">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_70%,transparent_100%)] opacity-25" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-brand-500/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center p-8 sm:p-12 lg:p-16 min-h-[520px]">
          <div className="lg:col-span-7 flex flex-col items-start gap-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-accent-400 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              Qaahira Denta Care · Hargeisa
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-bold tracking-tight leading-[1.1] text-white">
              Modern dental care at{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-500 via-accent-300 to-accent-300">
                Qaahira Denta Care
              </span>
            </h1>

            <p className="text-slate-300 text-base leading-relaxed max-w-xl">
              Trusted restorative and cosmetic dentistry in Hargeisa — clear treatment options,
              experienced specialists, and patient-centred care you can rely on.
            </p>

            <div className="flex flex-wrap gap-3 mt-1">
              <button
                onClick={() => onNavigate("contact")}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold transition shadow-lg shadow-brand-950/50"
                id="btn-hero-contact"
              >
                <MessageSquare className="w-4 h-4" />
                Contact us
              </button>
              <button
                onClick={() => onNavigate("services")}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-white/5 border border-white/15 hover:bg-white/10 text-slate-200 hover:text-white text-sm font-semibold transition"
                id="btn-hero-services"
              >
                View our services
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Experienced specialists
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Class-B sterilization
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Transparent pricing
              </span>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div
              className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/40 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=800&h=600&fit=crop')",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                <div className="bg-slate-950/75 backdrop-blur-md p-4 sm:p-5 rounded-xl border border-white/10">
                  <p className="text-[10px] font-semibold text-accent-400 uppercase tracking-widest">Integrated suite</p>
                  <h4 className="text-white text-sm font-bold mt-1">3D pre-visualisation</h4>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    Explore procedures step-by-step before your visit — implants, root canals, and more.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust metrics bar */}
        <div className="relative z-10 border-t border-white/10 bg-white/[0.03] backdrop-blur-sm">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/10">
            {TRUST_METRICS.map(({ value, label, icon: Icon }) => (
              <div key={label} className="flex items-center gap-3 px-6 sm:px-8 py-5">
                <div className="hidden sm:flex w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 items-center justify-center text-accent-500">
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-white tabular-nums">{value}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value pillars */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
        {[
          {
            icon: Shield,
            accent: "bg-brand-50 text-brand-600 border-brand-100",
            title: "Transparent treatment planning",
            body: "3D models and clear clinical explanations so you know exactly what to expect before any procedure.",
          },
          {
            icon: Heart,
            accent: "bg-emerald-50 text-emerald-600 border-emerald-100",
            title: "Anxiety-free environment",
            body: "Gentle protocols for families and anxious patients — quiet equipment, warm care, and unhurried consultations.",
          },
          {
            icon: Activity,
            accent: "bg-accent-50 text-accent-600 border-accent-100",
            title: "Digital precision",
            body: "CAD/CAM milling, low-dose CBCT imaging, and computer-guided surgery for predictable outcomes.",
          },
        ].map(({ icon: Icon, accent, title, body }) => (
          <div
            key={title}
            className="group p-6 lg:p-7 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-300"
          >
            <div className={`inline-flex p-3 rounded-xl border ${accent} mb-4 group-hover:scale-105 transition-transform`}>
              <Icon className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">{title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed">{body}</p>
          </div>
        ))}
      </section>

      {/* 3D anatomy */}
      <ThreeDTeethSection />

      {/* How it works */}
      <CareJourneySection services={services} doctors={doctors} />

      {/* Services */}
      <ServicesSection
        services={services}
        onNavigate={onNavigate}
        onNavigateToService={onNavigateToService}
      />

      {/* Doctors */}
      <DoctorsSection
        doctors={doctors}
        onNavigate={onNavigate}
      />

      {/* Testimonials */}
      <section className="flex flex-col gap-8">
        <div className="text-center max-w-xl mx-auto">
          <SectionLabel>Patient stories</SectionLabel>
          <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-[#3d1210] tracking-tight">
            Trusted by our community
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {approvedTestimonials.map((test) => (
            <blockquote
              key={test.testimonial_id}
              className="relative p-6 bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col gap-5"
            >
              <Quote className="w-8 h-8 text-brand-100 absolute top-5 right-5" aria-hidden />
              <div className="flex items-center gap-0.5 text-amber-400">
                {Array.from({ length: test.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-sm text-slate-600 leading-relaxed relative z-10">&ldquo;{test.content}&rdquo;</p>
              <footer className="flex items-center gap-3 border-t border-slate-50 pt-4 mt-auto">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-xs font-bold">
                  {test.patient_name[0]}
                </div>
                <div>
                  <cite className="not-italic font-semibold text-slate-800 text-sm">{test.patient_name}</cite>
                  <p className="text-[11px] text-slate-400">
                    {new Date(test.created_at).toLocaleDateString(undefined, {
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </footer>
            </blockquote>
          ))}
        </div>

        <button
          onClick={() => onNavigate("contact")}
          className="self-center px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold transition min-w-[220px]"
          id="btn-home-submit-review"
        >
          Share your experience
        </button>
      </section>


      {/* Location */}
      <section className="p-8 sm:p-10 bg-[#3d1210] text-white rounded-3xl grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
        <div className="flex flex-col gap-6">
          <div>
            <SectionLabel>Visit us</SectionLabel>
            <h2 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Qaahira Denta Care, Hargeisa
            </h2>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-brand-500/15 border border-brand-500/25 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-4.5 h-4.5 text-accent-500" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-200">Address</h4>
                <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                  Hargeisa, near Dawlada Hoose ee Hargaysa
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-brand-500/15 border border-brand-500/25 flex items-center justify-center flex-shrink-0">
                <Phone className="w-4.5 h-4.5 text-accent-500" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-200">Contact</h4>
                <p className="text-sm text-slate-400 mt-1 font-mono">+252-63-6249555 | +252-63-4953675</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-brand-500/15 border border-brand-500/25 flex items-center justify-center flex-shrink-0">
                <Clock className="w-4.5 h-4.5 text-accent-500" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-200">Hours</h4>
                <div className="mt-1 space-y-1 text-sm text-slate-400">
                  <div className="flex justify-between gap-8 max-w-xs">
                    <span>Weekdays (Sat – Thu)</span>
                    <span className="text-slate-300 font-medium"> Morning: 07:00AM – 12:00PM</span>
                    <span className="text-slate-300 font-medium"> Afternoon: 04:00PM – 08:00PM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="h-[280px] sm:h-[320px] w-full rounded-2xl bg-slate-900 border border-brand-900/30 overflow-hidden relative">
          <iframe
            title="Qaahira Denta Care on Google Maps"
            src={MAP_EMBED_URL}
            className="absolute inset-0 w-full h-full border-0 grayscale-[20%] contrast-[1.05]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#3d1210]/80 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 z-10 bg-slate-950/85 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-800 text-[11px] text-slate-300 font-mono flex items-center justify-between gap-3">
            <span className="truncate">9.5616°N · 44.0718°E</span>
            <a
              href={MAP_DIRECTIONS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-500 font-semibold hover:underline flex-shrink-0 pointer-events-auto"
              id="link-google-maps"
            >
              Open in Google Maps
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
