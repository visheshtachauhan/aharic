import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex gap-6 md:gap-10">
          <Link href="/dashboard" className="hidden items-center space-x-2 md:flex">
            <span className="hidden font-bold sm:inline-block">
              Restaurant Dashboard
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="sm" asChild>
            <Link href="/signout">
              Sign Out
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
} 