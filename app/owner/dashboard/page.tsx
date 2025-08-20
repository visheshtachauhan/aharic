// Unified single-page Owner Dashboard is a product requirement. 
// DO NOT create separate pages for Orders/Menu/Tables/Settings/Analytics. 
// All changes must preserve in-page sections.

import { Suspense } from 'react';
import DashboardContent from '../../../owner/dashboard/DashboardContent';
import LoadingSpinner from '@/components/ui/loading-spinner';

export default function DashboardPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <DashboardContent />
    </Suspense>
  );
}
