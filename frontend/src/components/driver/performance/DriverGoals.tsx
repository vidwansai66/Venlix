import { Target } from 'lucide-react';
import type { DriverMetrics } from '@/hooks/useDriverData';

interface DriverGoalsProps {
  metrics: DriverMetrics;
}

export const DriverGoals = ({ metrics }: DriverGoalsProps) => {
  const goals = [
    { label: "Today's Goal", current: metrics.completedToday, target: 15, unit: "Deliveries", color: "bg-blue-500" },
    { label: "Weekly Goal", current: 36, target: 50, unit: "Deliveries", color: "bg-primary" },
    { label: "Monthly Goal", current: 165, target: 220, unit: "Deliveries", color: "bg-success" }
  ];

  return (
    <div className="rounded-2xl border border-brand-border bg-brand-card p-6 shadow-soft h-full flex flex-col">
      <h2 className="text-base font-bold text-brand-text mb-6 flex items-center gap-2">
        <Target size={18} className="text-primary" /> Active Goals
      </h2>
      
      <div className="space-y-6 flex-1 flex flex-col justify-between">
        {goals.map((goal, idx) => {
          const percentage = Math.min(100, Math.max(0, (goal.current / goal.target) * 100));
          return (
            <div key={idx}>
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-bold text-brand-text">{goal.label}</span>
                <span className="text-xs font-bold text-muted">
                  <span className="text-brand-text">{goal.current}</span> / {goal.target} {goal.unit}
                </span>
              </div>
              <div className="w-full h-2.5 bg-brand-background rounded-full overflow-hidden border border-brand-border">
                <div 
                  className={`h-full ${goal.color} rounded-full transition-all duration-1000 ease-out`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default DriverGoals;
