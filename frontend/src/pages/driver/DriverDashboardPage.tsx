import DriverHeader from '@/components/driver/dashboard/DriverHeader';
import DriverStats from '@/components/driver/dashboard/DriverStats';
import AssignedDeliveries from '@/components/driver/dashboard/AssignedDeliveries';
import RouteMapPlaceholder from '@/components/driver/dashboard/RouteMapPlaceholder';
import PerformancePanel from '@/components/driver/dashboard/PerformancePanel';
import AiAlertsCard from '@/components/driver/dashboard/AiAlertsCard';
import QuickActions from '@/components/driver/dashboard/QuickActions';
import ActivityTimeline from '@/components/driver/dashboard/ActivityTimeline';
import { useDriverData } from '@/hooks/useDriverData';
import { Loader2, RefreshCcw } from 'lucide-react';

export const DriverDashboardPage = () => {
  const { deliveries, metrics, isLoading, error, refetch } = useDriverData();

  if (isLoading && deliveries.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-12">
        <Loader2 className="animate-spin text-primary w-12 h-12 mb-4" />
        <h3 className="text-xl font-bold text-brand-text">Loading Dashboard</h3>
        <p className="text-muted">Fetching your live metrics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-12 bg-danger/5 border border-danger/20 rounded-2xl">
        <h3 className="text-xl font-bold text-danger mb-2">Connection Error</h3>
        <p className="text-muted mb-6 max-w-md text-center">{error}</p>
        <button 
          onClick={refetch}
          className="flex items-center gap-2 px-6 py-3 bg-brand-card border border-brand-border rounded-xl font-bold hover:bg-brand-background transition-colors"
        >
          <RefreshCcw size={16} /> Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Top Header Section */}
      <DriverHeader />

      {/* Stats Row */}
      <DriverStats metrics={metrics} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Column (Wider on Desktop) - Deliveries and Route */}
        <div className="xl:col-span-2 flex flex-col">
          <AssignedDeliveries deliveries={deliveries} />
          <RouteMapPlaceholder />
        </div>

        {/* Right Column (Sidebar-ish) - Performance, AI, Actions, Timeline */}
        <div className="flex flex-col">
          <AiAlertsCard deliveries={deliveries} />
          <PerformancePanel metrics={metrics} />
          <QuickActions />
          <ActivityTimeline deliveries={deliveries} />
        </div>
        
      </div>
    </div>
  );
};

export default DriverDashboardPage;
