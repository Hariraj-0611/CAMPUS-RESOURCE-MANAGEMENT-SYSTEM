import React, { useState } from 'react';
import { Filter } from 'lucide-react';
import { DataTable, Column } from '../../components/DataTable';
import { StatusBadge } from '../../components/StatusBadge';
import { Booking } from '../../types';
import { mockBookings } from '../../utils/mockData';
export function BookingHistory() {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [bookings] = useState<Booking[]>(mockBookings);
  const filteredBookings =
  filterStatus === 'ALL' ?
  bookings :
  bookings.filter((b) => b.status === filterStatus);
  const columns: Column<Booking>[] = [
  {
    key: 'id',
    label: 'ID',
    render: (b) => <span className="text-xs text-gray-500">#{b.id}</span>
  },
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
    key: 'status',
    label: 'Status',
    render: (b) => <StatusBadge status={b.status} />
  }];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-[#1e3a5f]">Booking History</h1>

        <div className="flex items-center space-x-2 bg-white p-2 rounded-md border border-gray-200 shadow-sm">
          <Filter className="h-4 w-4 text-gray-500 ml-2" />
          <select
            className="border-none text-sm focus:ring-0 text-gray-700 bg-transparent"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}>

            <option value="ALL">All Statuses</option>
            <option value="APPROVED">Approved</option>
            <option value="PENDING">Pending</option>
            <option value="REJECTED">Rejected</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      <DataTable columns={columns} data={filteredBookings} pageSize={8} />
    </div>);

}