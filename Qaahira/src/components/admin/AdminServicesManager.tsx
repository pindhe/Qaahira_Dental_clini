import React, { useState } from "react";
import {
  Save,
  Plus,
  Trash2,
  Pencil,
  ArrowLeft,
  Clock,
  Tag,
  Layers,
} from "lucide-react";
import { Service } from "../../types";
import AdminImageUpload from "./AdminImageUpload";

interface AdminServicesManagerProps {
  services: Service[];
  onRefresh: () => void;
}

type ViewMode = "list" | "create" | "edit";

const EMPTY_SERVICE: Partial<Service> = {
  service_id: "",
  service_name: "",
  category: "",
  description: "",
  detailed_info: "",
  estimated_duration_minutes: 30,
  price_range: "",
  model3D_id: "",
  image_url: "",
};

const inputClass =
  "p-2.5 border border-slate-200 bg-white text-sm rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 w-full";

export default function AdminServicesManager({ services, onRefresh }: AdminServicesManagerProps) {
  const [view, setView] = useState<ViewMode>("list");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Service>>(EMPTY_SERVICE);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [saving, setSaving] = useState(false);

  const selected = services.find((s) => s.service_id === selectedId);
  const isCreating = view === "create";
  const isEditing = view === "edit";

  const showMessage = (text: string) => {
    setMessage(text);
    setTimeout(() => setMessage(""), 4000);
  };

  const goToList = () => {
    setView("list");
    setSelectedId(null);
    setForm({ ...EMPTY_SERVICE });
    setError("");
    setUploadError("");
  };

  const startCreate = () => {
    setView("create");
    setSelectedId(null);
    setForm({ ...EMPTY_SERVICE });
    setError("");
    setUploadError("");
    setMessage("");
  };

  const startEdit = (service: Service) => {
    setView("edit");
    setSelectedId(service.service_id);
    setForm({ ...service });
    setError("");
    setUploadError("");
    setMessage("");
  };

  const updateField = (key: keyof Service, value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.service_name || !form.category || !form.description) {
      setError("Name, category, and description are required.");
      return;
    }

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const url = isCreating ? "/api/services" : `/api/services/${selectedId}`;
      const method = isCreating ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save service");
      }

      const saved = await res.json();
      await onRefresh();

      if (isCreating) {
        showMessage("New service added to the website.");
        goToList();
      } else {
        setForm({ ...saved });
        showMessage("Service updated successfully.");
      }
    } catch (err: any) {
      setError(err.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (serviceId: string) => {
    if (!window.confirm("Remove this service from the public website?")) return;

    try {
      const res = await fetch(`/api/services/${serviceId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete service");
      showMessage("Service removed.");
      if (selectedId === serviceId) goToList();
      onRefresh();
    } catch (err: any) {
      setError(err.message || "Delete failed.");
    }
  };

  const formTitle = isCreating ? "Create new service" : selected ? `Edit: ${selected.service_name}` : "Edit service";

  return (
    <div className="flex flex-col gap-6">
      {view === "list" ? (
        <>
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-600">Services</p>
              <h2 className="mt-2 text-xl font-bold text-[#3d1210]">Treatment catalogue</h2>
              <p className="mt-1 text-sm text-slate-500">
                Manage services shown on the public website —{" "}
                <span className="font-semibold text-[#3d1210]">{services.length}</span>{" "}
                {services.length === 1 ? "service" : "services"} live.
              </p>
            </div>
            <button
              type="button"
              onClick={startCreate}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold"
              id="btn-admin-add-service"
            >
              <Plus className="w-4 h-4" />
              Add service
            </button>
          </div>

          {message && (
            <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 p-3 rounded-xl">
              {message}
            </p>
          )}
          {error && (
            <p className="text-sm text-rose-700 bg-rose-50 border border-rose-100 p-3 rounded-xl">{error}</p>
          )}

          {services.length === 0 ? (
            <div className="text-center py-14 px-6 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
              <Layers className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-semibold text-[#3d1210]">No services yet</p>
              <p className="text-xs text-slate-500 mt-1 mb-4">Create your first treatment to show on the website.</p>
              <button
                type="button"
                onClick={startCreate}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 text-white text-sm font-semibold hover:bg-brand-500"
              >
                <Plus className="w-4 h-4" />
                Create service
              </button>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-slate-100">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-left">
                      <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Service
                      </th>
                      <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 hidden md:table-cell">
                        Category
                      </th>
                      <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 hidden lg:table-cell">
                        Price
                      </th>
                      <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 hidden sm:table-cell">
                        Duration
                      </th>
                      <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {services.map((service) => (
                      <tr key={service.service_id} className="bg-white hover:bg-slate-50/80 transition">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3 min-w-[200px]">
                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-100 flex-shrink-0">
                              {service.image_url ? (
                                <img
                                  src={service.image_url}
                                  alt=""
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Layers className="w-5 h-5 text-slate-300" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-[#3d1210]">{service.service_name}</p>
                              <p className="text-xs text-slate-400 font-mono mt-0.5">{service.service_id}</p>
                              <p className="text-xs text-slate-500 mt-1 line-clamp-1 md:hidden">{service.category}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <span className="inline-flex items-center gap-1 text-slate-600">
                            <Tag className="w-3.5 h-3.5 text-slate-400" />
                            {service.category}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-600 hidden lg:table-cell">
                          {service.price_range || "—"}
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell">
                          <span className="inline-flex items-center gap-1 text-slate-600">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {service.estimated_duration_minutes} min
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => startEdit(service)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-white hover:border-brand-200 hover:text-brand-700 transition"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(service.service_id)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-100 text-rose-600 text-xs font-semibold hover:bg-rose-50 transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <button
                type="button"
                onClick={goToList}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-600 mb-3 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to service list
              </button>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-600">Services</p>
              <h2 className="mt-1 text-xl font-bold text-[#3d1210]">{formTitle}</h2>
              <p className="mt-1 text-sm text-slate-500">
                {isCreating
                  ? "Fill in the details below to publish a new treatment on the website."
                  : "Update service details and save changes."}
              </p>
            </div>
          </div>

          {message && (
            <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 p-3 rounded-xl">
              {message}
            </p>
          )}
          {error && (
            <p className="text-sm text-rose-700 bg-rose-50 border border-rose-100 p-3 rounded-xl">{error}</p>
          )}
          {uploadError && !error && (
            <p className="text-sm text-rose-700 bg-rose-50 border border-rose-100 p-3 rounded-xl">{uploadError}</p>
          )}

          <form onSubmit={handleSave} className="max-w-3xl flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Service ID</label>
                <input
                  className={inputClass}
                  value={form.service_id || ""}
                  onChange={(e) => updateField("service_id", e.target.value)}
                  disabled={isEditing}
                  placeholder="e.g. whitening"
                />
                {isEditing && (
                  <p className="text-[10px] text-slate-400">ID cannot be changed after creation.</p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Service name</label>
                <input
                  className={inputClass}
                  value={form.service_name || ""}
                  onChange={(e) => updateField("service_name", e.target.value)}
                  required
                  placeholder="e.g. Professional Teeth Whitening"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Category</label>
                <input
                  className={inputClass}
                  value={form.category || ""}
                  onChange={(e) => updateField("category", e.target.value)}
                  required
                  placeholder="e.g. Cosmetic dentistry"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Price range</label>
                <input
                  className={inputClass}
                  value={form.price_range || ""}
                  onChange={(e) => updateField("price_range", e.target.value)}
                  placeholder="e.g. $150 – $300"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Duration (minutes)</label>
                <input
                  type="number"
                  className={inputClass}
                  value={form.estimated_duration_minutes || 30}
                  onChange={(e) => updateField("estimated_duration_minutes", Number(e.target.value))}
                  min={5}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase">3D model ID</label>
                <input
                  className={inputClass}
                  value={form.model3D_id || ""}
                  onChange={(e) => updateField("model3D_id", e.target.value)}
                  placeholder="implant, root_canal, aligner…"
                />
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50 flex flex-col gap-3">
              <AdminImageUpload
                label="Service image"
                id="service-image-upload"
                value={form.image_url || ""}
                onChange={(url) => updateField("image_url", url)}
                onError={setUploadError}
                uploadEndpoint="/api/upload/service-image"
                hint="Upload a photo for the services page. JPG, PNG or WebP · max 5 MB."
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Image URL</label>
                <input
                  className={inputClass}
                  value={form.image_url || ""}
                  onChange={(e) => updateField("image_url", e.target.value)}
                  placeholder="https://… or /uploads/services/…"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Short description</label>
              <textarea
                className={`${inputClass} min-h-[72px]`}
                value={form.description || ""}
                onChange={(e) => updateField("description", e.target.value)}
                required
                placeholder="Brief summary shown on the services page"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Detailed info</label>
              <textarea
                className={`${inputClass} min-h-[120px]`}
                value={form.detailed_info || ""}
                onChange={(e) => updateField("detailed_info", e.target.value)}
                placeholder="Full treatment details for the service detail view"
              />
            </div>

            <div className="flex flex-wrap gap-2 justify-between pt-2">
              <button
                type="button"
                onClick={goToList}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>
              <div className="flex flex-wrap gap-2">
                {isEditing && selectedId && (
                  <button
                    type="button"
                    onClick={() => handleDelete(selectedId)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-rose-200 text-rose-600 text-sm font-semibold hover:bg-rose-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                )}
                <button
                  type="submit"
                  disabled={saving}
                  id="btn-admin-save-service"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#3d1210] hover:bg-slate-800 disabled:opacity-50 text-white text-sm font-semibold"
                >
                  <Save className="w-4 h-4" />
                  {saving ? "Saving…" : isCreating ? "Create service" : "Save changes"}
                </button>
              </div>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
