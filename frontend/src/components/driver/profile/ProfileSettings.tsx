import { useState, useEffect } from 'react';
import { Moon, Bell, MapPin, BrainCircuit, Globe, Key, Smartphone, ShieldCheck, ChevronRight, Check } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

export const ProfileSettings = ({ onChangePasswordModal }: { onChangePasswordModal: () => void }) => {
  const { theme, toggleTheme } = useTheme();
  
  const [notifications, setNotifications] = useState(() => JSON.parse(localStorage.getItem('venlix-driver-notifications') || 'true'));
  const [location, setLocation] = useState(() => JSON.parse(localStorage.getItem('venlix-driver-location') || 'true'));
  const [aiRecs, setAiRecs] = useState(() => JSON.parse(localStorage.getItem('venlix-driver-airecs') || 'true'));
  const [language, setLanguage] = useState(() => localStorage.getItem('venlix-driver-language') || 'English');
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  useEffect(() => { localStorage.setItem('venlix-driver-notifications', JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem('venlix-driver-location', JSON.stringify(location)); }, [location]);
  useEffect(() => { localStorage.setItem('venlix-driver-airecs', JSON.stringify(aiRecs)); }, [aiRecs]);
  useEffect(() => { localStorage.setItem('venlix-driver-language', language); }, [language]);

  const ToggleSwitch = ({ checked, onChange }: { checked: boolean, onChange: () => void }) => (
    <button 
      onClick={onChange}
      className={`w-10 h-6 rounded-full p-1 transition-colors duration-300 ease-in-out ${checked ? 'bg-primary' : 'bg-brand-border'}`}
    >
      <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300 ease-in-out ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
    </button>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
      {/* Account Settings */}
      <div className="rounded-2xl border border-brand-border bg-brand-card p-6 shadow-soft h-full flex flex-col">
        <h2 className="text-base font-bold text-brand-text mb-6">Account Settings</h2>
        <div className="space-y-5 flex-1">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Moon size={18} className="text-muted" />
              <span className="text-sm font-semibold text-brand-text">Dark Mode</span>
            </div>
            <ToggleSwitch checked={theme === 'dark'} onChange={toggleTheme} />
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Bell size={18} className="text-muted" />
              <span className="text-sm font-semibold text-brand-text">Push Notifications</span>
            </div>
            <ToggleSwitch checked={notifications} onChange={() => setNotifications(!notifications)} />
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <MapPin size={18} className="text-muted" />
              <span className="text-sm font-semibold text-brand-text">Location Sharing</span>
            </div>
            <ToggleSwitch checked={location} onChange={() => setLocation(!location)} />
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <BrainCircuit size={18} className="text-primary" />
              <span className="text-sm font-semibold text-brand-text">AI Recommendations</span>
            </div>
            <ToggleSwitch checked={aiRecs} onChange={() => setAiRecs(!aiRecs)} />
          </div>
          <div className="flex justify-between items-center pt-2 relative">
            <div className="flex items-center gap-3">
              <Globe size={18} className="text-muted" />
              <span className="text-sm font-semibold text-brand-text">Language</span>
            </div>
            <button 
              onClick={() => setShowLangDropdown(!showLangDropdown)}
              className="text-sm font-bold text-primary flex items-center gap-1 hover:text-primary/80 transition-colors"
            >
              {language} <ChevronRight size={16} className={`transition-transform ${showLangDropdown ? 'rotate-90' : ''}`} />
            </button>

            <AnimatePresence>
              {showLangDropdown && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowLangDropdown(false)} />
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-10 right-0 w-40 bg-brand-card border border-brand-border rounded-xl shadow-premium z-50 p-2"
                  >
                    {['English', 'Spanish', 'French', 'Hindi'].map(lang => (
                      <button 
                        key={lang}
                        onClick={() => { setLanguage(lang); setShowLangDropdown(false); }}
                        className="w-full flex items-center justify-between px-3 py-2 text-sm font-semibold text-brand-text hover:bg-brand-background rounded-lg transition-colors"
                      >
                        {lang}
                        {language === lang && <Check size={14} className="text-primary" />}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="rounded-2xl border border-brand-border bg-brand-card p-6 shadow-soft h-full flex flex-col">
        <h2 className="text-base font-bold text-brand-text mb-6">Security & Privacy</h2>
        <div className="space-y-3 flex-1">
          <button onClick={onChangePasswordModal} className="w-full flex justify-between items-center p-3.5 rounded-xl border border-brand-border bg-brand-background hover:border-primary/50 transition-colors">
             <div className="flex items-center gap-3">
               <Key size={18} className="text-muted" />
               <span className="text-sm font-semibold text-brand-text">Change Password</span>
             </div>
             <ChevronRight size={18} className="text-muted" />
          </button>
          <button className="w-full flex justify-between items-center p-3.5 rounded-xl border border-brand-border bg-brand-background hover:border-primary/50 transition-colors">
             <div className="flex items-center gap-3">
               <ShieldCheck size={18} className="text-muted" />
               <div className="flex flex-col items-start">
                 <span className="text-sm font-semibold text-brand-text">Two-Factor Auth (2FA)</span>
                 <span className="text-[10px] text-success font-bold uppercase tracking-wider">Enabled</span>
               </div>
             </div>
             <ChevronRight size={18} className="text-muted" />
          </button>
          <button className="w-full flex justify-between items-center p-3.5 rounded-xl border border-brand-border bg-brand-background hover:border-primary/50 transition-colors">
             <div className="flex items-center gap-3">
               <Smartphone size={18} className="text-muted" />
               <span className="text-sm font-semibold text-brand-text">Manage Devices</span>
             </div>
             <ChevronRight size={18} className="text-muted" />
          </button>
        </div>
      </div>
    </div>
  );
};
export default ProfileSettings;
