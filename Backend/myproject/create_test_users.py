"""
Create test users for the Campus Resource Management System
Run this script to create sample STUDENT and STAFF users
"""

import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproject.settings')
django.setup()

from myapp.models import User

def create_test_users():
    """Create test users for STUDENT and STAFF roles"""
    
    users = [
        {
            'username': 'student1',
            'email': 'student1@test.com',
            'password': 'password123',
            'first_name': 'John',
            'last_name': 'Student',
            'phone': '1234567890',
            'role': 'STUDENT'
        },
        {
            'username': 'student2',
            'email': 'student2@test.com',
            'password': 'password123',
            'first_name': 'Jane',
            'last_name': 'Student',
            'phone': '1234567891',
            'role': 'STUDENT'
        },
        {
            'username': 'staff1',
            'email': 'staff1@test.com',
            'password': 'password123',
            'first_name': 'Mike',
            'last_name': 'Staff',
            'phone': '1234567892',
            'role': 'STAFF'
        },
        {
            'username': 'staff2',
            'email': 'staff2@test.com',
            'password': 'password123',
            'first_name': 'Sarah',
            'last_name': 'Staff',
            'phone': '1234567893',
            'role': 'STAFF'
        }
    ]
    
    print("=" * 50)
    print("Creating Test Users")
    print("=" * 50)
    print()
    
    for user_data in users:
        email = user_data['email']
        
        # Check if user already exists
        if User.objects.filter(email=email).exists():
            print(f"⚠️  User already exists: {email}")
            continue
        
        # Create user
        user = User.objects.create_user(
            username=user_data['username'],
            email=user_data['email'],
            password=user_data['password'],
            first_name=user_data['first_name'],
            last_name=user_data['last_name'],
            phone=user_data.get('phone', ''),
            role=user_data['role'],
            status='ACTIVE',
            is_active=True
        )
        
        print(f"✅ Created: {user.email}")
        print(f"   Name: {user.get_full_name()}")
        print(f"   Role: {user.role}")
        print(f"   Password: {user_data['password']}")
        print()
    
    print("=" * 50)
    print("Test Users Summary")
    print("=" * 50)
    print()
    print("STUDENT ACCOUNTS:")
    print("-" * 50)
    for user in User.objects.filter(role='STUDENT'):
        print(f"Email: {user.email}")
        print(f"Name: {user.get_full_name()}")
        print(f"Password: password123")
        print()
    
    print("STAFF ACCOUNTS:")
    print("-" * 50)
    for user in User.objects.filter(role='STAFF'):
        print(f"Email: {user.email}")
        print(f"Name: {user.get_full_name()}")
        print(f"Password: password123")
        print()
    
    print("=" * 50)
    print(f"Total Users: {User.objects.count()}")
    print(f"Students: {User.objects.filter(role='STUDENT').count()}")
    print(f"Staff: {User.objects.filter(role='STAFF').count()}")
    print(f"Admins: {User.objects.filter(role='ADMIN').count()}")
    print("=" * 50)

if __name__ == '__main__':
    create_test_users()
