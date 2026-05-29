# Translation Setup Guide

## Overview
This Django application supports English and Arabic translations. All text strings in templates and Python code are marked for translation.

## Translation Status

### ✅ Completed
- Base template (navigation, footer)
- Home page template
- All navigation menus
- Language switcher

### 🔄 In Progress
- Remaining templates need translation tags
- Python code messages need translation functions

## How Translations Work

1. **Templates**: Use `{% load i18n %}` and `{% trans "Text" %}` tags
2. **Python Code**: Use `from django.utils.translation import gettext_lazy as _` and `_('Text')`

## Creating Translation Files (when gettext tools are available)

### Step 1: Install gettext tools
- **Windows**: Download from https://mlocati.github.io/articles/gettext-iconv-windows.html
- **Linux/Mac**: Usually pre-installed, or install via package manager

### Step 2: Generate translation files
```bash
python manage.py makemessages -l ar
python manage.py makemessages -l en
```

### Step 3: Edit translation files
Edit `locale/ar/LC_MESSAGES/django.po` and add Arabic translations:
```po
msgid "Home"
msgstr "الرئيسية"

msgid "Services"
msgstr "الخدمات"

msgid "Doctors"
msgstr "الأطباء"
```

### Step 4: Compile translations
```bash
python manage.py compilemessages
```

## Manual Translation File Creation

If gettext tools are not available, you can manually create translation files in:
- `locale/ar/LC_MESSAGES/django.po` (Arabic)
- `locale/en/LC_MESSAGES/django.po` (English)

Then compile with: `python manage.py compilemessages`

## Key Translation Strings

Common strings that need translation:
- Navigation: Home, Services, Doctors, About, Contact
- Buttons: Book Appointment, Login, Register, Logout
- Admin: Dashboard, Appointments, Customers, etc.
- Messages: Success messages, error messages

## Testing Translations

1. Change language using the language switcher
2. Verify all text changes to Arabic/English
3. Check URLs update with language prefix (/ar/ for Arabic)

## Notes

- Default language is English (no URL prefix)
- Arabic URLs use /ar/ prefix
- Language preference is stored in session and cookie
- Translations work with i18n_patterns in URLs


