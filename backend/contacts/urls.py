from django.urls import path
from .views import ContactCreateView, AdminContactListView, AdminContactDetailView

urlpatterns = [
    path('contact/', ContactCreateView.as_view(), name='contact-create'),
    path('admin/messages/', AdminContactListView.as_view(), name='admin-messages'),
    path('admin/messages/<int:pk>/', AdminContactDetailView.as_view(), name='admin-message-detail'),
]