import { redirect } from 'next/navigation';

export default function MenuRedirectPage() {
  redirect('/owner/dashboard?tab=menu');
}
