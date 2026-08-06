import { useState, useEffect, useCallback } from 'react';
import apiClient from '@/services/apiClient';

export interface ReportData {
  total_predictions: number;
  delivery_failures: number;
  delivery_success: number;
  failure_rate: string;
  average_confidence: number;
}

export interface DeliveryItem {
  id: number;
  Agent_Age?: number;
  Agent_Rating?: number;
  Store_Latitude?: number;
  Store_Longitude?: number;
  Drop_Latitude?: number;
  Drop_Longitude?: number;
  Weather?: number;
  Traffic?: number;
  Vehicle?: number;
  Area?: number;
  Category?: number;
  Delivery_Time?: number;
  pin_code?: number;
  driver_on_time_rate?: number;
  customer_unavailability_history?: number;
  address_failure_history_rate?: number;
  order_value?: number;
  slot_width_minutes?: number;
  distance_km?: number;
  risk_score: number;
  day_of_week?: number;
  month?: number;
  is_weekend?: number;
  pickup_delay_minutes?: number;
  hour_of_day?: number;
  prediction: string;
  confidence: number;
  created_at: string;
}

export interface HealthData {
  status: string;
  database: string;
  model: string;
  version: string;
}

export interface DashboardData {
  report: ReportData | null;
  deliveries: DeliveryItem[];
  health: HealthData | null;
}

export const useDashboardData = () => {
  const [data, setData] = useState<DashboardData>({
    report: null,
    deliveries: [],
    health: null,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [reportRes, deliveriesRes, healthRes] = await Promise.all([
        apiClient.get<ReportData>('/reports/'),
        apiClient.get<DeliveryItem[]>('/deliveries/'),
        apiClient.get<HealthData>('/health'),
      ]);

      // Sort deliveries by ID descending to get the latest first
      const sortedDeliveries = (deliveriesRes.data || []).sort((a, b) => b.id - a.id);

      setData({
        report: reportRes.data,
        deliveries: sortedDeliveries,
        health: healthRes.data,
      });
    } catch (err: any) {
      console.error('Error fetching dashboard telemetry:', err);
      setError(
        err.response?.data?.detail || 
        err.message || 
        'Could not establish connection to the Venlix FastAPI backend.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    ...data,
    isLoading,
    error,
    refetch: fetchDashboardData,
  };
};
export default useDashboardData;
