from django.contrib import admin
from .models import Doctor, Service, Patient, Appointment, Gallery

admin.site.site_header = 'Dental Clinic Administration'
admin.site.site_title = 'Dental Clinic Admin'
admin.site.index_title = 'Welcome to Dental Clinic Administration'

@admin.register(Gallery)
class GalleryAdmin(admin.ModelAdmin):
    list_display = ('title', 'created_at')
    search_fields = ('title', 'description')
    readonly_fields = ('created_at',)
    fieldsets = (
        ('Gallery Information', {
            'fields': ('title', 'description')
        }),
        ('Images', {
            'fields': ('before_image', 'after_image')
        }),
        ('Metadata', {
            'fields': ('created_at',)
        }),
    )

@admin.register(Doctor)
class DoctorAdmin(admin.ModelAdmin):
    list_display = ('name', 'specialization', 'phone', 'email', 'is_available', 'created_at')
    list_filter = ('specialization', 'is_available', 'created_at')
    search_fields = ('name', 'specialization', 'email', 'phone')
    readonly_fields = ('created_at',)
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'specialization', 'bio')
        }),
        ('Contact Information', {
            'fields': ('phone', 'email')
        }),
        ('Media', {
            'fields': ('photo',)
        }),
        ('Status', {
            'fields': ('is_available', 'created_at')
        }),
    )

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'duration', 'icon', 'created_at')
    search_fields = ('name', 'description')
    list_filter = ('created_at', 'price', 'duration')
    readonly_fields = ('created_at',)
    fieldsets = (
        ('Service Information', {
            'fields': ('name', 'description', 'icon')
        }),
        ('Pricing & Duration', {
            'fields': ('price', 'duration')
        }),
        ('Metadata', {
            'fields': ('created_at',)
        }),
    )

@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'phone', 'email', 'date_of_birth', 'created_at')
    search_fields = ('first_name', 'last_name', 'email', 'phone', 'user__username')
    list_filter = ('date_of_birth', 'created_at')
    readonly_fields = ('created_at',)
    fieldsets = (
        ('Personal Information', {
            'fields': ('user', 'first_name', 'last_name', 'date_of_birth')
        }),
        ('Contact Information', {
            'fields': ('phone', 'email', 'address')
        }),
        ('Medical Information', {
            'fields': ('medical_history',)
        }),
        ('Metadata', {
            'fields': ('created_at',)
        }),
    )

@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ('patient', 'doctor', 'service', 'appointment_date', 'appointment_time', 'status', 'created_at')
    list_filter = ('status', 'appointment_date', 'doctor', 'created_at')
    search_fields = ('patient__first_name', 'patient__last_name', 'doctor__name', 'service__name')
    date_hierarchy = 'appointment_date'
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('Appointment Details', {
            'fields': ('patient', 'doctor', 'service', 'appointment_date', 'appointment_time')
        }),
        ('Status & Notes', {
            'fields': ('status', 'notes')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )

