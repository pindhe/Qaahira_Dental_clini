"""
URL configuration for dental_clinic project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.conf.urls.i18n import i18n_patterns
from clinic import views

# URLs that should NOT be translated (admin, set_language, static files, etc.)
urlpatterns = [
    path('admin/', admin.site.urls),
    path('set-language/', views.set_language, name='set_language'),  # Custom language switcher
]

# URLs that should be translated (with language prefix)
# This automatically creates /ar/ prefix for Arabic and / for English (default)
urlpatterns += i18n_patterns(
    path('', include('clinic.urls')),
    prefix_default_language=False,  # Don't prefix default language (English)
)

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

