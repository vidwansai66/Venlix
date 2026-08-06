import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { useEffect } from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  isDanger?: boolean;
}

export const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  isDanger = false
}: ConfirmationModalProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

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
            className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-brand-border bg-brand-card shadow-premium z-10"
          >
            {isDanger && <div className="absolute top-0 right-0 w-32 h-32 bg-danger/10 rounded-full blur-[40px] -mr-10 -mt-10 pointer-events-none"></div>}
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                {isDanger ? (
                  <div className="w-10 h-10 rounded-full bg-danger/10 flex items-center justify-center shrink-0 border border-danger/20 text-danger">
                    <AlertTriangle size={20} />
                  </div>
                ) : null}
                <h2 className="text-lg font-bold text-brand-text">{title}</h2>
              </div>
              <p className="text-sm font-medium text-muted leading-relaxed mb-8">
                {message}
              </p>
              
              <div className="flex flex-col-reverse sm:flex-row gap-3">
                <button
                  onClick={onClose}
                  className="w-full sm:w-1/2 py-2.5 rounded-xl border border-brand-border bg-brand-background text-brand-text font-bold text-sm hover:border-primary/50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className={`w-full sm:w-1/2 py-2.5 rounded-xl text-white font-bold text-sm transition-colors shadow-sm ${
                    isDanger ? 'bg-danger hover:bg-danger/90 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'bg-primary hover:bg-primary/90 shadow-[0_0_15px_rgba(124,58,237,0.3)]'
                  }`}
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
export default ConfirmationModal;
