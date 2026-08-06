import { toast } from 'sonner';
import { Navigation, List, MessageSquare, HeadphonesIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export const QuickActions = () => {
  const actions = [
    { label: "Start Next", icon: Navigation, color: "text-white", bg: "bg-primary hover:bg-primary/90", border: "border-transparent", shadow: "shadow-[0_0_15px_rgba(124,58,237,0.3)]" },
    { label: "My Deliveries", icon: List, color: "text-brand-text", bg: "bg-brand-background hover:bg-brand-background/80", border: "border-brand-border hover:border-primary/50", shadow: "" },
    { label: "AI Assistant", icon: MessageSquare, color: "text-brand-text", bg: "bg-brand-background hover:bg-brand-background/80", border: "border-brand-border hover:border-primary/50", shadow: "" },
    { label: "Support", icon: HeadphonesIcon, color: "text-brand-text", bg: "bg-brand-background hover:bg-brand-background/80", border: "border-brand-border hover:border-primary/50", shadow: "" },
  ];

  return (
    <div className="mb-6">
      <h2 className="text-base font-bold text-brand-text mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, idx) => {
          const Icon = action.icon;
          return (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border ${action.bg} ${action.border} ${action.shadow} transition-all duration-200`}
             onClick={() => toast.success('Action simulated successfully')}>
              <Icon size={20} className={action.color} />
              <span className={`text-xs font-bold ${action.color}`}>{action.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
export default QuickActions;
