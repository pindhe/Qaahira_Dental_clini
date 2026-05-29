import React, { useState } from "react";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import ClinicLogo from "../ClinicLogo";

interface AdminLoginProps {
  onLogin: (pin: string) => boolean;
  onExitToSite: () => void;
}

export default function AdminLogin({ onLogin, onExitToSite }: AdminLoginProps) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onLogin(pin)) {
      setError("");
      setPin("");
    } else {
      setError("Invalid PIN. Default access code is 1234.");
    }
  };

  return (
    <div className="min-h-screen h-screen flex bg-[#2a0c0a]">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-30" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col justify-center p-12 xl:p-16 text-white">
          <ClinicLogo size="lg" framed={false} className="mb-8" />
          <h1 className="text-3xl xl:text-4xl font-bold tracking-tight leading-tight">
            Qaahira Denta Care
            <span className="block text-accent-500 mt-2 text-2xl xl:text-3xl font-semibold">
              Admin console
            </span>
          </h1>
          <p className="mt-6 text-slate-400 text-base leading-relaxed max-w-md">
            Secure access to manage services, reviews, messages, and clinic settings — all in one
            professional dashboard.
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0 bg-slate-50">
        <div className="p-4 sm:p-6">
          <button
            type="button"
            onClick={onExitToSite}
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-[#3d1210] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to website
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md p-8 sm:p-10 bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50 flex flex-col gap-6"
          >
            <div className="flex flex-col items-center text-center gap-3 lg:hidden">
              <ClinicLogo size="md" framed={false} />
              <p className="font-bold text-[#3d1210]">Admin sign in</p>
            </div>

            <div className="hidden lg:flex flex-col items-center text-center gap-2">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-[#3d1210] flex items-center justify-center">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h2 className="font-bold text-lg text-[#3d1210]">Welcome back</h2>
              <p className="text-sm text-slate-500">Enter your administrator PIN to continue</p>
            </div>

            {error && (
              <p className="text-sm text-rose-600 font-medium bg-rose-50 border border-rose-100 p-3 rounded-xl text-center">
                {error}
              </p>
            )}

            <div className="flex flex-col gap-2">
              <label
                htmlFor="input-admin-pin"
                className="text-xs font-semibold text-slate-600 uppercase tracking-wider"
              >
                Administrator PIN
              </label>
              <input
                id="input-admin-pin"
                type="password"
                placeholder="••••"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-center text-lg tracking-[0.3em] text-[#3d1210] font-bold focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-accent-500"
                maxLength={8}
                autoFocus
              />
            </div>

            <button
              type="submit"
              id="btn-admin-submit-pin"
              className="p-3.5 w-full rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold transition shadow-lg shadow-brand-600/20"
            >
              Sign in to dashboard
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
