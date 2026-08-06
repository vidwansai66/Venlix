import { Navigation, Clock, Package } from 'lucide-react';
import type { DriverDeliveryItem } from '@/hooks/useDriverData';

interface CurrentDeliveryContextProps {
  delivery: DriverDeliveryItem;
}

export const CurrentDeliveryContext = ({ delivery }: CurrentDeliveryContextProps) => {
  return (
    <div className="rounded-3xl border border-brand-border bg-brand-card p-6 shadow-soft mb-8">
      <h3 className="text-sm font-bold text-brand-text mb-4">Affected Delivery Context</h3>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 rounded-xl bg-brand-background border border-brand-border">
           <div className="flex items-center gap-3">
             <Package size={16} className="text-muted" />
             <span className="text-xs font-bold text-muted uppercase tracking-wider">ID</span>
           </div>
           <span className="text-sm font-bold text-brand-text">{delivery.delivery_id || `DEL-${delivery.id}`}</span>
        </div>
        
        <div className="flex items-center justify-between p-3 rounded-xl bg-brand-background border border-brand-border">
           <div className="flex items-center gap-3">
             <Navigation size={16} className="text-blue-500" />
             <span className="text-xs font-bold text-muted uppercase tracking-wider">Distance</span>
           </div>
           <span className="text-sm font-bold text-brand-text">{delivery.distance_km || 0} km</span>
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-brand-background border border-brand-border">
           <div className="flex items-center gap-3">
             <Clock size={16} className="text-warning" />
             <span className="text-xs font-bold text-muted uppercase tracking-wider">Deadline</span>
           </div>
           <span className="text-sm font-bold text-warning">{delivery.Delivery_Time || 0} mins</span>
        </div>
      </div>
    </div>
  );
};
export default CurrentDeliveryContext;
