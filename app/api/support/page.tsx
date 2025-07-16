'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Loader2, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

// Define the type for a support request
interface SupportRequest {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'new' | 'in_progress' | 'resolved';
}

export default function SupportPage() {
  const [requests, setRequests] = useState<SupportRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<SupportRequest | null>(null);

  async function fetchRequests() {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/support');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch support requests');
      }
      const data = await response.json();
      setRequests(data);
    } catch (e: unknown) {
      const err = e as Error;
      console.error(err);
      setError(err.message);
      toast.error('Could not load support requests.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRequests();
  }, []);

  const getStatusVariant = (status: SupportRequest['status']) => {
    switch (status) {
      case 'new':
        return 'destructive';
      case 'in_progress':
        return 'default';
      case 'resolved':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const handleViewDetails = (request: SupportRequest) => {
    setSelectedRequest(request);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <Loader2 className="h-16 w-16 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)] text-red-500">
        <AlertCircle className="h-12 w-12 mb-4" />
        <h2 className="text-xl font-semibold mb-2">An Error Occurred</h2>
        <p>{error}</p>
        <Button onClick={fetchRequests} className="mt-4">Try Again</Button>
      </div>
    );
  }

  return (
    <>
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Support Inbox</CardTitle>
            <CardDescription>
              Manage and respond to user support requests.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Received</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.length > 0 ? (
                  requests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <Badge variant={getStatusVariant(request.status)} className="capitalize">
                          {request.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{request.name}</div>
                        <div className="text-sm text-muted-foreground">{request.email}</div>
                      </TableCell>
                      <TableCell>{request.subject}</TableCell>
                      <TableCell>
                        {new Date(request.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => handleViewDetails(request)}>
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No support requests found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!selectedRequest} onOpenChange={(isOpen) => !isOpen && setSelectedRequest(null)}>
        <DialogContent className="sm:max-w-lg">
            {selectedRequest && (
              <>
                <DialogHeader>
                  <DialogTitle>Support Request Details</DialogTitle>
                  <DialogDescription>
                    From: {selectedRequest.name} ({selectedRequest.email})
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <div className="space-y-1">
                        <h4 className="font-semibold">Subject</h4>
                        <p className="text-sm text-muted-foreground">{selectedRequest.subject}</p>
                    </div>
                    {selectedRequest.phone && (
                      <div className="space-y-1">
                          <h4 className="font-semibold">Phone</h4>
                          <p className="text-sm text-muted-foreground">{selectedRequest.phone}</p>
                      </div>
                    )}
                    <div className="space-y-1">
                        <h4 className="font-semibold">Message</h4>
                        <p className="text-sm text-muted-foreground bg-gray-50 p-3 rounded-md border">
                          {selectedRequest.message}
                        </p>
                    </div>
                     <div className="flex items-center space-x-2">
                        <h4 className="font-semibold">Status:</h4>
                        <Badge variant={getStatusVariant(selectedRequest.status)} className="capitalize">
                            {selectedRequest.status}
                        </Badge>
                    </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setSelectedRequest(null)}>Close</Button>
                </DialogFooter>
              </>
            )}
        </DialogContent>
      </Dialog>
    </>
  );
}