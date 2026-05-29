import React, { useState, useEffect } from "react";
import { Service, Doctor, Appointment } from "../types";
import { AlertCircle, Calendar as CalIcon, User, Layers, ArrowRight, CheckCircle2, Shield, Phone, Mail, FileText, Send, Clock } from "lucide-react";

interface BookingViewProps {
  services: Service[];
  doctors: Doctor[];
  selectedDoctorId?: string;
  onAppointmentBooked: (newApp: Appointment) => void;
}

export default function BookingView({ services, doctors, selectedDoctorId, onAppointmentBooked }: BookingViewProps) {
  // Booking wizard steps: 1 = service/doctor selection, 2 = time slot selection, 3 = patient form, 4 = confirmation printout
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<Service | null>(services[0]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(
    doctors.find(d => d.doctor_id === selectedDoctorId) || doctors[0]
  );
  
  // Available dates (Next 5 clinic working days starting today, skipping Fridays/Sundays optionally if desired)
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  
  // Form details
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [medicalConsent, setMedicalConsent] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [bookedApp, setBookedApp] = useState<Appointment | null>(null);

  // Generate date options
  const [availableDates, setAvailableDates] = useState<{ dayName: string; dateStr: string; label: string }[]>([]);

  useEffect(() => {
    const list = [];
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    
    // We start from tomorrow to ensure appointments don't happen in the past
    for (let i = 1; i <= 6; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const dayName = weekdays[d.getDay()];
      
      // Let's assume clinic is closed on Fridays for dental sterilization
      if (dayName === "Friday") continue;

      const dateStr = d.toISOString().split("T")[0];
      const label = `${dayName}, ${d.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
      list.push({ dayName, dateStr, label });
    }
    setAvailableDates(list);
    if (list.length > 0) {
      setSelectedDate(list[0].dateStr);
    }
  }, []);

  // Compute available hours depending on selected doctor & selected day
  const getDoctorHoursForSelectedDate = () => {
    if (!selectedDoctor || !selectedDate) return [];
    
    // Find weekday name of selectedDate
    const matchingDateObj = availableDates.find(d => d.dateStr === selectedDate);
    if (!matchingDateObj) return [];
    
    const dayName = matchingDateObj.dayName;
    return selectedDoctor.availability[dayName] || [];
  };

  // Auto-select a valid time slot when doctor, date or day changes
  useEffect(() => {
    const hours = getDoctorHoursForSelectedDate();
    if (hours.length > 0) {
      setSelectedTimeSlot(hours[0]);
    } else {
      setSelectedTimeSlot("");
    }
  }, [selectedDoctor, selectedDate]);

  const handleNextStep = () => {
    if (step === 1) {
      if (!selectedService || !selectedDoctor) {
        setError("Please choose both a dental treatment and practitioner.");
        return;
      }
      setError("");
      setStep(2);
    } else if (step === 2) {
      if (!selectedDate || !selectedTimeSlot) {
        setError("Please select a date and an available hour slot.");
        return;
      }
      setError("");
      setStep(3);
    }
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) {
      setError("Please fill in your name, email, and contact number.");
      return;
    }
    if (!medicalConsent) {
      setError("Please accept the dental medical clearance consent to proceed.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Reconstruct final start_time ISO timestamp
      const startTimeISO = new Date(`${selectedDate}T${selectedTimeSlot}:00`).toISOString();

      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_name: name,
          patient_email: email,
          patient_phone: phone,
          doctor_id: selectedDoctor!.doctor_id,
          service_id: selectedService!.service_id,
          start_time: startTimeISO,
          notes
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to transmit appointment request.");
      }

      const freshApp: Appointment = await response.json();
      setBookedApp(freshApp);
      onAppointmentBooked(freshApp);
      setStep(4); // Show confirmation receipt
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during database transmission.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto pb-12">
      {/* CARD FRAME */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden flex flex-col">
        
        {/* PROGRESS HEADER BAR */}
        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between">
          <h2 className="font-sans text-xs tracking-wider text-accent-500 font-bold uppercase">
            Appointments Booking Portal
          </h2>
          
          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
            <span className={step >= 1 ? "text-white font-bold" : ""}>1. DISCIPLINE</span>
            <span>→</span>
            <span className={step >= 2 ? "text-white font-bold" : ""}>2. SCHEDULE</span>
            <span>→</span>
            <span className={step >= 3 ? "text-white font-bold" : ""}>3. VERIFY</span>
          </div>
        </div>

        {/* FEEDBACK WARNINGS */}
        {error && (
          <div className="p-4 bg-rose-50 border-b border-rose-100 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* STEP CONTROLLERS */}
        <div className="p-6 lg:p-8 flex-1">
          
          {/* STEP 1: SERVICE & DOCTOR SELECTIONS */}
          {step === 1 && (
            <div className="flex flex-col gap-6">
              
              {/* Dental treatment selection */}
              <div className="flex flex-col gap-2.5">
                <label className="font-sans text-xs font-bold uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-brand-600" />
                  Select Required Treatment
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {services.map((s) => (
                    <button
                      key={s.service_id}
                      onClick={() => setSelectedService(s)}
                      className={`text-left p-4 rounded-xl border transition flex flex-col gap-1 ${
                        selectedService?.service_id === s.service_id
                          ? "bg-slate-50 border-brand-600/60 ring-2 ring-brand-500/10"
                          : "bg-white border-slate-250 hover:bg-slate-50"
                      }`}
                      id={`btn-select-booking-treatment-${s.service_id}`}
                    >
                      <span className="font-sans text-xs font-bold uppercase tracking-wider text-slate-800">{s.service_name}</span>
                      <span className="text-[10px] text-slate-400 font-mono uppercase">{s.category} • {s.price_range}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Doctor selection */}
              <div className="flex flex-col gap-2.5 mt-2">
                <label className="font-sans text-xs font-bold uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
                  <User className="w-4 h-4 text-brand-600" />
                  Choose Dental Practitioner
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {doctors.map((d) => (
                    <button
                      key={d.doctor_id}
                      onClick={() => setSelectedDoctor(d)}
                      className={`text-left p-4 rounded-xl border transition flex items-center gap-4 ${
                        selectedDoctor?.doctor_id === d.doctor_id
                          ? "bg-slate-50 border-brand-600/60 ring-2 ring-brand-500/10"
                          : "bg-white border-slate-200 hover:bg-slate-50"
                      }`}
                      id={`btn-select-booking-doc-${d.doctor_id}`}
                    >
                      <img
                        src={d.profile_picture_url}
                        alt={d.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-full object-cover bg-slate-100"
                      />
                      <div className="flex-1">
                        <h4 className="font-sans text-xs font-bold uppercase text-slate-800">{d.name}</h4>
                        <p className="text-[10px] text-brand-600 uppercase font-mono mt-0.5">{d.specialization}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleNextStep}
                className="mt-4 p-3.5 w-full bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
                id="btn-booking-next-step-1"
              >
                Proceed to Schedule Choose
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>
          )}

          {/* STEP 2: DATES & HOURS TIMEPICKER */}
          {step === 2 && (
            <div className="flex flex-col gap-6">
              
              {/* Calendar Date selector */}
              <div className="flex flex-col gap-2.5">
                <label className="font-sans text-xs font-bold uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
                  <CalIcon className="w-4 h-4 text-brand-600" />
                  Available Working Days
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {availableDates.map((d) => (
                    <button
                      key={d.dateStr}
                      onClick={() => setSelectedDate(d.dateStr)}
                      className={`p-3 rounded-xl border transition text-center flex flex-col items-center gap-1.5 ${
                        selectedDate === d.dateStr
                          ? "bg-slate-100 border-brand-600/60 ring-2 ring-brand-500/10"
                          : "bg-white border-slate-200 hover:bg-slate-50"
                      }`}
                      id={`btn-select-booking-date-${d.dateStr}`}
                    >
                      <span className="font-sans text-xs font-bold uppercase tracking-wider text-slate-800">
                        {d.dayName}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {d.dateStr.split("-").reverse().join("/")}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time slots slots available for selected doctor/day */}
              <div className="flex flex-col gap-2.5 mt-2">
                <label className="font-sans text-xs font-bold uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-brand-600" />
                  Hour Slot (Doctor Session Check)
                </label>
                
                {getDoctorHoursForSelectedDate().length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {getDoctorHoursForSelectedDate().map((hour) => {
                      const isSelected = selectedTimeSlot === hour;
                      return (
                        <button
                          key={hour}
                          onClick={() => setSelectedTimeSlot(hour)}
                          className={`p-2.5 rounded-lg border text-xs font-semibold font-mono tracking-wider transition ${
                            isSelected
                              ? "bg-brand-600 text-white border-brand-600"
                              : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                          }`}
                          id={`btn-select-booking-hour-${hour}`}
                        >
                          {hour}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-4 bg-slate-50 rounded-xl text-center text-xs text-slate-400 border border-slate-200/40">
                    No active sessions found for this practitioner on this day. Please try another day or doctor.
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setStep(1)}
                  className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold uppercase tracking-wider transition"
                  id="btn-booking-back-1"
                >
                  Back
                </button>
                <button
                  onClick={handleNextStep}
                  disabled={!selectedTimeSlot}
                  className="flex-1 p-3.5 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition"
                  id="btn-booking-next-step-2"
                >
                  Enter Patient Records
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

          {/* STEP 3: PATIENT HISTORY FORM */}
          {step === 3 && (
            <form onSubmit={handleSubmitBooking} className="flex flex-col gap-5">
              
              {/* Full name */}
              <div className="flex flex-col gap-1.5">
                <label className="font-sans text-xs font-bold uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                  <User className="w-4 h-4 text-slate-400" />
                  Your Legal Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Youssef Farid"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="p-3 rounded-xl border border-slate-300 text-slate-800 text-xs bg-slate-50/50"
                  id="input-booking-name"
                />
              </div>

              {/* Core contact details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-sans text-xs font-bold uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-slate-400" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="p-3 rounded-xl border border-slate-300 text-slate-800 text-xs bg-slate-50/50"
                    id="input-booking-email"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-sans text-xs font-bold uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-slate-400" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +201011112222"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="p-3 rounded-xl border border-slate-300 text-slate-800 text-xs bg-slate-50/50"
                    id="input-booking-phone"
                  />
                </div>
              </div>

              {/* Health reason notes */}
              <div className="flex flex-col gap-1.5">
                <label className="font-sans text-xs font-bold uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-slate-400" />
                  Reason for Consultation & Notes
                </label>
                <textarea
                  placeholder="Tell us about your dental issue, decay history or custom requests here..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="p-3 h-24 rounded-xl border border-slate-300 text-slate-800 text-xs bg-slate-50/50"
                  id="input-booking-notes"
                />
              </div>

              {/* Consent checkbox */}
              <label className="flex items-start gap-2.5 mt-1 cursor-pointer select-none">
                <input
                  type="checkbox"
                  required
                  checked={medicalConsent}
                  onChange={(e) => setMedicalConsent(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 bg-slate-50 text-brand-600 focus:ring-brand-500"
                  id="chk-booking-consent"
                />
                <span className="font-sans text-slate-500 text-[11px] leading-relaxed">
                  I consent to sharing my clinical reason notes with Qahira's registered practitioner board. I record that these coordinates remain strictly covered under HIPAA standard patient medical safeguards.
                </span>
              </label>

              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold uppercase tracking-wider transition"
                  id="btn-booking-back-2"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 p-3.5 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition"
                  id="btn-booking-submit"
                >
                  {loading ? "Transmitting..." : "Schedule Session Confirm"}
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>

            </form>
          )}

          {/* STEP 4: SUCCESS RECEIPT */}
          {step === 4 && bookedApp && (
            <div className="flex flex-col items-center justify-center text-center gap-6 p-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-600 animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="flex flex-col gap-1.5">
                <h3 className="font-sans text-xl font-extrabold text-[#3d1210] tracking-tight uppercase">
                  Appointment Scheduled!
                </h3>
                <p className="text-slate-400 font-mono text-[10px] uppercase">
                  REFERENCE CODE: {bookedApp.appointment_id.toUpperCase()}
                </p>
                <p className="font-sans text-xs text-slate-500 max-w-md mt-1 leading-relaxed">
                  Your appointment request has been submitted to Qahira Clinic database successfully. A clinical concierge receptionist is validating your slot timing right now.
                </p>
              </div>

              {/* Interactive Virtual transmission feedback receipt details */}
              <div className="w-full bg-slate-900 text-white rounded-2xl p-5 text-left flex flex-col gap-3.5 border border-brand-900/40">
                <div className="flex items-center justify-between border-b border-brand-950/50 pb-3">
                  <span className="font-mono text-[10px] text-accent-400 uppercase tracking-widest">
                    Digital Clinic Receipt
                  </span>
                  <span className="text-[10px] bg-amber-500/10 text-amber-400 font-semibold p-0.5 px-2.5 rounded border border-amber-500/25 uppercase tracking-wider">
                    PENDING APPROVAL
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 font-sans text-xs">
                  <div>
                    <span className="text-slate-400 uppercase text-[9px] font-mono tracking-wider">Patient Name</span>
                    <p className="text-white font-semibold mt-0.5">{bookedApp.patient_name}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 uppercase text-[9px] font-mono tracking-wider">Contact Phone</span>
                    <p className="text-white font-semibold mt-0.5">{bookedApp.patient_phone}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 uppercase text-[9px] font-mono tracking-wider">treatment</span>
                    <p className="text-white font-semibold mt-0.5 uppercase tracking-wide">
                      {services.find(s => s.service_id === bookedApp.service_id)?.service_name || bookedApp.service_id}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400 uppercase text-[9px] font-mono tracking-wider">Practitioner</span>
                    <p className="text-white font-semibold mt-0.5 uppercase">
                      {doctors.find(d => d.doctor_id === bookedApp.doctor_id)?.name || bookedApp.doctor_id}
                    </p>
                  </div>
                  <div className="col-span-2 border-t border-brand-950/50 pt-3">
                    <span className="text-slate-400 uppercase text-[9px] font-mono tracking-wider font-semibold">Appointment date</span>
                    <p className="text-accent-300 font-bold text-sm mt-0.5">
                      {new Date(bookedApp.start_time).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </p>
                  </div>
                </div>

                {/* Simulated notifications logger console block */}
                <div className="bg-slate-950 p-2.5 rounded-xl border border-brand-950 flex flex-col gap-1.5 font-mono text-[9px] text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-ping" />
                    <span className="text-slate-300 uppercase tracking-wider font-bold">TRANSMISSION FEEDBACK SERVICES:</span>
                  </div>
                  <p className="text-emerald-500">[DB_SUCCESS]: Record locked on appointments table in db.json.</p>
                  <p className="text-accent-500">[EMAIL_OUTGOING]: Patient confirmation dispatched to &lt;{bookedApp.patient_email}&gt;.</p>
                  <p className="text-accent-400">[SMS_DISPATCHED]: SMS scheduling reminder delivered to &lt;{bookedApp.patient_phone}&gt;.</p>
                </div>
              </div>

              <div className="flex gap-3 w-full">
                <button
                  onClick={() => {
                    setStep(1);
                    setName("");
                    setEmail("");
                    setPhone("");
                    setNotes("");
                    setMedicalConsent(false);
                  }}
                  className="flex-1 p-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold uppercase tracking-wider transition"
                  id="btn-book-another"
                >
                  Schedule Another Slot
                </button>
              </div>
            </div>
          )}

        </div>

        {/* FOOTER SAFE BADGE */}
        {step !== 4 && (
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-500" />
              Patient medical privacy securely protected by clinic.
            </span>
            <span className="font-mono text-slate-400 text-[10px]">VER: 3.1.25.C</span>
          </div>
        )}

      </div>
    </div>
  );
}
