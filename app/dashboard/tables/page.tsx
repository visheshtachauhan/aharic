import { TableManagement } from "@/components/dashboard/table-management";

export default function TablesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl">Table Management</h1>
        <p className="text-text-secondary mt-2">
          Manage your restaurant tables, their status, and reservations.
        </p>
      </div>
      
      <TableManagement />
    </div>
  );
} 