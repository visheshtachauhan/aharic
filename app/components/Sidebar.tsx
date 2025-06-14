'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, Table, Menu as MenuIcon, ShoppingBag, Settings } from 'lucide-react';

const menuItems = [
  {
    title: 'Dashboard',
    icon: LayoutGrid,
    href: '/admin/dashboard'
  },
  {
    title: 'Tables',
    icon: Table,
    href: '/admin/tables'
  },
  {
    title: 'Menu',
    icon: MenuIcon,
    href: '/admin/menu'
  },
  {
    title: 'Orders',
    icon: ShoppingBag,
    href: '/admin/orders'
  },
  {
    title: 'Settings',
    icon: Settings,
    href: '/admin/settings'
  }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white min-h-screen p-4 shadow-sm">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-[#2D2D2D] px-4">The Tasty Corner</h1>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive 
                  ? 'bg-[#FF7300] text-white' 
                  : 'text-[#666666] hover:bg-[#FFF6F0] hover:text-[#FF7300]'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
} 