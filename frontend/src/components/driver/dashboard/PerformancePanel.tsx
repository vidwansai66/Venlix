import { TrendingUp } from 'lucide-react';
import type { DriverMetrics } from '@/hooks/useDriverData';

interface PerformancePanelProps {
  metrics: DriverMetrics;
}

export const PerformancePanel = ({ metrics }: PerformancePanelProps) => {
  return (
    <div className="rounded-2xl border border-brand-border bg-brand-card p-6 shadow-soft mb-8">
      <h2 className="text-base font-bold text-brand-text mb-4">Today's Performance</h2>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-end mb-1">
            <span className="text-sm font-semibold text-brand-text">Delivery Success</span>
            <span className="text-xs font-bold text-success">{metrics.successRate.toFixed(1)}%</span>
          </div>
          <div className="w-full h-1.5 bg-brand-background rounded-full overflow-hidden">
            <div className="h-full bg-success rounded-full" style={{ width: `${metrics.successRate}%` }}></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-end mb-1">
            <span className="text-sm font-semibold text-brand-text">AI Confidence</span>
            <span className="text-xs font-bold text-primary">{(metrics.averageConfidence * 100).toFixed(1)}%</span>
          </div>
          <div className="w-full h-1.5 bg-brand-background rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: `${metrics.averageConfidence * 100}%` }}></div>
          </div>
        </div>
      </div>

      <div className="mt-5 p-3 rounded-xl bg-success/10 border border-success/20 flex items-start gap-3">
        <TrendingUp size={16} className="text-success shrink-0 mt-0.5" />
        <p className="text-xs font-medium text-success leading-relaxed">
          You are on track to beat your weekly goal. Keep it up!
        </p>
      </div>
    </div>
  );
};
export default PerformancePanel;
