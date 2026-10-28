from django.contrib import admin
from .models import UserProfile, EmailVerificationCode


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'phone', 'email_verified', 'created_at')
    search_fields = ('user__username', 'user__email', 'phone')


@admin.register(EmailVerificationCode)
class EmailVerificationCodeAdmin(admin.ModelAdmin):
    list_display = ('email', 'code', 'purpose', 'is_used', 'created_at', 'expires_at')
    list_filter = ('purpose', 'is_used')
    search_fields = ('email', 'code')
    readonly_fields = ('created_at',)
