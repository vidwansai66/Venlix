import { CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import type { DriverDeliveryItem } from '@/hooks/useDriverData';

interface ActivityTimelineProps {
  deliveries: DriverDeliveryItem[];
}

export const ActivityTimeline = ({ deliveries }: ActivityTimelineProps) => {
  // Use the 4 most recent deliveries
  const recentDeliveries = deliveries.slice(0, 4);

  if (recentDeliveries.length === 0) {
    return null;
  }

  const getStatusIcon = (pred: string) => {
    if (pred === 'Delivery Successful') return <CheckCircle2 size={14} className="text-success" />;
    if (pred === 'Delivery Failure') return <AlertTriangle size={14} className="text-danger" />;
    return <Clock size={14} className="text-warning" />;
  };

  const getStatusColor = (pred: string) => {
    if (pred === 'Delivery Successful') return 'bg-success/10 border-success/30';
    if (pred === 'Delivery Failure') return 'bg-danger/10 border-danger/30';
    return 'bg-warning/10 border-warning/30';
  };

  const getStatusText = (pred: string) => {
    if (pred === 'Delivery Successful') return 'Delivered';
    if (pred === 'Delivery Failure') return 'Failed/Delayed';
    return 'In Progress';
  };

  return (
    <div className="rounded-2xl border border-brand-border bg-brand-card p-6 shadow-soft">
      <h2 className="text-base font-bold text-brand-text mb-6">Recent Activity</h2>
      
      <div className="relative pl-2">
        {/* Vertical Line */}
        <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-brand-border rounded-full"></div>
        
        <div className="space-y-6 relative">
          {recentDeliveries.map((delivery) => (
            <div key={delivery.id} className="flex gap-4">
              <div className={`w-8 h-8 rounded-full border bg-brand-card flex items-center justify-center shrink-0 z-10 ${getStatusColor(delivery.prediction)}`}>
                {getStatusIcon(delivery.prediction)}
              </div>
              <div className="pt-1.5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold text-brand-text">{delivery.delivery_id || `DEL-${delivery.id}`}</span>
                  <span className="text-[10px] font-bold text-muted uppercase tracking-wider">{getStatusText(delivery.prediction)}</span>
                </div>
                <p className="text-xs font-medium text-muted">{delivery.customer?.name || "Customer"}</p>
                <div className="text-[10px] text-muted font-semibold mt-1">
                  {new Date(delivery.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default ActivityTimeline;
