import React from "react";

export const CLINIC_LOGO_SRC = "/images/clinic-logo.png";

const SIZE_CLASS = {
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-14 h-14",
  xl: "w-20 h-20",
} as const;

const ROUNDED_CLASS = {
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  full: "rounded-full",
  none: "rounded-none",
} as const;

interface ClinicLogoProps {
  size?: keyof typeof SIZE_CLASS;
  className?: string;
  alt?: string;
  rounded?: keyof typeof ROUNDED_CLASS;
  framed?: boolean;
}

export default function ClinicLogo({
  size = "md",
  className = "",
  alt = "Qaahira Denta Care logo",
  rounded = "xl",
  framed = true,
}: ClinicLogoProps) {
  const roundedClass = ROUNDED_CLASS[rounded];

  return (
    <div
      className={`${SIZE_CLASS[size]} ${framed ? `${roundedClass} bg-white border border-slate-100 shadow-sm p-1` : ""} flex items-center justify-center flex-shrink-0 ${className}`}
    >
      <img
        src={CLINIC_LOGO_SRC}
        alt={alt}
        className={`w-full h-full object-contain ${framed ? "" : roundedClass}`}
        draggable={false}
      />
    </div>
  );
}
