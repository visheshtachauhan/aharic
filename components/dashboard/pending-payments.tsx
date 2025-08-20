// Product-approved Dashboard overview. Do NOT remove these panels (KPIs, Revenue Trend, Top Items, Payments, Recent Orders). Changes must preserve this composition.
"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  AlarmClock, 
  AlertCircle, 
  ChevronRight, 
  Clock, 
  Filter, 
  IndianRupee,
  MoreVertical, 
  Send
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar } from "@/components/ui/avatar";
import { RupeeIcon } from "@/components/icons/rupee-icon";

interface PendingPayment {
  id: string;
  customerName: string;
  customerAvatar: string | null;
  amount: number;
  dueDate: string;
  status: "overdue" | "due-soon" | "pending";
  orderNumber: string;
  paymentType: "table" | "online" | "takeaway";
  daysPending: number;
}

// Client-safe logger (avoid importing server-only logger in client bundles)
const logger = {
  info: (...args: any[]) => console.info('[pending-payments]', ...args),
  error: (...args: any[]) => console.error('[pending-payments]', ...args),
  warn: (...args: any[]) => console.warn('[pending-payments]', ...args),
};

export function PendingPayments() {
  const [payments, setPayments] = useState<PendingPayment[]>([
    {
      id: "pay-1",
      customerName: "Raj Malhotra",
      customerAvatar: null,
      amount: 2490,
      dueDate: "2023-04-10T15:30:00Z",
      status: "overdue",
      orderNumber: "ORD-78943",
      paymentType: "table",
      daysPending: 5
    },
    {
      id: "pay-2",
      customerName: "Sunita Kapoor",
      customerAvatar: "/avatars/sunita.jpg",
      amount: 3750,
      dueDate: "2023-04-12T18:45:00Z",
      status: "due-soon",
      orderNumber: "ORD-78965",
      paymentType: "online",
      daysPending: 1
    },
    {
      id: "pay-3",
      customerName: "Amit Patel",
      customerAvatar: "/avatars/amit.jpg",
      amount: 1750,
      dueDate: "2023-04-15T12:15:00Z",
      status: "pending",
      orderNumber: "ORD-79012",
      paymentType: "table",
      daysPending: 2
    },
    {
      id: "pay-4",
      customerName: "Geeta Singh",
      customerAvatar: null,
      amount: 850,
      dueDate: "2023-04-08T20:30:00Z",
      status: "overdue",
      orderNumber: "ORD-78912",
      paymentType: "takeaway",
      daysPending: 8
    },
    {
      id: "pay-5",
      customerName: "Vikram Reddy",
      customerAvatar: "/avatars/vikram.jpg",
      amount: 4250,
      dueDate: "2023-04-13T14:00:00Z",
      status: "due-soon",
      orderNumber: "ORD-78980",
      paymentType: "online",
      daysPending: 1
    }
  ]);

  const [filter, setFilter] = useState<"all" | "overdue" | "due-soon" | "pending">("all");
  
  const filteredPayments = payments.filter(payment => {
    if (filter === "all") return true;
    return payment.status === filter;
  });
  
  // Calculate totals
  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const overdueAmount = payments
    .filter(payment => payment.status === "overdue")
    .reduce((sum, payment) => sum + payment.amount, 0);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount).replace('₹', '');
  };
  
  const handleSendReminder = (id: string) => {
    logger.info('Sending payment reminder', { paymentId: id });
    // Implement reminder logic here
  };
  
  const handleMarkAsPaid = (id: string) => {
    setPayments(payments.filter(payment => payment.id !== id));
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">
          <div className="flex items-center gap-2">
            Pending Payments
            <Badge variant="destructive" className="rounded-full px-2 py-0 text-xs">
              {payments.length}
            </Badge>
          </div>
        </CardTitle>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <Filter className="h-3.5 w-3.5" />
                <span>Filter</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilter("all")}>
                All Payments
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("overdue")}>
                Overdue
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("due-soon")}>
                Due Soon
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("pending")}>
                Pending
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="px-0 pb-2">
        <div className="grid grid-cols-2 gap-4 mb-4 px-4">
          <div className="flex items-center p-3 border rounded-lg bg-gray-50">
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Total Pending</span>
              <div className="flex items-center mt-1">
                <RupeeIcon className="h-4 w-4 mr-1 text-primary" />
                <span className="text-xl font-bold">{formatCurrency(totalAmount)}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center p-3 border rounded-lg bg-red-50">
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Overdue Amount</span>
              <div className="flex items-center mt-1">
                <RupeeIcon className="h-4 w-4 mr-1 text-red-600" />
                <span className="text-xl font-bold text-red-600">{formatCurrency(overdueAmount)}</span>
              </div>
            </div>
          </div>
        </div>
        
        {filteredPayments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <IndianRupee className="h-12 w-12 mx-auto mb-2 opacity-20" />
            <p>No pending payments found</p>
          </div>
        ) : (
          <div className="divide-y">
            {filteredPayments.map((payment) => (
              <div key={payment.id} className="px-4 py-3 hover:bg-muted/20">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      {payment.customerAvatar ? (
                        <Image 
                          src={payment.customerAvatar} 
                          alt={payment.customerName}
                          width={40}
                          height={40}
                          className="rounded-full"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.srcset = `https://ui-avatars.com/api/?name=${encodeURIComponent(payment.customerName)}&background=random`;
                          }}
                        />
                      ) : (
                        <Image 
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(payment.customerName)}&background=random`}
                          alt={payment.customerName}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      )}
                    </Avatar>
                    <div>
                      <div className="flex items-center">
                        <p className="font-medium">{payment.customerName}</p>
                        <span className="mx-2 text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground">#{payment.orderNumber.split('-')[1]}</span>
                      </div>
                      <div className="flex items-center mt-1">
                        <Badge
                          variant="outline"
                          className={`
                            ${payment.status === "overdue" ? "bg-red-50 text-red-700 border-red-200" : 
                              payment.status === "due-soon" ? "bg-yellow-50 text-yellow-700 border-yellow-200" : 
                              "bg-blue-50 text-blue-700 border-blue-200"}
                          `}
                        >
                          {payment.status === "overdue" ? (
                            <AlertCircle className="h-3 w-3 mr-1" />
                          ) : payment.status === "due-soon" ? (
                            <AlarmClock className="h-3 w-3 mr-1" />
                          ) : (
                            <Clock className="h-3 w-3 mr-1" />
                          )}
                          {payment.status === "overdue" 
                            ? `Overdue by ${payment.daysPending} day${payment.daysPending !== 1 ? 's' : ''}` 
                            : payment.status === "due-soon" 
                            ? "Due Soon" 
                            : `Due in ${payment.daysPending} day${payment.daysPending !== 1 ? 's' : ''}`}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="ml-2"
                        >
                          {payment.paymentType === "table" ? "Table" : 
                           payment.paymentType === "online" ? "Online" : "Takeaway"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center mb-1">
                      <RupeeIcon className="h-3.5 w-3.5 mr-0.5 text-primary" />
                      <span className="font-bold">{formatCurrency(payment.amount)}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Due: {formatDate(payment.dueDate)}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end mt-2 gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleSendReminder(payment.id)}
                    className="h-8 text-xs"
                  >
                    <Send className="h-3 w-3 mr-1" /> 
                    Send Reminder
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm" 
                    onClick={() => handleMarkAsPaid(payment.id)}
                    className="h-8 text-xs"
                  >
                    Mark as Paid
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Edit Payment</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        Write Off
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="text-center pt-2 pb-1">
          <Button variant="ghost" size="sm" className="text-sm text-muted-foreground">
            View All Payments <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 