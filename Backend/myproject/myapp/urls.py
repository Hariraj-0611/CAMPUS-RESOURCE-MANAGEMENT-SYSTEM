from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

# Create router for ViewSets
router = DefaultRouter()
router.register(r'users', views.UserViewSet, basename='user')
router.register(r'resources', views.ResourceViewSet, basename='resource')
router.register(r'bookings', views.BookingViewSet, basename='booking')

urlpatterns = [
    # Authentication endpoints
    path('register/', views.register_view, name='register'),
    path('login/', views.login_view, name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Dashboard endpoint
    path('dashboard/stats/', views.dashboard_stats, name='dashboard-stats'),
    
    # Include router URLs
    path('', include(router.urls)),
]
