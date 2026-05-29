from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, authenticate
from django.contrib.auth.decorators import login_required
from django.contrib.admin.views.decorators import staff_member_required
from django.contrib import messages
from django.core.paginator import Paginator
from django.db.models import Q
from django import forms
from django.utils import translation
from django.utils.translation import gettext_lazy as _
from django.conf import settings
from django.http import HttpResponseRedirect
from django.core.mail import send_mail
from django.urls import translate_url, reverse
from urllib.parse import urlparse, urlunparse
from .models import Doctor, Service, Patient, Appointment, Gallery
from .forms import AppointmentForm
from datetime import date, timedelta

def home(request):
    services = Service.objects.all()[:6]
    gallery_items = Gallery.objects.all()[:4]
    return render(request, 'clinic/home.html', {
        'services': services,
        'gallery_items': gallery_items
    })

def gallery_list(request):
    gallery_items = Gallery.objects.all()
    return render(request, 'clinic/gallery.html', {'gallery_items': gallery_items})

def services_list(request):
    services = Service.objects.all()
    return render(request, 'clinic/services.html', {'services': services})

def service_detail(request, service_slug):
    # Map slugs back to service names
    service_map = {
        'dental-implants': 'Dental implants',
        'dental-prostheses': 'Dental prostheses',
        'dentistry-general': 'Dentistry general',
        'emergency-surgeries': 'Emergency surgeries',
        'orthodontics': 'Orthodontics',
        'pediatric-dentistry': 'Pediatric dentistry',
        'veneer': 'Veneer',
        'treating-the-nerve': 'Treating the nerve',
        'teeth-whitening-with-a-laser': 'Teeth whitening with a laser'
    }
    
    name = service_map.get(service_slug, service_slug.replace('-', ' ').title())
    service = get_object_or_404(Service, name__iexact=name)
    return render(request, 'clinic/service_detail.html', {'service': service})

def about(request):
    return render(request, 'clinic/about.html')

