# Requirements Document

## Introduction

This document specifies the requirements for a Campus Resource Management System backend. The system provides a RESTful API for managing campus resources (labs, classrooms, event halls, computers) with role-based access control, booking management, and business logic enforcement. The backend follows clean layered architecture (Controller → Service → Repository → Database) and integrates with an existing React frontend.

## Glossary

- **System**: The Campus Resource Management System backend
- **User**: A registered person with one of three roles (ADMIN, STAFF, STUDENT)
- **Resource**: A bookable campus facility (Lab, Classroom, Event Hall, or Computer)
- **Booking**: A reservation of a Resource by a User for a specific date and time slot
- **JWT**: JSON Web Token used for authentication
- **Active_User**: A User with status = ACTIVE
- **Available_Resource**: A Resource with status = AVAILABLE
- **Time_Slot**: A specific time period for a booking (format to be defined in design)
- **Double_Booking**: Two or more bookings for the same Resource, date, and time slot with status PENDING or APPROVED
- **Audit_Log**: A record tracking administrative actions on bookings and resources

## Requirements

### Requirement 1: User Authentication

**User Story:** As a user, I want to authenticate with the system using JWT tokens, so that I can securely access protected endpoints.

#### Acceptance Criteria

1. WHEN a user provides valid credentials to the login endpoint, THE System SHALL generate and return a JWT token
2. WHEN a user provides invalid credentials to the login endpoint, THE System SHALL return an authentication error
3. WHEN a user accesses a protected endpoint with a valid JWT token, THE System SHALL allow the request to proceed
4. WHEN a user accesses a protected endpoint without a JWT token, THE System SHALL return a 401 Unauthorized error
5. WHEN a user accesses a protected endpoint with an expired or invalid JWT token, THE System SHALL return a 401 Unauthorized error
6. THE System SHALL hash all passwords before storing them in the database

### Requirement 2: Role-Based Access Control

**User Story:** As a system administrator, I want role-based access control, so that users can only perform actions appropriate to their role.

#### Acceptance Criteria

1. WHEN an ADMIN user attempts any operation, THE System SHALL allow the operation to proceed
2. WHEN a STAFF user attempts to create or view bookings, THE System SHALL allow the operation to proceed
3. WHEN a STAFF user attempts to view resources, THE System SHALL allow the operation to proceed
4. WHEN a STUDENT user attempts to create bookings for themselves, THE System SHALL allow the operation to proceed
5. WHEN a STUDENT user attempts to view their own bookings, THE System SHALL allow the operation to proceed
6. WHEN a STUDENT user attempts to view resources, THE System SHALL allow the operation to proceed
7. WHEN a non-ADMIN user attempts an ADMIN-only operation, THE System SHALL return a 403 Forbidden error

### Requirement 3: User Management

**User Story:** As an administrator, I want to manage user accounts, so that I can control who has access to the system.

#### Acceptance Criteria

1. WHEN an ADMIN creates a new user with valid data, THE System SHALL create the user account with a hashed password
2. WHEN an ADMIN creates a new user with a duplicate email, THE System SHALL return a 409 Conflict error
3. WHEN an ADMIN creates a new user with missing required fields (name or email), THE System SHALL return a 400 validation error
4. WHEN an ADMIN retrieves the user list, THE System SHALL return all users including their id, name, email, phone, role, status, and createdAt
5. WHEN an ADMIN updates a user with valid data, THE System SHALL update the user information
6. WHEN an ADMIN deactivates a user, THE System SHALL set the user status to INACTIVE
7. WHEN a deactivated user attempts to create a booking, THE System SHALL reject the booking with an appropriate error

### Requirement 4: Resource Management

**User Story:** As an administrator, I want to manage campus resources, so that users can book available facilities.

#### Acceptance Criteria

1. WHEN an ADMIN creates a resource with valid data, THE System SHALL create the resource with status AVAILABLE
2. WHEN an ADMIN creates a resource with capacity less than or equal to 0, THE System SHALL return a 400 validation error
3. WHEN an ADMIN creates a resource with missing required fields (name or type), THE System SHALL return a 400 validation error
4. WHEN any authenticated user retrieves the resource list, THE System SHALL return all resources with their details
5. WHEN any authenticated user retrieves a specific resource by id, THE System SHALL return the resource details if it exists
6. WHEN any authenticated user retrieves a non-existent resource, THE System SHALL return a 404 Not Found error
7. WHEN an ADMIN updates a resource with valid data, THE System SHALL update the resource information
8. WHEN a user attempts to book a resource with status MAINTENANCE or BLOCKED, THE System SHALL reject the booking

### Requirement 5: Booking Creation and Validation

**User Story:** As a user, I want to create bookings for campus resources, so that I can reserve facilities for my needs.

#### Acceptance Criteria

