export interface Service {
  service_id: string;
  service_name: string;
  category: string;
  description: string;
  detailed_info: string;
  estimated_duration_minutes: number;
  price_range: string;
  model3D_id: string; // 'implant' | 'root_canal' | 'aligner' | 'crown_bridge' | 'tooth_extraction'
  image_url?: string;
  faqs: { question: string; answer: string }[];
}

export interface Doctor {
  doctor_id: string;
  name: string;
  specialization: string;
  qualifications: string;
  bio: string;
  profile_picture_url: string;
  availability: {
    [day: string]: string[]; // e.g. "Monday": ["09:00", "10:00", "11:00", "14:00", "15:00"]
  };
  schedule_updated_at?: string;
  schedule_updated_by?: string;
  updated_at?: string;
}

export interface Appointment {
  appointment_id: string;
  patient_name: string;
  patient_email: string;
  patient_phone: string;
  doctor_id: string;
  service_id: string;
  start_time: string; // ISO String
  notes: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  admin_notes?: string;
  created_at: string;
}

export interface Testimonial {
  testimonial_id: string;
  patient_name: string;
  content: string;
  rating: number; // 1-5
  approved: boolean;
  created_at: string;
}

export interface BlogPost {
  post_id: string;
  title: string;
  slug: string;
  content: string;
  thumbnail_url: string;
  published_at: string;
}

export interface ContactSubmission {
  submission_id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status?: "new" | "read" | "archived";
  created_at: string;
}

export interface ClinicSettings {
  clinic_name: string;
  tagline: string;
  address: string;
  city: string;
  phone_primary: string;
  phone_secondary: string;
  email: string;
  hours_days: string;
  hours_morning: string;
  hours_afternoon: string;
  map_lat: number;
  map_lng: number;
  about_summary: string;
  footer_tagline: string;
  admin_pin: string;
  whatsapp_url?: string;
  facebook_url?: string;
}

export interface TourHotspot {
  id: string;
  title: string;
  description: string;
  position: [number, number, number]; // 3D position x, y, z
  linkedServiceId?: string; // Links to a procedure page
  linkedDoctorId?: string; // Links to doctor
  details?: string;
}

export type GalleryCategory = "treatment" | "equipment" | "clinic";

export interface GalleryItem {
  item_id: string;
  category: GalleryCategory;
  title: string;
  description: string;
  treatment_type?: string;
  before_url?: string;
  after_url?: string;
  image_url?: string;
  published: boolean;
  sort_order: number;
  created_at: string;
}
