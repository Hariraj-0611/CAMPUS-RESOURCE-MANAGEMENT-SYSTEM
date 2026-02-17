from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    """Custom User model with role-based access"""
    ROLE_CHOICES = [
        ('ADMIN', 'Admin'),
        ('STAFF', 'Staff'),
        ('STUDENT', 'Student'),
    ]
    
    STATUS_CHOICES = [
        ('ACTIVE', 'Active'),
        ('INACTIVE', 'Inactive'),
    ]
    
    phone = models.CharField(max_length=20, blank=True, null=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='STUDENT')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='ACTIVE')
    
    class Meta:
        db_table = 'users'


class Resource(models.Model):
    """Campus resources like labs, classrooms, etc."""
    TYPE_CHOICES = [
        ('Lab', 'Lab'),
        ('Classroom', 'Classroom'),
        ('Event Hall', 'Event Hall'),
        ('Computer', 'Computer'),
    ]
    
    STATUS_CHOICES = [
        ('AVAILABLE', 'Available'),
        ('MAINTENANCE', 'Maintenance'),
        ('BLOCKED', 'Blocked'),
    ]
    
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    capacity = models.IntegerField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='AVAILABLE')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'resources'
    
    def __str__(self):
        return f"{self.name} ({self.type})"


class Booking(models.Model):
    """Booking reservations for resources"""
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
        ('CANCELLED', 'Cancelled'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookings')
    resource = models.ForeignKey(Resource, on_delete=models.CASCADE, related_name='bookings')
    booking_date = models.DateField()
    time_slot = models.CharField(max_length=20)  # Format: "HH:MM-HH:MM"
    participants_count = models.IntegerField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'bookings'
        unique_together = ['resource', 'booking_date', 'time_slot']
    
    def __str__(self):
        return f"{self.user.username} - {self.resource.name} on {self.booking_date}"


class AuditLog(models.Model):
    """Audit trail for administrative actions"""
    action = models.CharField(max_length=50)
    entity_type = models.CharField(max_length=50)
    entity_id = models.IntegerField()
    performed_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='audit_logs')
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'audit_logs'
    
    def __str__(self):
        return f"{self.action} on {self.entity_type} by {self.performed_by.username}"
