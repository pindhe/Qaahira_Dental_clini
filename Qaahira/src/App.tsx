import React, { useState, useEffect } from "react";
import HomeView from "./components/HomeView";
import ServicesView from "./components/ServicesView";
import TeamView from "./components/TeamView";
import ThreeClinicTour from "./components/ThreeClinicTour";
import GalleryView from "./components/GalleryView";
import BlogView from "./components/BlogView";
import ContactView from "./components/ContactView";
import AdminPanel from "./components/admin/AdminPanel";
import AboutView from "./components/AboutView";
import Footer from "./components/Footer";
import ClinicLogo from "./components/ClinicLogo";
import FloatingActionDock from "./components/FloatingActionDock";
import { Service, Doctor, Testimonial, BlogPost, ContactSubmission, Appointment, ClinicSettings, GalleryItem } from "./types";
import { Sparkles, Menu, X, ArrowRight, ChevronDown, MessageSquare } from "lucide-react";

export default function App() {
  // Navigation: 'home' | 'services' | 'team' | 'booking' | 'tour3D' | 'gallery' | 'blog' | 'contact' | 'admin'
  const [activeView, setActiveView] = useState<string>("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesMenuOpen, setServicesMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  // States
  const [services, setServices] = useState<Service[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [clinicSettings, setClinicSettings] = useState<ClinicSettings | null>(null);

  // Selection deep-links
  const [selectedServiceId, setSelectedServiceId] = useState<string | undefined>(undefined);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | undefined>(undefined);

  // Quick helper to fetch all variables from DB API
  const refreshClinicData = async () => {
    try {
      const [resServ, resDoc, resTest, resBlog, resSubs, resApps, resGallery, resSettings] = await Promise.all([
        fetch("/api/services").then(r => r.json()),
        fetch("/api/doctors").then(r => r.json()),
        fetch("/api/testimonials").then(r => r.json()),
        fetch("/api/blog").then(r => r.json()),
        fetch("/api/submissions").then(r => r.json()),
        fetch("/api/appointments").then(r => r.json()),
        fetch("/api/gallery").then(r => r.json()),
        fetch("/api/settings").then(r => r.json()).catch(() => null)
      ]);

      setServices(resServ);
      setDoctors(resDoc);
      setTestimonials(resTest);
      setBlogPosts(resBlog);
      setSubmissions(resSubs);
      setAppointments(resApps);
      setGallery(Array.isArray(resGallery) ? resGallery : []);
      if (resSettings) setClinicSettings(resSettings);
    } catch (err) {
      console.warn("API Server fetching had a warning or is booting, initializing fallbacks.");
    }
  };

  useEffect(() => {
    refreshClinicData();
    // Warm-up interval to sync and pull updates
    const interval = setInterval(refreshClinicData, 10000);
    return () => clearInterval(interval);
  }, []);

  // Handle deep-linked custom navigation helpers
  const handleLinkToService = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    setActiveView("services");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const displayDoctors = doctors;

  const displayTestimonials = testimonials.length > 0 ? testimonials : [
    {
      testimonial_id: "t1",
      patient_name: "Sherif Kamel",
      content: "Magnificent 3D procedure simulator clarity! My dental implant feels so seamless.",
      rating: 5,
      approved: true,
      created_at: new Date().toISOString()
    }
  ];

  const displayBlogPosts = blogPosts.length > 0 ? blogPosts : [
    {
      post_id: "post-1",
      title: "Understanding Dental Implants Restorations",
      slug: "understanding-dental-implants",
      content: "Highly researched surgical reviews...",
      thumbnail_url: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=600&h=400&fit=crop",
      published_at: new Date().toISOString()
    }
  ];

  const exitAdminToSite = () => {
    setActiveView("home");
    setSelectedServiceId(undefined);
    setSelectedDoctorId(undefined);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigateTo = (view: string) => {
    setActiveView(view);
    setSelectedServiceId(undefined);
    setSelectedDoctorId(undefined);
    setServicesMenuOpen(false);
    setMobileServicesOpen(false);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isServicesMenuActive = activeView === "services" || activeView === "team";

  if (activeView === "admin") {
    return (
      <AdminPanel
        doctors={displayDoctors}
        services={services}
        gallery={gallery}
        testimonials={testimonials}
        submissions={submissions}
        onRefreshData={refreshClinicData}
        onExitToSite={exitAdminToSite}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfaf9] text-slate-800 flex flex-col justify-between font-sans">
      
      {/* 1. TOP HEADER BANNER (SAFE CLINIC SHELL) */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Clinic Brand Identity Logo */}
          <div 
            onClick={() => { setActiveView("home"); setSelectedServiceId(undefined); }}
            className="flex items-center gap-2.5 cursor-pointer select-none"
            id="brand-logo"
          >
            <ClinicLogo size="md" />
            <div>
              <span className="font-sans font-extrabold text-[#3d1210] tracking-tight text-sm uppercase block leading-none">
                {clinicSettings?.clinic_name ?? "Qaahira Denta Care"}
              </span>
              <span className="text-[10px] text-brand-600 font-mono tracking-widest font-semibold uppercase block mt-1">
                {clinicSettings?.tagline ?? "Clinical 3D Suite"}
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5 p-1.5 bg-slate-50/80 rounded-2xl border border-slate-100">
            {/* 1. Home Link */}
            <button
              onClick={() => navigateTo("home")}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-sans font-bold tracking-wider uppercase transition-all duration-150 ${
                activeView === "home"
                  ? "bg-white text-brand-600 shadow-sm border border-slate-200"
                  : "text-slate-650 hover:text-slate-900 hover:bg-slate-100/60"
              }`}
              id="nav-link-home"
            >
              HOME
            </button>

            <button
              onClick={() => navigateTo("about")}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-sans font-bold tracking-wider uppercase transition-all duration-150 ${
                activeView === "about"
                  ? "bg-white text-brand-600 shadow-sm border border-slate-200"
                  : "text-slate-650 hover:text-slate-900 hover:bg-slate-100/60"
              }`}
              id="nav-link-about"
            >
              ABOUT
            </button>

            {/* Services dropdown — Services & Doctors */}
            <div className="relative">
              <button
                onClick={() => setServicesMenuOpen((open) => !open)}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-[11px] font-sans font-bold tracking-wider uppercase transition-all duration-150 ${
                  isServicesMenuActive || servicesMenuOpen
                    ? "bg-white text-brand-600 shadow-sm border border-slate-200"
                    : "text-slate-650 hover:text-slate-900 hover:bg-slate-100/60"
                }`}
                id="nav-link-services-menu"
                aria-expanded={servicesMenuOpen}
                aria-haspopup="true"
              >
                SERVICES
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${servicesMenuOpen ? "rotate-180" : ""}`}
                />
              </button>

              {servicesMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    aria-hidden
                    onClick={() => setServicesMenuOpen(false)}
                  />
                  <div className="absolute top-full left-0 mt-1.5 z-50 min-w-[160px] py-1.5 bg-white border border-slate-100 rounded-xl shadow-lg shadow-slate-200/60">
                    <button
                      onClick={() => navigateTo("services")}
                      className={`w-full text-left px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider transition ${
                        activeView === "services"
                          ? "text-brand-600 bg-brand-50"
                          : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                      id="nav-link-services"
                    >
                      Services
                    </button>
                    <button
                      onClick={() => navigateTo("team")}
                      className={`w-full text-left px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider transition ${
                        activeView === "team"
                          ? "text-brand-600 bg-brand-50"
                          : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                      id="nav-link-doctors"
                    >
                      Doctors
                    </button>
                  </div>
                </>
              )}
            </div>

            <button
              onClick={() => navigateTo("gallery")}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-sans font-bold tracking-wider uppercase transition-all duration-150 ${
                activeView === "gallery"
                  ? "bg-white text-brand-600 shadow-sm border border-slate-200"
                  : "text-slate-650 hover:text-slate-900 hover:bg-slate-100/60"
              }`}
              id="nav-link-portfolio"
            >
              PORTFOLIO
            </button>

            <button
              onClick={() => navigateTo("contact")}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-sans font-bold tracking-wider uppercase transition-all duration-150 ${
                activeView === "contact"
                  ? "bg-white text-brand-600 shadow-sm border border-slate-200"
                  : "text-slate-650 hover:text-slate-900 hover:bg-slate-100/60"
              }`}
              id="nav-link-contact"
            >
              CONTACT
            </button>
          </nav>

          {/* Mobile menu toggle */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-700"
              id="btn-mobile-menu-toggle"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Flyout Navigation Drawer */}
        {menuOpen && (
          <div className="lg:hidden border-t border-slate-100 bg-white p-4 flex flex-col gap-2.5 shadow-lg absolute w-full left-0 right-0 z-50">
            {[
              { id: "home", label: "WELCOME" },
              { id: "about", label: "ABOUT US" },
              { id: "gallery", label: "PORTFOLIO" },
              { id: "contact", label: "CONTACT" },
            ].map((link) => (
              <button
                key={link.id}
                onClick={() => navigateTo(link.id)}
                className={`text-[11px] font-bold uppercase tracking-wider text-left p-3 rounded-xl transition ${
                  activeView === link.id
                    ? "bg-brand-50 text-brand-600 border border-brand-100"
                    : "text-slate-650 hover:bg-slate-50 hover:text-slate-900"
                }`}
                id={`mobile-nav-link-${link.id}`}
              >
                {link.label}
              </button>
            ))}

            {/* Services submenu */}
            <div className="flex flex-col gap-1">
              <button
                onClick={() => setMobileServicesOpen((open) => !open)}
                className={`text-[11px] font-bold uppercase tracking-wider text-left p-3 rounded-xl transition flex items-center justify-between ${
                  isServicesMenuActive
                    ? "bg-brand-50 text-brand-600 border border-brand-100"
                    : "text-slate-650 hover:bg-slate-50 hover:text-slate-900"
                }`}
                id="mobile-nav-link-services-menu"
              >
                SERVICES
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${mobileServicesOpen ? "rotate-180" : ""}`}
                />
              </button>
              {mobileServicesOpen && (
                <div className="ml-3 flex flex-col gap-1 border-l-2 border-slate-100 pl-3">
                  <button
                    onClick={() => navigateTo("services")}
                    className={`text-[11px] font-bold uppercase tracking-wider text-left p-2.5 rounded-lg transition ${
                      activeView === "services" ? "text-brand-600 bg-brand-50" : "text-slate-600 hover:bg-slate-50"
                    }`}
                    id="mobile-nav-link-services"
                  >
                    Services
                  </button>
                  <button
                    onClick={() => navigateTo("team")}
                    className={`text-[11px] font-bold uppercase tracking-wider text-left p-2.5 rounded-lg transition ${
                      activeView === "team" ? "text-brand-600 bg-brand-50" : "text-slate-600 hover:bg-slate-50"
                    }`}
                    id="mobile-nav-link-doctors"
                  >
                    Doctors
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* 2. MAIN APPLICATION WORKSPACE VIEWPORTS */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {activeView === "home" && (
          <HomeView
            onNavigate={(view) => {
              setActiveView(view);
              setSelectedServiceId(undefined);
              setSelectedDoctorId(undefined);
            }}
            onNavigateToService={handleLinkToService}
            services={services}
            doctors={displayDoctors}
            testimonials={displayTestimonials}
          />
        )}

        {activeView === "about" && (
          <AboutView
            onNavigateToTour={() => {
              setActiveView("gallery");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            services={services}
            doctors={displayDoctors}
            testimonials={displayTestimonials}
          />
        )}

        {activeView === "services" && (
          <ServicesView
            services={services}
            onNavigateToContact={() => navigateTo("contact")}
            selectedServiceId={selectedServiceId}
          />
        )}

        {activeView === "team" && (
          <TeamView
            doctors={displayDoctors}
            onNavigateToContact={() => navigateTo("contact")}
          />
        )}

        {activeView === "gallery" && (
          <GalleryView items={gallery.filter((g) => g.published)} />
        )}

        {activeView === "contact" && (
          <ContactView
            settings={clinicSettings}
            onRefreshData={refreshClinicData}
          />
        )}

      </main>

      <Footer
        settings={clinicSettings}
        onNavigate={(view) => {
          setActiveView(view);
          setSelectedServiceId(undefined);
          setSelectedDoctorId(undefined);
        }}
      />

      <FloatingActionDock settings={clinicSettings} />

    </div>
  );
}
