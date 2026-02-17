# Implementation Plan: Campus Resource Management System Backend

## Overview

This implementation plan breaks down the Campus Resource Management System backend into discrete coding tasks. The system will be built using Python with FastAPI framework, following clean layered architecture (Controller → Service → Repository → Database). We'll use SQLAlchemy for ORM, Pydantic for validation, and PyJWT for authentication. Property-based testing will use Hypothesis library.

## Technology Stack

- **Framework**: FastAPI (modern, fast, with automatic API documentation)
- **ORM**: SQLAlchemy (database abstraction and migrations)
- **Validation**: Pydantic (built into FastAPI)
- **Authentication**: PyJWT (JWT token generation and validation)
- **Database**: PostgreSQL (recommended) or SQLite (for development)
- **Testing**: pytest (unit tests) + Hypothesis (property-based tests)
- **Password Hashing**: passlib with bcrypt

## Tasks

- [ ] 1. Project setup and configuration
  - Create project structure with layered architecture folders (api/controllers, services, repositories, models, schemas)
  - Set up virtual environment and install dependencies (fastapi, uvicorn, sqlalchemy, pyjwt, passlib, pytest, hypothesis)
  - Create configuration file for environment variables (database URL, JWT secret, CORS origins)
  - Set up database connection and session management
  - Configure CORS middleware for frontend integration
  - _Requirements: 12.1_

- [ ] 2. Database models and schema
  - [ ] 2.1 Create User model
    - Define User entity with SQLAlchemy (id, name, email, hashed_password, phone, role, status, created_at)
    - Add unique constraint on email
    - Add enum types for UserRole and UserStatus
    - _Requirements: 3.1, 3.2_
  
  - [ ] 2.2 Create Resource model
    - Define Resource entity with SQLAlchemy (id, name, type, capacity, status, created_at)
    - Add enum types for ResourceType and ResourceStatus
    - Add check constraint for capacity > 0
    - _Requirements: 4.1, 4.2_
  
  - [ ] 2.3 Create Booking model
    - Define Booking entity with SQLAlchemy (id, user_id, resource_id, booking_date, time_slot, participants_count, status, created_at)
    - Add foreign key constraints to User and Resource
    - Add unique constraint on (resource_id, booking_date, time_slot) with partial index for PENDING/APPROVED statuses
    - Add enum type for BookingStatus
    - _Requirements: 5.1, 5.2, 5.5, 9.1, 9.2_
  
  - [ ] 2.4 Create AuditLog model (optional)
    - Define AuditLog entity with SQLAlchemy (id, action, entity_type, entity_id, performed_by, timestamp)
    - Add foreign key constraint to User
    - _Requirements: 11.1, 11.2, 11.3_
  
  - [ ] 2.5 Create database migration
    - Set up Alembic for database migrations
    - Generate initial migration with all models
    - Create database initialization script

- [ ] 3. Pydantic schemas and DTOs
  - [ ] 3.1 Create User schemas
    - Define UserCreate, UserUpdate, UserResponse schemas
    - Add validation for email format, required fields
    - _Requirements: 3.3, 3.4_
  
  - [ ] 3.2 Create Resource schemas
    - Define ResourceCreate, ResourceUpdate, ResourceResponse schemas
    - Add validation for capacity > 0, required fields
    - _Requirements: 4.2, 4.3_
  
  - [ ] 3.3 Create Booking schemas
    - Define BookingCreate, BookingResponse schemas
    - Add validation for date format, participants_count > 0
    - _Requirements: 5.3, 5.4_
  
  - [ ] 3.4 Create Auth schemas
    - Define LoginRequest, LoginResponse, TokenPayload schemas
    - _Requirements: 1.1_
  
  - [ ] 3.5 Create Error schemas
    - Define ErrorResponse schema with consistent structure
    - _Requirements: 10.6_

