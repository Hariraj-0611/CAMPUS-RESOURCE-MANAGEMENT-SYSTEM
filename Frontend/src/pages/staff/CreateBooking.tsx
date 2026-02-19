import React, { useEffect, useState } from 'react';
import { Calendar, Clock, Users } from 'lucide-react';
import { resourcesAPI, bookingsAPI, authAPI } from '../../services/api';
import { Modal } from '../../components/Modal';

interface Resource {
  id: number;
  name: string;
  type: string;
  capacity: number;
  status: string;
}

const StaffCreateBooking: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestedResources, setSuggestedResources] = useState<Resource[]>([]);
  const [capacityError, setCapacityError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const [formData, setFormData] = useState({
    resourceId: '',
    date: '',
    startTime: '',
    endTime: '',
    participants: '',
    reason: ''
  });

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const data = await resourcesAPI.getAll();
      console.log('Fetched resources:', data);
      const resourceList = data.results || data;
      setResources(resourceList);
      
      if (resourceList.length === 0) {
        alert('No resources found. Please contact admin to add resources.');
      }
    } catch (error: any) {
      console.error('Failed to load resources:', error);
      alert('Failed to load resources: ' + error.message);
    }
  };

  const selectedResource = resources.find(
    (r) => r.id.toString() === formData.resourceId
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.resourceId) {
      alert('Please select a resource');
      return;
    }

    if (!formData.reason.trim()) {
      alert('Please provide a reason for booking');
      return;
    }

    // Validate start time is before end time
    if (formData.startTime && formData.endTime) {
      if (formData.startTime >= formData.endTime) {
        alert('End time must be after start time');
        return;
      }
    }

    setLoading(true);
    setSuccessMessage('');

    try {
      // Generate time_slot from start and end time
      const timeSlot = formData.startTime && formData.endTime 
        ? `${formData.startTime}-${formData.endTime}`
        : '09:00-17:00'; // Default time slot

      const bookingData = {
        resource: parseInt(formData.resourceId),
        booking_date: formData.date,
        time_slot: timeSlot,
        start_time: formData.startTime || undefined,
        end_time: formData.endTime || undefined,
        number_of_attendees: parseInt(formData.participants) || 0,
        reason: formData.reason
      };

      await bookingsAPI.create(bookingData);
      
      setSuccessMessage('Booking request submitted successfully! Waiting for admin approval. ✅');
      
      // Reset form
      setFormData({
        resourceId: '',
        date: '',
        startTime: '',
        endTime: '',
        participants: '',
        reason: ''
      });

      // Auto-hide success message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error: any) {
      // Check if it's a capacity error with suggestions
      try {
        const errorData = JSON.parse(error.message);
        if (errorData.capacity_exceeded || errorData.suggested_resources) {
          setCapacityError(errorData.message || 'Capacity exceeded');
          setSuggestedResources(errorData.suggested_resources || []);
          setShowSuggestions(true);
        } else {
          alert(error.message || 'Failed to create booking');
        }
      } catch {
        alert(error.message || 'Failed to create booking');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSuggested = (resourceId: number) => {
    setFormData({ ...formData, resourceId: resourceId.toString() });
    setShowSuggestions(false);
    setSuggestedResources([]);
    setCapacityError('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Book Resource</h1>
        <p className="text-gray-600 mt-1">Create a new booking (requires admin approval)</p>
      </div>

      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded">
          {successMessage}
        </div>
      )}

      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Resource *
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.resourceId}
              onChange={(e) => setFormData({ ...formData, resourceId: e.target.value })}
              required
            >
              <option value="">-- Choose a resource --</option>
              {resources.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.type}) - Capacity: {r.capacity}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date *
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min={new Date().toISOString().split('T')[0]}
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Attendees *
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
                max={selectedResource?.capacity || 100}
                value={formData.participants}
                onChange={(e) => setFormData({ ...formData, participants: e.target.value })}
                placeholder="Enter number of attendees"
                required
              />
              {selectedResource && (
                <p className="mt-1 text-xs text-gray-500">
                  Max capacity: {selectedResource.capacity}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Time *
              </label>
              <input
                type="time"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Time *
              </label>
              <input
                type="time"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Booking *
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
              placeholder="Please provide a reason for this booking..."
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              required
            />
          </div>

          <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
            <h4 className="text-sm font-bold text-blue-800 mb-2">
              Booking Summary
            </h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" /> Date: {formData.date || 'Not selected'}
              </li>
              <li className="flex items-center">
                <Clock className="h-4 w-4 mr-2" /> Time: {formData.startTime && formData.endTime ? `${formData.startTime} - ${formData.endTime}` : 'Not selected'}
              </li>
              <li className="flex items-center">
                <Users className="h-4 w-4 mr-2" /> Attendees: {formData.participants || 'Not entered'}
              </li>
            </ul>
            <p className="text-xs text-blue-600 mt-2">
              ⏳ Staff bookings require admin approval
            </p>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Booking'}
            </button>
          </div>
        </form>
      </div>

      {/* Suggested Resources Modal */}
      {showSuggestions && (
        <Modal
          isOpen={showSuggestions}
          onClose={() => setShowSuggestions(false)}
          title="Capacity Exceeded - Suggested Alternatives"
        >
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded p-3">
              <p className="text-sm text-red-800">{capacityError}</p>
            </div>

            {suggestedResources.length > 0 ? (
              <>
                <p className="text-sm text-gray-700">
                  Here are some alternative resources with sufficient capacity:
                </p>
                <div className="space-y-2">
                  {suggestedResources.map((resource: any) => (
                    <button
                      key={resource.id}
                      onClick={() => handleSelectSuggested(resource.id)}
                      className="w-full text-left p-3 border border-gray-300 rounded hover:bg-blue-50 hover:border-blue-500 transition-colors"
                    >
                      <div className="font-medium text-gray-900">{resource.name}</div>
                      <div className="text-sm text-gray-600">
                        {resource.type} - Capacity: {resource.capacity}
                      </div>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-700">
                No alternative resources available with sufficient capacity.
              </p>
            )}

            <div className="flex justify-end">
              <button
                onClick={() => setShowSuggestions(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default StaffCreateBooking;
