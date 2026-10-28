from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, EmailVerificationCode


class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=6)
    full_name = serializers.CharField(max_length=150, required=False, allow_blank=True)
    phone = serializers.CharField(max_length=30, required=False, allow_blank=True)

    def validate_email(self, value):
        email = value.strip().lower()
        if User.objects.filter(email__iexact=email, is_active=True).exists():
            raise serializers.ValidationError("An account with this email address already exists. Please log in.")
        return email


class VerifyCodeSerializer(serializers.Serializer):
    email = serializers.EmailField()
    code = serializers.CharField(max_length=6, min_length=6)


class ResendCodeSerializer(serializers.Serializer):
    email = serializers.EmailField()
    purpose = serializers.ChoiceField(choices=['signup', 'login', 'password_reset'], default='signup')


class LoginSerializer(serializers.Serializer):
    email = serializers.CharField()
    password = serializers.CharField(write_only=True)


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ('phone', 'email_verified')


class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    phone = serializers.SerializerMethodField()
    email_verified = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'name', 'phone', 'is_staff', 'is_superuser', 'email_verified')

    def get_name(self, obj):
        full_name = obj.get_full_name()
        return full_name if full_name.strip() else obj.username

    def get_phone(self, obj):
        profile = getattr(obj, 'profile', None)
        return profile.phone if profile else ''

    def get_email_verified(self, obj):
        profile = getattr(obj, 'profile', None)
        return profile.email_verified if profile else False
