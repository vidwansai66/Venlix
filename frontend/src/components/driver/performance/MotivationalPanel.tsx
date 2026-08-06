import { Sparkles } from 'lucide-react';

export const MotivationalPanel = () => {
  return (
    <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 to-transparent p-6 relative overflow-hidden h-full flex flex-col justify-center">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-[40px] -mr-10 -mt-10 pointer-events-none"></div>
      
      <Sparkles size={24} className="text-primary mb-4" />
      
      <h3 className="text-lg font-black text-brand-text tracking-tight mb-2">Excellent work today!</h3>
      <p className="text-sm font-medium text-brand-text/80 leading-relaxed mb-4">
        You're currently in the <span className="font-bold text-primary">Top 10%</span> of delivery partners this week. 
        Only 2 more deliveries to reach your daily goal!
      </p>
      
      <p className="text-xs font-bold text-muted uppercase tracking-wider">
        Keep maintaining your customer rating.
      </p>
    </div>
  );
};
export default MotivationalPanel;
