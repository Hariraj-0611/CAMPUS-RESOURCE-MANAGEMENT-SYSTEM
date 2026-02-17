from rest_framework import serializers
from .models import User, Resource, Booking, AuditLog

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'phone', 'role', 'status', 'date_joined']
        read_only_fields = ['id', 'date_joined']


class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name', 'phone', 'role']
    
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class ResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
        fields = ['id', 'name', 'type', 'capacity', 'status', 'created_at']
        read_only_fields = ['id', 'created_at']


class BookingSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    resource_name = serializers.CharField(source='resource.name', read_only=True)
    
    class Meta:
        model = Booking
        fields = ['id', 'user', 'user_name', 'resource', 'resource_name', 
                  'booking_date', 'time_slot', 'participants_count', 'status', 'created_at']
        read_only_fields = ['id', 'created_at', 'status']


class AuditLogSerializer(serializers.ModelSerializer):
    performed_by_name = serializers.CharField(source='performed_by.username', read_only=True)
    
    class Meta:
        model = AuditLog
        fields = ['id', 'action', 'entity_type', 'entity_id', 'performed_by', 
                  'performed_by_name', 'timestamp']
        read_only_fields = ['id', 'timestamp']
