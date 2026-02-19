import React, { useState, useEffect } from 'react';
import { XCircle, Edit } from 'lucide-react';
import { DataTable } from '../../components/DataTable';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/Modal';
import { bookingsAPI, resourcesAPI } from '../../services/api';

export function MyBookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingBooking, setEditingBooking] = useState<any>(null);
  const [editFormData, setEditFormData] = useState({
    resourceId: '',
    date: '',
    startTime: '',
    endTime: '',
    participants: '',
    reason: ''
  });

  useEffect(() => {
    fetchBookings();
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const data = await resourcesAPI.getAll();
      setResources(data.results || data);
    } catch (error) {
      console.error('Failed to fetch resources:', error);
    }
  };

  const fetchBookings = async () => {
    try {
      const data = await bookingsAPI.getMyBookings();
      setBookings(data.results || data);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (booking: any) => {
    setEditingBooking(booking);
    setEditFormData({
      resourceId: booking.resource.toString(),
      date: booking.booking_date,
      startTime: booking.start_time || '',
      endTime: booking.end_time || '',
      participants: booking.number_of_attendees.toString(),
      reason: booking.reason || ''
    });
    setShowEditModal(true);
  };

  const handleUpdateBooking = async () => {
    if (!editingBooking) return;

    // Validate times
    if (editFormData.startTime >= editFormData.endTime) {
      alert('End time must be after start time');
      return;
    }

    try {
      const timeSlot = `${editFormData.startTime}-${editFormData.endTime}`;
      
      await bookingsAPI.update(editingBooking.id, {
        resource: parseInt(editFormData.resourceId),
        booking_date: editFormData.date,
        time_slot: timeSlot,
        start_time: editFormData.startTime,
        end_time: editFormData.endTime,
        number_of_attendees: parseInt(editFormData.participants),
        reason: editFormData.reason
      });

      alert('Booking updated successfully!');
      setShowEditModal(false);
      setEditingBooking(null);
      fetchBookings();
    } catch (error: any) {
      alert('Failed to update booking: ' + error.message);
    }
  };

  const handleCancel = async (id: number) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await bookingsAPI.cancel(id);
        alert('Booking cancelled successfully');
        fetchBookings();
      } catch (error: any) {
        alert('Failed to cancel booking: ' + error.message);
      }
    }
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'resource_name', label: 'Resource' },
    { key: 'booking_date', label: 'Date' },
    { key: 'time_slot', label: 'Time' },
    { key: 'number_of_attendees', label: 'Attendees' },
    { 
      key: 'status', 
      label: 'Status',
      render: (value: string) => <StatusBadge status={value} />
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: any) => (
        <div className="flex space-x-2">
          {row.status === 'PENDING' && (
            <>
              <Button
                variant="outline"
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200 text-sm px-3 py-1"
                onClick={() => handleEdit(row)}
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button
                variant="outline"
                className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 text-sm px-3 py-1"
                onClick={() => handleCancel(row.id)}
              >
                <XCircle className="h-4 w-4 mr-1" />
                Cancel
              </Button>
            </>
          )}
          {row.status === 'APPROVED' && (
            <Button
              variant="outline"
              className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 text-sm px-3 py-1"
              onClick={() => handleCancel(row.id)}
            >
              <XCircle className="h-4 w-4 mr-1" />
              Cancel
            </Button>
          )}
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-[#1e3a5f]">My Bookings</h1>
        <div className="text-center py-8">Loading bookings...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#1e3a5f]">My Bookings</h1>
        <button
          onClick={fetchBookings}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Refresh</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <DataTable 
          columns={columns} 
          data={bookings} 
          emptyMessage="You haven't made any bookings yet. Click 'Create Booking' to get started!"
        />
      </div>

      {/* Edit Booking Modal */}
      {showEditModal && editingBooking && (
        <Modal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEditingBooking(null);
          }}
          title="Edit Booking"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Resource *
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                value={editFormData.resourceId}
                onChange={(e) => setEditFormData({ ...editFormData, resourceId: e.target.value })}
              >
                {resources.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.type}) - Capacity: {r.capacity}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                value={editFormData.date}
                onChange={(e) => setEditFormData({ ...editFormData, date: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time *</label>
                <input
                  type="time"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  value={editFormData.startTime}
                  onChange={(e) => setEditFormData({ ...editFormData, startTime: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Time *</label>
                <input
                  type="time"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  value={editFormData.endTime}
                  onChange={(e) => setEditFormData({ ...editFormData, endTime: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Number of Attendees *</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                value={editFormData.participants}
                onChange={(e) => setEditFormData({ ...editFormData, participants: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason *</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                rows={3}
                value={editFormData.reason}
                onChange={(e) => setEditFormData({ ...editFormData, reason: e.target.value })}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingBooking(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateBooking}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Update Booking
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
