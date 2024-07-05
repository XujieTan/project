from django import forms
from django.forms import ModelForm

from .models import Topic, Post


class NewTopicForm(forms.ModelForm):
    message = forms.CharField(
        widget=forms.Textarea(
            attrs={'rows':5,'cols':100,'placeholder':'What is on your mind?'}
        ),
        max_length=4000,
        help_text='The max length of the text is 4000.'
    )
    class Meta:
        model = Topic
        fields = ['subject', 'message']

    # # 验证用户是否登录
    # def clean(self):
    #     if not self.request.user.is_authenticated:
    #         raise forms.ValidationError('You must be logged in to create a new topic.')
    #     cleaned_data = super().clean()
    #     return cleaned_data
class PostForm(forms.ModelForm):
    class Meta:
        model = Post
        fields = ['message',]