1. WHEN a user creates a booking with valid data, THE System SHALL verify the user exists and has status ACTIVE
2. WHEN a user creates a booking with valid data, THE System SHALL verify the resource exists and has status AVAILABLE
3. WHEN a user creates a booking with a past date, THE System SHALL return a 400 validation error
4. WHEN a user creates a booking with participantsCount exceeding resource capacity, THE System SHALL return a 400 validation error
5. WHEN a user creates a booking for an already-booked time slot, THE System SHALL return a 409 Conflict error
6. WHEN a STAFF user creates a booking with valid data, THE System SHALL create the booking with status APPROVED
7. WHEN a STUDENT user creates a booking with valid data, THE System SHALL create the booking with status PENDING
8. WHEN a user creates a booking referencing a non-existent user, THE System SHALL return a 404 Not Found error
9. WHEN a user creates a booking referencing a non-existent resource, THE System SHALL return a 404 Not Found error
10. WHEN a user creates a booking referencing an INACTIVE user, THE System SHALL reject the booking with an appropriate error

### Requirement 6: Booking Retrieval

**User Story:** As a user, I want to view bookings, so that I can see reservation information based on my role.

#### Acceptance Criteria

1. WHEN an ADMIN retrieves all bookings, THE System SHALL return all bookings in the system
2. WHEN a STAFF user retrieves their own bookings, THE System SHALL return only bookings created by that STAFF user
3. WHEN a STUDENT user retrieves their own bookings, THE System SHALL return only bookings created by that STUDENT user
4. WHEN a non-ADMIN user attempts to retrieve all bookings, THE System SHALL return a 403 Forbidden error

### Requirement 7: Booking Approval and Rejection

**User Story:** As an administrator, I want to approve or reject pending bookings, so that I can manage resource allocation.

#### Acceptance Criteria

1. WHEN an ADMIN approves a booking with status PENDING, THE System SHALL update the booking status to APPROVED
2. WHEN an ADMIN rejects a booking with status PENDING, THE System SHALL update the booking status to REJECTED
3. WHEN an ADMIN attempts to approve a non-existent booking, THE System SHALL return a 404 Not Found error
4. WHEN a non-ADMIN user attempts to approve or reject a booking, THE System SHALL return a 403 Forbidden error

### Requirement 8: Booking Cancellation

**User Story:** As a user, I want to cancel my bookings, so that I can free up resources I no longer need.

#### Acceptance Criteria

1. WHEN a user cancels their own booking before the booking date, THE System SHALL update the booking status to CANCELLED
2. WHEN a user attempts to cancel another user's booking, THE System SHALL return a 403 Forbidden error
3. WHEN a user attempts to cancel a booking on or after the booking date, THE System SHALL return a 400 validation error
4. WHEN a user attempts to cancel a non-existent booking, THE System SHALL return a 404 Not Found error

### Requirement 9: Database Integrity

**User Story:** As a system architect, I want proper database relationships and constraints, so that data integrity is maintained.

#### Acceptance Criteria

1. WHEN a booking is created, THE System SHALL enforce foreign key constraints linking to valid User and Resource records
2. WHEN the database stores bookings, THE System SHALL enforce a unique constraint on (resource_id, booking_date, time_slot) for bookings with status PENDING or APPROVED
3. WHEN a user is referenced by bookings, THE System SHALL prevent deletion of the user record
4. WHEN a resource is referenced by bookings, THE System SHALL prevent deletion of the resource record

### Requirement 10: Error Handling and Validation

**User Story:** As a developer, I want structured error responses, so that the frontend can handle errors appropriately.

#### Acceptance Criteria

1. WHEN validation fails, THE System SHALL return a 400 Bad Request error with details about the validation failure
2. WHEN authentication fails, THE System SHALL return a 401 Unauthorized error
3. WHEN authorization fails, THE System SHALL return a 403 Forbidden error
4. WHEN a requested resource is not found, THE System SHALL return a 404 Not Found error
5. WHEN a conflict occurs (duplicate email or double booking), THE System SHALL return a 409 Conflict error with details about the conflict
6. THE System SHALL return error responses in a consistent JSON format

### Requirement 11: Audit Logging

**User Story:** As an administrator, I want to track administrative actions, so that I can maintain an audit trail of system changes.

#### Acceptance Criteria

1. WHEN an ADMIN approves a booking, THE System SHALL create an audit log entry recording the action, entity type, entity id, performer, and timestamp
2. WHEN an ADMIN rejects a booking, THE System SHALL create an audit log entry recording the action, entity type, entity id, performer, and timestamp
3. WHEN an ADMIN updates a resource, THE System SHALL create an audit log entry recording the action, entity type, entity id, performer, and timestamp
4. THE System SHALL persist all audit log entries to the database

### Requirement 12: Frontend Integration

**User Story:** As a frontend developer, I want the backend API to match frontend expectations, so that integration is seamless.

#### Acceptance Criteria

1. THE System SHALL configure CORS to allow requests from the frontend development server
2. THE System SHALL provide API endpoints matching the contracts expected by the React frontend
3. THE System SHALL return response data in JSON format compatible with frontend data models
4. THE System SHALL include appropriate HTTP status codes that the frontend can handle

### Requirement 13: API Documentation

**User Story:** As a developer, I want comprehensive API documentation, so that I can understand how to use the system.

#### Acceptance Criteria

1. THE System SHALL provide a Postman collection containing all API endpoints
2. THE System SHALL include a README file with setup instructions
3. THE System SHALL document all request and response formats
4. THE System SHALL document all error codes and their meanings
