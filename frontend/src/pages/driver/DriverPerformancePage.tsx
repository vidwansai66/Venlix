import { useDriverData } from '@/hooks/useDriverData';
import { Loader2, RefreshCw } from 'lucide-react';
import PerformanceHeader from '@/components/driver/performance/PerformanceHeader';
import PerformanceCharts from '@/components/driver/performance/PerformanceCharts';
import RatingCard from '@/components/driver/performance/RatingCard';
import Achievements from '@/components/driver/performance/Achievements';
import AiPerformanceInsights from '@/components/driver/performance/AiPerformanceInsights';
import PerformanceBreakdown from '@/components/driver/performance/PerformanceBreakdown';
import DeliveryHistorySummary from '@/components/driver/performance/DeliveryHistorySummary';
import DriverGoals from '@/components/driver/performance/DriverGoals';
import MotivationalPanel from '@/components/driver/performance/MotivationalPanel';

export const DriverPerformancePage = () => {
  const { metrics, deliveries, isLoading, error, refetch } = useDriverData();

  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-12 bg-danger/5 border border-danger/20 rounded-2xl max-w-7xl mx-auto mt-8">
        <h3 className="text-xl font-bold text-danger mb-2">Connection Error</h3>
        <p className="text-muted mb-6 max-w-md text-center">{error}</p>
        <button 
          onClick={refetch}
          className="flex items-center gap-2 px-6 py-3 bg-brand-card border border-brand-border rounded-xl font-bold hover:bg-brand-background transition-colors"
        >
          <RefreshCw size={16} /> Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <PerformanceHeader metrics={metrics} />

      {isLoading && deliveries.length === 0 ? (
        // Skeleton Layout
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             <div className="lg:col-span-2 h-[350px] rounded-2xl bg-brand-card animate-pulse border border-brand-border"></div>
             <div className="h-[350px] rounded-2xl bg-brand-card animate-pulse border border-brand-border"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             <div className="h-[250px] rounded-2xl bg-brand-card animate-pulse border border-brand-border"></div>
             <div className="h-[250px] rounded-2xl bg-brand-card animate-pulse border border-brand-border"></div>
             <div className="h-[250px] rounded-2xl bg-brand-card animate-pulse border border-brand-border"></div>
          </div>
          <div className="h-[400px] rounded-2xl bg-brand-card animate-pulse border border-brand-border"></div>
        </div>
      ) : (
        <>
          {/* Main Stats Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 min-h-[350px]">
              <PerformanceCharts metrics={metrics} />
            </div>
            <div className="min-h-[350px]">
              <RatingCard />
            </div>
          </div>

          {/* Insights & Goals Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <AiPerformanceInsights />
            </div>
            <div>
              <PerformanceBreakdown metrics={metrics} />
            </div>
            <div className="flex flex-col gap-6">
               <div className="flex-1">
                 <DriverGoals metrics={metrics} />
               </div>
               <div className="h-[200px]">
                 <MotivationalPanel />
               </div>
            </div>
          </div>

          {/* Achievements & History */}
          <div className="space-y-6">
            <Achievements />
            <DeliveryHistorySummary deliveries={deliveries} />
          </div>
        </>
      )}
    </div>
  );
};

export default DriverPerformancePage;
