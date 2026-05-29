from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from .models import Appointment, Patient, Doctor, Service
from datetime import date

class PatientRegistrationForm(UserCreationForm):
    first_name = forms.CharField(max_length=100, required=True, widget=forms.TextInput(attrs={
        'class': 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent'
    }))
    last_name = forms.CharField(max_length=100, required=True, widget=forms.TextInput(attrs={
        'class': 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent'
    }))
    email = forms.EmailField(required=True, widget=forms.EmailInput(attrs={
        'class': 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent'
    }))
    phone = forms.CharField(max_length=17, required=True, widget=forms.TextInput(attrs={
        'class': 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent',
        'placeholder': '+1234567890'
    }))
    date_of_birth = forms.DateField(required=False, widget=forms.DateInput(attrs={
        'class': 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent',
        'type': 'date'
    }))
    address = forms.CharField(required=False, widget=forms.Textarea(attrs={
        'class': 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent',
        'rows': 3
    }))

    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'email', 'phone', 'date_of_birth', 'address', 'password1', 'password2')

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['username'].widget.attrs.update({
            'class': 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent'
        })
        self.fields['password1'].widget.attrs.update({
            'class': 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent'
        })
        self.fields['password2'].widget.attrs.update({
            'class': 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent'
        })

    def save(self, commit=True):
        user = super().save(commit=False)
        user.email = self.cleaned_data['email']
        user.first_name = self.cleaned_data['first_name']
        user.last_name = self.cleaned_data['last_name']
        if commit:
            user.save()
            patient = Patient.objects.create(
                user=user,
                first_name=self.cleaned_data['first_name'],
                last_name=self.cleaned_data['last_name'],
                email=self.cleaned_data['email'],
                phone=self.cleaned_data['phone'],
                date_of_birth=self.cleaned_data.get('date_of_birth'),
                address=self.cleaned_data.get('address', '')
            )
        return user


class AppointmentForm(forms.ModelForm):
    first_name = forms.CharField(
        max_length=100,
        widget=forms.TextInput(attrs={
            'class': 'w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-gold-500/10 focus:border-gold-500 focus:bg-white transition-all duration-300 outline-none text-gray-900 font-medium placeholder:text-gray-400',
            'placeholder': 'Enter your first name'
        })
    )
    last_name = forms.CharField(
        max_length=100,
        widget=forms.TextInput(attrs={
            'class': 'w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-gold-500/10 focus:border-gold-500 focus:bg-white transition-all duration-300 outline-none text-gray-900 font-medium placeholder:text-gray-400',
            'placeholder': 'Enter your last name'
        })
    )
    phone = forms.CharField(
        max_length=17,
        widget=forms.TextInput(attrs={
            'class': 'w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-gold-500/10 focus:border-gold-500 focus:bg-white transition-all duration-300 outline-none text-gray-900 font-medium placeholder:text-gray-400',
            'placeholder': '+1234567890'
        })
    )
    doctor = forms.ModelChoiceField(
        queryset=Doctor.objects.filter(is_available=True),
        required=False,
        widget=forms.Select(attrs={
            'class': 'w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-gold-500/10 focus:border-gold-500 focus:bg-white transition-all duration-300 outline-none text-gray-900 font-medium'
        })
    )
    service = forms.ModelChoiceField(
        queryset=Service.objects.all(),
        required=True,
        widget=forms.Select(attrs={
            'class': 'w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-gold-500/10 focus:border-gold-500 focus:bg-white transition-all duration-300 outline-none text-gray-900 font-medium'
        })
    )
    appointment_date = forms.DateField(
        required=True,
        widget=forms.DateInput(attrs={
            'class': 'w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-gold-500/10 focus:border-gold-500 focus:bg-white transition-all duration-300 outline-none text-gray-900 font-medium',
            'type': 'date',
            'min': str(date.today())
        })
    )
    appointment_time = forms.TimeField(
        required=False,
        widget=forms.TimeInput(attrs={
            'class': 'w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-gold-500/10 focus:border-gold-500 focus:bg-white transition-all duration-300 outline-none text-gray-900 font-medium',
            'type': 'time'
        })
    )
    notes = forms.CharField(
        required=False,
        widget=forms.Textarea(attrs={
            'class': 'w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-gold-500/10 focus:border-gold-500 focus:bg-white transition-all duration-300 outline-none text-gray-900 font-medium placeholder:text-gray-400',
            'rows': 4,
            'placeholder': 'Any additional notes or concerns...'
        })
    )

    class Meta:
        model = Appointment
        fields = ['first_name', 'last_name', 'phone', 'doctor', 'service', 'appointment_date', 'appointment_time', 'notes']

