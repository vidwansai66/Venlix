import { useState } from 'react';
import { toast } from 'sonner';
import { Bell, Menu, User, Settings, LogOut, Sun, Moon, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { useLocation } from 'react-router-dom';
import { useDemoContext } from '@/contexts/DemoContext';
import { Play } from 'lucide-react';

interface NavbarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const Navbar = ({ sidebarOpen, setSidebarOpen }: NavbarProps) => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const { isDemoMode, setIsDemoMode } = useDemoContext();

  const notifications = [
    { id: 1, title: 'Delivery #4928 delayed', time: '10m ago', type: 'warning' },
    { id: 2, title: 'AI Route Optimizer completed', time: '1h ago', type: 'success' },
    { id: 3, title: 'System health report ready', time: '3h ago', type: 'info' },
  ];

  // Derive breadcrumb from location
  const pathParts = location.pathname.split('/').filter(Boolean);
  const currentPage = pathParts.length > 0 
    ? pathParts[pathParts.length - 1].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    : 'Landing';

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-brand-border bg-brand-card/80 px-6 backdrop-blur-md shadow-sm transition-colors duration-300">
      {/* Left side: Hamburger Trigger & Page Context */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-brand-border text-muted hover:bg-brand-background md:hidden transition-colors"
        >
          <Menu size={18} />
        </button>

        {/* Dynamic Breadcrumbs */}
        <div className="hidden md:flex items-center gap-2 text-sm font-semibold tracking-tight text-muted">
          <span className="hover:text-brand-text cursor-pointer transition-colors">Dashboard</span>
          {currentPage !== 'Dashboard' && (
            <>
              <ChevronRight size={14} className="text-brand-border" />
              <span className="text-brand-text">{currentPage}</span>
            </>
          )}
        </div>
      </div>



      {/* Right side: Theme, Notifications, Profile */}
      <div className="flex items-center gap-4">
        {/* Demo Toggle */}
        <button
          onClick={() => setIsDemoMode(!isDemoMode)}
          className={`relative flex h-10 w-10 items-center justify-center rounded-xl border transition-colors ${
            isDemoMode 
              ? 'border-primary bg-primary/10 text-primary' 
              : 'border-brand-border text-muted hover:bg-brand-background'
          }`}
          title="Toggle Demo Mode"
        >
          <Play size={18} fill={isDemoMode ? 'currentColor' : 'none'} />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-brand-border text-muted hover:bg-brand-background transition-colors"
        >
          {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {/* Notification Icon */}
        <div className="relative">
          <button
            onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-brand-border text-muted hover:bg-brand-background transition-colors"
          >
            <Bell size={18} className="stroke-[2]" />
            <span className="absolute right-2.5 top-2.5 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-danger opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-danger"></span>
            </span>
          </button>

          {/* Notifications Dropdown */}
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
                    <span className="text-xs font-bold text-brand-text">Notifications</span>
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
                  <div className="px-4 py-2 border-t border-brand-border mt-1 text-center">
                    <button className="text-xs font-semibold text-primary hover:underline" onClick={() => toast.success('All marked as read')}>
                      Mark all as read
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className="flex items-center gap-2 focus:outline-none"
          >
            <div className="h-10 w-10 overflow-hidden rounded-xl border border-brand-border bg-brand-background shadow-sm transition-all duration-200 hover:border-primary/50">
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 font-bold text-primary text-sm uppercase">
                JD
              </div>
            </div>
          </button>

          {/* Profile Menu Dropdown */}
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
                    <p className="text-sm font-bold text-brand-text leading-none">John Doe</p>
                    <p className="text-xs text-muted mt-1.5 font-medium truncate">john.doe@venlix.ai</p>
                  </div>
                  <div className="space-y-0.5">
                    <button className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2 text-sm font-semibold text-muted hover:bg-brand-background hover:text-brand-text transition-colors" onClick={() => toast.success('Action simulated successfully')}>
                      <User size={16} />
                      Profile Settings
                    </button>
                    <button className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2 text-sm font-semibold text-muted hover:bg-brand-background hover:text-brand-text transition-colors" onClick={() => toast.success('Action simulated successfully')}>
                      <Settings size={16} />
                      System Admin
                    </button>
                  </div>
                  <div className="border-t border-brand-border mt-1.5 pt-1.5">
                    <button className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2 text-sm font-semibold text-danger hover:bg-danger/5 transition-colors" onClick={() => toast.success('Logged out successfully')}>
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
export default Navbar;
