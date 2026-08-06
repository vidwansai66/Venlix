import { useState } from 'react';
import { HelpCircle, MessageSquare, Headphones, FileQuestion } from 'lucide-react';
import { SupportModal } from './modals/SupportModal';

export const ProfileSupport = () => {
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const supports = [
    { label: "Help Center", desc: "Read guides and tutorials", icon: HelpCircle },
    { label: "Raise Ticket", desc: "Report an issue to support", icon: MessageSquare },
    { label: "Contact Hub Manager", desc: "Call or message your manager", icon: Headphones },
    { label: "FAQ", desc: "Frequently asked questions", icon: FileQuestion },
  ];

  return (
    <div className="rounded-2xl border border-brand-border bg-brand-card p-6 shadow-soft h-full">
      <h2 className="text-base font-bold text-brand-text mb-6">Support & Help</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {supports.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button key={idx} className="flex items-start gap-3 p-4 rounded-xl border border-brand-border bg-brand-background hover:border-primary/50 transition-colors text-left" onClick={() => setIsSupportModalOpen(true)}>
              <div className="p-2.5 rounded-lg bg-brand-card border border-brand-border shadow-sm text-primary">
                 <Icon size={18} />
              </div>
              <div>
                 <h3 className="text-sm font-bold text-brand-text">{item.label}</h3>
                 <p className="text-xs font-medium text-muted mt-0.5">{item.desc}</p>
              </div>
            </button>
          );
        })}
      </div>
      <SupportModal isOpen={isSupportModalOpen} onClose={() => setIsSupportModalOpen(false)} />
    </div>
  );
};
export default ProfileSupport;
