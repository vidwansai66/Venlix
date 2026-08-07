import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, FastForward, RotateCcw, X, BrainCircuit } from 'lucide-react';
import { useDemoContext, type SimulationSpeed } from '@/contexts/DemoContext';
import { Button } from '@/components/ui/Button';

export const DemoControls = () => {
  const {
    isDemoMode,
    setIsDemoMode,
    currentStep,
    isPlaying,
    playbackSpeed,
    play,
    pause,
    restart,
    nextStep,
    prevStep,
    setSpeed
  } = useDemoContext();

  if (!isDemoMode) return null;

  const stepTitles = [
    "Disabled",
    "Normal Ops",
    "Driver Reaches Society",
    "AI Detects Anomaly",
    "AI Explains Reason",
    "High Risk Alert",
    "AI Contacts Customer",
    "Visitor Pass Approved",
    "Risk Reduced",
    "Delivery Completed",
    "Mission Success"
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-brand-card/90 backdrop-blur-xl border border-brand-border/50 p-2.5 rounded-2xl shadow-premium"
      >
        <div className="flex items-center gap-3 px-3 border-r border-brand-border/50">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
            <BrainCircuit className="text-primary" size={18} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Demo Mode Active</span>
            <span className="text-xs font-medium text-brand-text w-32 truncate">{stepTitles[currentStep]}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={restart}
            className="h-8 w-8 p-0 rounded-full text-slate-400 hover:text-brand-text hover:bg-slate-200 dark:hover:bg-slate-800"
            title="Restart"
          >
            <RotateCcw size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={prevStep}
            disabled={currentStep <= 1}
            className="h-8 w-8 p-0 rounded-full text-slate-400 hover:text-brand-text hover:bg-slate-200 dark:hover:bg-slate-800"
          >
            <SkipBack size={16} />
          </Button>
          
          <Button
            variant="primary"
            size="sm"
            onClick={isPlaying ? pause : play}
            className="h-10 w-10 p-0 rounded-full shadow-md hover:shadow-lg transition-all"
          >
            {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1" />}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={nextStep}
            disabled={currentStep >= 10}
            className="h-8 w-8 p-0 rounded-full text-slate-400 hover:text-brand-text hover:bg-slate-200 dark:hover:bg-slate-800"
          >
            <SkipForward size={16} />
          </Button>
        </div>

        <div className="flex items-center gap-1 border-l border-brand-border/50 pl-3">
          {[1, 2, 4].map((speed) => (
            <Button
              key={speed}
              variant="ghost"
              size="sm"
              onClick={() => setSpeed(speed as SimulationSpeed)}
              className={`h-7 px-2 text-xs font-bold rounded-md ${
                playbackSpeed === speed 
                  ? 'bg-primary/20 text-primary border border-primary/30' 
                  : 'text-slate-400 hover:text-brand-text'
              }`}
            >
              {speed}x
            </Button>
          ))}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsDemoMode(false)}
          className="h-8 w-8 p-0 rounded-full text-slate-400 hover:text-danger hover:bg-danger/10 ml-2"
          title="Exit Demo Mode"
        >
          <X size={16} />
        </Button>
      </motion.div>
    </AnimatePresence>
  );
};
