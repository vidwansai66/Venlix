import { Truck, Hash, Fuel, ShieldAlert, CheckCircle2, AlertTriangle } from 'lucide-react';

export const ProfileVehicleInfo = () => {
  const fields = [
    { label: "Vehicle Type", value: "Electric Van (EV)", icon: Truck },
    { label: "Vehicle Number", value: "NY-24-EV-8492", icon: Hash },
    { label: "Fuel Type", value: "Electric / Battery", icon: Fuel },
    { label: "Vehicle Model", value: "Ford E-Transit 2023", icon: Truck },
  ];

  return (
    <div className="rounded-2xl border border-brand-border bg-brand-card p-6 shadow-soft h-full flex flex-col">
      <h2 className="text-base font-bold text-brand-text mb-6">Fleet & Vehicle</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        {fields.map((field, idx) => {
          const Icon = field.icon;
          return (
            <div key={idx}>
              <span className="text-[10px] font-bold text-muted uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                <Icon size={12} /> {field.label}
              </span>
              <p className="text-sm font-semibold text-brand-text">
                {field.value}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-auto space-y-3 pt-4 border-t border-brand-border">
        <div className="flex justify-between items-center p-3 rounded-lg bg-brand-background border border-brand-border">
          <span className="text-xs font-bold text-brand-text flex items-center gap-2"><ShieldAlert size={14} className="text-muted"/> Registration</span>
          <span className="text-xs font-bold text-success flex items-center gap-1"><CheckCircle2 size={12}/> Valid</span>
        </div>
        <div className="flex justify-between items-center p-3 rounded-lg bg-brand-background border border-brand-border">
          <span className="text-xs font-bold text-brand-text flex items-center gap-2"><ShieldAlert size={14} className="text-muted"/> Insurance</span>
          <span className="text-xs font-bold text-success flex items-center gap-1"><CheckCircle2 size={12}/> Active</span>
        </div>
        <div className="flex justify-between items-center p-3 rounded-lg bg-warning/10 border border-warning/30">
          <span className="text-xs font-bold text-brand-text flex items-center gap-2"><AlertTriangle size={14} className="text-warning"/> Next Service</span>
          <span className="text-xs font-bold text-warning">Due in 14 Days</span>
        </div>
      </div>
    </div>
  );
};
export default ProfileVehicleInfo;
