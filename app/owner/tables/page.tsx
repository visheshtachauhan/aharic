import { redirect } from 'next/navigation';

export default function TablesRedirectPage() {
  redirect('/owner/dashboard?tab=tables');
}
