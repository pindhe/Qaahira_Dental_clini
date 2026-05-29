from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.admin.views.decorators import staff_member_required
from django.contrib import messages
from django.core.paginator import Paginator
from django.db.models import Count, Q
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from datetime import date, timedelta
from .models import Doctor, Service, Patient, Appointment, Gallery
from .admin_forms import ServiceForm, GalleryForm
from .forms import AppointmentForm

@staff_member_required
def admin_gallery(request):
    search_query = request.GET.get('search', '')
    gallery_items = Gallery.objects.all().order_by('-created_at')
    
    if search_query:
        gallery_items = gallery_items.filter(
            Q(title__icontains=search_query) |
            Q(description__icontains=search_query)
        )
    
    paginator = Paginator(gallery_items, 12)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    return render(request, 'admin/gallery.html', {
        'gallery_items': page_obj,
        'search_query': search_query,
    })

@staff_member_required
def admin_gallery_create(request):
    if request.method == 'POST':
        form = GalleryForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            messages.success(request, _('Gallery item created successfully!'))
            return redirect('admin_gallery')
    else:
        form = GalleryForm()
    
    return render(request, 'admin/gallery_form.html', {'form': form, 'title': 'Add Gallery Item'})

@staff_member_required
def admin_gallery_edit(request, gallery_id):
    item = get_object_or_404(Gallery, id=gallery_id)
    
    if request.method == 'POST':
        form = GalleryForm(request.POST, request.FILES, instance=item)
        if form.is_valid():
            form.save()
            messages.success(request, _('Gallery item updated successfully!'))
            return redirect('admin_gallery')
    else:
        form = GalleryForm(instance=item)
    
    return render(request, 'admin/gallery_form.html', {'form': form, 'item': item, 'title': 'Edit Gallery Item'})

@staff_member_required
def admin_gallery_delete(request, gallery_id):
    item = get_object_or_404(Gallery, id=gallery_id)
    
    if request.method == 'POST':
        item.delete()
        messages.success(request, _('Gallery item deleted successfully!'))
        return redirect('admin_gallery')
    
    return render(request, 'admin/gallery_delete.html', {'item': item})

@staff_member_required
def admin_dashboard(request):
    # Statistics
    total_patients = Patient.objects.count()
    total_services = Service.objects.count()
    total_appointments = Appointment.objects.count()
    
    # Today's statistics
    today = date.today()
    today_appointments = Appointment.objects.filter(appointment_date=today).count()
    
    # Status counts
    pending_appointments = Appointment.objects.filter(status='pending').count()
    confirmed_appointments = Appointment.objects.filter(status='confirmed').count()
    completed_appointments = Appointment.objects.filter(status='completed').count()
    
    # Recent appointments
    recent_appointments = Appointment.objects.order_by('-appointment_date', '-appointment_time')[:10]
    
    # Upcoming appointments (next 7 days)
    next_week = today + timedelta(days=7)
    upcoming_appointments = Appointment.objects.filter(
        appointment_date__gte=today,
        appointment_date__lte=next_week,
        status__in=['pending', 'confirmed']
    ).order_by('appointment_date', 'appointment_time')[:10]
    
    context = {
        'total_patients': total_patients,
        'total_services': total_services,
        'total_appointments': total_appointments,
        'today_appointments': today_appointments,
        'pending_appointments': pending_appointments,
        'confirmed_appointments': confirmed_appointments,
        'completed_appointments': completed_appointments,
        'recent_appointments': recent_appointments,
        'upcoming_appointments': upcoming_appointments,
    }
    return render(request, 'admin/dashboard.html', context)

@staff_member_required
def admin_appointments(request):
    status_filter = request.GET.get('status', '')
    search_query = request.GET.get('search', '')
    
    appointments = Appointment.objects.all().order_by('-appointment_date', '-appointment_time')
    
    if status_filter:
        appointments = appointments.filter(status=status_filter)
    
    if search_query:
        appointments = appointments.filter(
            Q(patient__first_name__icontains=search_query) |
            Q(patient__last_name__icontains=search_query) |
            Q(service__name__icontains=search_query)
        )
    
    paginator = Paginator(appointments, 20)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    return render(request, 'admin/appointments.html', {
        'appointments': page_obj,
        'status_filter': status_filter,
        'search_query': search_query,
    })

@staff_member_required
def admin_appointment_detail(request, appointment_id):
    appointment = get_object_or_404(Appointment, id=appointment_id)
    
    if request.method == 'POST':
        new_status = request.POST.get('status')
        if new_status in ['pending', 'confirmed', 'completed', 'cancelled']:
            appointment.status = new_status
            appointment.save()
            status_display = dict(appointment.STATUS_CHOICES).get(new_status, new_status)
            messages.success(request, _('Appointment status updated to %(status)s.') % {'status': status_display})
            return redirect('admin_appointment_detail', appointment_id=appointment_id)
    
    return render(request, 'admin/appointment_detail.html', {'appointment': appointment})

