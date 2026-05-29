import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const app = express();
app.use(express.json({ limit: "8mb" }));

const PORT = 3000;
const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "db.json");
const DOCTOR_UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "doctors");
const PORTFOLIO_UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "portfolio");
const SERVICE_UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "services");

// Define type representations matching `/src/types.ts`
import { Service, Doctor, Appointment, Testimonial, BlogPost, ContactSubmission, ClinicSettings, GalleryItem } from "./src/types";

// Initialize lowdb-like local persistence using a single JSON file
function initDatabase() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  const initialServices: Service[] = [];

  const initialDoctors: Doctor[] = [];

  const initialTestimonials: Testimonial[] = [
    {
      testimonial_id: "t1",
      patient_name: "Sherif Kamel",
      content: "I was extremely anxious about getting a dental implant. Dr. Youssef took time to explain the procedure using their 3D visualization. The actual implants felt painless, and the outcome changed my chewing comfort entirely! Unparalleled service at Qahira Clinic.",
      rating: 5,
      approved: true,
      created_at: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString()
    },
    {
      testimonial_id: "t2",
      patient_name: "Mariam Salem",
      content: "Excellent experience with Dr. Amina for clear aligners! The 3D tour allowed me to see the clinic layout and surgical equipment standard beforehand, which was so reassuring. The aligners are completely clear, and my teeth are shifting perfectly.",
      rating: 5,
      approved: true,
      created_at: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString()
    },
    {
      testimonial_id: "t3",
      patient_name: "Layla Farid",
      content: "Dr. Tarek is a child-whisperer! My 6-year-old son actually looks forward to visiting the dentist now. The waiting area is beautifully decorated, and everyone is incredibly warm and encouraging.",
      rating: 5,
      approved: true,
      created_at: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString()
    }
  ];

  const initialBlogPosts: BlogPost[] = [
    {
      post_id: "post-1",
      title: "Understanding Dental Implants: From Surgical Post to Symmetrical Smile",
      slug: "understanding-dental-implants",
      content: "### Introduction to Dental Restoration\n\nWhen you lose a dental structure, it can heavily affect dietary comfort, pronunciation, and aesthetic confidence. Today, titanium dental implants stand as the absolute gold standard in tooth replacement, boasting a 98% clinical success rate.\n\n### The Science of Osseointegration\n\nWhat makes dental implants unique is a biological phenomenon called **osseointegration**. Discovered by Swedish researcher Per-Ingvar Brånemark, titanium possesses an exceptional biocompatibility that permits bone tissue to bond directly to its microscopic helical structure. This bone-titanium weld replaces the natural root system.\n\n### Step-by-Step Restoration Journey\n\n1. **Diagnostic Planning**: High-resolution 3D CBCT scans are taken to map bone density and locate vital nerves.\n2. **Post Placement**: Under localized anesthesia, the surgical dentist creates a small site and inserts the tiny titanium post.\n3. **Fusing Phase**: Over a period of 3-4 months, the surrounding jawbone grows directly around the post, creating a heavy-duty anchor.\n4. **Abutment & Restoration**: Once stabilized, a connector (abutment) is attached, and a custom crown is secured.",
      thumbnail_url: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=600&h=400&fit=crop",
      published_at: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString()
    },
    {
      post_id: "post-2",
      title: "Clear Aligners vs. Metal Braces: Honest Pediatric & Adult Orthodontics Guide",
      slug: "clear-aligners-vs-braces",
      content: "### Modern Smile Alignment\n\nFor decades, metal braces with brackets, wires, and rubber bands were the sole treatment option for crowding, gaps, and overbites. However, custom clear aligners have completely redefined the orthodontic landscape.\n\n### Key Differences at a Glance\n\n- **Aesthetic Profile**: Aligners are virtually invisible, made of transparent medical polyurethane. Braces are highly visible metal or ceramic brackets.\n- **Hygiene & Dietary Liberty**: Since aligners are removable, you can enjoy crisp apples or sticky caramels without worry, and brushing remains straightforward without specialized floss-threaders.\n- **Comfort Patterns**: Aligners apply a mild, continuous orthodontic force, resulting in fewer painful abrasions inside the lips compared to metal brackets.\n\n### Who is Eligible?\n\nWhile aligners manage the vast majority of mild-to-moderate orthodontic crowding, rotations, and vertical gaps, extremely severe skeletal jaw misalignments may still benefit from traditional wire frameworks or surgical intervention.",
      thumbnail_url: "https://images.unsplash.com/photo-1513429813219-c59e72d2787e?q=80&w=600&h=400&fit=crop",
      published_at: new Date(Date.now() - 8 * 24 * 3600 * 1000).toISOString()
    }
  ];

  const initialAppointments: Appointment[] = [
    {
      appointment_id: "app-1",
      patient_name: "Yassine Mansoor",
      patient_email: "yassine@example.com",
      patient_phone: "+201011112222",
      doctor_id: "dr-youssef",
      service_id: "root-canal",
      start_time: new Date(Date.now() + 1 * 24 * 3600 * 1000).toISOString(),
      notes: "First time consultation regarding root canal treatment.",
      status: "confirmed",
      created_at: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString()
    },
    {
      appointment_id: "app-2",
      patient_name: "Nouran Selim",
      patient_email: "nouran@example.com",
      patient_phone: "+201022223333",
      doctor_id: "dr-amina",
      service_id: "aligners",
      start_time: new Date(Date.now() + 2 * 24 * 3600 * 1000).toISOString(),
      notes: "Routine Invisalign scan and replacement tray checkup.",
      status: "pending",
      created_at: new Date(Date.now()).toISOString()
    }
  ];

  const sampleSubmissions: ContactSubmission[] = [];

  const initialGallery: GalleryItem[] = [];

  if (!fs.existsSync(DB_FILE)) {
    const defaultData = {
      services: initialServices,
      doctors: initialDoctors,
      testimonials: initialTestimonials,
      blog_posts: initialBlogPosts,
      appointments: initialAppointments,
      contact_submissions: sampleSubmissions,
      gallery: initialGallery,
      settings: getDefaultSettings()
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2));
    console.log("Initialized local JSON database successfully at " + DB_FILE);
  }
}

