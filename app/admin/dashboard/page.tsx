import { Suspense } from 'react';
import DashboardContent from './DashboardContent';
import LoadingSpinner from '@/components/ui/loading-spinner';

export default function DashboardPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <DashboardContent />
    </Suspense>
  );
}
