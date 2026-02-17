import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/Button';
export interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
}
interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  pageSize?: number;
  keyField?: string;
}
export function DataTable<
  T extends {
    id?: string | number;
  }>(
{ columns, data, pageSize = 5, keyField = 'id' }: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentData = data.slice(startIndex, startIndex + pageSize);
  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };
  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };
  if (data.length === 0) {
    return (
      <div className="w-full bg-white rounded-lg border border-gray-200 p-8 text-center">
        <p className="text-gray-500">No data found.</p>
      </div>);

  }
  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#f8fafc]">
            <tr>
              {columns.map((col) =>
              <th
                key={col.key}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">

                  {col.label}
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentData.map((item, index) =>
            <tr
              key={(item as any)[keyField] || index}
              className={index % 2 === 0 ? 'bg-white' : 'bg-[#f8fafc]'}>

                {columns.map((col) =>
              <td
                key={`${(item as any)[keyField]}-${col.key}`}
                className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">

                    {col.render ? col.render(item) : (item as any)[col.key]}
                  </td>
              )}
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 &&
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(startIndex + pageSize, data.length)}
                </span>{' '}
                of <span className="font-medium">{data.length}</span> results
              </p>
            </div>
            <div>
              <nav
              className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
              aria-label="Pagination">

                <Button
                variant="outline"
                size="sm"
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className="rounded-l-md rounded-r-none border-r-0">

                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                variant="outline"
                size="sm"
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="rounded-r-md rounded-l-none">

                  <ChevronRight className="h-4 w-4" />
                </Button>
              </nav>
            </div>
          </div>
          {/* Mobile pagination */}
          <div className="flex items-center justify-between w-full sm:hidden">
            <Button
            variant="outline"
            size="sm"
            onClick={handlePrevious}
            disabled={currentPage === 1}>

              Previous
            </Button>
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={currentPage === totalPages}>

              Next
            </Button>
          </div>
        </div>
      }
    </div>);

}