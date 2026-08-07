import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  MapPin,
  Clock,
  Activity,
  AlertTriangle,
  CheckCircle,
  Brain,
  Database,
  Cloud
} from 'lucide-react';
import apiClient from '@/services/apiClient';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { StatCard } from '@/components/ui/StatCard';
import { Error as ErrorState } from '@/components/ui/Error';
import type { DeliveryItem } from '@/hooks/useDashboardData'; // Reuse the schema we defined earlier

// Small inline circular progress for the table
const MiniProgress = ({ value, isFailed }: { value: number, isFailed: boolean }) => {
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden relative">
        <div 
          className={`absolute left-0 top-0 bottom-0 rounded-full ${isFailed ? 'bg-danger' : 'bg-success'}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-[10px] font-bold text-slate-500">{Math.round(value)}%</span>
    </div>
  );
};

export const DeliveriesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [deliveries, setDeliveries] = useState<DeliveryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters State
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [filterPrediction, setFilterPrediction] = useState('All');
  const [sortBy, setSortBy] = useState('Latest');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Row Expansion State
  const [expandedRowId, setExpandedRowId] = useState<number | null>(null);

  // Fetch logic
  const fetchDeliveries = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiClient.get<DeliveryItem[]>('/deliveries/');
      setDeliveries(res.data || []);
    } catch (err: any) {
      console.error('Error fetching deliveries:', err);
      setError(err.response?.data?.detail || err.message || 'Failed to fetch deliveries database.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDeliveries();
  }, [fetchDeliveries]);

  useEffect(() => {
    const q = searchParams.get('search');
    if (q !== null && q !== searchTerm) {
      setSearchTerm(q);
      setCurrentPage(1);
    }
  }, [searchParams]);

  // Reset Filters & Pagination
  const resetFilters = () => {
    setSearchTerm('');
    setSearchParams({});
    setFilterPrediction('All');
    setSortBy('Latest');
    setCurrentPage(1);
    setExpandedRowId(null);
  };

  // Derive Statistics
  const stats = useMemo(() => {
    if (!deliveries.length) return { total: 0, success: 0, failed: 0, avgConf: 0 };
    const successCount = deliveries.filter(d => d.prediction !== 'Delivery Failure').length;
    const failedCount = deliveries.length - successCount;
    const confSum = deliveries.reduce((acc, curr) => {
      return acc + (curr.confidence <= 1 ? curr.confidence * 100 : curr.confidence);
    }, 0);
    return {
      total: deliveries.length,
      success: successCount,
      failed: failedCount,
      avgConf: confSum / deliveries.length
    };
  }, [deliveries]);

  // Filter & Sort Logic
  const filteredAndSorted = useMemo(() => {
    let result = [...deliveries];

    // Search by ID
    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      result = result.filter(d => {
        const dateStr = new Date(d.created_at).toISOString().slice(0, 10).replace(/-/g, '');
        const orderId = `ven-${dateStr}-${String(d.id).padStart(4, '0')}`;
        return orderId.includes(term) || d.id.toString().includes(term);
      });
    }

    // Filter Prediction
    if (filterPrediction === 'Delivery Successful') {
      result = result.filter(d => d.prediction !== 'Delivery Failure');
    } else if (filterPrediction === 'Delivery Failure') {
      result = result.filter(d => d.prediction === 'Delivery Failure');
    }

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'Oldest': return a.id - b.id;
        case 'Highest Confidence': return b.confidence - a.confidence;
        case 'Lowest Confidence': return a.confidence - b.confidence;
        case 'Latest':
        default:
          return b.id - a.id;
      }
    });

    return result;
  }, [deliveries, searchTerm, filterPrediction, sortBy]);

  // Pagination Logic
  const totalPages = Math.max(1, Math.ceil(filteredAndSorted.length / itemsPerPage));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSorted.slice(start, start + itemsPerPage);
  }, [filteredAndSorted, currentPage]);

  // Ensure current page is valid when filters change
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  // Auto-expand if there's exactly 1 search result
  useEffect(() => {
    if (searchTerm.trim() && filteredAndSorted.length === 1 && !isLoading) {
      setExpandedRowId(filteredAndSorted[0].id);
    }
  }, [filteredAndSorted.length, searchTerm, isLoading]);

  if (error && !isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <ErrorState title="History Synchronization Failed" message={error} onRetry={fetchDeliveries} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      
      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-brand-text tracking-tight">Delivery History</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Monitor all AI predictions and delivery records.</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchDeliveries} isLoading={isLoading} leftIcon={<RefreshCw size={14} />}>
          Sync Database
        </Button>
      </div>

      {/* Statistics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Deliveries" value={isLoading ? '...' : stats.total.toLocaleString()} description="All dispatch records" icon={Database} isLoading={isLoading} variant="primary" />
        <StatCard title="Successful Deliveries" value={isLoading ? '...' : stats.success.toLocaleString()} description="No predicted delays" icon={CheckCircle} isLoading={isLoading} variant="success" />
        <StatCard title="Failed Deliveries" value={isLoading ? '...' : stats.failed.toLocaleString()} description="Predicted severe delays" icon={AlertTriangle} isLoading={isLoading} variant="danger" />
        <StatCard title="Average Confidence" value={isLoading ? '...' : `${stats.avgConf.toFixed(1)}%`} description="Model certainty average" icon={Brain} isLoading={isLoading} variant="warning" />
      </div>

      {/* Main Table Card */}
      <Card className="shadow-premium border-brand-border bg-brand-card p-0 overflow-hidden">
        
        {/* Filters Header */}
        <CardHeader className="border-b border-brand-border p-5 bg-brand-background/50">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base font-bold">Fleet Telemetry Logs</CardTitle>
              <CardDescription className="text-xs">Enterprise logistics database.</CardDescription>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input
                  type="text"
                  placeholder="Search Delivery ID..."
                  value={searchTerm}
                  onChange={(e) => { 
                    setSearchTerm(e.target.value); 
                    setSearchParams(e.target.value ? { search: e.target.value } : {});
                    setCurrentPage(1); 
                  }}
                  className="h-9 w-40 sm:w-56 rounded-xl border border-brand-border pl-9 pr-3 text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all bg-brand-card text-brand-text"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <Filter size={14} className="text-slate-400 hidden sm:block" />
                <select
                  value={filterPrediction}
                  onChange={(e) => { setFilterPrediction(e.target.value); setCurrentPage(1); }}
                  className="h-9 rounded-xl border border-brand-border px-3 py-1 text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 bg-brand-card text-brand-text"
                >
                  <option value="All">All Predictions</option>
                  <option value="Delivery Successful">Successful Deliveries</option>
                  <option value="Delivery Failure">Failed Deliveries</option>
                </select>
              </div>

              {/* Sort Filter */}
              <select
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
                className="h-9 rounded-xl border border-brand-border px-3 py-1 text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 bg-brand-card text-brand-text"
              >
                <option value="Latest">Latest First</option>
                <option value="Oldest">Oldest First</option>
                <option value="Highest Confidence">Highest Confidence</option>
                <option value="Lowest Confidence">Lowest Confidence</option>
              </select>

              <Button variant="ghost" size="sm" onClick={resetFilters} className="h-9 text-xs font-semibold px-3 text-slate-500 hover:text-slate-800">
                Clear
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Table Content */}
        <CardContent className="p-0 overflow-hidden">
          {isLoading ? (
            <div className="p-6 space-y-4 animate-pulse">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-12 bg-slate-100 rounded-lg w-full" />
              ))}
            </div>
          ) : filteredAndSorted.length === 0 ? (
            <div className="p-16 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-4 shadow-inner">
                <Search size={32} />
              </div>
              <h3 className="text-base font-bold text-slate-800">No deliveries available.</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                Try clearing your filters or check back after completing a prediction.
              </p>
              <Button variant="outline" size="sm" onClick={resetFilters} className="mt-4">Reset Filters</Button>
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/80">
                    <TableHead className="font-semibold text-slate-600 text-xs py-3 w-[120px]">ID</TableHead>
                    <TableHead className="font-semibold text-slate-600 text-xs py-3">Prediction</TableHead>
                    <TableHead className="font-semibold text-slate-600 text-xs py-3">Confidence</TableHead>
                    <TableHead className="font-semibold text-slate-600 text-xs py-3">Risk</TableHead>
                    <TableHead className="font-semibold text-slate-600 text-xs py-3">Agent</TableHead>
                    <TableHead className="font-semibold text-slate-600 text-xs py-3">Routing</TableHead>
                    <TableHead className="font-semibold text-slate-600 text-xs py-3 hidden xl:table-cell">Value</TableHead>
                    <TableHead className="font-semibold text-slate-600 text-xs py-3 hidden xl:table-cell">Time</TableHead>
                    <TableHead className="font-semibold text-slate-600 text-xs py-3 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.map((row) => {
                    const isFailed = row.prediction === 'Delivery Failure';
                    const confVal = row.confidence <= 1 ? row.confidence * 100 : row.confidence;
                    const isExpanded = expandedRowId === row.id;

                    const dateStr = new Date(row.created_at).toISOString().slice(0, 10).replace(/-/g, '');
                    const orderId = `VEN-${dateStr}-${String(row.id).padStart(4, '0')}`;

                    return (
                      <React.Fragment key={row.id}>
                        <TableRow className={`hover:bg-brand-background/60 transition-colors group cursor-pointer ${isExpanded ? 'bg-brand-background/40' : ''}`} onClick={() => setExpandedRowId(isExpanded ? null : row.id)}>
                          
                          <TableCell className="font-bold text-brand-text text-xs py-3">
                            <div className="flex flex-col">
                              <span>{orderId}</span>
                              <span className="text-[10px] text-slate-400 font-normal mt-0.5">
                                {new Date(row.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </TableCell>
                          
                          <TableCell className="py-3">
                            <Badge variant={isFailed ? 'danger' : 'success'}>
                              {isFailed ? 'Failure' : 'Successful'}
                            </Badge>
                          </TableCell>
                          
                          <TableCell className="py-3">
                            <MiniProgress value={confVal} isFailed={isFailed} />
                          </TableCell>
                          
                          <TableCell className="py-3">
                            <Badge variant={row.risk_score > 0.6 ? 'danger' : row.risk_score > 0.35 ? 'warning' : 'success'} pill>
                              {row.risk_score > 0.6 ? 'High' : row.risk_score > 0.35 ? 'Medium' : 'Low'}
                            </Badge>
                          </TableCell>

                          <TableCell className="py-3">
                            <div className="flex flex-col">
                              <span className="text-xs font-semibold text-slate-700">★ {row.Agent_Rating?.toFixed(1) || 'N/A'}</span>
                              <span className="text-[10px] text-slate-500">{row.Agent_Age ? `${row.Agent_Age} yrs` : 'Unknown'}</span>
                            </div>
                          </TableCell>

                          <TableCell className="py-3">
                            <div className="flex flex-col">
                              <span className="text-xs font-semibold text-slate-700">{row.distance_km?.toFixed(1) || 'N/A'} km</span>
                              <span className="text-[10px] text-slate-500">PIN: {row.pin_code || 'N/A'}</span>
                            </div>
                          </TableCell>

                          <TableCell className="py-3 hidden xl:table-cell">
                            <span className="text-xs font-bold text-slate-700">₹{row.order_value || '0'}</span>
                          </TableCell>

                          <TableCell className="py-3 hidden xl:table-cell">
                            <span className="text-xs font-semibold text-slate-700">{row.Delivery_Time || 'N/A'} min</span>
                          </TableCell>

                          <TableCell className="text-right py-3 pr-4">
                            <Button variant="ghost" size="sm" className={`h-8 px-2 transition-transform ${isExpanded ? 'bg-slate-200' : ''}`} onClick={(e) => { e.stopPropagation(); setExpandedRowId(isExpanded ? null : row.id); }}>
                              {isExpanded ? <ChevronUp size={16} className="text-slate-600" /> : <ChevronDown size={16} className="text-slate-400 group-hover:text-slate-700" />}
                            </Button>
                          </TableCell>

                        </TableRow>

                        {/* Expandable Details Row */}
                        <AnimatePresence>
                          {isExpanded && (
                            <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                              <TableCell colSpan={9} className="p-0 border-b border-slate-100">
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="overflow-hidden"
                                >
                                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg-brand-card mx-4 my-3 rounded-xl border border-brand-border shadow-sm relative">
                                    
                                    <div className="absolute top-0 left-0 w-1 h-full bg-slate-200 dark:bg-slate-700 rounded-l-xl" />

                                    {/* Location Info */}
                                    <div className="space-y-3">
                                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><MapPin size={12}/> Geolocation Profile</h4>
                                      <div className="space-y-1.5">
                                        <div className="flex justify-between text-xs"><span className="text-slate-500">Store Origin</span> <span className="font-semibold text-slate-700">{row.Store_Latitude?.toFixed(4)}, {row.Store_Longitude?.toFixed(4)}</span></div>
                                        <div className="flex justify-between text-xs"><span className="text-slate-500">Drop Destination</span> <span className="font-semibold text-slate-700">{row.Drop_Latitude?.toFixed(4)}, {row.Drop_Longitude?.toFixed(4)}</span></div>
                                        <div className="flex justify-between text-xs"><span className="text-slate-500">Topological Zone</span> <span className="font-semibold text-slate-700">{row.Area === 1 ? 'Urban' : row.Area === 2 ? 'Suburban' : 'Rural'}</span></div>
                                      </div>
                                    </div>

                                    {/* Env Info */}
                                    <div className="space-y-3">
                                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Cloud size={12}/> Route Environment</h4>
                                      <div className="space-y-1.5">
                                        <div className="flex justify-between text-xs"><span className="text-slate-500">Weather Code</span> <span className="font-semibold text-slate-700">{row.Weather || 1}/5</span></div>
                                        <div className="flex justify-between text-xs"><span className="text-slate-500">Traffic Congestion</span> <span className="font-semibold text-slate-700">{row.Traffic || 2}/4</span></div>
                                        <div className="flex justify-between text-xs"><span className="text-slate-500">Vehicle Mode</span> <span className="font-semibold text-slate-700">{row.Vehicle === 1 ? 'Motorcycle' : row.Vehicle === 2 ? 'Scooter' : 'Car'}</span></div>
                                      </div>
                                    </div>

                                    {/* Historical Context */}
                                    <div className="space-y-3">
                                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Activity size={12}/> Driver History</h4>
                                      <div className="space-y-1.5">
                                        <div className="flex justify-between text-xs"><span className="text-slate-500">On-Time Historic</span> <span className="font-semibold text-slate-700">{(row.driver_on_time_rate ?? 0) * 100}%</span></div>
                                        <div className="flex justify-between text-xs"><span className="text-slate-500">Address Failures</span> <span className="font-semibold text-slate-700">{(row.address_failure_history_rate ?? 0) * 100}%</span></div>
                                        <div className="flex justify-between text-xs"><span className="text-slate-500">Customer Absent</span> <span className="font-semibold text-slate-700">{(row.customer_unavailability_history ?? 0) * 100}%</span></div>
                                      </div>
                                    </div>

                                    {/* Schedule Info */}
                                    <div className="space-y-3">
                                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Clock size={12}/> Dispatch Schedule</h4>
                                      <div className="space-y-1.5">
                                        <div className="flex justify-between text-xs"><span className="text-slate-500">Target Time</span> <span className="font-semibold text-slate-700">{row.Delivery_Time} min</span></div>
                                        <div className="flex justify-between text-xs"><span className="text-slate-500">Slot Buffer</span> <span className="font-semibold text-slate-700">{row.slot_width_minutes} min</span></div>
                                        <div className="flex justify-between text-xs"><span className="text-slate-500">Store Delay</span> <span className="font-semibold text-slate-700">{row.pickup_delay_minutes?.toFixed(1)} min</span></div>
                                      </div>
                                    </div>

                                  </div>
                                </motion.div>
                              </TableCell>
                            </TableRow>
                          )}
                        </AnimatePresence>
                      </React.Fragment>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination Controls */}
          {filteredAndSorted.length > 0 && (
            <div className="px-5 py-4 border-t border-brand-border flex items-center justify-between bg-brand-card">
              <p className="text-xs text-slate-500 font-semibold">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSorted.length)} of {filteredAndSorted.length} entries
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-8 px-3 text-xs" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                  Previous
                </Button>
                <div className="px-3 text-xs font-bold text-slate-700">
                  {currentPage} / {totalPages}
                </div>
                <Button variant="outline" size="sm" className="h-8 px-3 text-xs" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
                  Next
                </Button>
              </div>
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  );
};

export default DeliveriesPage;
