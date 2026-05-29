import React, { useMemo, useState } from "react";
import {
  Save,
  Plus,
  Trash2,
  Pencil,
  ArrowLeft,
  Eye,
  EyeOff,
  Images,
  ArrowLeftRight,
  Filter,
} from "lucide-react";
import { GalleryItem, GalleryCategory } from "../../types";
import AdminImageUpload from "./AdminImageUpload";

interface AdminGalleryManagerProps {
  gallery: GalleryItem[];
  onRefresh: () => void;
}

type ViewMode = "list" | "create" | "edit";
type ListFilter = "all" | GalleryCategory | "draft";

const EMPTY_ITEM: Partial<GalleryItem> = {
  category: "treatment",
  title: "",
  description: "",
  treatment_type: "",
  before_url: "",
  after_url: "",
  image_url: "",
  published: true,
  sort_order: 1,
};

const CATEGORY_LABELS: Record<GalleryCategory, string> = {
  treatment: "Before & after",
  equipment: "Equipment",
  clinic: "Clinic space",
};

const FILTER_LABELS: Record<ListFilter, string> = {
  all: "All items",
  treatment: "Before & after",
  equipment: "Equipment",
  clinic: "Clinic",
  draft: "Drafts",
};

const inputClass =
  "p-2.5 border border-slate-200 bg-white text-sm rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 w-full";

function itemThumbnail(item: GalleryItem): string {
  return item.category === "treatment" ? item.before_url ?? "" : item.image_url ?? "";
}

