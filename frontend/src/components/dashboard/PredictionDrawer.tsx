import { motion, AnimatePresence } from 'framer-motion';
import { X, Brain, PhoneCall, MessageSquare, MapPin, Calendar, AlertTriangle, Info, Clock, TrendingDown, ArrowRight, User, Sliders, Play } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

interface PredictionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  delivery: any;
}

export const PredictionDrawer = ({ isOpen, onClose, delivery }: PredictionDrawerProps) => {

  const riskTimelineData = [
    { time: '10:30 AM', risk: 18 },
    { time: '11:45 AM', risk: 35 },
    { time: '1:10 PM', risk: 57 },
    { time: '2:05 PM', risk: 78 },
    { time: '2:15 PM', risk: 93 },
  ];

  return (
    <AnimatePresence>
      {isOpen && delivery && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 z-50 w-full max-w-2xl h-full bg-brand-background border-l border-brand-border shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-brand-border bg-brand-card/80 backdrop-blur-md">
              <div>
                <h2 className="text-xl font-extrabold text-brand-text flex items-center gap-2">
                  Prediction Details <Badge variant="danger" className="animate-pulse">Active AI Lock</Badge>
                </h2>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-xs font-semibold text-slate-500">
                  <span className="flex items-center gap-1"><User size={14}/> {delivery.customer}</span>
                  <span className="flex items-center gap-1 text-brand-text font-bold">#{delivery.id}</span>
                  <span className="flex items-center gap-1 text-danger font-bold">Risk: {delivery.risk}%</span>
                  <span className="flex items-center gap-1 text-brand-text font-bold">Conf: {delivery.confidence}%</span>
                  <span className="flex items-center gap-1"><Clock size={14}/> {delivery.eta}</span>
                  <span className="flex items-center gap-1"><User size={14}/> {delivery.driver}</span>
                  <span className="flex items-center gap-1"><MapPin size={14}/> {delivery.society}</span>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 hover:text-brand-text"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-32">
              
              {/* Prediction Summary */}
              <section className="bg-gradient-to-r from-danger/10 to-transparent border border-danger/20 rounded-2xl p-5 relative overflow-hidden">
                <Brain className="absolute -right-6 -top-6 text-danger/10" size={120} />
                <h3 className="text-sm font-bold text-danger uppercase tracking-wider mb-2 flex items-center gap-2">
                  <AlertTriangle size={16} /> AI Summary
                </h3>
                <p className="text-lg font-medium text-brand-text leading-snug max-w-lg relative z-10">
                  Delivery likely to fail due to <span className="text-danger font-bold">customer unavailability</span> and gated community access restrictions.
                </p>
                <div className="mt-4 flex items-center gap-6">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-500 mb-0.5">Current Risk</p>
                    <p className="text-3xl font-black text-danger">{delivery.risk}%</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-500 mb-0.5">Confidence</p>
                    <p className="text-3xl font-black text-brand-text">{delivery.confidence}%</p>
                  </div>
                  <div className="flex-1 border-l border-brand-border/50 pl-6 relative z-10">
                    <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Suggested Action</p>
                    <p className="text-sm font-bold text-primary cursor-pointer hover:underline">
                      Contact customer immediately and request visitor pass approval.
                    </p>
                  </div>
                </div>
              </section>

              {/* Explain Prediction (Feature Importance) */}
              <section>
                <h3 className="text-sm font-bold text-brand-text mb-4 flex items-center gap-2">
                  <Sliders size={16} className="text-primary"/> Explain Prediction (Feature Importance)
                </h3>
                <div className="space-y-4">
                  {[
                    { name: 'Customer Availability', val: 95, color: 'bg-danger' },
                    { name: 'Visitor Pass Status', val: 91, color: 'bg-danger' },
                    { name: 'Previous Failed Deliveries', val: 82, color: 'bg-orange-500' },
                    { name: 'Weather', val: 66, color: 'bg-warning' },
                    { name: 'Traffic', val: 54, color: 'bg-warning' },
                    { name: 'Driver ETA', val: 49, color: 'bg-blue-500' },
                    { name: 'Address Confidence', val: 38, color: 'bg-emerald-500' },
                    { name: 'Customer Response Rate', val: 35, color: 'bg-emerald-500' }
                  ].map((feat, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-brand-text">{feat.name}</span>
                        <span className="text-slate-500">{feat.val}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${feat.val}%` }}
                          transition={{ duration: 1, delay: i * 0.1 }}
                          className={`h-full rounded-full ${feat.color}`} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Risk Factors */}
              <section>
                <h3 className="text-sm font-bold text-brand-text mb-4 flex items-center gap-2">
                  <AlertTriangle size={16} className="text-danger"/> Risk Factors
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { reason: "Customer unavailable", impact: "High Impact", color: "text-danger", bg: "bg-danger/10 border-danger/20" },
                    { reason: "Visitor approval pending", impact: "High Impact", color: "text-danger", bg: "bg-danger/10 border-danger/20" },
                    { reason: "Heavy rain", impact: "Medium Impact", color: "text-orange-500", bg: "bg-orange-500/10 border-orange-500/20" },
                    { reason: "Previous failed delivery", impact: "Medium Impact", color: "text-orange-500", bg: "bg-orange-500/10 border-orange-500/20" },
                    { reason: "Late ETA", impact: "Low Impact", color: "text-blue-500", bg: "bg-blue-500/10 border-blue-500/20" }
                  ].map((factor, i) => (
                    <div key={i} className={`p-4 rounded-xl border backdrop-blur-md ${factor.bg} flex justify-between items-center`}>
                      <span className="text-sm font-bold text-brand-text">{factor.reason}</span>
                      <Badge variant="outline" className={`bg-transparent border-current ${factor.color}`}>{factor.impact}</Badge>
                    </div>
                  ))}
                </div>
              </section>

              {/* Risk Timeline */}
              <section className="bg-brand-card rounded-2xl border border-brand-border p-5 shadow-sm">
                <h3 className="text-sm font-bold text-brand-text mb-4 flex items-center gap-2">
                  <TrendingDown size={16} className="text-primary"/> Risk Timeline
                </h3>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={riskTimelineData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--brand-border)" vertical={false} />
                      <XAxis dataKey="time" stroke="#9CA3AF" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="#9CA3AF" fontSize={10} tickLine={false} axisLine={false} domain={[0, 100]} />
                      <Tooltip
                        contentStyle={{ background: 'var(--brand-card)', border: '1px solid var(--brand-border)', borderRadius: '12px', color: 'var(--brand-text)' }}
                        itemStyle={{ fontSize: '12px', color: '#EF4444', fontWeight: 'bold' }}
                        formatter={(value: any) => [`${value}% Risk`, '']}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="risk" 
                        stroke="#EF4444" 
                        strokeWidth={3}
                        dot={{ r: 4, fill: '#EF4444', strokeWidth: 2, stroke: 'var(--brand-card)' }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </section>

              {/* AI Explanation Text */}
              <section className="bg-primary/5 rounded-2xl border border-primary/20 p-5">
                <h3 className="text-sm font-bold text-primary mb-3">Why did AI predict {delivery.risk}% risk?</h3>
                <ul className="space-y-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    Customer has missed two previous deliveries.
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    Visitor pass has not yet been approved.
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    Driver ETA exceeds preferred delivery window.
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    Heavy rainfall is expected during arrival.
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    Customer has not responded to recent communication.
                  </li>
                </ul>
                <div className="mt-4 pt-4 border-t border-primary/10">
                  <p className="text-xs font-bold text-primary flex items-center gap-2">
                    <Info size={14} /> Overall confidence is high because multiple independent signals indicate a likely delivery failure.
                  </p>
                </div>
              </section>

              {/* Suggested AI Actions */}
              <section>
                <h3 className="text-sm font-bold text-brand-text mb-4">Suggested AI Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl border border-brand-border bg-brand-background hover:border-primary/50 transition-colors group cursor-pointer">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                        <PhoneCall size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-brand-text">Call Customer</p>
                        <Badge variant="danger" pill className="text-[9px] px-1.5 py-0 mt-0.5">Priority High</Badge>
                      </div>
                    </div>
                    <div className="flex justify-between text-[10px] font-bold text-slate-500 mt-1">
                      <span>96% Success</span>
                      <span>5m Saved</span>
                      <span>0.5 km Fuel</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl border border-brand-border bg-brand-background hover:border-primary/50 transition-colors group cursor-pointer">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                        <MessageSquare size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-brand-text">Request Approval</p>
                        <Badge variant="danger" pill className="text-[9px] px-1.5 py-0 mt-0.5">Priority High</Badge>
                      </div>
                    </div>
                    <div className="flex justify-between text-[10px] font-bold text-slate-500 mt-1">
                      <span>85% Success</span>
                      <span>12m Saved</span>
                      <span>0 km Fuel</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl border border-brand-border bg-brand-background hover:border-primary/50 transition-colors group cursor-pointer">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                        <MapPin size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-brand-text">Verify Address</p>
                        <Badge variant="warning" pill className="text-[9px] px-1.5 py-0 mt-0.5">Priority Med</Badge>
                      </div>
                    </div>
                    <div className="flex justify-between text-[10px] font-bold text-slate-500 mt-1">
                      <span>70% Success</span>
                      <span>15m Saved</span>
                      <span>2 km Fuel</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl border border-brand-border bg-brand-background hover:border-primary/50 transition-colors group cursor-pointer">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                        <Calendar size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-brand-text">Reschedule</p>
                        <Badge variant="warning" pill className="text-[9px] px-1.5 py-0 mt-0.5">Priority Med</Badge>
                      </div>
                    </div>
                    <div className="flex justify-between text-[10px] font-bold text-slate-500 mt-1">
                      <span>99% Success</span>
                      <span>45m Saved</span>
                      <span>5 km Fuel</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Recommended Resolution Strategy (Workflow) */}
              <section>
                <h3 className="text-sm font-bold text-brand-text mb-4">Recommended Resolution Strategy</h3>
                <div className="flex items-center justify-between overflow-x-auto pb-4 custom-scrollbar">
                  {['Call Customer', 'Approve Visitor Pass', 'Update Delivery Slot', 'Notify Driver', 'Continue Delivery'].map((step, idx, arr) => (
                    <div key={idx} className="flex items-center shrink-0">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-brand-background border border-brand-border flex items-center justify-center text-xs font-bold text-primary shadow-sm">
                          {idx + 1}
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{step}</span>
                      </div>
                      {idx < arr.length - 1 && (
                        <div className="w-8 h-[2px] bg-brand-border mx-2 -mt-4"></div>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* Expected Outcome */}
              <section className="bg-gradient-to-br from-brand-card to-brand-background rounded-2xl border border-brand-border p-5">
                <h3 className="text-sm font-bold text-brand-text mb-4">Expected AI Outcome</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Risk Reduction</p>
                    <div className="flex items-end gap-2">
                      <span className="text-xl font-bold text-brand-text line-through opacity-50">93%</span>
                      <ArrowRight size={16} className="mb-1 text-slate-400" />
                      <span className="text-2xl font-black text-success">14%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Success Prob.</p>
                    <p className="text-2xl font-black text-brand-text">96%</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Time Saved</p>
                    <p className="text-2xl font-black text-brand-text">27m</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Fuel Saved</p>
                    <p className="text-2xl font-black text-brand-text">3 km</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Cost Saved</p>
                    <p className="text-2xl font-black text-brand-text">₹145</p>
                  </div>
                </div>
              </section>

            </div>

            {/* Bottom Actions */}
            <div className="absolute bottom-0 w-full p-6 bg-brand-card/80 backdrop-blur-md border-t border-brand-border flex items-center justify-end gap-3 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
              <Button variant="outline" onClick={onClose}>Dismiss</Button>
              <Button variant="primary" leftIcon={<Play size={16} />} className="shadow-lg shadow-primary/20 bg-gradient-to-r from-primary to-purple-600 border-none hover:opacity-90 transition-opacity">
                Execute AI Strategy
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
