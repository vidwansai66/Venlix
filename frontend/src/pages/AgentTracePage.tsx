import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

// Subcomponents
import AiResolutionTimeline from '@/components/agent-trace/AiResolutionTimeline';
import AiIntelligencePanel from '@/components/agent-trace/AiIntelligencePanel';
import TimelinePlaybackControls from '@/components/agent-trace/TimelinePlaybackControls';
import TodayAiPerformanceSidebar from '@/components/agent-trace/TodayAiPerformanceSidebar';
import { useLiveDeliveries } from '@/hooks/useLiveDeliveries';

export const AgentTracePage = () => {
  const { stats, deliveries, refresh } = useLiveDeliveries();
  const latestDelivery = deliveries && deliveries.length > 0 ? deliveries[0] : null;
  return (
    <div className="flex h-[calc(100vh-100px)] animate-fade-in -mx-4 -mt-4 lg:mx-0 lg:mt-0">
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Page Header */}
        <div className="px-6 pt-6 pb-4 shrink-0 flex flex-col sm:flex-row sm:items-end sm:justify-between border-b border-brand-border bg-brand-background/80 backdrop-blur-md z-10 relative">
          <div>
            <h1 className="text-3xl font-extrabold text-brand-text tracking-tight">AI Resolution Timeline</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 max-w-2xl">Watch how AI predicts, explains, and prevents delivery failures in real time.</p>
          </div>
          
          <div className="flex items-center gap-6 mt-4 sm:mt-0">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Simulation Status</span>
              <div className="flex items-center gap-2 bg-danger/10 border border-danger/20 px-3 py-1.5 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.15)]">
                <span className="relative flex h-2 w-2">
                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-danger opacity-75"></span>
                   <span className="relative inline-flex rounded-full h-2 w-2 bg-danger"></span>
                 </span>
                 <span className="text-xs font-bold text-danger uppercase tracking-wider">LIVE</span>
              </div>
            </div>
            <div className="h-8 w-px bg-brand-border"></div>
            <div className="flex items-center gap-2 text-sm font-bold text-brand-text">
               2:36 PM
            </div>
            <Button variant="outline" size="sm" leftIcon={<RefreshCw size={14} />} onClick={refresh}>
              Refresh Stream
            </Button>
          </div>
        </div>

        {/* Top KPI Cards */}
        <div className="px-6 py-4 grid grid-cols-2 lg:grid-cols-4 gap-4 shrink-0 border-b border-brand-border bg-slate-50/50 dark:bg-slate-900/20">
           <div className="bg-brand-card border border-brand-border rounded-xl p-3 shadow-sm flex flex-col">
             <span className="text-[10px] uppercase font-bold text-slate-500">Timeline Events</span>
             <span className="text-xl font-black text-brand-text">{stats?.todays_deliveries || 0}</span>
           </div>
           <div className="bg-brand-card border border-brand-border rounded-xl p-3 shadow-sm flex flex-col">
             <span className="text-[10px] uppercase font-bold text-slate-500">AI Interventions</span>
             <span className="text-xl font-black text-primary">{stats?.ai_prevented_failures || 0}</span>
           </div>
           <div className="bg-success/10 border border-success/20 rounded-xl p-3 shadow-sm flex flex-col">
             <span className="text-[10px] uppercase font-bold text-success">Failures Prevented</span>
             <span className="text-xl font-black text-success">{stats?.ai_prevented_failures || 0}</span>
           </div>
           <div className="bg-brand-card border border-brand-border rounded-xl p-3 shadow-sm flex flex-col">
             <span className="text-[10px] uppercase font-bold text-slate-500">Avg Resolution Time</span>
             <span className="text-xl font-black text-brand-text">3.2m</span>
           </div>
        </div>

        {/* Dynamic Two-Column Layout */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Left Column - Hero Timeline */}
          <div className="w-[320px] lg:w-[400px] shrink-0 border-r border-brand-border p-6 overflow-hidden">
             <AiResolutionTimeline delivery={latestDelivery} />
          </div>

          {/* Right Column - Intelligence Panels */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-slate-50/50 dark:bg-slate-900/20">
             <AiIntelligencePanel delivery={latestDelivery} />
          </div>

        </div>

        {/* Bottom Playback Controls */}
        <TimelinePlaybackControls />

      </div>

      {/* Right Sidebar - Global AI Stats */}
      <TodayAiPerformanceSidebar stats={stats} deliveries={deliveries} />

    </div>
  );
};

export default AgentTracePage;
