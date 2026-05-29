import React, { useMemo, useState } from "react";
import {
  Mail,
  Phone,
  Trash2,
  CheckCheck,
  Archive,
  Inbox,
  Search,
  RefreshCw,
  MessageSquare,
  Clock,
  Filter,
  RotateCcw,
} from "lucide-react";
import { ContactSubmission } from "../../types";

interface AdminMessagesManagerProps {
  submissions: ContactSubmission[];
  onRefresh: () => void;
}

type StatusFilter = "all" | "new" | "read" | "archived";

function submissionStatus(sub: ContactSubmission): "new" | "read" | "archived" {
  return sub.status ?? "new";
}

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

const STATUS_LABELS: Record<"new" | "read" | "archived", string> = {
  new: "New",
  read: "Read",
  archived: "Archived",
};

const STATUS_STYLES: Record<"new" | "read" | "archived", string> = {
  new: "bg-accent-50 text-accent-700 border-accent-200",
  read: "bg-brand-50 text-brand-700 border-brand-200",
  archived: "bg-slate-100 text-slate-600 border-slate-200",
};

export default function AdminMessagesManager({ submissions, onRefresh }: AdminMessagesManagerProps) {
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const sorted = useMemo(
    () =>
      [...submissions].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ),
    [submissions]
  );

  const stats = useMemo(() => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    return {
      total: submissions.length,
      new: submissions.filter((s) => submissionStatus(s) === "new").length,
      read: submissions.filter((s) => submissionStatus(s) === "read").length,
      today: submissions.filter((s) => new Date(s.created_at) >= todayStart).length,
    };
  }, [submissions]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return sorted.filter((sub) => {
      const status = submissionStatus(sub);
      if (filter !== "all" && status !== filter) return false;
      if (!q) return true;
      return (
        sub.name.toLowerCase().includes(q) ||
        sub.email.toLowerCase().includes(q) ||
        (sub.phone ?? "").toLowerCase().includes(q) ||
        sub.message.toLowerCase().includes(q)
      );
    });
  }, [sorted, filter, search]);

  const selected = selectedId ? submissions.find((s) => s.submission_id === selectedId) : null;

  const updateStatus = async (id: string, status: "new" | "read" | "archived") => {
    setBusyId(id);
    setMessage("");
    try {
      const res = await fetch(`/api/submissions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Could not update message.");
      setMessage(status === "read" ? "Marked as read." : status === "archived" ? "Message archived." : "Message restored.");
      onRefresh();
    } catch (err: any) {
      setMessage(err.message || "Update failed.");
    } finally {
      setBusyId(null);
    }
  };

  const deleteMessage = async (id: string) => {
    if (!window.confirm("Delete this message permanently?")) return;
    setBusyId(id);
    setMessage("");
    try {
      const res = await fetch(`/api/submissions/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Could not delete message.");
      if (selectedId === id) setSelectedId(null);
      setMessage("Message deleted.");
      onRefresh();
    } catch (err: any) {
      setMessage(err.message || "Delete failed.");
    } finally {
      setBusyId(null);
    }
  };

  const openMessage = (sub: ContactSubmission) => {
    setSelectedId(sub.submission_id);
    if (submissionStatus(sub) === "new") {
      void updateStatus(sub.submission_id, "read");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-lg font-bold text-[#3d1210] tracking-tight">Contact messages</h2>
          <p className="text-sm text-slate-500 mt-1">
            Live inquiries from the public contact form — no sample data.
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
          { label: "Total", value: stats.total, icon: Inbox, tone: "text-brand-600 bg-brand-50 border-brand-100" },
          { label: "New", value: stats.new, icon: MessageSquare, tone: "text-accent-700 bg-accent-50 border-accent-100" },
          { label: "Read", value: stats.read, icon: CheckCheck, tone: "text-brand-700 bg-brand-50 border-brand-100" },
          { label: "Today", value: stats.today, icon: Clock, tone: "text-slate-700 bg-slate-50 border-slate-100" },
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
          {(["all", "new", "read", "archived"] as StatusFilter[]).map((key) => (
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
              {key === "all" ? "All" : STATUS_LABELS[key]}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, message…"
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
              <MessageSquare className="w-10 h-10 text-slate-300 mb-3" />
              <p className="text-sm font-semibold text-slate-700">No messages yet</p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                When patients submit the contact form on the website, their inquiries will appear here in real time.
              </p>
            </div>
          ) : (
            filtered.map((sub) => {
              const status = submissionStatus(sub);
              const isActive = selectedId === sub.submission_id;
              return (
                <button
                  key={sub.submission_id}
                  type="button"
                  onClick={() => openMessage(sub)}
                  className={`w-full text-left p-4 rounded-2xl border transition ${
                    isActive
                      ? "border-brand-300 bg-brand-50/80 shadow-sm"
                      : "border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50/80"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-slate-900 truncate">{sub.name}</p>
                      <p className="text-xs text-slate-500 truncate mt-0.5">{sub.email}</p>
                    </div>
                    <span
                      className={`shrink-0 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border ${STATUS_STYLES[status]}`}
                    >
                      {STATUS_LABELS[status]}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">{sub.message}</p>
                  <p className="mt-2 text-[10px] text-slate-400 font-mono">{formatWhen(sub.created_at)}</p>
                </button>
              );
            })
          )}
        </div>

        <div className="lg:col-span-3 rounded-2xl border border-slate-100 bg-white overflow-hidden flex flex-col min-h-[320px]">
          {!selected ? (
            <div className="flex-1 flex flex-col items-center justify-center p-10 text-center text-slate-400">
              <Mail className="w-10 h-10 mb-3 opacity-40" />
              <p className="text-sm font-medium text-slate-600">Select a message to read</p>
              <p className="text-xs mt-1">Opening a new message automatically marks it as read.</p>
            </div>
          ) : (
            <>
              <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-[#3d1210]">{selected.name}</h3>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-slate-500">
                      <a
                        href={`mailto:${selected.email}`}
                        className="inline-flex items-center gap-1 hover:text-brand-600 transition"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        {selected.email}
                      </a>
                      {selected.phone && (
                        <a
                          href={`tel:${selected.phone.replace(/\s/g, "")}`}
                          className="inline-flex items-center gap-1 hover:text-brand-600 transition"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          {selected.phone}
                        </a>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 font-mono mt-2">
                      Received {formatWhen(selected.created_at)}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full border ${STATUS_STYLES[submissionStatus(selected)]}`}
                  >
                    {STATUS_LABELS[submissionStatus(selected)]}
                  </span>
                </div>
              </div>

              <div className="flex-1 p-5 overflow-y-auto">
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              </div>

              <div className="px-5 py-4 border-t border-slate-100 flex flex-wrap gap-2 bg-slate-50/30">
                <a
                  href={`mailto:${selected.email}?subject=${encodeURIComponent("Re: Your inquiry — Qaahira Denta Care")}`}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-brand-600 text-white hover:bg-brand-700 transition"
                >
                  <Mail className="w-3.5 h-3.5" />
                  Reply by email
                </a>
                {submissionStatus(selected) !== "read" && (
                  <button
                    type="button"
                    disabled={busyId === selected.submission_id}
                    onClick={() => updateStatus(selected.submission_id, "read")}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition disabled:opacity-50"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    Mark read
                  </button>
                )}
                {submissionStatus(selected) !== "archived" ? (
                  <button
                    type="button"
                    disabled={busyId === selected.submission_id}
                    onClick={() => updateStatus(selected.submission_id, "archived")}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition disabled:opacity-50"
                  >
                    <Archive className="w-3.5 h-3.5" />
                    Archive
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={busyId === selected.submission_id}
                    onClick={() => updateStatus(selected.submission_id, "new")}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition disabled:opacity-50"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Restore
                  </button>
                )}
                <button
                  type="button"
                  disabled={busyId === selected.submission_id}
                  onClick={() => deleteMessage(selected.submission_id)}
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
