import Link from 'next/link';

export function MainNav() {
  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/" className="flex items-center space-x-2">
        <span className="inline-block font-bold">QR Menu</span>
      </Link>
      <nav className="flex gap-6">
        <Link
          href="/restaurants"
          className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          Restaurants
        </Link>
        <Link
          href="/menu"
          className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          Menu
        </Link>
        <Link
          href="/orders"
          className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          Orders
        </Link>
      </nav>
    </div>
  );
} 