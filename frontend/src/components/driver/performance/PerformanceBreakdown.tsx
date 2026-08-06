import { Zap, Clock, ShieldCheck, Map, ThumbsUp } from 'lucide-react';
import type { DriverMetrics } from '@/hooks/useDriverData';

interface PerformanceBreakdownProps {
  metrics: DriverMetrics;
}

export const PerformanceBreakdown = ({ metrics }: PerformanceBreakdownProps) => {
  const breakdownStats = [
    { label: "Delivery Success", value: metrics.successRate.toFixed(1), icon: Zap, color: "text-primary", bg: "bg-primary" },
    { label: "AI Confidence Avg", value: (metrics.averageConfidence * 100).toFixed(1), icon: Clock, color: "text-blue-500", bg: "bg-blue-500" },
    { label: "Navigation Accuracy", value: 91, icon: Map, color: "text-success", bg: "bg-success" },
    { label: "Safety Score", value: 99, icon: ShieldCheck, color: "text-warning", bg: "bg-warning" },
    { label: "Customer Satisfaction", value: 96, icon: ThumbsUp, color: "text-indigo-500", bg: "bg-indigo-500" }
  ];

  return (
    <div className="rounded-2xl border border-brand-border bg-brand-card p-6 shadow-soft h-full">
      <h2 className="text-base font-bold text-brand-text mb-6">Performance Breakdown</h2>
      
      <div className="space-y-5">
        {breakdownStats.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <div key={idx} className="flex items-center gap-4">
              <div className={`p-2.5 rounded-xl bg-brand-background border border-brand-border`}>
                <Icon size={16} className={metric.color} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-sm font-semibold text-brand-text">{metric.label}</span>
                  <span className="text-xs font-bold text-brand-text">{metric.value}%</span>
                </div>
                <div className="w-full h-1.5 bg-brand-background rounded-full overflow-hidden">
                  <div className={`h-full ${metric.bg} rounded-full`} style={{ width: `${metric.value}%` }}></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default PerformanceBreakdown;
