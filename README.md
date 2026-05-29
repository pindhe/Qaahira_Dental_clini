<p align="center">
  <img src="Qaahira-image.png" width="850" alt="Qaahira Dental Clinic Preview" style="border-radius:18px; box-shadow:0 10px 35px rgba(0,0,0,0.35);" />
</p>

<h1 align="center">🦷 Qaahira Dental Clinic</h1>

<p align="center">
  <strong>Modern Dental Clinic Management & Appointment Platform</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" />
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" />
  <img src="https://img.shields.io/badge/Version-1.0.0-blue?style=flat-square" />
  <img src="https://img.shields.io/badge/Status-Active-brightgreen?style=flat-square" />
</p>

---

## 📌 About The Project

**Qaahira Dental Clinic** waa website casri ah oo loogu talagalay maamulka rugta ilkaha, booking appointments, maamulka bukaanka, iyo soo bandhigida adeegyada caafimaadka ilkaha si professional ah.

Website-kan waxa uu leeyahay:

- ✅ Interface qurux badan oo responsive ah
- ✅ Appointment booking system
- ✅ Patient management
- ✅ Dentist profiles
- ✅ Dental services showcase
- ✅ Modern dashboard
- ✅ Secure backend API

> Waxaa lagu dhisay technologies casri ah oo **degdeg**, **ammaan**, isla markaana **scalable** ah.

---

## 🚀 Tech Stack

### 🎨 Frontend

| Technology | Version | Purpose |
|---|---|---|
| TypeScript | ^5.0 | Type-safe development |
| Tailwind CSS | ^3.0 | Utility-first styling |
| Framer Motion | ^11.0 | Animations & transitions |
| ShadCN UI | Latest | Component library |

### ⚙️ Backend

| Technology | Version | Purpose |
|---|---|---|
| Python | ^3.11 | Backend language |
| FastAPI | ^0.111 | REST API framework |
| JWT | — | Authentication |

---

## ✨ Main Features

### 👨‍⚕️ Patient Features

- 📅 **Book Appointment** — Easy online booking system
- 🔍 **View Services** — Browse all dental services
- 👤 **Meet Dentists** — View dentist profiles
- 📞 **Contact Clinic** — Get in touch easily
- 📱 **Responsive Mobile UI** — Works on all devices

### 🏥 Admin Features

- 🗂️ **Manage Patients** — Full patient records management
- 📆 **Manage Appointments** — Schedule & track appointments
- 🕐 **Dentist Scheduling** — Manage dentist availability
- 📊 **Dashboard Analytics** — Real-time statistics
- 🔐 **Secure Authentication** — JWT-based auth system

---

## 🦷 Dental Services

| Service | Description |
|---|---|
| 🪥 Teeth Cleaning | Professional cleaning & hygiene |
| ✨ Teeth Whitening | Advanced whitening treatments |
| 🔩 Dental Implants | Permanent tooth replacement |
| 🦾 Orthodontics | Braces & alignment solutions |
| 🏥 Root Canal | Pain-free root canal therapy |
| 💎 Cosmetic Dentistry | Smile makeover treatments |

---

## 🛠️ Getting Started

### Prerequisites

```bash
node >= 18.0.0
python >= 3.11
postgresql >= 16
```

### 1. Clone the repository

```bash
git clone https://github.com/your-username/qaahira-dental.git
cd qaahira-dental
```

### 2. Setup Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env with your database credentials

# Run database migrations
alembic upgrade head

# Start server
uvicorn app.main:app --reload
```

### 3. Setup Frontend

```bash
cd frontend
npm install

# Configure environment variables
cp .env.example .env.local
# Edit .env.local with your API URL

# Start development server
npm run dev
```

### 4. Open in browser

```
Frontend:  http://localhost:3000
API Docs:  http://localhost:8000/docs
```

---

## 🔐 Environment Variables

### Backend `.env`

```env
DATABASE_URL=postgresql://user:password@localhost:5432/qaahira_db
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Frontend `.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=Qaahira Dental Clinic
```

---

## 🐳 Docker (Optional)

```bash
docker-compose up -d
```

---

## 🤝 Contributing

Contributions are welcome! Pull requests are accepted.

1. Fork the project
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

## 📬 Contact

**Qaahira Dental Clinic** — Modern Dental Management Platform

<p align="center">Made with ❤️ for better dental care</p>
