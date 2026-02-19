from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    """Custom User model with RBAC"""
    ROLE_CHOICES = [
        ('ADMIN', 'Admin'),
        ('STAFF', 'Staff'),
        ('STUDENT', 'Student'),
    ]
    
    STATUS_CHOICES = [
        ('ACTIVE', 'Active'),
        ('INACTIVE', 'Inactive'),
    ]
    
    # Override email to make it unique and required
    email = models.EmailField(unique=True)
    
    # Additional fields
    phone = models.CharField(max_length=20, blank=True, null=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='STUDENT')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='ACTIVE')
    # createdAt is handled by date_joined from AbstractUser
    
    class Meta:
        db_table = 'users'
    
    def __str__(self):
        return f"{self.email} ({self.role})"


class Resource(models.Model):
    """Resource Management Model"""
    TYPE_CHOICES = [
        ('LAB', 'Lab'),
        ('CLASSROOM', 'Classroom'),
        ('EVENT_HALL', 'Event Hall'),
    ]
    
    STATUS_CHOICES = [
        ('AVAILABLE', 'Available'),
        ('UNAVAILABLE', 'Unavailable'),
    ]
    
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    capacity = models.IntegerField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='AVAILABLE')
    
    class Meta:
        db_table = 'resources'
    
    def __str__(self):
        return f"{self.name} ({self.type})"


class Booking(models.Model):
    """Booking Model with double-booking prevention"""
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookings')
    resource = models.ForeignKey(Resource, on_delete=models.CASCADE, related_name='bookings')
    booking_date = models.DateField(db_column='bookingDate')
    time_slot = models.CharField(max_length=20, db_column='timeSlot')  # Keep for backward compatibility
    start_time = models.TimeField(null=True, blank=True)
    end_time = models.TimeField(null=True, blank=True)
    number_of_attendees = models.IntegerField(default=1)
    reason = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    remarks = models.TextField(blank=True, null=True)
    approved_by = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='approved_bookings'
    )
    approved_at = models.DateTimeField(null=True, blank=True)
    cancelled_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    
    class Meta:
        db_table = 'bookings'
        # Business Rule: Prevent double booking
        unique_together = [['resource', 'booking_date', 'time_slot']]
    
    def __str__(self):
        return f"{self.user.email} - {self.resource.name} on {self.booking_date}"
