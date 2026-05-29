"""
Custom translation middleware that injects translations into Django's translation system
"""
from django.utils import translation
from django.utils.translation import trans_real
from clinic.translation_context import TRANSLATIONS

class TranslationMiddleware:
    """
    Middleware to make Django's {% trans %} tags work with our custom translation dictionary
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Get current language
        language = translation.get_language() or 'en'
        
        # Store original translation function
        original_translation = trans_real._translations.get(language)
        
        # Create a custom translation catalog
        if language in TRANSLATIONS:
            # Override the translation function temporarily
            translations_dict = TRANSLATIONS[language]
            
            # Monkey patch Django's translation to use our dictionary
            def custom_gettext(message):
                return translations_dict.get(message, message)
            
            # Apply to the current language catalog if it exists
            if original_translation:
                original_translation.gettext = custom_gettext
        
        response = self.get_response(request)
        return response


