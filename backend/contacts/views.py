from rest_framework import generics
from rest_framework.permissions import AllowAny
from bookings.permissions import IsStaffUser
from .models import ContactMessage
from .serializers import ContactMessageSerializer


class ContactCreateView(generics.CreateAPIView):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [AllowAny]


class AdminContactListView(generics.ListAPIView):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [IsStaffUser]


class AdminContactDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [IsStaffUser]
    http_method_names = ['get', 'patch', 'delete', 'head', 'options']
