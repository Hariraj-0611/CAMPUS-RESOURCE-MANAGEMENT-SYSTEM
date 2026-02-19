import React, { useEffect, useState } from 'react';
import { bookingsAPI, resourcesAPI } from '../../services/api';

const Reports: React.FC = () => {
  const [reportData, setReportData] = useState({
    totalBookings: 0,
    approvedBookings: 0,
    rejectedBookings: 0,
    pendingBookings: 0,
    mostBookedResource: 'N/A'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      const [bookingsData, resourcesData] = await Promise.all([
        bookingsAPI.getAll(),
        resourcesAPI.getAll()
      ]);

      const bookings = bookingsData.results || bookingsData;
      const resources = resourcesData.results || resourcesData;

      // Calculate booking counts by resource
      const resourceBookingCounts: { [key: string]: number } = {};
      bookings.forEach((booking: any) => {
        const resourceName = booking.resource_name || 'Unknown';
        resourceBookingCounts[resourceName] = (resourceBookingCounts[resourceName] || 0) + 1;
      });

      // Find most booked resource
      let mostBooked = 'N/A';
      let maxCount = 0;
      Object.entries(resourceBookingCounts).forEach(([name, count]) => {
        if (count > maxCount) {
          maxCount = count;
          mostBooked = name;
        }
      });

      setReportData({
        totalBookings: bookings.length,
        approvedBookings: bookings.filter((b: any) => b.status === 'APPROVED').length,
        rejectedBookings: bookings.filter((b: any) => b.status === 'REJECTED').length,
        pendingBookings: bookings.filter((b: any) => b.status === 'PENDING').length,
        mostBookedResource: mostBooked
      });
    } catch (error) {
      console.error('Failed to fetch report data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <p className="text-gray-600 mt-1">Booking statistics and analytics</p>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-600">Total Bookings</div>
            <div className="text-3xl font-bold text-gray-900 mt-2">{reportData.totalBookings}</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-600">Approved</div>
            <div className="text-3xl font-bold text-green-600 mt-2">{reportData.approvedBookings}</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-600">Rejected</div>
            <div className="text-3xl font-bold text-red-600 mt-2">{reportData.rejectedBookings}</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-600">Pending</div>
            <div className="text-3xl font-bold text-yellow-600 mt-2">{reportData.pendingBookings}</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 md:col-span-2">
            <div className="text-sm font-medium text-gray-600">Most Booked Resource</div>
            <div className="text-2xl font-bold text-blue-600 mt-2">{reportData.mostBookedResource}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
