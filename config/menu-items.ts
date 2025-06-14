import { LayoutGrid, Table, Menu as MenuIcon, ShoppingBag, Settings, BarChart } from 'lucide-react';

interface MenuItem {
  title: string;
  icon: any; // Using any for Lucide icons
  href: string;
}

export const menuItems: MenuItem[] = [
  {
    title: 'Dashboard',
    icon: LayoutGrid,
    href: '/admin/dashboard',
  },
  {
    title: 'Tables',
    icon: Table,
    href: '/admin/tables',
  },
  {
    title: 'Menu',
    icon: MenuIcon,
    href: '/admin/menu',
  },
  {
    title: 'Orders',
    icon: ShoppingBag,
    href: '/admin/orders',
  },
  {
    title: 'Analytics & Finance',
    icon: BarChart,
    href: '/admin/analytics',
  },
  {
    title: 'Settings',
    icon: Settings,
    href: '/admin/settings',
  },
]; 