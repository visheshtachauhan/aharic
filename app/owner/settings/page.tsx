import { redirect } from 'next/navigation';

export default function SettingsRedirectPage() {
  redirect('/owner/dashboard?tab=settings');
}
