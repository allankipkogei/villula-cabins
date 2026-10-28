import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from cabins.models import Cabin, CabinImage, SiteSettings
from bookings.models import Booking
from contacts.models import ContactMessage
from django.contrib.auth.models import User

def seed():
    """
    Initializes Villula Cabins Resort in an under-construction state.
    Configures official branding, contact info, rules, and admin credentials.
    Database has 0 cabins, 0 bookings, and 0 messages until officially added.
    """
    print("Initializing Villula Cabins Resort...")

    # Ensure admin user exists
    user, created = User.objects.get_or_create(username='admin')
    user.set_password('admin123')
    user.is_staff = True
    user.is_superuser = True
    user.save()
    print("Admin user verified: admin / admin123")

    # Update Site Settings
    settings = SiteSettings.get()
    settings.resort_name = "Villula Cabins Resort"
    settings.tagline = "Modern Architectural Micro-Stays & Luxury Nature Sanctuaries"
    settings.about_heading = "Relax. Reconnect. Experience Nature Views in Comfort."
    settings.about_text = (
        "Villula Cabins Resort reimagines the modern retreat experience across peaceful scenic grounds in Kenya's Great Rift Valley. "
        "We merged sustainable micro-architecture — precision-engineered shipping containers "
        "and aerospace-grade glass capsules — with five-star bespoke hospitality. Every stay features private "
        "wood-fired cedar hot tubs, Starlink gigabit connectivity, panoramic stargazing skylights, and total secluded stillness."
    )
    settings.about_image_url = ""
    settings.contact_phone = "+254 (0) 700 555 845"
    settings.contact_email = "stay@villularesort.com"
    settings.contact_address = "VIllula View Villas, Off C646, Eldoret, Uasin Gishu County, Kenya"
    settings.check_in_time = "1:00 PM"
    settings.check_out_time = "11:00 AM"
    settings.map_embed_url = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.654877395028!2d35.3199392!3d0.5151905!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1781030023508837%3A0x75e2b224eac58bcd!2sVIllula%20View%20Villas!5e0!3m2!1sen!2ske!4v1714000000000!5m2!1sen!2ske"
    settings.instagram_url = "https://instagram.com/villulacabins"
    settings.facebook_url = "https://facebook.com/villulacabins"
    settings.save()
    print("Site settings updated.")

    # Clean state: ensure 0 records exist
    Booking.objects.all().delete()
    ContactMessage.objects.all().delete()
    CabinImage.objects.all().delete()
    Cabin.objects.all().delete()

    print(f"Data verified: {Cabin.objects.count()} cabins, {Booking.objects.count()} bookings, {ContactMessage.objects.count()} messages.")
    print("Database ready for production management.")

if __name__ == '__main__':
    seed()
