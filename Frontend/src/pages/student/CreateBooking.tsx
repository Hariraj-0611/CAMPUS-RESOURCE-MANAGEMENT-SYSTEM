import React, { useEffect, useState } from 'react';
import { Calendar, Clock, Users } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../components/Toast';
import { mockResources } from '../../utils/mockData';
import { User } from '../../types';
interface CreateBookingProps {
  user: User;
  preSelectedResourceId?: string | null;
  onSuccess: () => void;
  onCancel: () => void;
}
export function CreateBooking({
  user,
  preSelectedResourceId,
  onSuccess,
  onCancel
}: CreateBookingProps) {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    resourceId: preSelectedResourceId || '',
    date: '',
    timeSlot: '',
    participants: 1
  });
  const availableResources = mockResources.filter(
    (r) => r.status === 'AVAILABLE'
  );
  const selectedResource = availableResources.find(
    (r) => r.id === formData.resourceId
  );
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.resourceId) {
      showToast('Please select a resource', 'error');
      return;
    }
    // Simulate API call
    setTimeout(() => {
      const isAutoApproved = user.role === 'STAFF'; // Staff get auto-approved
      const status = isAutoApproved ? 'APPROVED' : 'PENDING';
      showToast(
        isAutoApproved ?
        'Booking approved instantly!' :
        'Booking request sent successfully!',
        'success'
      );
      onSuccess();
    }, 800);
  };
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-[#f8fafc]">
          <h2 className="text-xl font-bold text-[#1e3a5f]">
            Create New Booking
          </h2>
          <p className="text-sm text-gray-500">
            Fill in the details to reserve a resource.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Resource
            </label>
            <select
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1e3a5f] focus:ring-[#1e3a5f] sm:text-sm py-2.5"
              value={formData.resourceId}
              onChange={(e) =>
              setFormData({
                ...formData,
                resourceId: e.target.value
              })
              }
              required>

              <option value="">-- Choose a resource --</option>
              {availableResources.map((r) =>
              <option key={r.id} value={r.id}>
                  {r.name} ({r.type}) - Cap: {r.capacity}
                </option>
              )}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Date"
              type="date"
              min={new Date().toISOString().split('T')[0]}
              value={formData.date}
              onChange={(e) =>
              setFormData({
                ...formData,
                date: e.target.value
              })
              }
              required />


            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time Slot
              </label>
              <select
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1e3a5f] focus:ring-[#1e3a5f] sm:text-sm py-2.5"
                value={formData.timeSlot}
                onChange={(e) =>
                setFormData({
                  ...formData,
                  timeSlot: e.target.value
                })
                }
                required>

                <option value="">-- Select Time --</option>
                <option value="08:00 - 10:00">08:00 - 10:00</option>
                <option value="10:00 - 12:00">10:00 - 12:00</option>
                <option value="12:00 - 14:00">12:00 - 14:00</option>
                <option value="14:00 - 16:00">14:00 - 16:00</option>
                <option value="16:00 - 18:00">16:00 - 18:00</option>
              </select>
            </div>
          </div>

          <div>
            <Input
              label="Number of Participants"
              type="number"
              min="1"
              max={selectedResource?.capacity || 100}
              value={formData.participants}
              onChange={(e) =>
              setFormData({
                ...formData,
                participants: parseInt(e.target.value)
              })
              }
              required />

            {selectedResource &&
            <p className="mt-1 text-xs text-gray-500">
                Max capacity for this resource is {selectedResource.capacity}.
              </p>
            }
          </div>

          <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
            <h4 className="text-sm font-bold text-blue-800 mb-2">
              Booking Summary
            </h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" /> Date:{' '}
                {formData.date || 'Not selected'}
              </li>
              <li className="flex items-center">
                <Clock className="h-4 w-4 mr-2" /> Time:{' '}
                {formData.timeSlot || 'Not selected'}
              </li>
              <li className="flex items-center">
                <Users className="h-4 w-4 mr-2" /> Participants:{' '}
                {formData.participants}
              </li>
            </ul>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">Confirm Booking</Button>
          </div>
        </form>
      </div>
    </div>);

}