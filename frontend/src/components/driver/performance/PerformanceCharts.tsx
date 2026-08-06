import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { DriverMetrics } from '@/hooks/useDriverData';

interface PerformanceChartsProps {
  metrics: DriverMetrics;
}

export const PerformanceCharts = ({ metrics }: PerformanceChartsProps) => {
  const [activeTab, setActiveTab] = useState<'weekly' | 'monthly'>('weekly');

  const mockWeeklyData = [
    { name: 'Mon', deliveries: 12 },
    { name: 'Tue', deliveries: 19 },
    { name: 'Wed', deliveries: 15 },
    { name: 'Thu', deliveries: 22 },
    { name: 'Fri', deliveries: 28 },
    { name: 'Sat', deliveries: 14 },
    { name: 'Today', deliveries: metrics.completedToday },
  ];

  return (
    <div className="rounded-2xl border border-brand-border bg-brand-card p-6 shadow-soft h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-bold text-brand-text">Performance Overview</h2>
        
        <div className="flex bg-brand-background p-1 rounded-lg border border-brand-border">
          <button 
            onClick={() => setActiveTab('weekly')}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${activeTab === 'weekly' ? 'bg-brand-card text-brand-text shadow-sm' : 'text-muted hover:text-brand-text'}`}
          >
            Weekly
          </button>
          <button 
            onClick={() => setActiveTab('monthly')}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${activeTab === 'monthly' ? 'bg-brand-card text-brand-text shadow-sm' : 'text-muted hover:text-brand-text'}`}
          >
            Monthly
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={mockWeeklyData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorDeliveries" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#8b8b93' }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#8b8b93' }} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px', color: '#fff' }}
              itemStyle={{ color: '#7c3aed', fontWeight: 'bold' }}
            />
            <Area type="monotone" dataKey="deliveries" stroke="#7c3aed" strokeWidth={3} fillOpacity={1} fill="url(#colorDeliveries)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
export default PerformanceCharts;
