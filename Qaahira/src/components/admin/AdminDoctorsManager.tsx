import React, { useMemo, useState } from "react";
import {
  Users,
  Plus,
  Search,
  RefreshCw,
  Pencil,
  Trash2,
  Clock,
  ArrowLeft,
  Save,
  User,
  Award,
  Calendar,
  ArrowRight,
  Check,
  UserCircle,
} from "lucide-react";
import { Doctor } from "../../types";
import AdminPhotoUpload from "./AdminPhotoUpload";
import AdminDoctorSchedule from "./AdminDoctorSchedule";
import DoctorScheduleGrid, {
  emptyScheduleGrid,
  gridToAvailability,
  countGridSlots,
} from "./DoctorScheduleGrid";

interface AdminDoctorsManagerProps {
  doctors: Doctor[];
  onRefresh: () => void;
}

type ViewMode = "list" | "create" | "edit" | "schedule";
type CreateStep = 1 | 2;

const EMPTY_FORM = {
  name: "",
  specialization: "",
  qualifications: "",
  bio: "",
  profile_picture_url: "",
};

const inputClass =
  "p-2.5 border border-slate-200 bg-white text-sm rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 w-full";

function countSlots(doc: Doctor): number {
  return Object.values(doc.availability ?? {}).reduce((sum, slots) => sum + slots.length, 0);
}

function activeDays(doc: Doctor): number {
  return Object.values(doc.availability ?? {}).filter((slots) => slots.length > 0).length;
}

