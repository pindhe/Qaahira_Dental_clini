from django.urls import path
from django.contrib.auth import views as auth_views
from . import views
from . import admin_views

urlpatterns = [
    # Public pages
    path('', views.home, name='home'),
    path('services/', views.services_list, name='services'),
    path('services/<str:service_slug>/', views.service_detail, name='service_detail'),
    path('gallery/', views.gallery_list, name='gallery'),
    path('about/', views.about, name='about'),
    path('contact/', views.contact, name='contact'),
    path('login/', auth_views.LoginView.as_view(template_name='clinic/login.html'), name='login'),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),
    path('book-appointment/', views.book_appointment, name='book_appointment'),
    path('my-appointments/', views.my_appointments, name='my_appointments'),
    path('update-appointment/<int:appointment_id>/', views.update_appointment, name='update_appointment'),
    path('cancel-appointment/<int:appointment_id>/', views.cancel_appointment, name='cancel_appointment'),
    
    # Admin dashboard
    path('admin-dashboard/', admin_views.admin_dashboard, name='admin_dashboard'),
    path('admin-dashboard/appointments/', admin_views.admin_appointments, name='admin_appointments'),
    path('admin-dashboard/appointments/<int:appointment_id>/', admin_views.admin_appointment_detail, name='admin_appointment_detail'),
    path('admin-dashboard/appointments/<int:appointment_id>/update/', admin_views.admin_update_appointment, name='admin_update_appointment'),
    path('admin-dashboard/appointments/<int:appointment_id>/cancel/', admin_views.admin_cancel_appointment, name='admin_cancel_appointment'),
    path('admin-dashboard/customers/', admin_views.admin_customers, name='admin_customers'),
    path('admin-dashboard/customers/<int:patient_id>/', admin_views.admin_customer_detail, name='admin_customer_detail'),
    path('admin-dashboard/services/', admin_views.admin_services, name='admin_services'),
    path('admin-dashboard/services/create/', admin_views.admin_service_create, name='admin_service_create'),
    path('admin-dashboard/services/<int:service_id>/edit/', admin_views.admin_service_edit, name='admin_service_edit'),
    path('admin-dashboard/services/<int:service_id>/delete/', admin_views.admin_service_delete, name='admin_service_delete'),
    
    # Admin Gallery Management
    path('admin-dashboard/gallery/', admin_views.admin_gallery, name='admin_gallery'),
    path('admin-dashboard/gallery/create/', admin_views.admin_gallery_create, name='admin_gallery_create'),
    path('admin-dashboard/gallery/<int:gallery_id>/edit/', admin_views.admin_gallery_edit, name='admin_gallery_edit'),
    path('admin-dashboard/gallery/<int:gallery_id>/delete/', admin_views.admin_gallery_delete, name='admin_gallery_delete'),
    
    path('admin-dashboard/profile/', admin_views.admin_profile, name='admin_profile'),
]

