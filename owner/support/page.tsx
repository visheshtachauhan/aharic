import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface SupportTicket {
  id: string;
  subject: string;
  status: string;
  createdAt: string;
}

const mockTickets: SupportTicket[] = [
  { id: '1', subject: 'Printer not working', status: 'Open', createdAt: '2024-07-23' },
  { id: '2', subject: 'Menu update request', status: 'Closed', createdAt: '2024-07-22' },
];

export default function OwnerSupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);

  useEffect(() => {
    setTickets(mockTickets);
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Support Tickets</h1>
      <Card>
        <CardHeader>
          <CardTitle>Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Subject</th>
                <th className="py-2 px-4 border-b">Status</th>
                <th className="py-2 px-4 border-b">Created At</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map(ticket => (
                <tr key={ticket.id}>
                  <td className="py-2 px-4 border-b">{ticket.subject}</td>
                  <td className="py-2 px-4 border-b">{ticket.status}</td>
                  <td className="py-2 px-4 border-b">{ticket.createdAt}</td>
                  <td className="py-2 px-4 border-b"><Button size="sm">View</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
} 