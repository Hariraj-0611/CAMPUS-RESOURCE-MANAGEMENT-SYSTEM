import React, { useEffect, useState } from 'react';
import { Users, Monitor, Calendar } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/StatusBadge';
import { resourcesAPI } from '../../services/api';

interface Resource {
  id: number;
  name: string;
  type: string;
  capacity: number;
  status: string;
}

interface ViewResourcesProps {
  onBookNow?: (resourceId: string) => void;
}

export function ViewResources({ onBookNow }: ViewResourcesProps) {
  const [resources, setResources] = useState<Resource[]>([]);
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

  const getIcon = (type: string) => {
    switch (type) {
      case 'Computer':
        return <Monitor className="h-6 w-6 text-blue-500" />;
      case 'Lab':
        return <Users className="h-6 w-6 text-purple-500" />;
      default:
        return <Calendar className="h-6 w-6 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-[#1e3a5f]">Available Resources</h1>
        <div className="text-center py-8">Loading resources...</div>
      </div>
    );
  }

  if (resources.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-[#1e3a5f]">Available Resources</h1>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <p className="text-yellow-800">No resources available at the moment.</p>
          <p className="text-sm text-yellow-600 mt-2">Please contact the administrator to add resources.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#1e3a5f]">
          Available Resources
        </h1>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource) => (
          <div
            key={resource.id}
            className={`
              bg-white rounded-lg border shadow-sm overflow-hidden transition-all hover:shadow-md
              ${resource.status !== 'AVAILABLE' ? 'opacity-75 bg-gray-50' : 'border-gray-200'}
            `}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-gray-100 rounded-lg">
                  {getIcon(resource.type)}
                </div>
                <StatusBadge status={resource.status} />
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-1">
                {resource.name}
              </h3>
              <p className="text-sm text-gray-500 mb-4">{resource.type}</p>

              <div className="flex items-center text-sm text-gray-600 mb-6">
                <Users className="h-4 w-4 mr-2" />
                <span>Capacity: {resource.capacity} people</span>
              </div>

              {onBookNow && (
                <Button
                  className="w-full"
                  disabled={resource.status !== 'AVAILABLE'}
                  onClick={() => onBookNow(resource.id.toString())}
                  variant={resource.status === 'AVAILABLE' ? 'primary' : 'secondary'}
                >
                  {resource.status === 'AVAILABLE' ? 'Book Now' : 'Unavailable'}
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}