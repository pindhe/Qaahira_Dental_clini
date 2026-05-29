import React, { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Star,
  MessageSquare,
  ArrowUpRight,
  Shield,
} from "lucide-react";
import { ClinicSettings } from "../types";

interface ContactViewProps {
  settings?: ClinicSettings | null;
  onRefreshData: () => void;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-[11px] font-semibold text-brand-600 uppercase tracking-[0.14em]">
      <span className="w-6 h-px bg-accent-400" />
      {children}
    </span>
  );
}

function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="p-0.5 transition hover:scale-110"
          aria-label={`Rate ${star} stars`}
        >
          <Star
            className={`w-5 h-5 ${
              star <= value ? "fill-amber-400 text-amber-400" : "text-slate-300"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

function ContactHero({ settings }: { settings?: ClinicSettings | null }) {
  const clinicName = settings?.clinic_name ?? "Qaahira Denta Care";
  const city = settings?.city ?? "Hargeisa";

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#3d1210] via-slate-950 to-[#4a1511] text-white">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_70%,transparent_100%)]" />
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-brand-500/15 rounded-full blur-3xl" />

      <div className="relative z-10 p-8 sm:p-10 lg:p-12">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-accent-400 font-medium mb-5">
            <MessageSquare className="w-3.5 h-3.5" />
            {clinicName} · {city}
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
            Get in{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-500 to-accent-300">
              touch with us
            </span>
          </h1>

          <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
            {settings?.about_summary ??
              "Send us a message or call the clinic. Our Qaahira Denta Care team responds to inquiries within one working day."}
          </p>
        </div>
      </div>
    </section>
  );
}

function ContactInfoPanel({ settings }: { settings?: ClinicSettings | null }) {
  const clinicName = settings?.clinic_name ?? "Qaahira Denta Care";
  const address = settings?.address ?? "Hargeisa, near Dawlada Hoose ee Hargaysa";
  const city = settings?.city ?? "Hargeisa";
  const phonePrimary = settings?.phone_primary ?? "+252 63 6249555";
  const phoneSecondary = settings?.phone_secondary ?? "";
  const email = settings?.email ?? "kharash420@gmail.com";
  const hoursDays = settings?.hours_days ?? "Sat – Thu";
  const hoursMorning = settings?.hours_morning ?? "07:00 – 12:00";
  const hoursAfternoon = settings?.hours_afternoon ?? "16:00 – 20:00";
  const mapLat = settings?.map_lat ?? 9.5616;
  const mapLng = settings?.map_lng ?? 44.0718;

  const tel = (phone: string) => phone.replace(/[\s-]/g, "");
  const mapEmbedUrl = `https://maps.google.com/maps?q=${mapLat},${mapLng}&hl=en&z=17&output=embed`;
  const mapDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${mapLat},${mapLng}`;

  const infoItems = [
    {
      icon: MapPin,
      title: "Address",
      content: (
        <>
          <p className="text-sm text-slate-300 leading-relaxed">{address}</p>
          <p className="text-xs text-slate-500 mt-1">{city}</p>
        </>
      ),
      action: (
        <a
          href={mapDirectionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 mt-2 text-xs font-semibold text-accent-500 hover:text-accent-400 transition"
          id="contact-link-directions"
        >
          Get directions
          <ArrowUpRight className="w-3 h-3" />
        </a>
      ),
    },
    {
      icon: Phone,
      title: "Phone",
      content: (
        <div className="space-y-1 font-mono text-sm text-slate-300">
          <a href={`tel:${tel(phonePrimary)}`} className="block hover:text-accent-500 transition">
            {phonePrimary}
          </a>
          {phoneSecondary && (
            <a href={`tel:${tel(phoneSecondary)}`} className="block hover:text-accent-500 transition">
              {phoneSecondary}
            </a>
          )}
        </div>
      ),
    },
    {
      icon: Mail,
      title: "Email",
      content: (
        <a
          href={`mailto:${email}`}
          className="text-sm text-slate-300 hover:text-accent-500 transition font-mono break-all"
        >
          {email}
        </a>
      ),
    },
    {
      icon: Clock,
      title: "Opening hours",
      content: (
        <div className="text-sm text-slate-300 space-y-1">
          <p>{hoursDays}</p>
          <p className="text-slate-400">Morning: {hoursMorning}</p>
          <p className="text-slate-400">Afternoon: {hoursAfternoon}</p>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="p-6 sm:p-7 bg-[#3d1210] text-white rounded-3xl border border-slate-800 shadow-lg flex flex-col gap-6">
        <div>
          <SectionLabel>Clinic details</SectionLabel>
          <h2 className="mt-3 text-lg font-bold text-white">{clinicName}</h2>
        </div>

        <div className="flex flex-col gap-5">
          {infoItems.map(({ icon: Icon, title, content, action }) => (
            <div key={title} className="flex gap-3">
              <div className="w-9 h-9 rounded-xl bg-brand-500/15 border border-brand-500/25 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-accent-500" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</h3>
                <div className="mt-1">{content}</div>
                {action}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-sm h-[260px] sm:h-[300px] relative bg-slate-100">
        <iframe
          title={`${clinicName} on Google Maps`}
          src={mapEmbedUrl}
          className="absolute inset-0 w-full h-full border-0 grayscale-[15%] contrast-[1.05]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      <div className="p-5 rounded-2xl bg-brand-50/60 border border-brand-100 flex gap-3">
        <Shield className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-slate-600 leading-relaxed">
          Your message is stored securely and reviewed by our reception team. We typically respond within
          one working day during clinic hours.
        </p>
      </div>
    </div>
  );
}

export default function ContactView({
  settings,
  onRefreshData,
}: ContactViewProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const [loading, setLoading] = useState(false);

  const [revName, setRevName] = useState("");
  const [revRating, setRevRating] = useState(5);
  const [revContent, setRevContent] = useState("");
  const [revSubmitted, setRevSubmitted] = useState(false);
  const [revMsg, setRevMsg] = useState("");
  const [revLoading, setRevLoading] = useState(false);

  const handleSubmitContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setSubmissionError("Please enter your name, email, and message.");
      return;
    }

    setLoading(true);
    setSubmissionError("");

    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), phone: phone.trim(), message: message.trim() }),
      });

      if (!response.ok) throw new Error("Could not send your message. Please try again.");

      setIsSubmitted(true);
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
      onRefreshData();
    } catch (err: any) {
      setSubmissionError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!revName.trim() || !revContent.trim()) {
      setRevMsg("Please enter your name and review.");
      return;
    }

    setRevLoading(true);
    setRevMsg("");

    try {
      const response = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_name: revName.trim(),
          content: revContent.trim(),
          rating: revRating,
        }),
      });

      if (!response.ok) throw new Error("Could not submit your review. Please try again.");

      setRevSubmitted(true);
      setRevName("");
      setRevContent("");
      setRevRating(5);
      setRevMsg("");
      onRefreshData();
    } catch (err: any) {
      setRevMsg(err.message || "Something went wrong. Please try again.");
    } finally {
      setRevLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-10 pb-10" id="contact-view-root">
      <ContactHero settings={settings} />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        <div className="xl:col-span-7 flex flex-col gap-8">
          {/* Contact form */}
          <section className="p-6 sm:p-8 bg-white border border-slate-100 rounded-3xl shadow-sm">
            <SectionLabel>Send a message</SectionLabel>
            <h2 className="mt-3 text-xl sm:text-2xl font-bold text-[#3d1210] tracking-tight">
              Contact the clinic
            </h2>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed">
              Ask about treatments, pricing, or availability. All fields marked with * are required.
            </p>

            {isSubmitted ? (
              <div className="mt-6 p-5 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-slate-900">Message sent</h3>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                    Thank you — your message has been received. Our team will get back to you within one
                    working day.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsSubmitted(false)}
                    className="text-sm text-brand-600 font-semibold mt-3 hover:text-brand-500 transition"
                    id="btn-contact-send-another"
                  >
                    Send another message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitContact} className="mt-6 flex flex-col gap-5">
                {submissionError && (
                  <p className="p-3 bg-rose-50 border border-rose-100 text-rose-700 text-sm rounded-xl">
                    {submissionError}
                  </p>
                )}

                <div>
                  <label htmlFor="contact-name" className="text-xs font-semibold text-slate-700 block mb-1.5">
                    Full name *
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-accent-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="contact-email" className="text-xs font-semibold text-slate-700 block mb-1.5">
                      Email *
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-accent-400"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-phone" className="text-xs font-semibold text-slate-700 block mb-1.5">
                      Phone <span className="text-slate-400 font-normal">(optional)</span>
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      placeholder="+252 …"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-accent-400"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-message" className="text-xs font-semibold text-slate-700 block mb-1.5">
                    Message *
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    placeholder="How can we help you?"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={5}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-accent-400 leading-relaxed resize-y min-h-[120px]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-500 disabled:opacity-60 text-white rounded-xl text-sm font-semibold transition self-start"
                  id="btn-contact-submit"
                >
                  {loading ? "Sending…" : "Send message"}
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </section>

          {/* Review form */}
          <section className="p-6 sm:p-8 bg-slate-50 border border-slate-100 rounded-3xl">
            <SectionLabel>Patient feedback</SectionLabel>
            <h2 className="mt-3 text-xl font-bold text-[#3d1210] tracking-tight">Share your experience</h2>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed">
              Reviews are moderated before appearing on the website.
            </p>

            {revSubmitted ? (
              <div className="mt-6 p-5 bg-white rounded-2xl border border-emerald-100 flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-slate-900">Review submitted</h3>
                  <p className="text-sm text-slate-600 mt-1">
                    Thank you! Your review is pending approval and will appear on our site once verified.
                  </p>
                  <button
                    type="button"
                    onClick={() => setRevSubmitted(false)}
                    className="text-sm text-brand-600 font-semibold mt-3 hover:text-brand-500 transition"
                  >
                    Submit another review
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="mt-6 flex flex-col gap-5">
                {revMsg && (
                  <p className="p-3 bg-rose-50 border border-rose-100 text-rose-700 text-sm rounded-xl">
                    {revMsg}
                  </p>
                )}

                <div>
                  <label htmlFor="review-name" className="text-xs font-semibold text-slate-700 block mb-1.5">
                    Your name *
                  </label>
                  <input
                    id="review-name"
                    type="text"
                    required
                    placeholder="How should we display your name?"
                    value={revName}
                    onChange={(e) => setRevName(e.target.value)}
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-2">Rating</label>
                  <StarPicker value={revRating} onChange={setRevRating} />
                </div>

                <div>
                  <label htmlFor="review-content" className="text-xs font-semibold text-slate-700 block mb-1.5">
                    Your review *
                  </label>
                  <textarea
                    id="review-content"
                    required
                    placeholder="Tell us about your visit…"
                    value={revContent}
                    onChange={(e) => setRevContent(e.target.value)}
                    rows={4}
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 leading-relaxed resize-y"
                  />
                </div>

                <button
                  type="submit"
                  disabled={revLoading}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#3d1210] hover:bg-slate-800 disabled:opacity-60 text-white rounded-xl text-sm font-semibold transition self-start"
                  id="btn-review-submit"
                >
                  {revLoading ? "Submitting…" : "Submit review"}
                </button>
              </form>
            )}
          </section>
        </div>

        <aside className="xl:col-span-5">
          <ContactInfoPanel settings={settings} />
        </aside>
      </div>
    </div>
  );
}
