import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Navigation, Clock, Package, DollarSign, Lightbulb, AlertTriangle, FileText, User } from 'lucide-react';
import type { Delivery } from './DeliveryCard';
import { toast } from 'sonner';

interface DeliveryDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  delivery: Delivery | null;
}

export const DeliveryDetailsDrawer = ({ isOpen, onClose, delivery }: DeliveryDetailsDrawerProps) => {
  if (!delivery && isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && delivery && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%', boxShadow: '-20px 0 50px rgba(0,0,0,0)' }}
            animate={{ x: 0, boxShadow: '-20px 0 50px rgba(0,0,0,0.2)' }}
            exit={{ x: '100%', boxShadow: '-20px 0 50px rgba(0,0,0,0)' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-brand-card border-l border-brand-border z-50 flex flex-col shadow-premium overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-brand-border bg-brand-background/50">
              <div>
                <h2 className="text-lg font-black text-brand-text tracking-tight">Delivery Details</h2>
                <p className="text-xs font-bold text-muted uppercase tracking-wider mt-1">{delivery.id}</p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 rounded-full hover:bg-brand-background text-muted hover:text-brand-text transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content Scrollable Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              
              {/* Core Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <User size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-brand-text">{delivery.customerName}</h3>
                    <p className="text-xs font-medium text-muted">{delivery.customerPhone}</p>
                  </div>
                </div>
                
                <div className="bg-brand-background rounded-xl p-4 border border-brand-border flex gap-3">
                  <MapPin size={18} className="text-danger shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Destination</span>
                    <p className="text-sm font-semibold text-brand-text mt-0.5">{delivery.address}</p>
                  </div>
                </div>
              </div>

              {/* Grid Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-brand-background rounded-xl p-4 border border-brand-border flex flex-col justify-center items-center text-center">
                   <Clock size={18} className="text-warning mb-2" />
                   <span className="text-[10px] font-bold uppercase tracking-wider text-muted">ETA</span>
                   <p className="text-base font-bold text-brand-text">{delivery.eta}</p>
                </div>
                <div className="bg-brand-background rounded-xl p-4 border border-brand-border flex flex-col justify-center items-center text-center">
                   <Navigation size={18} className="text-blue-500 mb-2" />
                   <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Distance</span>
                   <p className="text-base font-bold text-brand-text">{delivery.distance}</p>
                </div>
                <div className="bg-brand-background rounded-xl p-4 border border-brand-border flex flex-col justify-center items-center text-center">
                   <Package size={18} className="text-primary mb-2" />
                   <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Category</span>
                   <p className="text-base font-bold text-brand-text">Electronics</p>
                </div>
                <div className="bg-brand-background rounded-xl p-4 border border-brand-border flex flex-col justify-center items-center text-center">
                   <DollarSign size={18} className="text-success mb-2" />
                   <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Order Value</span>
                   <p className="text-base font-bold text-brand-text">{delivery.orderValue}</p>
                </div>
              </div>

              {/* AI Analysis Block */}
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-[20px] -mr-8 -mt-8"></div>
                <h3 className="text-xs font-black uppercase tracking-wider text-primary flex items-center gap-2 mb-3">
                  <Lightbulb size={14} /> AI Analysis
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-bold text-muted uppercase">Recommendation</span>
                    <p className="text-sm font-semibold text-brand-text leading-relaxed mt-0.5">{delivery.aiRecommendation}</p>
                  </div>
                  
                  <div>
                    <span className="text-[10px] font-bold text-muted uppercase">Risk Level</span>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1.5 bg-brand-border rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${delivery.riskLevel > 0.5 ? 'bg-danger' : delivery.riskLevel > 0.2 ? 'bg-warning' : 'bg-success'}`}
                          style={{ width: `${delivery.riskLevel * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-bold text-brand-text">{(delivery.riskLevel * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-muted flex items-center gap-2 mb-3">
                  <FileText size={14} /> Special Instructions
                </h3>
                <div className="bg-brand-background rounded-xl p-4 border border-brand-border">
                  <p className="text-sm font-medium text-brand-text leading-relaxed">
                    "Please leave package with the security guard at the front gate if no one answers the door. Do not ring doorbell."
                  </p>
                </div>
              </div>

            </div>

            {/* Footer Action */}
            <div className="p-6 border-t border-brand-border bg-brand-background/50 mt-auto">
              <button onClick={() => {
                toast.success('Navigation started successfully');
                onClose();
              }} className="w-full py-3.5 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-colors shadow-[0_0_15px_rgba(124,58,237,0.3)]">
                Start Navigation
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
export default DeliveryDetailsDrawer;
