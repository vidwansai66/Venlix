import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Truck, ArrowLeft, Hexagon, KeyRound } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import emailjs from '@emailjs/browser';

interface RoleCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  delay: number;
  onClick: () => void;
}

export const SelectRolePage = () => {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  
  const [showAdminOtp, setShowAdminOtp] = useState(false);
  const [adminOtp, setAdminOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Note: Role logic suspended per request.
  const handleRoleSelection = async (selectedRole: 'admin' | 'driver') => {
    setError('');

    if (selectedRole === 'driver') {
      navigate('/driver');
    }

    if (selectedRole === 'admin') {
      setIsLoading(true);
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      
      try {
        // You must define these keys in your .env
        const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
        const templateId = import.meta.env.VITE_EMAILJS_Template_ID || import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
        const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
        
        if (!serviceId || !templateId || !publicKey) {
          throw new Error("EmailJS configuration is missing.");
        }

        await emailjs.send(
          serviceId,
          templateId,
          {
            to_email: 'saividwan.06@gmail.com',
            otp_code: code,
            otp: code,
            reply_to: user?.email || 'Unknown User'
          },
          publicKey
        );

        setGeneratedOtp(code);
        setShowAdminOtp(true);
      } catch (err: any) {
        console.error("EmailJS Error:", err);
        const errorMessage = err.text || err.message || 'Failed to send OTP. Please check your EmailJS configuration.';
        setError(`EmailJS Error: ${errorMessage}`);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const verifyAdminOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (adminOtp !== generatedOtp) {
      setError('Invalid Admin Approval Code.');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      // Role logic suspended, just navigate
      navigate('/dashboard');
    } catch (err: any) {
      setError('Failed to assign Administrator role.');
      setIsLoading(false);
    }
  };

  const RoleCard = ({ title, description, icon, delay, onClick }: RoleCardProps) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      whileHover={{ scale: 1.03, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group cursor-pointer bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl border border-white/20 dark:border-slate-800 shadow-[0_8px_32px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2)] rounded-3xl p-6 flex flex-col items-center text-center transition-colors hover:bg-white dark:hover:bg-slate-800/80 hover:border-primary/50"
    >
      <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center mb-5 group-hover:bg-primary/10 transition-colors">
        <div className="text-slate-400 group-hover:text-primary transition-colors">
          {icon}
        </div>
      </div>
      <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2 group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
        {description}
      </p>
    </motion.div>
  );

  return (
    <div className="min-h-screen w-full relative flex flex-col items-center justify-center overflow-hidden bg-slate-50 dark:bg-[#0B0F19] transition-colors duration-300 font-sans">
      
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px] mix-blend-screen animate-blob" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-purple-600/20 blur-[150px] mix-blend-screen animate-blob animation-delay-2000" />
        <div className="absolute top-[30%] left-[60%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[100px] mix-blend-screen animate-blob animation-delay-4000" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiM4YjVjZjYiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9zdmc+')] opacity-50 dark:opacity-20" />
      </div>

      <div className="w-full max-w-5xl px-6 z-10 flex flex-col items-center">
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col items-center text-center"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.3)] mb-6">
            <Hexagon size={24} className="text-white fill-white/20" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">Select Your Workspace</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md">
            Choose the portal you wish to access. Your permissions and available tools will adjust automatically.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              key="error"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-600 dark:text-red-400 text-xs font-semibold text-center w-full max-w-md mb-6"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {!showAdminOtp ? (
            <motion.div 
              key="grid"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl mb-12"
            >
              <RoleCard 
                title="Administrator"
                description="Access the global command center, view predictive analytics, and manage the entire logistics network."
                icon={<Shield size={28} strokeWidth={2.5} />}
                onClick={() => handleRoleSelection('admin')}
                delay={0.1}
              />
              <RoleCard 
                title="Delivery Partner"
                description="Access your driver dashboard, view assigned routes, AI predictions, and performance metrics."
                icon={<Truck size={28} strokeWidth={2.5} />}
                onClick={() => handleRoleSelection('driver')}
                delay={0.2}
              />
            </motion.div>
          ) : (
            <motion.div 
              key="otp"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full max-w-md bg-white/70 dark:bg-slate-900/50 backdrop-blur-2xl border border-white/20 dark:border-slate-800 shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2)] rounded-3xl p-8 mb-12"
            >
              <form onSubmit={verifyAdminOtp} className="space-y-6">
                <div className="bg-primary/10 border border-primary/20 p-4 rounded-xl text-center">
                  <p className="text-sm text-primary font-medium mb-1">Approval OTP has been sent to:</p>
                  <p className="text-slate-900 dark:text-white font-bold">saividwan.06@gmail.com</p>
                  <p className="text-xs text-primary/60 mt-2 italic">Please check your email for the 6-digit code.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center block">Enter Approval Code</label>
                  <div className="relative group">
                    <KeyRound size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <input 
                      type="text" 
                      maxLength={6}
                      value={adminOtp}
                      onChange={(e) => setAdminOtp(e.target.value.replace(/\D/g, ''))}
                      className="w-full h-12 bg-slate-50 dark:bg-[#0B0F19]/50 border border-slate-200 dark:border-slate-800 rounded-xl pl-11 pr-4 text-center text-lg tracking-widest font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      placeholder="••••••"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    type="button"
                    onClick={() => {
                      setShowAdminOtp(false);
                      setError('');
                    }}
                    className="w-1/3 h-12 rounded-xl flex items-center justify-center text-sm font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={adminOtp.length !== 6 || isLoading}
                    className={`w-2/3 h-12 rounded-xl flex items-center justify-center text-sm font-bold transition-all shadow-lg ${
                      adminOtp.length === 6 && !isLoading
                        ? 'bg-gradient-to-r from-primary to-purple-600 text-white hover:shadow-primary/25 hover:opacity-90' 
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed shadow-none'
                    }`}
                  >
                    {isLoading ? 'Verifying...' : 'Verify Admin'}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <button 
            onClick={() => {
              signOut();
              navigate('/login');
            }} 
            className="inline-flex items-center gap-2 text-slate-500 hover:text-primary transition-colors bg-white/50 dark:bg-slate-900/50 backdrop-blur-md py-2 px-4 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm"
          >
            <ArrowLeft size={14} />
            <span className="text-xs font-bold uppercase tracking-wider">Sign Out</span>
          </button>
        </motion.div>

      </div>
    </div>
  );
};

export default SelectRolePage;
