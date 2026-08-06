import { Search, Filter, ArrowUpDown } from 'lucide-react';

interface DeliveriesFilterBarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  sortBy: string;
  setSortBy: (val: string) => void;
}

export const DeliveriesFilterBar = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  sortBy,
  setSortBy
}: DeliveriesFilterBarProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6 p-4 rounded-2xl border border-brand-border bg-brand-card shadow-soft">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
        <input
          type="text"
          placeholder="Search by Delivery ID or Customer Name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-10 w-full rounded-xl border border-brand-border bg-brand-background pl-10 pr-4 text-sm text-brand-text outline-none transition-all duration-200 placeholder:text-muted focus:border-primary focus:ring-1 focus:ring-primary/50"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 shrink-0">
        {/* Status Filter */}
        <div className="relative flex items-center min-w-[160px]">
          <Filter className="absolute left-3.5 h-4 w-4 text-muted pointer-events-none" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 w-full appearance-none rounded-xl border border-brand-border bg-brand-background pl-10 pr-8 text-sm font-semibold text-brand-text outline-none transition-all duration-200 focus:border-primary focus:ring-1 focus:ring-primary/50 cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Assigned">Assigned</option>
            <option value="Picked Up">Picked Up</option>
            <option value="On Route">On Route</option>
            <option value="Delivered">Delivered</option>
            <option value="Failed">Failed</option>
          </select>
          <div className="absolute right-3.5 pointer-events-none text-muted">
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* Sort Dropdown */}
        <div className="relative flex items-center min-w-[180px]">
          <ArrowUpDown className="absolute left-3.5 h-4 w-4 text-muted pointer-events-none" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="h-10 w-full appearance-none rounded-xl border border-brand-border bg-brand-background pl-10 pr-8 text-sm font-semibold text-brand-text outline-none transition-all duration-200 focus:border-primary focus:ring-1 focus:ring-primary/50 cursor-pointer"
          >
            <option value="Nearest First">Nearest First</option>
            <option value="Highest Priority">Highest Priority</option>
            <option value="Latest Assigned">Latest Assigned</option>
          </select>
          <div className="absolute right-3.5 pointer-events-none text-muted">
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DeliveriesFilterBar;
