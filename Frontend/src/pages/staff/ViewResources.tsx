import React, { useEffect, useState } from 'react';
import { resourcesAPI } from '../../services/api';
import { DataTable } from '../../components/DataTable';
import { StatusBadge } from '../../components/StatusBadge';

const ViewResources: React.FC = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const data = await resourcesAPI.getAll();
      setResources(data.results || data);
    } catch (error) {
      console.error('Failed to fetch resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAvailability = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'AVAILABLE' ? 'UNAVAILABLE' : 'AVAILABLE';
    try {
      await resourcesAPI.updateAvailability(id, newStatus);
      alert(`Resource marked as ${newStatus}`);
      fetchResources();
    } catch (error: any) {
      alert('Failed to update availability: ' + error.message);
    }
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'type', label: 'Type' },
    { key: 'capacity', label: 'Capacity' },
    { 
      key: 'status', 
      label: 'Status',
      render: (value: string) => <StatusBadge status={value} />
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: any) => (
        <button
          onClick={() => handleUpdateAvailability(row.id, row.status)}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
        >
          Toggle Status
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">View Resources</h1>
        <p className="text-gray-600 mt-1">Manage resource availability</p>
      </div>

      <div className="bg-white rounded-lg shadow">
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <DataTable columns={columns} data={resources} emptyMessage="No resources found" />
        )}
      </div>
    </div>
  );
};

export default ViewResources;
