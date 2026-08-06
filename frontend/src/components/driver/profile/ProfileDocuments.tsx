import { toast } from 'sonner';
import { FileText, CheckCircle2, Clock, UploadCloud, XCircle } from 'lucide-react';

export const ProfileDocuments = () => {
  const documents = [
    { name: "Driving License", status: "Verified", icon: FileText },
    { name: "Vehicle RC", status: "Verified", icon: FileText },
    { name: "Vehicle Insurance", status: "Verified", icon: FileText },
    { name: "Identity Proof", status: "Pending", icon: FileText },
    { name: "Background Check", status: "Rejected", icon: FileText },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Verified": return <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-success bg-success/10 px-2 py-1 rounded border border-success/20"><CheckCircle2 size={12}/> Verified</span>;
      case "Pending": return <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-warning bg-warning/10 px-2 py-1 rounded border border-warning/20"><Clock size={12}/> Pending Rev.</span>;
      case "Rejected": return <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-danger bg-danger/10 px-2 py-1 rounded border border-danger/20"><XCircle size={12}/> Rejected</span>;
      default: return null;
    }
  };

  return (
    <div className="rounded-2xl border border-brand-border bg-brand-card p-6 shadow-soft h-full">
      <h2 className="text-base font-bold text-brand-text mb-6">Documents & Verification</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((doc, idx) => (
          <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-brand-border bg-brand-background/50">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-brand-card border border-brand-border shadow-sm text-muted">
                 <doc.icon size={18} />
              </div>
              <div>
                 <h3 className="text-sm font-bold text-brand-text">{doc.name}</h3>
                 <div className="mt-1.5">{getStatusBadge(doc.status)}</div>
              </div>
            </div>
            
            {/* Upload Button overlay for rejected or missing docs */}
            {doc.status === "Rejected" && (
              <button className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors border border-primary/20" onClick={() => toast.success('Action simulated successfully')}>
                <UploadCloud size={16} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
export default ProfileDocuments;
