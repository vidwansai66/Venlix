import { motion } from 'framer-motion';
import { PackageOpen, CheckCircle2, Clock, Truck } from 'lucide-react';
import { useDriverData } from '@/hooks/useDriverData';

export const DeliveriesHeader = () => {
  const { metrics } = useDriverData();

  const summaryStats = [
    { label: "Assigned Today", value: metrics.totalAssignedToday, icon: PackageOpen, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    { label: "Completed", value: metrics.completedToday, icon: CheckCircle2, color: "text-success", bg: "bg-success/10", border: "border-success/20" },
    { label: "In Progress", value: metrics.pendingToday, icon: Truck, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" },
    { label: "Pending", value: "0", icon: Clock, color: "text-warning", bg: "bg-warning/10", border: "border-warning/20" },
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
          <PackageOpen className="text-primary" />
          My Deliveries
        </h1>
        <p className="text-muted mt-1 text-sm font-medium">
          Manage your assigned deliveries efficiently.
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
              
              <p className={`text-2xl font-black tracking-tight text-brand-text`}>
                {stat.value}
              </p>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};
export default DeliveriesHeader;
