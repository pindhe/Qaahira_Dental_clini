-- ============================================================
-- Qaahira Dental Clinic — Complete Database (single file)
-- Import in phpMyAdmin: Import → choose this file → Go
-- Default admin: kharash420@gmail.com
-- ============================================================

DROP DATABASE IF EXISTS qaahira_dental;
CREATE DATABASE qaahira_dental CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE qaahira_dental;

-- Admins
CREATE TABLE admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Customers / Patients
CREATE TABLE customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Dentists
CREATE TABLE dentists (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    name_ar VARCHAR(100),
    photo VARCHAR(255),
    specialization VARCHAR(150),
    specialization_ar VARCHAR(150),
    qualification TEXT,
    qualification_ar TEXT,
    experience VARCHAR(50),
    education TEXT,
    education_ar TEXT,
    bio TEXT,
    bio_ar TEXT,
    awards VARCHAR(500),
    awards_ar VARCHAR(500),
    languages_spoken VARCHAR(255),
    availability JSON,
    is_active TINYINT(1) DEFAULT 1,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Service Categories
CREATE TABLE service_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    name_ar VARCHAR(100),
    slug VARCHAR(100) NOT NULL UNIQUE
);

-- Services
CREATE TABLE services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT,
    name VARCHAR(150) NOT NULL,
    name_ar VARCHAR(150),
    slug VARCHAR(150) NOT NULL UNIQUE,
    description TEXT,
    description_ar TEXT,
    benefits TEXT,
    benefits_ar TEXT,
    procedure_details TEXT,
    procedure_details_ar TEXT,
    price DECIMAL(10,2) NOT NULL DEFAULT 0,
    duration INT NOT NULL DEFAULT 30 COMMENT 'minutes',
    icon VARCHAR(100),
    image VARCHAR(255),
    before_image VARCHAR(255),
    after_image VARCHAR(255),
    is_featured TINYINT(1) DEFAULT 0,
    is_active TINYINT(1) DEFAULT 1,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES service_categories(id) ON DELETE SET NULL
);

-- Appointments
CREATE TABLE appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    customer_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    service_id INT,
    dentist_id INT,
    preferred_date DATE NOT NULL,
    preferred_time TIME NOT NULL,
    notes TEXT,
    status ENUM('pending','approved','rejected','rescheduled','completed','cancelled') DEFAULT 'pending',
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL,
    FOREIGN KEY (dentist_id) REFERENCES dentists(id) ON DELETE SET NULL
);

-- Blog Posts
CREATE TABLE blogs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    title_ar VARCHAR(255),
    slug VARCHAR(255) NOT NULL UNIQUE,
    category VARCHAR(50) DEFAULT 'dental-tips',
    excerpt TEXT,
    excerpt_ar TEXT,
    content LONGTEXT,
    content_ar LONGTEXT,
    featured_image VARCHAR(255),
    author VARCHAR(100),
    is_published TINYINT(1) DEFAULT 0,
    views INT DEFAULT 0,
    published_at DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Gallery
CREATE TABLE gallery (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150),
    title_ar VARCHAR(150),
    image VARCHAR(255) NOT NULL,
    category ENUM('clinic','treatment','equipment','team','results') DEFAULT 'clinic',
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Testimonials
CREATE TABLE testimonials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_name VARCHAR(100) NOT NULL,
    patient_name_ar VARCHAR(100),
    photo VARCHAR(255),
    rating TINYINT DEFAULT 5,
    review TEXT NOT NULL,
    review_ar TEXT,
    is_featured TINYINT(1) DEFAULT 0,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- FAQs
CREATE TABLE faqs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question VARCHAR(500) NOT NULL,
    question_ar VARCHAR(500),
    answer TEXT NOT NULL,
    answer_ar TEXT,
    sort_order INT DEFAULT 0,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contact Messages
CREATE TABLE contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    reply TEXT,
    is_archived TINYINT(1) DEFAULT 0,
    is_read TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    replied_at DATETIME
);

-- Settings (key-value)
CREATE TABLE settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT,
    setting_group VARCHAR(50) DEFAULT 'general'
);

