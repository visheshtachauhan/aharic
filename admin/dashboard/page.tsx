import { Suspense, useEffect, useState } from 'react';
import LoadingSpinner from '@/components/ui/loading-spinner';

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMetrics() {
      setLoading(true);
      try {
        const res = await fetch('/api/dashboard/metrics');
        const data = await res.json();
        setMetrics(data);
      } catch (e) {
        setMetrics(null);
      } finally {
        setLoading(false);
      }
    }
    fetchMetrics();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      {metrics ? (
        <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">{JSON.stringify(metrics, null, 2)}</pre>
      ) : (
        <div className="text-red-500">Failed to load metrics.</div>
      )}
    </div>
  );
} 