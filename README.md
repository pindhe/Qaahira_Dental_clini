# Qaahira Dental Clinic

A modern, premium dental clinic website built with **PHP**, **MySQL**, **Tailwind CSS**, and **JavaScript** — designed for **XAMPP**.

## Features

### Public Website
- Home, About, Services, Dentists, Gallery, Blog, Testimonials, FAQ, Contact
- Appointment booking form
- English & Arabic (RTL) language support
- WhatsApp floating button
- Search functionality
- Responsive glassmorphism design

### Admin Dashboard
- Secure login with session authentication
- Analytics dashboard with Chart.js
- Manage: Dentists, Services, Appointments, Customers, Messages, Testimonials, Blog, Gallery, FAQs
- Homepage & About content editor
- Website settings (contact, social media, working hours)
- Dark/Light mode toggle
- Notifications system

## Requirements

- XAMPP (Apache + MySQL + PHP 8+)
- phpMyAdmin

## Installation

### 1. Start XAMPP
Start **Apache** and **MySQL** from the XAMPP Control Panel.

### 2. Import Database
1. Open phpMyAdmin: `http://localhost/phpmyadmin`
2. Click **Import**
3. Select `database/qaahira_dental.sql` (single complete file)
4. Click **Go**

This creates the `qaahira_dental` database with all tables and sample data.

### 3. Configure (if needed)
Edit `config/config.php` if your MySQL credentials differ:

```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'qaahira_dental');
define('DB_USER', 'root');
define('DB_PASS', '');
define('APP_URL', 'http://localhost/Dental');
```

### 4. Access the Website

| URL | Description |
|-----|-------------|
| `http://localhost/Dental` | Public website |
| `http://localhost/Dental/admin/login.php` | Admin login |

### Admin Credentials
- **Email:** `kharash420@gmail.com`
- **Password:** Set during installation (see database seed)

## Project Structure

```
Dental/
├── admin/           # Admin dashboard pages
├── assets/          # CSS & JavaScript
├── config/          # App configuration
├── core/            # Database, Auth, Language classes
├── database/        # SQL schema file
├── includes/        # Shared header/footer templates
├── lang/            # EN & AR translations
├── uploads/         # Uploaded images
├── index.php        # Homepage
├── about.php
├── services.php
├── dentists.php
├── appointment.php
├── gallery.php
├── blog.php
├── contact.php
├── faq.php
└── search.php
```

## Security

- PDO prepared statements (SQL injection prevention)
- `htmlspecialchars()` output escaping (XSS prevention)
- CSRF tokens on all forms
- Session-based admin authentication
- `password_hash()` for admin passwords
- Protected config/core directories via `.htaccess`

## Tech Stack

- **PHP 8+** — Backend logic
- **MySQL** — Database
- **Tailwind CSS** (CDN) — Styling
- **Chart.js** — Admin analytics charts
- **JavaScript** — Interactivity, dark mode, animations

## License

Built for Qaahira Dental Clinic.
