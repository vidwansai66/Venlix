import { useState } from 'react';
import { Power } from 'lucide-react';
import { motion } from 'framer-motion';

export const DriverHeader = () => {
  const [isOnline, setIsOnline] = useState(true);

  // In a real app, these would come from props/context
  const driverName = "John Doe";
  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const currentShift = "Morning Shift (8 AM - 4 PM)";

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-black text-brand-text tracking-tight">
          Welcome Back, <span className="text-primary">{driverName}</span>
        </h1>
        <p className="text-muted mt-1 text-sm font-medium">
          Let's complete today's deliveries safely.
        </p>
        <div className="flex items-center gap-4 mt-3 text-xs font-bold text-muted uppercase tracking-wider">
          <span>{currentDate}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-brand-border"></span>
          <span>{currentShift}</span>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOnline(!isOnline)}
        className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-bold transition-all duration-300 shadow-soft ${
          isOnline 
            ? 'bg-success/10 text-success border border-success/20 hover:bg-success/20' 
            : 'bg-brand-card text-muted border border-brand-border hover:bg-brand-background'
        }`}
      >
        <div className={`relative flex items-center justify-center w-8 h-8 rounded-full ${isOnline ? 'bg-success/20' : 'bg-brand-border'}`}>
          <Power size={16} className={isOnline ? 'text-success' : 'text-muted'} />
          {isOnline && (
            <span className="absolute inset-0 rounded-full animate-ping bg-success opacity-20"></span>
          )}
        </div>
        <span>{isOnline ? "YOU'RE ONLINE" : "YOU'RE OFFLINE"}</span>
      </motion.button>
    </div>
  );
};
export default DriverHeader;
