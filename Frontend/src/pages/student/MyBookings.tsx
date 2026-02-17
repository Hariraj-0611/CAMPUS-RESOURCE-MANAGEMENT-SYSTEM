import React, { useState } from 'react';
import { XCircle } from 'lucide-react';
import { DataTable, Column } from '../../components/DataTable';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/StatusBadge';
import { useToast } from '../../components/Toast';
import { Booking, User } from '../../types';
import { mockBookings } from '../../utils/mockData';
interface MyBookingsProps {
  user: User;
}
export function MyBookings({ user }: MyBookingsProps) {
  // In a real app, we'd filter by user.id from the API
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const { showToast } = useToast();
  const handleCancel = (id: string) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      setBookings(
        bookings.map((b) =>
        b.id === id ?
        {
          ...b,
          status: 'CANCELLED'
        } :
        b
        )
      );
      showToast('Booking cancelled successfully', 'info');
    }
  };
  const columns: Column<Booking>[] = [
  {
    key: 'resourceName',
    label: 'Resource'
  },
  {
    key: 'bookingDate',
    label: 'Date'
  },
  {
    key: 'timeSlot',
    label: 'Time'
  },
  {
    key: 'status',
    label: 'Status',
    render: (b) => <StatusBadge status={b.status} />
  },
  {
    key: 'actions',
    label: 'Actions',
    render: (b) =>
    b.status === 'PENDING' || b.status === 'APPROVED' ?
    <Button
      variant="outline"
      size="sm"
      className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
      onClick={() => handleCancel(b.id)}>

            <XCircle className="h-4 w-4 mr-1" />
            Cancel
          </Button> :

    <span className="text-gray-400 text-sm">-</span>

  }];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#1e3a5f]">My Bookings</h1>
      </div>

      <DataTable columns={columns} data={bookings} />
    </div>);

}