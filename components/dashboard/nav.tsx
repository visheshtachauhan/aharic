"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DashboardIcon,
  MenuIcon,
  ClockIcon,
  TableIcon,
  ScanIcon,
  PersonIcon,
  GearIcon,
  BarChartIcon,
} from "@radix-ui/react-icons"

const routes = [
  {
    group: "Overview",
    items: [
      {
        href: "/dashboard",
        label: "Dashboard",
        icon: DashboardIcon,
        description: "Overview of your restaurant",
      },
      {
        href: "/dashboard/analytics",
        label: "Analytics",
        icon: BarChartIcon,
        description: "View your restaurant's performance",
      },
    ],
  },
  {
    group: "Management",
    items: [
      {
        href: "/dashboard/menu",
        label: "Menu",
        icon: MenuIcon,
        description: "Manage your menu items and categories",
      },
      {
        href: "/dashboard/orders",
        label: "Orders",
        icon: ClockIcon,
        description: "Track and manage orders",
        badge: "Live",
      },
      {
        href: "/dashboard/tables",
        label: "Tables",
        icon: TableIcon,
        description: "Manage your restaurant tables",
      },
    ],
  },
  {
    group: "Setup",
    items: [
      {
        href: "/dashboard/qr-codes",
        label: "QR Codes",
        icon: ScanIcon,
        description: "Generate and manage QR codes",
      },
      {
        href: "/dashboard/staff",
        label: "Staff",
        icon: PersonIcon,
        description: "Manage your staff members",
      },
      {
        href: "/dashboard/settings",
        label: "Settings",
        icon: GearIcon,
        description: "Restaurant settings and preferences",
      },
    ],
  },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav className="grid gap-6">
      {routes.map((route) => (
        <div key={route.group} className="flex flex-col gap-2">
          <h4 className="px-2 text-sm font-semibold text-muted-foreground">
            {route.group}
          </h4>
          {route.items.map((item) => {
            const Icon = item.icon
            return (
              <Button
                key={item.href}
                variant={pathname === item.href ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-2",
                  pathname === item.href && "bg-accent"
                )}
                asChild
              >
                <Link href={item.href}>
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto flex h-5 w-11 items-center justify-center rounded-full bg-primary px-2 text-xs text-primary-foreground">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </Button>
            )
          })}
        </div>
      ))}
    </nav>
  )
} 