export type UserRole = 'ADMIN' | 'STAFF' | 'STUDENT';
export type UserStatus = 'ACTIVE' | 'INACTIVE';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
}

export type ResourceType = 'Lab' | 'Classroom' | 'Event Hall' | 'Computer';
export type ResourceStatus = 'AVAILABLE' | 'MAINTENANCE' | 'BLOCKED';

export interface Resource {
  id: string;
  name: string;
  type: ResourceType;
  capacity: number;
  status: ResourceStatus;
  createdAt: string;
}

export type BookingStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

export interface Booking {
  id: string;
  userId: string;
  userName: string;
  resourceId: string;
  resourceName: string;
  bookingDate: string;
  timeSlot: string;
  participantsCount: number;
  status: BookingStatus;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
}

export type Page =
'LOGIN' |
'DASHBOARD' // Redirects based on role
| 'MANAGE_USERS' |
'MANAGE_RESOURCES' |
'BOOKING_APPROVALS' |
'BOOKING_HISTORY' |
'VIEW_RESOURCES' |
'CREATE_BOOKING' |
'MY_BOOKINGS';