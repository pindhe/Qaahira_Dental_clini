# 🦷 Qaahira Dental Clinic

A modern, premium, multilingual dental clinic management system built with **PHP 8**, **MySQL**, **Tailwind CSS**, and **JavaScript**.

Designed for **XAMPP**, featuring a stunning glassmorphism UI, appointment booking system, patient management, and a powerful admin dashboard.

---

# 📸 Website Preview

## Home Page



# ✨ Features

## 🌐 Public Website

### Homepage

* Modern Hero Section
* Video/Image Banner
* Call-to-Action Buttons
* Clinic Statistics
* Featured Services
* Testimonials Slider

### About Us

* Clinic Introduction
* Mission & Vision
* Clinic History
* Why Choose Us

### Services

* Cosmetic Dentistry
* Teeth Whitening
* Dental Implants
* Orthodontics
* Root Canal Treatment
* Pediatric Dentistry
* Emergency Dental Care

### Dentists

* Dentist Profiles
* Qualifications
* Experience
* Specializations

### Gallery

* Clinic Photos
* Equipment Showcase
* Before & After Cases

### Blog

* Dental Articles
* Health Tips
* Clinic News
* Categories & Tags

### FAQ

* Frequently Asked Questions
* Expand/Collapse Interface

### Contact

* Contact Form
* Google Maps Integration
* Working Hours
* Social Media Links

### Appointment Booking

* Online Appointment Request
* Date Selection
* Service Selection
* Dentist Selection
* Appointment Status Tracking

### Additional Features

* English Language Support
* Arabic Language Support (RTL)
* Search Functionality
* WhatsApp Floating Button
* Responsive Design
* SEO Friendly Pages
* Smooth Animations

---

# 🛠️ Admin Dashboard

## Authentication

* Secure Login System
* Session Management
* Password Hashing
* Role Protection

## Dashboard Analytics

* Total Appointments
* Total Patients
* Total Dentists
* Revenue Overview
* Monthly Statistics
* Interactive Charts (Chart.js)

## Content Management

### Manage Dentists

* Add Dentist
* Edit Dentist
* Delete Dentist

### Manage Services

* Create Services
* Update Services
* Remove Services

### Manage Appointments

* View Requests
* Approve Appointments
* Reject Appointments
* Appointment History

### Manage Customers

* Customer Profiles
* Contact Information
* Appointment Records

### Manage Testimonials

* Add Testimonials
* Edit Testimonials
* Delete Testimonials

### Manage Blog

* Add Articles
* Edit Articles
* Categories Management

### Manage Gallery

* Upload Images
* Organize Albums
* Delete Media

### Manage FAQs

* Create Questions
* Update Answers
* Delete Entries

### Messages Center

* Contact Messages
* Read/Unread Status
* Quick Replies

### Website Settings

* Clinic Information
* Contact Details
* Social Media Links
* Working Hours
* SEO Settings
* Logo Upload
* Favicon Upload

### System Features

* Notifications System
* Dark Mode
* Light Mode
* Activity Logs

---

# 💻 Technology Stack

| Technology    | Purpose             |
| ------------- | ------------------- |
| PHP 8+        | Backend Development |
| MySQL         | Database            |
| Tailwind CSS  | UI Design           |
| JavaScript    | Frontend Logic      |
| Chart.js      | Analytics           |
| Font Awesome  | Icons               |
| SweetAlert2   | Alerts              |
| AOS Animation | Scroll Effects      |

---

# 📁 Project Structure

```bash
Dental/
│
├── admin/
│   ├── dashboard.php
│   ├── appointments.php
│   ├── dentists.php
│   ├── services.php
│   ├── gallery.php
│   ├── blog.php
│   └── settings.php
│
├── assets/
│   ├── css/
│   ├── js/
│   ├── images/
│   └── screenshots/
│
├── config/
├── core/
├── database/
├── includes/
├── lang/
├── uploads/
│
├── index.php
├── about.php
├── services.php
├── dentists.php
├── appointment.php
├── gallery.php
├── blog.php
├── contact.php
├── faq.php
├── search.php
│
└── README.md
```

---

# ⚙️ Installation

## Step 1: Start XAMPP

Start:

* Apache
* MySQL

from the XAMPP Control Panel.

---

## Step 2: Import Database

Open:

```url
http://localhost/phpmyadmin
```

Create Database:

```sql
qaahira_dental
```

Import:

```bash
database/qaahira_dental.sql
```

---

## Step 3: Configure Database

```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'qaahira_dental');
define('DB_USER', 'root');
define('DB_PASS', '');
define('APP_URL', 'http://localhost/Dental');
```

---

## Step 4: Access Website

### Public Website

```url
http://localhost/Dental
```

### Admin Dashboard

```url
http://localhost/Dental/admin/login.php
```

---

# 🔐 Admin Login

Email:

```text
admin@qaahiradental.com
```

Password:

```text
Admin@123
```

(Change immediately after installation.)

---

# 🛡️ Security Features

* PDO Prepared Statements
* CSRF Protection
* XSS Protection
* Password Hashing
* Session Authentication
* Secure File Upload Validation
* Admin Route Protection
* Input Sanitization
* SQL Injection Prevention

---

# 🚀 Future Enhancements

* Online Payments
* SMS Notifications
* Email Verification
* Patient Portal
* Medical Records
* Multi-Branch Support
* AI Chat Assistant
* Online Consultation
* Mobile App (Android & iOS)

---

# 📄 License

Copyright © 2026

**Qaahira Dental Clinic Management System**

All Rights Reserved.
