import { User, Resource, Booking } from '../types';

// Mock Users
export const mockUsers: User[] = [
{
  id: '1',
  name: 'Admin User',
  email: 'admin@campus.edu',
  role: 'ADMIN',
  status: 'ACTIVE',
  createdAt: '2023-01-01',
  phone: '555-0101'
},
{
  id: '2',
  name: 'Staff Member',
  email: 'staff@campus.edu',
  role: 'STAFF',
  status: 'ACTIVE',
  createdAt: '2023-01-02',
  phone: '555-0102'
},
{
  id: '3',
  name: 'John Student',
  email: 'student@campus.edu',
  role: 'STUDENT',
  status: 'ACTIVE',
  createdAt: '2023-01-03',
  phone: '555-0103'
},
{
  id: '4',
  name: 'Jane Doe',
  email: 'jane@campus.edu',
  role: 'STUDENT',
  status: 'ACTIVE',
  createdAt: '2023-01-04',
  phone: '555-0104'
},
{
  id: '5',
  name: 'Prof. Smith',
  email: 'smith@campus.edu',
  role: 'STAFF',
  status: 'ACTIVE',
  createdAt: '2023-01-05',
  phone: '555-0105'
},
{
  id: '6',
  name: 'Inactive User',
  email: 'inactive@campus.edu',
  role: 'STUDENT',
  status: 'INACTIVE',
  createdAt: '2023-01-06',
  phone: '555-0106'
}];


// Mock Resources
export const mockResources: Resource[] = [
{
  id: '1',
  name: 'Computer Lab A',
  type: 'Lab',
  capacity: 30,
  status: 'AVAILABLE',
  createdAt: '2023-01-01'
},
{
  id: '2',
  name: 'Lecture Hall 101',
  type: 'Classroom',
  capacity: 100,
  status: 'AVAILABLE',
  createdAt: '2023-01-01'
},
{
  id: '3',
  name: 'Chemistry Lab',
  type: 'Lab',
  capacity: 25,
  status: 'MAINTENANCE',
  createdAt: '2023-01-01'
},
{
  id: '4',
  name: 'Main Auditorium',
  type: 'Event Hall',
  capacity: 500,
  status: 'AVAILABLE',
  createdAt: '2023-01-01'
},
{
  id: '5',
  name: 'Study Room B',
  type: 'Classroom',
  capacity: 10,
  status: 'BLOCKED',
  createdAt: '2023-01-01'
},
{
  id: '6',
  name: 'Mac Lab',
  type: 'Computer',
  capacity: 20,
  status: 'AVAILABLE',
  createdAt: '2023-01-01'
}];


// Mock Bookings
export const mockBookings: Booking[] = [
{
  id: '1',
  userId: '3',
  userName: 'John Student',
  resourceId: '1',
  resourceName: 'Computer Lab A',
  bookingDate: '2023-11-15',
  timeSlot: '10:00 - 12:00',
  participantsCount: 5,
  status: 'PENDING',
  createdAt: '2023-11-01'
},
{
  id: '2',
  userId: '2',
  userName: 'Staff Member',
  resourceId: '2',
  resourceName: 'Lecture Hall 101',
  bookingDate: '2023-11-16',
  timeSlot: '14:00 - 16:00',
  participantsCount: 50,
  status: 'APPROVED',
  createdAt: '2023-11-02'
},
{
  id: '3',
  userId: '4',
  userName: 'Jane Doe',
  resourceId: '6',
  resourceName: 'Mac Lab',
  bookingDate: '2023-11-17',
  timeSlot: '09:00 - 11:00',
  participantsCount: 2,
  status: 'REJECTED',
  createdAt: '2023-11-03'
},
{
  id: '4',
  userId: '5',
  userName: 'Prof. Smith',
  resourceId: '4',
  resourceName: 'Main Auditorium',
  bookingDate: '2023-11-20',
  timeSlot: '18:00 - 21:00',
  participantsCount: 200,
  status: 'APPROVED',
  createdAt: '2023-11-05'
},
{
  id: '5',
  userId: '3',
  userName: 'John Student',
  resourceId: '2',
  resourceName: 'Lecture Hall 101',
  bookingDate: '2023-11-21',
  timeSlot: '13:00 - 14:00',
  participantsCount: 10,
  status: 'CANCELLED',
  createdAt: '2023-11-06'
}];


// Helpers
export const getUsers = () => [...mockUsers];
export const getResources = () => [...mockResources];
export const getBookings = () => [...mockBookings];
export const getBookingsByUser = (userId: string) =>
mockBookings.filter((b) => b.userId === userId);
export const getPendingBookings = () =>
mockBookings.filter((b) => b.status === 'PENDING');