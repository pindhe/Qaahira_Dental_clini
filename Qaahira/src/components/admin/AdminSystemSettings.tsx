import React, { useEffect, useState } from "react";
import {
  Save,
  RefreshCw,
  MapPin,
  Phone,
  Mail,
  Clock,
  Building2,
  Lock,
  Eye,
  Globe,
} from "lucide-react";
import { ClinicSettings } from "../../types";

interface AdminSystemSettingsProps {
  onSaved: () => void;
}

type SettingsSection = "identity" | "contact" | "hours" | "location" | "content" | "security";

const EMPTY_SETTINGS: ClinicSettings = {
  clinic_name: "",
  tagline: "",
  address: "",
  city: "",
  phone_primary: "",
  phone_secondary: "",
  email: "",
  hours_days: "",
  hours_morning: "",
  hours_afternoon: "",
  map_lat: 9.5616,
  map_lng: 44.0718,
  about_summary: "",
  footer_tagline: "",
  admin_pin: "",
  whatsapp_url: "",
  facebook_url: "",
};

const SECTIONS: { id: SettingsSection; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "identity", label: "Clinic identity", icon: Building2 },
  { id: "contact", label: "Contact details", icon: Phone },
  { id: "hours", label: "Opening hours", icon: Clock },
  { id: "location", label: "Map location", icon: MapPin },
  { id: "content", label: "Public copy", icon: Globe },
  { id: "security", label: "Security", icon: Lock },
];

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-slate-700">{label}</label>
      {hint && <p className="text-[11px] text-slate-400 -mt-0.5">{hint}</p>}
      {children}
    </div>
  );
}

const inputClass =
  "p-2.5 border border-slate-200 bg-white text-sm rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 w-full";

