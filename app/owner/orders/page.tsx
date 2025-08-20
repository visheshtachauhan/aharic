import { redirect } from 'next/navigation';

export default function OrdersRedirectPage() {
  redirect('/owner/dashboard?tab=orders');
}
