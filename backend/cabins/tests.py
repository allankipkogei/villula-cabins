from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from decimal import Decimal
from .models import Cabin, CabinImage, SiteSettings


class CabinApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin_user = User.objects.create_user(username='staff', password='password123', is_staff=True)
        self.cabin1 = Cabin.objects.create(
            name="Nordic Capsule Test",
            unit_type="capsule",
            price_per_night=Decimal("250.00"),
            max_guests=2,
            bedrooms=1,
            bathrooms=1,
            is_active=True,
            amenities="Hot Tub, Wi-Fi"
        )
        self.cabin2 = Cabin.objects.create(
            name="Horizon Container Test",
            unit_type="container",
            price_per_night=Decimal("350.00"),
            max_guests=4,
            bedrooms=2,
            bathrooms=1,
            is_active=True
        )

    def test_list_cabins(self):
        res = self.client.get('/api/cabins/')
        self.assertEqual(res.status_code, 200)
        self.assertEqual(len(res.data), 2)

    def test_filter_cabins_by_type(self):
        res = self.client.get('/api/cabins/?unit_type=capsule')
        self.assertEqual(res.status_code, 200)
        self.assertEqual(len(res.data), 1)
        self.assertEqual(res.data[0]['name'], "Nordic Capsule Test")

    def test_cabin_detail_by_slug(self):
        res = self.client.get(f'/api/cabins/{self.cabin1.slug}/')
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data['name'], "Nordic Capsule Test")
        self.assertIn("Hot Tub", res.data['amenities_list'])

    def test_site_settings_get(self):
        res = self.client.get('/api/site-settings/')
        self.assertEqual(res.status_code, 200)
        self.assertIn('resort_name', res.data)

    def test_admin_cabin_create(self):
        self.client.force_authenticate(user=self.admin_user)
        payload = {
            'name': 'New Villa',
            'unit_type': 'container',
            'description': 'Luxury unit',
            'price_per_night': '400.00',
            'max_guests': 4,
            'bedrooms': 2,
            'bathrooms': 2,
            'is_active': True
        }
        res = self.client.post('/api/admin/cabins/', payload)
        self.assertEqual(res.status_code, 201)
        self.assertEqual(Cabin.objects.count(), 3)
