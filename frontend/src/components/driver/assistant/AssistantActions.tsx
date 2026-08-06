import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Check, Navigation, Phone, AlertCircle, Headphones } from 'lucide-react';

export const AssistantActions = () => {
  const actions = [
    { label: "Accept Recommendation", icon: Check, color: "text-white", bg: "bg-primary hover:bg-primary/90", border: "border-transparent", shadow: "shadow-[0_0_15px_rgba(124,58,237,0.3)]", primary: true, onClick: () => toast.success('AI Recommendation Accepted and Applied to Route') },
    { label: "Navigate", icon: Navigation, color: "text-brand-text", bg: "bg-brand-background hover:bg-brand-background/80", border: "border-brand-border hover:border-primary/50", onClick: () => toast.success('Navigation starting...') },
    { label: "Call Customer", icon: Phone, color: "text-brand-text", bg: "bg-brand-background hover:bg-brand-background/80", border: "border-brand-border hover:border-primary/50", onClick: () => toast.success('Calling customer...') },
    { label: "Report Issue", icon: AlertCircle, color: "text-brand-text", bg: "bg-brand-background hover:bg-brand-background/80", border: "border-brand-border hover:border-danger/50", onClick: () => toast.success('Issue reported') },
    { label: "Request Support", icon: Headphones, color: "text-brand-text", bg: "bg-brand-background hover:bg-brand-background/80", border: "border-brand-border hover:border-primary/50", onClick: () => toast.success('Support requested') },
  ];

  return (
    <div className="mb-6">
      <h2 className="text-base font-bold text-brand-text mb-4">Quick Actions</h2>
      <div className="flex flex-col gap-3">
        {actions.map((action, idx) => {
          const Icon = action.icon;
          return (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center justify-between p-3.5 rounded-xl border ${action.bg} ${action.border} ${action.shadow || ''} transition-all duration-200`}
             onClick={action.onClick}>
              <span className={`text-sm font-bold ${action.color}`}>{action.label}</span>
              <Icon size={18} className={action.color} />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
export default AssistantActions;
