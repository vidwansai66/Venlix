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
  Legend,
  BarChart,
  Bar
} from 'recharts';

interface MissionControlChartsProps {
  analytics?: {
    risk_distribution?: Record<string, number>;
    failure_reasons?: Record<string, number>;
    hourly_trend?: Array<{ time: string, risk: number }>;
  }
}

const COLORS = {
  Low: '#10B981',
  Medium: '#F59E0B',
  High: '#EF4444',
  Critical: '#7F1D1D'
};

const FAILURE_COLORS = ['#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#10B981', '#6366F1', '#EC4899'];

export const MissionControlCharts = ({ analytics }: MissionControlChartsProps) => {
  
  // Parse risk distribution
  const rawRiskDist = analytics?.risk_distribution || {};
  const riskDistributionData = Object.entries(rawRiskDist).map(([key, val]) => ({
    name: key,
    value: val,
    color: COLORS[key as keyof typeof COLORS] || '#94A3B8'
  })).filter(x => x.value > 0);

  // Parse failure reasons
  const rawFailures = analytics?.failure_reasons || {};
  const failureReasonsData = Object.entries(rawFailures).map(([key, val], idx) => ({
    name: key,
    value: val,
    color: FAILURE_COLORS[idx % FAILURE_COLORS.length]
  })).filter(x => x.value > 0).sort((a, b) => b.value - a.value).slice(0, 5); // top 5

  // Parse hourly trend
  const hourlyRiskTrend = analytics?.hourly_trend || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full h-[320px]">
      
      {/* Left Column: Risk Distribution Donut Chart */}
      <div className="flex flex-col h-full bg-brand-card/30 rounded-2xl p-5 border border-brand-border shadow-sm">
        <div className="mb-2">
          <h3 className="text-sm font-bold text-brand-text">Risk Distribution</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Deliveries grouped by risk</p>
        </div>
        <div className="flex-1 min-h-0">
          {riskDistributionData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                  nameKey="name"
                  stroke="none"
                >
                  {riskDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: 'var(--brand-card)', border: '1px solid var(--brand-border)', borderRadius: '12px', color: 'var(--brand-text)' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                  formatter={(value: any) => [`${value}`, 'Deliveries']}
                />
                <Legend 
                  verticalAlign="bottom" 
                  align="center"
                  iconType="circle" 
                  iconSize={8} 
                  wrapperStyle={{ fontSize: '12px', fontWeight: '600', color: 'var(--brand-text)' }} 
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-500 text-xs font-semibold">No data available</div>
          )}
        </div>
      </div>

      {/* Middle Column: Top Failure Reasons Bar Chart */}
      <div className="flex flex-col h-full bg-brand-card/30 rounded-2xl p-5 border border-brand-border shadow-sm">
        <div className="mb-2">
          <h3 className="text-sm font-bold text-brand-text">Top Risk Factors</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Most common causes for risk</p>
        </div>
        <div className="flex-1 min-h-0 pt-3">
          {failureReasonsData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={failureReasonsData} layout="vertical" margin={{ top: 0, right: 10, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--brand-border)" horizontal={true} vertical={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="#9CA3AF" fontSize={10} tickLine={false} axisLine={false} width={80} />
                <Tooltip
                  cursor={{fill: 'var(--brand-background)'}}
                  contentStyle={{ background: 'var(--brand-card)', border: '1px solid var(--brand-border)', borderRadius: '12px', color: 'var(--brand-text)' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                />
                <Bar dataKey="value" name="Occurrences" radius={[0, 4, 4, 0]}>
                  {failureReasonsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-500 text-xs font-semibold">No data available</div>
          )}
        </div>
      </div>

      {/* Right Column: Failure Prediction Trend Line/Area Chart */}
      <div className="flex flex-col h-full bg-brand-card/30 rounded-2xl p-5 border border-brand-border shadow-sm">
        <div className="mb-2">
          <h3 className="text-sm font-bold text-brand-text">Risk Trend</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Hourly avg risk score</p>
        </div>
        <div className="flex-1 min-h-0 pt-3">
          {hourlyRiskTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyRiskTrend} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--brand-border)" vertical={false} />
                <XAxis dataKey="time" stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ background: 'var(--brand-card)', border: '1px solid var(--brand-border)', borderRadius: '12px', color: 'var(--brand-text)' }}
                  labelStyle={{ fontWeight: 'bold', fontSize: '12px', color: 'var(--brand-text)' }}
                  itemStyle={{ fontSize: '12px', color: '#EF4444', fontWeight: 'bold' }}
                  formatter={(value: any) => [`${value}% Avg Risk`, '']}
                />
                <Area
                  type="monotone"
                  dataKey="risk"
                  stroke="#EF4444"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRisk)"
                  name="Avg Risk"
                  activeDot={{ r: 6, fill: '#EF4444', stroke: '#fff', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-500 text-xs font-semibold">No data available</div>
          )}
        </div>
      </div>

    </div>
  );
};
export default MissionControlCharts;
