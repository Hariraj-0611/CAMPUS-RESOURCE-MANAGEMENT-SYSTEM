import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import { DataTable, Column } from '../../components/DataTable';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/StatusBadge';
import { useToast } from '../../components/Toast';
import { Booking } from '../../types';
import { mockBookings } from '../../utils/mockData';
export function BookingApprovals() {
  const [bookings, setBookings] = useState<Booking[]>(
    mockBookings.filter((b) => b.status === 'PENDING')
  );
  const { showToast } = useToast();
  const handleAction = (id: string, action: 'APPROVED' | 'REJECTED') => {
    if (
    window.confirm(
      `Are you sure you want to ${action.toLowerCase()} this booking?`
    ))
    {
      setBookings(bookings.filter((b) => b.id !== id));
      showToast(
        `Booking ${action.toLowerCase()} successfully`,
        action === 'APPROVED' ? 'success' : 'info'
      );
    }
  };
  const columns: Column<Booking>[] = [
  {
    key: 'userName',
    label: 'User'
  },
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
    key: 'participantsCount',
    label: 'Participants'
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
    <div className="flex space-x-2">
          <Button
        className="bg-green-600 hover:bg-green-700 focus:ring-green-600"
        size="sm"
        onClick={() => handleAction(b.id, 'APPROVED')}
        title="Approve">

            <Check className="h-4 w-4" />
          </Button>
          <Button
        variant="danger"
        size="sm"
        onClick={() => handleAction(b.id, 'REJECTED')}
        title="Reject">

            <X className="h-4 w-4" />
          </Button>
        </div>

  }];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#1e3a5f]">Pending Approvals</h1>
      </div>

      {bookings.length > 0 ?
      <DataTable columns={columns} data={bookings} /> :

      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
            <Check className="h-full w-full" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">
            No pending bookings
          </h3>
          <p className="mt-1 text-gray-500">
            All caught up! There are no bookings waiting for approval.
          </p>
        </div>
      }
    </div>);

}