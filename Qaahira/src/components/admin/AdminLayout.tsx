import React, { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Settings,
  Stethoscope,
  MessagesSquare,
  FileText,
  Users,
  PlusCircle,
  Images,
  LogOut,
  ExternalLink,
  Bell,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronRight,
} from "lucide-react";
import ClinicLogo from "../ClinicLogo";
import { AdminNavItem, AdminTab, ADMIN_TAB_TITLES, ADMIN_TAB_SUBTITLES } from "./adminTypes";

const ICONS: Record<AdminTab, React.ComponentType<{ className?: string }>> = {
  dashboard: LayoutDashboard,
  system: Settings,
  services: Stethoscope,
  gallery: Images,
  testimonials: MessagesSquare,
  submissions: FileText,
  doctors: Users,
  publish: PlusCircle,
};

const NAV_GROUPS: { label: string; ids: AdminTab[] }[] = [
  { label: "Overview", ids: ["dashboard"] },
  { label: "Operations", ids: ["testimonials", "submissions", "doctors"] },
  { label: "Content", ids: ["services", "gallery", "publish"] },
  { label: "Configuration", ids: ["system"] },
];

interface AdminLayoutProps {
  activeTab: AdminTab;
  navItems: AdminNavItem[];
  onTabChange: (tab: AdminTab) => void;
  onLogout: () => void;
  onExitToSite: () => void;
  pendingCount?: number;
  children: React.ReactNode;
}

interface SidebarProps {
  activeTab: AdminTab;
  navItems: AdminNavItem[];
  collapsed: boolean;
  pendingCount: number;
  onTabChange: (tab: AdminTab) => void;
  onLogout: () => void;
  onExitToSite: () => void;
  onToggleCollapse?: () => void;
  onNavigate?: () => void;
  showCollapseToggle?: boolean;
}