-- Homepage Content
CREATE TABLE homepage_content (
    id INT AUTO_INCREMENT PRIMARY KEY,
    section_key VARCHAR(100) NOT NULL UNIQUE,
    title VARCHAR(255),
    title_ar VARCHAR(255),
    subtitle TEXT,
    subtitle_ar TEXT,
    content TEXT,
    content_ar TEXT,
    image VARCHAR(255),
    extra_data JSON
);

-- About Us Content
CREATE TABLE about_content (
    id INT AUTO_INCREMENT PRIMARY KEY,
    section_key VARCHAR(100) NOT NULL UNIQUE,
    title VARCHAR(255),
    title_ar VARCHAR(255),
    content TEXT,
    content_ar TEXT,
    image VARCHAR(255)
);

-- Notifications
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    is_read TINYINT(1) DEFAULT 0,
    link VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Visitors (analytics)
CREATE TABLE visitors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ip_address VARCHAR(45),
    page_url VARCHAR(255),
    visited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- SEED DATA
-- ============================================================

-- Admin account
INSERT INTO admins (name, email, password) VALUES
('Admin', 'kharash420@gmail.com', '$2y$12$9ey9lZ365c9dStqz2FiKce2azLXbKG/aolxqwAY7lr3Yu2yL9L/0.');

-- Service Categories
INSERT INTO service_categories (name, name_ar, slug) VALUES
('General Dentistry', 'طب الأسنان العام', 'general'),
('Cosmetic Dentistry', 'طب الأسنان التجميلي', 'cosmetic'),
('Orthodontics', 'تقويم الأسنان', 'orthodontics'),
('Pediatric Dentistry', 'طب أسنان الأطفال', 'pediatric');

-- Services (all spec services)
INSERT INTO services (category_id, name, name_ar, slug, description, description_ar, benefits, procedure_details, price, duration, icon, is_featured, is_active, sort_order) VALUES
(1, 'Teeth Cleaning', 'تنظيف الأسنان', 'teeth-cleaning', 'Professional deep cleaning to remove plaque and tartar.', 'تنظيف عميق احترافي لإزالة البلاك والجير.', 'Healthier gums, fresher breath, cavity prevention', 'Examination, scaling, polishing, and fluoride treatment.', 150.00, 45, 'sparkles', 1, 1, 1),
(2, 'Teeth Whitening', 'تبييض الأسنان', 'teeth-whitening', 'Advanced whitening treatment for a brighter smile.', 'علاج تبييض متقدم لابتسامة أكثر إشراقاً.', 'Whiter teeth, boosted confidence', 'Professional gel application with LED activation.', 350.00, 60, 'sun', 1, 1, 2),
(1, 'Dental Implants', 'زراعة الأسنان', 'dental-implants', 'Permanent tooth replacement with titanium implants.', 'استبدال دائم للأسنان بزراعة التيتانيوم.', 'Natural look, long-lasting solution', 'Consultation, implant placement, healing, crown fitting.', 2500.00, 90, 'shield', 1, 1, 3),
(1, 'Root Canal Treatment', 'علاج قناة الجذر', 'root-canal', 'Save infected teeth with painless root canal therapy.', 'إنقاذ الأسنان المصابة بعلاج قناة الجذر بدون ألم.', 'Pain relief, tooth preservation', 'X-ray, anesthesia, canal cleaning, sealing.', 800.00, 75, 'heart', 0, 1, 4),
(3, 'Orthodontics', 'تقويم الأسنان', 'orthodontics', 'Correct teeth alignment with modern orthodontic solutions.', 'تصحيح محاذاة الأسنان بحلول تقويم حديثة.', 'Straighter teeth, better bite', 'Assessment, custom treatment plan, regular adjustments.', 3000.00, 60, 'align-center', 1, 1, 5),
(3, 'Braces', 'تقويم معدني', 'braces', 'Traditional and ceramic braces for all ages.', 'تقويم تقليدي وخزفي لجميع الأعمار.', 'Improved alignment, enhanced smile', 'Fitting, monthly adjustments, retention phase.', 2800.00, 45, 'grid', 0, 1, 6),
(2, 'Veneers', 'قشور الأسنان', 'veneers', 'Porcelain veneers for a perfect Hollywood smile.', 'قشور البورسلين لابتسامة هوليوود المثالية.', 'Flawless appearance, stain resistant', 'Consultation, tooth prep, custom veneer bonding.', 1200.00, 60, 'star', 1, 1, 7),
(4, 'Pediatric Dentistry', 'طب أسنان الأطفال', 'pediatric-dentistry', 'Gentle dental care designed for children.', 'رعاية أسنان لطيفة مصممة للأطفال.', 'Child-friendly environment, preventive care', 'Gentle exam, cleaning, fluoride, education.', 120.00, 30, 'smile', 1, 1, 8),
(1, 'Tooth Extraction', 'خلع الأسنان', 'tooth-extraction', 'Safe and comfortable tooth extraction procedures.', 'إجراءات خلع أسنان آمنة ومريحة.', 'Quick recovery, expert care', 'Anesthesia, extraction, aftercare instructions.', 200.00, 30, 'scissors', 0, 1, 9),
(1, 'Dental Surgery', 'جراحة الأسنان', 'dental-surgery', 'Advanced oral surgery procedures performed with precision and care.', 'إجراءات جراحة الفم المتقدمة بدقة وعناية.', 'Expert surgical care, faster recovery', 'Pre-op assessment, surgery, post-op follow-up.', 1200.00, 90, 'scissors', 0, 1, 10),
(2, 'Cosmetic Dentistry', 'طب الأسنان التجميلي', 'cosmetic-dentistry', 'Transform your smile with comprehensive cosmetic dental solutions.', 'حوّل ابتسامتك بحلول تجميلية شاملة.', 'Enhanced confidence, natural results', 'Smile analysis, treatment plan, cosmetic procedures.', 500.00, 60, 'star', 1, 1, 11),
(1, 'Emergency Dental Care', 'علاج الأسنان الطارئ', 'emergency-dental', 'Same-day emergency dental care when you need it most.', 'رعاية أسنان طارئة في نفس اليوم عندما تحتاجها.', 'Immediate relief, expert care', 'Urgent assessment, pain relief, emergency treatment.', 300.00, 45, 'bolt', 1, 1, 12);

