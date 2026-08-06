import { useState } from 'react';
import { User, Star, ShieldCheck, Power } from 'lucide-react';

export const ProfileHeader = () => {
  const [isOnline, setIsOnline] = useState(true);

  return (
    <div className="mb-8 relative rounded-3xl border border-brand-border bg-brand-card shadow-soft overflow-hidden">
      {/* Decorative Banner Background */}
      <div className="h-32 bg-gradient-to-r from-primary/20 via-primary/5 to-transparent relative">
         <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[60px] -mr-20 -mt-20 pointer-events-none"></div>
      </div>
      
      <div className="px-8 pb-8 -mt-16 flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
        
        {/* Profile Info */}
        <div className="flex flex-col md:flex-row md:items-end gap-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-2xl bg-brand-background border-4 border-brand-card shadow-lg flex items-center justify-center overflow-hidden">
               {/* Placeholder Avatar */}
               <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/30 flex items-center justify-center">
                 <User size={48} className="text-primary" />
               </div>
            </div>
            {/* Status Indicator */}
            <div className={`absolute bottom-2 right-2 w-5 h-5 rounded-full border-4 border-brand-card ${isOnline ? 'bg-success' : 'bg-muted'}`}></div>
          </div>
          
          <div className="pb-2">
            <h1 className="text-3xl font-black text-brand-text tracking-tight mb-1">John Doe</h1>
            <div className="flex flex-wrap items-center gap-3 text-sm font-bold text-muted">
              <span className="flex items-center gap-1.5"><ShieldCheck size={16} className="text-primary" /> DEL-8492</span>
              <span className="w-1.5 h-1.5 rounded-full bg-brand-border"></span>
              <span className="flex items-center gap-1.5"><Star size={16} className="text-warning fill-warning" /> 4.9 Rating</span>
              <span className="w-1.5 h-1.5 rounded-full bg-brand-border"></span>
              <span>Electric Van (EV)</span>
            </div>
          </div>
        </div>

        {/* Availability Toggle */}
        <div className="flex items-center gap-4 bg-brand-background/80 backdrop-blur border border-brand-border p-3 rounded-2xl">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted">Current Status</span>
            <span className={`text-sm font-bold ${isOnline ? 'text-success' : 'text-muted'}`}>
              {isOnline ? 'Available (Online)' : 'Offline'}
            </span>
          </div>
          <button 
            onClick={() => setIsOnline(!isOnline)}
            className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm ${
              isOnline 
                ? 'bg-success/10 text-success border border-success/30 hover:bg-success/20' 
                : 'bg-brand-card text-muted border border-brand-border hover:bg-brand-background'
            }`}
          >
            <Power size={24} />
          </button>
        </div>

      </div>
    </div>
  );
};
export default ProfileHeader;
