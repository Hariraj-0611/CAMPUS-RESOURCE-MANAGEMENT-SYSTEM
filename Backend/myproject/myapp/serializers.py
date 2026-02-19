from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import User, Resource, Booking


# Authentication Serializers
class RegisterSerializer(serializers.ModelSerializer):
    """Registration serializer"""
    password = serializers.CharField(
        write_only=True, 
        required=True, 
        validators=[validate_password],
        style={'input_type': 'password'}
    )
    password2 = serializers.CharField(
        write_only=True, 
        required=True,
        style={'input_type': 'password'}
    )
    name = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = User
        fields = ['name', 'email', 'phone', 'password', 'password2', 'role']
        extra_kwargs = {
            'email': {'required': True},
            'role': {'required': False, 'default': 'STUDENT'}
        }
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        
        # Only STUDENT and STAFF can self-register
        role = attrs.get('role', 'STUDENT')
        if role not in ['STUDENT', 'STAFF']:
            raise serializers.ValidationError({"role": "Only STUDENT and STAFF can register."})
        
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password2')
        name = validated_data.pop('name')
        password = validated_data.pop('password')
        
        # Split name
        name_parts = name.split(' ', 1)
        first_name = name_parts[0]
        last_name = name_parts[1] if len(name_parts) > 1 else ''
        
        # Generate username from email
        username = validated_data['email'].split('@')[0]
        counter = 1
        base_username = username
        while User.objects.filter(username=username).exists():
            username = f"{base_username}{counter}"
            counter += 1
        
        user = User.objects.create_user(
            username=username,
            email=validated_data['email'],
            password=password,
            first_name=first_name,
            last_name=last_name,
            phone=validated_data.get('phone', ''),
            role=validated_data.get('role', 'STUDENT'),
            status='ACTIVE'
        )
        
        return user


class UserSerializer(serializers.ModelSerializer):
    """User serializer for responses"""
    name = serializers.SerializerMethodField()
    createdAt = serializers.DateTimeField(source='date_joined', read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'name', 'email', 'phone', 'role', 'status', 'createdAt']
        read_only_fields = ['id', 'createdAt']
    
    def get_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip() or obj.username


# Resource Serializers
class ResourceSerializer(serializers.ModelSerializer):
    """Resource serializer"""
    
    class Meta:
        model = Resource
        fields = ['id', 'name', 'type', 'capacity', 'status']
        read_only_fields = ['id']


# Booking Serializers
class BookingSerializer(serializers.ModelSerializer):
    """Booking serializer"""
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    resource_name = serializers.CharField(source='resource.name', read_only=True)
    resource_type = serializers.CharField(source='resource.type', read_only=True)
    resource_capacity = serializers.IntegerField(source='resource.capacity', read_only=True)
    approved_by_name = serializers.CharField(source='approved_by.get_full_name', read_only=True)
    
    class Meta:
        model = Booking
        fields = [
            'id', 'user', 'user_name', 'user_email', 
            'resource', 'resource_name', 'resource_type', 'resource_capacity',
            'booking_date', 'time_slot', 'start_time', 'end_time',
            'number_of_attendees', 'reason', 'status', 'remarks',
            'approved_by', 'approved_by_name', 'approved_at', 'cancelled_at', 'created_at'
        ]
        read_only_fields = ['id', 'approved_by', 'approved_at', 'cancelled_at', 'created_at']
    
    def validate(self, data):
        """Validate booking data"""
        resource = data.get('resource')
        booking_date = data.get('booking_date')
        time_slot = data.get('time_slot')
        number_of_attendees = data.get('number_of_attendees', 1)
        
        # Check capacity
        if resource and number_of_attendees > resource.capacity:
            # Find alternative resources with sufficient capacity
            suggested_resources = Resource.objects.filter(
                capacity__gte=number_of_attendees,
                status='AVAILABLE'
            ).exclude(id=resource.id).values('id', 'name', 'type', 'capacity')
            
            raise serializers.ValidationError({
                "capacity_exceeded": True,
                "message": f"Number of attendees ({number_of_attendees}) exceeds resource capacity ({resource.capacity})",
                "suggested_resources": list(suggested_resources)
            })
        
        # Check for existing booking
        query = Booking.objects.filter(
            resource=resource,
            booking_date=booking_date,
            time_slot=time_slot
        ).exclude(status='REJECTED')
        
        # Exclude current instance if updating
        if self.instance:
            query = query.exclude(pk=self.instance.pk)
        
        if query.exists():
            raise serializers.ValidationError(
                "This resource is already booked for the selected date and time slot."
            )
        
        return data


class BookingCreateSerializer(serializers.ModelSerializer):
    """Booking creation serializer for students and staff"""
    
    class Meta:
        model = Booking
        fields = ['resource', 'booking_date', 'time_slot', 'start_time', 'end_time', 'number_of_attendees', 'reason']
    
    def validate(self, data):
        """Validate booking data"""
        resource = data.get('resource')
        booking_date = data.get('booking_date')
        time_slot = data.get('time_slot')
        number_of_attendees = data.get('number_of_attendees', 1)
        reason = data.get('reason', '').strip()
        
        # Reason is required
        if not reason:
            raise serializers.ValidationError({"reason": "Reason for booking is required."})
        
        # Check capacity
        if resource and number_of_attendees > resource.capacity:
            # Find alternative resources with sufficient capacity
            suggested_resources = Resource.objects.filter(
                capacity__gte=number_of_attendees,
                status='AVAILABLE'
            ).exclude(id=resource.id).values('id', 'name', 'type', 'capacity')
            
            raise serializers.ValidationError({
                "capacity_exceeded": True,
                "message": f"Number of attendees ({number_of_attendees}) exceeds resource capacity ({resource.capacity})",
                "suggested_resources": list(suggested_resources)
            })
        
        # Check for existing booking
        if Booking.objects.filter(
            resource=resource,
            booking_date=booking_date,
            time_slot=time_slot
        ).exclude(status='REJECTED').exists():
            raise serializers.ValidationError(
                "This resource is already booked for the selected date and time slot."
            )
        
        return data


class BookingApproveSerializer(serializers.Serializer):
    """Serializer for approving bookings"""
    remarks = serializers.CharField(required=False, allow_blank=True)


class BookingRejectSerializer(serializers.Serializer):
    """Serializer for rejecting bookings"""
    remarks = serializers.CharField(required=True)