- [ ] 4. Repository layer implementation
  - [ ] 4.1 Create UserRepository
    - Implement find_by_id, find_by_email, exists_by_email, find_all, save methods
    - _Requirements: 3.1, 3.2, 3.4, 3.5, 3.6_
  
  - [ ] 4.2 Create ResourceRepository
    - Implement find_by_id, find_all, save methods
    - _Requirements: 4.1, 4.4, 4.5, 4.7_
  
  - [ ] 4.3 Create BookingRepository
    - Implement find_by_id, find_all, find_by_user_id, find_conflicting_booking, save methods
    - _Requirements: 5.5, 6.1, 6.2, 6.3_
  
  - [ ] 4.4 Create AuditLogRepository (optional)
    - Implement save, find_all methods
    - _Requirements: 11.4_

- [ ] 5. Authentication service implementation
  - [ ] 5.1 Implement password hashing utilities
    - Create hash_password and verify_password functions using passlib with bcrypt
    - _Requirements: 1.6_
  
  - [ ]*5.2 Write property test for password hashing
    - **Property 3: Password hashing invariant**
    - **Validates: Requirements 1.6, 3.1**
  
  - [ ] 5.3 Implement JWT token generation and verification
    - Create generate_jwt function with userId and role claims
    - Create verify_jwt function with expiration checking
    - _Requirements: 1.1, 1.3, 1.5_
  
  - [ ]* 5.4 Write property test for JWT token validity
    - **Property 1: Valid login generates valid JWT**
    - **Validates: Requirements 1.1, 1.3**
  
  - [ ] 5.5 Implement AuthService.login method
    - Verify user exists and status is ACTIVE
    - Verify password matches
    - Generate and return JWT token
    - _Requirements: 1.1, 1.2_
  
  - [ ]* 5.6 Write property test for authentication errors
    - **Property 2: Invalid credentials reject authentication**
    - **Validates: Requirements 1.2, 1.4, 1.5, 10.2**

- [ ] 6. Authentication middleware
  - [ ] 6.1 Create JWT authentication dependency
    - Extract and verify JWT from Authorization header
    - Return authenticated user context (userId, role)
    - Raise 401 for missing/invalid tokens
    - _Requirements: 1.4, 1.5_
  
  - [ ] 6.2 Create role-based authorization dependencies
    - Create require_admin, require_staff_or_admin, require_authenticated dependencies
    - Raise 403 for insufficient permissions
    - _Requirements: 2.1, 2.7_
  
  - [ ]* 6.3 Write property test for role-based authorization
    - **Property 5: Role-based operation authorization**
    - **Validates: Requirements 2.7, 6.4, 7.4, 8.2, 10.3**

- [ ] 7. User management service and endpoints
  - [ ] 7.1 Implement UserService
    - Implement create_user with email uniqueness check and password hashing
    - Implement get_all_users, update_user, deactivate_user methods
    - _Requirements: 3.1, 3.2, 3.5, 3.6_
  
  - [ ]* 7.2 Write property test for email uniqueness
    - **Property 9: Email uniqueness constraint**
    - **Validates: Requirements 3.2, 10.5**
  
  - [ ]* 7.3 Write property test for user deactivation
    - **Property 13: User deactivation effect**
    - **Validates: Requirements 3.6, 3.7, 5.1, 5.10**
  
  - [ ] 7.4 Create UserController endpoints
    - POST /users (admin only) - create user
    - GET /users (admin only) - list all users
    - PUT /users/{id} (admin only) - update user
    - PATCH /users/{id}/deactivate (admin only) - deactivate user
    - _Requirements: 3.1, 3.4, 3.5, 3.6_
  
  - [ ]* 7.5 Write unit tests for user management endpoints
    - Test specific user creation, update, deactivation scenarios
    - Test validation errors for missing fields
    - _Requirements: 3.3, 10.1_

