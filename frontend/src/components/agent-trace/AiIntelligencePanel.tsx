import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { 
  BrainCircuit, 
  MessageSquare, 
  BellRing, 
  TrendingDown, 
  BarChart4, 
  Target, 
  CheckCircle2, 
  ArrowRight,
  User,
  ShieldCheck
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const AiIntelligencePanel = ({ delivery }: { delivery?: any }) => {
  const isHighRisk = delivery && delivery.risk_score >= 40;
  const parsedResponse = delivery?.json_response ? JSON.parse(delivery.json_response) : {};
  const rawReasons = parsedResponse.risk_factors || ['No specific factor'];
  const reasons = rawReasons.map((r: any) => typeof r === 'object' && r !== null ? r.factor : r);
  const riskTimelineData = [
    { time: '2:10 PM', risk: 18 },
    { time: '2:25 PM', risk: 37 },
    { time: '2:32 PM', risk: 58 },
    { time: '2:35 PM', risk: 93 },
    { time: '2:38 PM', risk: 41 },
    { time: '2:45 PM', risk: 14 },
  ];

  const featureImportance = [
    { feature: 'Customer Availability', weight: 95 },
    { feature: 'Visitor Pass', weight: 91 },
    { feature: 'Previous Failed Attempts', weight: 82 },
    { feature: 'Weather', weight: 63 },
    { feature: 'Traffic', weight: 52 },
    { feature: 'Address Confidence', weight: 40 },
    { feature: 'Customer Response', weight: 38 },
  ];

  return (
    <div className="flex flex-col gap-6">
      
      {/* AI Decision Summary */}
      <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20 shadow-soft overflow-hidden relative">
        <BrainCircuit className="absolute -right-6 -bottom-6 text-primary/10" size={120} />
        <div className="p-4 border-b border-primary/10 flex justify-between items-center bg-brand-background/50 backdrop-blur-sm relative z-10">
          <h3 className="text-sm font-bold text-primary flex items-center gap-2">
            <BrainCircuit size={16} /> AI Decision Summary
          </h3>
        </div>
        <CardContent className="p-5 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Prediction</p>
            <p className="text-sm font-bold text-brand-text">{isHighRisk ? 'Elevated risk detected.' : 'Delivery on track.'}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Reason</p>
            <p className="text-sm font-bold text-brand-text">{reasons.join(', ')}</p>
          </div>
          <div className="col-span-1 md:col-span-2 border-t border-brand-border pt-4">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Recommended Action</p>
            <div className="flex items-end justify-between">
              <p className="text-lg font-black text-brand-text">{isHighRisk ? 'Recommend immediate intervention.' : 'Monitor passively.'}</p>
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Expected Success</p>
                <p className="text-xl font-black text-success">96%</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Thinking Process */}
      <Card className="shadow-soft">
        <CardHeader className="border-b border-brand-border p-4 bg-brand-background/50">
           <CardTitle className="text-sm font-bold flex items-center gap-2 text-brand-text"><WorkflowIcon /> AI Thinking Process</CardTitle>
        </CardHeader>
        <CardContent className="p-5 overflow-x-auto custom-scrollbar">
           <div className="flex items-center gap-2 min-w-max">
             {['Detect Risk', 'Analyze Factors', 'Choose Best Action', 'Contact Customer', 'Update Delivery Slot', 'Notify Driver', 'Risk Reduced'].map((step, idx, arr) => (
               <div key={idx} className="flex items-center">
                 <div className="bg-brand-background border border-brand-border rounded-xl px-4 py-2 shadow-sm flex flex-col items-center gap-1">
                   <CheckCircle2 size={14} className="text-success" />
                   <span className="text-[10px] font-bold text-brand-text whitespace-nowrap">{step}</span>
                 </div>
                 {idx < arr.length - 1 && <ArrowRight size={14} className="mx-2 text-slate-300" />}
               </div>
             ))}
           </div>
        </CardContent>
      </Card>

      {/* Grid for Chat and Notification */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* Customer Conversation (Chat Interface) */}
        <Card className="shadow-soft flex flex-col h-[350px]">
          <CardHeader className="border-b border-brand-border p-4 bg-brand-background/50 shrink-0">
             <CardTitle className="text-sm font-bold flex items-center gap-2 text-brand-text"><MessageSquare size={16}/> Customer Conversation</CardTitle>
          </CardHeader>
          <CardContent className="p-4 flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900/50 space-y-4">
             
             {/* AI Message */}
             <div className="flex items-start gap-3">
               <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0">
                 <BrainCircuit size={16} />
               </div>
               <div className="bg-brand-card border border-brand-border rounded-2xl rounded-tl-sm p-3 shadow-sm max-w-[85%]">
                 <p className="text-[10px] font-bold text-primary mb-1">Venlix AI • 2:36 PM</p>
                 <p className="text-xs font-medium text-brand-text leading-relaxed">Hello Rajeev.<br/>Our driver has arrived at My Home Bhooja.<br/>Are you available?</p>
               </div>
             </div>

             {/* Customer Message */}
             <div className="flex items-start gap-3 justify-end">
               <div className="bg-primary text-white rounded-2xl rounded-tr-sm p-3 shadow-sm max-w-[85%]">
                 <p className="text-[10px] font-bold text-white/70 mb-1">Rajeev • 2:38 PM</p>
                 <p className="text-xs font-medium leading-relaxed">I'm currently at work.<br/>Please deliver after 6 PM.</p>
               </div>
               <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-500 flex items-center justify-center shrink-0">
                 <User size={16} />
               </div>
             </div>

             {/* AI Message */}
             <div className="flex items-start gap-3">
               <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0">
                 <BrainCircuit size={16} />
               </div>
               <div className="bg-brand-card border border-brand-border rounded-2xl rounded-tl-sm p-3 shadow-sm max-w-[85%]">
                 <p className="text-[10px] font-bold text-primary mb-1">Venlix AI • 2:38 PM</p>
                 <p className="text-xs font-medium text-brand-text leading-relaxed">Sure.<br/>Your delivery has been rescheduled.<br/>The driver has been notified.</p>
               </div>
             </div>

          </CardContent>
        </Card>

        {/* Driver Notification */}
        <Card className="shadow-soft flex flex-col h-[350px]">
          <CardHeader className="border-b border-brand-border p-4 bg-brand-background/50 shrink-0">
             <CardTitle className="text-sm font-bold flex items-center gap-2 text-brand-text"><BellRing size={16}/> Driver Notification</CardTitle>
          </CardHeader>
          <CardContent className="p-6 flex-1 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900/50">
             
             {/* Mock Mobile Device Notification */}
             <div className="w-full max-w-[280px] bg-brand-card rounded-2xl border border-brand-border shadow-2xl overflow-hidden">
               <div className="bg-slate-100 dark:bg-slate-800 p-3 flex items-center justify-between">
                 <div className="flex items-center gap-2">
                   <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white text-[10px] font-black">V</div>
                   <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Venlix Driver</span>
                 </div>
                 <span className="text-[10px] font-bold text-slate-400">now</span>
               </div>
               <div className="p-4 space-y-3">
                 <h4 className="text-sm font-black text-brand-text">Schedule Updated</h4>
                 <p className="text-xs font-medium text-slate-500">Customer requested evening delivery.</p>
                 <div className="bg-brand-background rounded-xl border border-brand-border p-3 grid grid-cols-2 gap-2 mt-2">
                   <div>
                     <p className="text-[9px] font-bold text-slate-400 uppercase">Updated ETA</p>
                     <p className="text-xs font-bold text-brand-text">6:10 PM</p>
                   </div>
                   <div>
                     <p className="text-[9px] font-bold text-slate-400 uppercase">Suggested</p>
                     <p className="text-xs font-bold text-primary">Route B</p>
                   </div>
                 </div>
               </div>
             </div>

          </CardContent>
        </Card>

      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* Risk Evolution */}
        <Card className="shadow-soft">
          <CardHeader className="border-b border-brand-border p-4 bg-brand-background/50">
             <CardTitle className="text-sm font-bold flex items-center gap-2 text-brand-text"><TrendingDown size={16}/> Risk Evolution</CardTitle>
          </CardHeader>
          <CardContent className="p-4 h-[250px]">
             <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={riskTimelineData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRiskAi" x1="0" y1="0" x2="0" y2="1">
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
                    fill="url(#colorRiskAi)" 
                    activeDot={{ r: 6 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Feature Importance */}
        <Card className="shadow-soft">
          <CardHeader className="border-b border-brand-border p-4 bg-brand-background/50">
             <CardTitle className="text-sm font-bold flex items-center gap-2 text-brand-text"><BarChart4 size={16}/> Feature Importance</CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-3 h-[250px] overflow-y-auto custom-scrollbar">
             {featureImportance.map((item, idx) => (
               <div key={idx} className="space-y-1">
                 <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
                   <span>{item.feature}</span>
                   <span>{item.weight}%</span>
                 </div>
                 <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                   <motion.div 
                     initial={{ width: 0 }}
                     whileInView={{ width: `${item.weight}%` }}
                     viewport={{ once: true }}
                     transition={{ duration: 1, ease: "easeOut" }}
                     className="h-full bg-primary rounded-full"
                   />
                 </div>
               </div>
             ))}
          </CardContent>
        </Card>
      </div>

      {/* Business Impact & Final Resolution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Business Impact */}
        <Card className="shadow-soft">
          <CardHeader className="border-b border-brand-border p-4 bg-brand-background/50">
             <CardTitle className="text-sm font-bold flex items-center gap-2 text-brand-text"><Target size={16}/> Business Impact</CardTitle>
          </CardHeader>
          <CardContent className="p-5 grid grid-cols-2 gap-4">
            <div className="bg-brand-background border border-brand-border p-3 rounded-xl shadow-sm">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Delivery Prevented</p>
              <p className="text-lg font-black text-success">{isHighRisk ? 'YES' : 'N/A'}</p>
            </div>
            <div className="bg-brand-background border border-brand-border p-3 rounded-xl shadow-sm">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Time Saved</p>
              <p className="text-lg font-black text-brand-text">27 Minutes</p>
            </div>
            <div className="bg-brand-background border border-brand-border p-3 rounded-xl shadow-sm">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Fuel Saved</p>
              <p className="text-lg font-black text-brand-text">3 km</p>
            </div>
            <div className="bg-brand-background border border-brand-border p-3 rounded-xl shadow-sm">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Cost Saved</p>
              <p className="text-lg font-black text-brand-text">₹145</p>
            </div>
            <div className="col-span-2 bg-success/10 border border-success/20 p-3 rounded-xl shadow-sm flex items-center justify-between">
              <span className="text-[10px] font-bold text-success uppercase tracking-wider">Customer Satisfaction</span>
              <span className="text-sm font-black text-success">Improved</span>
            </div>
          </CardContent>
        </Card>

        {/* Final Resolution */}
        <Card className="shadow-soft bg-gradient-to-br from-success/10 to-transparent border-success/20">
          <CardHeader className="border-b border-success/10 p-4 bg-brand-background/30 backdrop-blur-sm">
             <CardTitle className="text-sm font-bold flex items-center gap-2 text-success"><ShieldCheck size={16}/> Final Resolution</CardTitle>
          </CardHeader>
          <CardContent className="p-6 flex flex-col justify-center h-full gap-6">
            
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-success flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                <CheckCircle2 size={30} className="text-white" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Delivery Status</p>
                <p className="text-2xl font-black text-brand-text leading-none">Delivered Successfully</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Risk Reduction</p>
                <div className="flex items-end gap-2">
                   <span className="text-lg font-bold text-danger line-through opacity-50">{delivery ? `${delivery.risk_score}%` : '0%'}</span>
                   <ArrowRight size={14} className="mb-1 text-slate-400" />
                   <span className="text-xl font-black text-success">14%</span>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Resolution Time</p>
                <p className="text-xl font-black text-brand-text">3 Minutes</p>
              </div>
            </div>

          </CardContent>
        </Card>

      </div>
    </div>
  );
};

// Helper component for workflow icon
const WorkflowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="6" height="6" rx="1" />
    <rect x="15" y="15" width="6" height="6" rx="1" />
    <path d="M6 9v3a2 2 0 0 0 2 2h8a2 2 0 0 1 2 2v3" />
  </svg>
);

export default AiIntelligencePanel;
