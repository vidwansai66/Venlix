import { Lightbulb, Clock, Target, Navigation } from 'lucide-react';
import type { DriverDeliveryItem } from '@/hooks/useDriverData';

interface AiRecommendationCardProps {
  delivery: DriverDeliveryItem;
}

export const AiRecommendationCard = ({ delivery }: AiRecommendationCardProps) => {
  const aiRec = delivery.ai_recommendation || {
    title: "Divert to Alternate Route",
    description: "Proceeding on current path may result in delay. Diverting immediately is strongly advised.",
    action: "Review Route",
    time_saved_mins: 0,
    success_probability: (delivery.confidence || 0) * 100
  };

  return (
    <div className="mb-8 rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 via-brand-card to-brand-card p-1 shadow-soft relative overflow-hidden group">
      {/* Animated glow background */}
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
      <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/20 rounded-full blur-[60px] pointer-events-none"></div>

      <div className="bg-brand-background/60 backdrop-blur-md rounded-[22px] p-6 lg:p-8 h-full relative z-10 border border-brand-border/50">
        
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-8">
          <div className="flex gap-4">
             <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0 border border-primary/30 shadow-inner">
               <Lightbulb size={24} className="text-primary" />
             </div>
             <div>
               <span className="text-[10px] font-black uppercase tracking-widest text-primary mb-1 block">Primary Recommendation</span>
               <h2 className="text-2xl lg:text-3xl font-black text-brand-text tracking-tight">{aiRec.title}</h2>
             </div>
          </div>
          
          <div className="flex flex-row lg:flex-col items-center lg:items-end gap-3 shrink-0">
             <span className="px-3 py-1.5 rounded-full bg-danger/10 text-danger text-[10px] font-black uppercase tracking-widest border border-danger/20">
               {delivery.risk_level === 'Critical' || delivery.risk_level === 'High' ? 'High Priority' : 'Advisory'}
             </span>
             <span className="text-sm font-bold text-muted flex items-center gap-1.5">
               Risk: <span className="text-danger">{delivery.risk_level || 'Medium'}</span>
             </span>
          </div>
        </div>

        <p className="text-base font-medium text-brand-text/90 leading-relaxed max-w-3xl mb-8">
          {aiRec.description}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           {/* Metric 1 */}
           <div className="p-4 rounded-2xl bg-brand-card border border-brand-border flex items-center gap-4">
             <div className="p-2.5 rounded-xl bg-brand-background border border-brand-border">
                <Navigation size={18} className="text-blue-500" />
             </div>
             <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-muted block mb-0.5">Delivery ID</span>
                <span className="text-sm font-bold text-brand-text">{delivery.delivery_id || `DEL-${delivery.id}`}</span>
             </div>
           </div>

           {/* Metric 2 */}
           <div className="p-4 rounded-2xl bg-brand-card border border-brand-border flex items-center gap-4">
             <div className="p-2.5 rounded-xl bg-brand-background border border-brand-border">
                <Clock size={18} className="text-success" />
             </div>
             <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-muted block mb-0.5">Time Saved</span>
                <span className="text-sm font-bold text-brand-text">~{aiRec.time_saved_mins || 0} Minutes</span>
             </div>
           </div>

           {/* Metric 3 */}
           <div className="p-4 rounded-2xl bg-brand-card border border-brand-border flex items-center gap-4">
             <div className="p-2.5 rounded-xl bg-brand-background border border-brand-border">
                <Target size={18} className="text-primary" />
             </div>
             <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-muted block mb-0.5">Success Prob.</span>
                <span className="text-sm font-bold text-brand-text">{aiRec.success_probability?.toFixed(1) || ((delivery.confidence || 0) * 100).toFixed(1)}%</span>
             </div>
           </div>
        </div>
        
      </div>
    </div>
  );
};
export default AiRecommendationCard;