- [ ] 8. Checkpoint - User management complete
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 9. Resource management service and endpoints
  - [ ] 9.1 Implement ResourceService
    - Implement create_resource with capacity validation
    - Implement get_all_resources, get_resource_by_id, update_resource methods
    - _Requirements: 4.1, 4.2, 4.4, 4.5, 4.7_
  
  - [ ]* 9.2 Write property test for capacity validation
    - **Property 14: Resource capacity validation**
    - **Validates: Requirements 4.2, 10.1**
  
  - [ ]* 9.3 Write property test for resource retrieval
    - **Property 17: Resource retrieval by ID**
    - **Validates: Requirements 4.5, 4.6, 10.4**
  
  - [ ] 9.4 Create ResourceController endpoints
    - POST /resources (admin only) - create resource
    - GET /resources (authenticated) - list all resources
    - GET /resources/{id} (authenticated) - get resource by id
    - PUT /resources/{id} (admin only) - update resource
    - _Requirements: 4.1, 4.4, 4.5, 4.7_
  
  - [ ]* 9.5 Write unit tests for resource management endpoints
    - Test specific resource creation, update scenarios
    - Test validation errors for invalid capacity and missing fields
    - _Requirements: 4.2, 4.3, 10.1_

- [ ] 10. Booking service core validation logic
  - [ ] 10.1 Implement booking validation helpers
    - Create validate_user_active function
    - Create validate_resource_available function
    - Create validate_booking_date_not_past function
    - Create validate_participants_within_capacity function
    - _Requirements: 5.1, 5.2, 5.3, 5.4_
  
  - [ ]* 10.2 Write property test for past date rejection
    - **Property 20: Past date rejection**
    - **Validates: Requirements 5.3, 10.1**
  
  - [ ]* 10.3 Write property test for capacity constraint
    - **Property 21: Capacity constraint enforcement**
    - **Validates: Requirements 5.4, 10.1**
  
  - [ ]* 10.4 Write property test for resource availability
    - **Property 18: Resource availability requirement for booking**
    - **Validates: Requirements 4.8, 5.2**

- [ ] 11. Booking service creation logic
  - [ ] 11.1 Implement BookingService.create_booking method
    - Validate user exists and is active
    - Validate resource exists and is available
    - Validate booking date is not in past
    - Validate participants count within capacity
    - Check for double booking conflicts
    - Determine status based on user role (STAFF → APPROVED, STUDENT → PENDING)
    - Save booking to database
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7_
  
  - [ ]* 11.2 Write property test for double booking prevention
    - **Property 22: Double booking prevention**
    - **Validates: Requirements 5.5, 9.2, 10.5**
  
  - [ ]* 11.3 Write property test for role-based auto-approval
    - **Property 23: Role-based auto-approval**
    - **Validates: Requirements 5.6, 5.7**
  
  - [ ]* 11.4 Write property test for foreign key validation
    - **Property 19: Booking foreign key validation**
    - **Validates: Requirements 5.8, 5.9, 9.1, 10.4**

- [ ] 12. Booking service retrieval and management
  - [ ] 12.1 Implement booking retrieval methods
    - Implement get_all_bookings (admin only)
    - Implement get_my_bookings (filtered by userId)
    - _Requirements: 6.1, 6.2, 6.3_
  
  - [ ]* 12.2 Write property test for booking isolation
    - **Property 8: User booking isolation**
    - **Validates: Requirements 6.2, 6.3**
  
  - [ ] 12.3 Implement booking approval and rejection
    - Implement approve_booking method
    - Implement reject_booking method
    - Create audit log entries for both actions
    - _Requirements: 7.1, 7.2, 11.1, 11.2_
  
  - [ ]* 12.4 Write property test for booking state transitions
    - **Property 25: Booking approval state transition**
    - **Property 26: Booking rejection state transition**
    - **Validates: Requirements 7.1, 7.2**
  
  - [ ] 12.5 Implement booking cancellation
    - Validate ownership (userId matches)
    - Validate booking date is in future
    - Update status to CANCELLED
    - _Requirements: 8.1, 8.2, 8.3_
  
  - [ ]* 12.6 Write property test for cancellation constraints
    - **Property 27: Booking cancellation ownership**
    - **Property 28: Booking cancellation time constraint**
    - **Property 29: Successful cancellation state transition**
    - **Validates: Requirements 8.1, 8.2, 8.3, 10.1, 10.3**

