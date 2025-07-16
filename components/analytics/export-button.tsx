'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/components/ui/notification';
import { Download } from 'lucide-react';

type ExportableData = Record<string, unknown> | Array<Record<string, unknown>>;

interface ExportButtonProps {
  data: ExportableData;
  filename?: string;
}

export function ExportButton({ data, filename = 'analytics-data' }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const { addNotification } = useNotifications();

  const handleExport = async () => {
    try {
      setIsExporting(true);

      // Convert data to CSV format
      const csvContent = convertToCSV(data);
      
      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      addNotification({
        title: 'Success',
        message: 'Data exported successfully',
        type: 'success'
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to export data';
      console.error('Export failed:', errorMessage);
      addNotification({
        title: 'Error',
        message: errorMessage,
        type: 'error'
      });
    } finally {
      setIsExporting(false);
    }
  };

  const convertToCSV = (data: ExportableData): string => {
    // Handle different data types
    if (Array.isArray(data)) {
      if (data.length === 0) return '';
      
      // Get headers from first object
      const headers = Object.keys(data[0]);
      
      // Create CSV rows
      const rows = data.map(item => 
        headers.map(header => {
          const value = item[header];
          // Handle special cases
          if (typeof value === 'object') return JSON.stringify(value);
          if (typeof value === 'string' && value.includes(',')) return `"${value}"`;
          return value;
        }).join(',')
      );
      
      return [headers.join(','), ...rows].join('\n');
    }
    
    // Handle single object
    const headers = Object.keys(data);
    const values = headers.map(header => {
      const value = data[header];
      if (typeof value === 'object') return JSON.stringify(value);
      if (typeof value === 'string' && value.includes(',')) return `"${value}"`;
      return value;
    });
    
    return [headers.join(','), values.join(',')].join('\n');
  };

  return (
    <Button
      onClick={handleExport}
      disabled={isExporting}
      variant="outline"
      className="flex items-center gap-2"
    >
      <Download className="w-4 h-4" />
      {isExporting ? 'Exporting...' : 'Export Data'}
    </Button>
  );
} 