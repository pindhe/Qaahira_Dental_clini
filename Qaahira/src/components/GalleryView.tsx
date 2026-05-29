import React, { useEffect, useRef, useState } from "react";
import {
  Images,
  ArrowLeftRight,
  CheckCircle2,
  Sparkles,
  Shield,
} from "lucide-react";
import { GalleryItem } from "../types";

interface GalleryViewProps {
  items: GalleryItem[];
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-[11px] font-semibold text-brand-600 uppercase tracking-[0.14em]">
      <span className="w-6 h-px bg-accent-400" />
      {children}
    </span>
  );
}

function BeforeAfterSlider({ beforeUrl, afterUrl, title }: { beforeUrl: string; afterUrl: string; title: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const [containerWidth, setContainerWidth] = useState(0);
  const dragging = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setContainerWidth(el.offsetWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const updatePosition = (clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
    setPosition(pct);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    updatePosition(e.clientX);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    updatePosition(e.clientX);
  };

  const onPointerUp = () => {
    dragging.current = false;
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden select-none cursor-col-resize bg-slate-100 shadow-inner"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      role="img"
      aria-label={`Before and after comparison: ${title}`}
    >
      <img
        src={afterUrl}
        alt={`After: ${title}`}
        className="absolute inset-0 w-full h-full object-cover"
        referrerPolicy="no-referrer"
        draggable={false}
      />
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${position}%` }}
      >
        <img
          src={beforeUrl}
          alt={`Before: ${title}`}
          className="absolute top-0 left-0 h-full object-cover max-w-none"
          style={{ width: containerWidth ? `${containerWidth}px` : "100%" }}
          referrerPolicy="no-referrer"
          draggable={false}
        />
      </div>

      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_12px_rgba(0,0,0,0.35)] z-10"
        style={{ left: `${position}%`, transform: "translateX(-50%)" }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white border-2 border-slate-200 shadow-lg flex items-center justify-center">
          <ArrowLeftRight className="w-4 h-4 text-slate-600" />
        </div>
      </div>

      <span className="absolute top-3 left-3 bg-rose-600/90 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
        Before
      </span>
      <span className="absolute top-3 right-3 bg-emerald-600/90 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
        After
      </span>
      <span className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white text-[10px] font-medium px-2.5 py-1 rounded-full backdrop-blur-sm">
        Drag to compare
      </span>
    </div>
  );
}

function CategoryIcon() {
  return <Sparkles className="w-3.5 h-3.5" />;
}

function GalleryHero({ items }: { items: GalleryItem[] }) {
  const treatmentCount = items.length;

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#3d1210] via-slate-950 to-[#4a1511] text-white">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_70%,transparent_100%)]" />
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-accent-500/15 rounded-full blur-3xl" />

      <div className="relative z-10 p-8 sm:p-10 lg:p-12">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-accent-400 font-medium mb-5">
            <Images className="w-3.5 h-3.5" />
            Qaahira Denta Care · Portfolio
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
            Real{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-400 to-accent-300">
              before & after
            </span>{" "}
            results
          </h1>

          <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
            {items.length > 0
              ? `Browse ${treatmentCount} anonymized before and after treatment ${treatmentCount === 1 ? "comparison" : "comparisons"}.`
              : "Our portfolio is being updated. Check back soon for before and after treatment photos."}
          </p>
        </div>
      </div>

      {items.length > 0 && treatmentCount > 0 && (
        <div className="relative z-10 border-t border-white/10 bg-white/[0.03]">
          <div className="px-6 sm:px-8 py-4 sm:py-5">
            <p className="text-xl sm:text-2xl font-bold tabular-nums">{treatmentCount}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Before/after cases</p>
          </div>
        </div>
      )}
    </section>
  );
}

function TreatmentCard({ item }: { item: GalleryItem }) {
  return (
    <article className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg hover:border-accent-100 transition-all duration-300 flex flex-col">
      <div className="p-4 bg-slate-50/80 border-b border-slate-100">
        <BeforeAfterSlider
          beforeUrl={item.before_url!}
          afterUrl={item.after_url!}
          title={item.title}
        />
      </div>
      <div className="p-5 sm:p-6 flex flex-col gap-3 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-accent-700 bg-accent-50 border border-accent-100 px-2.5 py-1 rounded-full">
            <CategoryIcon />
            {item.treatment_type || "Treatment case"}
          </span>
          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
        </div>
        <h3 className="font-bold text-[#3d1210] text-base leading-snug">{item.title}</h3>
        <p className="text-sm text-slate-500 leading-relaxed flex-1">{item.description}</p>
      </div>
    </article>
  );
}

export default function GalleryView({ items }: GalleryViewProps) {
  const treatmentItems = items.filter((item) => item.category === "treatment");

  return (
    <div className="flex flex-col gap-10 pb-10" id="gallery-view-root">
      <GalleryHero items={treatmentItems} />

      {treatmentItems.length === 0 ? (
        <div className="text-center py-16 px-6 bg-white border border-dashed border-slate-200 rounded-2xl">
          <Shield className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-slate-900">Portfolio coming soon</h2>
          <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
            Before and after photos will appear here once added by the clinic team.
          </p>
        </div>
      ) : (
        <>
          <section>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <SectionLabel>Portfolio gallery</SectionLabel>
                <h2 className="mt-3 text-xl sm:text-2xl font-bold text-[#3d1210] tracking-tight">
                  Treatment transformations
                </h2>
              </div>
              <div className="flex items-center gap-3 px-4 py-3 bg-white border border-slate-100 rounded-2xl shadow-sm text-sm shrink-0">
                <span className="font-bold text-[#3d1210] tabular-nums text-lg">{treatmentItems.length}</span>
                <span className="text-slate-500">before/after cases</span>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {treatmentItems.map((item) => (
              <React.Fragment key={item.item_id}>
                <TreatmentCard item={item} />
              </React.Fragment>
            ))}
          </section>
        </>
      )}
    </div>
  );
}
