from rest_framework import viewsets, status, filters, serializers
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.utils import timezone
from django.db.models import Count, Q
from django_filters.rest_framework import DjangoFilterBackend

from .models import User, Resource, Booking
from .serializers import (
    RegisterSerializer, UserSerializer,
    ResourceSerializer, BookingSerializer, 
    BookingCreateSerializer, BookingApproveSerializer, BookingRejectSerializer
)
from .permissions import IsStudent, IsStaff, IsAdmin, IsStaffOrAdmin, IsOwnerOrStaff


# ==================== AUTHENTICATION VIEWS ====================

@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    """
    Register new user (STUDENT or STAFF only)
    POST /api/register/
    """
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'message': 'Registration successful',
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'id': user.id,
                'name': f"{user.first_name} {user.last_name}".strip() or user.username,
                'email': user.email,
                'role': user.role,
            }
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """
    Login user
    POST /api/login/
    Returns: access token, refresh token, user role, user id
    """
    email = request.data.get('email')
    password = request.data.get('password')
    
    if not email or not password:
        return Response(
            {'error': 'Email and password are required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Find user by email
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response(
            {'error': 'Invalid credentials'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    # Check if user is active
    if user.status != 'ACTIVE':
        return Response(
            {'error': 'Account is inactive'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Authenticate
    user_auth = authenticate(username=user.username, password=password)
    if not user_auth:
        return Response(
            {'error': 'Invalid credentials'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    # Generate JWT tokens
    refresh = RefreshToken.for_user(user)
    
    return Response({
        'access': str(refresh.access_token),
        'refresh': str(refresh),
        'user_id': user.id,
        'role': user.role,
        'user': {
            'id': user.id,
            'name': f"{user.first_name} {user.last_name}".strip() or user.username,
            'email': user.email,
            'phone': user.phone,
            'role': user.role,
            'status': user.status,
        }
    })


# ==================== USER MANAGEMENT VIEWS ====================

class UserViewSet(viewsets.ModelViewSet):
    """
    User ViewSet - Admin can manage all users
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdmin]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['role', 'status']
    search_fields = ['username', 'email', 'first_name', 'last_name']
    ordering_fields = ['id', 'username', 'email', 'role', 'date_joined']
    ordering = ['-id']
    
    def create(self, request, *args, **kwargs):
        """Create new user (ADMIN only)"""
        data = request.data
        
        # Validate required fields
        required_fields = ['username', 'email', 'password', 'role']
        for field in required_fields:
            if not data.get(field):
                return Response(
                    {'error': f'{field} is required'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        # Check if username or email already exists
        if User.objects.filter(username=data['username']).exists():
            return Response(
                {'error': 'Username already exists'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if User.objects.filter(email=data['email']).exists():
            return Response(
                {'error': 'Email already exists'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validate role
        if data['role'] not in ['STUDENT', 'STAFF', 'ADMIN']:
            return Response(
                {'error': 'Role must be STUDENT, STAFF, or ADMIN'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create user
        user = User.objects.create_user(
            username=data['username'],
            email=data['email'],
            password=data['password'],
            first_name=data.get('first_name', ''),
            last_name=data.get('last_name', ''),
            phone=data.get('phone', ''),
            role=data['role'],
            status=data.get('status', 'ACTIVE'),
            is_staff=data['role'] in ['STAFF', 'ADMIN'],
            is_superuser=data['role'] == 'ADMIN'
        )
        
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def destroy(self, request, *args, **kwargs):
        """Delete user (ADMIN only) - also deletes associated bookings"""
        user = self.get_object()
        
        # Prevent deleting yourself
        if user.id == request.user.id:
            return Response(
                {'error': 'You cannot delete your own account'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if user has bookings
        booking_count = Booking.objects.filter(user=user).count()
        
        if booking_count > 0:
            # Delete all bookings for this user first
            Booking.objects.filter(user=user).delete()
        
        # Delete the user
        username = user.username
        email = user.email
        user.delete()
        
        return Response({
            'message': f'User "{username}" ({email}) deleted successfully',
            'bookings_deleted': booking_count
        }, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['patch'], url_path='update-status')
    def update_status(self, request, pk=None):
        """Update user status (ADMIN only)"""
        user = self.get_object()
        new_status = request.data.get('status')
        
        if not new_status:
            return Response(
                {'error': 'Status is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if new_status not in ['ACTIVE', 'INACTIVE']:
            return Response(
                {'error': 'Status must be ACTIVE or INACTIVE'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        old_status = user.status
        user.status = new_status
        user.save()
        
        return Response({
            'message': f'User status updated from {old_status} to {new_status}',
            'user_id': user.id,
            'username': user.username,
            'email': user.email,
            'old_status': old_status,
            'new_status': new_status
        })


# ==================== RESOURCE VIEWS ====================

class ResourceViewSet(viewsets.ModelViewSet):
    """
    Resource ViewSet - All authenticated users can view
    Admin can perform full CRUD operations
    Staff can update resource availability
    GET /api/resources/
    """
    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['type', 'status']
    search_fields = ['name']
    
    def get_permissions(self):
        """Set permissions based on action"""
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            # Only ADMIN can create, update, or delete resources
            return [IsAdmin()]
        elif self.action == 'update_availability':
            # STAFF and ADMIN can update availability
            return [IsStaffOrAdmin()]
        # All authenticated users can view
        return [IsAuthenticated()]
    
    def get_queryset(self):
        """Filter resources based on user role"""
        user = self.request.user
        
        # Staff and Admin see all resources
        if user.role in ['STAFF', 'ADMIN']:
            return Resource.objects.all()
        
        # Students see only available resources
        return Resource.objects.filter(status='AVAILABLE')
    
    def destroy(self, request, *args, **kwargs):
        """Delete resource (ADMIN only) - also deletes associated bookings"""
        resource = self.get_object()
        
        # Check if resource has bookings
        booking_count = Booking.objects.filter(resource=resource).count()
        
        if booking_count > 0:
            # Delete all bookings for this resource first
            Booking.objects.filter(resource=resource).delete()
        
        # Now delete the resource
        resource_name = resource.name
        resource.delete()
        
        return Response({
            'message': f'Resource "{resource_name}" deleted successfully',
            'bookings_deleted': booking_count
        }, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['patch'], permission_classes=[IsStaffOrAdmin], url_path='update-availability')
    def update_availability(self, request, pk=None):
        """
        Update resource availability status (STAFF only)
        PATCH /api/resources/{id}/update-availability/
        Body: {"status": "AVAILABLE" or "UNAVAILABLE"}
        """
        resource = self.get_object()
        new_status = request.data.get('status')
        
        if not new_status:
            return Response(
                {'error': 'Status is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if new_status not in ['AVAILABLE', 'UNAVAILABLE']:
            return Response(
                {'error': 'Status must be AVAILABLE or UNAVAILABLE'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        old_status = resource.status
        resource.status = new_status
        resource.save()
        
        return Response({
            'message': f'Resource availability updated from {old_status} to {new_status}',
            'resource_id': resource.id,
            'resource_name': resource.name,
            'old_status': old_status,
            'new_status': new_status,
            'updated_by': request.user.email
        })
    
    @action(detail=True, methods=['get'], url_path='availability')
    def check_availability(self, request, pk=None):
        """
        Check resource availability by date and time
        GET /api/resources/{id}/availability/?date=YYYY-MM-DD&time_slot=HH:MM-HH:MM
        """
        resource = self.get_object()
        booking_date = request.query_params.get('date')
        time_slot = request.query_params.get('time_slot')
        
        if not booking_date:
            return Response(
                {'error': 'Date parameter is required (format: YYYY-MM-DD)'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not time_slot:
            return Response(
                {'error': 'Time slot parameter is required (format: HH:MM-HH:MM)'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if resource is available
        if resource.status != 'AVAILABLE':
            return Response({
                'available': False,
                'resource_id': resource.id,
                'resource_name': resource.name,
                'date': booking_date,
                'time_slot': time_slot,
                'reason': 'Resource is currently unavailable'
            })
        
        # Check for existing bookings
        existing_booking = Booking.objects.filter(
            resource=resource,
            booking_date=booking_date,
            time_slot=time_slot
        ).exclude(status='REJECTED').first()
        
        if existing_booking:
            return Response({
                'available': False,
                'resource_id': resource.id,
                'resource_name': resource.name,
                'date': booking_date,
                'time_slot': time_slot,
                'reason': 'Time slot already booked',
                'booking_status': existing_booking.status
            })
        
        return Response({
            'available': True,
            'resource_id': resource.id,
            'resource_name': resource.name,
            'resource_type': resource.type,
            'capacity': resource.capacity,
            'date': booking_date,
            'time_slot': time_slot,
            'message': 'Resource is available for booking'
        })
    
    @action(detail=False, methods=['get'], url_path='available-slots')
    def available_slots(self, request):
        """
        Get all available time slots for a specific date
        GET /api/resources/available-slots/?date=YYYY-MM-DD&resource_id=1
        """
        booking_date = request.query_params.get('date')
        resource_id = request.query_params.get('resource_id')
        
        if not booking_date:
            return Response(
                {'error': 'Date parameter is required (format: YYYY-MM-DD)'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Common time slots
        common_slots = [
            '08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00',
            '12:00-13:00', '13:00-14:00', '14:00-15:00', '15:00-16:00',
            '16:00-17:00', '17:00-18:00'
        ]
        
        if resource_id:
            # Check availability for specific resource
            try:
                resource = Resource.objects.get(id=resource_id, status='AVAILABLE')
            except Resource.DoesNotExist:
                return Response(
                    {'error': 'Resource not found or unavailable'},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # Get booked slots
            booked_slots = Booking.objects.filter(
                resource=resource,
                booking_date=booking_date
            ).exclude(status='REJECTED').values_list('time_slot', flat=True)
            
            available_slots = [slot for slot in common_slots if slot not in booked_slots]
            
            return Response({
                'resource_id': resource.id,
                'resource_name': resource.name,
                'date': booking_date,
                'available_slots': available_slots,
                'booked_slots': list(booked_slots)
            })
        else:
            # Get availability for all resources
            resources = Resource.objects.filter(status='AVAILABLE')
            availability_data = []
            
            for resource in resources:
                booked_slots = Booking.objects.filter(
                    resource=resource,
                    booking_date=booking_date
                ).exclude(status='REJECTED').values_list('time_slot', flat=True)
                
                available_slots = [slot for slot in common_slots if slot not in booked_slots]
                
                availability_data.append({
                    'resource_id': resource.id,
                    'resource_name': resource.name,
                    'resource_type': resource.type,
                    'capacity': resource.capacity,
                    'available_slots': available_slots,
                    'total_available': len(available_slots)
                })
            
            return Response({
                'date': booking_date,
                'resources': availability_data
            })


# ==================== BOOKING VIEWS ====================

class BookingViewSet(viewsets.ModelViewSet):
    """
    Booking ViewSet with role-based permissions
    """
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['status', 'booking_date', 'resource']
    ordering_fields = ['booking_date', 'created_at']
    ordering = ['-id']
    
    def get_permissions(self):
        """Set permissions based on action"""
        if self.action == 'create':
            return [IsAuthenticated()]  # Both STUDENT and STAFF can create
        elif self.action in ['update', 'partial_update']:
            return [IsAuthenticated()]  # Users can update their own bookings
        elif self.action in ['approve', 'reject']:
            return [IsStaffOrAdmin()]  # STAFF and ADMIN can approve/reject
        elif self.action == 'cancel':
            return [IsStudent()]
        elif self.action == 'my_bookings':
            return [IsStudent()]
        elif self.action in ['list', 'retrieve']:
            return [IsAuthenticated()]
        return [IsAuthenticated()]
    
    def get_queryset(self):
        """Filter bookings based on user role"""
        user = self.request.user
        
        if user.role == 'STUDENT':
            # Students see only their bookings
            return Booking.objects.filter(user=user)
        elif user.role in ['STAFF', 'ADMIN']:
            # Staff and Admin see all bookings
            return Booking.objects.all()
        
        return Booking.objects.none()
    
    def get_serializer_class(self):
        """Use different serializers for different actions"""
        if self.action == 'create':
            return BookingCreateSerializer
        elif self.action == 'approve':
            return BookingApproveSerializer
        elif self.action == 'reject':
            return BookingRejectSerializer
        return BookingSerializer
    
    def create(self, request, *args, **kwargs):
        """Create booking (STUDENT and STAFF)"""
        serializer = self.get_serializer(data=request.data)
        
        try:
            serializer.is_valid(raise_exception=True)
        except serializers.ValidationError as e:
            # Check if it's a capacity error with suggestions
            if isinstance(e.detail, dict) and e.detail.get('capacity_exceeded'):
                return Response({
                    'error': 'Capacity exceeded',
                    'message': e.detail.get('message'),
                    'suggested_resources': e.detail.get('suggested_resources', [])
                }, status=status.HTTP_400_BAD_REQUEST)
            raise
        
        # Set user to current user
        booking = serializer.save(user=request.user)
        
        # Staff bookings are now PENDING (not auto-approved)
        # Admin must approve all bookings
        
        # Return full booking data
        response_serializer = BookingSerializer(booking)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)
    
    def update(self, request, *args, **kwargs):
        """Update booking (only PENDING bookings by owner)"""
        booking = self.get_object()
        
        # Check if booking belongs to user
        if booking.user != request.user:
            return Response(
                {'error': 'You can only update your own bookings'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Check if booking is pending
        if booking.status != 'PENDING':
            return Response(
                {'error': 'Only pending bookings can be updated'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Use BookingCreateSerializer for validation
        serializer = BookingCreateSerializer(booking, data=request.data, partial=kwargs.get('partial', False))
        
        try:
            serializer.is_valid(raise_exception=True)
        except serializers.ValidationError as e:
            # Check if it's a capacity error with suggestions
            if isinstance(e.detail, dict) and e.detail.get('capacity_exceeded'):
                return Response({
                    'error': 'Capacity exceeded',
                    'message': e.detail.get('message'),
                    'suggested_resources': e.detail.get('suggested_resources', [])
                }, status=status.HTTP_400_BAD_REQUEST)
            raise
        
        # Save the updated booking
        updated_booking = serializer.save()
        
        # Return full booking data
        response_serializer = BookingSerializer(updated_booking)
        return Response(response_serializer.data)
    
    def partial_update(self, request, *args, **kwargs):
        """Partial update booking"""
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)
    
    @action(detail=False, methods=['get'], url_path='my')
    def my_bookings(self, request):
        """Get current user's bookings (STUDENT only)"""
        bookings = Booking.objects.filter(user=request.user)
        
        # Apply filters
        status_filter = request.query_params.get('status')
        if status_filter:
            bookings = bookings.filter(status=status_filter)
        
        page = self.paginate_queryset(bookings)
        if page is not None:
            serializer = BookingSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = BookingSerializer(bookings, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['put'], url_path='approve')
    def approve(self, request, pk=None):
        """Approve booking (STAFF and ADMIN)"""
        booking = self.get_object()
        
        if booking.status != 'PENDING':
            return Response(
                {'error': 'Only pending bookings can be approved'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        booking.status = 'APPROVED'
        booking.approved_by = request.user
        booking.approved_at = timezone.now()
        booking.remarks = serializer.validated_data.get('remarks', '')
        booking.save()
        
        response_serializer = BookingSerializer(booking)
        return Response(response_serializer.data)
    
    @action(detail=True, methods=['put'], url_path='reject')
    def reject(self, request, pk=None):
        """Reject booking with remarks (STAFF and ADMIN)"""
        booking = self.get_object()
        
        if booking.status != 'PENDING':
            return Response(
                {'error': 'Only pending bookings can be rejected'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        booking.status = 'REJECTED'
        booking.approved_by = request.user
        booking.approved_at = timezone.now()
        booking.remarks = serializer.validated_data['remarks']
        booking.save()
        
        response_serializer = BookingSerializer(booking)
        return Response(response_serializer.data)
    
    @action(detail=True, methods=['put'], url_path='cancel')
    def cancel(self, request, pk=None):
        """Cancel booking (STUDENT only, PENDING status only)"""
        booking = self.get_object()
        
        # Check if booking belongs to user
        if booking.user != request.user:
            return Response(
                {'error': 'You can only cancel your own bookings'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Check if booking is pending
        if booking.status != 'PENDING':
            return Response(
                {'error': 'Only pending bookings can be cancelled'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        booking.status = 'REJECTED'
        booking.cancelled_at = timezone.now()
        booking.remarks = 'Cancelled by student'
        booking.save()
        
        response_serializer = BookingSerializer(booking)
        return Response(response_serializer.data)


# ==================== DASHBOARD VIEWS ====================

@api_view(['GET'])
@permission_classes([IsStaff])
def dashboard_stats(request):
    """
    Get booking statistics (STAFF only)
    GET /api/dashboard/stats/
    """
    # Total bookings
    total_bookings = Booking.objects.count()
    
    # Pending bookings
    pending_bookings = Booking.objects.filter(status='PENDING').count()
    
    # Approved bookings
    approved_bookings = Booking.objects.filter(status='APPROVED').count()
    
    # Most used resource
    most_used = Booking.objects.values('resource__name').annotate(
        count=Count('id')
    ).order_by('-count').first()
    
    most_used_resource = most_used['resource__name'] if most_used else 'N/A'
    most_used_count = most_used['count'] if most_used else 0
    
    return Response({
        'total_bookings': total_bookings,
        'pending_bookings': pending_bookings,
        'approved_bookings': approved_bookings,
        'most_used_resource': most_used_resource,
        'most_used_count': most_used_count,
    })
