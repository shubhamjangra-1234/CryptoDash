import React from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';

const DataTable = React.memo(({ 
  data = [], 
  columns = [], 
  loading = false, 
  error = null,
  onRowClick = null,
  pagination = null,
  sorting = null,
  className = ""
}) => {
  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <p className="font-medium">Error loading data</p>
            <p className="text-sm">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            <p>No data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="text-left p-4 font-medium text-gray-700 whitespace-nowrap"
                    style={{ width: column.width }}
                  >
                    {column.title}
                    {column.sortable && sorting && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-2 h-6 w-6 p-0"
                        onClick={() => sorting.onSort(column.key)}
                      >
                        {sorting.sortBy === column.key ? (
                          sorting.sortOrder === 'asc' ? '↑' : '↓'
                        ) : '↕'}
                      </Button>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr
                  key={row.id || index}
                  className={`border-b hover:bg-gray-50 transition-colors ${
                    onRowClick ? 'cursor-pointer' : ''
                  }`}
                  onClick={() => onRowClick && onRowClick(row)}
                >
                  {columns.map((column) => (
                    <td key={column.key} className="p-4 whitespace-nowrap">
                      {column.render ? column.render(row[column.key], row) : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {pagination && (
          <div className="flex items-center justify-between p-4 border-t">
            <div className="text-sm text-gray-600">
              Showing {pagination.currentPage * pagination.pageSize - pagination.pageSize + 1} to{' '}
              {Math.min(pagination.currentPage * pagination.pageSize, pagination.total)} of{' '}
              {pagination.total} results
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.currentPage === 1}
                onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.currentPage === pagination.totalPages}
                onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

DataTable.displayName = 'DataTable';

export default DataTable;