def contact(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        email = request.POST.get('email')
        phone = request.POST.get('phone')
        message = request.POST.get('message')
        
        if name and email and message:
            # Prepare email content
            subject = f"New Contact Message from {name}"
            email_message = f"Name: {name}\nEmail: {email}\nPhone: {phone}\n\nMessage:\n{message}"
            
            try:
                # 1. Send notification to the clinic admin
                send_mail(
                    subject,
                    email_message,
                    settings.DEFAULT_FROM_EMAIL,
                    [settings.EMAIL_HOST_USER],
                    fail_silently=True,
                )
                
                # 2. Send automated confirmation to the user
                auto_reply_subject = _("Thank you for contacting Qaahira")
                auto_reply_message = f"""
{_('Dear')} {name},

{_('Thank you for reaching out to Qaahira. We have received your message and our team will get back to you as soon as possible.')}

{_('Your Message:')}
{message}

{_('Best regards,')}
{_('Qaahira Team')}
                """
                send_mail(
                    auto_reply_subject,
                    auto_reply_message,
                    settings.DEFAULT_FROM_EMAIL,
                    [email],
                    fail_silently=True,
                )
                
                messages.success(request, _("Your message has been sent successfully! We will contact you soon."))
            except Exception as e:
                messages.error(request, _("There was an error sending your message. Please try again later."))
        else:
            messages.error(request, _("Please fill in all required fields."))
            
        return redirect('contact')
        
    return render(request, 'clinic/contact.html')

def book_appointment(request):
    if request.method == 'POST':
        form = AppointmentForm(request.POST)
        if form.is_valid():
            first_name = form.cleaned_data['first_name']
            last_name = form.cleaned_data['last_name']
            phone = form.cleaned_data['phone']
            
            # Find or create patient by phone
            patient, created = Patient.objects.get_or_create(
                phone=phone,
                defaults={
                    'first_name': first_name,
                    'last_name': last_name,
                }
            )
            
            # Update name if patient already existed
            if not created:
                patient.first_name = first_name
                patient.last_name = last_name
                patient.save()

            appointment = form.save(commit=False)
            appointment.patient = patient
            appointment.status = 'pending'
            
            # If time is not provided, use a default time (e.g., 09:00 AM)
            if not form.cleaned_data.get('appointment_time'):
                from datetime import time
                appointment.appointment_time = time(9, 0)
                
            # If doctor is not provided, pick the first available one
            if not form.cleaned_data.get('doctor'):
                first_doctor = Doctor.objects.filter(is_available=True).first()
                if first_doctor:
                    appointment.doctor = first_doctor
                else:
                    messages.error(request, _('No doctors available at the moment.'))
                    return redirect(request.META.get('HTTP_REFERER', 'home'))

            appointment.save()
            messages.success(request, _('Appointment booked successfully! We will confirm shortly.'))
            return redirect(request.META.get('HTTP_REFERER', 'home'))
        else:
            for field, errors in form.errors.items():
                for error in errors:
                    messages.error(request, f"{field}: {error}")
    return redirect('home')

@staff_member_required
def my_appointments(request):
    appointments = Appointment.objects.all().order_by('-appointment_date', '-appointment_time')
    
    paginator = Paginator(appointments, 10)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    return render(request, 'clinic/my_appointments.html', {'appointments': page_obj})

@login_required
def update_appointment(request, appointment_id):
    appointment = get_object_or_404(Appointment, id=appointment_id, patient__user=request.user)
    
    # Only allow updating pending or confirmed appointments
    if appointment.status not in ['pending', 'confirmed']:
        messages.error(request, _('You can only update pending or confirmed appointments.'))
        return redirect('my_appointments')
    
    if request.method == 'POST':
        form = AppointmentForm(request.POST, instance=appointment)
        if form.is_valid():
            # Keep the same patient and status when updating
            updated_appointment = form.save(commit=False)
            updated_appointment.patient = appointment.patient
            updated_appointment.status = appointment.status  # Keep original status
            updated_appointment.save()
            messages.success(request, _('Appointment updated successfully!'))
            return redirect('my_appointments')
    else:
        form = AppointmentForm(instance=appointment)
    
    return render(request, 'clinic/update_appointment.html', {
        'form': form,
        'appointment': appointment
    })

@login_required
def cancel_appointment(request, appointment_id):
    appointment = get_object_or_404(Appointment, id=appointment_id, patient__user=request.user)
    
    # Only allow cancelling pending or confirmed appointments
    if appointment.status not in ['pending', 'confirmed']:
        messages.error(request, _('You can only cancel pending or confirmed appointments.'))
        return redirect('my_appointments')
    
    if request.method == 'POST':
        appointment.status = 'cancelled'
        appointment.save()
        messages.success(request, _('Appointment cancelled successfully.'))
        return redirect('my_appointments')
    return render(request, 'clinic/cancel_appointment.html', {'appointment': appointment})

def set_language(request):
    if request.method == 'POST':
        language = request.POST.get('language', 'en')
        
        if language in dict(settings.LANGUAGES):
            # Get the referer URL or default to home
            referer = request.META.get('HTTP_REFERER', None)
            
            if not referer:
                # No referer - redirect to home with appropriate language
                if language == settings.LANGUAGE_CODE:
                    next_url = '/'
                else:
                    next_url = f'/{language}/'
            else:
                # Parse the referer URL
                parsed = urlparse(referer)
                path = parsed.path
                
                # Skip if referer is the set-language URL or admin URLs
                if '/set-language' in path or path.startswith('/admin') or path.startswith('/static') or path.startswith('/media'):
                    # Default to home page
                    if language == settings.LANGUAGE_CODE:
                        path = '/'
                    else:
                        path = f'/{language}/'
                    next_url = urlunparse((
                        parsed.scheme or 'http',
                        parsed.netloc or request.get_host(),
                        path,
                        '',
                        '',
                        ''
                    ))
                else:
                    # Remove any existing language prefix
                    original_path = path
                    for lang_code, lang_name in settings.LANGUAGES:
                        if path.startswith(f'/{lang_code}/'):
                            path = path[len(f'/{lang_code}'):]
                            break
                        elif path == f'/{lang_code}':
                            path = '/'
                            break
                    
                    # Ensure path starts with /
                    if not path or not path.startswith('/'):
                        path = '/'
                    
                    # Try to use Django's translate_url if available
                    try:
                        # Use Django's built-in translate_url function
                        translated_path = translate_url(path, language)
                        # translate_url handles prefix_default_language automatically
                    except:
                        # Fallback: manual construction
                        if language == settings.LANGUAGE_CODE:
                            # Default language (English) - no prefix
                            translated_path = path
                        else:
                            # Arabic - add /ar/ prefix
                            if path == '/':
                                translated_path = f'/{language}/'
                            else:
                                # Ensure proper format: /ar/path
                                translated_path = f'/{language}{path}' if path.startswith('/') else f'/{language}/{path}'
                    
                    # Reconstruct full URL
                    next_url = urlunparse((
                        parsed.scheme or 'http',
                        parsed.netloc or request.get_host(),
                        translated_path,
                        parsed.params,
                        parsed.query,
                        parsed.fragment
                    ))
            
            # Activate the language before redirect
            translation.activate(language)
            
            # Store language preference in session
            request.session['django_language'] = language
            
            # Create response with translated URL
            response = HttpResponseRedirect(next_url)
            
            # Set cookie for language preference
            cookie_name = getattr(settings, 'LANGUAGE_COOKIE_NAME', 'django_language')
            response.set_cookie(cookie_name, language, max_age=365*24*60*60)
            
            return response
    
    # Default redirect to home
    return redirect('home')

