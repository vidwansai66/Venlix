import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowLeft, Hexagon, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Validation
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail) return;
    
    setIsLoading(true);
    setError('');

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      });

      if (resetError) throw resetError;
      
      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-[#0B0F19] transition-colors duration-300 font-sans">
      
      {/* Animated Circuit Violet Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px] mix-blend-screen animate-blob" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-purple-600/20 blur-[150px] mix-blend-screen animate-blob animation-delay-2000" />
        <div className="absolute top-[30%] left-[60%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[100px] mix-blend-screen animate-blob animation-delay-4000" />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiM4YjVjZjYiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9zdmc+')] opacity-50 dark:opacity-20" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md px-6 z-10"
      >
        <div className="mb-8 flex flex-col items-center justify-center text-center">
          <Link to="/login" className="inline-flex items-center gap-2 mb-6 text-slate-500 hover:text-primary transition-colors">
            <ArrowLeft size={16} />
            <span className="text-sm font-semibold">Back to Login</span>
          </Link>
          
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.3)] mb-6">
            <Hexagon size={32} className="text-white fill-white/20" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Reset Password</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {isSubmitted ? "Check your email for reset instructions." : "Enter your email address to receive a password reset link."}
          </p>
        </div>

        {/* Glassmorphic Card */}
        <div className="bg-white/70 dark:bg-slate-900/50 backdrop-blur-2xl border border-white/20 dark:border-slate-800 shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2)] rounded-3xl p-8">
          
          {isSubmitted ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center text-center py-4"
            >
              <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-4">
                <CheckCircle2 size={32} className="text-success" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Email Sent</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                We've sent a password reset link to <strong className="text-slate-700 dark:text-slate-200">{email}</strong>.
              </p>
              <Link to="/login" className="w-full h-12 rounded-xl flex items-center justify-center text-sm font-bold bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                Return to Login
              </Link>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-600 dark:text-red-400 text-xs font-semibold text-center"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                <div className="relative group">
                  <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-12 bg-slate-50 dark:bg-[#0B0F19]/50 border border-slate-200 dark:border-slate-800 rounded-xl pl-11 pr-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    placeholder="name@venlix.ai"
                  />
                </div>
              </div>

              {/* Reset Button */}
              <button 
                type="submit"
                disabled={!isValidEmail || isLoading}
                className={`w-full h-12 rounded-xl flex items-center justify-center text-sm font-bold transition-all shadow-lg ${
                  isValidEmail && !isLoading
                    ? 'bg-gradient-to-r from-primary to-purple-600 text-white hover:shadow-primary/25 hover:opacity-90' 
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed shadow-none'
                }`}
              >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          )}

        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
