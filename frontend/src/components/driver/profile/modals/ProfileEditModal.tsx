import { motion, AnimatePresence } from 'framer-motion';
import { X, User } from 'lucide-react';
import { useEffect } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

const schema = z.object({
  fullName: z.string().min(1, "Full Name is required"),
  phone: z.string().min(10, "Valid phone number required"),
  email: z.string().email("Invalid email format"),
  dob: z.string().min(1, "Date of Birth is required"),
  gender: z.string().min(1, "Gender is required"),
  address: z.string().min(5, "Address is required"),
  emergencyContact: z.string().min(10, "Emergency contact is required"),
  licenseNumber: z.string().min(5, "License Number is required"),
  licenseExpiry: z.string().min(1, "License Expiry is required"),
});

type FormData = z.infer<typeof schema>;

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultValues: FormData;
  onSave: (data: FormData) => void;
}

export const ProfileEditModal = ({ isOpen, onClose, defaultValues, onSave }: ProfileEditModalProps) => {
  const { register, handleSubmit, formState: { errors, isValid, isSubmitting }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onChange'
  });

  useEffect(() => {
    if (isOpen) {
      reset(defaultValues);
    }
  }, [isOpen, defaultValues, reset]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const onSubmit = async (data: FormData) => {
    await new Promise(r => setTimeout(r, 1000));
    onSave(data);
    toast.success("Profile updated successfully");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
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
            className="relative w-full max-w-2xl max-h-full overflow-y-auto custom-scrollbar rounded-2xl border border-brand-border bg-brand-card shadow-premium z-10 flex flex-col"
          >
            <div className="sticky top-0 z-20 flex items-center justify-between p-5 border-b border-brand-border bg-brand-card/90 backdrop-blur-md">
              <h2 className="text-base font-bold text-brand-text flex items-center gap-2">
                <User size={18} className="text-primary" /> Edit Personal Information
              </h2>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-brand-background text-muted hover:text-brand-text transition-colors">
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                <div>
                  <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">Full Name</label>
                  <input {...register("fullName")} className={`w-full px-4 py-2.5 rounded-xl bg-brand-background border focus:outline-none transition-colors ${errors.fullName ? 'border-danger focus:border-danger/80' : 'border-brand-border focus:border-primary/50 text-brand-text'}`} />
                  {errors.fullName && <p className="text-danger text-xs font-semibold mt-1.5">{errors.fullName.message}</p>}
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">Phone Number</label>
                  <input {...register("phone")} className={`w-full px-4 py-2.5 rounded-xl bg-brand-background border focus:outline-none transition-colors ${errors.phone ? 'border-danger focus:border-danger/80' : 'border-brand-border focus:border-primary/50 text-brand-text'}`} />
                  {errors.phone && <p className="text-danger text-xs font-semibold mt-1.5">{errors.phone.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">Email Address</label>
                  <input {...register("email")} className={`w-full px-4 py-2.5 rounded-xl bg-brand-background border focus:outline-none transition-colors ${errors.email ? 'border-danger focus:border-danger/80' : 'border-brand-border focus:border-primary/50 text-brand-text'}`} />
                  {errors.email && <p className="text-danger text-xs font-semibold mt-1.5">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">Date of Birth</label>
                  <input type="text" {...register("dob")} className={`w-full px-4 py-2.5 rounded-xl bg-brand-background border focus:outline-none transition-colors ${errors.dob ? 'border-danger focus:border-danger/80' : 'border-brand-border focus:border-primary/50 text-brand-text'}`} />
                  {errors.dob && <p className="text-danger text-xs font-semibold mt-1.5">{errors.dob.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">Gender</label>
                  <input {...register("gender")} className={`w-full px-4 py-2.5 rounded-xl bg-brand-background border focus:outline-none transition-colors ${errors.gender ? 'border-danger focus:border-danger/80' : 'border-brand-border focus:border-primary/50 text-brand-text'}`} />
                  {errors.gender && <p className="text-danger text-xs font-semibold mt-1.5">{errors.gender.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">Emergency Contact</label>
                  <input {...register("emergencyContact")} className={`w-full px-4 py-2.5 rounded-xl bg-brand-background border focus:outline-none transition-colors ${errors.emergencyContact ? 'border-danger focus:border-danger/80' : 'border-brand-border focus:border-primary/50 text-brand-text'}`} />
                  {errors.emergencyContact && <p className="text-danger text-xs font-semibold mt-1.5">{errors.emergencyContact.message}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">Home Address</label>
                  <input {...register("address")} className={`w-full px-4 py-2.5 rounded-xl bg-brand-background border focus:outline-none transition-colors ${errors.address ? 'border-danger focus:border-danger/80' : 'border-brand-border focus:border-primary/50 text-brand-text'}`} />
                  {errors.address && <p className="text-danger text-xs font-semibold mt-1.5">{errors.address.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">License Number</label>
                  <input {...register("licenseNumber")} className={`w-full px-4 py-2.5 rounded-xl bg-brand-background border focus:outline-none transition-colors ${errors.licenseNumber ? 'border-danger focus:border-danger/80' : 'border-brand-border focus:border-primary/50 text-brand-text'}`} />
                  {errors.licenseNumber && <p className="text-danger text-xs font-semibold mt-1.5">{errors.licenseNumber.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">License Expiry</label>
                  <input type="text" {...register("licenseExpiry")} className={`w-full px-4 py-2.5 rounded-xl bg-brand-background border focus:outline-none transition-colors ${errors.licenseExpiry ? 'border-danger focus:border-danger/80' : 'border-brand-border focus:border-primary/50 text-brand-text'}`} />
                  {errors.licenseExpiry && <p className="text-danger text-xs font-semibold mt-1.5">{errors.licenseExpiry.message}</p>}
                </div>
              </div>

              <div className="pt-5 border-t border-brand-border flex gap-3">
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
                  {isSubmitting ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
export default ProfileEditModal;
