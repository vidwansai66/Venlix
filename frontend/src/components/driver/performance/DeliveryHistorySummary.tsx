import type { DriverDeliveryItem } from '@/hooks/useDriverData';

interface DeliveryHistorySummaryProps {
  deliveries: DriverDeliveryItem[];
}

export const DeliveryHistorySummary = ({ deliveries }: DeliveryHistorySummaryProps) => {
  const completedToday = deliveries.filter(d => d.prediction === 'Delivery Successful').length;
  const delayedToday = deliveries.filter(d => d.prediction === 'Delivery Failure').length;
  const totalToday = deliveries.length;
  const successToday = totalToday > 0 ? ((completedToday / totalToday) * 100).toFixed(1) + "%" : "0%";

  const history = [
    { date: "Today", completed: completedToday, delayed: delayedToday, cancelled: 0, success: successToday, avgTime: "24 mins" },
    { date: "Yesterday", completed: 18, delayed: 1, cancelled: 0, success: "94.7%", avgTime: "28 mins" },
    { date: "Aug 4", completed: 15, delayed: 0, cancelled: 1, success: "93.3%", avgTime: "25 mins" },
    { date: "Aug 3", completed: 21, delayed: 2, cancelled: 0, success: "90.4%", avgTime: "31 mins" },
    { date: "Aug 2", completed: 19, delayed: 0, cancelled: 0, success: "100%", avgTime: "22 mins" },
  ];

  return (
    <div className="rounded-2xl border border-brand-border bg-brand-card shadow-soft overflow-hidden">
      <div className="p-6 border-b border-brand-border">
        <h2 className="text-base font-bold text-brand-text">Recent History</h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-[10px] font-bold text-muted uppercase tracking-wider bg-brand-background/50 border-b border-brand-border">
            <tr>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Completed</th>
              <th className="px-6 py-4">Delayed</th>
              <th className="px-6 py-4">Cancelled</th>
              <th className="px-6 py-4">Success Rate</th>
              <th className="px-6 py-4">Avg Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border">
            {history.map((row, idx) => (
              <tr key={idx} className="hover:bg-brand-background/30 transition-colors">
                <td className="px-6 py-4 font-bold text-brand-text">{row.date}</td>
                <td className="px-6 py-4 font-semibold text-brand-text">{row.completed}</td>
                <td className="px-6 py-4 font-semibold text-warning">{row.delayed > 0 ? row.delayed : '-'}</td>
                <td className="px-6 py-4 font-semibold text-danger">{row.cancelled > 0 ? row.cancelled : '-'}</td>
                <td className="px-6 py-4 font-bold text-success">{row.success}</td>
                <td className="px-6 py-4 font-semibold text-muted">{row.avgTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default DeliveryHistorySummary;