function getDefaultSettings(): ClinicSettings {
  return {
    clinic_name: "Qaahira Denta Care",
    tagline: "Clinical 3D Suite",
    address: "Hargeisa, near Dawlada Hoose ee Hargaysa",
    city: "Hargeisa",
    phone_primary: "+252 63 6249555",
    phone_secondary: "+252 63 4953675",
    email: "kharash420@gmail.com",
    hours_days: "Sat – Thu",
    hours_morning: "07:00 – 12:00",
    hours_afternoon: "16:00 – 20:00",
    map_lat: 9.5616,
    map_lng: 44.0718,
    about_summary:
      "Modern dental care with digital treatment planning, strict sterilization, and patient-centred service — right here in Hargeisa.",
    footer_tagline:
      "Modern dental care with digital treatment planning, strict sterilization, and patient-centred service — right here in Hargeisa.",
    admin_pin: "1234",
    whatsapp_url: "",
    facebook_url: "",
  };
}

function ensureGallery(db: any): GalleryItem[] {
  if (!Array.isArray(db.gallery)) {
    db.gallery = [];
    saveDB(db);
  }
  return db.gallery as GalleryItem[];
}

function ensureSettings(db: any) {
  if (!db.settings) {
    db.settings = getDefaultSettings();
    saveDB(db);
  }
  return db.settings as ClinicSettings;
}

initDatabase();

// Load / write helper functions
function getDB() {
  const content = fs.readFileSync(DB_FILE, "utf-8");
  return JSON.parse(content);
}

function saveDB(data: any) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

function ensureDoctorUploadDir() {
  if (!fs.existsSync(DOCTOR_UPLOAD_DIR)) {
    fs.mkdirSync(DOCTOR_UPLOAD_DIR, { recursive: true });
  }
}

function ensurePortfolioUploadDir() {
  if (!fs.existsSync(PORTFOLIO_UPLOAD_DIR)) {
    fs.mkdirSync(PORTFOLIO_UPLOAD_DIR, { recursive: true });
  }
}

function ensureServiceUploadDir() {
  if (!fs.existsSync(SERVICE_UPLOAD_DIR)) {
    fs.mkdirSync(SERVICE_UPLOAD_DIR, { recursive: true });
  }
}

type UploadKind = "doctors" | "portfolio" | "services";