function SidebarNavGroup({
  label,
  collapsed,
  children,
}: {
  label: string;
  collapsed: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-5">
      {!collapsed && (
        <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/35">
          {label}
        </p>
      )}
      {collapsed && <div className="mx-3 mb-2 h-px bg-white/[0.06]" />}
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function AdminSidebar({
  activeTab,
  navItems,
  collapsed,
  pendingCount,
  onTabChange,
  onLogout,
  onExitToSite,
  onToggleCollapse,
  onNavigate,
  showCollapseToggle = true,
}: SidebarProps) {
  const itemMap = Object.fromEntries(navItems.map((n) => [n.id, n]));

  const handleNav = (id: AdminTab) => {
    onTabChange(id);
    onNavigate?.();
  };

  const renderNavButton = (id: AdminTab) => {
    const item = itemMap[id];
    if (!item) return null;

    const Icon = ICONS[id];
    const active = activeTab === id;
    const { label, badge } = item;

    return (
      <button
        key={id}
        type="button"
        id={`tab-admin-${id}`}
        title={collapsed ? label : undefined}
        onClick={() => handleNav(id)}
        className={`group relative w-full flex items-center gap-3 rounded-xl text-left text-sm font-medium transition-all duration-200 ${
          collapsed ? "justify-center px-2 py-2.5" : "px-3 py-2.5"
        } ${
          active
            ? "bg-brand-600 text-white shadow-lg shadow-brand-900/40"
            : "text-white/55 hover:bg-white/[0.07] hover:text-white"
        }`}
      >
        {active && !collapsed && (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-accent-500" />
        )}

        <span
          className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg transition ${
            active
              ? "bg-white/15"
              : "bg-white/[0.04] group-hover:bg-white/[0.08]"
          }`}
        >
          <Icon className={`w-4 h-4 ${active ? "text-white" : "text-white/70 group-hover:text-white"}`} />
        </span>

        {!collapsed && (
          <>
            <span className="flex-1 truncate">{label}</span>
            {badge !== undefined && badge > 0 && (
              <span
                className={`min-w-[1.25rem] h-5 px-1.5 rounded-full text-[10px] font-bold flex items-center justify-center ${
                  active ? "bg-accent-500 text-white" : "bg-accent-500/20 text-accent-400"
                }`}
              >
                {badge}
              </span>
            )}
            {!active && (
              <ChevronRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-40 group-hover:translate-x-0 transition-all" />
            )}
          </>
        )}

        {collapsed && badge !== undefined && badge > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-accent-500 ring-2 ring-[#2a0c0a]" />
        )}
      </button>
    );
  };

  return (
    <div className="flex h-full flex-col bg-[#2a0c0a] text-white">
      {/* Brand header */}
      <div
        className={`flex-shrink-0 border-b border-white/[0.06] ${
          collapsed ? "p-3 flex justify-center" : "p-4"
        }`}
      >
        <div className={`flex items-center ${collapsed ? "justify-center" : "gap-3"}`}>
          <ClinicLogo size={collapsed ? "sm" : "md"} />
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold tracking-tight truncate">Qaahira Admin</p>
              <p className="text-[10px] text-white/40 mt-0.5">Clinic management</p>
            </div>
          )}
        </div>

        {!collapsed && pendingCount > 0 && (
          <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-xl bg-accent-500/10 border border-accent-500/20">
            <Bell className="w-3.5 h-3.5 text-accent-400 shrink-0" />
            <p className="text-[11px] font-semibold text-accent-300">
              {pendingCount} item{pendingCount !== 1 ? "s" : ""} need attention
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto admin-sidebar-scroll p-3">
        {NAV_GROUPS.map(({ label, ids }) => (
          <React.Fragment key={label}>
            <SidebarNavGroup label={label} collapsed={collapsed}>
              {ids.map(renderNavButton)}
            </SidebarNavGroup>
          </React.Fragment>
        ))}
      </nav>

      {/* Footer actions */}
      <div className={`flex-shrink-0 border-t border-white/[0.06] space-y-1 ${collapsed ? "p-2" : "p-3"}`}>
        {showCollapseToggle && onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={`w-full flex items-center gap-2.5 rounded-xl text-white/45 hover:bg-white/[0.06] hover:text-white text-sm font-medium transition ${
              collapsed ? "justify-center p-2.5" : "px-3 py-2.5"
            }`}
          >
            {collapsed ? (
              <PanelLeftOpen className="w-4 h-4" />
            ) : (
              <>
                <PanelLeftClose className="w-4 h-4" />
                <span>Collapse</span>
              </>
            )}
          </button>
        )}

        <button
          type="button"
          onClick={onExitToSite}
          title={collapsed ? "Back to website" : undefined}
          className={`w-full flex items-center gap-2.5 rounded-xl text-white/45 hover:bg-white/[0.06] hover:text-white text-sm font-medium transition ${
            collapsed ? "justify-center p-2.5" : "px-3 py-2.5"
          }`}
        >
          <ExternalLink className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Back to website</span>}
        </button>

        <button
          type="button"
          id="btn-admin-logout"
          onClick={onLogout}
          title={collapsed ? "Sign out" : undefined}
          className={`w-full flex items-center gap-2.5 rounded-xl border border-white/10 text-white/45 hover:bg-rose-500/10 hover:border-rose-500/25 hover:text-rose-300 text-sm font-medium transition ${
            collapsed ? "justify-center p-2.5" : "px-3 py-2.5"
          }`}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Sign out</span>}
        </button>
      </div>
    </div>
  );
}

export default function AdminLayout({
  activeTab,
  navItems,
  onTabChange,
  onLogout,
  onExitToSite,
  pendingCount = 0,
  children,
}: AdminLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem("adminSidebarCollapsed") === "1";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("adminSidebarCollapsed", collapsed ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, [collapsed]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const sidebarWidth = collapsed ? "w-[4.5rem]" : "w-[17.5rem]";

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-100">
      {/* Desktop sidebar */}
      <aside
        className={`hidden md:flex flex-shrink-0 flex-col border-r border-brand-950/50 transition-[width] duration-300 ease-in-out ${sidebarWidth}`}
      >
        <AdminSidebar
          activeTab={activeTab}
          navItems={navItems}
          collapsed={collapsed}
          pendingCount={pendingCount}
          onTabChange={onTabChange}
          onLogout={onLogout}
          onExitToSite={onExitToSite}
          onToggleCollapse={() => setCollapsed((c) => !c)}
        />
      </aside>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="md:hidden fixed inset-0 z-40 bg-[#2a0c0a]/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile slide-out sidebar */}
      <aside
        className={`md:hidden fixed inset-y-0 left-0 z-50 w-[17.5rem] transform transition-transform duration-300 ease-out shadow-2xl ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <AdminSidebar
          activeTab={activeTab}
          navItems={navItems}
          collapsed={false}
          pendingCount={pendingCount}
          onTabChange={onTabChange}
          onLogout={onLogout}
          onExitToSite={onExitToSite}
          onNavigate={() => setMobileOpen(false)}
          showCollapseToggle={false}
        />
      </aside>

      {/* Main workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-14 flex-shrink-0 bg-white border-b border-slate-200/80 flex items-center justify-between px-4 sm:px-6 gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 -ml-1 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-brand-600 transition"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="min-w-0">
              <h1 className="text-base font-bold text-[#3d1210] truncate">
                {ADMIN_TAB_TITLES[activeTab]}
              </h1>
              <p className="text-[11px] text-slate-400 hidden sm:block truncate">
                {ADMIN_TAB_SUBTITLES[activeTab]}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {pendingCount > 0 && (
              <button
                type="button"
                onClick={() => onTabChange("submissions")}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent-50 border border-accent-100 text-[11px] font-semibold text-accent-700 hover:bg-accent-100 transition"
              >
                <Bell className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">{pendingCount} pending</span>
                <span className="xs:hidden">{pendingCount}</span>
              </button>
            )}

            <button
              type="button"
              onClick={onExitToSite}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Website
            </button>

            {mobileOpen && (
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="md:hidden p-2 rounded-xl border border-slate-200 text-slate-500"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm shadow-slate-200/40 p-5 sm:p-6 lg:p-8 min-h-[calc(100vh-8rem)]">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
