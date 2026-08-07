import { motion, AnimatePresence } from 'framer-motion';
import { X, User, MapPin, Clock, CheckCircle2, AlertTriangle, ShieldAlert, TrendingDown, Bot } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface DeliveryDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  delivery: any;
  riskTimelineData: any[];
}

export const DeliveryDetailsDrawer = ({ isOpen, onClose, delivery, riskTimelineData }: DeliveryDetailsDrawerProps) => {
  
  const parseJSON = (jsonStr: string) => {
    try {
      return JSON.parse(jsonStr || '{}');
    } catch {
      return {};
    }
  };

  const deliveryData = delivery ? parseJSON(delivery.json_response) : {};
  const riskFactors = deliveryData.risk_factors || [];
  const recommendations = deliveryData.recommendations || [];
  const action = recommendations.length > 0 ? recommendations[0].action : (delivery?.action || "No specific action");
  
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
                  Delivery Pulse <Badge variant={delivery.isHighRisk ? "danger" : "success"} className={delivery.isHighRisk ? "animate-pulse" : ""}>{delivery.isHighRisk ? "High Risk Detected" : "On Track"}</Badge>
                </h2>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-xs font-semibold text-slate-500">
                  <span className="flex items-center gap-1"><User size={14}/> {delivery.customer}</span>
                  <span className="flex items-center gap-1 text-brand-text font-bold">#{delivery.id}</span>
                  <span className="flex items-center gap-1"><Clock size={14}/> ETA: {delivery.eta}</span>
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
            <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-32 custom-scrollbar">
              
              {/* CURRENT RISK */}
              <section className="flex gap-6">
                <div className="relative w-32 h-32 shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="var(--brand-border)" strokeWidth="8" />
                    <motion.circle 
                      cx="50" cy="50" r="45" fill="none" stroke="#EF4444" strokeWidth="8" 
                      strokeDasharray="283"
                      initial={{ strokeDashoffset: 283 }}
                      animate={{ strokeDashoffset: 283 - (283 * delivery.risk) / 100 }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-danger">{delivery.risk}%</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Risk</span>
                  </div>
                </div>
                
                <div className="flex flex-col justify-center flex-1">
                   <h3 className="text-sm font-bold text-brand-text mb-3">AI Confidence: {delivery.confidence}%</h3>
                   <div className="grid grid-cols-2 gap-3">
                     {riskFactors.length > 0 ? riskFactors.map((reason: any, i: number) => (
                       <div key={i} className="bg-brand-card border border-brand-border rounded-xl p-2.5 flex justify-between items-center shadow-soft">
                          <span className="text-xs font-bold text-brand-text truncate mr-2" title={reason.factor}>{reason.factor}</span>
                          <span className={`text-[9px] font-bold uppercase tracking-wider ${reason.impact === 'High' ? 'text-danger' : reason.impact === 'Medium' ? 'text-orange-500' : 'text-blue-500'}`}>
                            {reason.impact} Impact
                          </span>
                       </div>
                     )) : (
                       <span className="text-sm text-slate-500">No significant risk factors</span>
                     )}
                   </div>
                </div>
              </section>

              {/* AI RECOMMENDATION */}
              <section className="bg-gradient-to-r from-primary/10 to-transparent border border-primary/20 rounded-2xl p-5 relative overflow-hidden">
                <ShieldAlert className="absolute -right-6 -top-6 text-primary/10" size={120} />
                <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-2 flex items-center gap-2">
                  <AlertTriangle size={16} /> Recommended Action
                </h3>
                <p className="text-xl font-black text-brand-text leading-snug max-w-lg relative z-10 mb-6">
                  {action}
                </p>
                
                <div className="grid grid-cols-3 gap-4 relative z-10 mb-4">
                  <div className="bg-brand-background/80 backdrop-blur-sm border border-brand-border rounded-xl p-3">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Success Prob.</p>
                    <p className="text-xl font-black text-success">{delivery.estimated_success_after_action || 96}%</p>
                  </div>
                  <div className="bg-brand-background/80 backdrop-blur-sm border border-brand-border rounded-xl p-3">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Time Saved</p>
                    <p className="text-xl font-black text-brand-text">{delivery.estimated_time_saved_minutes || 27}m</p>
                  </div>
                  <div className="bg-brand-background/80 backdrop-blur-sm border border-brand-border rounded-xl p-3">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Fuel Saved</p>
                    <p className="text-xl font-black text-brand-text">{delivery.estimated_fuel_saved_liters || 0.1} L</p>
                  </div>
                </div>

                {/* AI Agents Integration Hooks placeholder */}
                <div className="flex gap-2 relative z-10 mt-2">
                    <button className="flex-1 bg-primary text-white font-bold text-sm h-10 rounded-xl hover:bg-primary/90 flex items-center justify-center gap-2 shadow-lg shadow-primary/25">
                       <Bot size={16} /> Auto-Resolve
                    </button>
                    <button className="flex-1 bg-brand-background border border-brand-border text-brand-text font-bold text-sm h-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
                       Assign Manual
                    </button>
                </div>
              </section>

              {/* LIVE STATUS TIMELINE */}
              <section>
                 <h3 className="text-sm font-bold text-brand-text mb-4">Live Delivery State</h3>
                 <div className="relative">
                   <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-brand-border"></div>
                   <div className="space-y-4">
                     {[
                       { step: 'Order Created', status: delivery.current_status === 'Order Created' ? 'Current' : 'Completed' },
                       { step: 'Picked Up', status: ['Picked Up'].includes(delivery.current_status) ? 'Current' : (['Order Created'].includes(delivery.current_status) ? 'Pending' : 'Completed') },
                       { step: 'On Route', status: ['On Route'].includes(delivery.current_status) ? 'Current' : (['Order Created', 'Picked Up'].includes(delivery.current_status) ? 'Pending' : 'Completed') },
                       { step: 'At Society', status: ['At Society'].includes(delivery.current_status) ? 'Current' : (['Order Created', 'Picked Up', 'On Route'].includes(delivery.current_status) ? 'Pending' : 'Completed') },
                       { step: 'Visitor Verification', status: ['Visitor Verification'].includes(delivery.current_status) ? 'Current' : (['Order Created', 'Picked Up', 'On Route', 'At Society'].includes(delivery.current_status) ? 'Pending' : 'Completed') },
                       { step: 'Out For Delivery', status: ['Out For Delivery'].includes(delivery.current_status) ? 'Current' : (['Delivered', 'Failed'].includes(delivery.current_status) ? 'Completed' : 'Pending') },
                       { step: 'Delivered / Failed', status: ['Delivered', 'Failed'].includes(delivery.current_status) ? 'Current' : 'Pending' },
                     ].map((item, i) => (
                       <div key={i} className="flex gap-4 relative">
                         <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 shrink-0 z-10 bg-brand-background
                            ${item.status === 'Completed' ? 'border-success text-success' : 
                              item.status === 'Current' ? 'border-primary text-primary shadow-[0_0_10px_rgba(124,58,237,0.5)]' : 
                              'border-slate-300 text-slate-300'}`}>
                           {item.status === 'Completed' && <CheckCircle2 size={12} />}
                           {item.status === 'Current' && <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />}
                         </div>
                         <div className="pt-0.5 flex-1">
                           <div className="flex justify-between items-center">
                             <p className={`text-sm font-bold ${item.status === 'Pending' ? 'text-slate-400' : 'text-brand-text'}`}>{item.step}</p>
                           </div>
                         </div>
                       </div>
                     ))}
                   </div>
                 </div>
              </section>

              {/* RISK EVOLUTION */}
              <section className="bg-brand-card rounded-2xl border border-brand-border p-5 shadow-sm mt-8">
                <h3 className="text-sm font-bold text-brand-text mb-4 flex items-center gap-2">
                  <TrendingDown size={16} className="text-primary"/> Risk Evolution
                </h3>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={[
                      { time: 'T-30m', risk: Math.max(10, delivery.risk - 40) },
                      { time: 'T-20m', risk: Math.max(15, delivery.risk - 25) },
                      { time: 'T-10m', risk: Math.max(20, delivery.risk - 10) },
                      { time: 'Now', risk: delivery.risk },
                      { time: 'Predicted', risk: Math.max(5, delivery.risk - 50) }
                    ]} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--brand-border)" vertical={false} />
                      <XAxis dataKey="time" stroke="#9CA3AF" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="#9CA3AF" fontSize={10} tickLine={false} axisLine={false} domain={[0, 100]} />
                      <Tooltip
                        contentStyle={{ background: 'var(--brand-card)', border: '1px solid var(--brand-border)', borderRadius: '12px', color: 'var(--brand-text)' }}
                        itemStyle={{ fontSize: '12px', color: '#EF4444', fontWeight: 'bold' }}
                        formatter={(value: any) => [`${value}% Risk`, '']}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="risk" 
                        stroke="#EF4444" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorRisk)" 
                        activeDot={{ r: 6 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </section>

              {/* OUTCOME SIMULATOR */}
              <section className="mt-8">
                <h3 className="text-sm font-bold text-brand-text mb-4">Delivery Outcome Simulator</h3>
                <div className="flex items-center justify-between overflow-x-auto pb-4 custom-scrollbar">
                  {['High Risk', 'AI Intervention', 'Customer Response', 'Visitor Approval', 'Risk Reduced', 'Successful Delivery'].map((step, idx, arr) => (
                    <div key={idx} className="flex items-center shrink-0">
                      <div className="flex flex-col items-center gap-2">
                        <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold shadow-sm
                          ${idx === 0 ? 'bg-danger/10 border-danger/30 text-danger' : 
                            idx === arr.length - 1 ? 'bg-success/10 border-success/30 text-success' : 
                            'bg-brand-background border-brand-border text-primary'}`}>
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

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
export default DeliveryDetailsDrawer;