export default function AdminSystemSettings({ onSaved }: AdminSystemSettingsProps) {
  const [settings, setSettings] = useState<ClinicSettings>(EMPTY_SETTINGS);
  const [section, setSection] = useState<SettingsSection>("identity");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadSettings = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/settings");
      if (!res.ok) throw new Error("Failed to load settings");
      const data = await res.json();
      setSettings({ ...EMPTY_SETTINGS, ...data, admin_pin: "" });
    } catch (err: any) {
      setError(err.message || "Could not load system settings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const update = (key: keyof ClinicSettings, value: string | number) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const payload: Partial<ClinicSettings> = { ...settings };
      if (!payload.admin_pin) delete payload.admin_pin;

      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save settings");
      }

      setMessage("Settings saved. The public website will update on the next refresh.");
      setSettings((prev) => ({ ...prev, admin_pin: "" }));
      onSaved();
      setTimeout(() => setMessage(""), 5000);
    } catch (err: any) {
      setError(err.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-slate-400">
        Loading system settings…
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-lg font-bold text-[#3d1210] tracking-tight">Clinic & website settings</h2>
          <p className="text-sm text-slate-500 mt-1 max-w-xl">
            Control what patients see on the header, footer, contact page, and about section.
          </p>
        </div>
        <button
          type="button"
          onClick={loadSettings}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Reload
        </button>
      </div>

      {message && (
        <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 p-3 rounded-xl">{message}</p>
      )}
      {error && (
        <p className="text-sm text-rose-700 bg-rose-50 border border-rose-100 p-3 rounded-xl">{error}</p>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-3 flex flex-col gap-1">
          {SECTIONS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setSection(id)}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-left transition ${
                section === id
                  ? "bg-brand-50 text-brand-700 border border-brand-100"
                  : "text-slate-600 hover:bg-slate-50 border border-transparent"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </button>
          ))}
        </div>

        <div className="xl:col-span-5 space-y-4">
          {section === "identity" && (
            <div className="space-y-4 animate-fade-in">
              <Field label="Clinic name" hint="Shown in the site header and browser title">
                <input
                  className={inputClass}
                  value={settings.clinic_name}
                  onChange={(e) => update("clinic_name", e.target.value)}
                  required
                />
              </Field>
              <Field label="Tagline" hint="Short line under the clinic name">
                <input
                  className={inputClass}
                  value={settings.tagline}
                  onChange={(e) => update("tagline", e.target.value)}
                />
              </Field>
              <Field label="City">
                <input
                  className={inputClass}
                  value={settings.city}
                  onChange={(e) => update("city", e.target.value)}
                />
              </Field>
              <Field label="Full address">
                <input
                  className={inputClass}
                  value={settings.address}
                  onChange={(e) => update("address", e.target.value)}
                />
              </Field>
            </div>
          )}

          {section === "contact" && (
            <div className="space-y-4">
              <Field label="Primary phone">
                <input
                  className={inputClass}
                  value={settings.phone_primary}
                  onChange={(e) => update("phone_primary", e.target.value)}
                />
              </Field>
              <Field label="Secondary phone">
                <input
                  className={inputClass}
                  value={settings.phone_secondary}
                  onChange={(e) => update("phone_secondary", e.target.value)}
                />
              </Field>
              <Field label="Email">
                <input
                  type="email"
                  className={inputClass}
                  value={settings.email}
                  onChange={(e) => update("email", e.target.value)}
                />
              </Field>
              <Field
                label="WhatsApp link (optional)"
                hint="Leave blank to use primary phone. Shown on the floating WhatsApp button."
              >
                <input
                  className={inputClass}
                  value={settings.whatsapp_url ?? ""}
                  onChange={(e) => update("whatsapp_url", e.target.value)}
                  placeholder="https://wa.me/252636249555"
                />
              </Field>
              <Field
                label="Facebook page URL"
                hint="Shown on the floating Facebook button when set."
              >
                <input
                  className={inputClass}
                  value={settings.facebook_url ?? ""}
                  onChange={(e) => update("facebook_url", e.target.value)}
                  placeholder="https://facebook.com/your-page"
                />
              </Field>
            </div>
          )}

          {section === "hours" && (
            <div className="space-y-4">
              <Field label="Working days" hint="e.g. Sat – Thu">
                <input
                  className={inputClass}
                  value={settings.hours_days}
                  onChange={(e) => update("hours_days", e.target.value)}
                />
              </Field>
              <Field label="Morning session">
                <input
                  className={inputClass}
                  value={settings.hours_morning}
                  onChange={(e) => update("hours_morning", e.target.value)}
                  placeholder="07:00 – 12:00"
                />
              </Field>
              <Field label="Afternoon session">
                <input
                  className={inputClass}
                  value={settings.hours_afternoon}
                  onChange={(e) => update("hours_afternoon", e.target.value)}
                  placeholder="16:00 – 20:00"
                />
              </Field>
            </div>
          )}

          {section === "location" && (
            <div className="space-y-4">
              <Field label="Latitude" hint="Used for the contact page map">
                <input
                  type="number"
                  step="0.0001"
                  className={inputClass}
                  value={settings.map_lat}
                  onChange={(e) => update("map_lat", Number(e.target.value))}
                />
              </Field>
              <Field label="Longitude">
                <input
                  type="number"
                  step="0.0001"
                  className={inputClass}
                  value={settings.map_lng}
                  onChange={(e) => update("map_lng", Number(e.target.value))}
                />
              </Field>
            </div>
          )}

          {section === "content" && (
            <div className="space-y-4">
              <Field label="About summary" hint="Used on the About page">
                <textarea
                  className={`${inputClass} min-h-[100px]`}
                  value={settings.about_summary}
                  onChange={(e) => update("about_summary", e.target.value)}
                />
              </Field>
              <Field label="Footer description" hint="Short text in the site footer">
                <textarea
                  className={`${inputClass} min-h-[80px]`}
                  value={settings.footer_tagline}
                  onChange={(e) => update("footer_tagline", e.target.value)}
                />
              </Field>
            </div>
          )}

          {section === "security" && (
            <div className="space-y-4">
              <Field label="New admin PIN" hint="Leave blank to keep the current PIN">
                <input
                  type="password"
                  className={inputClass}
                  value={settings.admin_pin}
                  onChange={(e) => update("admin_pin", e.target.value)}
                  placeholder="••••"
                  maxLength={8}
                />
              </Field>
            </div>
          )}
        </div>

        <div className="xl:col-span-4">
          <div className="sticky top-4 rounded-2xl border border-slate-200 bg-slate-50/80 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-200 bg-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-brand-600" />
              <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Live preview</p>
            </div>
            <div className="p-4 space-y-4 text-sm">
              <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm">
                <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-2">Header</p>
                <p className="font-bold text-[#3d1210]">{settings.clinic_name || "Clinic name"}</p>
                <p className="text-xs text-brand-600 mt-0.5">{settings.tagline || "Tagline"}</p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm space-y-2">
                <p className="text-[10px] uppercase tracking-wider text-slate-400">Contact sidebar</p>
                <p className="flex items-center gap-2 text-slate-600">
                  <Phone className="w-3.5 h-3.5 text-brand-600" />
                  {settings.phone_primary || "Primary phone"}
                </p>
                <p className="flex items-center gap-2 text-slate-600">
                  <Mail className="w-3.5 h-3.5 text-brand-600" />
                  {settings.email || "Email"}
                </p>
                <p className="flex items-start gap-2 text-slate-600">
                  <MapPin className="w-3.5 h-3.5 text-brand-600 mt-0.5 shrink-0" />
                  <span>{[settings.address, settings.city].filter(Boolean).join(", ") || "Address"}</span>
                </p>
                <p className="flex items-center gap-2 text-slate-600">
                  <Clock className="w-3.5 h-3.5 text-brand-600" />
                  {[settings.hours_days, settings.hours_morning, settings.hours_afternoon]
                    .filter(Boolean)
                    .join(" · ") || "Opening hours"}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#3d1210] text-white">
                <p className="text-[10px] uppercase tracking-wider text-white/50 mb-2">Footer</p>
                <p className="font-semibold">{settings.clinic_name || "Clinic name"}</p>
                <p className="text-xs text-white/70 mt-2 leading-relaxed">
                  {settings.footer_tagline || "Footer description"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-2 border-t border-slate-100">
        <button
          type="submit"
          disabled={saving}
          id="btn-admin-save-settings"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-60 text-white text-sm font-semibold transition"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving…" : "Save settings"}
        </button>
      </div>
    </form>
  );
}
