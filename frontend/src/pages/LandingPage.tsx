import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Brain,
  Cpu,
  Sparkles,
  TrendingUp,
  Compass,
  ArrowRight,
  ShieldCheck,
  Server,
  Database,
  Truck,
  Activity,
  Code,
  LineChart,
  UserCheck,
  AlertTriangle,
  Mail,
  FileCode,
  Layers2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/utils/cn';

// Custom SVG Github Icon component since lucide-react might not export it
const GithubIcon = ({ size = 16, className }: { size?: number; className?: string }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

// Intersection Observer CountUp Component
const CountUp = ({ end, duration = 1.5, suffix = '', decimals = 0 }: { end: number; duration?: number; suffix?: string; decimals?: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasStarted) return;
    let startTime: number | null = null;
    const startValue = 0;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const currentValue = progress * (end - startValue) + startValue;
      setCount(Number(currentValue.toFixed(decimals)));
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animate);
  }, [hasStarted, end, duration, decimals]);

  return (
    <span ref={ref} className="font-extrabold tracking-tight">
      {count.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  );
};

// SVG Technology Logos
const PythonLogo = () => (
  <svg className="w-8 h-8" viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M55.8 4.3C40.6 4.3 35.8 9.5 35.8 23.4h19.5v2.8H28.1C14.3 26.2 9 31 9 46.2s4.8 20 18.6 20h7.1v-9.5c0-11.8 9.7-21.5 21.6-21.5h19.5V23.4c0-13.9-4.8-19.1-20-19.1z" fill="url(#py1)" />
    <path d="M54.2 105.7c15.2 0 20-5.2 20-19.1H54.7V83.8h27.2c13.8 0 19.1-4.8 19.1-20s-4.8-20-18.6-20h-7.1v9.5c0 11.8-9.7 21.5-21.6 21.5H34.2v11.8c0 13.9 4.8 19.1 20 19.1z" fill="url(#py2)" />
    <circle cx="44.2" cy="14.2" r="3.6" fill="#fff" />
    <circle cx="65.8" cy="95.8" r="3.6" fill="#fff" />
    <defs>
      <linearGradient id="py1" x1="9" y1="25.2" x2="74.2" y2="25.2" gradientUnits="userSpaceOnUse">
        <stop stopColor="#3776AB" />
        <stop offset="1" stopColor="#1E476A" />
      </linearGradient>
      <linearGradient id="py2" x1="34.2" y1="84.8" x2="101" y2="84.8" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFD343" />
        <stop offset="1" stopColor="#FFC217" />
      </linearGradient>
    </defs>
  </svg>
);

const FastAPILogo = () => (
  <svg className="w-8 h-8" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="64" cy="64" r="64" fill="#059669" />
    <path d="M72.2 24.8L40.8 69.4h22.6v33.8L94.8 58.6H72.2V24.8z" fill="#fff" />
  </svg>
);

const XGBoostLogo = () => (
  <svg className="w-8 h-8" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="20" fill="#E65100" />
    <path d="M25 25L75 75M75 25L25 75" stroke="#fff" strokeWidth="12" strokeLinecap="round" />
  </svg>
);

export const LandingPage = () => {
  const navigate = useNavigate();
  
  // Header background opacity based on scroll
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-[#030712] text-slate-100 min-h-screen font-sans selection:bg-blue-500/20 selection:text-blue-400 overflow-x-hidden relative">
      
      {/* Background Mesh Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-[20%] right-[10%] w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-[20%] left-[5%] w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-[20%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* 1. Navbar */}
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent',
          isScrolled
            ? 'bg-slate-950/80 backdrop-blur-md border-slate-800/60 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.1)]'
            : 'bg-transparent py-5'
        )}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 text-white shadow-lg">
              <span className="text-xl font-black tracking-tighter">V</span>
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              Venlix <span className="text-blue-500 font-black">AI</span>
            </span>
          </div>

          {/* Links */}
          <div className="hidden md:flex items-center gap-8">
            {['Home', 'Features', 'Technology', 'Architecture', 'Team', 'Contact'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm font-semibold text-slate-400 hover:text-white transition-colors duration-200"
              >
                {item}
              </a>
            ))}
          </div>

          <div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/dashboard')}
              rightIcon={<ArrowRight size={14} />}
              className="bg-blue-600 hover:bg-blue-500 text-white border-none rounded-xl"
            >
              Launch Dashboard
            </Button>
          </div>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section id="home" className="max-w-7xl mx-auto px-6 pt-32 pb-24 md:pt-48 md:pb-32 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left text */}
        <div className="lg:col-span-6 space-y-6 text-left">
          <Badge variant="primary" className="bg-blue-500/10 text-blue-400 border-blue-500/20 py-1 px-3">
            <Sparkles size={12} className="mr-1.5 inline text-blue-400 animate-pulse" />
            AI Logistics Optimization
          </Badge>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Predict Delivery <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600">
              Failures Before
            </span>{' '}
            They Happen.
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-lg leading-relaxed">
            Use Machine Learning and AI to predict delivery risks, improve logistics efficiency, and reduce operational losses through intelligent analytics.
          </p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/dashboard')}
              className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-500/20 border-none"
            >
              Launch Dashboard
            </Button>
            <a
              href="https://github.com/vidwansai66/Venlix"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center h-12 px-6 text-sm font-semibold rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800 text-slate-300 hover:text-white transition-all gap-2"
            >
              <GithubIcon size={16} />
              View GitHub
            </a>
          </div>
        </div>

        {/* Right Preview Mockup Dashboard (Floating, Animated) */}
        <div className="lg:col-span-6 flex justify-center relative">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: [0, -10, 0] }}
            transition={{
              y: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
              opacity: { duration: 0.8 }
            }}
            className="w-full max-w-[540px] rounded-2xl border border-slate-800/80 bg-slate-950/70 p-5 shadow-2xl backdrop-blur-md relative"
          >
            {/* Window bar */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-900 mb-5">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500/40" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/40" />
                <span className="w-3 h-3 rounded-full bg-green-500/40" />
              </div>
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                venlix-engine-v1.0.0
              </div>
            </div>

            {/* Simulated Grid */}
            <div className="grid grid-cols-2 gap-4">
              
              {/* Success Rate */}
              <div className="p-4 rounded-xl border border-slate-900 bg-slate-900/40 space-y-2">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                  Delivery Success
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-emerald-400">98.2%</span>
                  <span className="text-[10px] text-emerald-500 font-semibold flex items-center gap-0.5">
                    <TrendingUp size={10} /> +1.2%
                  </span>
                </div>
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '98%' }} />
                </div>
              </div>

              {/* Prediction Confidence */}
              <div className="p-4 rounded-xl border border-slate-900 bg-slate-900/40 space-y-2">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                  AI Confidence
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-blue-400">99.4%</span>
                  <span className="text-[10px] text-blue-400 font-semibold">Active</span>
                </div>
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: '99%' }} />
                </div>
              </div>

              {/* Risk Indicator */}
              <div className="col-span-2 p-4 rounded-xl border border-red-500/20 bg-red-500/5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-500/10 text-red-400 rounded-lg animate-pulse">
                    <AlertTriangle size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">ETA Anomaly Detected</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">Route #9201 delayed by weather</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-red-500/20 text-red-300 border border-red-500/30 px-2 py-0.5 rounded-md">
                  High Risk
                </span>
              </div>

              {/* Mini Map Visual placeholder */}
              <div className="col-span-2 p-4 rounded-xl border border-slate-900 bg-slate-900/40 h-40 relative overflow-hidden flex items-center justify-center">
                {/* SVG Route map simulation */}
                <svg className="absolute inset-0 w-full h-full stroke-slate-800/80" strokeWidth="1.5" fill="none">
                  <circle cx="60" cy="50" r="4" className="fill-blue-500 animate-ping" />
                  <circle cx="60" cy="50" r="3" className="fill-blue-500" />
                  
                  <circle cx="220" cy="110" r="4" className="fill-emerald-500 animate-ping" />
                  <circle cx="220" cy="110" r="3" className="fill-emerald-500" />
                  
                  <path d="M60 50 Q 140 10, 220 110" className="stroke-blue-500/50" strokeWidth="2" strokeDasharray="6 4" />
                  
                  <circle cx="340" cy="30" r="4" className="fill-red-500 animate-ping" />
                  <circle cx="340" cy="30" r="3" className="fill-red-500" />
                  <path d="M220 110 Q 280 60, 340 30" className="stroke-red-500/40" strokeWidth="2" />
                </svg>
                
                <div className="absolute top-3 left-3 bg-slate-950/80 border border-slate-800/50 rounded-lg p-2 flex items-center gap-2">
                  <Activity size={12} className="text-blue-500" />
                  <span className="text-[9px] font-bold text-slate-300">Predictive Routing Nodes</span>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. Trusted Technologies */}
      <section id="technology" className="max-w-7xl mx-auto px-6 py-16 border-t border-slate-900">
        <p className="text-center text-xs font-bold uppercase tracking-widest text-slate-500 mb-8">
          Built With Industry-Standard ML & Frontend Systems
        </p>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {[
            { name: 'Python', icon: PythonLogo },
            { name: 'FastAPI', icon: FastAPILogo },
            { name: 'XGBoost', icon: XGBoostLogo },
            { name: 'React', icon: () => (
              <svg className="w-8 h-8 text-[#61DAFB]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="50" cy="50" rx="8" ry="20" transform="rotate(0 50 50)" />
                <ellipse cx="50" cy="50" rx="8" ry="20" transform="rotate(60 50 50)" />
                <ellipse cx="50" cy="50" rx="8" ry="20" transform="rotate(120 50 50)" />
                <circle cx="50" cy="50" r="4" className="fill-current" />
              </svg>
            )},
            { name: 'SQLite', icon: () => (
              <svg className="w-8 h-8 text-[#003B57]" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="128" height="128" rx="20" fill="#003B57" />
                <path d="M64 24c-22.1 0-40 5.4-40 12s17.9 12 40 12 40-5.4 40-12-17.9-12-40-12z" fill="#fff" opacity="0.8" />
                <path d="M24 36v18c0 6.6 17.9 12 40 12s40-5.4 40-12V36c0 6.6-17.9 12-40 12S24 42.6 24 36z" fill="#fff" opacity="0.6" />
                <path d="M24 54v18c0 6.6 17.9 12 40 12s40-5.4 40-12V54c0 6.6-17.9 12-40 12S24 60.6 24 54z" fill="#fff" opacity="0.4" />
              </svg>
            )},
            { name: 'Tailwind', icon: () => (
              <svg className="w-8 h-8 text-[#38BDF8]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 25C37.5 25 31.25 31.25 31.25 43.75C31.25 56.25 43.75 50 43.75 62.5C43.75 75 56.25 68.75 62.5 68.75C68.75 68.75 75 62.5 75 50C75 37.5 62.5 25 50 25Z" fill="currentColor" />
              </svg>
            )},
            { name: 'TypeScript', icon: () => (
              <svg className="w-8 h-8" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="128" height="128" rx="20" fill="#3178C6" />
                <text x="64" y="90" fill="#fff" fontSize="56" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">TS</text>
              </svg>
            )},
            { name: 'Motion', icon: () => (
              <svg className="w-8 h-8" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="128" height="128" rx="20" fill="#000" />
                <path d="M28 28h72v18L64 78l36 22H28l36-50-36-22z" fill="#FF0055" />
              </svg>
            )},
          ].map((tech) => {
            const Icon = tech.icon;
            return (
              <motion.div
                key={tech.name}
                whileHover={{ y: -4, borderColor: 'rgba(59, 130, 246, 0.4)' }}
                className="flex flex-col items-center gap-3 p-4 rounded-2xl border border-slate-900 bg-slate-950/50 backdrop-blur-sm cursor-default transition-colors duration-300"
              >
                <Icon />
                <span className="text-xs font-bold text-slate-400">{tech.name}</span>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 4. Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-24 md:py-32 space-y-16 border-t border-slate-900">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <Badge variant="primary" className="bg-blue-500/10 text-blue-400 border-blue-500/20 py-1 px-3">
            Core Competencies
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            AI-Driven Logistics Optimization
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Venlix AI analyzes deep systemic signals to ensure your fleet runs continuously and without schedule interruption.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: 'AI Prediction',
              desc: 'Intelligent delay classification utilizing advanced gradient-boosted decision trees to preempt logistical logjams.',
              icon: Brain,
            },
            {
              title: 'Delivery Analytics',
              desc: 'High-fidelity statistics showing route timelines, cargo conditions, and performance metrics in one workspace.',
              icon: LineChart,
            },
            {
              title: 'Digital Twin',
              desc: 'Interactive visual replica mapping fleet paths and hub inventory, syncing telemetry metrics in real-time.',
              icon: Layers2,
            },
            {
              title: 'Live Dashboard',
              desc: 'Monitor prediction accuracies, delay risk distributions, and model performance metrics dynamically.',
              icon: Activity,
            },
            {
              title: 'Fleet Monitoring',
              desc: 'Active driver feedback loops and cargo conditions notifications, keeping fleets running safely.',
              icon: Truck,
            },
            {
              title: 'Risk Intelligence',
              desc: 'AI-generated routing options and critical hazard alerts, preventing cargo losses.',
              icon: Compass,
            },
          ].map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={i}
                whileHover={{ y: -6, borderColor: 'rgba(59, 130, 246, 0.3)', boxShadow: '0 10px 30px -15px rgba(59, 130, 246, 0.1)' }}
                className="p-8 rounded-2xl border border-slate-900 bg-slate-950/40 backdrop-blur-md transition-all duration-300 flex flex-col space-y-4 text-left group"
              >
                <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl w-fit group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  <Icon size={20} className="stroke-[2]" />
                </div>
                <h3 className="text-lg font-bold text-white">{feature.title}</h3>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 5. How Venlix Works (Horizontal workflow) */}
      <section className="max-w-7xl mx-auto px-6 py-24 md:py-32 space-y-16 border-t border-slate-900">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <Badge variant="primary" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 py-1 px-3">
            Operations Pipeline
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How Venlix AI Works
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            From operator request to model prediction, watch the flow of real-time signals.
          </p>
        </div>

        {/* Workflow flow horizontal layout */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 overflow-x-auto pb-4">
          {[
            { step: '1', name: 'User Request', icon: UserCheck, desc: 'Operator initiates route optimization' },
            { step: '2', name: 'React Frontend', icon: Code, desc: 'Renders dashboard telemetry parameters' },
            { step: '3', name: 'FastAPI Backend', icon: Server, desc: 'Parses and aggregates telemetry requests' },
            { step: '4', name: 'ML Engine', icon: Brain, desc: 'XGBoost classiffier executes path prediction' },
            { step: '5', name: 'SQLite Storage', icon: Database, desc: 'Logs ETA deviations and operational histories' },
            { step: '6', name: 'AI Prediction', icon: Sparkles, desc: 'Returns delay risks and latency matrices' },
            { step: '7', name: 'Live Dashboard', icon: Activity, desc: 'Visualizes optimal alternate routes' },
          ].map((flow, i, arr) => {
            const Icon = flow.icon;
            return (
              <div key={i} className="flex flex-col lg:flex-row items-center w-full lg:w-auto shrink-0">
                <div className="p-5 rounded-2xl border border-slate-900 bg-slate-950/60 w-full lg:w-44 text-center flex flex-col items-center space-y-2.5 relative">
                  <span className="absolute -top-2.5 -left-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 border border-slate-800 text-[10px] font-bold text-blue-400">
                    {flow.step}
                  </span>
                  <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl">
                    <Icon size={16} />
                  </div>
                  <h4 className="text-xs font-bold text-white">{flow.name}</h4>
                  <p className="text-[9px] text-slate-500 leading-normal">{flow.desc}</p>
                </div>

                {/* Animated Arrow Connector */}
                {i < arr.length - 1 && (
                  <div className="flex items-center justify-center my-4 lg:my-0 lg:mx-3 text-slate-600 rotate-90 lg:rotate-0">
                    <motion.div
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <ArrowRight size={20} className="text-blue-500/60" />
                    </motion.div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Project Architecture Diagram */}
      <section id="architecture" className="max-w-7xl mx-auto px-6 py-24 md:py-32 space-y-16 border-t border-slate-900">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <Badge variant="primary" className="bg-blue-500/10 text-blue-400 border-blue-500/20 py-1 px-3">
            Topological Overview
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            System Architecture
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Sleek separation of responsibilities ensuring modularity, high scalability, and robust security.
          </p>
        </div>

        {/* Dynamic Architecture Visual */}
        <div className="p-8 rounded-3xl border border-slate-800/80 bg-slate-950/40 backdrop-blur-md max-w-4xl mx-auto space-y-8 relative">
          <div className="absolute inset-0 bg-blue-600/5 rounded-3xl blur-2xl -z-10" />

          {/* Architecture Tree */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            
            {/* Frontend Client */}
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-950/70 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
                  <Code size={16} />
                </div>
                <h4 className="text-sm font-bold text-white">Client Interface</h4>
              </div>
              <ul className="text-xs text-slate-400 space-y-2 text-left list-disc list-inside">
                <li>React 19 & Vite 8 SPA</li>
                <li>Tailwind CSS v4 styling</li>
                <li>Framer Motion transitions</li>
                <li>Axios telemetry handlers</li>
              </ul>
            </div>

            {/* Backend Core */}
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-950/70 space-y-4 relative">
              {/* Connector line overlay */}
              <div className="absolute top-1/2 -left-4 w-4 border-t border-dashed border-slate-800 hidden md:block" />
              <div className="absolute top-1/2 -right-4 w-4 border-t border-dashed border-slate-800 hidden md:block" />
              
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
                  <Server size={16} />
                </div>
                <h4 className="text-sm font-bold text-white">FastAPI Gateway</h4>
              </div>
              <ul className="text-xs text-slate-400 space-y-2 text-left list-disc list-inside">
                <li>RESTful API Endpoints</li>
                <li>Pydantic schemas data validation</li>
                <li>SQLAlchemy database pools</li>
                <li>Cross-origin CORS controls</li>
              </ul>
            </div>

            {/* Inference Service */}
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-950/70 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg">
                  <Cpu size={16} />
                </div>
                <h4 className="text-sm font-bold text-white">Predictive Engine</h4>
              </div>
              <ul className="text-xs text-slate-400 space-y-2 text-left list-disc list-inside">
                <li>XGBoost Classifier model</li>
                <li>Joblib model deserialization</li>
                <li>Delay likelihood regression</li>
                <li>SQLite operation logger</li>
              </ul>
            </div>

          </div>

          <div className="text-center pt-2">
            <span className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest bg-slate-900/80 border border-slate-800 rounded-full px-4 py-1.5">
              <ShieldCheck size={14} className="text-blue-500" />
              End-to-End Type Safety (TypeScript + Pydantic)
            </span>
          </div>

        </div>
      </section>

      {/* 7. Performance Section */}
      <section className="bg-slate-950 border-y border-slate-900 py-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { end: 98.2, decimals: 1, suffix: '%', label: 'Prediction Accuracy' },
            { end: 48, decimals: 0, suffix: 'ms', label: 'API Response Time' },
            { end: 48219, decimals: 0, suffix: '+', label: 'Deliveries Analyzed' },
            { end: 99.4, decimals: 1, suffix: '%', label: 'Inference Confidence' },
          ].map((stat, i) => (
            <div key={i} className="text-center space-y-2">
              <div className="text-3xl sm:text-4xl md:text-5xl font-black text-white bg-clip-text text-transparent bg-gradient-to-br from-white to-slate-400">
                <CountUp end={stat.end} decimals={stat.decimals} suffix={stat.suffix} />
              </div>
              <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Detailed Technology Grid */}
      <section className="max-w-7xl mx-auto px-6 py-24 md:py-32 space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <Badge variant="primary" className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 py-1 px-3">
            Modularity & Stack
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Comprehensive Tech Stack
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Every library chosen specifically to maximize performance, scalability, and code clarity.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { name: 'Python', desc: 'Core ML algorithms' },
            { name: 'FastAPI', desc: 'Async Python Gateway' },
            { name: 'React 19', desc: 'Atomic UI layout' },
            { name: 'TypeScript', desc: 'Type safety assurance' },
            { name: 'Tailwind CSS', desc: 'Modern styling framework' },
            { name: 'SQLite', desc: 'Relational data engine' },
            { name: 'SQLAlchemy', desc: 'Database Object Mapper' },
            { name: 'XGBoost', desc: 'Predictive ETAs classification' },
            { name: 'Pandas', desc: 'High-speed data aggregation' },
            { name: 'NumPy', desc: 'Mathematical array models' },
            { name: 'Joblib', desc: 'Pipeline model storage' },
            { name: 'Recharts', desc: 'Interactive charts rendering' },
            { name: 'React Leaflet', desc: 'Map plotting components' },
            { name: 'Framer Motion', desc: 'Micro-animations triggers' },
            { name: 'Axios', desc: 'API client integration' },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4, borderColor: 'rgba(59, 130, 246, 0.4)', boxShadow: '0 0 20px -5px rgba(59, 130, 246, 0.15)' }}
              className="p-5 rounded-2xl border border-slate-900 bg-slate-950/60 flex flex-col space-y-1 text-left cursor-default transition-all duration-300"
            >
              <h4 className="text-xs font-bold text-white">{item.name}</h4>
              <p className="text-[10px] text-slate-500 leading-normal">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 9. Meet The Team */}
      <section id="team" className="max-w-7xl mx-auto px-6 py-24 md:py-32 space-y-16 border-t border-slate-900">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <Badge variant="primary" className="bg-blue-500/10 text-blue-400 border-blue-500/20 py-1 px-3">
            Core Developers
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Meet the Team
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            The engineering minds behind the intelligence and design of Venlix AI.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {/* Member 1 */}
          <div className="p-6 rounded-2xl border border-slate-900 bg-slate-950/50 flex flex-col items-center text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-blue-600/10 border border-blue-500/20 flex items-center justify-center font-bold text-xl text-blue-400">
              ML
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Backend & Machine Learning</h3>
              <p className="text-[10px] text-blue-500 font-semibold tracking-wider uppercase mt-1">XGBoost & FastAPI Engineer</p>
              <p className="text-xs text-slate-500 mt-3 leading-relaxed">
                Responsible for training models, data preprocessing pipelines, and setting up async RESTful gateways.
              </p>
            </div>
          </div>

          {/* Member 2 */}
          <div className="p-6 rounded-2xl border border-slate-900 bg-slate-950/50 flex flex-col items-center text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center font-bold text-xl text-cyan-400">
              FE
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Frontend Developer</h3>
              <p className="text-[10px] text-cyan-400 font-semibold tracking-wider uppercase mt-1">React Architect & UI Designer</p>
              <p className="text-xs text-slate-500 mt-3 leading-relaxed">
                Handles visual assets, layout systems, component state orchestration, and responsive animations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Call To Action (CTA) */}
      <section id="contact" className="max-w-7xl mx-auto px-6 py-20 md:py-32">
        <div className="p-10 md:p-16 rounded-3xl border border-slate-800/80 bg-slate-950/80 backdrop-blur-md text-center space-y-8 relative overflow-hidden">
          <div className="absolute -top-24 -left-24 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[80px]" />
          <div className="absolute -bottom-24 -right-24 w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-[80px]" />
          
          <div className="max-w-xl mx-auto space-y-4 relative z-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Ready to Predict <br />
              Delivery Failures?
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Launch the Venlix AI dashboard and analyze route risks, ETA anomalies, and system operations instantly.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/dashboard')}
              className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg border-none"
            >
              Launch Dashboard
            </Button>
            <a
              href="https://github.com/vidwansai66/Venlix"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center h-12 px-6 text-sm font-semibold rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800 text-slate-300 hover:text-white transition-all gap-2"
            >
              <GithubIcon size={16} />
              GitHub Repository
            </a>
          </div>
        </div>
      </section>

      {/* 11. Footer */}
      <footer className="w-full bg-[#030712] border-t border-slate-900 px-6 py-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo */}
          <div className="space-y-4 text-left">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 text-white">
                <span className="text-lg font-black tracking-tighter">V</span>
              </div>
              <span className="text-base font-bold text-white">Venlix AI</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Smart Delivery Failure Prediction Platform. Using machine learning to optimize transit.
            </p>
          </div>

          {/* Links 1 */}
          <div className="text-left space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Resources</h4>
            <ul className="text-xs space-y-2">
              <li>
                <a href="https://github.com/vidwansai66/Venlix" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-slate-300 flex items-center gap-1">
                  <GithubIcon size={12} /> GitHub
                </a>
              </li>
              <li>
                <a href="#features" className="text-slate-500 hover:text-slate-300">Features Documentation</a>
              </li>
            </ul>
          </div>

          {/* Links 2 */}
          <div className="text-left space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Platform</h4>
            <ul className="text-xs space-y-2">
              <li>
                <span className="text-slate-500 hover:text-slate-300 cursor-pointer" onClick={() => navigate('/dashboard')}>Launch Dashboard</span>
              </li>
              <li>
                <span className="text-slate-500 hover:text-slate-300 cursor-pointer" onClick={() => navigate('/health')}>System Health</span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="text-left space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">System Support</h4>
            <ul className="text-xs space-y-2">
              <li className="text-slate-500 flex items-center gap-1.5">
                <Mail size={12} /> support@venlix.ai
              </li>
              <li className="text-slate-500 flex items-center gap-1.5">
                <FileCode size={12} /> MIT License
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto border-t border-slate-900 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <div>
            &copy; {new Date().getFullYear()} Venlix AI. Built for Smart Logistics Optimization.
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-bold uppercase tracking-wider">System Live</span>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
