"""myproject URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, re_path
from django.conf.urls import include
from boards import views
from accounts import views as accounts_views
from django.contrib.auth import views as auth_views
urlpatterns = [
    # re_path(r'^$',views.BoardListView.as_view(),name='home'),
    re_path(r'^$',views.home,name='home'),
    re_path(r'^signup/$',accounts_views.signup,name='signup'),
    re_path(r'^settings/account/$',accounts_views.UserUpdateView.as_view(),name='my_account'),
    re_path(r'^logout/$',auth_views.LogoutView.as_view(),name='logout'),
    re_path(r'^login/$',auth_views.LoginView.as_view(template_name='login.html'),name='login'),
    # re_path(r'^boards/(?P<pk>\d+)/$',views.board_topics,name='board_topics'),
    # re_path(r'^boards/(?P<pk>\d+)/$',views.TopicListView.as_view(),name='board_topics'),
    re_path(r'^boards/(?P<pk>\d+)/$',views.TopList.as_view(),name='board_topics'),
    re_path(r'^boards/(?P<pk>\d+)/new/$',views.new_topic,name='new_topic'),
    re_path(r'^boards/(?P<pk>\d+)/topics/(?P<topic_pk>\d+)/$',views.PostListView.as_view(),name='topic_posts'),
    re_path(r'^boards/(?P<pk>\d+)/topics/(?P<topic_pk>\d+)/reply/$',views.reply_topic,name='reply_topic'),
    re_path(r'^boards/(?P<pk>\d+)/topics/(?P<topic_pk>\d+)/posts/(?P<post_pk>\d+)/edit/$',views.PostUpdateView.as_view(),name='edit_post'),

    path('admin/', admin.site.urls),
]
