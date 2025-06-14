import { TableManagement } from "@/components/dashboard/table-management";
import { Card } from "@/components/ui/card";
import { Table, Users } from "lucide-react";

export default function TablesPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start">
        <div>
          <h1 className="text-2xl font-semibold">Table Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage your restaurant tables and track their status
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <Table className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Available</p>
              <p className="text-xl font-semibold text-green-600">4 Tables</p>
            </div>
          </Card>
          
          <Card className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Occupied</p>
              <p className="text-xl font-semibold text-orange-600">3 Tables</p>
            </div>
          </Card>
        </div>
      </div>
      
      <TableManagement />
    </div>
  );
} 