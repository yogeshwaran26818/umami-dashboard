'use client';

import { useState, useEffect } from 'react';
import MetricCard from '@/components/MetricCard';
import ViewsChart from '@/components/ViewsChart';

export default function Dashboard({ params }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(`/api/analytics/${params.websiteId}`);
        const data = await response.json();
        
        if (data.error) {
          setError(data.error);
        } else {
          setAnalytics(data);
        }
      } catch (err) {
        setError('Failed to fetch analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchAnalytics, 30000);
    return () => clearInterval(interval);
  }, [params.websiteId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Mock change data (in real app, calculate from previous period)
  const mockChanges = {
    views: { value: 12.5, type: 'up' },
    visits: { value: 8.3, type: 'up' },
    visitors: { value: 5.2, type: 'down' },
    bounce: { value: 2.1, type: 'down' },
    duration: { value: 15.7, type: 'up' }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
          <p className="text-gray-400">Website: {params.websiteId.slice(0, 8)}...</p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <MetricCard 
            title="Views" 
            value={analytics.totalViews.toLocaleString()} 
            change={mockChanges.views.value}
            changeType={mockChanges.views.type}
          />
          <MetricCard 
            title="Visits" 
            value={analytics.totalVisits.toLocaleString()} 
            change={mockChanges.visits.value}
            changeType={mockChanges.visits.type}
          />
          <MetricCard 
            title="Visitors" 
            value={analytics.uniqueVisitors.toLocaleString()} 
            change={mockChanges.visitors.value}
            changeType={mockChanges.visitors.type}
          />
          <MetricCard 
            title="Bounce Rate" 
            value={analytics.bounceRate} 
            change={mockChanges.bounce.value}
            changeType={mockChanges.bounce.type}
          />
          <MetricCard 
            title="Visit Duration" 
            value={`${analytics.averageVisitDuration}s`} 
            change={mockChanges.duration.value}
            changeType={mockChanges.duration.type}
          />
        </div>

        {/* Chart */}
        <div className="flex justify-center">
          <div className="w-full max-w-6xl">
            <ViewsChart data={analytics.viewsOverTime} />
          </div>
        </div>
      </div>
    </div>
  );
}