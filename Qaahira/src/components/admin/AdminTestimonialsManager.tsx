import React, { useMemo, useState } from "react";
import {
  Star,
  CheckCheck,
  Trash2,
  Search,
  RefreshCw,
  MessagesSquare,
  Clock,
  Filter,
  EyeOff,
  User,
} from "lucide-react";
import { Testimonial } from "../../types";

interface AdminTestimonialsManagerProps {
  testimonials: Testimonial[];
  onRefresh: () => void;
}

type StatusFilter = "all" | "pending" | "approved";

function formatWhen(iso: string) {
  const date = new Date(iso);
  const now = new Date();
  const sameDay =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (sameDay) {
    return `Today · ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  }
  return date.toLocaleString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`w-3.5 h-3.5 ${n <= rating ? "text-accent-500 fill-accent-500" : "text-slate-200"}`}
        />
      ))}
    </div>
  );
}

export default function AdminTestimonialsManager({ testimonials, onRefresh }: AdminTestimonialsManagerProps) {
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const sorted = useMemo(
    () =>
      [...testimonials].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ),
    [testimonials]
  );

  const stats = useMemo(() => {
    const approved = testimonials.filter((t) => t.approved);
    const avg =
      approved.length > 0
        ? approved.reduce((sum, t) => sum + t.rating, 0) / approved.length
        : 0;
    return {
      total: testimonials.length,
      pending: testimonials.filter((t) => !t.approved).length,
      approved: approved.length,
      avgRating: avg,
    };
  }, [testimonials]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return sorted.filter((t) => {
      if (filter === "pending" && t.approved) return false;
      if (filter === "approved" && !t.approved) return false;
      if (!q) return true;
      return (
        t.patient_name.toLowerCase().includes(q) ||
        t.content.toLowerCase().includes(q)
      );
    });
  }, [sorted, filter, search]);

  const selected = selectedId ? testimonials.find((t) => t.testimonial_id === selectedId) : null;

  const updateApproved = async (id: string, approved: boolean) => {
    setBusyId(id);
    setMessage("");
    try {
      const res = await fetch(`/api/testimonials/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved }),
      });
      if (!res.ok) throw new Error("Could not update review.");
      setMessage(approved ? "Review approved and published on the website." : "Review moved back to pending.");
      onRefresh();
    } catch (err: any) {
      setMessage(err.message || "Update failed.");
    } finally {
      setBusyId(null);
    }
  };

  const deleteReview = async (id: string) => {
    if (!window.confirm("Delete this review permanently?")) return;
    setBusyId(id);
    setMessage("");
    try {
      const res = await fetch(`/api/testimonials/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Could not delete review.");
      if (selectedId === id) setSelectedId(null);
      setMessage("Review deleted.");
      onRefresh();
    } catch (err: any) {
      setMessage(err.message || "Delete failed.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-lg font-bold text-[#3d1210] tracking-tight">Patient testimonials</h2>
          <p className="text-sm text-slate-500 mt-1">
            Reviews submitted from the contact page — approve before they appear on the homepage.
          </p>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total", value: stats.total, icon: MessagesSquare, tone: "text-brand-600 bg-brand-50 border-brand-100" },
          { label: "Pending", value: stats.pending, icon: Clock, tone: "text-accent-700 bg-accent-50 border-accent-100" },
          { label: "Live", value: stats.approved, icon: CheckCheck, tone: "text-emerald-700 bg-emerald-50 border-emerald-100" },
          { label: "Avg rating", value: stats.approved ? stats.avgRating.toFixed(1) : "—", icon: Star, tone: "text-slate-700 bg-slate-50 border-slate-100" },
        ].map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className={`rounded-2xl border p-4 ${tone}`}>
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-wider opacity-80">{label}</p>
              <Icon className="w-4 h-4 opacity-60" />
            </div>
            <p className="mt-2 text-2xl font-bold tabular-nums">{value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {(["all", "pending", "approved"] as StatusFilter[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                filter === key
                  ? "bg-brand-600 text-white border-brand-600"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
              }`}
            >
              {key === "all" ? <Filter className="w-3 h-3" /> : null}
              {key === "all" ? "All" : key === "pending" ? "Pending" : "Published"}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search patient or review…"
            className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>
      </div>

      {message && (
        <div className="px-4 py-3 rounded-xl bg-brand-50 border border-brand-100 text-sm text-brand-800">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 min-h-[420px]">
        <div className="lg:col-span-2 flex flex-col gap-2 max-h-[560px] overflow-y-auto pr-1">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center p-10 rounded-2xl border border-dashed border-slate-200 bg-slate-50/60">
              <MessagesSquare className="w-10 h-10 text-slate-300 mb-3" />
              <p className="text-sm font-semibold text-slate-700">No reviews yet</p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Patient reviews submitted on the contact page will appear here for moderation.
              </p>
            </div>
          ) : (
            filtered.map((t) => {
              const isActive = selectedId === t.testimonial_id;
              return (
                <button
                  key={t.testimonial_id}
                  type="button"
                  onClick={() => setSelectedId(t.testimonial_id)}
                  className={`w-full text-left p-4 rounded-2xl border transition ${
                    isActive
                      ? "border-brand-300 bg-brand-50/80 shadow-sm"
                      : "border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50/80"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-slate-900 truncate">{t.patient_name}</p>
                      <StarRow rating={t.rating} />
                    </div>
                    <span
                      className={`shrink-0 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border ${
                        t.approved
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-accent-50 text-accent-700 border-accent-200"
                      }`}
                    >
                      {t.approved ? "Live" : "Pending"}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed italic">
                    &ldquo;{t.content}&rdquo;
                  </p>
                  <p className="mt-2 text-[10px] text-slate-400 font-mono">{formatWhen(t.created_at)}</p>
                </button>
              );
            })
          )}
        </div>

        <div className="lg:col-span-3 rounded-2xl border border-slate-100 bg-white overflow-hidden flex flex-col min-h-[320px]">
          {!selected ? (
            <div className="flex-1 flex flex-col items-center justify-center p-10 text-center text-slate-400">
              <User className="w-10 h-10 mb-3 opacity-40" />
              <p className="text-sm font-medium text-slate-600">Select a review to moderate</p>
              <p className="text-xs mt-1">Approved reviews are shown on the public homepage.</p>
            </div>
          ) : (
            <>
              <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-[#3d1210]">{selected.patient_name}</h3>
                    <div className="mt-1.5">
                      <StarRow rating={selected.rating} />
                    </div>
                    <p className="text-[10px] text-slate-400 font-mono mt-2">
                      Submitted {formatWhen(selected.created_at)}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full border ${
                      selected.approved
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-accent-50 text-accent-700 border-accent-200"
                    }`}
                  >
                    {selected.approved ? "Published" : "Pending approval"}
                  </span>
                </div>
              </div>

              <div className="flex-1 p-5 overflow-y-auto">
                <p className="text-sm text-slate-700 leading-relaxed italic">
                  &ldquo;{selected.content}&rdquo;
                </p>
              </div>

              <div className="px-5 py-4 border-t border-slate-100 flex flex-wrap gap-2 bg-slate-50/30">
                {!selected.approved ? (
                  <button
                    type="button"
                    disabled={busyId === selected.testimonial_id}
                    onClick={() => updateApproved(selected.testimonial_id, true)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-500 transition disabled:opacity-50"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    Approve & publish
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={busyId === selected.testimonial_id}
                    onClick={() => updateApproved(selected.testimonial_id, false)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition disabled:opacity-50"
                  >
                    <EyeOff className="w-3.5 h-3.5" />
                    Unpublish
                  </button>
                )}
                <button
                  type="button"
                  disabled={busyId === selected.testimonial_id}
                  onClick={() => deleteReview(selected.testimonial_id)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-red-200 text-red-600 hover:bg-red-50 transition disabled:opacity-50 ml-auto"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