function CreateStepIndicator({ step }: { step: CreateStep }) {
  const steps = [
    { n: 1 as const, label: "L1 · Info", desc: "Profile details" },
    { n: 2 as const, label: "L2 · Time", desc: "Weekly schedule" },
  ];

  return (
    <div className="flex items-center gap-2 sm:gap-4">
      {steps.map(({ n, label, desc }, i) => {
        const done = step > n;
        const active = step === n;
        return (
          <React.Fragment key={n}>
            {i > 0 && (
              <div
                className={`hidden sm:block flex-1 h-0.5 max-w-16 rounded-full ${
                  done || active ? "bg-brand-400" : "bg-slate-200"
                }`}
              />
            )}
            <div className="flex items-center gap-2">
              <span
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  done
                    ? "bg-emerald-500 text-white"
                    : active
                    ? "bg-brand-600 text-white ring-4 ring-brand-100"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {done ? <Check className="w-4 h-4" /> : n}
              </span>
              <div className="hidden sm:block min-w-0">
                <p className={`text-xs font-bold ${active ? "text-brand-700" : done ? "text-emerald-700" : "text-slate-400"}`}>
                  {label}
                </p>
                <p className="text-[10px] text-slate-400">{desc}</p>
              </div>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default function AdminDoctorsManager({ doctors, onRefresh }: AdminDoctorsManagerProps) {
  const [view, setView] = useState<ViewMode>("list");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [photoError, setPhotoError] = useState("");
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [createStep, setCreateStep] = useState<CreateStep>(1);
  const [scheduleGrid, setScheduleGrid] = useState<Record<string, string[]>>(emptyScheduleGrid());

  const sorted = useMemo(
    () => [...doctors].sort((a, b) => a.name.localeCompare(b.name)),
    [doctors]
  );

  const stats = useMemo(() => {
    const totalSlots = doctors.reduce((sum, d) => sum + countSlots(d), 0);
    return {
      total: doctors.length,
      totalSlots,
      avgSlots: doctors.length ? Math.round(totalSlots / doctors.length) : 0,
    };
  }, [doctors]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return sorted;
    return sorted.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.specialization.toLowerCase().includes(q) ||
        d.qualifications.toLowerCase().includes(q)
    );
  }, [sorted, search]);

  const selected = selectedId ? doctors.find((d) => d.doctor_id === selectedId) : null;

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditId(null);
    setPhotoError("");
    setError("");
    setCreateStep(1);
    setScheduleGrid(emptyScheduleGrid());
  };

  const validateStep1 = () => {
    if (!form.name.trim() || !form.specialization.trim() || !form.qualifications.trim() || !form.bio.trim()) {
      setError("Please fill in name, specialization, qualifications, and bio.");
      return false;
    }
    setError("");
    return true;
  };

  const goToStep2 = () => {
    if (!validateStep1()) return;
    setCreateStep(2);
  };

  const openCreate = () => {
    resetForm();
    setView("create");
    setSelectedId(null);
  };

  const openEdit = (doc: Doctor) => {
    setForm({
      name: doc.name,
      specialization: doc.specialization,
      qualifications: doc.qualifications,
      bio: doc.bio,
      profile_picture_url: doc.profile_picture_url,
    });
    setEditId(doc.doctor_id);
    setView("edit");
    setPhotoError("");
    setError("");
  };

  const openSchedule = (id: string) => {
    setSelectedId(id);
    setView("schedule");
  };

  const backToList = () => {
    setView("list");
    resetForm();
  };

  const handleCreateDoctor = async () => {
    if (!validateStep1()) {
      setCreateStep(1);
      return;
    }

    const slotCount = countGridSlots(scheduleGrid);
    if (slotCount === 0) {
      setError("Add at least one time slot on L2 before creating the doctor.");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    const now = new Date().toISOString();
    const payload = {
      name: form.name.trim(),
      specialization: form.specialization.trim(),
      qualifications: form.qualifications.trim(),
      bio: form.bio.trim(),
      profile_picture_url: form.profile_picture_url.trim(),
      availability: gridToAvailability(scheduleGrid),
      schedule_updated_at: now,
      schedule_updated_by: "Clinic Admin",
    };

    try {
      const res = await fetch("/api/doctors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Could not create doctor.");
      }

      const saved = await res.json();
      setMessage(`${saved.name} created with ${slotCount} weekly slots.`);
      onRefresh();
      setSelectedId(saved.doctor_id);
      setView("list");
      resetForm();
    } catch (err: any) {
      setError(err.message || "Create failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.specialization.trim() || !form.qualifications.trim() || !form.bio.trim()) {
      setError("Please fill in name, specialization, qualifications, and bio.");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    const payload = {
      name: form.name.trim(),
      specialization: form.specialization.trim(),
      qualifications: form.qualifications.trim(),
      bio: form.bio.trim(),
      profile_picture_url: form.profile_picture_url.trim(),
    };

    try {
      const res = await fetch(`/api/doctors/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Could not save doctor profile.");
      }

      setMessage("Doctor profile updated.");
      onRefresh();
      setSelectedId(editId);
      setView("list");
      resetForm();
    } catch (err: any) {
      setError(err.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const deleteDoctor = async (id: string) => {
    if (!window.confirm("Remove this doctor from the website permanently?")) return;
    setBusyId(id);
    setMessage("");
    try {
      const res = await fetch(`/api/doctors/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Could not delete doctor.");
      if (selectedId === id) setSelectedId(null);
      setMessage("Doctor removed.");
      onRefresh();
      if (view !== "list") backToList();
    } catch (err: any) {
      setMessage(err.message || "Delete failed.");
    } finally {
      setBusyId(null);
    }
  };

  if (view === "create") {
    const slotCount = countGridSlots(scheduleGrid);

    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <button
              type="button"
              onClick={backToList}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-600 mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to team
            </button>
            <h2 className="text-lg font-bold text-[#3d1210] tracking-tight">Add new doctor</h2>
            <p className="text-sm text-slate-500 mt-1">
              Step {createStep} of 2 — {createStep === 1 ? "enter profile information" : "set weekly availability, then create"}.
            </p>
          </div>
          <CreateStepIndicator step={createStep} />
        </div>

        {error && (
          <p className="text-sm text-rose-700 bg-rose-50 border border-rose-100 p-3 rounded-xl">{error}</p>
        )}

        {createStep === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-brand-50 border border-brand-100 w-fit">
                <UserCircle className="w-4 h-4 text-brand-600" />
                <span className="text-xs font-semibold text-brand-700">L1 · Doctor information</span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-700">Full name *</label>
                  <input
                    className={inputClass}
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Dr. Sarah Mansour"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-700">Specialization *</label>
                  <input
                    className={inputClass}
                    value={form.specialization}
                    onChange={(e) => setForm((f) => ({ ...f, specialization: e.target.value }))}
                    placeholder="Pediatric & Endodontic Specialist"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-700">Qualifications *</label>
                  <input
                    className={inputClass}
                    value={form.qualifications}
                    onChange={(e) => setForm((f) => ({ ...f, qualifications: e.target.value }))}
                    placeholder="BDS, MSc Pediatric Dentistry"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-700">Professional bio *</label>
                  <textarea
                    className={`${inputClass} min-h-[120px]`}
                    value={form.bio}
                    onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                    placeholder="Clinical background, approach, and areas of expertise…"
                  />
                </div>
              </div>

              <AdminPhotoUpload
                value={form.profile_picture_url}
                onChange={(url) => {
                  setForm((f) => ({ ...f, profile_picture_url: url }));
                  setPhotoError("");
                }}
                onError={setPhotoError}
              />
              {photoError && (
                <p className="text-xs text-rose-600 bg-rose-50 border border-rose-100 px-3 py-2 rounded-lg">
                  {photoError}
                </p>
              )}
            </div>

            <div className="lg:col-span-5">
              <div className="sticky top-4 rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm">
                <div className="aspect-[4/3] bg-slate-100 relative">
                  {form.profile_picture_url ? (
                    <img
                      src={form.profile_picture_url}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <User className="w-16 h-16" />
                    </div>
                  )}
                </div>
                <div className="p-4 space-y-2">
                  <p className="font-bold text-[#3d1210]">{form.name || "Doctor name"}</p>
                  <p className="text-xs font-semibold text-brand-600 uppercase tracking-wide">
                    {form.specialization || "Specialization"}
                  </p>
                  <p className="text-[11px] text-slate-500 line-clamp-3">{form.bio || "Bio preview…"}</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-12 flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={backToList}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={goToStep2}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold"
              >
                Next: L2 · Time
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {createStep === 2 && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-3 min-w-0">
                {form.profile_picture_url ? (
                  <img
                    src={form.profile_picture_url}
                    alt=""
                    className="w-12 h-12 rounded-xl object-cover bg-slate-200 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-brand-100 flex items-center justify-center shrink-0">
                    <User className="w-6 h-6 text-brand-600" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-semibold text-[#3d1210] truncate">{form.name}</p>
                  <p className="text-xs text-brand-600 truncate">{form.specialization}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-accent-50 border border-accent-100">
                <Clock className="w-4 h-4 text-accent-600" />
                <span className="text-xs font-semibold text-accent-700">
                  L2 · Time · {slotCount} slot{slotCount !== 1 ? "s" : ""} selected
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-brand-50 border border-brand-100 w-fit">
              <Clock className="w-4 h-4 text-brand-600" />
              <span className="text-xs font-semibold text-brand-700">L2 · Weekly schedule</span>
            </div>

            <p className="text-sm text-slate-500">
              Add available times for each day. Tap + to add a slot, tap a slot to remove it.
            </p>

            <DoctorScheduleGrid grid={scheduleGrid} onChange={setScheduleGrid} />

            <div className="flex flex-wrap justify-between gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setCreateStep(1);
                  setError("");
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                <ArrowLeft className="w-4 h-4" />
                Back: L1 · Info
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={backToList}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreateDoctor}
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white text-sm font-semibold"
                >
                  <Plus className="w-4 h-4" />
                  {saving ? "Creating…" : "Create doctor"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (view === "edit") {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <button
              type="button"
              onClick={backToList}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-600 mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to team
            </button>
            <h2 className="text-lg font-bold text-[#3d1210] tracking-tight">Edit doctor profile</h2>
            <p className="text-sm text-slate-500 mt-1">
              Profile details appear on the public Doctors page.
            </p>
          </div>
        </div>

        {error && (
          <p className="text-sm text-rose-700 bg-rose-50 border border-rose-100 p-3 rounded-xl">{error}</p>
        )}

        <form onSubmit={handleSaveProfile} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-slate-700">Full name *</label>
                <input
                  className={inputClass}
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Dr. Sarah Mansour"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-slate-700">Specialization *</label>
                <input
                  className={inputClass}
                  value={form.specialization}
                  onChange={(e) => setForm((f) => ({ ...f, specialization: e.target.value }))}
                  placeholder="Pediatric & Endodontic Specialist"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-slate-700">Qualifications *</label>
                <input
                  className={inputClass}
                  value={form.qualifications}
                  onChange={(e) => setForm((f) => ({ ...f, qualifications: e.target.value }))}
                  placeholder="BDS, MSc Pediatric Dentistry"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-slate-700">Professional bio *</label>
                <textarea
                  className={`${inputClass} min-h-[120px]`}
                  value={form.bio}
                  onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                  placeholder="Clinical background, approach, and areas of expertise…"
                  required
                />
              </div>
            </div>

            <AdminPhotoUpload
              value={form.profile_picture_url}
              onChange={(url) => {
                setForm((f) => ({ ...f, profile_picture_url: url }));
                setPhotoError("");
              }}
              onError={setPhotoError}
            />
            {photoError && (
              <p className="text-xs text-rose-600 bg-rose-50 border border-rose-100 px-3 py-2 rounded-lg">
                {photoError}
              </p>
            )}
          </div>

          <div className="lg:col-span-5">
            <div className="sticky top-4 rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm">
              <div className="aspect-[4/3] bg-slate-100 relative">
                {form.profile_picture_url ? (
                  <img
                    src={form.profile_picture_url}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <User className="w-16 h-16" />
                  </div>
                )}
              </div>
              <div className="p-4 space-y-2">
                <p className="font-bold text-[#3d1210]">{form.name || "Doctor name"}</p>
                <p className="text-xs font-semibold text-brand-600 uppercase tracking-wide">
                  {form.specialization || "Specialization"}
                </p>
                <p className="text-[11px] text-slate-500 line-clamp-3">{form.bio || "Bio preview…"}</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-12 flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={backToList}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-60 text-white text-sm font-semibold"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  if (view === "schedule" && selected) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <button
              type="button"
              onClick={backToList}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-600 mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to team
            </button>
            <h2 className="text-lg font-bold text-[#3d1210] tracking-tight">Weekly schedule</h2>
            <p className="text-sm text-slate-500 mt-1">
              {selected.name} · {countSlots(selected)} slots across {activeDays(selected)} days
            </p>
          </div>
          <div className="px-3 py-2 rounded-xl bg-brand-50 border border-brand-100 text-right">
            <p className="text-xs text-brand-600">Shown on Doctors page</p>
            <p className="text-sm font-semibold text-[#3d1210]">{selected.specialization}</p>
          </div>
        </div>

        <AdminDoctorSchedule
          doctors={doctors}
          onRefresh={onRefresh}
          onAddDoctor={openCreate}
          initialDoctorId={selected.doctor_id}
          compact
          updatedBy="Clinic Admin"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-lg font-bold text-[#3d1210] tracking-tight">Clinical team</h2>
          <p className="text-sm text-slate-500 mt-1">
            Manage specialist profiles and weekly availability on the public Doctors page.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onRefresh}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-brand-600 text-white hover:bg-brand-500"
          >
            <Plus className="w-3.5 h-3.5" />
            Add doctor
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { label: "Doctors", value: stats.total, icon: Users, tone: "text-brand-600 bg-brand-50 border-brand-100" },
          { label: "Weekly slots", value: stats.totalSlots, icon: Calendar, tone: "text-accent-700 bg-accent-50 border-accent-100" },
          { label: "Avg slots / doctor", value: stats.avgSlots, icon: Clock, tone: "text-slate-700 bg-slate-50 border-slate-100" },
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

      {message && (
        <div className="px-4 py-3 rounded-xl bg-brand-50 border border-brand-100 text-sm text-brand-800">
          {message}
        </div>
      )}

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or specialty…"
          className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 min-h-[420px]">
        <div className="lg:col-span-2 flex flex-col gap-2 max-h-[560px] overflow-y-auto pr-1">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center p-10 rounded-2xl border border-dashed border-slate-200 bg-slate-50/60">
              <Users className="w-10 h-10 text-slate-300 mb-3" />
              <p className="text-sm font-semibold text-slate-700">No doctors yet</p>
              <p className="text-xs text-slate-500 mt-1 mb-4 max-w-xs">
                Add your first specialist to show the clinical team on the website.
              </p>
              <button
                type="button"
                onClick={openCreate}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-semibold"
              >
                <Plus className="w-3.5 h-3.5" />
                Add doctor
              </button>
            </div>
          ) : (
            filtered.map((doc) => {
              const isActive = selectedId === doc.doctor_id;
              const slots = countSlots(doc);
              return (
                <button
                  key={doc.doctor_id}
                  type="button"
                  onClick={() => setSelectedId(doc.doctor_id)}
                  className={`w-full text-left p-3 rounded-2xl border transition flex gap-3 ${
                    isActive
                      ? "border-brand-300 bg-brand-50/80 shadow-sm"
                      : "border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50/80"
                  }`}
                >
                  <img
                    src={doc.profile_picture_url}
                    alt=""
                    className="w-12 h-12 rounded-xl object-cover bg-slate-100 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm text-slate-900 truncate">{doc.name}</p>
                    <p className="text-[11px] text-brand-600 truncate mt-0.5">{doc.specialization}</p>
                    <p className="text-[10px] text-slate-400 mt-1">
                      {slots} slots · {activeDays(doc)} days
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>

        <div className="lg:col-span-3 rounded-2xl border border-slate-100 bg-white overflow-hidden flex flex-col min-h-[320px]">
          {!selected ? (
            <div className="flex-1 flex flex-col items-center justify-center p-10 text-center text-slate-400">
              <User className="w-10 h-10 mb-3 opacity-40" />
              <p className="text-sm font-medium text-slate-600">Select a doctor</p>
              <p className="text-xs mt-1">View profile, edit details, or manage their schedule.</p>
            </div>
          ) : (
            <>
              <div className="relative h-40 bg-slate-100">
                <img
                  src={selected.profile_picture_url}
                  alt={selected.name}
                  className="w-full h-full object-cover object-top"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#3d1210]/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                  <h3 className="font-bold text-lg">{selected.name}</h3>
                  <p className="text-xs text-white/80 mt-0.5">{selected.specialization}</p>
                </div>
              </div>

              <div className="flex-1 p-5 overflow-y-auto space-y-4">
                <div className="flex items-center gap-2 text-xs text-brand-600 bg-brand-50 border border-brand-100 rounded-xl px-3 py-2 w-fit">
                  <Award className="w-3.5 h-3.5" />
                  {selected.qualifications}
                </div>

                <p className="text-sm text-slate-600 leading-relaxed">{selected.bio}</p>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-[10px] uppercase tracking-wider text-slate-400">Weekly slots</p>
                    <p className="text-xl font-bold text-[#3d1210] mt-1">{countSlots(selected)}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-[10px] uppercase tracking-wider text-slate-400">Active days</p>
                    <p className="text-xl font-bold text-[#3d1210] mt-1">{activeDays(selected)}</p>
                  </div>
                </div>

                {selected.schedule_updated_at && (
                  <p className="text-[11px] text-slate-400">
                    Schedule updated {new Date(selected.schedule_updated_at).toLocaleString()}
                    {selected.schedule_updated_by ? ` by ${selected.schedule_updated_by}` : ""}
                  </p>
                )}
              </div>

              <div className="px-5 py-4 border-t border-slate-100 flex flex-wrap gap-2 bg-slate-50/30">
                <button
                  type="button"
                  onClick={() => openEdit(selected)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-brand-600 text-white hover:bg-brand-500 transition"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Edit profile
                </button>
                <button
                  type="button"
                  onClick={() => openSchedule(selected.doctor_id)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
                >
                  <Clock className="w-3.5 h-3.5" />
                  Manage schedule
                </button>
                <button
                  type="button"
                  disabled={busyId === selected.doctor_id}
                  onClick={() => deleteDoctor(selected.doctor_id)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-red-200 text-red-600 hover:bg-red-50 transition disabled:opacity-50 ml-auto"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Remove
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
