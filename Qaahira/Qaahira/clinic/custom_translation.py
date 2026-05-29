"""
Custom translation backend that uses our translation dictionary
This makes Django's {% trans %} tags work without compiled .mo files
"""
import django.utils.translation as translation
from django.utils import translation as trans_utils
from django.utils.translation import trans_real
from clinic.translation_context import TRANSLATIONS

# Create custom translation class that mimics Django's translation object
class CustomTranslation:
    def __init__(self, language_code):
        self.language_code = language_code
        self.translations = TRANSLATIONS.get(language_code, TRANSLATIONS['en'])
    
    def gettext(self, message):
        """Get translation for a message"""
        return self.translations.get(str(message), str(message))
    
    def ugettext(self, message):
        """Unicode gettext - same as gettext in Python 3"""
        return self.gettext(message)
    
    def ngettext(self, singular, plural, number):
        """Plural translation"""
        if number == 1:
            return self.gettext(singular)
        return self.gettext(plural)
    
    def ungettext(self, singular, plural, number):
        """Unicode plural translation"""
        return self.ngettext(singular, plural, number)
    
    def pgettext(self, context, message):
        """Contextual translation"""
        return self.gettext(message)
    
    def npgettext(self, context, singular, plural, number):
        """Contextual plural translation"""
        return self.ngettext(singular, plural, number)
    
    def get_language(self):
        """Return language code"""
        return self.language_code

# Custom gettext function that uses our translations
def custom_gettext(message):
    """Custom gettext that uses our translation dictionary"""
    try:
        current_language = translation.get_language() or 'en'
        translations_dict = TRANSLATIONS.get(current_language, TRANSLATIONS['en'])
        return translations_dict.get(str(message), str(message))
    except:
        return str(message)

# Store original functions
_original_gettext = translation.gettext
_original_ugettext = getattr(translation, 'ugettext', None)

# Override Django's gettext functions at module level
translation.gettext = custom_gettext
if hasattr(translation, 'ugettext'):
    translation.ugettext = custom_gettext

# Patch the translation catalogs to use dynamic language detection
def patch_translations():
    """Patch Django's translation catalogs with our custom translations"""
    try:
        # Create a dynamic translation object that checks language on each call
        class DynamicTranslation:
            def gettext(self, message):
                lang = translation.get_language() or 'en'
                return TRANSLATIONS.get(lang, TRANSLATIONS['en']).get(str(message), str(message))
            def ugettext(self, message):
                return self.gettext(message)
            def ngettext(self, singular, plural, number):
                return self.gettext(singular if number == 1 else plural)
        
        dynamic_trans = DynamicTranslation()
        # Register for both languages - Django will use the active one
        for lang_code in ['en', 'ar']:
            trans_real._translations[lang_code] = dynamic_trans
        
        # Also override the default translation functions
        import django.utils.translation.trans_real as trans_real_module
        trans_real_module.gettext = custom_gettext
        if hasattr(trans_real_module, 'ugettext'):
            trans_real_module.ugettext = custom_gettext
    except Exception as e:
        import sys
        # Silently fail - we'll use template tags as fallback
        pass

# Apply the patch when module is imported
try:
    patch_translations()
except Exception:
    pass

