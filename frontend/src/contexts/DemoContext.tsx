import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

export type SimulationSpeed = 1 | 2 | 4;

export interface DemoContextType {
  isDemoMode: boolean;
  setIsDemoMode: (val: boolean) => void;
  currentStep: number;
  isPlaying: boolean;
  playbackSpeed: SimulationSpeed;
  animatedRiskScore: number;
  
  play: () => void;
  pause: () => void;
  restart: () => void;
  nextStep: () => void;
  prevStep: () => void;
  setSpeed: (speed: SimulationSpeed) => void;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

const MAX_STEPS = 10;

const STEP_DURATIONS = {
  1: 4000,
  2: 4000,
  3: 4000,
  4: 5000,
  5: 4000,
  6: 5000,
  7: 4000,
  8: 6000,
  9: 3000,
  10: 10000,
};

const RISK_MAPPING: Record<number, number> = {
  1: 18,
  2: 42,
  3: 71,
  4: 71,
  5: 93,
  6: 93,
  7: 93,
  8: 14, // we will animate down to 14
  9: 14,
  10: 14,
};

export const DemoProvider = ({ children }: { children: ReactNode }) => {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<SimulationSpeed>(1);
  const [animatedRiskScore, setAnimatedRiskScore] = useState(18);

  // Handle risk score animation
  useEffect(() => {
    if (!isDemoMode) return;

    const targetRisk = RISK_MAPPING[currentStep] || 18;
    
    if (currentStep === 8 && animatedRiskScore === 93) {
      // Step 8 special animation: 93 -> 54 -> 29 -> 14
      const phases = [54, 29, 14];
      let i = 0;
      const interval = setInterval(() => {
        if (i < phases.length) {
          setAnimatedRiskScore(phases[i]);
          i++;
        } else {
          clearInterval(interval);
        }
      }, 1500 / playbackSpeed);
      return () => clearInterval(interval);
    } else {
      setAnimatedRiskScore(targetRisk);
    }
  }, [currentStep, isDemoMode, playbackSpeed, animatedRiskScore]);

  // Handle global notifications on step changes
  useEffect(() => {
    if (!isDemoMode || currentStep === 1) return;

    // We don't want to spam if quickly skipping
    const timeout = setTimeout(() => {
      switch (currentStep) {
        case 2:
          toast('Driver reached society', { description: 'Risk increased to 42%' });
          break;
        case 3:
          toast.warning('High Risk Delivery Detected', { description: 'Risk increased to 71%' });
          break;
        case 5:
          toast.error('Critical Risk Alert', { description: 'Delivery risk reached 93%' });
          break;
        case 6:
          toast.info('AI Contacting Customer...', { description: 'Automated resolution initiated.' });
          break;
        case 7:
          toast.success('Visitor Approval Granted', { description: 'Driver route updated.' });
          break;
        case 8:
          toast.success('Risk Reduced', { description: 'Delivery returning to safe state.' });
          break;
        case 9:
          toast.success('Delivery Successfully Completed');
          break;
        case 10:
          toast.success('AI Prevented Delivery Failure', { description: 'Simulation Complete.' });
          break;
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, [currentStep, isDemoMode]);

  // Autoplay logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isPlaying && isDemoMode && currentStep < MAX_STEPS) {
      const baseDuration = STEP_DURATIONS[currentStep as keyof typeof STEP_DURATIONS] || 4000;
      const actualDuration = baseDuration / playbackSpeed;
      
      timer = setTimeout(() => {
        setCurrentStep(s => Math.min(s + 1, MAX_STEPS));
      }, actualDuration);
    } else if (currentStep >= MAX_STEPS) {
      setIsPlaying(false);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isPlaying, isDemoMode, currentStep, playbackSpeed]);


  const play = () => setIsPlaying(true);
  const pause = () => setIsPlaying(false);
  const restart = () => {
    setCurrentStep(1);
    setIsPlaying(true);
    setAnimatedRiskScore(18);
  };
  const nextStep = () => setCurrentStep(s => Math.min(s + 1, MAX_STEPS));
  const prevStep = () => setCurrentStep(s => Math.max(s - 1, 1));
  const setSpeed = (s: SimulationSpeed) => setPlaybackSpeed(s);

  return (
    <DemoContext.Provider value={{
      isDemoMode,
      setIsDemoMode,
      currentStep,
      isPlaying,
      playbackSpeed,
      animatedRiskScore,
      play,
      pause,
      restart,
      nextStep,
      prevStep,
      setSpeed
    }}>
      {children}
    </DemoContext.Provider>
  );
};

export const useDemoContext = () => {
  const context = useContext(DemoContext);
  if (context === undefined) {
    throw new Error('useDemoContext must be used within a DemoProvider');
  }
  return context;
};
