"""
Script to create basic translation files for Arabic and English
Run this script to generate django.po files that can be edited manually
"""
import os

# Create locale directories if they don't exist
os.makedirs('locale/ar/LC_MESSAGES', exist_ok=True)
os.makedirs('locale/en/LC_MESSAGES', exist_ok=True)

# Common translations dictionary
translations = {
    'en': {
        'Home': 'Home',
        'Services': 'Services',
        'Doctors': 'Doctors',
        'About': 'About',
        'Contact': 'Contact',
        'Login': 'Login',
        'Register': 'Register',
        'Logout': 'Logout',
        'My Appointments': 'My Appointments',
        'Book Appointment': 'Book Appointment',
        'Admin Dashboard': 'Admin Dashboard',
        'Language': 'Language',
        'English': 'English',
        'Arabic': 'Arabic',
        'EN': 'EN',
        'AR': 'AR',
    },
    'ar': {
        'Home': 'الرئيسية',
        'Services': 'الخدمات',
        'Doctors': 'الأطباء',
        'About': 'من نحن',
        'Contact': 'اتصل بنا',
        'Login': 'تسجيل الدخول',
        'Register': 'التسجيل',
        'Logout': 'تسجيل الخروج',
        'My Appointments': 'مواعيدي',
        'Book Appointment': 'حجز موعد',
        'Admin Dashboard': 'لوحة التحكم',
        'Language': 'اللغة',
        'English': 'الإنجليزية',
        'Arabic': 'العربية',
        'EN': 'EN',
        'AR': 'AR',
    }
}

# Create .po file header
po_header = '''# Translation file for Django project
# Copyright (C) 2024 Dental Clinic
# This file is distributed under the same license as the Django project.
#
msgid ""
msgstr ""
"Project-Id-Version: Dental Clinic 1.0\\n"
"Report-Msgid-Bugs-To: \\n"
"POT-Creation-Date: 2024-01-01 00:00+0000\\n"
"PO-Revision-Date: 2024-01-01 00:00+0000\\n"
"Language-Team: \\n"
"Language: {}\\n"
"MIME-Version: 1.0\\n"
"Content-Type: text/plain; charset=UTF-8\\n"
"Content-Transfer-Encoding: 8bit\\n"
"Plural-Forms: nplurals=2; plural=(n != 1);\\n"

'''

# Generate .po files
for lang_code in ['en', 'ar']:
    po_content = po_header.format(lang_code)
    for msgid, msgstr in translations[lang_code].items():
        po_content += f'msgid "{msgid}"\n'
        po_content += f'msgstr "{msgstr}"\n\n'
    
    po_file = f'locale/{lang_code}/LC_MESSAGES/django.po'
    with open(po_file, 'w', encoding='utf-8') as f:
        f.write(po_content)
    
    print(f'Created {po_file}')

print('\nTranslation files created!')
print('To compile them, run: python manage.py compilemessages')