export default function AdminGalleryManager({ gallery, onRefresh }: AdminGalleryManagerProps) {
  const [view, setView] = useState<ViewMode>("list");
  const [listFilter, setListFilter] = useState<ListFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<GalleryItem>>(EMPTY_ITEM);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [saving, setSaving] = useState(false);

  const sortedGallery = useMemo(
    () => [...gallery].sort((a, b) => a.sort_order - b.sort_order),
    [gallery]
  );

  const filteredList = useMemo(() => {
    if (listFilter === "all") return sortedGallery;
    if (listFilter === "draft") return sortedGallery.filter((g) => !g.published);
    return sortedGallery.filter((g) => g.category === listFilter);
  }, [sortedGallery, listFilter]);

  const publishedCount = gallery.filter((g) => g.published).length;
  const treatmentCount = gallery.filter((g) => g.category === "treatment").length;
  const draftCount = gallery.filter((g) => !g.published).length;

  const selected = gallery.find((g) => g.item_id === selectedId);
  const isCreating = view === "create";
  const isEditing = view === "edit";
  const isTreatment = form.category === "treatment";

  const showMessage = (text: string) => {
    setMessage(text);
    setTimeout(() => setMessage(""), 4000);
  };

  const goToList = () => {
    setView("list");
    setSelectedId(null);
    setForm({ ...EMPTY_ITEM });
    setError("");
    setUploadError("");
  };

  const startCreate = (category?: GalleryCategory) => {
    setView("create");
    setSelectedId(null);
    setForm({
      ...EMPTY_ITEM,
      category: category ?? "treatment",
      sort_order: gallery.length + 1,
    });
    setError("");
    setUploadError("");
    setMessage("");
  };

  const startEdit = (item: GalleryItem) => {
    setView("edit");
    setSelectedId(item.item_id);
    setForm({ ...item });
    setError("");
    setUploadError("");
    setMessage("");
  };

  const updateField = (key: keyof GalleryItem, value: string | number | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.category) {
      setError("Title, category, and description are required.");
      return;
    }

    if (form.category === "treatment" && (!form.before_url || !form.after_url)) {
      setError("Please upload both before and after photos for treatment cases.");
      return;
    }

    if (form.category !== "treatment" && !form.image_url) {
      setError("Please upload a photo for equipment and clinic items.");
      return;
    }

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const url = isCreating ? "/api/gallery" : `/api/gallery/${selectedId}`;
      const method = isCreating ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save portfolio item");
      }

      const saved = await res.json();
      await onRefresh();

      if (isCreating) {
        showMessage("Portfolio item published to the website.");
        goToList();
      } else {
        setForm({ ...saved });
        showMessage("Portfolio item updated.");
      }
    } catch (err: any) {
      setError(err.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (itemId: string) => {
    if (!window.confirm("Remove this item from the portfolio?")) return;

    try {
      const res = await fetch(`/api/gallery/${itemId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete item");
      showMessage("Portfolio item removed.");
      if (selectedId === itemId) goToList();
      onRefresh();
    } catch (err: any) {
      setError(err.message || "Delete failed.");
    }
  };

  const togglePublished = async (item: GalleryItem) => {
    try {
      const res = await fetch(`/api/gallery/${item.item_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !item.published }),
      });
      if (!res.ok) throw new Error("Failed to update visibility");
      showMessage(item.published ? "Item hidden from public portfolio." : "Item published to website.");
      onRefresh();
    } catch (err: any) {
      setError(err.message || "Could not update visibility.");
    }
  };

  const formTitle = isCreating ? "Add portfolio item" : selected ? `Edit: ${selected.title}` : "Edit item";

  return (
    <div className="flex flex-col gap-6">
      {view === "list" ? (
        <>
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-600">Portfolio</p>
              <h2 className="mt-2 text-xl font-bold text-[#3d1210]">Before & after gallery</h2>
              <p className="mt-1 text-sm text-slate-500">
                Manage portfolio images on the public website —{" "}
                <span className="font-semibold text-[#3d1210]">{publishedCount}</span> published
                {draftCount > 0 && (
                  <>
                    , <span className="font-semibold text-amber-700">{draftCount}</span> draft
                  </>
                )}
                .
              </p>
            </div>
            <button
              type="button"
              onClick={() => startCreate()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold"
              id="btn-admin-add-portfolio"
            >
              <Plus className="w-4 h-4" />
              Add portfolio item
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Total items", value: gallery.length },
              { label: "Published", value: publishedCount },
              { label: "Before/after", value: treatmentCount },
              { label: "Drafts", value: draftCount },
            ].map(({ label, value }) => (
              <div key={label} className="px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-xl font-bold text-[#3d1210] tabular-nums">{value}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {message && (
            <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 p-3 rounded-xl">
              {message}
            </p>
          )}
          {error && (
            <p className="text-sm text-rose-700 bg-rose-50 border border-rose-100 p-3 rounded-xl">{error}</p>
          )}

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 mr-1">
              <Filter className="w-3.5 h-3.5" />
              Filter
            </span>
            {(["all", "treatment", "equipment", "clinic", "draft"] as const).map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setListFilter(filter)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                  listFilter === filter
                    ? "bg-[#3d1210] text-white border-[#3d1210]"
                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                }`}
              >
                {FILTER_LABELS[filter]}
              </button>
            ))}
          </div>

          {gallery.length === 0 ? (
            <div className="text-center py-14 px-6 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
              <Images className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-semibold text-[#3d1210]">No portfolio items yet</p>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                Add before/after cases, equipment photos, or clinic images.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <button
                  type="button"
                  onClick={() => startCreate("treatment")}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 text-white text-sm font-semibold hover:bg-brand-500"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                  Before & after case
                </button>
                <button
                  type="button"
                  onClick={() => startCreate("equipment")}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-white"
                >
                  Equipment photo
                </button>
              </div>
            </div>
          ) : filteredList.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-12 border border-dashed border-slate-200 rounded-2xl">
              No items match this filter.
            </p>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-slate-100">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-left">
                      <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Item
                      </th>
                      <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 hidden md:table-cell">
                        Category
                      </th>
                      <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 hidden sm:table-cell">
                        Order
                      </th>
                      <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Status
                      </th>
                      <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredList.map((item) => {
                      const thumb = itemThumbnail(item);
                      return (
                        <tr key={item.item_id} className="bg-white hover:bg-slate-50/80 transition">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3 min-w-[200px]">
                              <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 border border-slate-100 flex-shrink-0">
                                {thumb ? (
                                  <img
                                    src={thumb}
                                    alt=""
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <Images className="w-5 h-5 text-slate-300" />
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="font-semibold text-[#3d1210] truncate">{item.title}</p>
                                <p className="text-xs text-slate-400 font-mono mt-0.5">{item.item_id}</p>
                                {item.category === "treatment" && item.treatment_type && (
                                  <p className="text-xs text-accent-600 mt-0.5 truncate">{item.treatment_type}</p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 hidden md:table-cell text-slate-600">
                            {CATEGORY_LABELS[item.category]}
                          </td>
                          <td className="px-4 py-3 hidden sm:table-cell text-slate-500 tabular-nums">
                            {item.sort_order}
                          </td>
                          <td className="px-4 py-3">
                            <button
                              type="button"
                              onClick={() => togglePublished(item)}
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border transition ${
                                item.published
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100"
                                  : "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200"
                              }`}
                            >
                              {item.published ? (
                                <>
                                  <Eye className="w-3 h-3" />
                                  Live
                                </>
                              ) : (
                                <>
                                  <EyeOff className="w-3 h-3" />
                                  Draft
                                </>
                              )}
                            </button>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => startEdit(item)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-white hover:border-brand-200 hover:text-brand-700 transition"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(item.item_id)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-100 text-rose-600 text-xs font-semibold hover:bg-rose-50 transition"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
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
                Back to portfolio list
              </button>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-600">Portfolio</p>
              <h2 className="mt-1 text-xl font-bold text-[#3d1210]">{formTitle}</h2>
              <p className="mt-1 text-sm text-slate-500">
                {isCreating
                  ? "Upload images and fill in details to add a new portfolio entry."
                  : "Update images and details, then save changes."}
              </p>
            </div>
          </div>

          {message && (
            <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 p-3 rounded-xl">
              {message}
            </p>
          )}
          {(error || uploadError) && (
            <p className="text-sm text-rose-700 bg-rose-50 border border-rose-100 p-3 rounded-xl">
              {error || uploadError}
            </p>
          )}

          <form onSubmit={handleSave} className="max-w-3xl flex flex-col gap-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Item ID</label>
                <input
                  className={inputClass}
                  value={form.item_id || ""}
                  onChange={(e) => updateField("item_id", e.target.value)}
                  disabled={isEditing}
                  placeholder="e.g. case-whitening-01"
                />
                {isEditing && (
                  <p className="text-[10px] text-slate-400">ID cannot be changed after creation.</p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Category</label>
                <select
                  className={inputClass}
                  value={form.category || "treatment"}
                  onChange={(e) => updateField("category", e.target.value as GalleryCategory)}
                >
                  <option value="treatment">Before & after treatment</option>
                  <option value="equipment">Equipment</option>
                  <option value="clinic">Clinic space</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Title</label>
                <input
                  className={inputClass}
                  value={form.title || ""}
                  onChange={(e) => updateField("title", e.target.value)}
                  required
                  placeholder="e.g. Molar restoration with titanium implants"
                />
              </div>
              {isTreatment && (
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Treatment type</label>
                  <input
                    className={inputClass}
                    value={form.treatment_type || ""}
                    onChange={(e) => updateField("treatment_type", e.target.value)}
                    placeholder="e.g. Dental Implants, Veneers, Whitening"
                  />
                </div>
              )}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Sort order</label>
                <input
                  type="number"
                  className={inputClass}
                  value={form.sort_order ?? 1}
                  onChange={(e) => updateField("sort_order", Number(e.target.value))}
                  min={1}
                />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="gallery-published"
                  checked={form.published !== false}
                  onChange={(e) => updateField("published", e.target.checked)}
                  className="rounded border-slate-300 text-brand-600"
                />
                <label htmlFor="gallery-published" className="text-sm text-slate-700 flex items-center gap-1.5">
                  {form.published !== false ? (
                    <Eye className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-slate-400" />
                  )}
                  Visible on public portfolio page
                </label>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Description</label>
              <textarea
                className={`${inputClass} min-h-[88px]`}
                value={form.description || ""}
                onChange={(e) => updateField("description", e.target.value)}
                required
                placeholder="Describe the case or photo for patients"
              />
            </div>

            {isTreatment ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 rounded-2xl border border-brand-100 bg-brand-50/30">
                <AdminImageUpload
                  label="Before photo"
                  id="portfolio-before-upload"
                  value={form.before_url || ""}
                  onChange={(url) => updateField("before_url", url)}
                  onError={setUploadError}
                  hint="JPG, PNG or WebP · max 5 MB."
                />
                <AdminImageUpload
                  label="After photo"
                  id="portfolio-after-upload"
                  value={form.after_url || ""}
                  onChange={(url) => updateField("after_url", url)}
                  onError={setUploadError}
                  hint="JPG, PNG or WebP · max 5 MB."
                />
              </div>
            ) : (
              <div className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50">
                <AdminImageUpload
                  label="Portfolio photo"
                  id="portfolio-single-upload"
                  value={form.image_url || ""}
                  onChange={(url) => updateField("image_url", url)}
                  onError={setUploadError}
                  hint="JPG, PNG or WebP · max 5 MB."
                />
              </div>
            )}

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
                  id="btn-admin-save-portfolio"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#3d1210] hover:bg-slate-800 disabled:opacity-50 text-white text-sm font-semibold"
                >
                  <Save className="w-4 h-4" />
                  {saving ? "Saving…" : isCreating ? "Create item" : "Save changes"}
                </button>
              </div>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
