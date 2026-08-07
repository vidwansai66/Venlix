import { Activity, Target, Zap, SearchX } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';

export const TodayAiPerformanceSidebar = ({ stats, deliveries }: { stats?: any, deliveries?: any[] }) => {
  const highestRisk = deliveries?.length > 0 ? Math.max(...deliveries.map(d => d.risk_score)) : 0;
  
  return (
    <div className="w-[280px] shrink-0 border-l border-brand-border bg-brand-background flex flex-col h-full overflow-y-auto custom-scrollbar">
      <div className="p-5 border-b border-brand-border bg-brand-card/30">
        <h3 className="text-sm font-bold text-brand-text flex items-center gap-2">
           <Activity size={16} className="text-primary" /> Today's AI Performance
        </h3>
      </div>
      
      <div className="p-5 space-y-6">
        
        <Card className="bg-gradient-to-br from-brand-card to-brand-background shadow-soft border-brand-border">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2">
              <Zap size={24} />
            </div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Highest Risk Detected</p>
            <p className="text-3xl font-black text-danger">{highestRisk}%</p>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Average Resolution Time</p>
            <p className="text-lg font-black text-brand-text flex items-baseline gap-1">
              3.2 <span className="text-xs font-semibold text-slate-500">Minutes</span>
            </p>
          </div>
          
          <div className="h-px w-full bg-brand-border"></div>
          
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Most Common Issue</p>
            <div className="flex items-center gap-2 mt-1">
               <div className="w-6 h-6 rounded bg-brand-card border border-brand-border flex items-center justify-center text-primary">
                 <SearchX size={12} />
               </div>
               <p className="text-sm font-bold text-brand-text">Customer Unavailable</p>
            </div>
          </div>

          <div className="h-px w-full bg-brand-border"></div>

          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Visitor Approval Success</p>
            <p className="text-lg font-black text-success">96%</p>
          </div>
          
          <div className="h-px w-full bg-brand-border"></div>

          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">AI Accuracy</p>
            <div className="flex items-center justify-between">
              <p className="text-xl font-black text-primary">{(stats?.success_rate || 0).toFixed(1)}%</p>
              <Target size={20} className="text-primary/50" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TodayAiPerformanceSidebar;
