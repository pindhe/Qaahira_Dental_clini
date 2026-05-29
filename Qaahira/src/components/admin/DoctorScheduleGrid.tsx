import React from "react";
import { X, Trash2 } from "lucide-react";
import { Doctor } from "../../types";

export const WEEK_DAYS = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"] as const;

export const QUICK_SLOTS = ["07:00", "09:00", "10:30", "12:00", "16:00", "17:30", "20:00"];

function sortSlots(slots: string[]) {
  return [...slots].sort();
}

export function emptyScheduleGrid(): Record<string, string[]> {
  return Object.fromEntries(WEEK_DAYS.map((day) => [day, []]));
}

export function gridToAvailability(grid: Record<string, string[]>): Doctor["availability"] {
  const availability: Doctor["availability"] = {};
  WEEK_DAYS.forEach((day) => {
    const slots = grid[day] ?? [];
    if (slots.length > 0) availability[day] = sortSlots(slots);
  });
  return availability;
}

export function countGridSlots(grid: Record<string, string[]>): number {
  return WEEK_DAYS.reduce((sum, day) => sum + (grid[day]?.length ?? 0), 0);
}

interface DoctorScheduleGridProps {
  grid: Record<string, string[]>;
  onChange: (grid: Record<string, string[]>) => void;
}

export default function DoctorScheduleGrid({ grid, onChange }: DoctorScheduleGridProps) {
  const addSlot = (day: string, slot: string) => {
    const current = grid[day] ?? [];
    if (current.includes(slot)) return;
    onChange({ ...grid, [day]: sortSlots([...current, slot]) });
  };

  const removeSlot = (day: string, slot: string) => {
    onChange({ ...grid, [day]: (grid[day] ?? []).filter((s) => s !== slot) });
  };

  const clearDay = (day: string) => {
    onChange({ ...grid, [day]: [] });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {WEEK_DAYS.map((day) => {
        const slots = grid[day] ?? [];
        return (
          <div
            key={day}
            className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 flex flex-col gap-3"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-semibold text-[#3d1210]">{day}</span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-slate-400">{slots.length} slots</span>
                {slots.length > 0 && (
                  <button
                    type="button"
                    onClick={() => clearDay(day)}
                    className="text-[10px] font-semibold text-rose-600 hover:text-rose-700 inline-flex items-center gap-0.5"
                  >
                    <Trash2 className="w-3 h-3" />
                    Clear
                  </button>
                )}
              </div>
            </div>

            <div className="min-h-[44px] p-2 rounded-xl border border-slate-200 bg-white flex flex-wrap gap-1.5 content-start">
              {slots.length === 0 ? (
                <span className="text-xs text-slate-400 px-1 py-1">No slots — add times below</span>
              ) : (
                slots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => removeSlot(day, slot)}
                    title={`Remove ${slot}`}
                    className="group inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-brand-50 border border-brand-200 text-brand-800 text-xs font-mono font-semibold hover:bg-rose-50 hover:border-rose-200 hover:text-rose-700 transition"
                  >
                    {slot}
                    <X className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                  </button>
                ))
              )}
            </div>

            <div className="flex flex-wrap gap-1.5">
              {QUICK_SLOTS.map((slot) => {
                const active = slots.includes(slot);
                return (
                  <button
                    key={slot}
                    type="button"
                    disabled={active}
                    onClick={() => addSlot(day, slot)}
                    className={`px-2 py-1 rounded-md text-[10px] font-mono font-semibold border transition ${
                      active
                        ? "border-slate-100 bg-slate-100 text-slate-300 cursor-not-allowed"
                        : "border-slate-200 bg-white text-slate-600 hover:border-brand-200 hover:text-brand-600"
                    }`}
                  >
                    + {slot}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
