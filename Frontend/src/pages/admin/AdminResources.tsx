import React, { useEffect, useState } from 'react';
import { resourcesAPI } from '../../services/api';
import { DataTable } from '../../components/DataTable';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/Modal';
import { Plus, Edit, Trash2 } from 'lucide-react';

const AdminResources: React.FC = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState<{id: number, name: string} | null>(null);
  const [editingResource, setEditingResource] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Lab',
    capacity: '',
    status: 'AVAILABLE'
  });

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const data = await resourcesAPI.getAll();
      setResources(data.results || data);
    } catch (error) {
      console.error('Failed to fetch resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingResource(null);
    setFormData({
      name: '',
      type: 'LAB',
      capacity: '',
      status: 'AVAILABLE'
    });
    setShowModal(true);
  };

  const handleEdit = (resource: any) => {
    setEditingResource(resource);
    setFormData({
      name: resource.name,
      type: resource.type,
      capacity: resource.capacity.toString(),
      status: resource.status
    });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.capacity) {
      alert('Please fill all required fields');
      return;
    }

    try {
      const resourceData = {
        name: formData.name,
        type: formData.type,
        capacity: parseInt(formData.capacity),
        status: formData.status
      };

      if (editingResource) {
        await resourcesAPI.update(editingResource.id, resourceData);
        alert('Resource updated successfully');
      } else {
        await resourcesAPI.create(resourceData);
        alert('Resource created successfully');
      }

      setShowModal(false);
      fetchResources();
    } catch (error: any) {
      alert(`Failed to ${editingResource ? 'update' : 'create'} resource: ` + error.message);
    }
  };

  const handleDelete = (id: number, name: string) => {
    console.log('Delete button clicked, showing confirmation modal');
    setResourceToDelete({ id, name });
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!resourceToDelete) return;
    
    console.log('=== CONFIRMING DELETE ===');
    console.log('Resource ID:', resourceToDelete.id);
    console.log('Resource Name:', resourceToDelete.name);
    
    try {
      console.log('Calling API...');
      await resourcesAPI.delete(resourceToDelete.id);
      
      console.log('Delete successful');
      alert('Resource deleted successfully!');
      setShowDeleteConfirm(false);
      setResourceToDelete(null);
      await fetchResources();
    } catch (error: any) {
      console.error('=== DELETE ERROR ===');
      console.error('Error:', error);
      alert('Failed to delete resource: ' + error.message);
    }
  };

  const cancelDelete = () => {
    console.log('Delete cancelled');
    setShowDeleteConfirm(false);
    setResourceToDelete(null);
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
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleEdit(row);
            }}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm flex items-center"
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleDelete(row.id, row.name);
            }}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm flex items-center"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Resources</h1>
          <p className="text-gray-600 mt-1">Add, edit, or delete resources</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Resource</span>
          </button>
          <button
            onClick={fetchResources}
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
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {resources.map((resource: any) => (
                  <tr key={resource.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{resource.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{resource.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{resource.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{resource.capacity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <StatusBadge status={resource.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(resource)}
                          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm flex items-center"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(resource.id, resource.name)}
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm flex items-center"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingResource ? 'Edit Resource' : 'Add New Resource'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Resource Name *
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Computer Lab 1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type *
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="LAB">Lab</option>
              <option value="CLASSROOM">Classroom</option>
              <option value="EVENT_HALL">Event Hall</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Capacity *
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
              placeholder="e.g., 50"
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status *
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="AVAILABLE">Available</option>
              <option value="UNAVAILABLE">Unavailable</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {editingResource ? 'Update' : 'Create'} Resource
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={cancelDelete}
        title="Confirm Delete"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete resource <strong>{resourceToDelete?.name}</strong>?
          </p>
          <p className="text-sm text-red-600">
            This will also delete all bookings associated with this resource. This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={cancelDelete}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Delete Resource
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminResources;