@staff_member_required
def admin_update_appointment(request, appointment_id):
    appointment = get_object_or_404(Appointment, id=appointment_id)
    
    if request.method == 'POST':
        form = AppointmentForm(request.POST, instance=appointment)
        if form.is_valid():
            # Keep the same patient when updating
            updated_appointment = form.save(commit=False)
            updated_appointment.patient = appointment.patient
            updated_appointment.save()
            messages.success(request, _('Appointment updated successfully!'))
            # Redirect back to customer detail if patient_id is provided, otherwise to appointment detail
            patient_id = request.GET.get('patient_id')
            if patient_id:
                return redirect('admin_customer_detail', patient_id=patient_id)
            return redirect('admin_appointment_detail', appointment_id=appointment_id)
    else:
        form = AppointmentForm(instance=appointment)
    
    patient_id = request.GET.get('patient_id')
    return render(request, 'admin/update_appointment.html', {
        'form': form,
        'appointment': appointment,
        'patient_id': patient_id
    })

@staff_member_required
def admin_cancel_appointment(request, appointment_id):
    appointment = get_object_or_404(Appointment, id=appointment_id)
    
    if request.method == 'POST':
        appointment.status = 'cancelled'
        appointment.save()
        messages.success(request, _('Appointment cancelled successfully.'))
        # Redirect back to customer detail if patient_id is provided, otherwise to appointments list
        patient_id = request.GET.get('patient_id')
        if patient_id:
            return redirect('admin_customer_detail', patient_id=patient_id)
        return redirect('admin_appointments')
    
    patient_id = request.GET.get('patient_id')
    return render(request, 'admin/cancel_appointment.html', {
        'appointment': appointment,
        'patient_id': patient_id
    })

@staff_member_required
def admin_customers(request):
    search_query = request.GET.get('search', '')
    
    patients = Patient.objects.all().order_by('-created_at')
    
    if search_query:
        patients = patients.filter(
            Q(first_name__icontains=search_query) |
            Q(last_name__icontains=search_query) |
            Q(email__icontains=search_query) |
            Q(phone__icontains=search_query)
        )
    
    paginator = Paginator(patients, 20)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    return render(request, 'admin/customers.html', {
        'patients': page_obj,
        'search_query': search_query,
    })

@staff_member_required
def admin_customer_detail(request, patient_id):
    patient = get_object_or_404(Patient, id=patient_id)
    appointments = Appointment.objects.filter(patient=patient).order_by('-appointment_date', '-appointment_time')
    
    return render(request, 'admin/customer_detail.html', {
        'patient': patient,
        'appointments': appointments,
    })

@staff_member_required
def admin_services(request):
    services = Service.objects.all().order_by('name')
    search_query = request.GET.get('search', '')
    
    if search_query:
        services = services.filter(
            Q(name__icontains=search_query) |
            Q(description__icontains=search_query)
        )
    
    paginator = Paginator(services, 20)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    return render(request, 'admin/services.html', {
        'services': page_obj,
        'search_query': search_query,
    })

@staff_member_required
def admin_service_create(request):
    if request.method == 'POST':
        form = ServiceForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'Service created successfully!')
            return redirect('admin_services')
    else:
        form = ServiceForm()
    
    return render(request, 'admin/service_form.html', {'form': form, 'title': 'Create Service'})

@staff_member_required
def admin_service_edit(request, service_id):
    service = get_object_or_404(Service, id=service_id)
    
    if request.method == 'POST':
        form = ServiceForm(request.POST, instance=service)
        if form.is_valid():
            form.save()
            messages.success(request, 'Service updated successfully!')
            return redirect('admin_services')
    else:
        form = ServiceForm(instance=service)
    
    return render(request, 'admin/service_form.html', {'form': form, 'service': service, 'title': 'Edit Service'})

@staff_member_required
def admin_service_delete(request, service_id):
    service = get_object_or_404(Service, id=service_id)
    
    if request.method == 'POST':
        service.delete()
        messages.success(request, 'Service deleted successfully!')
        return redirect('admin_services')
    
    return render(request, 'admin/service_delete.html', {'service': service})

@staff_member_required
def admin_profile(request):
    if request.method == 'POST':
        user = request.user
        user.first_name = request.POST.get('first_name', '')
        user.last_name = request.POST.get('last_name', '')
        user.email = request.POST.get('email', '')
        user.save()
        messages.success(request, _('Profile updated successfully!'))
        return redirect('admin_profile')
        
    return render(request, 'admin/profile.html')
