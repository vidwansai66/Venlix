import { lazy, Suspense, useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  Package,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Brain,
  Timer,
  Fuel,
  IndianRupee,
  RefreshCw,
  Clock,
  ChevronRight,
  Database
} from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Loading } from '@/components/ui/Loading';
import { DashboardAPI } from '@/services/apiClient';
import { useLiveDeliveries } from '@/hooks/useLiveDeliveries';
import { generateSimulatedOrder } from '@/utils/orderSimulator';
import apiClient from '@/services/apiClient';

// Lazy load the charts for optimal load times
const MissionControlCharts = lazy(() => import('@/components/dashboard/MissionControlCharts'));

export const DashboardPage = () => {
  const { stats, deliveries, analytics, refresh } = useLiveDeliveries();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleReset = async () => {
    setIsRefreshing(true);
    try {
      await DashboardAPI.resetDemo();
      toast.success('Database reset successfully!');
      await refresh();
    } catch (err) {
      toast.error('Failed to reset database.');
    } finally {
      setIsRefreshing(false);
    }
  };

  const runSimulation = async () => {
    if (isSimulating) return;
    
    setIsSimulating(true);

    toast.info("🚀 Starting Live Order Simulation...", { duration: 3000 });

    try {
      for (let i = 0; i < 10; i++) {
        // Check if component unmounted or simulation stopped (basic check)
        if (!isSimulating && i > 0) {
           // We can't strictly stop it easily without a ref, but let's assume it runs to completion for now
        }

        const payload = generateSimulatedOrder();
        
        // Random delay between 300ms - 700ms
        const delay = Math.floor(Math.random() * (700 - 300 + 1)) + 300;
        await new Promise(r => setTimeout(r, delay));
        
        // Toast notifications to simulate stages
        const toastId = toast.loading(`Order ${i+1}/10: Incoming Delivery...`);
        
        try {
          await apiClient.post('/predict', payload);
          toast.success(`Order ${i+1}: Risk Evaluated & Saved Successfully`, { id: toastId, duration: 1500 });
          await refresh(); // Live update the dashboard
        } catch (err) {
          toast.error(`Order ${i+1}: Failed to predict`, { id: toastId, duration: 2000 });
        }
      }
      toast.success("🏁 Simulation Complete! 10 orders generated.", { duration: 4000 });
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-10 rounded-2xl transition-all duration-700">
      
      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-brand-text tracking-tight">
            Mission Control
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Predicting and Preventing Delivery Failures Before They Happen
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Button variant="primary" size="sm" onClick={runSimulation} disabled={isSimulating} isLoading={isSimulating}>
            🚀 Generate Demo Orders
          </Button>
          <Button variant="outline" size="sm" leftIcon={<Database size={14} />} onClick={handleReset} disabled={isSimulating} isLoading={isRefreshing && !isSimulating}>
            🗑 Reset Demo
          </Button>
          <Button variant="outline" size="sm" leftIcon={<RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />} onClick={refresh} disabled={isSimulating}>
            Sync Realtime
          </Button>
        </div>
      </div>

      {/* TOP KPI SECTION */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          title="Today's Deliveries"
          value={stats.todays_deliveries.toString()}
          icon={Package}
          variant="primary"
        />
        <StatCard
          title="High Risk Deliveries"
          value={stats.high_risk_deliveries.toString()}
          description="Risk > 50%"
          icon={AlertTriangle}
          variant="danger"
        />
        <StatCard
          title="AI Prevented Failures"
          value={stats.ai_prevented_failures.toString()}
          description="Autonomously Resolved"
          icon={Brain}
          variant="success"
        />
        <StatCard
          title="Success Rate"
          value={`${stats.success_rate}%`}
          description="Predicted Success After Action"
          icon={CheckCircle2}
          variant="success"
        />
        <StatCard
          title="Average Risk Score"
          value={`${stats.average_risk_score}%`}
          description="Across All Deliveries"
          icon={TrendingUp}
          variant="warning"
        />
        <StatCard
          title="Estimated Cost Saved"
          value={`₹${stats.cost_saved}`}
          icon={IndianRupee}
          variant="success"
        />
        <StatCard
          title="Fuel Saved"
          value={`${stats.fuel_saved} L`}
          icon={Fuel}
          variant="primary"
        />
        <StatCard
          title="Driver Hours Saved"
          value={`${stats.time_saved_hours} h`}
          icon={Timer}
          variant="primary"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN - Main Content (Spans 2 columns on xl) */}
        <div className="xl:col-span-3 space-y-6">
          
          {/* CHARTS */}
          <Suspense fallback={
            <div className="h-64 flex items-center justify-center bg-brand-card/30 rounded-2xl border border-brand-border">
              <Loading variant="spinner" text="Loading analytics..." />
            </div>
          }>
            <MissionControlCharts analytics={analytics} />
          </Suspense>

          {/* RECENT DELIVERIES HERO Table */}
          <Card className="hover:border-slate-200/80 transition-all duration-300 overflow-hidden shadow-premium">
            <CardHeader className="border-b border-slate-50/10 dark:border-white/5 pb-4 bg-gradient-to-r from-brand-card to-brand-background">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Clock className="text-primary" size={22} />
                    Recent AI Deliveries
                  </CardTitle>
                  <CardDescription>Latest prediction evaluations</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                {deliveries.length === 0 ? (
                  <div className="p-10 text-center text-slate-500 font-medium">No deliveries found. Make a prediction!</div>
                ) : (
                  <Table>
                    <TableHeader className="bg-brand-background/50">
                      <TableRow>
                        <TableHead className="text-xs font-bold py-3 whitespace-nowrap">Time</TableHead>
                        <TableHead className="text-xs font-bold py-3 whitespace-nowrap">Risk / Conf</TableHead>
                        <TableHead className="text-xs font-bold py-3 whitespace-nowrap">Weather & Traffic</TableHead>
                        <TableHead className="text-xs font-bold py-3 whitespace-nowrap">Driver Status</TableHead>
                        <TableHead className="text-xs font-bold py-3 whitespace-nowrap">Risk Level</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {deliveries.map((delivery, idx) => {
                        const dateStr = new Date(delivery.created_at).toISOString().slice(0, 10).replace(/-/g, '');
                        const orderId = `VEN-${dateStr}-${String(delivery.id).padStart(4, '0')}`;
                        
                        return (
                        <TableRow key={idx} className="hover:bg-brand-background transition-colors">
                          <TableCell className="font-bold text-brand-text whitespace-nowrap py-3">
                            <div className="flex flex-col">
                              <span className="text-xs text-brand-text">{orderId}</span>
                              <span className="text-[10px] text-slate-500">{new Date(delivery.created_at).toLocaleTimeString()}</span>
                            </div>
                          </TableCell>
                          <TableCell className="py-3">
                            <div className="flex flex-col gap-1.5 w-24">
                              <div className="flex items-center justify-between text-xs font-bold">
                                <span className={delivery.risk_score > 74 ? 'text-danger' : delivery.risk_score > 49 ? 'text-warning' : 'text-success'}>
                                  {delivery.risk_score}% Risk
                                </span>
                              </div>
                              <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                <div className={`h-1.5 rounded-full ${delivery.risk_score > 74 ? 'bg-danger' : delivery.risk_score > 49 ? 'bg-warning' : 'bg-success'}`} style={{ width: `${delivery.risk_score}%` }}></div>
                              </div>
                              <span className="text-[10px] text-muted font-medium">{delivery.confidence}% Conf</span>
                            </div>
                          </TableCell>
                          <TableCell className="py-3">
                            <div className="flex flex-col">
                              <span className="text-sm font-semibold text-brand-text">{delivery.weather}</span>
                              <span className="text-xs text-muted font-medium">{delivery.traffic} Traffic</span>
                            </div>
                          </TableCell>
                          <TableCell className="py-3">
                            <span className="text-sm font-semibold text-brand-text bg-brand-background px-2.5 py-1 rounded-md border border-brand-border">
                              {delivery.driver_status}
                            </span>
                          </TableCell>
                          <TableCell className="py-3">
                            <Badge variant={delivery.risk_level === 'Critical' ? 'danger' : delivery.risk_level === 'High' ? 'danger' : delivery.risk_level === 'Medium' ? 'warning' : 'success'} pill className="text-xs">
                              {delivery.risk_level}
                            </Badge>
                          </TableCell>
                        </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
