import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  DollarSign,
  Clock,
  Activity,
  Calculator,
  Plus,
  Minus,
  CheckCircle2,
  Clock3,
  Stethoscope,
  Sparkles,
  Shield,
  Microscope,
  Heart,
  Layers,
  type LucideIcon,
} from "lucide-react";
import { Service } from "../types";

interface ServicesViewProps {
  services: Service[];
  onNavigateToContact: () => void;
  selectedServiceId?: string;
}

type MaterialGrade = "standard" | "premium" | "zirconia-ultra";

const MATERIAL_OPTIONS = [
  { id: "standard" as const, label: "Standard", desc: "Composite resin", multiplier: 1.0 },
  { id: "premium" as const, label: "Premium", desc: "Bio-ceramic hybrid", multiplier: 1.25 },
  { id: "zirconia-ultra" as const, label: "Ultra Zirconia", desc: "Full-contour ceramic", multiplier: 1.6 },
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-[11px] font-semibold text-brand-600 uppercase tracking-[0.14em]">
      <span className="w-6 h-px bg-accent-400" />
      {children}
    </span>
  );
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

function getBasePrice(priceStr: string): number {
  const nums = priceStr.match(/\d+[\d,]*/g);
  if (nums && nums.length > 0) {
    const val = parseInt(nums[0].replace(/,/g, ""), 10);
    return val > 0 ? val : 800;
  }
  return 800;
}

function calculateVisits(serviceId: string, teethCount: number): number {
  if (serviceId.includes("implant")) return teethCount > 3 ? 4 : 3;
  if (serviceId.includes("canal") || serviceId.includes("root")) return teethCount > 2 ? 3 : 2;
  if (serviceId.includes("aligner")) return 2;
  if (serviceId.includes("veneer")) return 2;
  return 1;
}

function getRecoveryTimeline(serviceId: string): string {
  if (serviceId.includes("implant")) return "12–16 weeks osseointegration";
  if (serviceId.includes("canal") || serviceId.includes("root")) return "1–2 days recovery";
  if (serviceId.includes("aligner")) return "Progressive over months";
  if (serviceId.includes("veneer")) return "Immediate aesthetic function";
  return "Same-day recovery";
}

