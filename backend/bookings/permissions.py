from rest_framework.permissions import BasePermission


class IsStaffUser(BasePermission):
    message = "You must be a staff user to access this."

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_staff)