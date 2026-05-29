import React, { useState, useEffect } from "react";
import { Testimonial, ContactSubmission, Doctor, Service, GalleryItem } from "../../types";
import { FileText, PlusCircle } from "lucide-react";
import AdminLogin from "./AdminLogin";
import AdminLayout from "./AdminLayout";
import AdminDashboard from "./AdminDashboard";
import AdminSystemSettings from "./AdminSystemSettings";
import AdminServicesManager from "./AdminServicesManager";
import AdminGalleryManager from "./AdminGalleryManager";
import AdminMessagesManager from "./AdminMessagesManager";
import AdminTestimonialsManager from "./AdminTestimonialsManager";
import AdminDoctorsManager from "./AdminDoctorsManager";
import { AdminTab, AdminNavItem } from "./adminTypes";

interface AdminPanelProps {
  doctors: Doctor[];
  services: Service[];
  gallery: GalleryItem[];
  testimonials: Testimonial[];
  submissions: ContactSubmission[];
  onRefreshData: () => void;
  onExitToSite: () => void;
}

export default function AdminPanel({
  doctors,
  services,
  gallery,
  testimonials,
  submissions,
  onRefreshData,
  onExitToSite,
}: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPin, setAdminPin] = useState("1234");

  const [activeTab, setActiveTab] = useState<AdminTab>(() => {
    const saved = sessionStorage.getItem("adminActiveTab");
    const validTabs: AdminTab[] = [
      "dashboard",
      "system",
      "services",
      "gallery",
      "testimonials",
      "submissions",
      "doctors",
      "publish",
    ];
    return validTabs.includes(saved as AdminTab) ? (saved as AdminTab) : "dashboard";
  });

  useEffect(() => {
    sessionStorage.setItem("adminActiveTab", activeTab);
  }, [activeTab]);

  // State handles for doctor edits and post publisher
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postImg, setPostImg] = useState("");
  const [postMsg, setPostMsg] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.admin_pin) setAdminPin(data.admin_pin);
      })
      .catch(() => {});
  }, []);

  const pendingReviewCount = testimonials.filter((t) => !t.approved).length;
  const newMessageCount = submissions.filter((s) => (s.status ?? "new") === "new").length;

  const navItems: AdminNavItem[] = [
    { id: "dashboard", label: "Dashboard" },
    { id: "system", label: "System settings" },
    { id: "services", label: "Services" },
    { id: "gallery", label: "Portfolio" },
    { id: "testimonials", label: "Testimonials", badge: pendingReviewCount },
    { id: "submissions", label: "Messages", badge: newMessageCount },
    { id: "doctors", label: "Doctors" },
    { id: "publish", label: "Blog" },
  ];

  const handleLogin = (pin: string) => {
    if (pin === adminPin) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const handlePublishPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle || !postContent) {
      setPostMsg("Title and clinical content are required.");
      return;
    }

    try {
      const response = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: postTitle,
          content: postContent,
          thumbnail_url: postImg
        })
      });

      if (response.ok) {
        onRefreshData();
        setPostTitle("");
        setPostContent("");
        setPostImg("");
        setPostMsg("Article published successfully to Science Library!");
      } else {
        setPostMsg("Failed to upload the post.");
      }
    } catch (err: any) {
      setPostMsg(err.message || "An error occurred.");
    }
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} onExitToSite={onExitToSite} />;
  }

  const pendingCount = pendingReviewCount + newMessageCount;

  return (
    <AdminLayout
      activeTab={activeTab}
      navItems={navItems}
      onTabChange={setActiveTab}
      onLogout={() => setIsAuthenticated(false)}
      onExitToSite={onExitToSite}
      pendingCount={pendingCount}
    >
      {activeTab === "dashboard" && (
        <AdminDashboard
          testimonials={testimonials}
          submissions={submissions}
          doctors={doctors}
          services={services}
          gallery={gallery}
          onNavigate={setActiveTab}
        />
      )}

      {activeTab === "system" && (
        <AdminSystemSettings onSaved={onRefreshData} />
      )}

      {activeTab === "services" && (
        <AdminServicesManager services={services} onRefresh={onRefreshData} />
      )}

      {activeTab === "gallery" && (
        <AdminGalleryManager gallery={gallery} onRefresh={onRefreshData} />
      )}

      {activeTab === "submissions" && (
        <AdminMessagesManager submissions={submissions} onRefresh={onRefreshData} />
      )}

      {activeTab === "testimonials" && (
        <AdminTestimonialsManager testimonials={testimonials} onRefresh={onRefreshData} />
      )}

      {activeTab === "doctors" && (
        <AdminDoctorsManager doctors={doctors} onRefresh={onRefreshData} />
      )}

        {/* TAB 5: BLOG PUBLISHER FORM */}
        {activeTab === "publish" && (
          <form onSubmit={handlePublishPost} className="flex flex-col gap-5">
            <h3 className="font-sans text-xs tracking-wider text-slate-400 font-bold uppercase border-b pb-2">
              Publish New Science Article
            </h3>

            {postMsg && (
              <p className="text-[11px] font-semibold text-brand-700 bg-brand-50 border border-brand-100 p-2.5 rounded-xl">
                {postMsg}
              </p>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-[10px] font-bold text-slate-700 tracking-wider uppercase">
                Essay/Article Title
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Tooth Longevity: The Molecular Science of Ceramic Restores"
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                className="p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-[#3d1210] focus:outline-none"
                id="input-publish-title"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-[10px] font-bold text-slate-700 tracking-wider uppercase">
                Header Hero Illustration (Unsplash Direct URL or leave empty for default)
              </label>
              <input
                type="text"
                placeholder="e.g. https://images.unsplash.com/..."
                value={postImg}
                onChange={(e) => setPostImg(e.target.value)}
                className="p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-[#3d1210] focus:outline-none"
                id="input-publish-image"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-[10px] font-bold text-slate-700 tracking-wider uppercase">
                Content Body text (Markdown Supported with headers like "### Heading")
              </label>
              <textarea
                required
                placeholder="Write your article here..."
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                className="p-4 h-48 bg-slate-50 border border-slate-300 rounded-xl text-xs text-[#3d1210] focus:outline-none leading-relaxed"
                id="input-publish-content"
              />
            </div>

            <button
              type="submit"
              className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-sans text-xs font-bold uppercase tracking-wider transition self-start min-w-[200px]"
              id="btn-admin-publish-article"
            >
              Publish Article
            </button>
          </form>
        )}

    </AdminLayout>
  );
}
