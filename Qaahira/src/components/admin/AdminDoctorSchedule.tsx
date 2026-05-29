import React, { useEffect, useState } from "react";
import { Clock, Save, UserPlus, UserCog } from "lucide-react";
import { Doctor } from "../../types";
import DoctorScheduleGrid, {
  WEEK_DAYS,
  emptyScheduleGrid,
  gridToAvailability,
} from "./DoctorScheduleGrid";

interface AdminDoctorScheduleProps {
  doctors: Doctor[];
  onRefresh: () => void;
  onAddDoctor?: () => void;
  updatedBy?: string;
  initialDoctorId?: string;
  compact?: boolean;
}

export default function AdminDoctorSchedule({
  doctors,
  onRefresh,
  onAddDoctor,
  updatedBy = "Clinic Admin",
  initialDoctorId,
  compact = false,
}: AdminDoctorScheduleProps) {
  const [selectedId, setSelectedId] = useState(initialDoctorId ?? "");
  const [grid, setGrid] = useState<Record<string, string[]>>(emptyScheduleGrid());
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (doctors.length === 0) {
      setSelectedId("");
      setGrid(emptyScheduleGrid());
      setDirty(false);
      return;
    }
    if (initialDoctorId && doctors.some((d) => d.doctor_id === initialDoctorId)) {
      setSelectedId(initialDoctorId);
      return;
    }
    if (!selectedId || !doctors.some((d) => d.doctor_id === selectedId)) {
      setSelectedId(doctors[0].doctor_id);
    }
  }, [doctors, selectedId, initialDoctorId]);

  useEffect(() => {
    const doc = doctors.find((d) => d.doctor_id === selectedId);
    if (!doc) return;

    const next = emptyScheduleGrid();
    WEEK_DAYS.forEach((day) => {
      next[day] = [...(doc.availability[day] ?? [])];
    });
    setGrid(next);
    setDirty(false);
  }, [selectedId, doctors]);

  const handleGridChange = (next: Record<string, string[]>) => {
    setGrid(next);
    setDirty(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId) return;

    setSaving(true);
    setMessage("");
    setError("");

    const availability = gridToAvailability(grid);
    const now = new Date().toISOString();

    try {
      const res = await fetch(`/api/doctors/${selectedId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          availability,
          schedule_updated_at: now,
          schedule_updated_by: updatedBy,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to save schedule.");
      }

      setMessage("Weekly availability saved.");
      setDirty(false);
      onRefresh();
      setTimeout(() => setMessage(""), 5000);
    } catch (err: any) {
      setError(err.message || "Could not save schedule.");
    } finally {
      setSaving(false);
    }
  };

  if (doctors.length === 0) {
    return (
      <div className="text-center py-12 px-6 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
        <Clock className="w-10 h-10 text-slate-300 mx-auto mb-3" />
        <p className="text-sm font-semibold text-[#3d1210]">No doctors to schedule</p>
        <p className="text-xs text-slate-500 mt-1 mb-4">Add a doctor first, then set their weekly slots.</p>
        {onAddDoctor && (
          <button
            type="button"
            onClick={onAddDoctor}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 text-white text-sm font-semibold hover:bg-brand-500"
          >
            <UserPlus className="w-4 h-4" />
            Add doctor
          </button>
        )}
      </div>
    );
  }

  const selected = doctors.find((d) => d.doctor_id === selectedId);
  const totalSlots = WEEK_DAYS.reduce((sum, day) => sum + (grid[day]?.length ?? 0), 0);
  const lastUpdated = selected?.schedule_updated_at || selected?.updated_at;

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-6">
      {!compact && (
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-600">Schedules</p>
            <h3 className="mt-1 text-lg font-bold text-[#3d1210]">Update weekly availability</h3>
            <p className="text-sm text-slate-500 mt-1">
              Tap a time to remove it, add slots with + buttons, then save.
            </p>
          </div>
          {selected && (
            <div className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-100 text-right">
              <p className="text-xs text-slate-500">Total slots</p>
              <p className="text-xl font-bold text-[#3d1210] tabular-nums">{totalSlots}</p>
            </div>
          )}
        </div>
      )}

      {selected && lastUpdated && (
        <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-brand-50/60 border border-brand-100">
          <UserCog className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-[#3d1210]">Last schedule update</p>
            <p className="text-slate-600 mt-0.5">
              Updated by <span className="font-medium">{selected.schedule_updated_by ?? "Clinic Admin"}</span>
              {" · "}
              {new Date(lastUpdated).toLocaleString(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
            {dirty && (
              <p className="text-xs text-amber-700 mt-1">Unsaved changes — click Save weekly schedule to apply.</p>
            )}
          </div>
        </div>
      )}

      {message && (
        <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 px-4 py-3 rounded-xl">
          {message}
        </p>
      )}
      {error && (
        <p className="text-sm text-rose-700 bg-rose-50 border border-rose-100 px-4 py-3 rounded-xl">{error}</p>
      )}

      {!compact && (
        <div className="flex flex-col gap-1.5 max-w-md">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Specialist</label>
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="p-2.5 rounded-xl border border-slate-200 bg-white text-sm text-[#3d1210] focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          >
            {doctors.map((d) => (
              <option key={d.doctor_id} value={d.doctor_id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <DoctorScheduleGrid grid={grid} onChange={handleGridChange} />

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <p className="text-xs text-slate-500">
          Saving as <span className="font-semibold text-slate-700">{updatedBy}</span>
        </p>
        <button
          type="submit"
          disabled={saving || !selectedId || !dirty}
          id="btn-admin-save-schedule"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#3d1210] hover:bg-slate-800 disabled:opacity-50 text-white text-sm font-semibold transition"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving…" : "Save weekly schedule"}
        </button>
      </div>
    </form>
  );
}
