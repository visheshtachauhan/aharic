'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { menuItems } from "@/config/menu-items";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";
import dynamic from 'next/dynamic';

// Dynamically import the Dialog component with no SSR
const DynamicDialog = dynamic(
  () => import('@/components/ui/dialog').then((mod) => mod.Dialog),
  { ssr: false }
);

export function Sidebar() {
  const pathname = usePathname();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSubmitSupport = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const form = e.currentTarget;
      const formData = new FormData(form);
      
      const data = {
        name: formData.get("name")?.toString().trim() || '',
        email: formData.get("email")?.toString().trim() || '',
        phone: formData.get("phone")?.toString().trim() || '',
        subject: formData.get("subject")?.toString().trim() || '',
        message: formData.get("message")?.toString().trim() || '',
      };

      if (!data.name || !data.email || !data.subject || !data.message) {
        toast.error("Please fill in all required fields");
        setIsSubmitting(false);
        return;
      }

      if (data.message.length < 10) {
        toast.error("Message must be at least 10 characters long");
        setIsSubmitting(false);
        return;
      }

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
      form.reset();
      setIsDialogOpen(false);
    } catch (e: unknown) {
      const error = e as Error;
      console.error('Support request error:', error);
      toast.error(error.message || "Failed to submit support request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderSupportDialog = () => {
    if (!isMounted) return null;

    return (
      <DynamicDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSubmitSupport}>
            <DialogHeader>
              <DialogTitle>Contact Support</DialogTitle>
              <DialogDescription>
                Send us a message and we'll get back to you as soon as possible.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Your name"
                  required
                  defaultValue=""
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Your email"
                  required
                  defaultValue=""
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone (Optional)</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Your phone number"
                  defaultValue=""
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  name="subject"
                  placeholder="What can we help you with?"
                  required
                  defaultValue=""
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
                  defaultValue=""
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </DynamicDialog>
    );
  };

  return (
    <>
      <div className="h-screen w-60 bg-white/95 backdrop-blur-sm border-r border-gray-100 flex flex-col fixed left-0 top-0">
        <div className="h-16 flex items-center px-4 border-b border-gray-100">
          <h1 className="text-xl font-semibold text-[#2D2D2D] truncate">The Tasty Corner</h1>
        </div>

        <nav className="flex-1 py-4 px-3">
          <div className="space-y-1.5">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-2.5 rounded-lg text-[15px] transition-all duration-200',
                    isActive 
                      ? 'primary-gradient text-white shadow-sm' 
                      : 'text-gray-600 hover:text-[#FF7300] hover:bg-[#FFF6F0]'
                  )}
                >
                  <item.icon className={cn('w-5 h-5', isActive && 'text-white')} />
                  <span className="font-medium">{item.title}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="p-4 mt-auto">
          <button 
            type="button"
            onClick={() => setIsDialogOpen(true)}
            className="w-full text-left"
          >
            <div className="p-3 bg-[#FFF6F0] hover:bg-[#FFF0E6] rounded-lg transition-colors">
              <span className="text-sm text-gray-600 block mb-1">Need Help?</span>
              <span className="text-[15px] text-[#FF7300] font-medium block">Contact Support 💬</span>
            </div>
          </button>
        </div>
      </div>
      {renderSupportDialog()}
    </>
  );
}