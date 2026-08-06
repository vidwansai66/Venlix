import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Navigation, MapPin, Clock, PackageOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { DriverDeliveryItem } from '@/hooks/useDriverData';

interface AssignedDeliveriesProps {
  deliveries: DriverDeliveryItem[];
}

export const AssignedDeliveries = ({ deliveries }: AssignedDeliveriesProps) => {
  const navigate = useNavigate();
  // Get today's active/pending deliveries
  const activeDeliveries = deliveries.filter(d => d.prediction !== 'Delivery Successful').slice(0, 5);

  if (activeDeliveries.length === 0) {
    return (
      <div className="mb-8">
        <h2 className="text-lg font-bold text-brand-text mb-4">Today's Assigned Deliveries</h2>
        <div className="p-8 rounded-2xl border border-brand-border bg-brand-card text-center">
          <p className="text-muted font-medium">No pending deliveries right now. Great job!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-brand-text flex items-center gap-2">
          <PackageOpen size={18} className="text-primary" /> Today's Assigned Deliveries
        </h2>
        <button className="text-sm font-bold text-primary hover:underline" onClick={() => navigate('/driver/deliveries')}>View All Queue</button>
      </div>
      
      <div className="space-y-4">
        {activeDeliveries.map((delivery, index) => {
          const priority = delivery.risk_level === 'High' || delivery.risk_level === 'Critical' ? 'High' : 'Normal';
          
          return (
            <motion.div 
              key={delivery.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex flex-col md:flex-row items-center gap-6 p-5 rounded-2xl border bg-brand-card shadow-sm transition-all duration-300 hover:shadow-md ${
                index === 0 ? 'border-primary/50 bg-primary/5' : 'border-brand-border'
              }`}
            >
              <div className="flex flex-col items-center justify-center shrink-0 w-full md:w-auto md:pr-6 md:border-r border-brand-border">
                <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full mb-2 ${
                  priority === 'High' ? 'bg-danger/10 text-danger' : 'bg-brand-background text-muted'
                }`}>
                  {priority} Priority
                </span>
                <span className="text-sm font-bold text-brand-text">{delivery.delivery_id || `DEL-${delivery.id}`}</span>
                <span className="text-xs font-semibold text-primary mt-1">{index === 0 ? 'Next Pickup' : 'Queued'}</span>
              </div>

              <div className="flex-1 w-full flex flex-col gap-2">
                <h3 className="text-base font-bold text-brand-text flex items-center gap-2">
                  <MapPin size={16} className="text-muted" />
                  {delivery.customer?.name || "Customer Name"}
                </h3>
                <p className="text-sm font-medium text-muted pl-6">{delivery.customer?.address || "Customer Address"}</p>
                
                <div className="flex items-center gap-4 mt-2 pl-6">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-brand-text">
                    <Navigation size={14} className="text-blue-500" />
                    {delivery.distance_km || 0} km
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-brand-text">
                    <Clock size={14} className="text-warning" />
                    {delivery.Delivery_Time || 0} mins ETA
                  </div>
                </div>
              </div>

              <div className="shrink-0 w-full md:w-auto mt-4 md:mt-0">
                <button className={`w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-colors ${
                  index === 0 
                    ? 'bg-primary text-white hover:bg-primary/90 shadow-[0_0_15px_rgba(124,58,237,0.3)]' 
                    : 'bg-brand-background text-brand-text border border-brand-border hover:border-primary/50'
                }`} onClick={() => toast.success('Action simulated successfully')}>
                  <Navigation size={16} />
                  {index === 0 ? 'Start Navigation' : 'View Details'}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
export default AssignedDeliveries;
