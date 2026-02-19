from myapp.models import User

# Admin credentials
admin_email = 'admin@campus.edu'
admin_username = 'admin'
admin_password = 'admin123'

# Check if admin exists
if User.objects.filter(email=admin_email).exists():
    print(f"Admin already exists: {admin_email}")
    admin = User.objects.get(email=admin_email)
else:
    # Create admin
    admin = User.objects.create_user(
        username=admin_username,
        email=admin_email,
        password=admin_password,
        first_name='Admin',
        last_name='User',
        role='ADMIN',
        status='ACTIVE',
        is_staff=True,
        is_superuser=True
    )
    print("✅ Admin user created successfully!")

print("\n📧 Admin Credentials:")
print(f"Email: {admin_email}")
print(f"Username: {admin_username}")
print(f"Password: {admin_password}")
print(f"Role: ADMIN")
