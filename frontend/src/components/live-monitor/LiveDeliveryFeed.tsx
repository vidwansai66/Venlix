import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/Card';
import { Search, Filter, ShieldAlert, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useNavigate } from 'react-router-dom';

export const LiveDeliveryFeed = ({ 
  deliveries,
  searchQuery,
  setSearchQuery,
  activeFilter,
  setActiveFilter
}: { 
  deliveries?: any[],
  searchQuery?: string,
  setSearchQuery?: (q: string) => void,
  activeFilter?: string | null,
  setActiveFilter?: (f: string | null) => void
}) => {
  const navigate = useNavigate();
  const feedEvents = (deliveries || []).map((delivery: any) => {
    const isHighRisk = delivery.risk_score >= 70;
    const isMediumRisk = delivery.risk_score >= 40 && delivery.risk_score < 70;
    
    return {
      time: new Date(delivery.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: `Order #${delivery.id}: ${delivery.risk_score}% Risk (${delivery.current_status || delivery.driver_status})`,
      highlight: isHighRisk || isMediumRisk,
      color: isHighRisk ? 'text-danger' : isMediumRisk ? 'text-orange-500' : 'text-success'
    };
  });

  const filters = ['Risk', 'Driver', 'Society', 'Status'];

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Search and Filters */}
      <div className="bg-brand-card border border-brand-border rounded-2xl p-4 shadow-soft shrink-0">
        <div className="flex gap-2 mb-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search Order, Society..." 
              value={searchQuery || ''}
              onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-3 bg-brand-background border border-brand-border rounded-xl text-xs focus:outline-none focus:border-primary text-brand-text"
            />
          </div>
          <Button variant="outline" size="sm" className="shrink-0 px-3" onClick={() => setActiveFilter && setActiveFilter(null)}>
            <Filter size={14} className={activeFilter ? "text-primary" : ""} />
          </Button>
        </div>
        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
          {filters.map(f => (
            <Badge 
              key={f}
              variant={activeFilter === f ? "default" : "outline"} 
              className={`shrink-0 cursor-pointer ${activeFilter === f ? "bg-primary text-white" : "hover:bg-brand-background"}`}
              onClick={() => setActiveFilter && setActiveFilter(activeFilter === f ? null : f)}
            >
              {f}
            </Badge>
          ))}
        </div>
      </div>

      {/* Live Delivery Feed (Timeline) */}
      <Card className="flex-1 flex flex-col min-h-[300px] shadow-soft">
        <div className="p-4 border-b border-brand-border flex justify-between items-center bg-brand-background/50">
           <h3 className="text-sm font-bold text-brand-text">Live Delivery Feed</h3>
           <div className="flex items-center gap-2">
             <span className="relative flex h-2 w-2">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
               <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
             </span>
             <span className="text-[10px] font-bold text-success uppercase tracking-wider">Live</span>
           </div>
        </div>
        <CardContent className="p-5 flex-1 overflow-y-auto custom-scrollbar relative">
           <div className="absolute left-7 top-5 bottom-5 w-0.5 bg-brand-border"></div>
           <div className="space-y-6">
             {feedEvents.map((event, idx) => (
               <motion.div 
                 key={idx}
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ delay: idx * 0.2 }}
                 className="flex gap-4 relative z-10"
               >
                 <div className="w-12 pt-1 text-right shrink-0">
                   <span className="text-[10px] font-bold text-slate-500 uppercase">{event.time}</span>
                 </div>
                 <div className={`w-3 h-3 rounded-full mt-1.5 shrink-0 border-2 ${event.highlight ? `border-current ${event.color} bg-brand-background shadow-[0_0_8px_currentColor]` : 'border-slate-300 bg-brand-background text-slate-300'}`} />
                 <div className="pt-0.5">
                   <p className={`text-sm font-semibold ${event.highlight ? event.color : 'text-brand-text'}`}>{event.text}</p>
                 </div>
               </motion.div>
             ))}
           </div>
        </CardContent>
      </Card>

      {/* AI Recommendations Panel */}
      <Card className="shrink-0 shadow-soft bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
        <div className="p-4 border-b border-primary/10 flex justify-between items-center">
           <h3 className="text-sm font-bold text-primary flex items-center gap-2"><ShieldAlert size={16}/> Active AI Recommendations</h3>
        </div>
        <CardContent className="p-4 space-y-3">
          {(deliveries || []).slice(0, 3).map((delivery: any, idx: number) => {
             const reasons = JSON.parse(delivery.json_response || "{}").risk_factors || ["No specific factor"];
             const firstReason = typeof reasons[0] === 'object' && reasons[0] !== null ? reasons[0].factor : reasons[0];
             return (
               <div key={idx} className="bg-brand-background border border-brand-border rounded-xl p-3 flex justify-between items-center shadow-sm">
                 <span className="text-xs font-bold text-brand-text truncate mr-2" title={firstReason}>{firstReason}</span>
                 <Badge variant={delivery.risk_score > 70 ? "danger" : "warning"} pill className="text-[9px] px-1.5 py-0 uppercase">
                   {delivery.risk_score > 70 ? "High" : "Med"}
                 </Badge>
               </div>
             )
          })}
        </CardContent>
      </Card>

    </div>
  );
};
export default LiveDeliveryFeed;
