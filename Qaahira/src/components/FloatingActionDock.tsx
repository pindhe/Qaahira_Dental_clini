import React from "react";
import { MessageCircle } from "lucide-react";
import { ClinicSettings } from "../types";

interface FloatingActionDockProps {
  settings?: ClinicSettings | null;
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.881 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function phoneToWhatsApp(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : "";
}

interface DockButtonProps {
  id: string;
  title: string;
  label: string;
  href?: string;
  onClick?: () => void;
  bgClass: string;
  hoverClass: string;
  shadowClass: string;
  borderClass: string;
  pingClass: string;
  icon: React.ReactNode;
  badge?: React.ReactNode;
}

function DockButton({
  id,
  title,
  label,
  href,
  onClick,
  bgClass,
  hoverClass,
  shadowClass,
  borderClass,
  pingClass,
  icon,
  badge,
}: DockButtonProps) {
  const className = `group/dock relative flex items-center justify-end gap-3`;

  const inner = (
    <>
      <div className="hidden sm:flex bg-slate-950/90 backdrop-blur border border-slate-800 text-white shadow-xl px-3 py-2 rounded-2xl text-[10px] font-mono font-bold uppercase tracking-wider items-center gap-1.5 opacity-0 group-hover/dock:opacity-100 transition-all duration-300 translate-x-2 group-hover/dock:translate-x-0 pointer-events-none select-none whitespace-nowrap">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span>{label}</span>
      </div>

      <span
        className={`w-14 h-14 rounded-full ${bgClass} ${hoverClass} text-white shadow-2xl ${shadowClass} flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 relative border ${borderClass}`}
      >
        <span className={`absolute inset-0 rounded-full border ${pingClass} animate-ping opacity-20 scale-115 pointer-events-none`} />
        <span className="relative z-10">{icon}</span>
        {badge}
      </span>
    </>
  );

  if (href) {
    return (
      <a
        id={id}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        title={title}
        className={className}
      >
        {inner}
      </a>
    );
  }

  return (
    <button type="button" id={id} onClick={onClick} title={title} className={className}>
      {inner}
    </button>
  );
}

export default function FloatingActionDock({ settings }: FloatingActionDockProps) {
  const phonePrimary = settings?.phone_primary ?? "+252 63 6249555";
  const whatsappUrl = settings?.whatsapp_url?.trim() || phoneToWhatsApp(phonePrimary);
  const facebookUrl = settings?.facebook_url?.trim() || "";

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      {facebookUrl && (
        <DockButton
          id="btn-floating-facebook"
          title="Visit us on Facebook"
          label="Facebook page"
          href={facebookUrl}
          bgClass="bg-[#1877F2]"
          hoverClass="hover:bg-[#166fe5]"
          shadowClass="shadow-[#1877F2]/30"
          borderClass="border-white/25"
          pingClass="border-white/35"
          icon={<FacebookIcon className="w-6 h-6" />}
          badge={
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-accent-500 flex items-center justify-center text-white ring-2 ring-white shadow">
              <span className="text-[9px] font-bold">f</span>
            </span>
          }
        />
      )}

      {whatsappUrl && (
        <DockButton
          id="btn-floating-whatsapp"
          title="Chat on WhatsApp"
          label="WhatsApp chat"
          href={whatsappUrl}
          bgClass="bg-[#25D366]"
          hoverClass="hover:bg-[#20bd5a]"
          shadowClass="shadow-[#25D366]/30"
          borderClass="border-white/25"
          pingClass="border-white/35"
          icon={<WhatsAppIcon className="w-6 h-6" />}
          badge={
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-accent-500 flex items-center justify-center text-white ring-2 ring-white shadow">
              <MessageCircle className="w-3 h-3" />
            </span>
          }
        />
      )}
    </div>
  );
}
