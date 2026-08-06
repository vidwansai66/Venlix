import { motion, AnimatePresence } from 'framer-motion';
import { X, Key } from 'lucide-react';
import { useEffect } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

const schema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Must be at least 8 characters"),
  confirmPassword: z.string()
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

type FormData = z.infer<typeof schema>;

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChangePasswordModal = ({ isOpen, onClose }: ChangePasswordModalProps) => {
  const { register, handleSubmit, formState: { errors, isValid, isSubmitting }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange'
  });

  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const onSubmit = async (_data: FormData) => {
    await new Promise(r => setTimeout(r, 1000)); // Simulate API call
    toast.success("Password successfully updated");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-brand-border bg-brand-card shadow-premium z-10 flex flex-col"
          >
            <div className="flex items-center justify-between p-5 border-b border-brand-border bg-brand-background/50">
              <h2 className="text-base font-bold text-brand-text flex items-center gap-2">
                <Key size={18} className="text-primary" /> Change Password
              </h2>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-brand-background text-muted hover:text-brand-text transition-colors">
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">Current Password</label>
                <input
                  type="password"
                  {...register("currentPassword")}
                  className={`w-full px-4 py-3 rounded-xl bg-brand-background border focus:outline-none transition-colors ${errors.currentPassword ? 'border-danger focus:border-danger/80' : 'border-brand-border focus:border-primary/50 text-brand-text'}`}
                  placeholder="Enter current password"
                />
                {errors.currentPassword && <p className="text-danger text-xs font-semibold mt-1.5">{errors.currentPassword.message}</p>}
              </div>
              
              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">New Password</label>
                <input
                  type="password"
                  {...register("newPassword")}
                  className={`w-full px-4 py-3 rounded-xl bg-brand-background border focus:outline-none transition-colors ${errors.newPassword ? 'border-danger focus:border-danger/80' : 'border-brand-border focus:border-primary/50 text-brand-text'}`}
                  placeholder="Enter new password"
                />
                {errors.newPassword && <p className="text-danger text-xs font-semibold mt-1.5">{errors.newPassword.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">Confirm New Password</label>
                <input
                  type="password"
                  {...register("confirmPassword")}
                  className={`w-full px-4 py-3 rounded-xl bg-brand-background border focus:outline-none transition-colors ${errors.confirmPassword ? 'border-danger focus:border-danger/80' : 'border-brand-border focus:border-primary/50 text-brand-text'}`}
                  placeholder="Confirm new password"
                />
                {errors.confirmPassword && <p className="text-danger text-xs font-semibold mt-1.5">{errors.confirmPassword.message}</p>}
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-1/3 py-3 rounded-xl border border-brand-border bg-brand-background text-brand-text font-bold text-sm hover:border-primary/50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isValid || isSubmitting}
                  className="w-2/3 flex items-center justify-center py-3 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-colors shadow-[0_0_15px_rgba(124,58,237,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Saving...' : 'Update Password'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
export default ChangePasswordModal;