function ServicesHero({ services }: { services: Service[] }) {
  const categories = [...new Set(services.map((s) => s.category))];

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#3d1210] via-slate-950 to-[#4a1511] text-white">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_70%,transparent_100%)]" />
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-brand-500/15 rounded-full blur-3xl" />

      <div className="relative z-10 p-8 sm:p-10 lg:p-12">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-accent-400 font-medium mb-5">
            <Layers className="w-3.5 h-3.5" />
            Qaahira Denta Care · Clinical Services
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
            Specialized{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-500 to-accent-300">
              restorative care
            </span>
          </h1>

          <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
            {services.length > 0
              ? `We currently offer ${services.length} ${services.length === 1 ? "treatment" : "treatments"} across ${categories.length} ${categories.length === 1 ? "department" : "departments"}. Browse pricing, clinical details, and FAQs below.`
              : "Our treatment catalogue is being updated. Please check back soon or contact the clinic directly."}
          </p>
        </div>
      </div>

      <div className="relative z-10 border-t border-white/10 bg-white/[0.03]">
        <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
          {[
            { value: String(services.length), label: "Active treatments" },
            { value: String(categories.length), label: "Clinical departments" },
          ].map(({ value, label }) => (
            <div key={label} className="px-6 sm:px-8 py-4 sm:py-5">
              <p className="text-xl sm:text-2xl font-bold tabular-nums">{value}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({
  service,
  isActive,
  onSelect,
}: {
  service: Service;
  isActive: boolean;
  onSelect: () => void;
}) {
  const Icon = getServiceIcon(service.model3D_id);

  return (
    <button
      onClick={onSelect}
      className={`w-full text-left rounded-2xl border transition-all duration-200 flex flex-col overflow-hidden group ${
        isActive
          ? "bg-[#3d1210] border-brand-800/40 text-white shadow-lg shadow-brand-950/20 ring-2 ring-brand-500/30"
          : "bg-white border-slate-100 hover:border-brand-100 hover:shadow-md text-slate-700"
      }`}
      id={`btn-service-select-${service.service_id}`}
    >
      {service.image_url ? (
        <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
          <img
            src={service.image_url}
            alt={service.service_name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          {service.price_range && (
            <span
              className={`absolute top-3 right-3 text-[10px] font-semibold px-2 py-0.5 rounded-md backdrop-blur-sm ${
                isActive ? "bg-emerald-500/90 text-white" : "bg-white/90 text-emerald-700"
              }`}
            >
              {service.price_range}
            </span>
          )}
        </div>
      ) : null}

      <div className="p-5 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
              isActive
                ? "bg-brand-500/20 text-accent-400 border border-brand-500/30"
                : "bg-slate-50 text-brand-600 border border-slate-100 group-hover:bg-brand-50 group-hover:border-brand-100"
            }`}
          >
            <Icon className="w-4 h-4" />
          </div>
          {!service.image_url && service.price_range && (
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                isActive ? "bg-emerald-500/20 text-emerald-300" : "bg-emerald-50 text-emerald-700"
              }`}
            >
              {service.price_range}
            </span>
          )}
        </div>

        <div>
          <span
            className={`text-[10px] font-semibold uppercase tracking-wider block ${
              isActive ? "text-accent-500" : "text-brand-600"
            }`}
          >
            {service.category}
          </span>
          <h3 className="font-bold text-sm mt-1">{service.service_name}</h3>
          <p className={`text-xs mt-1.5 line-clamp-2 leading-relaxed ${isActive ? "text-slate-400" : "text-slate-500"}`}>
            {service.description}
          </p>
        </div>

        {service.estimated_duration_minutes > 0 && (
          <span
            className={`inline-flex items-center gap-1 text-[10px] font-medium self-start ${
              isActive ? "text-slate-400" : "text-slate-500"
            }`}
          >
            <Clock className="w-3 h-3" />
            ~{service.estimated_duration_minutes} min
          </span>
        )}
      </div>
    </button>
  );
}

export default function ServicesView({
  services,
  onNavigateToContact,
  selectedServiceId,
}: ServicesViewProps) {
  const [activeService, setActiveService] = useState<Service | null>(
    () => services.find((s) => s.service_id === selectedServiceId) ?? services[0] ?? null
  );
  const [teethCount, setTeethCount] = useState(1);
  const [materialGrade, setMaterialGrade] = useState<MaterialGrade>("premium");
  const [includeCbct, setIncludeCbct] = useState(false);
  const [includeScan, setIncludeScan] = useState(false);
  const [configSaved, setConfigSaved] = useState(false);

  useEffect(() => {
    if (services.length === 0) {
      setActiveService(null);
      return;
    }
    if (selectedServiceId) {
      const match = services.find((s) => s.service_id === selectedServiceId);
      if (match) {
        setActiveService(match);
        return;
      }
    }
    setActiveService((prev) => {
      if (prev && services.some((s) => s.service_id === prev.service_id)) return prev;
      return services[0];
    });
  }, [selectedServiceId, services]);

  const handleSelectService = (service: Service) => {
    setActiveService(service);
    setTeethCount(1);
    setMaterialGrade("premium");
    setIncludeCbct(false);
    setIncludeScan(false);
    setConfigSaved(false);
  };

  const saveConfiguration = () => {
    setConfigSaved(true);
    setTimeout(() => setConfigSaved(false), 3500);
  };

  if (services.length === 0) {
    return (
      <div className="flex flex-col gap-10 pb-10" id="services-view-root">
        <ServicesHero services={services} />
        <div className="text-center py-16 px-6 bg-white border border-dashed border-slate-200 rounded-2xl">
          <Shield className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-slate-900">No services available yet</h2>
          <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
            Treatments will appear here once added by the clinic. Please contact us to learn about
            available procedures.
          </p>
        </div>
      </div>
    );
  }

  const materialOption = MATERIAL_OPTIONS.find((m) => m.id === materialGrade)!;
  const basePrice = getBasePrice(activeService!.price_range);
  const diagnosticCosts = (includeCbct ? 180 : 0) + (includeScan ? 120 : 0);
  const estTotal = basePrice * teethCount * materialOption.multiplier + diagnosticCosts;
  const visitCount = calculateVisits(activeService!.service_id, teethCount);
  const recoveryTimeline = getRecoveryTimeline(activeService!.service_id);
  const categories = [...new Set(services.map((s) => s.category))];

  return (
    <div className="flex flex-col gap-10 pb-10" id="services-view-root">
      <ServicesHero services={services} />

      {/* Service cards */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <SectionLabel>Our treatments</SectionLabel>
            <h2 className="mt-3 text-xl sm:text-2xl font-bold text-[#3d1210] tracking-tight">
              Select a procedure
            </h2>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed max-w-2xl">
              Choose a service below to view clinical details, configure a cost estimate, and book a consultation.
            </p>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 bg-white border border-slate-100 rounded-2xl shadow-sm text-sm shrink-0">
            <span className="font-bold text-[#3d1210] tabular-nums text-lg">{services.length}</span>
            <span className="text-slate-500">
              {services.length === 1 ? "service" : "services"} · {categories.length}{" "}
              {categories.length === 1 ? "department" : "departments"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {services.map((serv) => (
            <React.Fragment key={serv.service_id}>
              <ServiceCard
                service={serv}
                isActive={activeService?.service_id === serv.service_id}
                onSelect={() => handleSelectService(serv)}
              />
            </React.Fragment>
          ))}
        </div>
      </section>

      {activeService && (
      <section className="p-6 sm:p-8 bg-white border border-slate-100 rounded-3xl shadow-sm flex flex-col gap-8">
        {activeService.image_url && (
          <div className="relative -mx-6 -mt-6 sm:-mx-8 sm:-mt-8 mb-2 overflow-hidden rounded-t-3xl">
            <img
              src={activeService.image_url}
              alt={activeService.service_name}
              className="w-full aspect-[21/9] object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#3d1210]/70 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
              <span className="inline-flex items-center gap-2 text-[11px] font-semibold text-brand-200 uppercase tracking-[0.14em]">
                <span className="w-6 h-px bg-accent-400/80" />
                Clinical overview
              </span>
              <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {activeService.service_name}
              </h2>
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="max-w-xl">
            {!activeService.image_url && (
              <>
                <SectionLabel>Clinical overview</SectionLabel>
                <h2 className="mt-2 text-2xl font-bold text-[#3d1210] tracking-tight">
                  {activeService.service_name}
                </h2>
              </>
            )}
            {activeService.image_url && (
              <h2 className="sr-only">{activeService.service_name}</h2>
            )}
            <p className={`text-sm text-slate-500 leading-relaxed ${activeService.image_url ? "" : "mt-2"}`}>
              {activeService.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-3.5 py-2 rounded-xl text-sm text-slate-700">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>{activeService.estimated_duration_minutes} min</span>
            </div>
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-3.5 py-2 rounded-xl text-sm font-semibold text-emerald-700">
              <DollarSign className="w-4 h-4" />
              <span>{activeService.price_range}</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-slate-900">What to expect</h3>
          <p className="text-sm text-slate-500 leading-relaxed mt-2">{activeService.detailed_info}</p>
        </div>

        {/* Cost estimator */}
        <div className="rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-50/40 to-white p-5 sm:p-6 space-y-6">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-brand-600" />
            <div>
              <h3 className="font-bold text-sm text-[#3d1210]">Treatment cost estimator</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Configure your plan for a personalized budget estimate. Final pricing confirmed at consultation.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-5">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-2">
                  Treatment units
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setTeethCount((prev) => Math.max(1, prev - 1))}
                    className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition text-slate-600"
                    aria-label="Decrease units"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-mono text-lg font-bold w-8 text-center text-[#3d1210]">
                    {teethCount}
                  </span>
                  <button
                    onClick={() => setTeethCount((prev) => Math.min(14, prev + 1))}
                    className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition text-slate-600"
                    aria-label="Increase units"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <span className="text-xs text-slate-400">Max 14 units</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-2">
                  Material grade
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {MATERIAL_OPTIONS.map((lvl) => (
                    <button
                      key={lvl.id}
                      onClick={() => setMaterialGrade(lvl.id)}
                      className={`p-3 rounded-xl text-left border transition ${
                        materialGrade === lvl.id
                          ? "bg-[#3d1210] border-[#3d1210] text-white shadow-md"
                          : "bg-white border-slate-150 text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      <span className="font-semibold text-[11px] block">{lvl.label}</span>
                      <span className="text-[10px] mt-0.5 block text-slate-400">{lvl.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-2">
                  Diagnostic add-ons
                </label>
                <div className="space-y-2.5">
                  <label className="flex items-start gap-2.5 text-sm text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeCbct}
                      onChange={(e) => setIncludeCbct(e.target.checked)}
                      className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 mt-0.5"
                    />
                    <span>CBCT bone scan <span className="text-slate-400">(+$180)</span></span>
                  </label>
                  <label className="flex items-start gap-2.5 text-sm text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeScan}
                      onChange={(e) => setIncludeScan(e.target.checked)}
                      className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 mt-0.5"
                    />
                    <span>CAD/CAM digital impression <span className="text-slate-400">(+$120)</span></span>
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl p-5 flex flex-col justify-between gap-5">
              <div className="space-y-3">
                <span className="text-[10px] uppercase font-semibold tracking-widest text-slate-400">
                  Cost breakdown
                </span>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-slate-500">
                    <span>Base unit cost</span>
                    <span className="font-mono">${basePrice}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Units × {teethCount}</span>
                    <span className="font-mono">${(basePrice * teethCount).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>{materialOption.label} material</span>
                    <span className="font-mono">×{materialOption.multiplier.toFixed(2)}</span>
                  </div>
                  {diagnosticCosts > 0 && (
                    <div className="flex justify-between text-slate-500">
                      <span>Diagnostics</span>
                      <span className="font-mono">+${diagnosticCosts}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <span className="text-[10px] uppercase font-semibold tracking-widest text-slate-500">
                  Estimated total
                </span>
                <p className="text-3xl font-bold font-mono text-brand-600 tracking-tight mt-1">
                  ${Math.round(estTotal).toLocaleString()}
                </p>

                <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-50 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Clock3 className="w-3.5 h-3.5 text-slate-400" />
                    <span>{visitCount} visits</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-slate-400" />
                    <span>{recoveryTimeline}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={saveConfiguration}
                  className="w-full py-2.5 bg-[#3d1210] hover:bg-[#14234b] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition"
                >
                  Save configuration
                </button>
                {configSaved && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-medium rounded-xl flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    Configuration saved
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={onNavigateToContact}
          className="w-full py-4 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-brand-600/20 hover:shadow-brand-500/25"
          id="btn-service-contact-cta"
        >
          Contact us about {activeService.service_name}
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>
      )}
    </div>
  );
}
