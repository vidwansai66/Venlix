import { CheckCircle2, Clock } from 'lucide-react';

export const RecentRecommendations = () => {
  const history = [
    { time: "11:15 AM", text: "Alternative Route Suggested", status: "Resolved", icon: CheckCircle2, color: "text-success" },
    { time: "12:42 PM", text: "Call Customer Before Arrival", status: "Resolved", icon: CheckCircle2, color: "text-success" },
    { time: "02:30 PM", text: "Heavy Rain Alert", status: "Pending", icon: Clock, color: "text-warning" },
  ];

  return (
    <div className="rounded-2xl border border-brand-border bg-brand-card p-6 shadow-soft mb-6">
      <h2 className="text-base font-bold text-brand-text mb-4">Recent AI Interventions</h2>
      <div className="space-y-4">
        {history.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex flex-col pb-3 border-b border-brand-border last:border-0 last:pb-0">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-bold text-muted uppercase tracking-wider">{item.time}</span>
                <span className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider ${item.color}`}>
                  <Icon size={12} /> {item.status}
                </span>
              </div>
              <p className="text-sm font-semibold text-brand-text">{item.text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default RecentRecommendations;
