import React, { useState } from 'react';
import { Plus, Edit2 } from 'lucide-react';
import { DataTable, Column } from '../../components/DataTable';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/Modal';
import { Input } from '../../components/ui/Input';
import { StatusBadge } from '../../components/StatusBadge';
import { useToast } from '../../components/Toast';
import { Resource, ResourceType, ResourceStatus } from '../../types';
import { mockResources } from '../../utils/mockData';
export function ManageResources() {
  const [resources, setResources] = useState<Resource[]>(mockResources);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    type: 'Classroom' as ResourceType,
    capacity: 30,
    status: 'AVAILABLE' as ResourceStatus
  });
  const handleOpenModal = (resource?: Resource) => {
    if (resource) {
      setEditingResource(resource);
      setFormData({
        name: resource.name,
        type: resource.type,
        capacity: resource.capacity,
        status: resource.status
      });
    } else {
      setEditingResource(null);
      setFormData({
        name: '',
        type: 'Classroom',
        capacity: 30,
        status: 'AVAILABLE'
      });
    }
    setIsModalOpen(true);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingResource) {
      setResources(
        resources.map((r) =>
        r.id === editingResource.id ?
        {
          ...r,
          ...formData
        } :
        r
        )
      );
      showToast('Resource updated successfully', 'success');
    } else {
      const newResource: Resource = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setResources([...resources, newResource]);
      showToast('Resource created successfully', 'success');
    }
    setIsModalOpen(false);
  };
  const columns: Column<Resource>[] = [
  {
    key: 'name',
    label: 'Resource Name'
  },
  {
    key: 'type',
    label: 'Type'
  },
  {
    key: 'capacity',
    label: 'Capacity',
    render: (r) => <span>{r.capacity} people</span>
  },
  {
    key: 'status',
    label: 'Status',
    render: (r) => <StatusBadge status={r.status} type="resource" />
  },
  {
    key: 'actions',
    label: 'Actions',
    render: (r) =>
    <Button variant="outline" size="sm" onClick={() => handleOpenModal(r)}>
          <Edit2 className="h-4 w-4" />
        </Button>

  }];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#1e3a5f]">Manage Resources</h1>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="h-4 w-4 mr-2" />
          Add Resource
        </Button>
      </div>

      <DataTable columns={columns} data={resources} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingResource ? 'Edit Resource' : 'Add New Resource'}>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Resource Name"
            value={formData.name}
            onChange={(e) =>
            setFormData({
              ...formData,
              name: e.target.value
            })
            }
            required
            placeholder="e.g. Lecture Hall A" />


          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1e3a5f] focus:ring-[#1e3a5f] sm:text-sm"
              value={formData.type}
              onChange={(e) =>
              setFormData({
                ...formData,
                type: e.target.value as ResourceType
              })
              }>

              <option value="Classroom">Classroom</option>
              <option value="Lab">Lab</option>
              <option value="Event Hall">Event Hall</option>
              <option value="Computer">Computer</option>
            </select>
          </div>

          <Input
            label="Capacity"
            type="number"
            min="1"
            value={formData.capacity}
            onChange={(e) =>
            setFormData({
              ...formData,
              capacity: parseInt(e.target.value)
            })
            }
            required />


          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1e3a5f] focus:ring-[#1e3a5f] sm:text-sm"
              value={formData.status}
              onChange={(e) =>
              setFormData({
                ...formData,
                status: e.target.value as ResourceStatus
              })
              }>

              <option value="AVAILABLE">Available</option>
              <option value="MAINTENANCE">Maintenance</option>
              <option value="BLOCKED">Blocked</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}>

              Cancel
            </Button>
            <Button type="submit">
              {editingResource ? 'Save Changes' : 'Create Resource'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>);

}