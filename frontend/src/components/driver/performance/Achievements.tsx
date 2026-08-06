import { Trophy, Lock, Medal, Flame, Star, Heart } from 'lucide-react';

export const Achievements = () => {
  const achievements = [
    { title: "100 Deliveries", desc: "Completed 100 lifetime deliveries", icon: Medal, unlocked: true, color: "text-primary" },
    { title: "On Fire", desc: "50 consecutive successful deliveries", icon: Flame, unlocked: true, color: "text-danger" },
    { title: "Top Rated", desc: "Maintain 4.8+ rating for a month", icon: Star, unlocked: true, color: "text-warning" },
    { title: "Customer Favorite", desc: "Receive 20 perfect compliments", icon: Heart, unlocked: true, color: "text-pink-500" },
    { title: "1000 Deliveries", desc: "Complete 1000 lifetime deliveries", icon: Trophy, unlocked: false, color: "text-muted" },
    { title: "Speed Demon", desc: "Beat ETA 100 times", icon: Zap, unlocked: false, color: "text-muted" },
  ];

  return (
    <div className="rounded-2xl border border-brand-border bg-brand-card p-6 shadow-soft h-full">
      <h2 className="text-base font-bold text-brand-text mb-6">Achievements</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((ach, idx) => {
          const Icon = ach.unlocked ? ach.icon : Lock;
          return (
            <div 
              key={idx}
              className={`flex items-start gap-3 p-4 rounded-xl border transition-all ${
                ach.unlocked 
                  ? 'border-brand-border bg-brand-background/50 hover:border-primary/30' 
                  : 'border-brand-border/50 bg-brand-background/20 opacity-60 grayscale'
              }`}
            >
              <div className={`p-2.5 rounded-xl bg-brand-card shadow-sm border border-brand-border shrink-0`}>
                <Icon size={18} className={ach.color} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-brand-text">{ach.title}</h3>
                <p className="text-[10px] font-medium text-muted mt-0.5 leading-tight">{ach.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
import { Zap } from 'lucide-react';
export default Achievements;
