# 👥 Test Users

Test users have been created for easy testing of the Campus Resource Management System.

## 📋 Test Accounts

### 🎓 STUDENT Accounts

#### Student 1
- **Email:** student1@test.com
- **Password:** password123
- **Name:** John Student
- **Role:** STUDENT

#### Student 2
- **Email:** student2@test.com
- **Password:** password123
- **Name:** Jane Student
- **Role:** STUDENT

#### Student 3 (Existing)
- **Email:** hari@gmail.com
- **Password:** password123
- **Name:** HARIRAJ
- **Role:** STUDENT

---

### 👨‍🏫 STAFF Accounts

#### Staff 1
- **Email:** staff1@test.com
- **Password:** password123
- **Name:** Mike Staff
- **Role:** STAFF

#### Staff 2
- **Email:** staff2@test.com
- **Password:** password123
- **Name:** Sarah Staff
- **Role:** STAFF

#### Staff 3 (Existing)
- **Email:** raj@gmail.com
- **Password:** password123
- **Name:** HARIRAJ
- **Role:** STAFF

---

### 👑 ADMIN Account

#### Admin (Existing)
- **Email:** admin@test.com (or superuser email)
- **Password:** (your superuser password)
- **Role:** ADMIN
- **Access:** Django Admin Panel at http://localhost:8000/admin

---

## 🧪 Testing Scenarios

### Scenario 1: Student Creates Booking

1. **Login as Student:**
   - Email: student1@test.com
   - Password: password123

2. **Create Booking:**
   - Click "Book Resource"
   - Select a resource (e.g., Computer Lab 1)
   - Fill in:
     - Date: Tomorrow
     - Time: 09:00-10:00
     - Purpose: "Team meeting"
     - Notes: "Need projector"
   - Submit

3. **View Booking:**
   - Click "My Bookings"
   - Should see booking with status: PENDING

### Scenario 2: Staff Approves Booking

1. **Logout and Login as Staff:**
   - Email: staff1@test.com
   - Password: password123

2. **View Pending Approvals:**
   - Click "Booking Approvals"
   - Should see student's booking

3. **Approve Booking:**
   - Click green checkmark button
   - Confirm approval
   - Booking disappears from pending list

4. **View All Bookings:**
   - Click "All Bookings"
   - Should see approved booking
   - Shows your name as approver

### Scenario 3: Staff Rejects Booking

1. **Login as Student (student2@test.com):**
   - Create another booking

2. **Login as Staff (staff2@test.com):**
   - Go to "Booking Approvals"
   - Click red X button
   - Enter remarks: "Resource under maintenance"
   - Confirm rejection

3. **Verify Rejection:**
   - Go to "All Bookings"
   - Filter by "Rejected"
   - Should see rejected booking with remarks

### Scenario 4: Student Cancels Booking

1. **Login as Student (student1@test.com):**
   - Create a new booking

2. **Cancel Booking:**
   - Go to "My Bookings"
   - Find PENDING booking
   - Click "Cancel Booking"
   - Confirm cancellation

3. **Verify Cancellation:**
   - Booking status changes to REJECTED
   - Remarks: "Cancelled by student"

---

## 📊 Database Summary

**Total Users:** 7
- **Students:** 3
- **Staff:** 3
- **Admins:** 1

---

## 🔄 Reset Test Users

To recreate test users:

```bash
cd Backend\myproject
python create_test_users.py
```

This will:
- Skip existing users
- Create new test users
- Display all credentials

---

## 🔐 Security Notes

⚠️ **IMPORTANT:** These are TEST accounts only!

- All test accounts use the same password: `password123`
- These accounts are for development/testing only
- DO NOT use these credentials in production
- Change all passwords before deploying to production

---

## 📝 Quick Login Reference

**For quick testing, use:**

| Role | Email | Password |
|------|-------|----------|
| STUDENT | student1@test.com | password123 |
| STUDENT | student2@test.com | password123 |
| STAFF | staff1@test.com | password123 |
| STAFF | staff2@test.com | password123 |

---

## 🎯 Testing Checklist

### Student Features:
- [ ] Login as student
- [ ] View resources
- [ ] Create booking
- [ ] View my bookings
- [ ] Cancel pending booking
- [ ] Cannot see other students' bookings
- [ ] Cannot approve/reject bookings

### Staff Features:
- [ ] Login as staff
- [ ] View pending approvals
- [ ] Approve booking
- [ ] Reject booking with remarks
- [ ] View all bookings
- [ ] Filter bookings by status
- [ ] Cannot create bookings

### System Features:
- [ ] Double-booking prevention works
- [ ] Session handling works
- [ ] Auto-redirect on token expiration
- [ ] All filters work
- [ ] Refresh buttons work
- [ ] Success/error messages display

---

**Status:** ✅ TEST USERS READY
**Total Accounts:** 7 (3 Students, 3 Staff, 1 Admin)
**Default Password:** password123
**Action:** Start testing with these accounts!
