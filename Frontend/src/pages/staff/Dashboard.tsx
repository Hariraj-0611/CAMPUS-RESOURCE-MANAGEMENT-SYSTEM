import React, { useEffect, useState } from 'react';
import { bookingsAPI, resourcesAPI } from '../../services/api';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    approvedBookings: 0,
    totalResources: 0,
    availableResources: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [bookingsData, resourcesData] = await Promise.all([
        bookingsAPI.getAll(),
        resourcesAPI.getAll()
      ]);

      const bookings = bookingsData.results || bookingsData;
      const resources = resourcesData.results || resourcesData;

      setStats({
        totalBookings: bookings.length,
        pendingBookings: bookings.filter((b: any) => b.status === 'PENDING').length,
        approvedBookings: bookings.filter((b: any) => b.status === 'APPROVED').length,
        totalResources: resources.length,
        availableResources: resources.filter((r: any) => r.status === 'AVAILABLE').length
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Staff Dashboard</h1>
          <p className="text-gray-600 mt-1">Overview of bookings and resources</p>
        </div>
        <button
          onClick={fetchStats}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Refresh</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-600">Total Bookings</div>
            <div className="text-3xl font-bold text-gray-900 mt-2">{stats.totalBookings}</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-600">Pending Bookings</div>
            <div className="text-3xl font-bold text-yellow-600 mt-2">{stats.pendingBookings}</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-600">Approved Bookings</div>
            <div className="text-3xl font-bold text-green-600 mt-2">{stats.approvedBookings}</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-600">Total Resources</div>
            <div className="text-3xl font-bold text-blue-600 mt-2">{stats.totalResources}</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-2 border-green-200">
            <div className="text-sm font-medium text-gray-600">Available Resources</div>
            <div className="text-3xl font-bold text-green-600 mt-2">{stats.availableResources}</div>
            <div className="text-xs text-gray-500 mt-1">Ready for booking</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
