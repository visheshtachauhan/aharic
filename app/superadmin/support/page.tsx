'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'react-hot-toast';

interface SupportRequest {
  _id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'new' | 'pending' | 'in_progress' | 'resolved';
  createdAt: string;
  restaurantId: string;
  source: 'platform' | 'restaurant';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  assignedTo: string | null;
  notes: Array<{
    text: string;
    createdAt: string;
    createdBy: string;
  }>;
  response?: string;
}

interface Restaurant {
  _id: string;
  name: string;
}

export default function SuperAdminSupportPage() {
  const [supportRequests, setSupportRequests] = useState<SupportRequest[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [restaurantFilter, setRestaurantFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<SupportRequest | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [requestsRes, restaurantsRes] = await Promise.all([
        fetch('/api/superadmin/support/requests'),
        fetch('/api/superadmin/restaurants')
      ]);
      
      const [requestsData, restaurantsData] = await Promise.all([
        requestsRes.json(),
        restaurantsRes.json()
      ]);

      setSupportRequests(requestsData.requests);
      setRestaurants(restaurantsData.restaurants);
    } catch (error) {
      toast.error(`Error fetching data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const updateRequest = async (requestId: string, updates: Partial<SupportRequest>) => {
    try {
      const response = await fetch(`/api/superadmin/support/requests/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        toast.success('Request updated successfully');
        fetchData();
      } else {
        const errorData = await response.json();
        toast.error(`Failed to update request: ${errorData.message}`);
      }
    } catch (error) {
      toast.error(`Error updating request: ${error.message}`);
    }
  };

  const addNote = async (requestId: string, note: string) => {
    try {
      const response = await fetch(`/api/superadmin/support/requests/${requestId}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ note }),
      });

      if (response.ok) {
        fetchData();
        toast.success('Note added successfully');
      }
    } catch (error) {
      toast.error(`Error adding note: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-purple-100 text-purple-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'bg-gray-100 text-gray-800';
      case 'normal':
        return 'bg-blue-100 text-blue-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'urgent':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredRequests = supportRequests
    .filter(request => {
      if (statusFilter === 'all') return true;
      return request.status === statusFilter;
    })
    .filter(request => {
      if (restaurantFilter === 'all') return true;
      return request.restaurantId === restaurantFilter;
    })
    .filter(request => {
      if (sourceFilter === 'all') return true;
      return request.source === sourceFilter;
    })
    .filter(request => {
      if (priorityFilter === 'all') return true;
      return request.priority === priorityFilter;
    })
    .filter(request =>
      search
        ? request.subject.toLowerCase().includes(search.toLowerCase()) ||
          request.message.toLowerCase().includes(search.toLowerCase()) ||
          request.name.toLowerCase().includes(search.toLowerCase()) ||
          request.email.toLowerCase().includes(search.toLowerCase())
        : true
    );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Support Requests Management</h1>
        <div className="flex gap-2">
          <Badge className="text-lg py-2">{supportRequests.length} Total Requests</Badge>
          <Badge variant="outline" className="text-lg py-2">
            {supportRequests.filter(r => r.status !== 'resolved').length} Open
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <Input
          placeholder="Search requests..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>

        <Select value={restaurantFilter} onValueChange={setRestaurantFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by restaurant" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Restaurants</SelectItem>
            <SelectItem value="platform">Platform Issues</SelectItem>
            {restaurants.map(restaurant => (
              <SelectItem key={restaurant._id} value={restaurant._id}>
                {restaurant.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sourceFilter} onValueChange={setSourceFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>
            <SelectItem value="platform">Platform</SelectItem>
            <SelectItem value="restaurant">Restaurant</SelectItem>
          </SelectContent>
        </Select>

        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredRequests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  No support requests found
                </TableCell>
              </TableRow>
            ) : (
              filteredRequests.map((request) => (
                <TableRow 
                  key={request._id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => setSelectedRequest(request)}
                >
                  <TableCell>
                    {format(new Date(request.createdAt), 'MMM d, yyyy HH:mm')}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {request.source === 'platform' ? 'Platform' : 
                        restaurants.find(r => r._id === request.restaurantId)?.name || 'Unknown Restaurant'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{request.name}</div>
                      <div className="text-sm text-gray-500">{request.email}</div>
                      {request.phone && (
                        <div className="text-sm text-gray-500">{request.phone}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-md">
                    <div className="font-medium">{request.subject}</div>
                    <div className="truncate text-sm text-gray-500">{request.message}</div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(request.status)}>
                      {request.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(request.priority)}>
                      {request.priority.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Select
                        value={request.status}
                        onValueChange={(value: 'new' | 'pending' | 'in_progress' | 'resolved') => 
                          updateRequest(request._id, { status: value })}
                      >
                        <SelectTrigger className="w-[130px]">
                          <SelectValue placeholder="Update status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select
                        value={request.priority}
                        onValueChange={(value: 'low' | 'normal' | 'high' | 'urgent') => 
                          updateRequest(request._id, { priority: value })}
                      >
                        <SelectTrigger className="w-[130px]">
                          <SelectValue placeholder="Set priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="max-w-3xl">
          {selectedRequest && (
            <>
              <DialogHeader>
                <DialogTitle>Support Request Details</DialogTitle>
                <DialogDescription>
                  Request ID: {selectedRequest._id}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Request Information</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-500">Date:</span>
                      <p>{format(new Date(selectedRequest.createdAt), 'PPpp')}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Subject:</span>
                      <p className="font-medium">{selectedRequest.subject}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Message:</span>
                      <p className="whitespace-pre-wrap">{selectedRequest.message}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getStatusColor(selectedRequest.status)}>
                        {selectedRequest.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <Badge className={getPriorityColor(selectedRequest.priority)}>
                        {selectedRequest.priority.toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="font-semibold mb-2">Contact Information</h3>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-gray-500">Name:</span>
                        <p>{selectedRequest.name}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Email:</span>
                        <p>{selectedRequest.email}</p>
                      </div>
                      {selectedRequest.phone && (
                        <div>
                          <span className="text-sm text-gray-500">Phone:</span>
                          <p>{selectedRequest.phone}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="mb-6">
                    <h3 className="font-semibold mb-2">Response to Customer</h3>
                    <Textarea
                      placeholder="Type your response to the customer..."
                      value={selectedRequest.response || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        updateRequest(selectedRequest._id, { response: value });
                      }}
                      className="min-h-[100px]"
                    />
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Internal Notes</h3>
                    <div className="space-y-2 mb-4 max-h-[200px] overflow-y-auto">
                      {selectedRequest.notes?.map((note, index) => (
                        <div key={index} className="bg-gray-50 p-2 rounded">
                          <p className="text-sm whitespace-pre-wrap">{note.text}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {format(new Date(note.createdAt), 'PPp')} by {note.createdBy}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a note..."
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            const input = e.target as HTMLInputElement;
                            if (input.value.trim()) {
                              addNote(selectedRequest._id, input.value.trim());
                              input.value = '';
                            }
                          }
                        }}
                      />
                      <Button
                        onClick={() => {
                          const input = document.querySelector('input[placeholder="Add a note..."]') as HTMLInputElement;
                          if (input.value.trim()) {
                            addNote(selectedRequest._id, input.value.trim());
                            input.value = '';
                          }
                        }}
                      >
                        Add Note
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 