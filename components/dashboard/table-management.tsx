"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Edit,
  Trash2,
  Table as TableIcon,
  Grid,
  List,
  Users,
  Clock,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface TableItem {
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
  createdAt: string;
  updatedAt: string;
}

export function TableManagement() {
  const [tables, setTables] = useState<TableItem[]>([]);
  const [filteredTables, setFilteredTables] = useState<TableItem[]>([]);
  const [currentView] = useState<"all" | "available" | "occupied" | "reserved">("all");
  const [currentSection, setCurrentSection] = useState("All");
  const [editingTable, setEditingTable] = useState<TableItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [sections] = useState(["All", "Main Floor", "Patio", "Bar", "Private"]);

  // New table form state
  const [newTable, setNewTable] = useState<Partial<TableItem>>({
    number: "",
    capacity: 4,
    status: "available",
    location: {
      floor: "",
      section: "Main Floor",
      description: ""
    },
    notes: ""
  });

  const fetchTables = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/tables');
      if (!response.ok) {
        throw new Error('Failed to fetch tables');
      }
      const data = await response.json();
      if (data.success) {
        setTables(data.tables);
      } else {
        throw new Error(data.message || 'Failed to fetch tables');
      }
    } catch (error) {
      console.error('Error fetching tables:', error);
      toast.error('Failed to fetch tables');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const filterTables = useCallback(() => {
    let filtered = [...tables];

    // Apply view filter
    if (currentView !== "all") {
      filtered = filtered.filter(table => table.status === currentView);
    }

    // Apply section filter
    if (currentSection !== "All") {
      filtered = filtered.filter(table => table.location?.section === currentSection);
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(table =>
        table.number.toLowerCase().includes(query) ||
        table.location?.section?.toLowerCase().includes(query) ||
        table.location?.floor?.toLowerCase().includes(query) ||
        table.notes?.toLowerCase().includes(query)
      );
    }

    setFilteredTables(filtered);
  }, [tables, currentView, currentSection, searchQuery]);

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  useEffect(() => {
    filterTables();
  }, [filterTables]);

  const handleAdd = async () => {
    try {
      const response = await fetch('/api/admin/tables', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTable),
      });

      if (!response.ok) {
        throw new Error('Failed to add table');
      }

      const data = await response.json();
      if (data.success) {
        setTables([...tables, data.table]);
        setIsDialogOpen(false);
        setNewTable({
          number: "",
          capacity: 4,
          status: "available",
          location: {
            floor: "",
            section: "Main Floor",
            description: ""
          },
          notes: ""
        });
        toast.success("Table added successfully");
      } else {
        throw new Error(data.message || 'Failed to add table');
      }
    } catch (error) {
      console.error('Error adding table:', error);
      toast.error('Failed to add table');
    }
  };

  const handleEdit = (table: TableItem) => {
    setEditingTable(table);
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editingTable) return;

    try {
      const response = await fetch('/api/admin/tables', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingTable),
      });

      if (!response.ok) {
        throw new Error('Failed to update table');
      }

      const data = await response.json();
      if (data.success) {
        setTables(tables.map(table =>
          table._id === editingTable._id ? data.table : table
        ));
        setEditingTable(null);
        setIsDialogOpen(false);
        toast.success("Table updated successfully");
      } else {
        throw new Error(data.message || 'Failed to update table');
      }
    } catch (error) {
      console.error('Error updating table:', error);
      toast.error("Failed to update table.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/tables?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete table');
      }

      const data = await response.json();
      if (data.success) {
        setTables(tables.filter(table => table._id !== id));
        toast.success("Table deleted successfully");
      } else {
        throw new Error(data.message || 'Failed to delete table');
      }
    } catch (error) {
      console.error('Error deleting table:', error);
      toast.error("Failed to delete table.");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Available</Badge>;
      case 'occupied':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Occupied</Badge>;
      case 'reserved':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Reserved</Badge>;
      case 'maintenance':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Maintenance</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const TableCard = ({ table }: { table: TableItem }) => (
    <Card
      className={`overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
        table.status === 'occupied' ? 'bg-red-50' :
        table.status === 'reserved' ? 'bg-yellow-50' : 'bg-white'
      }`}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <TableIcon className="w-5 h-5 text-gray-500" />
              <h3 className="font-bold text-lg">{table.number}</h3>
            </div>
            <p className="text-sm text-gray-500">{table.location?.section}</p>
          </div>
          {getStatusBadge(table.status)}
        </div>
        <div className="mt-4 space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>Capacity: {table.capacity}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Updated: {new Date(table.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <Button size="sm" variant="outline" className="w-full" onClick={() => handleEdit(table)}>
            <Edit className="w-4 h-4 mr-2" /> Edit
          </Button>
          <Button size="sm" variant="destructive-outline" className="w-full" onClick={() => handleDelete(table._id)}>
            <Trash2 className="w-4 h-4 mr-2" /> Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const TableRowComponent = ({ table }: { table: TableItem }) => (
    <TableRow key={table._id}>
      <TableCell>{table.number}</TableCell>
      <TableCell>{table.capacity}</TableCell>
      <TableCell>{getStatusBadge(table.status)}</TableCell>
      <TableCell>{table.location?.section}</TableCell>
      <TableCell>{new Date(table.updatedAt).toLocaleDateString()}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => handleEdit(table)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleDelete(table._id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );


  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {[...Array(10)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="flex justify-end gap-2 mt-4">
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }
    
    if (viewMode === 'list') {
      return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Number</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Section</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTables.map(table => (
              <TableRowComponent key={table._id} table={table} />
            ))}
          </TableBody>
        </Table>
      )
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {filteredTables.map(table => (
          <TableCard key={table._id} table={table} />
        ))}
      </div>
    );
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith("location.")) {
      const field = name.split(".")[1];
      if (editingTable) {
        setEditingTable({
          ...editingTable,
          location: { ...editingTable.location, [field]: value }
        });
      } else {
        setNewTable({
          ...newTable,
          location: { ...newTable.location, [field]: value }
        });
      }
    } else {
      if (editingTable) {
        setEditingTable({ ...editingTable, [name]: value });
      } else {
        setNewTable({ ...newTable, [name]: value });
      }
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <Card>
        <CardHeader>
          <CardTitle>Table Management</CardTitle>
          <CardDescription>
            View, add, edit, and manage your restaurant's tables.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <div className="flex-1 max-w-sm">
              <Input
                placeholder="Search tables by number, section, etc."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "grid" | "list")}>
                <TabsList>
                  <TabsTrigger value="grid"><Grid className="h-4 w-4" /></TabsTrigger>
                  <TabsTrigger value="list"><List className="h-4 w-4" /></TabsTrigger>
                </TabsList>
              </Tabs>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingTable(null)}>
                  <Plus className="mr-2 h-4 w-4" /> Add Table
                </Button>
              </DialogTrigger>
            </div>
          </div>

          <Tabs value={currentSection} onValueChange={setCurrentSection} className="mb-4">
            <TabsList>
              {sections.map(section => (
                <TabsTrigger key={section} value={section}>{section}</TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {renderContent()}
        </CardContent>
      </Card>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingTable ? "Edit Table" : "Add New Table"}</DialogTitle>
          <DialogDescription>
            {editingTable ? "Update the details of this table." : "Fill in the details for the new table."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="number" className="text-right">Number</Label>
            <Input id="number" name="number" value={editingTable?.number || newTable.number} onChange={handleFormChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="capacity" className="text-right">Capacity</Label>
            <Input id="capacity" name="capacity" type="number" value={editingTable?.capacity || newTable.capacity} onChange={handleFormChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="location.section" className="text-right">Section</Label>
            <Input id="location.section" name="location.section" value={editingTable?.location?.section || newTable.location?.section} onChange={handleFormChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="notes" className="text-right">Notes</Label>
            <Textarea id="notes" name="notes" value={editingTable?.notes || newTable.notes} onChange={handleFormChange} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={editingTable ? handleSave : handleAdd}>
            {editingTable ? "Save Changes" : "Add Table"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}