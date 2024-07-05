from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
class SignUpForm(UserCreationForm):
    email = forms.EmailField(max_length=200, required=True, widget=forms.EmailInput(), help_text='Required')
    class Meta:
        model = User
        fields = ('username', 'email', 'password1', 'password2',)
        lables = {
            'username': '用户名',
            'email': '邮箱',
        }