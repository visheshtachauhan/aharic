'use client';

import { useState } from "react";
import { LayoutDashboard, Menu as MenuIcon, ShoppingBag, TableProperties, Settings, Bell, MessageSquare, ChevronDown, LogOut, FileText, Power } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CursorEffect } from "@/components/ui/cursor-effect";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const [isRestaurantOnline, setIsRestaurantOnline] = useState(true);
  const [notifications] = useState(3);
  const [messages] = useState(2);
  
  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      title: "Tables",
      href: "/dashboard/tables",
      icon: <TableProperties className="h-4 w-4" />,
    },
    {
      title: "Menu",
      href: "/dashboard/menu",
      icon: <MenuIcon className="h-4 w-4" />,
    },
    {
      title: "Orders",
      href: "/dashboard/orders",
      icon: <ShoppingBag className="h-4 w-4" />,
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: <Settings className="h-4 w-4" />,
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#FAF3E0]">
      <CursorEffect />
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-30"
      >
        <div className="flex h-16 items-center gap-2 px-6 border-b">
          <Link href="/dashboard" className="flex items-center gap-2">
            <motion.span 
              className="text-2xl text-[#FF8C42]"
              animate={{ rotate: [0, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ☰
            </motion.span>
            <span className="font-semibold text-[#252525]">The Tasty Corner</span>
          </Link>
        </div>

        <nav className="space-y-1 p-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300",
                "hover:bg-[#FF8C42]/10",
                pathname === item.href 
                  ? "gradient-primary text-white shadow-lg" 
                  : "text-[#252525]"
              )}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  pathname === item.href 
                    ? "bg-white/20" 
                    : "bg-[#FF8C42]/10"
                )}
              >
                {item.icon}
              </motion.div>
              <span className="text-sm">{item.title}</span>
            </Link>
          ))}
        </nav>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Top Navigation Bar */}
        <motion.header
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="fixed top-0 right-0 left-64 h-16 bg-white shadow-sm z-20"
        >
          <div className="flex items-center justify-end h-full px-6 gap-4">
            {/* Restaurant Status Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "relative flex items-center gap-2 transition-colors duration-300",
                isRestaurantOnline ? "text-[#5A7D5A]" : "text-gray-500"
              )}
              onClick={() => setIsRestaurantOnline(!isRestaurantOnline)}
            >
              <motion.div 
                className={cn(
                  "absolute w-2 h-2 rounded-full",
                  isRestaurantOnline ? "bg-[#5A7D5A]" : "bg-gray-400"
                )}
                animate={{ 
                  scale: isRestaurantOnline ? [1, 1.2, 1] : 1 
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity 
                }}
              />
              <Power className="h-4 w-4" />
              <span className="text-sm">
                {isRestaurantOnline ? "Online" : "Offline"}
              </span>
            </Button>

            {/* Notification Button */}
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5 text-[#252525]" />
                {notifications > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-1 right-1 w-2 h-2 bg-[#E63946] rounded-full"
                  />
                )}
              </Button>
            </motion.div>

            {/* Messages Button */}
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button variant="ghost" size="icon" className="relative">
                <MessageSquare className="h-5 w-5 text-[#252525]" />
                {messages > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-1 right-1 w-2 h-2 bg-[#FF8C42] rounded-full"
                  />
                )}
              </Button>
            </motion.div>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="relative"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/avatar.png" />
                      <AvatarFallback>TC</AvatarFallback>
                    </Avatar>
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-[#FF8C42]"
                      animate={{
                        scale: [1, 1.1, 1],
                        opacity: [1, 0, 1]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity
                      }}
                    />
                  </motion.div>
                  <ChevronDown className="h-4 w-4 text-[#252525]" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Reports</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-[#E63946] cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </motion.header>

        {/* Page Content */}
        <main className="pt-16 min-h-screen">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-6 max-w-[1500px] mx-auto"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
} 