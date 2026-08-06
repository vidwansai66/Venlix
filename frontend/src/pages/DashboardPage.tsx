import { useState, lazy, Suspense } from 'react';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Brain,
  Server,
  Database,
  Cpu,
  RefreshCw,
  Clock
} from 'lucide-react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { StatCard } from '@/components/ui/StatCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Loading } from '@/components/ui/Loading';
import { Error as ErrorState } from '@/components/ui/Error';

// Lazy load the Recharts charts for optimal load times
const DashboardCharts = lazy(() => import('@/components/dashboard/DashboardCharts'));

export const DashboardPage = () => {
  const { report, deliveries, health, isLoading, error, refetch } = useDashboardData();
  const [activeChartTab, setActiveChartTab] = useState<'confidence' | 'pie' | 'bar'>('confidence');

  // If there's an error and we are not in loading state, show the beautiful Error component
  if (error && !isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <ErrorState
          title="Telemetry Synchronization Failed"
          message={error}
          onRetry={refetch}
        />
      </div>
    );
  }

  // Extract statistics values (with fallbacks for skeletons/empty states)
  const totalPredictions = report?.total_predictions ?? 0;
  const deliverySuccess = report?.delivery_success ?? 0;
  const deliveryFailures = report?.delivery_failures ?? 0;
  const failureRate = report?.failure_rate ?? '0%';
  
  // Format average confidence for display
  const rawConfidence = report?.average_confidence ?? 0;
  const displayConfidence = rawConfidence > 0 
    ? `${(rawConfidence <= 1 ? rawConfidence * 100 : rawConfidence).toFixed(1)}%` 
    : '0%';

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-brand-text tracking-tight">
            Logistics Overview
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Real-time fleet operations, route predictions, and system health status.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refetch} 
            isLoading={isLoading}
            leftIcon={<RefreshCw size={14} />}
          >
            Sync Data
          </Button>
          <Button variant="primary" size="sm" leftIcon={<Brain size={14} />}>
            Model Settings
          </Button>
        </div>
      </div>

      {/* Stats Cards Row (5 Columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard
          title="Total Predictions"
          value={isLoading ? '...' : totalPredictions.toLocaleString()}
          description="Inference operations count"
          icon={Activity}
          isLoading={isLoading}
          variant="primary"
        />
        <StatCard
          title="Successful Deliveries"
          value={isLoading ? '...' : deliverySuccess.toLocaleString()}
          description="On-time ETAs matched"
          icon={CheckCircle2}
          isLoading={isLoading}
          variant="success"
        />
        <StatCard
          title="Predicted Failures"
          value={isLoading ? '...' : deliveryFailures.toLocaleString()}
          description="Potential bottlenecks detected"
          icon={AlertTriangle}
          isLoading={isLoading}
          variant="danger"
        />
        <StatCard
          title="AI Failure Rate"
          value={isLoading ? '...' : failureRate}
          description="Systemic delay ratio"
          icon={TrendingUp}
          isLoading={isLoading}
          variant="warning"
        />
        <StatCard
          title="Avg. Prediction Confidence"
          value={isLoading ? '...' : displayConfidence}
          description="Statistical confidence gap"
          icon={Brain}
          isLoading={isLoading}
          variant="default"
        />
      </div>

      {/* Grid Layout Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Core Logistics Chart Slot (lg:col-span-2) */}
        <Card className="lg:col-span-2 hover:border-slate-200/80 transition-all duration-300">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-50 pb-4">
            <div>
              <CardTitle>Fleet Output Analytics</CardTitle>
              <CardDescription>Visual stats displaying delivery performance and AI prediction gaps.</CardDescription>
            </div>
            
            {/* Inline Tabs Switcher */}
            <div className="flex items-center gap-1 bg-brand-background p-1 rounded-xl shrink-0 self-start sm:self-center border border-brand-border">
              <button
                onClick={() => setActiveChartTab('confidence')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeChartTab === 'confidence'
                    ? 'bg-brand-card text-brand-text shadow-sm border border-brand-border'
                    : 'text-slate-500 hover:text-brand-text'
                }`}
              >
                Confidence Trend
              </button>
              <button
                onClick={() => setActiveChartTab('pie')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeChartTab === 'pie'
                    ? 'bg-brand-card text-brand-text shadow-sm border border-brand-border'
                    : 'text-slate-500 hover:text-brand-text'
                }`}
              >
                Success Ratio
              </button>
              <button
                onClick={() => setActiveChartTab('bar')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeChartTab === 'bar'
                    ? 'bg-brand-card text-brand-text shadow-sm border border-brand-border'
                    : 'text-slate-500 hover:text-brand-text'
                }`}
              >
                Volume Summary
              </button>
            </div>
          </CardHeader>
          
          <CardContent className="pt-6">
            {isLoading ? (
              <div className="h-64 flex items-center justify-center">
                <Loading variant="spinner" text="Compiling telemetry plots..." />
              </div>
            ) : (
              <Suspense fallback={
                <div className="h-64 flex items-center justify-center">
                  <Loading variant="spinner" text="Plotting graphics..." />
                </div>
              }>
                <DashboardCharts
                  report={report}
                  deliveries={deliveries}
                  activeTab={activeChartTab}
                />
              </Suspense>
            )}
          </CardContent>
        </Card>

        {/* Right Column Layout (Health Widget & Short Activity Feed/Telemetry Status) */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          
          {/* Health Diagnostics Widget */}
          <Card className="hover:border-slate-200/80 transition-all duration-300">
            <CardHeader className="border-b border-slate-50 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold">System Status</CardTitle>
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${
                      health?.status === 'Healthy' ? 'bg-success' : 'bg-danger'
                    }`}></span>
                    <span className={`relative inline-flex h-2 w-2 rounded-full ${
                      health?.status === 'Healthy' ? 'bg-success' : 'bg-danger'
                    }`}></span>
                  </span>
                  <Badge variant={health?.status === 'Healthy' ? 'success' : 'danger'}>
                    {isLoading ? 'Loading' : health?.status || 'Offline'}
                  </Badge>
                </div>
              </div>
              <CardDescription>Real-time microservice backend connections.</CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              {isLoading ? (
                <div className="space-y-2.5 animate-pulse">
                  <div className="h-8 bg-slate-100 rounded-lg w-full" />
                  <div className="h-8 bg-slate-100 rounded-lg w-full" />
                  <div className="h-8 bg-slate-100 rounded-lg w-full" />
                </div>
              ) : (
                <>
                  {/* Database Health Row */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl border border-brand-border bg-brand-background text-xs">
                    <div className="flex items-center gap-2 text-brand-text font-semibold">
                      <Database size={14} className="text-slate-400" />
                      SQLite Database
                    </div>
                    <span className="font-bold text-emerald-500">{health?.database || 'Disconnected'}</span>
                  </div>

                  {/* ML Model Health Row */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl border border-brand-border bg-brand-background text-xs">
                    <div className="flex items-center gap-2 text-brand-text font-semibold">
                      <Cpu size={14} className="text-slate-400" />
                      Inference Engine
                    </div>
                    <span className="font-bold text-emerald-500">{health?.model || 'Unloaded'}</span>
                  </div>

                  {/* Version Telemetry Row */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl border border-brand-border bg-brand-background text-xs">
                    <div className="flex items-center gap-2 text-brand-text font-semibold">
                      <Server size={14} className="text-slate-400" />
                      Gateway Version
                    </div>
                    <span className="font-bold text-slate-500">v{health?.version || '0.0.0'}</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Recent Deliveries List */}
          <Card className="hover:border-slate-200/80 transition-all duration-300 flex-1 flex flex-col">
            <CardHeader className="border-b border-slate-50 pb-4">
              <CardTitle className="text-base font-bold">Recent Prediction Actions</CardTitle>
              <CardDescription>Live telemetry logging of recent dispatches.</CardDescription>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-auto">
              {isLoading ? (
                <div className="p-4 space-y-3 animate-pulse">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-10 bg-slate-100 rounded-lg w-full" />
                  ))}
                </div>
              ) : (
                <div className="w-full min-h-[220px]">
                  {deliveries.length === 0 ? (
                    <div className="h-full min-h-[220px] flex flex-col items-center justify-center text-slate-400 p-4">
                      <Clock size={24} className="mb-2 text-slate-350" />
                      <p className="text-xs font-bold uppercase tracking-wider">No Shipments Processed</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs font-semibold py-2">ID</TableHead>
                          <TableHead className="text-xs font-semibold py-2">Prediction</TableHead>
                          <TableHead className="text-xs font-semibold py-2">Conf</TableHead>
                          <TableHead className="text-xs font-semibold py-2">Risk</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {deliveries.slice(0, 5).map((d) => (
                          <TableRow key={d.id} className="hover:bg-brand-background">
                            <TableCell className="font-bold text-brand-text py-2.5 text-xs">
                              #{d.id}
                            </TableCell>
                            <TableCell className="py-2.5 text-xs">
                              <Badge variant={d.prediction === 'Delivery Failure' ? 'danger' : 'success'}>
                                {d.prediction === 'Delivery Failure' ? 'Failure' : 'Success'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-xs font-semibold text-slate-500 py-2.5">
                              {Math.round((d.confidence <= 1 ? d.confidence * 100 : d.confidence))}%
                            </TableCell>
                            <TableCell className="py-2.5 text-xs">
                              <Badge variant={d.risk_score > 0.6 ? 'danger' : d.risk_score > 0.35 ? 'warning' : 'success'} pill>
                                {d.risk_score.toFixed(2)}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
