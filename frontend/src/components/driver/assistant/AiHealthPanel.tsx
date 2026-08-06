import { Server, Activity, ShieldCheck, Database } from 'lucide-react';

export const AiHealthPanel = () => {
  return (
    <div className="rounded-2xl border border-brand-border bg-brand-card p-6 shadow-soft">
      <h2 className="text-base font-bold text-brand-text mb-4">AI Copilot Health</h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server size={14} className="text-muted" />
            <span className="text-sm font-medium text-brand-text">Model Status</span>
          </div>
          <span className="flex items-center gap-1.5 text-xs font-bold text-success">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></span>
            Connected
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity size={14} className="text-muted" />
            <span className="text-sm font-medium text-brand-text">Last Updated</span>
          </div>
          <span className="text-xs font-bold text-muted">Just now</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-muted" />
            <span className="text-sm font-medium text-brand-text">Confidence</span>
          </div>
          <span className="text-xs font-bold text-primary">98.5%</span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-brand-border">
          <div className="flex items-center gap-2">
            <Database size={14} className="text-muted" />
            <span className="text-sm font-medium text-brand-text">Backend Link</span>
          </div>
          <span className="text-xs font-bold text-success">Healthy</span>
        </div>
      </div>
    </div>
  );
};
export default AiHealthPanel;
