import React from 'react';
interface StatusBadgeProps {
  status: string;
  type?: 'booking' | 'resource' | 'user';
}
export function StatusBadge({ status, type = 'booking' }: StatusBadgeProps) {
  const getStatusColor = (status: string) => {
    const s = status.toUpperCase();
    // Success / Green
    if (['AVAILABLE', 'ACTIVE', 'APPROVED'].includes(s)) {
      return 'bg-green-100 text-green-800 border-green-200';
    }
    // Warning / Yellow
    if (['PENDING'].includes(s)) {
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
    // Error / Red
    if (['REJECTED', 'BLOCKED', 'INACTIVE'].includes(s)) {
      return 'bg-red-100 text-red-800 border-red-200';
    }
    // Info / Orange
    if (['MAINTENANCE'].includes(s)) {
      return 'bg-orange-100 text-orange-800 border-orange-200';
    }
    // Neutral / Gray
    if (['CANCELLED'].includes(s)) {
      return 'bg-gray-100 text-gray-800 border-gray-200';
    }
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>

      {status}
    </span>);

}