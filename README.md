# Campus Resource Management System

A full-stack web application for managing campus resources (labs, classrooms, event halls) with role-based access control and booking management.

## Features

- **User Management**: Admin can create and manage users with different roles (ADMIN, STAFF, STUDENT)
- **Resource Management**: Create and manage campus facilities
- **Booking System**: 
  - Students can request bookings (requires approval)
  - Staff bookings are auto-approved
  - Admins can approve/reject bookings
- **Role-Based Access Control**: Different permissions for ADMIN, STAFF, and STUDENT roles
- **Audit Logging**: Track administrative actions
- **JWT Authentication**: Secure token-based authentication

## Tech Stack

### Backend
- Django 6.0.2
- Django REST Framework
- JWT Authentication
- SQLite Database
- CORS enabled

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Lucide Icons

## Quick Start

### Option 1: Automated Setup (Recommended)

1. **Setup Backend:**
   ```cmd
   setup_backend.bat
   ```
   Follow the prompts to create an admin user.

2. **Setup Frontend:**
   ```cmd
   setup_frontend.bat
   ```

3. **Start Backend Server:**
   ```cmd
   run_server.bat
   ```

4. **Start Frontend Server (in new terminal):**
   ```cmd
   cd Frontend
   npm run dev
   ```

### Option 2: Manual Setup

See [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md) for detailed manual setup steps.

## Access Points

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000/api/
- **Django Admin**: http://localhost:8000/admin/
- **API Documentation**: http://localhost:8000/api/ (browsable API)

## API Endpoints

### Authentication
- `POST /api/auth/login/` - Login and get JWT token
- `POST /api/auth/refresh/` - Refresh JWT token

### Users (Admin only)
- `GET /api/users/` - List all users
- `POST /api/users/` - Create new user
- `PUT /api/users/{id}/` - Update user
- `PATCH /api/users/{id}/deactivate/` - Deactivate user

### Resources
- `GET /api/resources/` - List all resources (authenticated)
- `POST /api/resources/` - Create resource (admin only)
- `GET /api/resources/{id}/` - Get resource details
- `PUT /api/resources/{id}/` - Update resource (admin only)

### Bookings
- `GET /api/bookings/` - List all bookings (admin) or own bookings
- `POST /api/bookings/` - Create booking
- `GET /api/bookings/my_bookings/` - Get own bookings
- `PATCH /api/bookings/{id}/approve/` - Approve booking (admin only)
- `PATCH /api/bookings/{id}/reject/` - Reject booking (admin only)
- `PATCH /api/bookings/{id}/cancel/` - Cancel booking (owner only)

## User Roles

### ADMIN
- Full access to all features
- Manage users, resources, and bookings
- Approve/reject booking requests
- View audit logs

### STAFF
- Create bookings (auto-approved)
- View own bookings
- View all resources
- Cannot manage users or resources

### STUDENT
- Create booking requests (requires approval)
- View own bookings
- View all resources
- Cannot manage users or resources

## Business Rules

1. **User Management**
   - Email must be unique
   - Passwords are hashed before storage
   - Only ADMIN can create/deactivate users

2. **Resource Management**
   - Capacity must be greater than 0
   - Only ADMIN can create/update resources
   - Resources can be AVAILABLE, MAINTENANCE, or BLOCKED

3. **Booking Rules**
   - User must be ACTIVE to create bookings
   - Resource must be AVAILABLE
   - Booking date cannot be in the past
   - Participants count cannot exceed resource capacity
   - No double booking (same resource, date, time slot)
   - STAFF bookings are auto-approved
   - STUDENT bookings require admin approval
   - Users can only cancel their own bookings before the booking date

## Database Schema

```
users
├── id (PK)
├── username
├── email (unique)
├── password (hashed)
├── phone
├── role (ADMIN/STAFF/STUDENT)
├── status (ACTIVE/INACTIVE)
└── date_joined

resources
├── id (PK)
├── name
├── type (Lab/Classroom/Event Hall/Computer)
├── capacity
├── status (AVAILABLE/MAINTENANCE/BLOCKED)
└── created_at

bookings
├── id (PK)
├── user_id (FK → users)
├── resource_id (FK → resources)
├── booking_date
├── time_slot
├── participants_count
├── status (PENDING/APPROVED/REJECTED/CANCELLED)
└── created_at

audit_logs
├── id (PK)
├── action
├── entity_type
├── entity_id
├── performed_by (FK → users)
└── timestamp
```

## Frontend Integration

The frontend uses the API service located at `Frontend/src/services/api.ts`:

```typescript
import { authAPI, usersAPI, resourcesAPI, bookingsAPI } from './services/api';

// Login
await authAPI.login('username', 'password');

// Get resources
const resources = await resourcesAPI.getAll();

// Create booking
await bookingsAPI.create({
  resource: resourceId,
  booking_date: '2024-03-15',
  time_slot: '09:00-11:00',
  participants_count: 25
});
```

## Development

### Backend Development
```cmd
cd Backend/myproject
python manage.py runserver
```

### Frontend Development
```cmd
cd Frontend
npm run dev
```

### Create Migrations (after model changes)
```cmd
cd Backend/myproject
python manage.py makemigrations
python manage.py migrate
```

## Troubleshooting

### Backend won't start
- Ensure Python 3.12+ is installed
- Install dependencies: `pip install -r Backend/requirements.txt`
- Run migrations: `python manage.py migrate`

### Frontend won't start
- Ensure Node.js 18+ is installed
- Install dependencies: `npm install` in Frontend folder
- Clear cache: `npm cache clean --force`

### CORS errors
- Ensure backend is running on port 8000
- Ensure frontend is running on port 5173
- Check CORS settings in `Backend/myproject/myproject/settings.py`

### Database errors
- Delete `db.sqlite3` and run migrations again
- Ensure migrations are up to date

## Project Structure

```
.
├── Backend/
│   ├── myproject/
│   │   ├── myapp/          # Main application
│   │   │   ├── models.py   # Database models
│   │   │   ├── views.py    # API views
│   │   │   ├── serializers.py
│   │   │   ├── permissions.py
│   │   │   └── urls.py
│   │   ├── myproject/      # Project settings
│   │   │   ├── settings.py
│   │   │   └── urls.py
│   │   └── manage.py
│   └── requirements.txt
├── Frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service
│   │   └── types/          # TypeScript types
│   └── package.json
├── setup_backend.bat       # Backend setup script
├── setup_frontend.bat      # Frontend setup script
├── run_server.bat          # Quick start backend
└── README.md
```

## License

This project is for educational purposes.

## Support

For issues or questions, please refer to the SETUP_INSTRUCTIONS.md file.
