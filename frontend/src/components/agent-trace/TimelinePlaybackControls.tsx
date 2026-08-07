import { Play, RotateCcw, SkipBack, SkipForward } from 'lucide-react';
import { toast } from 'sonner';

export const TimelinePlaybackControls = () => {
  const handleSimClick = () => toast.info('Playback controls are available in simulation mode.');
  
  return (
    <div className="h-[80px] shrink-0 bg-brand-card border-t border-brand-border flex items-center justify-between px-6 z-20 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
      <div className="flex items-center gap-6">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Replay Timeline</span>
          <span className="text-sm font-black text-brand-text">Simulation Mode</span>
        </div>
        <div className="h-8 w-px bg-brand-border"></div>
        <div className="flex items-center gap-3">
          <button onClick={handleSimClick} className="w-10 h-10 rounded-full border border-brand-border flex items-center justify-center text-slate-500 hover:text-brand-text hover:bg-brand-background transition-colors shadow-sm">
            <SkipBack size={16} />
          </button>
          <button onClick={handleSimClick} className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white hover:bg-primary/90 transition-colors shadow-premium">
            <Play size={20} className="ml-1" />
          </button>
          <button onClick={handleSimClick} className="w-10 h-10 rounded-full border border-brand-border flex items-center justify-center text-slate-500 hover:text-brand-text hover:bg-brand-background transition-colors shadow-sm">
            <SkipForward size={16} />
          </button>
          <button onClick={handleSimClick} className="w-10 h-10 rounded-full border border-brand-border flex items-center justify-center text-slate-500 hover:text-brand-text hover:bg-brand-background transition-colors shadow-sm ml-2">
            <RotateCcw size={16} />
          </button>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Speed</span>
        <div className="flex bg-brand-background rounded-lg border border-brand-border p-1 shadow-inner">
           <button onClick={handleSimClick} className="px-3 py-1 rounded-md text-xs font-bold text-slate-500 hover:text-brand-text transition-colors">1x</button>
           <button onClick={handleSimClick} className="px-3 py-1 rounded-md text-xs font-bold bg-brand-card text-brand-text shadow-sm border border-brand-border/50">2x</button>
           <button onClick={handleSimClick} className="px-3 py-1 rounded-md text-xs font-bold text-slate-500 hover:text-brand-text transition-colors">4x</button>
        </div>
      </div>
    </div>
  );
};

export default TimelinePlaybackControls;
