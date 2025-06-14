'use client';

import { toast } from 'sonner';
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback } from "react";

export interface OrderNotification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  createdAt: string;
  read: boolean;
}

interface Notification {
  id?: string;
  title: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
}

interface NotificationPanelProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}

export function NotificationPanel({ notifications, onDismiss }: NotificationPanelProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`p-4 rounded-lg shadow-lg max-w-sm ${
              notification.type === "success"
                ? "bg-green-50 text-green-800"
                : notification.type === "error"
                ? "bg-red-50 text-red-800"
                : notification.type === "warning"
                ? "bg-yellow-50 text-yellow-800"
                : "bg-blue-50 text-blue-800"
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{notification.title}</h3>
                <p className="text-sm mt-1">{notification.message}</p>
              </div>
              <button
                onClick={() => notification.id && onDismiss(notification.id)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((notification: Omit<Notification, "id">) => {
    const id = Math.random().toString(36).substring(7);
    setNotifications((prev) => [...prev, { ...notification, id }]);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      dismissNotification(id);
    }, 5000);
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  }, []);

  return {
    notifications,
    addNotification,
    dismissNotification,
  };
} 