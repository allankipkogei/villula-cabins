from django.contrib import admin
from .models import Cabin, CabinImage
from .models import Cabin, CabinImage, SiteSettings

class CabinImageInline(admin.TabularInline):
    model = CabinImage
    extra = 1


@admin.register(Cabin)
class CabinAdmin(admin.ModelAdmin):
    list_display = ('name', 'unit_type', 'price_per_night', 'max_guests', 'is_active')
    list_filter = ('unit_type', 'is_active')
    prepopulated_fields = {'slug': ('name',)}
    inlines = [CabinImageInline]

@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    def has_add_permission(self, request):
        return not SiteSettings.objects.exists()    