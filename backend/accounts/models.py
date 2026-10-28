import random
from datetime import timedelta
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    phone = models.CharField(max_length=30, blank=True, default='')
    email_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Profile of {self.user.email or self.user.username}"


class EmailVerificationCode(models.Model):
    PURPOSE_CHOICES = (
        ('signup', 'Sign Up Verification'),
        ('login', 'Login Verification'),
        ('password_reset', 'Password Reset'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='verification_codes', null=True, blank=True)
    email = models.EmailField(db_index=True)
    code = models.CharField(max_length=6)
    purpose = models.CharField(max_length=20, choices=PURPOSE_CHOICES, default='signup')
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.email} - {self.code} ({self.purpose})"

    @property
    def is_expired(self):
        return timezone.now() > self.expires_at

    @property
    def is_valid(self):
        return not self.is_used and not self.is_expired

    @classmethod
    def generate_code(cls, email, purpose='signup', user=None, validity_minutes=15):
        # Invalidate any previously unused codes for this email and purpose
        cls.objects.filter(email__iexact=email, purpose=purpose, is_used=False).update(is_used=True)

        # 6-digit numeric OTP
        code = f"{random.randint(100000, 999999)}"
        expires_at = timezone.now() + timedelta(minutes=validity_minutes)

        record = cls.objects.create(
            user=user,
            email=email.strip().lower(),
            code=code,
            purpose=purpose,
            expires_at=expires_at,
            is_used=False
        )
        return record
