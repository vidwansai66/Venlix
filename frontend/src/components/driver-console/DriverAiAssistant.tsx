import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';
import { 
  BrainCircuit, 
  Navigation, 
  AlertTriangle, 
  Target,
  CloudLightning,
  Clock,
  Car
} from 'lucide-react';
export const DriverAiAssistant = ({ currentDelivery }: { currentDelivery?: any }) => {
  const currentRiskScore = currentDelivery ? currentDelivery.risk_score : 0;
  const rawRiskFactors = currentDelivery?.json_response ? JSON.parse(currentDelivery.json_response).risk_factors || ['No specific factor'] : ['No specific factor'];
  const riskFactors = rawRiskFactors.map((r: any) => typeof r === 'object' && r !== null ? r.factor : r);
  const recommendations = currentDelivery?.json_response ? JSON.parse(currentDelivery.json_response).recommendations || [] : [];
  return (
    <div className="flex flex-col gap-6">
      
      {/* Navigation Card */}
      <Card className="shadow-soft overflow-hidden border-brand-border">
        <div className="h-48 bg-slate-200 dark:bg-slate-800 relative flex items-center justify-center overflow-hidden group cursor-pointer">
           {/* Mock Map Background */}
           <div className="absolute inset-0 opacity-50 dark:opacity-20" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
           
           {/* Mock Route Line */}
           <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
             <path d="M 50,150 Q 150,50 300,100 T 400,150" fill="none" stroke="#3B82F6" strokeWidth="4" strokeDasharray="8 8" className="animate-[dash_1s_linear_infinite]"/>
           </svg>
           
           <div className="absolute left-[50px] top-[140px] w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
           <div className="absolute left-[390px] top-[140px] w-6 h-6 bg-orange-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white text-[10px]">🛡️</div>

           <div className="absolute inset-0 bg-gradient-to-t from-brand-card/90 to-transparent"></div>
           <Button onClick={() => toast.info('Navigation started.')} className="absolute bottom-4 left-1/2 -translate-x-1/2 shadow-premium bg-brand-card text-brand-text hover:bg-brand-background border border-brand-border" leftIcon={<Navigation size={16} className="text-emerald-500"/>}>
             Start Route
           </Button>
        </div>
        <CardContent className="p-4 grid grid-cols-3 gap-2 divide-x divide-brand-border">
          <div className="text-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">ETA</span>
            <span className="text-lg font-black text-brand-text">14 min</span>
          </div>
          <div className="text-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Distance</span>
            <span className="text-lg font-black text-brand-text">3.2 km</span>
          </div>
          <div className="text-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Traffic</span>
            <span className="text-lg font-black text-orange-500">Moderate</span>
          </div>
        </CardContent>
      </Card>

      {/* AI Driver Assistant Feed */}
      <Card className="shadow-soft border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader className="border-b border-primary/10 p-4">
           <CardTitle className="text-sm font-bold flex items-center gap-2 text-primary"><BrainCircuit size={16}/> AI Assistant</CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
           {recommendations.length > 0 ? recommendations.map((rec: string, idx: number) => (
             <div key={idx} className="bg-brand-card border border-brand-border rounded-xl p-3 shadow-sm flex flex-col gap-2 relative overflow-hidden group hover:border-primary/50 transition-colors">
               <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
               <div className="flex justify-between items-start pl-2">
                 <div>
                   <p className="text-sm font-black text-primary">{rec}</p>
                 </div>
                 <Badge variant={currentRiskScore > 70 ? 'danger' : 'warning'} className="text-[9px] scale-90 origin-top-right">
                   {currentRiskScore > 70 ? 'High' : 'Medium'}
                 </Badge>
               </div>
             </div>
           )) : (
             <div className="text-center p-4">
               <p className="text-sm font-bold text-slate-500">No active recommendations.</p>
             </div>
           )}
        </CardContent>
      </Card>

      {/* Current Risk Gauge */}
      <Card className={`shadow-soft ${currentRiskScore >= 70 ? 'bg-danger/10 border-danger/40 shadow-[0_0_20px_rgba(239,68,68,0.2)]' : 'bg-danger/5 border-danger/20'} transition-all duration-500`}>
        <CardHeader className="border-b border-danger/10 p-4">
           <CardTitle className="text-sm font-bold flex items-center gap-2 text-danger"><AlertTriangle size={16}/> Delivery Risk</CardTitle>
        </CardHeader>
        <CardContent className="p-6 flex flex-col items-center">
          <div className="relative w-32 h-32 mb-4">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="text-brand-border" />
              <motion.circle 
                cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" 
                strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * (currentRiskScore / 100))}
                className="text-danger" strokeLinecap="round" 
                animate={{ strokeDashoffset: 251.2 - (251.2 * (currentRiskScore / 100)) }} transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-danger">{currentRiskScore}%</span>
            </div>
          </div>
          <div className="w-full">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 text-center">Detected Factors</p>
            <div className="flex flex-wrap justify-center gap-1.5">
              {riskFactors.map((r: string, i: number) => (
                <Badge key={i} variant="outline" className="bg-brand-background border-danger/30 text-danger text-[9px]">{r}</Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>



    </div>
  );
};

export default DriverAiAssistant;
