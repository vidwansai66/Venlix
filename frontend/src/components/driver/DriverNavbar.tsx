import { useState } from 'react';
import { Bell, Menu, User, LogOut, Sun, Moon, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface DriverNavbarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const DriverNavbar = ({ sidebarOpen, setSidebarOpen }: DriverNavbarProps) => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const notifications = [
    { id: 1, title: 'New delivery assigned', time: '5m ago', type: 'info' },
    { id: 2, title: 'Route updated due to traffic', time: '15m ago', type: 'warning' },
  ];

  const pathParts = location.pathname.split('/').filter(Boolean);
  const currentPage = pathParts.length > 1 
    ? pathParts[pathParts.length - 1].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    : 'Dashboard';

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-brand-border bg-brand-card/80 px-6 backdrop-blur-md shadow-sm transition-colors duration-300">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-brand-border text-muted hover:bg-brand-background md:hidden transition-colors"
        >
          <Menu size={18} />
        </button>

        <div className="hidden md:flex items-center gap-2 text-sm font-semibold tracking-tight text-muted">
          <span className="hover:text-brand-text cursor-pointer transition-colors">Driver</span>
          <ChevronRight size={14} className="text-brand-border" />
          <span className="text-brand-text">{currentPage}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-brand-border text-muted hover:bg-brand-background transition-colors"
        >
          {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        <div className="relative">
          <button
            onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-brand-border text-muted hover:bg-brand-background transition-colors"
          >
            <Bell size={18} className="stroke-[2]" />
            <span className="absolute right-2.5 top-2.5 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
            </span>
          </button>

          <AnimatePresence>
            {showNotificationDropdown && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowNotificationDropdown(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2.5 w-80 rounded-2xl border border-brand-border bg-brand-card p-2 shadow-premium z-50"
                >
                  <div className="px-4 py-2 border-b border-brand-border mb-1">
                    <span className="text-xs font-bold text-brand-text">Driver Alerts</span>
                  </div>
                  <div className="space-y-1">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className="flex flex-col rounded-xl px-4 py-2.5 hover:bg-brand-background cursor-pointer transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-brand-text truncate">
                            {notif.title}
                          </span>
                          <span className="text-[10px] text-muted font-medium shrink-0 ml-2">
                            {notif.time}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className="flex items-center gap-2 focus:outline-none"
          >
            <div className="h-10 w-10 overflow-hidden rounded-xl border border-brand-border bg-brand-background shadow-sm transition-all duration-200 hover:border-primary/50">
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 font-bold text-primary text-sm uppercase">
                DP
              </div>
            </div>
          </button>

          <AnimatePresence>
            {showProfileDropdown && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowProfileDropdown(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2.5 w-56 rounded-2xl border border-brand-border bg-brand-card p-2 shadow-premium z-50"
                >
                  <div className="px-3.5 py-2.5 border-b border-brand-border mb-1">
                    <p className="text-sm font-bold text-brand-text leading-none">Delivery Partner</p>
                    <p className="text-xs text-muted mt-1.5 font-medium truncate">driver@venlix.ai</p>
                  </div>
                  <div className="space-y-0.5">
                    <button 
                      onClick={() => {
                        navigate('/driver/profile');
                        setShowProfileDropdown(false);
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2 text-sm font-semibold text-muted hover:bg-brand-background hover:text-brand-text transition-colors"
                    >
                      <User size={16} />
                      My Profile
                    </button>
                  </div>
                  <div className="border-t border-brand-border mt-1.5 pt-1.5">
                    <button 
                      onClick={() => {
                        toast.success('Logged out successfully');
                        setShowProfileDropdown(false);
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2 text-sm font-semibold text-danger hover:bg-danger/5 transition-colors"
                    >
                      <LogOut size={16} />
                      Log out
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};
export default DriverNavbar;
