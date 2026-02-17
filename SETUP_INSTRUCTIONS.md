# Campus Resource Management System - Setup Instructions

## Prerequisites
- Python 3.12+ installed
- Node.js 18+ installed
- Git installed

## Backend Setup

### 1. Install Python Dependencies

```cmd
cd Backend
pip install -r requirements.txt
```

### 2. Setup Database

```cmd
cd myproject
python manage.py makemigrations
python manage.py migrate
```

### 3. Create Admin User

```cmd
python manage.py createsuperuser
```

Follow the prompts to create an admin account.

### 4. Run Backend Server

```cmd
python manage.py runserver
```

Backend will run on: http://localhost:8000

**API Endpoints:**
- Login: POST http://localhost:8000/api/auth/login/
- Users: http://localhost:8000/api/users/
- Resources: http://localhost:8000/api/resources/
- Bookings: http://localhost:8000/api/bookings/

## Frontend Setup

### 1. Install Dependencies

Open a new terminal:

```cmd
cd Frontend
npm install
```

### 2. Run Frontend Server

```cmd
npm run dev
```

Frontend will run on: http://localhost:5173

## Testing the Connection

### 1. Test Backend API

Visit: http://localhost:8000/api/resources/

You should see the Django REST Framework browsable API.

### 2. Test Login

Use the admin credentials you created to login through the frontend.

### 3. Create Test Data

Through Django admin (http://localhost:8000/admin/):
1. Create some resources (labs, classrooms)
2. Create additional users with different roles (ADMIN, STAFF, STUDENT)

## Database Structure

The system uses SQLite by default (db.sqlite3 in Backend/myproject/).

**Tables:**
- users (custom user model with roles)
- resources (campus facilities)
- bookings (reservations)
- audit_logs (admin action tracking)

## API Authentication

The system uses JWT (JSON Web Tokens) for authentication:

1. Login with username/password
2. Receive access_token and refresh_token
3. Include access_token in Authorization header: `Bearer <token>`
4. Token expires after 24 hours

## Troubleshooting

### CORS Errors
If you see CORS errors, ensure:
- Backend is running on port 8000
- Frontend is running on port 5173
- CORS settings in settings.py include both URLs

### Database Errors
If you get database errors:
```cmd
cd Backend/myproject
python manage.py makemigrations myapp
python manage.py migrate
```

### Module Not Found
If you get "module not found" errors:
```cmd
cd Backend
pip install -r requirements.txt
```

## Next Steps

1. Start both servers (backend and frontend)
2. Login with admin credentials
3. Create resources through the admin panel
4. Test booking functionality through the frontend
5. Test role-based access with different user types

## Quick Start Script

I've created `run_server.bat` in the root directory to quickly start the backend:

```cmd
run_server.bat
```

For frontend, use:
```cmd
cd Frontend
npm run dev
```
