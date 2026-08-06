import { motion } from 'framer-motion';
import { GitCommit, Search, RefreshCw, Cpu, BrainCircuit } from 'lucide-react';
import type { DriverDeliveryItem } from '@/hooks/useDriverData';

interface DecisionTraceProps {
  delivery: DriverDeliveryItem;
}

export const DecisionTrace = ({ delivery }: DecisionTraceProps) => {
  const steps = delivery.decision_trace || [
    { step: "Anomaly detected in traffic API feed for Route A.", timestamp: "-04:12" },
    { step: "Correlating severity with live environmental data.", timestamp: "-04:08" },
    { step: "Risk threshold exceeded (Score: 0.84 > 0.65).", timestamp: "-03:45" },
    { step: "Calculating alternative routes prioritizing SLA.", timestamp: "-03:42" },
    { step: "Route B identified: +2.4km distance, -15m time.", timestamp: "-03:10" },
    { step: "Generating intervention recommendation for driver.", timestamp: "Just Now" }
  ];

  return (
    <div className="rounded-3xl border border-brand-border bg-brand-card p-6 lg:p-8 shadow-soft relative overflow-hidden">
      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-[40px] pointer-events-none"></div>
      
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20">
          <BrainCircuit size={20} />
        </div>
        <div>
          <h3 className="text-base font-bold text-brand-text">AI Logic Trace</h3>
          <p className="text-xs font-medium text-muted">How this recommendation was generated</p>
        </div>
      </div>

      <div className="relative pl-4 space-y-6">
        {/* Animated Line */}
        <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-brand-border via-primary/30 to-brand-border rounded-full"></div>

        {steps.map((step, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.15 }}
            className="flex gap-4 relative z-10 group"
          >
            <div className="w-6 h-6 mt-1 rounded-full bg-brand-card border-2 border-brand-border flex items-center justify-center shrink-0 group-hover:border-primary transition-colors">
              <div className="w-2 h-2 rounded-full bg-brand-border group-hover:bg-primary transition-colors"></div>
            </div>
            <div className="flex-1 bg-brand-background/50 border border-brand-border rounded-xl p-3 group-hover:border-primary/30 transition-colors">
              <p className="text-sm font-medium text-brand-text">{step.step}</p>
              <p className="text-[10px] font-bold text-muted uppercase tracking-wider mt-1.5">{step.timestamp}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
export default DecisionTrace;
