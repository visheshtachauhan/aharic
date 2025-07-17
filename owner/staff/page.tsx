import React from 'react';
import { Button } from '@/components/ui/button';

export default function StaffPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Staff Management</h1>
      <Button className="mb-4">Add Staff</Button>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Role</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="py-2 px-4 border-b">John Doe</td>
            <td className="py-2 px-4 border-b">Manager</td>
            <td className="py-2 px-4 border-b">john@example.com</td>
            <td className="py-2 px-4 border-b"><Button size="sm">Edit</Button></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
} 