export const Footer = () => {
  return (
    <footer className="w-full bg-white border-t border-slate-200/80 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-slate-400">
      {/* Copyright */}
      <div>
        &copy; {new Date().getFullYear()} Venlix AI Technologies. All rights reserved.
      </div>
      
      {/* System info & Heartbeat */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-success"></span>
          </span>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            API System Operational
          </span>
        </div>
        <div className="border-l border-slate-200 h-3" />
        <div className="font-semibold text-slate-500">
          v1.0.0-beta
        </div>
      </div>
    </footer>
  );
};
export default Footer;
