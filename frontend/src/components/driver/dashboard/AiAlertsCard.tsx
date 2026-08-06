import { BrainCircuit, AlertTriangle, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { DriverDeliveryItem } from '@/hooks/useDriverData';

interface AiAlertsCardProps {
  deliveries: DriverDeliveryItem[];
}

export const AiAlertsCard = ({ deliveries }: AiAlertsCardProps) => {
  const navigate = useNavigate();
  // Find the highest risk delivery for the alert
  const atRiskDeliveries = deliveries.filter(d => 
    d.prediction === 'Delivery Failure' || 
    d.risk_level === 'Critical' || 
    d.risk_level === 'High'
  );

  if (atRiskDeliveries.length === 0) {
    return (
      <div className="rounded-2xl border border-brand-border bg-brand-card p-6 shadow-soft mb-8">
        <h2 className="text-base font-bold text-brand-text flex items-center gap-2 mb-4">
          <BrainCircuit className="text-primary" size={18} /> AI Copilot Alerts
        </h2>
        <div className="text-sm font-medium text-muted">
          All routes looking clear. No AI interventions required at this time.
        </div>
      </div>
    );
  }

  const alertDelivery = atRiskDeliveries[0];
  const aiRec = alertDelivery.ai_recommendation || {
    title: "Route Optimization Available",
    description: "Traffic congestion detected on primary route.",
    action: "Review Alternatives"
  };

  return (
    <div className="rounded-2xl border border-danger/20 bg-danger/5 p-6 shadow-soft mb-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-danger/10 rounded-full blur-[40px] -mr-10 -mt-10 pointer-events-none"></div>
      
      <div className="flex items-start justify-between mb-4">
        <h2 className="text-base font-bold text-danger flex items-center gap-2">
          <ShieldAlert size={18} /> AI Intervention
        </h2>
        <span className="px-2 py-1 bg-danger/10 text-danger text-[10px] font-black uppercase tracking-widest rounded-md border border-danger/20">
          Action Required
        </span>
      </div>

      <div className="mb-4">
        <h3 className="text-sm font-bold text-brand-text mb-1">{aiRec.title}</h3>
        <p className="text-xs font-medium text-brand-text/70">{aiRec.description}</p>
      </div>

      <div className="p-3 bg-brand-background/80 rounded-xl border border-brand-border mb-4">
        <div className="flex items-center gap-2 text-xs font-bold text-warning mb-1">
           <AlertTriangle size={14} /> Affected Delivery
        </div>
        <div className="text-sm font-bold text-brand-text">{alertDelivery.delivery_id || `DEL-${alertDelivery.id}`}</div>
        <div className="text-xs font-medium text-muted">{alertDelivery.customer?.address || "Unknown Address"}</div>
      </div>

      <button className="w-full py-2.5 bg-danger text-white rounded-xl text-sm font-bold shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:bg-danger/90 transition-colors" onClick={() => navigate('/driver/assistant')}>
        {aiRec.action}
      </button>
    </div>
  );
};
export default AiAlertsCard;
