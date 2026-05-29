export type AdminTab =
  | "dashboard"
  | "system"
  | "services"
  | "gallery"
  | "testimonials"
  | "submissions"
  | "doctors"
  | "publish";

export interface AdminNavItem {
  id: AdminTab;
  label: string;
  badge?: number;
  group?: "main" | "content" | "system";
}

export const ADMIN_TAB_TITLES: Record<AdminTab, string> = {
  dashboard: "Dashboard",
  system: "System settings",
  services: "Services",
  gallery: "Portfolio gallery",
  testimonials: "Testimonials",
  submissions: "Messages",
  doctors: "Doctors",
  publish: "Blog",
};

export const ADMIN_TAB_SUBTITLES: Record<AdminTab, string> = {
  dashboard: "Overview of clinic activity and quick actions",
  system: "Clinic identity, contact details, hours, and security",
  services: "Manage treatments shown on the public website",
  gallery: "Before & after photos and clinic portfolio",
  testimonials: "Review, approve, and publish patient feedback",
  submissions: "Contact form inquiries from the public site",
  doctors: "Specialist profiles, photos, and weekly schedules",
  publish: "Blog articles and patient education",
};
