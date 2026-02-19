import React, { useEffect, useState } from 'react';
import { usersAPI } from '../../services/api';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/Modal';
import { Plus, Trash2 } from 'lucide-react';

const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{id: number, username: string, email: string} | null>(null);
  const [selectedRole, setSelectedRole] = useState<'ALL' | 'STUDENT' | 'STAFF' | 'ADMIN'>('ALL');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone: '',
    role: 'STUDENT',
    status: 'ACTIVE'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await usersAPI.getAll();
      setUsers(data.results || data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = (role: string) => {
    setFormData({
      username: '',
      email: '',
      password: '',
      first_name: '',
      last_name: '',
      phone: '',
      role: role,
      status: 'ACTIVE'
    });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!formData.username || !formData.email || !formData.password) {
      alert('Please fill all required fields (username, email, password)');
      return;
    }

    try {
      await usersAPI.create(formData);
      alert('User created successfully');
      setShowModal(false);
      fetchUsers();
    } catch (error: any) {
      alert('Failed to create user: ' + error.message);
    }
  };

  const handleDelete = (id: number, username: string, email: string) => {
    console.log('Delete button clicked, showing confirmation modal');
    setUserToDelete({ id, username, email });
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    
    console.log('=== CONFIRMING DELETE ===');
    console.log('User ID:', userToDelete.id);
    console.log('Username:', userToDelete.username);
    
    try {
      console.log('Calling API...');
      await usersAPI.delete(userToDelete.id);
      
      console.log('Delete successful');
      alert('User deleted successfully!');
      setShowDeleteConfirm(false);
      setUserToDelete(null);
      await fetchUsers();
    } catch (error: any) {
      console.error('=== DELETE ERROR ===');
      console.error('Error:', error);
      alert('Failed to delete user: ' + error.message);
    }
  };

  const cancelDelete = () => {
    console.log('Delete cancelled');
    setShowDeleteConfirm(false);
    setUserToDelete(null);
  };

  const filteredUsers = selectedRole === 'ALL' 
    ? users 
    : users.filter((user: any) => user.role === selectedRole);

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-purple-100 text-purple-800';
      case 'STAFF': return 'bg-blue-100 text-blue-800';
      case 'STUDENT': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>
          <p className="text-gray-600 mt-1">Create and manage students, staff, and admins</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => handleAdd('STUDENT')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Student</span>
          </button>
          <button
            onClick={() => handleAdd('STAFF')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Staff</span>
          </button>
          <button
            onClick={() => handleAdd('ADMIN')}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Admin</span>
          </button>
          <button
            onClick={fetchUsers}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Role Filter */}
      <div className="flex space-x-2">
        <button
          onClick={() => setSelectedRole('ALL')}
          className={`px-4 py-2 rounded-lg ${selectedRole === 'ALL' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          All Users ({users.length})
        </button>
        <button
          onClick={() => setSelectedRole('STUDENT')}
          className={`px-4 py-2 rounded-lg ${selectedRole === 'STUDENT' ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
        >
          Students ({users.filter((u: any) => u.role === 'STUDENT').length})
        </button>
        <button
          onClick={() => setSelectedRole('STAFF')}
          className={`px-4 py-2 rounded-lg ${selectedRole === 'STAFF' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
        >
          Staff ({users.filter((u: any) => u.role === 'STAFF').length})
        </button>
        <button
          onClick={() => setSelectedRole('ADMIN')}
          className={`px-4 py-2 rounded-lg ${selectedRole === 'ADMIN' ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-700 hover:bg-purple-200'}`}
        >
          Admins ({users.filter((u: any) => u.role === 'ADMIN').length})
        </button>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user: any) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.username}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <StatusBadge status={user.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <button
                        type="button"
                        onClick={() => handleDelete(user.id, user.username, user.email)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm flex items-center"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
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
        title={`Add New ${formData.role}`}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username *
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              placeholder="e.g., john_doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="e.g., john@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password *
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Enter password"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                placeholder="First name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                placeholder="Last name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Phone number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role *
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="STUDENT">Student</option>
              <option value="STAFF">Staff</option>
              <option value="ADMIN">Admin</option>
            </select>
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
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
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
              Create User
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
            Are you sure you want to delete user <strong>{userToDelete?.username}</strong> ({userToDelete?.email})?
          </p>
          <p className="text-sm text-red-600">
            This will also delete all bookings made by this user. This action cannot be undone.
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
              Delete User
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ManageUsers;
