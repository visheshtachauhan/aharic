import { redirect } from 'next/navigation';

export default function ReportsRedirectPage() {
  redirect('/owner/dashboard?tab=analytics');
}
