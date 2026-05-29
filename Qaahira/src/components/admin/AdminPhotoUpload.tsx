import React, { useRef, useState } from "react";
import { Upload, X, Loader2, User } from "lucide-react";
import { fetchJson } from "./fetchJson";

interface AdminPhotoUploadProps {
  value: string;
  onChange: (url: string) => void;
  onError?: (message: string) => void;
  label?: string;
  id?: string;
}

const MAX_SIZE_MB = 5;
const ACCEPT = "image/jpeg,image/png,image/webp,image/gif";

export default function AdminPhotoUpload({
  value,
  onChange,
  onError,
  label = "Profile photo",
  id = "doctor-photo-upload",
}: AdminPhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  const preview = localPreview || value || null;

  const handleFile = async (file: File | null) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      onError?.("Please choose a JPG, PNG, WebP, or GIF image.");
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      onError?.(`Image must be smaller than ${MAX_SIZE_MB} MB.`);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setLocalPreview(objectUrl);
    setUploading(true);
    onError?.("");

    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error("Could not read the file."));
        reader.readAsDataURL(file);
      });

      const { ok, data, error } = await fetchJson<{ url: string }>("/api/upload/doctor-photo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: dataUrl, filename: file.name }),
      });

      if (!ok || !data?.url) {
        throw new Error(error || "Upload failed.");
      }

      onChange(data.url);
      setLocalPreview(null);
      URL.revokeObjectURL(objectUrl);
    } catch (err: any) {
      setLocalPreview(null);
      URL.revokeObjectURL(objectUrl);
      onError?.(err.message || "Upload failed.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const clearPhoto = () => {
    onChange("");
    setLocalPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</label>

      <div className="flex flex-col sm:flex-row gap-4 items-start">
        <div className="relative flex-shrink-0">
          <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center">
            {preview ? (
              <img src={preview} alt="Profile preview" className="w-full h-full object-cover" />
            ) : (
              <User className="w-10 h-10 text-slate-300" />
            )}
            {uploading && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-brand-600 animate-spin" />
              </div>
            )}
          </div>
          {preview && !uploading && (
            <button
              type="button"
              onClick={clearPhoto}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-sm hover:bg-rose-600"
              aria-label="Remove photo"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <input
            ref={inputRef}
            id={id}
            type="file"
            accept={ACCEPT}
            className="sr-only"
            disabled={uploading}
            onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
          />
          <label
            htmlFor={id}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold cursor-pointer transition ${
              uploading
                ? "border-slate-200 bg-slate-100 text-slate-400 pointer-events-none"
                : "border-brand-200 bg-brand-50 text-brand-700 hover:bg-brand-100 hover:border-accent-400"
            }`}
          >
            <Upload className="w-4 h-4" />
            {uploading ? "Uploading…" : preview ? "Change photo" : "Upload photo"}
          </label>
          <p className="mt-2 text-[11px] text-slate-400 leading-relaxed">
            JPG, PNG or WebP · max {MAX_SIZE_MB} MB. Leave empty to use the default avatar.
          </p>
        </div>
      </div>
    </div>
  );
}