-- Dentists
INSERT INTO dentists (name, name_ar, specialization, specialization_ar, qualification, experience, education, bio, awards, languages_spoken, is_active, sort_order) VALUES
('Dr. Sarah Al-Rashid', 'د. سارة الراشد', 'Cosmetic Dentistry', 'طب الأسنان التجميلي', 'DDS, MSc Cosmetic Dentistry', '12 years', 'Harvard School of Dental Medicine', 'Passionate about creating beautiful smiles with the latest cosmetic techniques.', 'Best Cosmetic Dentist Award 2023', 'English, Arabic', 1, 1),
('Dr. Ahmed Hassan', 'د. أحمد حسن', 'Orthodontics', 'تقويم الأسنان', 'DDS, Orthodontics Specialist', '15 years', 'King Saud University', 'Expert in braces and Invisalign treatments for patients of all ages.', 'Orthodontics Excellence Award', 'English, Arabic, French', 1, 2),
('Dr. Fatima Noor', 'د. فاطمة نور', 'Pediatric Dentistry', 'طب أسنان الأطفال', 'DDS, Pediatric Dentistry', '8 years', 'Boston University', 'Making dental visits fun and comfortable for children.', 'Pediatric Care Certification', 'English, Arabic, Urdu', 1, 3);

-- Testimonials
INSERT INTO testimonials (patient_name, patient_name_ar, rating, review, review_ar, is_featured) VALUES
('Mohammed Al-Farsi', 'محمد الفارسي', 5, 'Excellent service! The staff was very professional and the clinic is spotless.', 'خدمة ممتازة! الموظفون محترفون جداً والعيادة نظيفة للغاية.', 1),
('Layla Ahmed', 'ليلى أحمد', 5, 'Dr. Sarah transformed my smile with veneers. I could not be happier!', 'د. سارة غيرت ابتسامتي بالقشور. لا أستطيع أن أكون أكثر سعادة!', 1),
('Omar Khalid', 'عمر خالد', 4, 'Great experience with braces treatment. Very knowledgeable team.', 'تجربة رائعة مع علاج التقويم. فريق على دراية كبيرة.', 1);

