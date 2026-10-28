from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from datetime import date, timedelta
from decimal import Decimal
from cabins.models import Cabin
from .models import Booking


class BookingApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin = User.objects.create_user(username='staff', password='password123', is_staff=True)
        self.cabin = Cabin.objects.create(
            name="Meadow Capsule",
            unit_type="capsule",
            price_per_night=Decimal("200.00"),
            max_guests=2,
            bedrooms=1,
            bathrooms=1,
            is_active=True
        )

    def test_booking_creation_and_price_calculation(self):
        today = date.today()
        payload = {
            'cabin': self.cabin.id,
            'guest_name': 'Alice Smith',
            'guest_email': 'alice@example.com',
            'check_in': (today + timedelta(days=2)).isoformat(),
            'check_out': (today + timedelta(days=5)).isoformat(),
            'guests': 2,
        }
        res = self.client.post('/api/bookings/', payload)
        self.assertEqual(res.status_code, 201)
        booking = Booking.objects.first()
        self.assertEqual(booking.guest_name, 'Alice Smith')
        self.assertEqual(booking.total_price, Decimal('600.00')) # 3 nights * $200

    def test_prevent_overlapping_booking(self):
        today = date.today()
        Booking.objects.create(
            cabin=self.cabin,
            guest_name='First Guest',
            guest_email='first@example.com',
            check_in=today + timedelta(days=2),
            check_out=today + timedelta(days=6),
            guests=1,
            total_price=Decimal('800.00'),
            status='confirmed'
        )

        # Attempt to overlap
        payload = {
            'cabin': self.cabin.id,
            'guest_name': 'Second Guest',
            'guest_email': 'second@example.com',
            'check_in': (today + timedelta(days=4)).isoformat(),
            'check_out': (today + timedelta(days=8)).isoformat(),
            'guests': 1,
        }
        res = self.client.post('/api/bookings/', payload)
        self.assertEqual(res.status_code, 400)

    def test_admin_dashboard_stats(self):
        self.client.force_authenticate(user=self.admin)
        res = self.client.get('/api/admin/stats/')
        self.assertEqual(res.status_code, 200)
        self.assertIn('total_bookings', res.data)
        self.assertIn('total_revenue', res.data)
