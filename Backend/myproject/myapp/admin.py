from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Resource, Booking, AuditLog


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['username', 'email', 'role', 'status', 'date_joined']
    list_filter = ['role', 'status', 'date_joined']
    search_fields = ['username', 'email', 'first_name', 'last_name']
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Additional Info', {'fields': ('phone', 'role', 'status')}),
    )
    
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Additional Info', {'fields': ('phone', 'role', 'status')}),
    )


@admin.register(Resource)
class ResourceAdmin(admin.ModelAdmin):
    list_display = ['name', 'type', 'capacity', 'status', 'created_at']
    list_filter = ['type', 'status', 'created_at']
    search_fields = ['name']
    ordering = ['-created_at']


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'resource', 'booking_date', 'time_slot', 'status', 'created_at']
    list_filter = ['status', 'booking_date', 'created_at']
    search_fields = ['user__username', 'resource__name']
    ordering = ['-created_at']
    
    def get_readonly_fields(self, request, obj=None):
        if obj:  # Editing existing object
            return ['user', 'resource', 'booking_date', 'time_slot', 'created_at']
        return ['created_at']


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ['action', 'entity_type', 'entity_id', 'performed_by', 'timestamp']
    list_filter = ['action', 'entity_type', 'timestamp']
    search_fields = ['entity_type', 'performed_by__username']
    ordering = ['-timestamp']
    
    def has_add_permission(self, request):
        return False  # Audit logs should not be manually created
    
    def has_change_permission(self, request, obj=None):
        return False  # Audit logs should not be modified
