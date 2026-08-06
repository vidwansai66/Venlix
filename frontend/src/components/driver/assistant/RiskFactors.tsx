import { motion } from 'framer-motion';
import { AlertTriangle, CloudRain, Car, AlertCircle } from 'lucide-react';
import type { DriverDeliveryItem } from '@/hooks/useDriverData';

interface RiskFactorsProps {
  delivery: DriverDeliveryItem;
}

export const RiskFactors = ({ delivery }: RiskFactorsProps) => {
  const risks = delivery.risk_factors || [
    { factor: "Severe Traffic", severity: "Critical", description: "Multi-vehicle collision on Route A causing complete standstill." },
    { factor: "Weather Condition", severity: "High", description: "Heavy rain reducing visibility and average speed." },
    { factor: "Time Sensitivity", severity: "Medium", description: "Approaching SLA breach threshold (12 mins remaining)." }
  ];

  const getSeverityStyles = (severity: string) => {
    switch(severity) {
      case 'Critical': return 'border-danger/30 bg-danger/5';
      case 'High': return 'border-warning/30 bg-warning/5';
      default: return 'border-brand-border bg-brand-background';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch(severity) {
      case 'Critical': return <AlertTriangle size={18} className="text-danger" />;
      case 'High': return <CloudRain size={18} className="text-warning" />;
      default: return <AlertCircle size={18} className="text-primary" />;
    }
  };

  return (
    <div className="mb-8 rounded-3xl border border-brand-border bg-brand-card p-6 lg:p-8 shadow-soft">
      <h3 className="text-base font-bold text-brand-text mb-6">Active Risk Factors</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {risks.map((risk, idx) => (
          <div key={idx} className={`p-5 rounded-2xl border ${getSeverityStyles(risk.severity)}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                {getSeverityIcon(risk.severity)}
                <span className="font-bold text-brand-text text-sm">{risk.factor}</span>
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${
                risk.severity === 'Critical' ? 'text-danger border-danger/30' : 
                risk.severity === 'High' ? 'text-warning border-warning/30' : 
                'text-primary border-primary/30'
              }`}>
                {risk.severity}
              </span>
            </div>
            <p className="text-xs font-medium text-muted leading-relaxed">
              {risk.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default RiskFactors;
