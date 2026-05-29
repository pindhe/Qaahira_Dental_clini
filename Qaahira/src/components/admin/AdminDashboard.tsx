import React from "react";
import {
  MessagesSquare,
  FileText,
  Users,
  Stethoscope,
  Settings,
  ArrowRight,
  Clock,
  Images,
  Star,
} from "lucide-react";
import { Testimonial, ContactSubmission, Doctor, Service, GalleryItem } from "../../types";
import { AdminTab } from "./adminTypes";

interface AdminDashboardProps {
  testimonials: Testimonial[];
  submissions: ContactSubmission[];
  doctors: Doctor[];
  services: Service[];
  gallery: GalleryItem[];
  onNavigate: (tab: AdminTab) => void;
}

export default function AdminDashboard({
  testimonials,
  submissions,
  doctors,
  services,
  gallery,
  onNavigate,
}: AdminDashboardProps) {
  const pendingReviews = testimonials.filter((t) => !t.approved);
  const newMessages = submissions.filter((s) => (s.status ?? "new") === "new");
  const publishedGallery = gallery.filter((g) => g.published).length;
  const approvedReviews = testimonials.filter((t) => t.approved);
  const avgRating =
    approvedReviews.length > 0
      ? approvedReviews.reduce((sum, t) => sum + t.rating, 0) / approvedReviews.length
      : 0;

  const stats = [
    {
      label: "Reviews queue",
      value: pendingReviews.length,
      sub: "Awaiting approval",
      icon: MessagesSquare,
      tab: "testimonials" as AdminTab,
      bg: "bg-accent-50 border-accent-100",
      text: "text-accent-700",
    },
    {
      label: "New messages",
      value: newMessages.length,
      sub: `${submissions.length} total inquiries`,
      icon: FileText,
      tab: "submissions" as AdminTab,
      bg: "bg-brand-50 border-brand-100",
      text: "text-brand-700",
    },
    {
      label: "Live services",
      value: services.length,
      sub: "On public site",
      icon: Stethoscope,
      tab: "services" as AdminTab,
      bg: "bg-emerald-50 border-emerald-100",
      text: "text-emerald-700",
    },
    {
      label: "Portfolio items",
      value: publishedGallery,
      sub: `${gallery.length} total`,
      icon: Images,
      tab: "gallery" as AdminTab,
      bg: "bg-slate-50 border-slate-100",
      text: "text-slate-700",
    },
  ];

  const quickActions = [
    { label: "System settings", desc: "Clinic info & hours", tab: "system" as AdminTab, icon: Settings },
    { label: "Manage services", desc: `${services.length} treatments live`, tab: "services" as AdminTab, icon: Stethoscope },
    { label: "Doctor schedules", desc: `${doctors.length} specialists`, tab: "doctors" as AdminTab, icon: Users },
    { label: "Publish article", desc: "Blog & education", tab: "publish" as AdminTab, icon: FileText },
  ];

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <p className="text-sm text-slate-500">{greeting()}</p>
          <h2 className="mt-1 text-2xl sm:text-3xl font-bold text-[#3d1210] tracking-tight">
            Clinic dashboard
          </h2>
          <p className="mt-2 text-sm text-slate-500 flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            {new Date().toLocaleDateString(undefined, {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-100">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold text-emerald-700">System online</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(({ label, value, sub, icon: Icon, tab, bg, text }) => (
          <button
            key={label}
            type="button"
            onClick={() => onNavigate(tab)}
            className={`group p-5 rounded-2xl border ${bg} text-left hover:shadow-md transition-all hover:-translate-y-0.5`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className={`p-2 rounded-xl bg-white/80 ${text}`}>
                <Icon className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all" />
            </div>
            <p className="mt-4 text-3xl font-bold text-[#3d1210] tabular-nums">{value}</p>
            <p className="text-sm font-semibold text-slate-700 mt-1">{label}</p>
            <p className="text-xs text-slate-500 mt-0.5">{sub}</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 rounded-2xl border border-slate-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 className="text-sm font-bold text-[#3d1210]">Pending patient reviews</h3>
            <button
              type="button"
              onClick={() => onNavigate("testimonials")}
              className="text-xs font-semibold text-brand-600 hover:text-brand-500"
            >
              View all
            </button>
          </div>
          <div className="divide-y divide-slate-100">
            {pendingReviews.length === 0 ? (
              <p className="p-8 text-sm text-slate-400 text-center">No reviews awaiting approval.</p>
            ) : (
              pendingReviews.slice(0, 5).map((review) => (
                <div
                  key={review.testimonial_id}
                  className="px-5 py-4 flex items-start justify-between gap-4 hover:bg-slate-50/50"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{review.patient_name}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star
                          key={n}
                          className={`w-3 h-3 ${n <= review.rating ? "text-accent-500 fill-accent-500" : "text-slate-200"}`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 italic">&ldquo;{review.content}&rdquo;</p>
                  </div>
                  <span className="flex-shrink-0 px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-accent-50 text-accent-700 border border-accent-100">
                    Pending
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="lg:col-span-2 flex flex-col gap-6">
          {approvedReviews.length > 0 && (
            <div className="rounded-2xl border border-slate-100 p-5 bg-gradient-to-br from-brand-50/50 to-accent-50/30">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Patient satisfaction</p>
              <p className="mt-2 text-3xl font-bold text-[#3d1210] tabular-nums">
                {avgRating.toFixed(1)}
                <span className="text-base font-medium text-slate-500"> / 5</span>
              </p>
              <p className="text-xs text-slate-500 mt-1">{approvedReviews.length} published reviews</p>
            </div>
          )}

          <div className="rounded-2xl border border-slate-100 overflow-hidden flex-1">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-sm font-bold text-[#3d1210]">Quick actions</h3>
            </div>
            <div className="p-3 space-y-2">
              {quickActions.map(({ label, desc, tab, icon: Icon }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => onNavigate(tab)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition text-left group"
                >
                  <div className="p-2 rounded-lg bg-brand-900 text-white group-hover:bg-brand-600 transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800">{label}</p>
                    <p className="text-xs text-slate-500 truncate">{desc}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-brand-500 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