-- FAQs
INSERT INTO faqs (question, question_ar, answer, answer_ar, sort_order) VALUES
('How often should I visit the dentist?', 'كم مرة يجب أن أزور طبيب الأسنان؟', 'We recommend visiting every 6 months for routine check-ups and cleaning.', 'نوصي بالزيارة كل 6 أشهر للفحوصات الروتينية والتنظيف.', 1),
('Do you accept insurance?', 'هل تقبلون التأمين؟', 'Yes, we accept most major dental insurance plans. Contact us for details.', 'نعم، نقبل معظم خطط التأمين السني الرئيسية. اتصل بنا للتفاصيل.', 2),
('Is teeth whitening safe?', 'هل تبييض الأسنان آمن؟', 'Yes, our professional whitening treatments are safe and FDA-approved.', 'نعم، علاجات التبييض الاحترافية لدينا آمنة ومعتمدة.', 3),
('What should I do in a dental emergency?', 'ماذا أفعل في حالة طوارئ الأسنان؟', 'Call us immediately at our emergency line. We offer same-day emergency appointments.', 'اتصل بنا فوراً على خط الطوارئ. نقدم مواعيد طوارئ في نفس اليوم.', 4);

-- Settings
INSERT INTO settings (setting_key, setting_value, setting_group) VALUES
('site_name', 'Qaahira Dental Clinic', 'general'),
('site_name_ar', 'عيادة قاهرة للأسنان', 'general'),
('tagline', 'Your Smile, Our Passion', 'general'),
('tagline_ar', 'ابتسامتك، شغفنا', 'general'),
('years_experience', '15', 'general'),
('satisfaction_rate', '98', 'general'),
('site_logo', '', 'general'),
('favicon', '', 'general'),
('phone', '+252 63 4953675', 'contact'),
('email', 'kharash420@gmail.com', 'contact'),
('whatsapp', '252634953675', 'contact'),
('address', 'Qaahira Denta care, Hargeisa, Somaliland', 'contact'),
('address_ar', 'قااهيرا دينتا كير، هرجيسا', 'contact'),
('map_embed', 'https://maps.google.com/maps?q=9.5615997,44.0718104&hl=en&z=17&output=embed', 'contact'),
('map_place_url', 'https://www.google.com/maps/place/Qaahira+Denta+care/@9.5615997,44.0718104,17z/data=!3m1!1e3!4m6!3m5!1s0x1628bf0b5c760ca3:0x6e2b6afec05ab86a!8m2!3d9.5615997!4d44.0718104!16s%2Fg%2F11ms4clnzt?hl=en', 'contact'),
('facebook', 'https://facebook.com/qaahiradental', 'social'),
('instagram', 'https://instagram.com/qaahiradental', 'social'),
('twitter', 'https://twitter.com/qaahiradental', 'social'),
('youtube', 'https://youtube.com/qaahiradental', 'social'),
('working_hours', '{"mon":"9:00 AM - 6:00 PM","tue":"9:00 AM - 6:00 PM","wed":"9:00 AM - 6:00 PM","thu":"9:00 AM - 6:00 PM","fri":"2:00 PM - 8:00 PM","sat":"9:00 AM - 4:00 PM","sun":"Closed"}', 'hours'),
('smtp_enabled', '0', 'email'),
('sms_enabled', '0', 'sms'),
('hero_image', '', 'homepage'),
('about_image', '', 'about'),
('meta_description', 'Premium dental care at Qaahira Dental Clinic in Riyadh. Book appointments online.', 'seo'),
('meta_description_ar', 'رعاية أسنان متميزة في عيادة قاهرة للأسنان بالرياض. احجز موعدك عبر الإنترنت.', 'seo'),
('meta_keywords', 'dental clinic, dentist, teeth whitening, implants, Riyadh', 'seo'),
('google_analytics', '', 'seo');

