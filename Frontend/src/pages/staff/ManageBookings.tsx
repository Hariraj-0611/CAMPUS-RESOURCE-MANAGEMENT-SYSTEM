import React, { useEffect, useState } from 'react';
import { bookingsAPI } from '../../services/api';
import { DataTable } from '../../components/DataTable';
import { StatusBadge } from '../../components/StatusBadge';

const ManageBookings: React.FC = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const columns = [
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
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">View All Bookings</h1>
          <p className="text-gray-600 mt-1">View all booking requests (Admin approval required)</p>
        </div>
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

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> Staff can view all bookings but cannot approve or reject them. 
          Only administrators can approve/reject bookings via the Django Admin panel.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow">
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <DataTable columns={columns} data={bookings} emptyMessage="No bookings found" />
        )}
      </div>
    </div>
  );
};

export default ManageBookings;
