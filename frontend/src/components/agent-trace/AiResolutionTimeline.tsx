import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, PlayCircle } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { useDemoContext } from '@/contexts/DemoContext';

export const AiResolutionTimeline = ({ delivery }: { delivery?: any }) => {
  const { isDemoMode, currentStep, animatedRiskScore } = useDemoContext();
  const [expandedNode, setExpandedNode] = useState<number | null>(4);

  useEffect(() => {
    if (isDemoMode) {
      if (currentStep >= 3 && currentStep <= 5) setExpandedNode(5);
      else if (currentStep >= 6) setExpandedNode(null);
    }
  }, [isDemoMode, currentStep]);

  const timelineNodes = useMemo(() => {
    const isHighRisk = delivery && delivery.risk_score >= 40;
    const time = delivery ? new Date(delivery.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '2:15 PM';
    
    const baseNodes = [
      { id: 1, stepReq: 1, time: time, title: `Order #${delivery?.id || '1024'} assigned`, status: 'Completed', color: 'success' },
      { id: 2, stepReq: 1, time: time, title: 'Driver departed warehouse', status: 'Completed', color: 'success' },
    ];

    if (isHighRisk) {
      const parsed = delivery.json_response ? JSON.parse(delivery.json_response) : {};
      const rawRiskFactors = parsed.risk_factors || ['Unknown risk factor'];
      const riskFactors = rawRiskFactors.map((r: any) => typeof r === 'object' && r !== null ? r.factor : r);
      baseNodes.push({
        id: 5, stepReq: 3, time: time, title: 'AI Prediction Triggered', status: 'Current', color: 'primary',
        details: {
          prediction: 'Elevated Risk Detected',
          risk: `${delivery.risk_score}%`,
          confidence: 'High',
          reasons: riskFactors
        }
      });
      baseNodes.push({ id: 6, stepReq: 6, time: 'Pending', title: 'Action Required', status: 'Pending', color: 'slate' });
    } else {
      baseNodes.push({ id: 3, stepReq: 2, time: time, title: 'Driver en route', status: 'Completed', color: 'success' });
      baseNodes.push({ id: 9, stepReq: 9, time: 'Pending', title: 'Delivery Expected', status: 'Pending', color: 'slate' });
    }

    return baseNodes;
  }, [delivery]);

  return (
    <div className="bg-brand-card border border-brand-border rounded-2xl shadow-premium p-6 h-full flex flex-col">
      <h2 className="text-sm font-bold text-brand-text mb-6 uppercase tracking-wider flex items-center gap-2">
        <PlayCircle size={16} className="text-primary" /> Live Event Stream
      </h2>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar relative px-2 pb-12">
        {/* Continuous Line */}
        <div className="absolute left-6 top-2 bottom-0 w-[2px] bg-brand-border z-0"></div>

        <div className="space-y-6">
          {timelineNodes.map((node, index) => {
            const isCompleted = node.status === 'Completed';
            const isCurrent = node.status === 'Current';
            const isPending = node.status === 'Pending';
            
            return (
              <motion.div 
                key={node.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
                className="relative z-10 flex gap-6 group"
              >
                {/* Node Icon */}
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 bg-brand-background transition-colors
                  ${isCompleted ? 'border-success text-success' : 
                    isCurrent ? 'border-primary text-primary shadow-[0_0_15px_rgba(124,58,237,0.5)]' : 
                    'border-slate-300 text-slate-300 dark:border-slate-700 dark:text-slate-600'}`}
                >
                  {isCompleted && <CheckCircle2 size={14} />}
                  {isCurrent && <div className="w-2.5 h-2.5 bg-primary rounded-full animate-ping" />}
                  {isPending && <div className="w-1.5 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full" />}
                </div>

                {/* Node Content */}
                <div className="flex-1 pt-1">
                  <div 
                    className={`flex items-start justify-between cursor-pointer ${isPending ? 'opacity-50' : 'hover:opacity-80'}`}
                    onClick={() => node.details && setExpandedNode(node.id === expandedNode ? null : node.id)}
                  >
                    <div>
                      <h3 className={`text-base font-bold ${isCurrent ? 'text-primary' : 'text-brand-text'}`}>
                        {node.title}
                      </h3>
                      <p className="text-xs font-semibold text-slate-500 mt-0.5">{node.time}</p>
                    </div>
                    <Badge 
                      variant={isCompleted ? 'success' : isCurrent ? 'primary' : 'outline'} 
                      pill className="text-[9px] uppercase tracking-wider"
                    >
                      {node.status}
                    </Badge>
                  </div>

                  {/* Expandable Details Card */}
                  <AnimatePresence>
                    {node.details && expandedNode === node.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        className="overflow-hidden"
                      >
                        <Card className="bg-danger/5 border border-danger/20 shadow-soft overflow-hidden">
                          <div className="p-4 border-b border-danger/10 flex justify-between items-center bg-danger/10">
                            <span className="text-xs font-bold text-danger uppercase tracking-wider flex items-center gap-1.5">
                              <AlertTriangle size={14} /> AI Risk Assessment
                            </span>
                            <span className="text-[10px] font-bold text-danger">{node.time}</span>
                          </div>
                          <div className="p-4 grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Prediction</p>
                              <p className="text-sm font-bold text-brand-text">{node.details.prediction}</p>
                            </div>
                            <div className="flex gap-4">
                              <div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Risk</p>
                                <p className="text-xl font-black text-danger">{node.details.risk}</p>
                              </div>
                              <div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Confidence</p>
                                <p className="text-xl font-black text-brand-text">{node.details.confidence}</p>
                              </div>
                            </div>
                            <div className="col-span-2">
                              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Detected Risk Factors</p>
                              <div className="flex flex-wrap gap-2">
                                {node.details.reasons.map((r, i) => (
                                  <Badge key={i} variant="outline" className="bg-brand-background border-brand-border text-[10px]">
                                    {r}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AiResolutionTimeline;
