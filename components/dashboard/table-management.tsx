"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Table as TableIcon,
  Grid,
  List,
  Users,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
  DialogDescription
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";

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

// Add AvailableTableNumbers component
const AvailableTableNumbers = ({ tables }: { tables: TableItem[] }) => {
  const availableTables = tables
    .filter(table => table.status === "available")
    .sort((a, b) => parseInt(a.number) - parseInt(b.number));

  return (
    <div className="mb-4">
      <h3 className="text-sm font-medium mb-2">Available Tables</h3>
      <div className="flex flex-wrap gap-2">
        {availableTables.map((table) => (
          <Badge
            key={table._id}
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200 text-xs"
          >
            {table.number}
          </Badge>
        ))}
        {availableTables.length === 0 && (
          <span className="text-sm text-muted-foreground">No tables available</span>
        )}
      </div>
    </div>
  );
};

export function TableManagement() {
  const [tables, setTables] = useState<TableItem[]>([]);
  const [filteredTables, setFilteredTables] = useState<TableItem[]>([]);
  const [currentView, setCurrentView] = useState<"all" | "available" | "occupied" | "reserved">("all");
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

  useEffect(() => {
    fetchTables();
  }, []);

  useEffect(() => {
    filterTables();
  }, [tables, currentView, currentSection, searchQuery]);

  const fetchTables = async () => {
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
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to fetch tables',
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterTables = () => {
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
  };

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
        toast({
          title: "Success",
          description: "Table added successfully",
        });
      } else {
        throw new Error(data.message || 'Failed to add table');
      }
    } catch (error) {
      console.error('Error adding table:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to add table',
        variant: "destructive"
      });
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
        toast({
          title: "Success",
          description: "Table updated successfully",
        });
      } else {
        throw new Error(data.message || 'Failed to update table');
      }
    } catch (error) {
      console.error('Error updating table:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to update table',
        variant: "destructive"
      });
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
        toast({
          title: "Success",
          description: "Table deleted successfully",
        });
      } else {
        throw new Error(data.message || 'Failed to delete table');
      }
    } catch (error) {
      console.error('Error deleting table:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to delete table',
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      available: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      occupied: { color: "bg-red-100 text-red-800", icon: Users },
      reserved: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
      maintenance: { color: "bg-gray-100 text-gray-800", icon: AlertCircle }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    if (!config) return null;

    const Icon = config.icon;
    return (
      <Badge variant="secondary" className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="flex gap-2">
          <Tabs value={currentView} onValueChange={(value) => setCurrentView(value as any)}>
            <TabsList>
              <TabsTrigger value="all">All Tables</TabsTrigger>
              <TabsTrigger value="available">Available</TabsTrigger>
              <TabsTrigger value="occupied">Occupied</TabsTrigger>
              <TabsTrigger value="reserved">Reserved</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex items-center gap-2">
            <span className="text-sm">Section:</span>
            <select
              className="rounded-md border border-input bg-background px-3 py-1 text-sm"
              value={currentSection}
              onChange={(e) => setCurrentSection(e.target.value)}
            >
              {sections.map((section) => (
                <option key={section} value={section}>
                  {section}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tables..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          
          <div className="flex items-center gap-2">
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
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Table
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingTable ? "Edit Table" : "Add New Table"}</DialogTitle>
                <DialogDescription>
                  {editingTable 
                    ? "Update table information and status." 
                    : "Create a new table for your restaurant."}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="number">Table Number</Label>
                    <Input
                      id="number"
                      placeholder="1"
                      value={editingTable ? editingTable.number : newTable.number}
                      onChange={(e) => editingTable
                        ? setEditingTable({...editingTable, number: e.target.value})
                        : setNewTable({...newTable, number: e.target.value})
                      }
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Capacity</Label>
                    <Input
                      id="capacity"
                      type="number"
                      min="1"
                      max="20"
                      placeholder="4"
                      value={editingTable ? editingTable.capacity : newTable.capacity}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 1;
                        editingTable
                          ? setEditingTable({...editingTable, capacity: value})
                          : setNewTable({...newTable, capacity: value});
                      }}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="section">Section</Label>
                  <select
                    id="section"
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    value={editingTable ? editingTable.location?.section : newTable.location?.section}
                    onChange={(e) => editingTable
                      ? setEditingTable({
                          ...editingTable,
                          location: { ...editingTable.location, section: e.target.value }
                        })
                      : setNewTable({
                          ...newTable,
                          location: { ...newTable.location, section: e.target.value }
                        })
                    }
                  >
                    {sections.filter(s => s !== "All").map((section) => (
                      <option key={section} value={section}>
                        {section}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Special features or location details"
                    value={editingTable ? editingTable.location?.description : newTable.location?.description}
                    onChange={(e) => editingTable
                      ? setEditingTable({
                          ...editingTable,
                          location: { ...editingTable.location, description: e.target.value }
                        })
                      : setNewTable({
                          ...newTable,
                          location: { ...newTable.location, description: e.target.value }
                        })
                    }
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Additional notes about the table"
                    value={editingTable ? editingTable.notes : newTable.notes}
                    onChange={(e) => editingTable
                      ? setEditingTable({...editingTable, notes: e.target.value})
                      : setNewTable({...newTable, notes: e.target.value})
                    }
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button
                  type="submit"
                  onClick={editingTable ? handleSave : handleAdd}
                  disabled={
                    (editingTable ? !editingTable.number : !newTable.number) ||
                    (editingTable ? !editingTable.capacity : !newTable.capacity)
                  }
                >
                  {editingTable ? "Save Changes" : "Add Table"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {filteredTables.length === 0 ? (
        <div className="text-center py-12">
          <TableIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
          <p className="text-muted-foreground">No tables found.</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredTables.map(table => (
            <Card key={table._id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg flex items-center gap-2">
                    Table {table.number}
                    <span className="text-sm font-normal text-muted-foreground">
                      ({table.capacity} {table.capacity === 1 ? "seat" : "seats"})
                    </span>
                  </CardTitle>
                  {getStatusBadge(table.status)}
                </div>
                <CardDescription>{table.location?.section}</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {table.location?.description && (
                  <p className="text-sm text-muted-foreground">
                    {table.location.description}
                  </p>
                )}
                
                {table.notes && (
                  <div className="text-sm bg-muted/50 p-2 rounded-md">
                    <p className="font-medium mb-1">Notes:</p>
                    <p className="text-muted-foreground">{table.notes}</p>
                  </div>
                )}
                
                <div className="flex justify-end gap-2 pt-2 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(table)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(table._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left p-3 font-medium">Table</th>
                <th className="text-left p-3 font-medium">Capacity</th>
                <th className="text-left p-3 font-medium">Section</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="text-left p-3 font-medium">Last Updated</th>
                <th className="text-right p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTables.map((table, index) => (
                <tr key={table._id} className={index % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                  <td className="p-3 font-medium">{table.number}</td>
                  <td className="p-3">{table.capacity}</td>
                  <td className="p-3">{table.location?.section}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      {getStatusBadge(table.status)}
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="text-xs text-muted-foreground">
                      {new Date(table.updatedAt).toLocaleString()}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(table)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(table._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 