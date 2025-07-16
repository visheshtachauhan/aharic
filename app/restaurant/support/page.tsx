'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface SupportRequest {
  _id: string;
  subject: string;
  message: string;
  status: 'new' | 'pending' | 'in_progress' | 'resolved';
  createdAt: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  response?: string;
}

export default function RestaurantSupportPage() {
  const [supportRequests, setSupportRequests] = useState<SupportRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchSupportRequests();
  }, []);

  const fetchSupportRequests = async () => {
    try {
      const response = await fetch('/api/restaurant/support/requests');
      const data = await response.json();
      if (data.success) {
        setSupportRequests(data.requests);
      }
    } catch (error) {
      console.error('Error fetching support requests:', error);
      toast.error('Failed to load support requests');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitSupport = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      subject: formData.get("subject")?.toString().trim(),
      message: formData.get("message")?.toString().trim(),
    };

    if (!data.subject || !data.message) {
      toast.error("Please fill in all required fields.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/support', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to submit support request');
      }
      
      toast.success("Support request submitted successfully! We'll get back to you soon.");
      fetchSupportRequests(); // Refresh the list
      
      // Reset form and close dialog
      e.currentTarget.reset();
      const dialogTrigger = document.querySelector('[data-state="open"]');
      if (dialogTrigger) {
        const closeEvent = new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
        });
        dialogTrigger.dispatchEvent(closeEvent);
      }
    } catch (e: unknown) {
      const error = e as Error;
      console.error('Support request error:', error);
      toast.error(error.message || "Failed to submit support request. Please try again.");
    } finally {
      setIsSubmitting(false);
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

  const filteredRequests = supportRequests.filter(request =>
    search
      ? request.subject.toLowerCase().includes(search.toLowerCase()) ||
        request.message.toLowerCase().includes(search.toLowerCase())
      : true
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Support Requests</h1>
        <div className="flex gap-4">
          <Badge variant="outline" className="text-lg py-2">
            {supportRequests.filter(r => r.status !== 'resolved').length} Open Requests
          </Badge>
          <Dialog>
            <DialogTrigger asChild>
              <Button>New Support Request</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <form onSubmit={handleSubmitSupport}>
                <DialogHeader>
                  <DialogTitle>Submit Support Request</DialogTitle>
                  <DialogDescription>
                    Send us a message and we'll get back to you as soon as possible.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="What can we help you with?"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tell us more about your issue..."
                      className="min-h-[100px]"
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Sending..." : "Send Request"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <Input
          placeholder="Search requests..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Response</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredRequests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  No support requests found
                </TableCell>
              </TableRow>
            ) : (
              filteredRequests.map((request) => (
                <TableRow key={request._id}>
                  <TableCell>
                    {format(new Date(request.createdAt), 'MMM d, yyyy HH:mm')}
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
                  <TableCell className="max-w-md">
                    {request.response ? (
                      <div className="text-sm">{request.response}</div>
                    ) : (
                      <div className="text-sm text-gray-500">Awaiting response</div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}