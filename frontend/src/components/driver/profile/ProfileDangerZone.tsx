import { useState } from 'react';
import { toast } from 'sonner';
import { LogOut, Trash2, PowerOff } from 'lucide-react';
import { ConfirmationModal } from './modals/ConfirmationModal';
import { useNavigate } from 'react-router-dom';
export const ProfileDangerZone = () => {
  const [modalType, setModalType] = useState<'logout' | 'disable' | 'delete' | null>(null);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6">
      
      {/* Logout */}
      <div className="rounded-2xl border border-brand-border bg-brand-card p-6 shadow-soft flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-brand-text">Log Out</h2>
          <p className="text-xs font-medium text-muted mt-1">You will be signed out from this device.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-2.5 bg-brand-background border border-brand-border rounded-xl text-sm font-bold text-brand-text hover:bg-brand-background/80 transition-colors shadow-sm" onClick={() => setModalType('logout')}>
          <LogOut size={16} /> Log Out
        </button>
      </div>

      {/* Danger Zone */}
      <div className="rounded-2xl border border-danger/30 bg-danger/5 p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-danger/10 rounded-full blur-[40px] -mr-10 -mt-10 pointer-events-none"></div>
        
        <h2 className="text-base font-bold text-danger mb-4 flex items-center gap-2">Danger Zone</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-danger/20 bg-brand-card">
            <h3 className="text-sm font-bold text-brand-text mb-1">Disable Account</h3>
            <p className="text-xs font-medium text-muted mb-4">Temporarily disable your delivery account. You won't receive new orders.</p>
            <button className="flex items-center gap-2 px-4 py-2 bg-brand-background border border-brand-border rounded-lg text-xs font-bold text-brand-text hover:bg-brand-background/80 transition-colors" onClick={() => setModalType('disable')}>
              <PowerOff size={14} className="text-muted"/> Disable Account
            </button>
          </div>
          <div className="p-4 rounded-xl border border-danger/20 bg-brand-card">
            <h3 className="text-sm font-bold text-brand-text mb-1">Delete Account</h3>
            <p className="text-xs font-medium text-muted mb-4">Permanently remove your account and all associated data. This action is irreversible.</p>
            <button className="flex items-center gap-2 px-4 py-2 bg-danger text-white rounded-lg text-xs font-bold hover:bg-danger/90 transition-colors shadow-[0_0_15px_rgba(239,68,68,0.3)]" onClick={() => setModalType('delete')}>
              <Trash2 size={14} /> Delete Account
            </button>
          </div>
        </div>
      </div>

      <ConfirmationModal 
        isOpen={modalType === 'logout'}
        onClose={() => setModalType(null)}
        onConfirm={() => { toast.success('Logged out successfully'); navigate('/auth/login'); }}
        title="Log Out"
        message="Are you sure you want to log out of your driver account? You will need to log back in to continue receiving orders."
        confirmText="Log Out"
      />

      <ConfirmationModal 
        isOpen={modalType === 'disable'}
        onClose={() => setModalType(null)}
        onConfirm={() => toast.success('Account disabled temporarily')}
        title="Disable Account"
        message="Are you sure you want to disable your account? You will not be able to accept any new deliveries until you re-enable it."
        confirmText="Disable Account"
        isDanger={true}
      />

      <ConfirmationModal 
        isOpen={modalType === 'delete'}
        onClose={() => setModalType(null)}
        onConfirm={() => { toast.success('Account deleted successfully'); navigate('/'); }}
        title="Delete Account"
        message="This action cannot be undone. Are you sure you want to permanently delete your driver account and all associated data?"
        confirmText="Delete Account"
        isDanger={true}
      />

    </div>
  );
};
export default ProfileDangerZone;
