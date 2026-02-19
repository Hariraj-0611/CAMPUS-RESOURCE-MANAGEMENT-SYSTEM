from rest_framework import permissions


class IsStudent(permissions.BasePermission):
    """Allow access only to STUDENT role"""
    
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.role == 'STUDENT' and
            request.user.status == 'ACTIVE'
        )


class IsStaff(permissions.BasePermission):
    """Allow access only to STAFF role"""
    
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.role == 'STAFF' and
            request.user.status == 'ACTIVE'
        )


class IsAdmin(permissions.BasePermission):
    """Allow access only to ADMIN role"""
    
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.role == 'ADMIN' and
            request.user.status == 'ACTIVE'
        )


class IsStaffOrAdmin(permissions.BasePermission):
    """Allow access to STAFF or ADMIN roles"""
    
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.role in ['STAFF', 'ADMIN'] and
            request.user.status == 'ACTIVE'
        )


class IsOwnerOrStaff(permissions.BasePermission):
    """Allow access to owner of the object or STAFF/ADMIN"""
    
    def has_object_permission(self, request, view, obj):
        # Staff and Admin can access all
        if request.user.role in ['STAFF', 'ADMIN']:
            return True
        
        # Students can only access their own bookings
        if hasattr(obj, 'user'):
            return obj.user == request.user
        
        return False
