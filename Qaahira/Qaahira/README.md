# Dental Clinic - Professional Web Application

A professional dental clinic management system built with Django and Tailwind CSS, featuring a beautiful gold and white color scheme.

## Features

- **User Authentication**: Registration and login system for patients
- **Appointment Booking**: Easy-to-use appointment booking system
- **Doctor Management**: View available doctors and their specializations
- **Service Catalog**: Browse available dental services with pricing
- **Appointment Management**: View and cancel your appointments
- **Admin Panel**: Full Django admin interface for managing appointments, patients, doctors, and services
- **Responsive Design**: Mobile-friendly interface using Tailwind CSS
- **Professional UI**: Beautiful gold and white theme

## Technology Stack

- **Backend**: Django 4.2+
- **Frontend**: Tailwind CSS (via CDN)
- **Database**: SQLite (default, can be changed)
- **Icons**: Font Awesome 6.4.0

## Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd Qaahira
   ```

2. **Create a virtual environment** (recommended)
   ```bash
   python -m venv venv
   ```

3. **Activate the virtual environment**
   - On Windows:
     ```bash
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

4. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

5. **Run migrations**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. **Create a superuser** (for admin access)
   ```bash
   python manage.py createsuperuser
   ```

7. **Run the development server**
   ```bash
   python manage.py runserver
   ```

8. **Access the application**
   - Main site: http://127.0.0.1:8000/
   - Admin panel: http://127.0.0.1:8000/admin/

## Project Structure

```
Qaahira/
├── dental_clinic/          # Main project settings
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── clinic/                 # Main application
│   ├── models.py          # Database models
│   ├── views.py           # View functions
│   ├── forms.py           # Form definitions
│   ├── admin.py           # Admin configuration
│   └── urls.py            # URL patterns
├── templates/             # HTML templates
│   ├── base.html
│   └── clinic/
│       ├── home.html
│       ├── services.html
│       ├── doctors.html
│       ├── book_appointment.html
│       └── ...
├── static/                # Static files (CSS, JS, images)
├── media/                 # User-uploaded files
├── manage.py
└── requirements.txt
```

## Usage

### For Patients

1. **Register an account**: Click "Register" and fill in your information
2. **Login**: Use your credentials to log in
3. **Book Appointment**: 
   - Select a doctor
   - Choose a service
   - Pick date and time
   - Add any notes
4. **View Appointments**: Check your scheduled appointments
5. **Cancel Appointments**: Cancel pending or confirmed appointments

### For Administrators

1. **Access Admin Panel**: Go to `/admin/` and login with superuser credentials
2. **Manage Doctors**: Add/edit doctor information, specializations, and availability
3. **Manage Services**: Add/edit services, prices, and descriptions
4. **Manage Appointments**: View, confirm, or update appointment statuses
5. **Manage Patients**: View and edit patient information

## Models

- **Doctor**: Stores doctor information, specialization, contact details
- **Service**: Dental services with descriptions, prices, and duration
- **Patient**: Patient information linked to Django User model
- **Appointment**: Links patients, doctors, and services with date/time and status

## Customization

### Colors

The gold and white color scheme is defined in `templates/base.html` using Tailwind's color configuration. To change colors, modify the `tailwind.config` section.

### Adding Services/Doctors

Use the Django admin panel to add new services and doctors. Alternatively, you can use Django shell or create management commands.

## Development

To run in development mode with auto-reload:

```bash
python manage.py runserver
```

The server will automatically reload when you make changes to the code.

## Production Deployment

Before deploying to production:

1. Set `DEBUG = False` in `settings.py`
2. Change `SECRET_KEY` to a secure random value
3. Update `ALLOWED_HOSTS` with your domain
4. Configure a production database (PostgreSQL recommended)
5. Set up static file serving (whitenoise or CDN)
6. Configure media file storage
7. Set up SSL/HTTPS

## License

This project is created for educational and professional use.

## Support

For issues or questions, please contact the development team.


