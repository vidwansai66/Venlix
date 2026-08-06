import { Briefcase, Calendar, Clock, MapPin, Target, ShieldCheck } from 'lucide-react';

export const ProfileWorkInfo = () => {
  const fields = [
    { label: "Employee ID", value: "EMP-49281", icon: Briefcase },
    { label: "Joining Date", value: "12 Aug 2024", icon: Calendar },
    { label: "Current Shift", value: "Morning (8 AM - 4 PM)", icon: Clock },
    { label: "Assigned Hub", value: "Hub 4 (Downtown)", icon: MapPin },
  ];

  return (
    <div className="rounded-2xl border border-brand-border bg-brand-card p-6 shadow-soft h-full flex flex-col">
      <h2 className="text-base font-bold text-brand-text mb-6">Work Information</h2>
      
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

      <div className="mt-auto grid grid-cols-2 gap-3 pt-4 border-t border-brand-border">
        <div className="p-3 rounded-xl bg-brand-background border border-brand-border text-center">
          <Target size={16} className="text-primary mx-auto mb-1" />
          <p className="text-xs font-bold text-muted uppercase tracking-widest mb-0.5">Deliveries</p>
          <p className="text-lg font-black text-brand-text">1,248</p>
        </div>
        <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-400/20 to-amber-600/20 border border-yellow-500/30 text-center">
          <ShieldCheck size={16} className="text-warning mx-auto mb-1" />
          <p className="text-xs font-bold text-warning uppercase tracking-widest mb-0.5">Driver Level</p>
          <p className="text-lg font-black text-brand-text">Gold</p>
        </div>
      </div>
    </div>
  );
};
export default ProfileWorkInfo;
