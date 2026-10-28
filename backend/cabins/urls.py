from django.urls import path
from .views import (
    CabinListView, CabinDetailView,
    AdminCabinListCreateView, AdminCabinDetailView,
    AdminCabinImageListCreateView, AdminCabinImageDetailView,
    SiteSettingsView,
)

urlpatterns = [
    path('site-settings/', SiteSettingsView.as_view(), name='site-settings'),
    path('cabins/', CabinListView.as_view(), name='cabin-list'),
    path('cabins/<slug:slug>/', CabinDetailView.as_view(), name='cabin-detail'),
    # Admin
    path('admin/cabins/', AdminCabinListCreateView.as_view(), name='admin-cabin-list'),
    path('admin/cabins/<int:pk>/', AdminCabinDetailView.as_view(), name='admin-cabin-detail'),
    path('admin/cabin-images/', AdminCabinImageListCreateView.as_view(), name='admin-cabin-image-list'),
    path('admin/cabin-images/<int:pk>/', AdminCabinImageDetailView.as_view(), name='admin-cabin-image-detail'),
]
