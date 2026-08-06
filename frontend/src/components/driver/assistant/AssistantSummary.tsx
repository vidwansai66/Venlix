import { motion } from 'framer-motion';
import { Activity, Route, Clock, Zap } from 'lucide-react';

export const AssistantSummary = () => {
  const summaryStats = [
    { label: "Current Risk", value: "High", subtext: "Traffic detected", icon: Activity, color: "text-danger", bg: "bg-danger/10", border: "border-danger/20" },
    { label: "Route Status", value: "Optimized", subtext: "Alternative suggested", icon: Route, color: "text-success", bg: "bg-success/10", border: "border-success/20" },
    { label: "Est. Delay", value: "15 mins", subtext: "Without intervention", icon: Clock, color: "text-warning", bg: "bg-warning/10", border: "border-warning/20" },
    { label: "AI Interventions", value: "3", subtext: "Today", icon: Zap, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" },
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
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
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
            
            <p className={`text-xl font-black tracking-tight ${stat.color === 'text-danger' ? 'text-danger' : 'text-brand-text'}`}>
              {stat.value}
            </p>
            <p className="text-xs font-medium text-muted mt-1">{stat.subtext}</p>
          </motion.div>
        );
      })}
    </motion.div>
  );
};
export default AssistantSummary;
