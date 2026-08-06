import { motion } from 'framer-motion';
import { MapPin, Navigation, Clock, Phone, AlertTriangle, Lightbulb, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export interface Delivery {
  internalId: number;
  id: string;
  customerName: string;
  customerPhone: string;
  address: string;
  distance: string;
  eta: string;
  orderValue: string;
  status: string;
  priority: string;
  riskLevel: number;
  aiRecommendation: string;
}

interface DeliveryCardProps {
  delivery: Delivery;
  onViewDetails: (delivery: Delivery) => void;
}

export const DeliveryCard = ({ delivery, onViewDetails }: DeliveryCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Assigned': return 'bg-brand-background text-muted border-brand-border';
      case 'Picked Up': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'On Route': return 'bg-primary/10 text-primary border-primary/20';
      case 'Delivered': return 'bg-success/10 text-success border-success/20';
      case 'Failed': return 'bg-danger/10 text-danger border-danger/20';
      default: return 'bg-brand-background text-brand-text border-brand-border';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'text-danger';
      case 'High': return 'text-warning';
      case 'Medium': return 'text-primary';
      default: return 'text-muted';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col rounded-2xl border border-brand-border bg-brand-card p-5 shadow-soft transition-all duration-300 hover:shadow-premium hover:border-primary/30"
    >
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
        
        {/* Left Section: Badges & Info */}
        <div className="flex-1 flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-3 mb-1">
            <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border ${getStatusColor(delivery.status)}`}>
              {delivery.status}
            </span>
            <span className={`text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 ${getPriorityColor(delivery.priority)}`}>
              {delivery.priority === 'Critical' || delivery.priority === 'High' ? <AlertTriangle size={12} /> : null}
              {delivery.priority} Priority
            </span>
            <span className="text-[11px] font-bold text-muted ml-auto lg:ml-0 bg-brand-background px-2 py-1 rounded-md border border-brand-border">
              {delivery.id}
            </span>
          </div>

          <div>
            <h2 className="text-xl font-bold text-brand-text mb-1">{delivery.customerName}</h2>
            <div className="flex items-center gap-4 text-sm font-medium text-muted">
              <span className="flex items-center gap-1.5"><MapPin size={14} className="text-primary"/> {delivery.address}</span>
              <span className="flex items-center gap-1.5"><Phone size={14} /> {delivery.customerPhone}</span>
            </div>
          </div>

          <div className="flex items-center gap-6 mt-1 border-t border-brand-border/50 pt-3">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-muted">Distance</span>
              <span className="text-sm font-bold text-brand-text flex items-center gap-1"><Navigation size={14} className="text-blue-500"/>{delivery.distance}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-muted">ETA</span>
              <span className="text-sm font-bold text-brand-text flex items-center gap-1"><Clock size={14} className="text-warning"/>{delivery.eta}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-muted">Value</span>
              <span className="text-sm font-bold text-success">{delivery.orderValue}</span>
            </div>
          </div>
        </div>

        {/* Right Section: AI Rec & Actions */}
        <div className="lg:w-[320px] shrink-0 flex flex-col gap-4">
          
          {/* AI Recommendation Box */}
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 flex gap-3 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-full blur-[20px] -mr-8 -mt-8"></div>
             <Lightbulb size={18} className="text-primary shrink-0 mt-0.5" />
             <div>
               <span className="text-[10px] font-bold text-primary uppercase tracking-wider block mb-0.5">AI Suggestion</span>
               <p className="text-xs font-semibold text-brand-text/90 leading-relaxed">{delivery.aiRecommendation}</p>
             </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 mt-auto">
            {delivery.status !== 'Delivered' && delivery.status !== 'Failed' && (
              <motion.button onClick={() => {
                toast.success('Navigation started successfully');
                // Could call updateDeliveryLocal(delivery.internalId, { prediction: 'On Route' }) etc if we had an "On Route" prediction. 
                // But let's just trigger toast for navigation.
              }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-colors shadow-[0_0_10px_rgba(124,58,237,0.3)]">
                <Navigation size={14} /> Navigate
              </motion.button>
            )}
            
            {delivery.status === 'Assigned' && (
              <motion.button onClick={() => {
                toast.success('Delivery Picked Up');
                import('@/hooks/useDriverData').then(m => m.updateDeliveryLocal(delivery.internalId, { prediction: 'Delivery Successful' })); // Simulating next stage
              }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-blue-500 text-white text-xs font-bold hover:bg-blue-600 transition-colors shadow-[0_0_10px_rgba(59,130,246,0.3)]">
                <CheckCircle2 size={14} /> Pick Up
              </motion.button>
            )}

            {delivery.status === 'On Route' && (
              <motion.button onClick={() => {
                toast.success('Delivery marked as complete');
                import('@/hooks/useDriverData').then(m => m.updateDeliveryLocal(delivery.internalId, { prediction: 'Delivery Successful' }));
              }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-success text-white text-xs font-bold hover:bg-success/90 transition-colors shadow-[0_0_10px_rgba(34,197,94,0.3)]">
                <CheckCircle2 size={14} /> Mark Delivered
              </motion.button>
            )}

            <motion.button 
              onClick={() => onViewDetails(delivery)}
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.98 }} 
              className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg border border-brand-border bg-brand-background text-brand-text text-xs font-bold hover:border-primary/50 transition-colors ${(delivery.status === 'Delivered' || delivery.status === 'Failed' || delivery.status === 'Assigned' || delivery.status === 'Picked Up') ? 'col-span-2' : ''}`}
            >
               View Details
            </motion.button>
            
            {delivery.status === 'Delivered' && (
              <motion.button onClick={() => {
                toast.success('Issue reported successfully');
                import('@/hooks/useDriverData').then(m => m.updateDeliveryLocal(delivery.internalId, { prediction: 'Delivery Failure' }));
              }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg border border-danger/30 bg-danger/5 text-danger text-xs font-bold hover:bg-danger/10 transition-colors col-span-2">
                <AlertCircle size={14} /> Report Issue
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
export default DeliveryCard;
