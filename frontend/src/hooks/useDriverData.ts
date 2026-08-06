import { useState, useEffect, useCallback } from 'react';
import apiClient from '@/services/apiClient';

export interface DriverDeliveryItem {
  id: number;
  // Standard fields
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
  distance_km?: number;
  risk_score: number;
  prediction: string;
  confidence: number;
  created_at: string;
  
  // Enriched Driver-specific fields
  delivery_id?: string;
  driver?: {
    driver_id: string;
    name?: string;
  };
  customer?: {
    name: string;
    address: string;
  };
  environment?: {
    weather_condition: string;
    traffic_condition: string;
  };
  risk_level?: 'Low' | 'Medium' | 'High' | 'Critical';
  risk_factors?: Array<{ factor: string; severity: 'Low' | 'Medium' | 'High' | 'Critical'; description: string }>;
  ai_recommendation?: {
    title: string;
    description: string;
    action: string;
    time_saved_mins?: number;
    success_probability?: number;
  };
  decision_trace?: Array<{ step: string; timestamp: string }>;
}

export interface DriverMetrics {
  totalAssignedToday: number;
  completedToday: number;
  pendingToday: number;
  successRate: number;
  averageConfidence: number;
  averageRisk: number;
}

export interface DriverData {
  deliveries: DriverDeliveryItem[];
  metrics: DriverMetrics;
  health: any;
}

const DRIVER_ID = "DRV-201";

// Module-level state for local overrides across components
const localOverrides: Record<number, Partial<DriverDeliveryItem>> = {};

export const updateDeliveryLocal = (id: number, overrides: Partial<DriverDeliveryItem>) => {
  localOverrides[id] = { ...(localOverrides[id] || {}), ...overrides };
  window.dispatchEvent(new Event('driver-data-updated'));
};

export const useDriverData = () => {
  const [data, setData] = useState<DriverData>({
    deliveries: [],
    metrics: {
      totalAssignedToday: 0,
      completedToday: 0,
      pendingToday: 0,
      successRate: 0,
      averageConfidence: 0,
      averageRisk: 0
    },
    health: null,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDriverData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [deliveriesRes, healthRes] = await Promise.all([
        apiClient.get<DriverDeliveryItem[]>('/deliveries/'),
        apiClient.get('/health'),
      ]);

      // Filter deliveries for the logged-in driver (fallback to include all if driver field is missing for robustness during testing)
      let driverDeliveries = deliveriesRes.data || [];
      const strictlyFiltered = driverDeliveries.filter(d => d.driver?.driver_id === DRIVER_ID);
      
      // If the backend isn't sending the enriched driver field yet, fallback to all for demo purposes, 
      // otherwise use the strictly filtered list.
      if (strictlyFiltered.length > 0) {
          driverDeliveries = strictlyFiltered;
      }
      
      // Sort newest first
      driverDeliveries = driverDeliveries.sort((a, b) => b.id - a.id);

      // Apply local overrides
      const overriddenDeliveries = driverDeliveries.map(d => ({
        ...d,
        ...(localOverrides[d.id] || {})
      }));

      // Compute Metrics
      const totalAssignedToday = overriddenDeliveries.length;
      const completedToday = overriddenDeliveries.filter(d => d.prediction === 'Delivery Successful').length;
      const pendingToday = totalAssignedToday - completedToday;
      
      const successRate = totalAssignedToday > 0 ? (completedToday / totalAssignedToday) * 100 : 0;
      
      const avgConf = overriddenDeliveries.reduce((acc, curr) => acc + (curr.confidence || 0), 0) / (totalAssignedToday || 1);
      const avgRisk = overriddenDeliveries.reduce((acc, curr) => acc + (curr.risk_score || 0), 0) / (totalAssignedToday || 1);

      setData({
        deliveries: overriddenDeliveries,
        metrics: {
          totalAssignedToday,
          completedToday,
          pendingToday,
          successRate,
          averageConfidence: avgConf,
          averageRisk: avgRisk
        },
        health: healthRes.data,
      });
    } catch (err: any) {
      console.error('Error fetching driver data:', err);
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
    fetchDriverData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchDriverData();
    }, 30000);

    const handleUpdate = () => fetchDriverData();
    window.addEventListener('driver-data-updated', handleUpdate);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('driver-data-updated', handleUpdate);
    };
  }, [fetchDriverData]);

  return {
    ...data,
    isLoading,
    error,
    refetch: fetchDriverData,
  };
};

export default useDriverData;
