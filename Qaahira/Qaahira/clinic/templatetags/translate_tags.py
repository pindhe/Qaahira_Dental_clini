"""
Custom template tags for translations that work without compiled .mo files
"""
from django import template
from django.utils.translation import get_language
from clinic.translation_context import TRANSLATIONS

register = template.Library()

@register.filter
def translate(text):
    """Translation filter that uses our custom translation dictionary"""
    if not text:
        return text
    current_language = get_language() or 'en'
    translations_dict = TRANSLATIONS.get(current_language, TRANSLATIONS['en'])
    text = str(text).strip('"\'')
    return translations_dict.get(text, text)

@register.simple_tag
def t(text):
    """Simple translation tag that uses our custom translation dictionary"""
    current_language = get_language() or 'en'
    translations_dict = TRANSLATIONS.get(current_language, TRANSLATIONS['en'])
    text = str(text).strip('"\'')
    return translations_dict.get(text, text)

@register.tag(name='trans')
def do_trans(parser, token):
    """Override Django's trans tag to use our translation dictionary"""
    try:
        parts = token.split_contents()
        if len(parts) == 2:
            tag_name, message = parts
        else:
            raise template.TemplateSyntaxError("'trans' tag requires a single argument")
    except ValueError:
        raise template.TemplateSyntaxError("'trans' tag requires a single argument")
    
    # Remove quotes from message
    message = message.strip('"\'')
    
    # Return a custom render function
    class TransNode(template.Node):
        def __init__(self, msg):
            self.message = msg
            
        def render(self, context):
            current_language = get_language() or 'en'
            translations_dict = TRANSLATIONS.get(current_language, TRANSLATIONS['en'])
            return translations_dict.get(self.message, self.message)
    
    return TransNode(message)

