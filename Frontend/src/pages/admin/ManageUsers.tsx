import React, { useState } from 'react';
import { Plus, Edit2, Power, UserX } from 'lucide-react';
import { DataTable, Column } from '../../components/DataTable';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/Modal';
import { Input } from '../../components/ui/Input';
import { StatusBadge } from '../../components/StatusBadge';
import { useToast } from '../../components/Toast';
import { User, UserRole } from '../../types';
import { mockUsers } from '../../utils/mockData';
export function ManageUsers() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const { showToast } = useToast();
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'STUDENT' as UserRole
  });
  const handleOpenModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        role: user.role
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        role: 'STUDENT'
      });
    }
    setIsModalOpen(true);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      // Update existing
      setUsers(
        users.map((u) =>
        u.id === editingUser.id ?
        {
          ...u,
          ...formData
        } :
        u
        )
      );
      showToast('User updated successfully', 'success');
    } else {
      // Create new
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        status: 'ACTIVE',
        createdAt: new Date().toISOString().split('T')[0]
      };
      setUsers([...users, newUser]);
      showToast('User created successfully', 'success');
    }
    setIsModalOpen(false);
  };
  const toggleStatus = (user: User) => {
    const newStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    setUsers(
      users.map((u) =>
      u.id === user.id ?
      {
        ...u,
        status: newStatus
      } :
      u
      )
    );
    showToast(
      `User ${newStatus === 'ACTIVE' ? 'activated' : 'deactivated'}`,
      'info'
    );
  };
  const columns: Column<User>[] = [
  {
    key: 'name',
    label: 'Name'
  },
  {
    key: 'email',
    label: 'Email'
  },
  {
    key: 'role',
    label: 'Role',
    render: (u) =>
    <span className="font-medium text-[#1e3a5f]">{u.role}</span>

  },
  {
    key: 'status',
    label: 'Status',
    render: (u) => <StatusBadge status={u.status} type="user" />
  },
  {
    key: 'actions',
    label: 'Actions',
    render: (u) =>
    <div className="flex space-x-2">
          <Button
        variant="outline"
        size="sm"
        onClick={() => handleOpenModal(u)}>

            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
        variant={u.status === 'ACTIVE' ? 'danger' : 'secondary'}
        size="sm"
        onClick={() => toggleStatus(u)}
        title={u.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}>

            {u.status === 'ACTIVE' ?
        <UserX className="h-4 w-4" /> :

        <Power className="h-4 w-4" />
        }
          </Button>
        </div>

  }];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#1e3a5f]">Manage Users</h1>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      <DataTable columns={columns} data={users} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? 'Edit User' : 'Add New User'}>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            value={formData.name}
            onChange={(e) =>
            setFormData({
              ...formData,
              name: e.target.value
            })
            }
            required />

          <Input
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) =>
            setFormData({
              ...formData,
              email: e.target.value
            })
            }
            required />

          <Input
            label="Phone Number"
            value={formData.phone}
            onChange={(e) =>
            setFormData({
              ...formData,
              phone: e.target.value
            })
            } />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1e3a5f] focus:ring-[#1e3a5f] sm:text-sm"
              value={formData.role}
              onChange={(e) =>
              setFormData({
                ...formData,
                role: e.target.value as UserRole
              })
              }>

              <option value="STUDENT">Student</option>
              <option value="STAFF">Staff</option>
              <option value="ADMIN">Admin</option>
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
              {editingUser ? 'Save Changes' : 'Create User'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>);

}