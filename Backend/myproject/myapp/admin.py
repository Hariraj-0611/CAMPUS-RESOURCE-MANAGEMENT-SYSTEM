from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Resource, Booking


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Custom User Admin"""
    list_display = ['email', 'username', 'role', 'status', 'date_joined']
    list_filter = ['role', 'status', 'is_active', 'date_joined']
    search_fields = ['email', 'username', 'first_name', 'last_name', 'phone']
    ordering = ['-date_joined']
    
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal Info', {'fields': ('first_name', 'last_name', 'email', 'phone')}),
        ('Permissions', {'fields': ('role', 'status', 'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'role', 'status'),
        }),
    )


@admin.register(Resource)
class ResourceAdmin(admin.ModelAdmin):
    """Resource Admin"""
    list_display = ['name', 'type', 'capacity', 'status']
    list_filter = ['type', 'status']
    search_fields = ['name']
    ordering = ['name']


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    """Booking Admin"""
    list_display = ['id', 'user', 'resource', 'booking_date', 'time_slot', 'number_of_attendees', 'status', 'approved_by', 'created_at']
    list_filter = ['status', 'booking_date', 'resource__type', 'created_at']
    search_fields = ['user__email', 'user__username', 'resource__name', 'reason']
    ordering = ['-created_at', '-id']
    readonly_fields = ['created_at', 'approved_at', 'cancelled_at', 'approved_by']
    
    fieldsets = (
        ('Booking Info', {
            'fields': ('user', 'resource', 'booking_date', 'start_time', 'end_time', 'time_slot', 'number_of_attendees', 'reason')
        }),
        ('Status', {
            'fields': ('status', 'remarks', 'approved_by', 'approved_at', 'cancelled_at', 'created_at')
        }),
    )
    
    actions = ['approve_bookings', 'reject_bookings']
    
    def approve_bookings(self, request, queryset):
        """Approve selected bookings"""
        updated = 0
        for booking in queryset.filter(status='PENDING'):
            booking.status = 'APPROVED'
            booking.approved_by = request.user
            booking.save()
            updated += 1
        self.message_user(request, f'{updated} booking(s) approved successfully.')
    approve_bookings.short_description = "Approve selected bookings"
    
    def reject_bookings(self, request, queryset):
        """Reject selected bookings"""
        updated = 0
        for booking in queryset.filter(status='PENDING'):
            booking.status = 'REJECTED'
            booking.remarks = 'Rejected by admin'
            booking.save()
            updated += 1
        self.message_user(request, f'{updated} booking(s) rejected.')
    reject_bookings.short_description = "Reject selected bookings"
