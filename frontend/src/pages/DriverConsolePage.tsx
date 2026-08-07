
import { Package, Truck, Target, AlertTriangle, Clock } from 'lucide-react';
import DriverWorkspace from '@/components/driver-console/DriverWorkspace';
import DriverAiAssistant from '@/components/driver-console/DriverAiAssistant';
import { useLiveDeliveries } from '@/hooks/useLiveDeliveries';

export const DriverConsolePage = () => {
  const { stats, deliveries } = useLiveDeliveries();

  // Dynamic values
  const currentDelivery = deliveries && deliveries.length > 0 ? deliveries[0] : null;
  const currentRisk = currentDelivery ? currentDelivery.risk_score : 0;
  const riskColor = currentRisk >= 70 ? 'text-danger' : currentRisk >= 40 ? 'text-warning' : 'text-success';
  const riskBg = currentRisk >= 70 ? 'bg-danger/5 border-danger/20' : currentRisk >= 40 ? 'bg-warning/5 border-warning/20' : 'bg-success/5 border-success/20';

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] animate-fade-in -mx-4 -mt-4 lg:mx-0 lg:mt-0 relative overflow-hidden">
      
      {/* Background Subtle Gradient for Premium Feel */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-background via-brand-background to-primary/5 pointer-events-none -z-10"></div>

      {/* Mobile-Friendly Header */}
      <div className="px-4 py-4 lg:px-6 lg:py-6 shrink-0 flex flex-col md:flex-row md:items-end md:justify-between border-b border-brand-border bg-brand-card/50 backdrop-blur-md z-10 relative">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-brand-text tracking-tight flex items-center gap-3">
             Driver Console
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs lg:text-sm mt-1 max-w-xl">AI-powered delivery assistant for successful last-mile deliveries.</p>
        </div>
        
        <div className="flex items-center gap-4 lg:gap-6 mt-4 md:mt-0 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</span>
            <div className="flex items-center gap-2 bg-success/10 border border-success/20 px-3 py-1.5 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.15)]">
              <span className="relative flex h-2 w-2">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
               </span>
               <span className="text-xs font-bold text-success uppercase tracking-wider">Online</span>
            </div>
          </div>
          <div className="h-6 w-px bg-brand-border hidden md:block"></div>
          <div className="flex flex-col md:items-end">
             <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Vehicle</span>
             <span className="text-sm font-bold text-brand-text">EV Two-Wheeler</span>
          </div>
        </div>
      </div>

      {/* Top KPI Cards - Horizontally Scrollable on Mobile */}
       <div className="px-4 py-4 lg:px-6 shrink-0 border-b border-brand-border bg-brand-background/80 overflow-x-auto custom-scrollbar flex gap-4">
         {[
           { label: "Today's Stops", value: stats?.todays_deliveries || "0", icon: Package, color: "text-brand-text", bg: "bg-brand-card" },
           { label: "Completed", value: Math.floor((stats?.todays_deliveries || 0) * ((stats?.success_rate || 0) / 100)).toString(), icon: CheckCircle2Icon, color: "text-brand-text", bg: "bg-brand-card" },
           { label: "Current Order", value: currentDelivery ? `#${currentDelivery.id}` : "-", icon: Truck, color: "text-primary", bg: "bg-primary/5 border-primary/20" },
           { label: "Success Rate", value: `${(stats?.success_rate || 0).toFixed(1)}%`, icon: Target, color: "text-success", bg: "bg-success/5 border-success/20" },
           { label: "Current Risk", value: `${currentRisk}%`, icon: AlertTriangle, color: riskColor, bg: riskBg },
           { label: "Est. Finish", value: "6:30 PM", icon: Clock, color: "text-brand-text", bg: "bg-brand-card" },
         ].map((stat, idx) => (
           <div key={idx} className={`min-w-[140px] flex-1 border border-brand-border rounded-xl p-3 shadow-sm flex flex-col justify-between ${stat.bg}`}>
             <div className="flex justify-between items-start mb-2">
               <span className="text-[10px] uppercase font-bold text-slate-500">{stat.label}</span>
               <stat.icon size={14} className={stat.color} />
             </div>
             <span className={`text-xl font-black ${stat.color}`}>{stat.value}</span>
           </div>
         ))}
      </div>

      {/* Main Content Layout (Responsive Two-Column) */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 lg:p-6 pb-24 lg:pb-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
          
          {/* Left: Driver Workspace (70% on desktop) */}
          <div className="flex-[2] min-w-0">
             <DriverWorkspace deliveries={deliveries} />
          </div>

          {/* Right: AI Assistant (30% on desktop) */}
          <div className="flex-1 min-w-0">
             <DriverAiAssistant currentDelivery={currentDelivery} />
          </div>

        </div>
      </div>

    </div>
  );
};

// SVG Icon Helper
const CheckCircle2Icon = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>
  </svg>
);

export default DriverConsolePage;