-- Homepage Content (spec hero text)
INSERT INTO homepage_content (section_key, title, title_ar, subtitle, subtitle_ar, content, content_ar) VALUES
('hero', 'Healthy Smile Starts Here', 'ابتسامتك الصحية تبدأ من هنا', 'Advanced Dental Care For The Whole Family', 'رعاية أسنان متقدمة لجميع أفراد الأسرة', 'Experience world-class dental treatments in a comfortable, modern environment with certified specialists.', 'استمتع بعلاجات أسنان عالمية المستوى في بيئة مريحة وحديثة مع متخصصين معتمدين.'),
('why_us', 'Why Choose Us', 'لماذا تختارنا', 'Excellence in every smile', 'التميز في كل ابتسامة', 'State-of-the-art equipment, experienced dentists, and patient-centered care.', 'معدات حديثة، أطباء ذوو خبرة، ورعاية تركز على المريض.'),
('welcome', 'Your Trusted Dental Partner', 'شريكك الموثوق في طب الأسنان', '', '', 'At Qaahira Dental Clinic, we combine advanced technology with compassionate care to deliver exceptional dental services.', 'في عيادة قاهرة للأسنان، نجمع بين التكنولوجيا المتقدمة والرعاية الرحيمة لتقديم خدمات أسنان استثنائية.');

-- About Content
INSERT INTO about_content (section_key, title, title_ar, content, content_ar) VALUES
('history', 'Our History', 'تاريخنا', 'Founded in 2010, Qaahira Dental Clinic has been serving the community with dedication and excellence for over a decade.', 'تأسست عيادة قاهرة للأسنان في عام 2010، وقد كانت تخدم المجتمع بتفانٍ وتميز لأكثر من عقد.'),
('mission', 'Our Mission', 'مهمتنا', 'To provide accessible, high-quality dental care that improves the health and confidence of every patient.', 'تقديم رعاية أسنان عالية الجودة ومتاحة للجميع تعزز صحة وثقة كل مريض.'),
('vision', 'Our Vision', 'رؤيتنا', 'To be the leading dental clinic in the region, known for innovation, compassion, and outstanding results.', 'أن نكون عيادة الأسنان الرائدة في المنطقة، المعروفة بالابتكار والرحمة والنتائج المتميزة.'),
('achievements', 'Our Achievements', 'إنجازاتنا', 'Over 10,000 satisfied patients, 15+ awards, and a team of certified specialists.', 'أكثر من 10,000 مريض راضٍ، وأكثر من 15 جائزة، وفريق من المتخصصين المعتمدين.'),
('values', 'Our Values', 'قيمنا', 'Integrity, compassion, excellence, and patient-centered care guide everything we do.', 'النزاهة والرحمة والتميز والرعاية المتمحورة حول المريض توجه كل ما نقوم به.');

-- Blog Posts
INSERT INTO blogs (title, title_ar, slug, category, excerpt, excerpt_ar, content, content_ar, author, is_published, published_at) VALUES
('5 Tips for Healthy Teeth', '٥ نصائح لأسنان صحية', '5-tips-healthy-teeth', 'dental-tips', 'Simple daily habits for a brighter smile.', 'عادات يومية بسيطة لابتسامة أكثر إشراقاً.', '<p>Maintaining healthy teeth requires consistent care. Brush twice daily, floss regularly, and visit your dentist every six months.</p>', '<p>الحفاظ على أسنان صحية يتطلب عناية مستمرة. نظف أسنانك مرتين يومياً، واستخدم الخيط بانتظام، وزر طبيب الأسنان كل ستة أشهر.</p>', 'Dr. Sarah Al-Rashid', 1, NOW()),
('Understanding Dental Implants', 'فهم زراعة الأسنان', 'understanding-dental-implants', 'oral-health', 'Everything you need to know about dental implants.', 'كل ما تحتاج معرفته عن زراعة الأسنان.', '<p>Dental implants are a permanent solution for missing teeth. Learn about the procedure, benefits, and recovery process.</p>', '<p>زراعة الأسنان حل دائم للأسنان المفقودة. تعرف على الإجراء والفوائد وعملية التعافي.</p>', 'Dr. Ahmed Hassan', 1, NOW());
