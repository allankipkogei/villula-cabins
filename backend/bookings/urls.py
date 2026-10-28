from .views import MeView
from django.urls import path
from .views import (
    BookingCreateView, CabinAvailabilityView,
    AdminBookingListView, AdminBookingDetailView, AdminDashboardStatsView,
)

urlpatterns = [
    path('bookings/', BookingCreateView.as_view(), name='booking-create'),
    path('cabins/<int:cabin_id>/availability/', CabinAvailabilityView.as_view(),
         name='cabin-availability'),
    # Admin
    path('admin/bookings/', AdminBookingListView.as_view(), name='admin-booking-list'),
    path('admin/bookings/<int:pk>/', AdminBookingDetailView.as_view(), name='admin-booking-detail'),
    path('admin/stats/', AdminDashboardStatsView.as_view(), name='admin-stats'),
    
    path('me/', MeView.as_view(), name='me'),
]

