'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import QRGenerator from '@/components/qr-generator';
import { Plus, Table as TableIcon, QrCode, Trash2, Grid, List, Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion, AnimatePresence } from 'framer-motion';

interface Table {
  _id: string;
  number: string;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved' | 'maintenance';
  location?: {
    floor?: string;
    section?: string;
    description?: string;
  };
  notes?: string;
  qrCode: string;
  lastUpdated?: Date;
}

export default function TablesPage() {
  const params = useParams();
  const [tables, setTables] = useState<Table[]>([]);
  const [filteredTables, setFilteredTables] = useState<Table[]>([]);
  const [showQRGenerator, setShowQRGenerator] = useState(false);
  const [showAddTable, setShowAddTable] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const [newTable, setNewTable] = useState({
    number: '',
    capacity: '',
    location: {
      floor: '',
      section: '',
      description: '',
    },
    notes: '',
  });

  const [activeQRCode, setActiveQRCode] = useState<string | null>(null);

  const fetchTables = useCallback(async () => {
    try {
      const response = await fetch(`/api/restaurants/${params.id}/tables`);
      if (!response.ok) throw new Error('Failed to fetch tables');
      const data = await response.json();
      setTables(data);
    } catch (error) {
      toast.error('Failed to fetch tables');
    } finally {
      setIsLoading(false);
    }
  }, [params.id]);

  const fetchRestaurant = useCallback(async () => {
    try {
      const response = await fetch(`/api/restaurants/${params.id}`);
      if (!response.ok) throw new Error('Failed to fetch restaurant');
      await response.json();
    } catch (error) {
      toast.error('Failed to fetch restaurant details');
    }
  }, [params.id]);

  useEffect(() => {
    fetchTables();
    fetchRestaurant();
  }, [fetchTables, fetchRestaurant]);

  const filterTables = useCallback(() => {
    let filtered = [...tables];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (table) =>
          table.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
          table.location?.section?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          table.location?.floor?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((table) => table.status === statusFilter);
    }

    // Sort tables by number
    filtered.sort((a, b) => {
      const numA = parseInt(a.number);
      const numB = parseInt(b.number);
      return numA - numB;
    });

    setFilteredTables(filtered);
  }, [tables, searchQuery, statusFilter]);

  useEffect(() => {
    filterTables();
  }, [filterTables]);

  const handleAddTable = async () => {
    if (!newTable.number.trim()) {
      toast.error('Table name cannot be empty');
      return;
    }
    try {
      const response = await fetch(`/api/restaurants/${params.id}/tables`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTable),
      });

      if (!response.ok) throw new Error('Failed to create table');

      toast.success('Table created successfully');

      setShowAddTable(false);
      setNewTable({
        number: '',
        capacity: '',
        location: {
          floor: '',
          section: '',
          description: '',
        },
        notes: '',
      });
      fetchTables();
    } catch (error) {
      toast.error('Failed to create table');
    }
  };

  const handleUpdateTableStatus = async (tableId: string, status: string) => {
    try {
      const response = await fetch(`/api/restaurants/${params.id}/tables`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tableId, status }),
      });

      if (!response.ok) throw new Error('Failed to update table');

      toast.success('Table status updated successfully');

      fetchTables();
    } catch (error) {
      toast.error('Failed to update table status');
    }
  };

  const handleDeleteTable = async (tableId: string) => {
    try {
      const response = await fetch(
        `/api/restaurants/${params.id}/tables?tableId=${tableId}`,
        { method: 'DELETE' }
      );

      if (!response.ok) throw new Error('Failed to delete table');

      toast.success('Table deleted successfully');

      fetchTables();
    } catch (error) {
      toast.error('Failed to delete table');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-emerald-500 text-white';
      case 'occupied':
        return 'bg-rose-500 text-white';
      case 'reserved':
        return 'bg-amber-500 text-white';
      case 'maintenance':
        return 'bg-slate-500 text-white';
      default:
        return 'bg-slate-500 text-white';
    }
  };

  const getCardStyle = (status: string) => {
    switch (status) {
      case 'available':
        return 'border-l-4 border-l-emerald-500 bg-emerald-50/30';
      case 'occupied':
        return 'border-l-4 border-l-rose-500 bg-rose-50/30';
      case 'reserved':
        return 'border-l-4 border-l-amber-500 bg-amber-50/30';
      case 'maintenance':
        return 'border-l-4 border-l-slate-500 bg-slate-50/30';
      default:
        return '';
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
        return 'Ready for guests';
      case 'occupied':
        return 'Currently in use';
      case 'reserved':
        return 'Reserved';
      case 'maintenance':
        return 'Under maintenance';
      default:
        return status;
    }
  };

  const TableCard = ({ table }: { table: Table }) => {
    const isQRVisible = activeQRCode === table._id;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="h-full"
      >
        <Card className={`shadow-lg hover:shadow-xl transition-all duration-200 ${getCardStyle(table.status)}`}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-2">
                  <TableIcon className="h-5 w-5 text-gray-500" />
                  <div>
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold">Table {table.number}</h3>
                      <Select 
                        value={table.status} 
                        onValueChange={(value) => handleUpdateTableStatus(table._id, value)}
                      >
                        <SelectTrigger className={`h-6 rounded-full px-3 py-0.5 text-[10px] uppercase font-medium tracking-wider ${getStatusColor(table.status)} hover:opacity-90 transition-all duration-200 border-none shadow-sm hover:shadow focus:ring-2 focus:ring-offset-1`}>
                          {getStatusText(table.status)}
                        </SelectTrigger>
                        <SelectContent className="rounded-lg border-none shadow-lg">
                          <SelectItem value="available" className="hover:bg-emerald-50">Available</SelectItem>
                          <SelectItem value="occupied" className="hover:bg-rose-50">Occupied</SelectItem>
                          <SelectItem value="reserved" className="hover:bg-amber-50">Reserved</SelectItem>
                          <SelectItem value="maintenance" className="hover:bg-slate-50">Maintenance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {[
                        table.location?.section,
                        table.location?.floor && `Floor ${table.location.floor}`
                      ].filter(Boolean).join(' • ')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Capacity</span>
              <div className="flex items-center space-x-1">
                <span className="font-medium">{table.capacity}</span>
                <span className="text-gray-500">seats</span>
              </div>
            </div>

            {table.notes && (
              <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded-md">
                <p className="font-medium mb-1">Notes:</p>
                <p className="text-gray-500">{table.notes}</p>
              </div>
            )}

            <div className="border-t pt-4">
              <button
                onClick={() => setActiveQRCode(isQRVisible ? null : table._id)}
                className="w-full px-4 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
              >
                <QrCode className="h-4 w-4" />
                <span>{isQRVisible ? 'Hide QR Code' : 'Show QR Code'}</span>
              </button>
            </div>

            <AnimatePresence>
              {isQRVisible && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="flex justify-center py-2">
                    <div className="bg-white rounded-lg shadow-sm p-4 border">
                      <QRGenerator value={table.qrCode} size={180} />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>

          <CardFooter className="flex justify-between pt-2 border-t">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDeleteTable(table._id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center md:space-y-0">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold">Tables Management</h1>
          <Button onClick={() => setShowAddTable(true)} size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Add Table
          </Button>
        </div>
        <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search tables..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="occupied">Occupied</SelectItem>
              <SelectItem value="reserved">Reserved</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center space-x-2 bg-gray-100 rounded-md p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {filteredTables.map((table) => (
            <TableCard key={table._id} table={table} />
          ))}
        </div>
      )}

      {/* QR Generator Modal */}
      <Dialog open={showQRGenerator} onOpenChange={setShowQRGenerator}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>QR Code</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <QRGenerator
              value={selectedTable?.qrCode || ''}
              size={300}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Table Modal */}
      <Dialog open={showAddTable} onOpenChange={setShowAddTable}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Table</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Table Number
                </label>
                <Input
                  value={newTable.number}
                  onChange={(e) =>
                    setNewTable({ ...newTable, number: e.target.value })
                  }
                  placeholder="Enter table number"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Capacity</label>
                <Input
                  type="number"
                  value={newTable.capacity}
                  onChange={(e) =>
                    setNewTable({ ...newTable, capacity: e.target.value })
                  }
                  placeholder="Enter capacity"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium">Floor</label>
                <Input
                  value={newTable.location.floor}
                  onChange={(e) =>
                    setNewTable({
                      ...newTable,
                      location: { ...newTable.location, floor: e.target.value },
                    })
                  }
                  placeholder="Enter floor"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Section</label>
                <Input
                  value={newTable.location.section}
                  onChange={(e) =>
                    setNewTable({
                      ...newTable,
                      location: { ...newTable.location, section: e.target.value },
                    })
                  }
                  placeholder="Enter section"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Notes</label>
              <Input
                value={newTable.notes}
                onChange={(e) =>
                  setNewTable({ ...newTable, notes: e.target.value })
                }
                placeholder="Enter notes (optional)"
              />
            </div>
            <Button onClick={handleAddTable} className="w-full">
              Add Table
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 