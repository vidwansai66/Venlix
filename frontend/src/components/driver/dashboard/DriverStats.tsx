import { motion } from 'framer-motion';
import { Package, CheckCircle2, Clock, Activity } from 'lucide-react';
import type { DriverMetrics } from '@/hooks/useDriverData';

interface DriverStatsProps {
  metrics: DriverMetrics;
}

export const DriverStats = ({ metrics }: DriverStatsProps) => {
  const stats = [
    { label: "Today's Deliveries", value: metrics.totalAssignedToday.toString(), icon: Package, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    { label: "Completed", value: metrics.completedToday.toString(), icon: CheckCircle2, color: "text-success", bg: "bg-success/10", border: "border-success/20" },
    { label: "Remaining", value: metrics.pendingToday.toString(), icon: Clock, color: "text-warning", bg: "bg-warning/10", border: "border-warning/20" },
    { label: "Success Rate", value: `${metrics.successRate.toFixed(1)}%`, icon: Activity, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
    >
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={index}
            variants={item}
            className="relative overflow-hidden rounded-2xl border border-brand-border bg-brand-card p-5 shadow-soft transition-all duration-300 hover:border-brand-border/80 hover:shadow-premium group"
          >
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 bg-gradient-to-br from-transparent to-current ${stat.color}`}></div>
            
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.border} border`}>
                <Icon size={20} className={stat.color} />
              </div>
            </div>
            
            <div>
              <p className="text-3xl font-black text-brand-text mb-1 tracking-tight">
                {stat.value}
              </p>
              <h3 className="text-xs font-bold text-muted uppercase tracking-wider">
                {stat.label}
              </h3>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};
export default DriverStats;
