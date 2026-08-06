import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Hexagon, KeyRound } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export const SignUpPage = () => {
  const navigate = useNavigate();
  const { isLoaded } = useAuth();
  
  // Steps: 'form' -> 'email_verification'
  const [step, setStep] = useState<'form' | 'email_verification'>('form');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [verificationCode, setVerificationCode] = useState('');
  
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPassword = password.length >= 8;
  const isFormValid = isValidEmail && isValidPassword && !isLoading;

  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || !isLoaded) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (signUpError) throw signUpError;
      
      setStep('email_verification');
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign up.');
      setStep('form');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token: verificationCode,
        type: 'signup',
      });

      if (verifyError) throw verifyError;

      if (data.user || data.session) {
        navigate('/select-role');
      } else {
        // If email confirmation is disabled or link is used
        setError('Verification failed. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid verification code.');
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
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiM4YjVjZjYiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9zdmc+')] opacity-50 dark:opacity-20" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
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
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
            {step === 'form' && "Create Account"}
            {step === 'email_verification' && "Verify Email"}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {step === 'form' && "Join the Venlix AI logistics network."}
            {step === 'email_verification' && "Check your inbox for a verification code."}
          </p>
        </div>

        {/* Glassmorphic Card */}
        <div className="bg-white/70 dark:bg-slate-900/50 backdrop-blur-2xl border border-white/20 dark:border-slate-800 shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2)] rounded-3xl p-8 relative overflow-hidden">
          
          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                key="error"
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-600 dark:text-red-400 text-xs font-semibold text-center"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {/* STEP 1: Main Form */}
            {step === 'form' && (
              <motion.form 
                key="form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleInitialSubmit} 
                className="space-y-5"
              >
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

                {/* Password Field */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Password (Min 8 Chars)</label>
                  <div className="relative group">
                    <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-12 bg-slate-50 dark:bg-[#0B0F19]/50 border border-slate-200 dark:border-slate-800 rounded-xl pl-11 pr-11 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      placeholder="••••••••"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={!isFormValid || !isLoaded}
                  className={`w-full h-12 rounded-xl flex items-center justify-center text-sm font-bold transition-all shadow-lg mt-2 ${
                    isFormValid && isLoaded
                      ? 'bg-gradient-to-r from-primary to-purple-600 text-white hover:shadow-primary/25 hover:opacity-90' 
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed shadow-none'
                  }`}
                >
                  {isLoading ? 'Processing...' : 'Continue'}
                </button>
              </motion.form>
            )}

            {/* STEP 2: Email Verification (Standard Clerk) */}
            {step === 'email_verification' && (
              <motion.form 
                key="email_verification"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleVerifyEmail} 
                className="space-y-6"
              >
                <div className="text-center mb-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    We've sent a standard verification code to: <br/>
                    <strong className="text-slate-900 dark:text-white">{email}</strong>
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center block">Verification Code</label>
                  <div className="relative group">
                    <KeyRound size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <input 
                      type="text" 
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                      className="w-full h-12 bg-slate-50 dark:bg-[#0B0F19]/50 border border-slate-200 dark:border-slate-800 rounded-xl pl-11 pr-4 text-center text-lg tracking-widest font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      placeholder="••••••"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={verificationCode.length < 6 || isLoading}
                  className={`w-full h-12 rounded-xl flex items-center justify-center text-sm font-bold transition-all shadow-lg ${
                    verificationCode.length >= 6 && !isLoading
                      ? 'bg-gradient-to-r from-primary to-purple-600 text-white hover:shadow-primary/25 hover:opacity-90' 
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed shadow-none'
                  }`}
                >
                  {isLoading ? 'Verifying...' : 'Complete Sign Up'}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUpPage;
