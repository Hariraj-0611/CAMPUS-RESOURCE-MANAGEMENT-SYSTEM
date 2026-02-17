import React from 'react';
import { Users, Monitor, Calendar } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/StatusBadge';
import { mockResources } from '../../utils/mockData';
import { Resource } from '../../types';
interface ViewResourcesProps {
  onBookNow: (resourceId: string) => void;
}
export function ViewResources({ onBookNow }: ViewResourcesProps) {
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
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#1e3a5f]">
          Available Resources
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockResources.map((resource) =>
        <div
          key={resource.id}
          className={`
              bg-white rounded-lg border shadow-sm overflow-hidden transition-all hover:shadow-md
              ${resource.status !== 'AVAILABLE' ? 'opacity-75 bg-gray-50' : 'border-gray-200'}
            `}>

            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-gray-100 rounded-lg">
                  {getIcon(resource.type)}
                </div>
                <StatusBadge status={resource.status} type="resource" />
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-1">
                {resource.name}
              </h3>
              <p className="text-sm text-gray-500 mb-4">{resource.type}</p>

              <div className="flex items-center text-sm text-gray-600 mb-6">
                <Users className="h-4 w-4 mr-2" />
                <span>Capacity: {resource.capacity} people</span>
              </div>

              <Button
              className="w-full"
              disabled={resource.status !== 'AVAILABLE'}
              onClick={() => onBookNow(resource.id)}
              variant={
              resource.status === 'AVAILABLE' ? 'primary' : 'secondary'
              }>

                {resource.status === 'AVAILABLE' ? 'Book Now' : 'Unavailable'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>);

}