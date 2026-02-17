from rest_framework import viewsets, status, serializers
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from django.utils import timezone
from datetime import datetime

from .models import User, Resource, Booking, AuditLog
from .serializers import (
    UserSerializer, UserCreateSerializer, ResourceSerializer,
    BookingSerializer, AuditLogSerializer
)
from .permissions import IsAdmin, IsAdminOrReadOnly


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    permission_classes = [IsAuthenticated, IsAdmin]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return UserCreateSerializer
        return UserSerializer
    
    @action(detail=True, methods=['patch'])
    def deactivate(self, request, pk=None):
        user = self.get_object()
        user.status = 'INACTIVE'
        user.save()
        return Response(UserSerializer(user).data)


class ResourceViewSet(viewsets.ModelViewSet):
    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer
    permission_classes = [IsAuthenticated, IsAdminOrReadOnly]


class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'ADMIN':
            return Booking.objects.all()
        return Booking.objects.filter(user=user)
    
    def perform_create(self, serializer):
        user = self.request.user
        
        # Validate user is active
        if user.status != 'ACTIVE':
            raise serializers.ValidationError("User account is inactive")
        
        # Validate resource is available
        resource = serializer.validated_data['resource']
        if resource.status != 'AVAILABLE':
            raise serializers.ValidationError("Resource is not available")
        
        # Validate booking date is not in past
        booking_date = serializer.validated_data['booking_date']
        if booking_date < timezone.now().date():
            raise serializers.ValidationError("Booking date cannot be in the past")
        
        # Validate participants count
        participants = serializer.validated_data['participants_count']
        if participants > resource.capacity:
            raise serializers.ValidationError("Participants count exceeds resource capacity")
        
        # Check for double booking
        time_slot = serializer.validated_data['time_slot']
        existing = Booking.objects.filter(
            resource=resource,
            booking_date=booking_date,
            time_slot=time_slot,
            status__in=['PENDING', 'APPROVED']
        ).exists()
        
        if existing:
            raise serializers.ValidationError("Resource already booked for this time slot")
        
        # Auto-approve for STAFF
        status_value = 'APPROVED' if user.role == 'STAFF' else 'PENDING'
        serializer.save(user=user, status=status_value)
    
    @action(detail=False, methods=['get'])
    def my_bookings(self, request):
        bookings = Booking.objects.filter(user=request.user)
        serializer = self.get_serializer(bookings, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['patch'], permission_classes=[IsAuthenticated, IsAdmin])
    def approve(self, request, pk=None):
        booking = self.get_object()
        booking.status = 'APPROVED'
        booking.save()
        
        # Create audit log
        AuditLog.objects.create(
            action='APPROVE_BOOKING',
            entity_type='Booking',
            entity_id=booking.id,
            performed_by=request.user
        )
        
        return Response(BookingSerializer(booking).data)
    
    @action(detail=True, methods=['patch'], permission_classes=[IsAuthenticated, IsAdmin])
    def reject(self, request, pk=None):
        booking = self.get_object()
        booking.status = 'REJECTED'
        booking.save()
        
        # Create audit log
        AuditLog.objects.create(
            action='REJECT_BOOKING',
            entity_type='Booking',
            entity_id=booking.id,
            performed_by=request.user
        )
        
        return Response(BookingSerializer(booking).data)
    
    @action(detail=True, methods=['patch'])
    def cancel(self, request, pk=None):
        booking = self.get_object()
        
        # Validate ownership
        if booking.user != request.user and request.user.role != 'ADMIN':
            return Response(
                {"error": "Cannot cancel another user's booking"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Validate booking date
        if booking.booking_date <= timezone.now().date():
            return Response(
                {"error": "Cannot cancel booking on or after booking date"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        booking.status = 'CANCELLED'
        booking.save()
        
        return Response(BookingSerializer(booking).data)
