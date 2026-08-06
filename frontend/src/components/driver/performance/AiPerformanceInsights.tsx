import { Lightbulb, TrendingUp, AlertCircle, MapPin } from 'lucide-react';

export const AiPerformanceInsights = () => {
  return (
    <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 relative overflow-hidden h-full">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[40px] -mr-10 -mt-10 pointer-events-none"></div>
      
      <h2 className="text-base font-bold text-primary mb-6 flex items-center gap-2">
        <Lightbulb size={18} /> AI Performance Insights
      </h2>

      <div className="space-y-4">
        <div className="flex items-start gap-3">
           <div className="p-1.5 rounded bg-success/10 text-success shrink-0 mt-0.5">
             <TrendingUp size={14} />
           </div>
           <div>
             <p className="text-sm font-semibold text-brand-text">Excellent delivery speed.</p>
             <p className="text-xs font-medium text-muted mt-0.5">Your average delivery time improved by 12% this week compared to last week.</p>
           </div>
        </div>

        <div className="flex items-start gap-3">
           <div className="p-1.5 rounded bg-warning/10 text-warning shrink-0 mt-0.5">
             <AlertCircle size={14} />
           </div>
           <div>
             <p className="text-sm font-semibold text-brand-text">Traffic delays detected.</p>
             <p className="text-xs font-medium text-muted mt-0.5">High traffic affected 3 of your deliveries yesterday in Sector 4.</p>
           </div>
        </div>

        <div className="flex items-start gap-3">
           <div className="p-1.5 rounded bg-primary/10 text-primary shrink-0 mt-0.5">
             <MapPin size={14} />
           </div>
           <div>
             <p className="text-sm font-semibold text-brand-text">Route optimization opportunity.</p>
             <p className="text-xs font-medium text-muted mt-0.5">Consider accepting AI-suggested alternative routes more often to boost on-time rates.</p>
           </div>
        </div>
      </div>
    </div>
  );
};
export default AiPerformanceInsights;
