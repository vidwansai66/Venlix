import { useState, useEffect } from 'react';
import { DashboardAPI } from '@/services/apiClient';

export const useLiveDeliveries = () => {
  const [stats, setStats] = useState<any>({
    todays_deliveries: 0,
    high_risk_deliveries: 0,
    average_risk_score: 0,
    success_rate: 0,
    fuel_saved: 0,
    cost_saved: 0,
    time_saved_hours: 0,
    ai_prevented_failures: 0
  });

  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [activeDeliveries, setActiveDeliveries] = useState<any[]>([]);
  const [societies, setSocieties] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>({});
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const [statsData, analyticsData, deliveriesData, activeData, societiesData] = await Promise.all([
        DashboardAPI.getStats(),
        DashboardAPI.getAnalytics(),
        DashboardAPI.getDeliveries(),
        DashboardAPI.getLiveDeliveries(),
        DashboardAPI.getSocieties()
      ]);
      setStats(statsData);
      setAnalytics(analyticsData);
      setDeliveries(deliveriesData || []);
      setActiveDeliveries(activeData || []);
      setSocieties(societiesData || []);
    } catch (err) {
      console.error("Error fetching live data", err);
    } finally {
      setLoading(false);
    }
  };

  const startSimulation = async () => {
    await DashboardAPI.startSimulation();
    fetchDashboardData();
  };

  const pauseSimulation = async () => {
    await DashboardAPI.pauseSimulation();
    fetchDashboardData();
  };

  const resetSimulation = async () => {
    await DashboardAPI.resetSimulation();
    fetchDashboardData();
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 2000);
    return () => clearInterval(interval);
  }, []);

  return { stats, deliveries, activeDeliveries, societies, analytics, loading, refresh: fetchDashboardData, startSimulation, pauseSimulation, resetSimulation };
};

