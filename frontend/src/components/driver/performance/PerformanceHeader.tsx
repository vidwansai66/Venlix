import { motion } from 'framer-motion';
import { Trophy, CheckCircle2, PackageCheck, Star } from 'lucide-react';
import type { DriverMetrics } from '@/hooks/useDriverData';

interface PerformanceHeaderProps {
  metrics: DriverMetrics;
}

export const PerformanceHeader = ({ metrics }: PerformanceHeaderProps) => {
  const summaryStats = [
    { label: "Total Deliveries", value: "1,248", subtext: "Lifetime", icon: Trophy, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" },
    { label: "Completed Today", value: metrics.completedToday.toString(), subtext: "On schedule", icon: PackageCheck, color: "text-success", bg: "bg-success/10", border: "border-success/20" },
    { label: "Success Rate", value: `${metrics.successRate.toFixed(1)}%`, subtext: "Today's stat", icon: CheckCircle2, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    { label: "Current Rating", value: "4.9", subtext: "Exceptional", icon: Star, color: "text-warning", bg: "bg-warning/10", border: "border-warning/20" },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="mb-8">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-brand-text tracking-tight flex items-center gap-2">
          <Trophy className="text-primary" />
          Performance
        </h1>
        <p className="text-muted mt-1 text-sm font-medium">
          Track your delivery performance and improve every day.
        </p>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {summaryStats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={idx}
              variants={item}
              className="relative overflow-hidden rounded-2xl border border-brand-border bg-brand-card p-5 shadow-soft transition-all duration-300 hover:border-brand-border/80 hover:shadow-premium group"
            >
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 bg-gradient-to-br from-transparent to-current ${stat.color}`}></div>
              
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-xl ${stat.bg} ${stat.border} border`}>
                  <Icon size={16} className={stat.color} />
                </div>
                <h3 className="text-xs font-bold text-muted uppercase tracking-widest break-words leading-tight">
                  {stat.label}
                </h3>
              </div>
              
              <div className="flex items-baseline gap-2">
                <p className={`text-2xl font-black tracking-tight text-brand-text`}>
                  {stat.value}
                </p>
                {stat.label === "Current Rating" && <Star size={14} className="text-warning fill-warning" />}
              </div>
              <p className="text-xs font-medium text-muted mt-1">{stat.subtext}</p>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};
export default PerformanceHeader;
