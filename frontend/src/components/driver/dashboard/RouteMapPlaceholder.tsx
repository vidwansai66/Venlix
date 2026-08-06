import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Map, Navigation } from 'lucide-react';

export const RouteMapPlaceholder = () => {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold text-brand-text mb-4">Today's Route</h2>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative w-full h-[300px] md:h-[400px] rounded-2xl border border-brand-border bg-brand-background overflow-hidden flex items-center justify-center group shadow-soft"
      >
        {/* Placeholder grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] dark:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] opacity-50"></div>
        
        {/* Decorative map elements */}
        <div className="absolute top-1/2 left-1/4 w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
        <div className="absolute top-1/3 right-1/3 w-4 h-4 bg-primary rounded-full shadow-[0_0_15px_rgba(124,58,237,0.8)] flex items-center justify-center">
          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
        </div>
        <div className="absolute bottom-1/4 right-1/4 w-3 h-3 bg-success rounded-full shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>
        
        {/* Connecting dashed line */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ filter: 'drop-shadow(0 0 4px rgba(124,58,237,0.5))' }}>
          <path d="M25% 50% Q 40% 30% 66% 33% T 75% 75%" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="6 6" className="text-primary/50" />
        </svg>

        <div className="relative z-10 flex flex-col items-center p-6 bg-brand-card/80 backdrop-blur-md rounded-2xl border border-brand-border shadow-premium transform transition-transform duration-300 group-hover:scale-105">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
            <Map size={24} className="text-primary" />
          </div>
          <h3 className="text-base font-bold text-brand-text mb-1">Interactive Route Map</h3>
          <p className="text-xs font-medium text-muted text-center max-w-[200px] mb-4">
            Live turn-by-turn navigation will be connected here.
          </p>
          <button className="flex items-center gap-2 px-4 py-2 bg-brand-background border border-brand-border rounded-lg text-xs font-bold text-brand-text hover:border-primary/50 hover:text-primary transition-colors" onClick={() => toast.success('Action simulated successfully')}>
            <Navigation size={14} />
            Preview Map
          </button>
        </div>
      </motion.div>
    </div>
  );
};
export default RouteMapPlaceholder;