function handleImageUpload(
  req: express.Request,
  res: express.Response,
  kind: UploadKind,
  prefix: string
) {
  try {
    const { data } = req.body;
    if (!data || typeof data !== "string") {
      return res.status(400).json({ error: "Image data is required." });
    }

    const match = data.match(/^data:(image\/(?:jpeg|png|webp|gif));base64,(.+)$/i);
    if (!match) {
      return res.status(400).json({ error: "Invalid image format. Use JPG, PNG, WebP, or GIF." });
    }

    const mime = match[1].toLowerCase();
    const ext = mime.includes("jpeg") ? "jpg" : mime.split("/")[1];
    const buffer = Buffer.from(match[2], "base64");

    if (buffer.length > 5 * 1024 * 1024) {
      return res.status(400).json({ error: "Image must be smaller than 5 MB." });
    }

    const dirs: Record<UploadKind, () => void> = {
      doctors: ensureDoctorUploadDir,
      portfolio: ensurePortfolioUploadDir,
      services: ensureServiceUploadDir,
    };
    dirs[kind]();

    const dirMap: Record<UploadKind, string> = {
      doctors: DOCTOR_UPLOAD_DIR,
      portfolio: PORTFOLIO_UPLOAD_DIR,
      services: SERVICE_UPLOAD_DIR,
    };

    const filename = `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    fs.writeFileSync(path.join(dirMap[kind], filename), buffer);

    res.status(201).json({ url: `/uploads/${kind}/${filename}` });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Upload failed." });
  }
}

// REST ENDPOINTS

// Doctors
app.get("/api/doctors", (req, res) => {
  try {
    const db = getDB();
    res.json(db.doctors);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/doctors", (req, res) => {
  try {
    const db = getDB();
    const {
      name,
      specialization,
      qualifications,
      bio,
      profile_picture_url,
      availability,
      schedule_updated_at,
      schedule_updated_by,
    } = req.body;
    if (!name || !specialization || !qualifications || !bio) {
      return res.status(400).json({ error: "Missing required fields for registering doctor" });
    }
    const now = new Date().toISOString();
    const newDoctor: Doctor = {
      doctor_id: "dr-" + name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") + "-" + Math.random().toString(36).substr(2, 4),
      name: String(name).trim(),
      specialization: String(specialization).trim(),
      qualifications: String(qualifications).trim(),
      bio: String(bio).trim(),
      profile_picture_url: profile_picture_url || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=400&h=400&fit=crop",
      availability: availability && typeof availability === "object" ? availability : {},
      schedule_updated_at: schedule_updated_at || now,
      schedule_updated_by: schedule_updated_by || "Clinic Admin",
      updated_at: now,
    };
    db.doctors.push(newDoctor);
    saveDB(db);
    res.status(201).json(newDoctor);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/doctors/:id", (req, res) => {
  try {
    const db = getDB();
    const index = db.doctors.findIndex((d: any) => d.doctor_id === req.params.id);
    if (index !== -1) {
      db.doctors[index] = { ...db.doctors[index], ...req.body, updated_at: new Date().toISOString() };
      saveDB(db);
      res.json(db.doctors[index]);
    } else {
      res.status(404).json({ error: "Doctor not found" });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/doctors/:id", (req, res) => {
  try {
    const db = getDB();
    const index = db.doctors.findIndex((d: any) => d.doctor_id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "Doctor not found" });
    db.doctors.splice(index, 1);
    saveDB(db);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Services
app.get("/api/services", (req, res) => {
  try {
    const db = getDB();
    res.json(db.services);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/services", (req, res) => {
  try {
    const db = getDB();
    const {
      service_name,
      category,
      description,
      detailed_info,
      estimated_duration_minutes,
      price_range,
      model3D_id,
      image_url,
      faqs,
    } = req.body;

    if (!service_name || !category || !description) {
      return res.status(400).json({ error: "Service name, category, and description are required" });
    }

    const service_id =
      req.body.service_id ||
      service_name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

    if (db.services.some((s: Service) => s.service_id === service_id)) {
      return res.status(409).json({ error: "A service with this ID already exists" });
    }

    const newService: Service = {
      service_id,
      service_name,
      category,
      description,
      detailed_info: detailed_info || description,
      estimated_duration_minutes: Number(estimated_duration_minutes) || 30,
      price_range: price_range || "Contact clinic",
      model3D_id: model3D_id || "",
      image_url: image_url || "",
      faqs: faqs || [],
    };

    db.services.push(newService);
    saveDB(db);
    res.status(201).json(newService);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/services/:id", (req, res) => {
  try {
    const db = getDB();
    const index = db.services.findIndex((s: Service) => s.service_id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: "Service not found" });
    }
    db.services[index] = { ...db.services[index], ...req.body, service_id: req.params.id };
    saveDB(db);
    res.json(db.services[index]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/services/:id", (req, res) => {
  try {
    const db = getDB();
    const index = db.services.findIndex((s: Service) => s.service_id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: "Service not found" });
    }
    db.services.splice(index, 1);
    saveDB(db);
    res.json({ message: "Service removed" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Portfolio gallery
app.get("/api/gallery", (req, res) => {
  try {
    const db = getDB();
    const gallery = ensureGallery(db);
    const publishedOnly = req.query.published === "true";
    const items = publishedOnly ? gallery.filter((g) => g.published) : gallery;
    res.json(items.sort((a, b) => a.sort_order - b.sort_order));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/gallery", (req, res) => {
  try {
    const db = getDB();
    const gallery = ensureGallery(db);
    const {
      category,
      title,
      description,
      treatment_type,
      before_url,
      after_url,
      image_url,
      published,
      sort_order,
    } = req.body;

    if (!title || !category || !description) {
      return res.status(400).json({ error: "Title, category, and description are required" });
    }

    if (category === "treatment" && (!before_url || !after_url)) {
      return res.status(400).json({ error: "Before and after image URLs are required for treatment cases" });
    }

    if (category !== "treatment" && !image_url) {
      return res.status(400).json({ error: "Image URL is required for equipment and clinic items" });
    }

    const item_id =
      req.body.item_id ||
      "gal-" + title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") + "-" + Math.random().toString(36).substr(2, 4);

    if (gallery.some((g) => g.item_id === item_id)) {
      return res.status(409).json({ error: "A gallery item with this ID already exists" });
    }

    const newItem: GalleryItem = {
      item_id,
      category,
      title,
      description,
      treatment_type: treatment_type || "",
      before_url: category === "treatment" ? before_url : undefined,
      after_url: category === "treatment" ? after_url : undefined,
      image_url: category !== "treatment" ? image_url : undefined,
      published: published !== false,
      sort_order: Number(sort_order) || gallery.length + 1,
      created_at: new Date().toISOString(),
    };

    gallery.push(newItem);
    saveDB(db);
    res.status(201).json(newItem);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/gallery/:id", (req, res) => {
  try {
    const db = getDB();
    const gallery = ensureGallery(db);
    const index = gallery.findIndex((g) => g.item_id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: "Gallery item not found" });
    }

    const updated = { ...gallery[index], ...req.body, item_id: req.params.id };
    if (updated.category === "treatment") {
      updated.image_url = undefined;
    } else {
      updated.before_url = undefined;
      updated.after_url = undefined;
    }

    gallery[index] = updated;
    saveDB(db);
    res.json(gallery[index]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/gallery/:id", (req, res) => {
  try {
    const db = getDB();
    const gallery = ensureGallery(db);
    const index = gallery.findIndex((g) => g.item_id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: "Gallery item not found" });
    }
    gallery.splice(index, 1);
    saveDB(db);
    res.json({ message: "Gallery item removed" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Clinic system settings
app.get("/api/settings", (req, res) => {
  try {
    const db = getDB();
    const settings = ensureSettings(db);
    res.json(settings);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/settings", (req, res) => {
  try {
    const db = getDB();
    const current = ensureSettings(db);
    const { admin_pin, ...rest } = req.body;
    db.settings = {
      ...current,
      ...rest,
      ...(admin_pin !== undefined && admin_pin !== "" ? { admin_pin } : {}),
    };
    saveDB(db);
    res.json(db.settings);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Testimonials
app.get("/api/testimonials", (req, res) => {
  try {
    const db = getDB();
    res.json(db.testimonials);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/testimonials", (req, res) => {
  try {
    const db = getDB();
    const { patient_name, content, rating } = req.body;
    if (!patient_name || !content || !rating) {
      return res.status(400).json({ error: "Missing required fields for testimonial" });
    }
    const newTestimonial: Testimonial = {
      testimonial_id: "testimonial-" + Math.random().toString(36).substr(2, 9),
      patient_name,
      content,
      rating: Number(rating),
      approved: false, // Default pending admin approval
      created_at: new Date().toISOString()
    };
    db.testimonials.push(newTestimonial);
    saveDB(db);
    res.status(201).json({ message: "Thank you! Your review is pending moderation.", testimonial: newTestimonial });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/testimonials/:id", (req, res) => {
  try {
    const db = getDB();
    const index = db.testimonials.findIndex((item: any) => item.testimonial_id === req.params.id);
    if (index !== -1) {
      db.testimonials[index] = { ...db.testimonials[index], ...req.body };
      saveDB(db);
      res.json(db.testimonials[index]);
    } else {
      res.status(404).json({ error: "Testimonial not found" });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/testimonials/:id", (req, res) => {
  try {
    const db = getDB();
    const index = db.testimonials.findIndex((item: any) => item.testimonial_id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "Testimonial not found" });
    db.testimonials.splice(index, 1);
    saveDB(db);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Appointments (Patients Book / Admins Moderate)
app.get("/api/appointments", (req, res) => {
  try {
    const db = getDB();
    res.json(db.appointments);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/appointments", (req, res) => {
  try {
    const db = getDB();
    const { patient_name, patient_email, patient_phone, doctor_id, service_id, start_time, notes } = req.body;
    if (!patient_name || !patient_email || !patient_phone || !doctor_id || !service_id || !start_time) {
      return res.status(400).json({ error: "Missing required appointment fields" });
    }

    const newAppointment: Appointment = {
      appointment_id: "app-" + Math.random().toString(36).substr(2, 9),
      patient_name,
      patient_email,
      patient_phone,
      doctor_id,
      service_id,
      start_time,
      notes: notes || "",
      status: "pending", // Always defaults to pending
      created_at: new Date().toISOString()
    };

    db.appointments.push(newAppointment);
    saveDB(db);
    res.status(201).json(newAppointment);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/appointments/:id", (req, res) => {
  try {
    const db = getDB();
    const index = db.appointments.findIndex((a: any) => a.appointment_id === req.params.id);
    if (index !== -1) {
      db.appointments[index] = { ...db.appointments[index], ...req.body };
      saveDB(db);
      res.json(db.appointments[index]);
    } else {
      res.status(404).json({ error: "Appointment not found" });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Blog Posts
app.get("/api/blog", (req, res) => {
  try {
    const db = getDB();
    res.json(db.blog_posts);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/blog", (req, res) => {
  try {
    const db = getDB();
    const { title, content, thumbnail_url } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required for a blog post" });
    }
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    
    const newPost: BlogPost = {
      post_id: "post-" + Math.random().toString(36).substr(2, 9),
      title,
      slug,
      content,
      thumbnail_url: thumbnail_url || "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=600&h=400&fit=crop",
      published_at: new Date().toISOString()
    };
    db.blog_posts.unshift(newPost);
    saveDB(db);
    res.status(201).json(newPost);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Submissions
app.get("/api/submissions", (req, res) => {
  try {
    const db = getDB();
    const sorted = [...db.contact_submissions].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    res.json(sorted);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/submissions", (req, res) => {
  try {
    const db = getDB();
    const { name, email, phone, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Name, email, and message are required" });
    }
    const newSubmission: ContactSubmission = {
      submission_id: "sub-" + Math.random().toString(36).substr(2, 9),
      name: String(name).trim(),
      email: String(email).trim(),
      phone: phone ? String(phone).trim() : undefined,
      message: String(message).trim(),
      status: "new",
      created_at: new Date().toISOString()
    };
    db.contact_submissions.unshift(newSubmission);
    saveDB(db);
    res.status(201).json(newSubmission);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/submissions/:id", (req, res) => {
  try {
    const db = getDB();
    const index = db.contact_submissions.findIndex((s) => s.submission_id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "Message not found" });

    const { status } = req.body;
    if (status && !["new", "read", "archived"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    db.contact_submissions[index] = {
      ...db.contact_submissions[index],
      ...(status ? { status } : {}),
    };
    saveDB(db);
    res.json(db.contact_submissions[index]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/submissions/:id", (req, res) => {
  try {
    const db = getDB();
    const index = db.contact_submissions.findIndex((s) => s.submission_id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "Message not found" });

    db.contact_submissions.splice(index, 1);
    saveDB(db);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Image uploads
app.post("/api/upload/doctor-photo", (req, res) => handleImageUpload(req, res, "doctors", "doctor"));
app.post("/api/upload/portfolio-image", (req, res) => handleImageUpload(req, res, "portfolio", "portfolio"));
app.post("/api/upload/service-image", (req, res) => handleImageUpload(req, res, "services", "service"));
app.post("/api/upload/image", (req, res) => {
  const kind = req.body?.kind as UploadKind | undefined;
  if (kind === "portfolio" || kind === "services" || kind === "doctors") {
    const prefix = kind === "doctors" ? "doctor" : kind === "portfolio" ? "portfolio" : "service";
    return handleImageUpload(req, res, kind, prefix);
  }
  return res.status(400).json({ error: "Invalid upload kind. Use doctors, portfolio, or services." });
});

app.use((err: any, _req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({ error: "Invalid request body." });
  }
  next(err);
});

// START EXPRESS SERVER INTEGRATION WITH VITE
async function startServer() {
  const publicUploadsPath = path.join(process.cwd(), "public", "uploads");
  app.use("/uploads", express.static(publicUploadsPath));

  if (process.env.NODE_ENV !== "production") {
    // Development mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
    console.log("Vite middleware attached in Development Mode.");
  } else {
    // Production mode
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving static files in Production Mode from " + distPath);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Qahira Dental Server running on http://localhost:${PORT}`);
  });
}

startServer();