- [ ] 13. Booking controller endpoints
  - [ ] 13.1 Create booking endpoints
    - POST /bookings (authenticated) - create booking
    - GET /bookings (admin only) - get all bookings
    - GET /bookings/my (staff/student) - get own bookings
    - PATCH /bookings/{id}/approve (admin only) - approve booking
    - PATCH /bookings/{id}/reject (admin only) - reject booking
    - PATCH /bookings/{id}/cancel (owner only) - cancel booking
    - _Requirements: 5.1-5.10, 6.1-6.4, 7.1-7.4, 8.1-8.4_
  
  - [ ]* 13.2 Write unit tests for booking endpoints
    - Test specific booking creation scenarios
    - Test approval/rejection flows
    - Test cancellation scenarios
    - Test authorization for different roles

- [ ] 14. Checkpoint - Booking management complete
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 15. Authentication endpoints
  - [ ] 15.1 Create AuthController
    - POST /auth/login - authenticate and return JWT token
    - _Requirements: 1.1, 1.2_
  
  - [ ]* 15.2 Write unit tests for authentication
    - Test login with valid credentials
    - Test login with invalid credentials
    - Test login with inactive user

- [ ] 16. Error handling and response formatting
  - [ ] 16.1 Create global exception handlers
    - Handle ValidationException → 400 with error details
    - Handle UnauthorizedException → 401
    - Handle ForbiddenException → 403
    - Handle NotFoundException → 404
    - Handle ConflictException → 409
    - Handle generic exceptions → 500
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_
  
  - [ ]* 16.2 Write property test for error response format
    - **Property 30: Consistent error response format**
    - **Validates: Requirements 10.6**
  
  - [ ]* 16.3 Write unit tests for error scenarios
    - Test each error type returns correct status code
    - Test error responses include required fields

- [ ] 17. Audit logging implementation (optional)
  - [ ] 17.1 Implement AuditLogService
    - Implement log method to create audit entries
    - _Requirements: 11.1, 11.2, 11.3_
  
  - [ ]* 17.2 Write property test for audit trail
    - **Property 31: Admin action audit trail**
    - **Validates: Requirements 11.1, 11.2, 11.3**
  
  - [ ] 17.3 Integrate audit logging into booking service
    - Add audit log calls to approve_booking, reject_booking
    - Add audit log calls to resource update operations

- [ ] 18. Frontend integration validation
  - [ ] 18.1 Verify response data structures
    - Ensure User, Resource, Booking responses match frontend TypeScript interfaces
    - Test all required fields are present with correct types
    - _Requirements: 12.2, 12.3_
  
  - [ ]* 18.2 Write property test for response compatibility
    - **Property 32: Response data structure compatibility**
    - **Validates: Requirements 12.3**

- [ ] 19. API documentation and deployment preparation
  - [ ] 19.1 Configure FastAPI automatic documentation
    - Add descriptions and examples to all endpoints
    - Configure OpenAPI schema
    - Test Swagger UI at /docs
  
  - [ ] 19.2 Create Postman collection
    - Export all endpoints with example requests
    - Add environment variables for base URL and token
    - Include examples for success and error responses
    - _Requirements: 13.1_
  
  - [ ] 19.3 Create README documentation
    - Document prerequisites (Python 3.9+, PostgreSQL)
    - Document installation steps
    - Document environment variable configuration
    - Document database setup and migration commands
    - Document running the application
    - Document running tests
    - Include API endpoint overview
    - _Requirements: 13.2, 13.3, 13.4_
  
  - [ ] 19.4 Create environment configuration template
    - Create .env.example file with all required variables
    - Document each variable's purpose

- [ ] 20. Final checkpoint - Complete system validation
  - Ensure all tests pass (unit and property-based)
  - Verify all endpoints work with Postman collection
  - Test frontend integration with actual React app
  - Ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional property-based tests and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at major milestones
- Property tests should run minimum 100 iterations each
- All property tests must include comment tags: `# Feature: campus-resource-management-backend, Property N: [property text]`
- Database migrations should be created and tested before implementing services
- Authentication middleware should be completed before protected endpoints
- The optional audit logging feature (task 17) can be skipped if not needed
