import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Truck,
  MessageSquare,
  TrendingUp,
  User,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { cn } from '@/utils/cn';

interface DriverSidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

type NavItem = {
  name: string;
  path?: string;
  action?: () => void;
  icon: any;
};

export const DriverSidebar = ({ isOpen, setIsOpen }: DriverSidebarProps) => {
  const location = useLocation();

  const sections: { title: string; items: NavItem[] }[] = [
    {
      title: 'DRIVER TOOLS',
      items: [
        { name: 'Dashboard', path: '/driver/dashboard', icon: LayoutDashboard },
        { name: 'My Deliveries', path: '/driver/deliveries', icon: Truck },
        { name: 'AI Assistant', path: '/driver/assistant', icon: MessageSquare },
        { name: 'Performance', path: '/driver/performance', icon: TrendingUp },
        { name: 'Profile', path: '/driver/profile', icon: User },
      ],
    },
    {
      title: 'SETTINGS',
      items: [
        { 
          name: isOpen ? 'Collapse Sidebar' : 'Expand Sidebar', 
          action: () => setIsOpen(!isOpen), 
          icon: isOpen ? PanelLeftClose : PanelLeftOpen 
        },
      ],
    }
  ];

  const renderItem = (item: any, isAction: boolean) => {
    const Icon = item.icon;
    const isActive = !isAction && location.pathname.startsWith(item.path);

    const content = (
      <>
        {isActive && (
          <motion.div
            layoutId="driver-sidebar-active-indicator"
            className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-primary rounded-r-full shadow-[0_0_12px_rgba(124,58,237,0.8)]"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
        <Icon size={20} className={cn("stroke-[2.5] flex-shrink-0 transition-transform duration-200", isActive ? "scale-110" : "group-hover:scale-110")} />
        
        <AnimatePresence>
          {isOpen && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="truncate whitespace-nowrap"
            >
              {item.name}
            </motion.span>
          )}
        </AnimatePresence>

        {!isOpen && (
          <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-brand-card border border-brand-border text-brand-text text-xs font-semibold rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-premium pointer-events-none">
            {item.name}
          </div>
        )}
      </>
    );

    const className = cn(
      'relative group flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200',
      isActive
        ? 'bg-primary/10 text-primary shadow-[inset_0_1px_0_0_rgba(124,58,237,0.2)]'
        : 'text-muted hover:text-brand-text hover:bg-brand-background'
    );

    if (isAction) {
      return (
        <button key={item.name} onClick={item.action} className={cn(className, "w-full")}>
          {content}
        </button>
      );
    }

    return (
      <NavLink key={item.path} to={item.path} className={className}>
        {content}
      </NavLink>
    );
  };

  return (
    <aside
      className={cn(
        'fixed top-0 bottom-0 left-0 z-50 flex flex-col border-r border-brand-border bg-brand-card transition-all duration-300 ease-in-out',
        isOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0 md:w-20'
      )}
    >
      <div className="flex h-16 items-center px-6 border-b border-brand-border shrink-0">
        <NavLink to="/driver/dashboard" className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-secondary text-white shadow-soft">
            <Truck size={18} />
          </div>
          <AnimatePresence>
            {isOpen && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="text-base font-bold text-brand-text tracking-tight whitespace-nowrap"
              >
                Venlix <span className="text-primary font-black">Driver</span>
              </motion.span>
            )}
          </AnimatePresence>
        </NavLink>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden py-6 custom-scrollbar">
        <div className="space-y-8 px-4">
          {sections.map((section, idx) => (
            <div key={idx} className="flex flex-col space-y-1.5">
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-3 mb-1 overflow-hidden"
                  >
                    <span className="text-[10px] font-bold tracking-widest text-muted uppercase">
                      {section.title}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
              {section.items.map((item) => renderItem(item, !!(item as any).action))}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};
export default DriverSidebar;
