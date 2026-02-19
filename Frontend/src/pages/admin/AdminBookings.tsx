import React, { useEffect, useState } from 'react';
import { bookingsAPI } from '../../services/api';
import { DataTable } from '../../components/DataTable';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/Modal';
import { Check, X } from 'lucide-react';

const AdminBookings: React.FC = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [rejectRemarks, setRejectRemarks] = useState('');
  const [selectedBookings, setSelectedBookings] = useState<number[]>([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await bookingsAPI.getAll();
      setBookings(data.results || data);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await bookingsAPI.approve(id);
      alert('Booking approved successfully');
      fetchBookings();
    } catch (error: any) {
      alert('Failed to approve booking: ' + error.message);
    }
  };

  const handleBulkApprove = async () => {
    if (selectedBookings.length === 0) {
      alert('Please select bookings to approve');
      return;
    }

    try {
      await Promise.all(selectedBookings.map(id => bookingsAPI.approve(id)));
      alert(`${selectedBookings.length} booking(s) approved successfully`);
      setSelectedBookings([]);
      fetchBookings();
    } catch (error: any) {
      alert('Failed to approve bookings: ' + error.message);
    }
  };

  const handleReject = async () => {
    if (!selectedBooking || !rejectRemarks.trim()) {
      alert('Please provide remarks for rejection');
      return;
    }

    try {
      await bookingsAPI.reject(selectedBooking.id, rejectRemarks);
      alert('Booking rejected successfully');
      setShowRejectModal(false);
      setRejectRemarks('');
      setSelectedBooking(null);
      fetchBookings();
    } catch (error: any) {
      alert('Failed to reject booking: ' + error.message);
    }
  };

  const toggleSelection = (id: number) => {
    setSelectedBookings(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const columns = [
    {
      key: 'select',
      label: (
        <input
          type="checkbox"
          onChange={(e) => {
            if (e.target.checked) {
              const pendingIds = bookings
                .filter((b: any) => b.status === 'PENDING')
                .map((b: any) => b.id);
              setSelectedBookings(pendingIds);
            } else {
              setSelectedBookings([]);
            }
          }}
          checked={selectedBookings.length > 0}
        />
      ),
      render: (_: any, row: any) =>
        row.status === 'PENDING' ? (
          <input
            type="checkbox"
            checked={selectedBookings.includes(row.id)}
            onChange={() => toggleSelection(row.id)}
          />
        ) : null
    },
    { key: 'id', label: 'ID' },
    { key: 'user_name', label: 'User' },
    { key: 'resource_name', label: 'Resource' },
    { key: 'booking_date', label: 'Date' },
    { key: 'time_slot', label: 'Time' },
    { key: 'number_of_attendees', label: 'Attendees' },
    { key: 'reason', label: 'Reason' },
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
              <button
                onClick={() => handleApprove(row.id)}
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm flex items-center"
                title="Approve"
              >
                <Check className="h-4 w-4" />
              </button>
              <button
                onClick={() => {
                  setSelectedBooking(row);
                  setShowRejectModal(true);
                }}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm flex items-center"
                title="Reject"
              >
                <X className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Bookings</h1>
          <p className="text-gray-600 mt-1">Approve or reject booking requests</p>
        </div>
        <div className="flex space-x-3">
          {selectedBookings.length > 0 && (
            <button
              onClick={handleBulkApprove}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
            >
              <Check className="w-4 h-4" />
              <span>Approve Selected ({selectedBookings.length})</span>
            </button>
          )}
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
      </div>

      <div className="bg-white rounded-lg shadow">
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <DataTable columns={columns} data={bookings} emptyMessage="No bookings found" />
        )}
      </div>

      <Modal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        title="Reject Booking"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Please provide a reason for rejecting this booking.
          </p>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder="Enter rejection remarks..."
            value={rejectRemarks}
            onChange={(e) => setRejectRemarks(e.target.value)}
          />
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowRejectModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleReject}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Reject Booking
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminBookings;
