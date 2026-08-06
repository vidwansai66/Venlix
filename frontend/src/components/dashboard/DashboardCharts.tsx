import { useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { type ReportData, type DeliveryItem } from '@/hooks/useDashboardData';
import { Brain } from 'lucide-react';

interface DashboardChartsProps {
  report: ReportData | null;
  deliveries: DeliveryItem[];
  activeTab: 'confidence' | 'pie' | 'bar';
}

export const DashboardCharts = ({
  report,
  deliveries,
  activeTab
}: DashboardChartsProps) => {
  
  // Format data for the Area Chart (Confidence Trend)
  const areaData = useMemo(() => {
    if (!deliveries || deliveries.length === 0) return [];
    // Take the latest 15 runs, then reverse them so they flow chronologically
    return [...deliveries]
      .slice(0, 15)
      .reverse()
      .map((item) => {
        // Handle decimal vs percentage
        const confVal = item.confidence <= 1 ? item.confidence * 100 : item.confidence;
        return {
          name: `#${item.id}`,
          confidence: Math.round(confVal * 10) / 10,
          risk: Math.round((item.risk_score || 0) * 100),
        };
      });
  }, [deliveries]);

  // Format data for the Pie Chart (Success vs Failures)
  const pieData = useMemo(() => {
    if (!report || report.total_predictions === 0) return [];
    return [
      { name: 'Successful', value: report.delivery_success, color: '#22C55E' },
      { name: 'Failures', value: report.delivery_failures, color: '#EF4444' }
    ];
  }, [report]);

  // Format data for the Bar Chart (Prediction Summary)
  const barData = useMemo(() => {
    if (!report || report.total_predictions === 0) return [];
    return [
      {
        name: 'Predictions',
        Successful: report.delivery_success,
        Failures: report.delivery_failures
      }
    ];
  }, [report]);

  // Verify if we have sufficient data to render charts
  const hasData = useMemo(() => {
    return report && report.total_predictions > 0;
  }, [report]);

  if (!hasData) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-center text-slate-400 p-6">
        <Brain className="mb-3 text-slate-300 animate-pulse" size={32} />
        <p className="text-sm font-semibold uppercase tracking-wider">No Telemetry Registered Yet</p>
        <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
          The database is currently unpopulated. Complete dispatch predictions to display analytics.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-[280px]">
      {activeTab === 'confidence' && (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={areaData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorConfidence" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#7C3AED" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--brand-border)" vertical={false} />
            <XAxis dataKey="name" stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} domain={[0, 100]} />
            <Tooltip
              contentStyle={{ background: 'var(--brand-card)', border: '1px solid var(--brand-border)', borderRadius: '12px', color: 'var(--brand-text)' }}
              labelStyle={{ fontWeight: 'bold', fontSize: '12px', color: 'var(--brand-text)' }}
              itemStyle={{ fontSize: '12px', color: '#A855F7' }}
            />
            <Area
              type="monotone"
              dataKey="confidence"
              stroke="#7C3AED"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorConfidence)"
              name="Confidence %"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}

      {activeTab === 'pie' && (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              nameKey="name"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ background: 'var(--brand-card)', border: '1px solid var(--brand-border)', borderRadius: '12px', color: 'var(--brand-text)' }}
              itemStyle={{ fontSize: '12px' }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px', fontWeight: 'semibold', color: 'var(--brand-text)' }} />
          </PieChart>
        </ResponsiveContainer>
      )}

      {activeTab === 'bar' && (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barData} barGap={12} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--brand-border)" vertical={false} />
            <XAxis dataKey="name" stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ background: 'var(--brand-card)', border: '1px solid var(--brand-border)', borderRadius: '12px', color: 'var(--brand-text)' }}
              itemStyle={{ fontSize: '12px' }}
              cursor={{ fill: 'rgba(255,255,255,0.05)' }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px', fontWeight: 'semibold', color: 'var(--brand-text)' }} />
            <Bar dataKey="Successful" fill="#22C55E" radius={[4, 4, 0, 0]} barSize={40} />
            <Bar dataKey="Failures" fill="#EF4444" radius={[4, 4, 0, 0]} barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};
export default DashboardCharts;
