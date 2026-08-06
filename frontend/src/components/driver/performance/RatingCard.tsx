import { Star, Shield, TrendingUp } from 'lucide-react';

export const RatingCard = () => {
  return (
    <div className="rounded-3xl border border-brand-border bg-brand-card p-6 shadow-soft relative overflow-hidden flex flex-col justify-between h-full">
      {/* Decorative gradient */}
      <div className="absolute -top-16 -right-16 w-32 h-32 bg-warning/10 rounded-full blur-[40px]"></div>

      <div>
        <h2 className="text-base font-bold text-brand-text mb-6">Driver Level & Rating</h2>
        
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center shadow-[0_0_20px_rgba(251,191,36,0.3)] border border-yellow-300/30">
             <Shield size={32} className="text-white" />
          </div>
          <div>
             <span className="text-xs font-black uppercase tracking-widest text-warning mb-1 block">Current Tier</span>
             <h3 className="text-2xl font-black text-brand-text tracking-tight">Gold Partner</h3>
          </div>
        </div>
      </div>

      <div className="bg-brand-background/50 rounded-xl p-5 border border-brand-border">
        <div className="flex items-end justify-between mb-2">
           <div>
             <span className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1">Overall Rating</span>
             <div className="flex gap-1">
               {[1, 2, 3, 4, 5].map((star) => (
                 <Star key={star} size={16} className={star <= 4 ? "text-warning fill-warning" : "text-brand-border fill-brand-background"} />
               ))}
             </div>
           </div>
           <p className="text-3xl font-black text-brand-text">4.8<span className="text-lg text-muted font-bold">/5</span></p>
        </div>
        
        <div className="flex items-center gap-2 mt-4 text-xs font-bold text-success bg-success/10 w-fit px-2.5 py-1 rounded-md border border-success/20">
          <TrendingUp size={14} /> +0.2 this month
        </div>
      </div>
    </div>
  );
};
export default RatingCard;
