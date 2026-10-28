from django.urls import path
from .views import (
    RegisterView,
    VerifyCodeView,
    ResendCodeView,
    LoginView,
    MeView,
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('verify-code/', VerifyCodeView.as_view(), name='auth_verify_code'),
    path('resend-code/', ResendCodeView.as_view(), name='auth_resend_code'),
    path('login/', LoginView.as_view(), name='auth_login'),
    path('me/', MeView.as_view(), name='auth_me'),
]
