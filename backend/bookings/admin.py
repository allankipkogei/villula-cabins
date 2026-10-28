from django.contrib import admin
from .models import Booking


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('cabin', 'guest_name', 'check_in', 'check_out', 'status', 'total_price')
    list_filter = ('status', 'cabin')
    search_fields = ('guest_name', 'guest_email')