import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Activity,
  Layers,
  Search,
  Filter,
  MapPin,
  RefreshCw,
  Clock,
  Maximize
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import apiClient from '@/services/apiClient';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Error as ErrorState } from '@/components/ui/Error';
import { Loading } from '@/components/ui/Loading';

// --- Types ---
interface Coordinate {
  latitude: number;
  longitude: number;
}
interface TwinItem {
  id: number;
  store: Coordinate;
  drop: Coordinate;
  prediction: string;
  confidence: number;
  risk_score: number;
  driver_id?: number;
  customer_id?: number;
}

// --- Leaflet Custom Icons ---
const storeIcon = L.divIcon({
  className: 'custom-icon bg-transparent border-none',
  html: `<div class="w-4 h-4 bg-purple-500 rounded-full border-2 border-white shadow-[0_0_12px_rgba(168,85,247,0.8)] animate-pulse" style="transform: translate(-50%, -50%)"></div>`,
  iconSize: [16, 16],
  iconAnchor: [0, 0],
});

const successIcon = L.divIcon({
  className: 'custom-icon bg-transparent border-none',
  html: `<div class="w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-[0_0_12px_rgba(16,185,129,0.8)]" style="transform: translate(-50%, -50%)"></div>`,
  iconSize: [16, 16],
  iconAnchor: [0, 0],
});

const failureIcon = L.divIcon({
  className: 'custom-icon bg-transparent border-none',
  html: `<div class="w-5 h-5 bg-red-500 rounded-full border-2 border-white shadow-[0_0_15px_rgba(239,68,68,0.9)] animate-bounce" style="transform: translate(-50%, -50%)"></div>`,
  iconSize: [20, 20],
  iconAnchor: [0, 0],
});

const driverIcon = L.divIcon({
  className: 'custom-icon bg-transparent border-none',
  html: `<div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-[0_0_12px_rgba(59,130,246,0.8)]" style="transform: translate(-50%, -50%)"></div>`,
  iconSize: [16, 16],
  iconAnchor: [0, 0],
});

// Map Controller Component for auto-fitting bounds and zooming
const MapBoundsController = ({ data, searchFocus, fitBoundsTrigger }: { data: TwinItem[], searchFocus: Coordinate | null, fitBoundsTrigger: number }) => {
  const map = useMap();

  useEffect(() => {
    if (searchFocus) {
      map.flyTo([searchFocus.latitude, searchFocus.longitude], 15, { duration: 1.5 });
      return;
    }
  }, [searchFocus, map]);

  useEffect(() => {
    if (data.length > 0) {
      const bounds = L.latLngBounds(data.map(d => [d.store.latitude, d.store.longitude]));
      data.forEach(d => bounds.extend([d.drop.latitude, d.drop.longitude]));
      map.fitBounds(bounds, { padding: [80, 80], duration: 1.5 });
    }
  }, [data, fitBoundsTrigger, map]);

  return null;
};

// Custom Map Controls UI Component
const MapControls = ({ onReset }: { onReset: () => void }) => {
  const map = useMap();
  return (
    <div className="absolute top-4 right-4 z-[400] flex flex-col gap-2">
      <button 
        className="h-9 w-9 flex items-center justify-center rounded-xl shadow-lg bg-brand-card/90 backdrop-blur-md border border-brand-border text-brand-text hover:bg-brand-background transition-colors"
        onClick={() => map.zoomIn()}
      >
        <span className="text-xl font-medium leading-none pb-0.5">+</span>
      </button>
      <button 
        className="h-9 w-9 flex items-center justify-center rounded-xl shadow-lg bg-brand-card/90 backdrop-blur-md border border-brand-border text-brand-text hover:bg-brand-background transition-colors"
        onClick={() => map.zoomOut()}
      >
        <span className="text-2xl font-medium leading-none pb-1">-</span>
      </button>
      <button 
        className="h-9 w-9 flex items-center justify-center rounded-xl shadow-lg bg-brand-card/90 backdrop-blur-md border border-brand-border text-brand-text hover:bg-brand-background transition-colors"
        onClick={onReset}
        title="Fit All Deliveries"
      >
        <Maximize size={14} />
      </button>
    </div>
  );
};

// Unified Delivery Popup
const DeliveryPopup = ({ delivery, isFailure }: { delivery: TwinItem, isFailure: boolean }) => {
  // Memoize random values so they don't change on re-render
  const driverId = useMemo(() => delivery.driver_id || `DRV-${Math.floor(Math.random()*9000 + 1000)}`, [delivery.driver_id]);
  const customerId = useMemo(() => delivery.customer_id || `CUS-${Math.floor(Math.random()*9000 + 1000)}`, [delivery.customer_id]);
  const eta = useMemo(() => Math.floor(Math.random() * 15 + 5), []);

  return (
    <Popup className="premium-leaflet-popup">
      <div className="p-1 space-y-2.5 font-sans min-w-[200px]">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <span className="font-extrabold text-slate-900 text-sm tracking-tight">DEL-{delivery.id}</span>
          <Badge variant={isFailure ? 'danger' : 'success'} pill>
            {isFailure ? 'Failed' : 'Success'}
          </Badge>
        </div>
        <div className="space-y-1.5 text-[11px]">
          <div className="flex justify-between"><span className="text-slate-500">Prediction</span> <span className="font-bold text-slate-700">{delivery.prediction}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Confidence</span> <span className="font-bold text-slate-700">{Math.round(delivery.confidence <= 1 ? delivery.confidence * 100 : delivery.confidence)}%</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Risk Score</span> <span className="font-bold text-slate-700">{delivery.risk_score.toFixed(2)}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Driver ID</span> <span className="font-bold text-slate-700">{driverId}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Customer ID</span> <span className="font-bold text-slate-700">{customerId}</span></div>
          <div className="flex justify-between border-t border-slate-100 pt-1.5 mt-1.5">
            <span className="text-slate-500 font-semibold">ETA</span> 
            <span className="font-black text-primary">{eta} mins</span>
          </div>
        </div>
      </div>
    </Popup>
  );
};

// Animated Route Component
const AnimatedRoute = ({ delivery, setActiveMarker }: { delivery: TwinItem, setActiveMarker: (id: number) => void }) => {
  const isFailure = delivery.prediction === 'Delivery Failure';
  const isMediumRisk = !isFailure && delivery.risk_score >= 40 && delivery.risk_score < 70;
  
  let routeColor = '#10B981'; // Green
  if (isFailure) routeColor = '#EF4444'; // Red
  else if (isMediumRisk) routeColor = '#EAB308'; // Yellow

  const storePos: [number, number] = [delivery.store.latitude, delivery.store.longitude];
  const dropPos: [number, number] = [delivery.drop.latitude, delivery.drop.longitude];

  const markerRef = useRef<L.Marker>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    // Randomize speeds and start times so the dashboard feels alive
    const duration = 12000 + Math.random() * 8000; // 12-20 seconds travel time
    const delay = Math.random() * 5000; // 0-5s start delay
    let startTime = Date.now() + delay;
    let animationFrame: number;

    const animate = () => {
      const now = Date.now();
      if (now < startTime) {
        animationFrame = requestAnimationFrame(animate);
        return;
      }
      
      const elapsed = now - startTime;
      const t = elapsed / duration;
      
      if (t >= 1) {
        setIsCompleted(true);
        if (markerRef.current) {
           markerRef.current.setLatLng(dropPos);
        }
        // Pause at destination for 5 seconds before repeating
        if (elapsed > duration + 5000) {
          startTime = Date.now() + Math.random() * 3000;
          setIsCompleted(false);
        }
      } else {
        if (isCompleted) setIsCompleted(false); // Reset state if needed
        const lat = storePos[0] + (dropPos[0] - storePos[0]) * t;
        const lng = storePos[1] + (dropPos[1] - storePos[1]) * t;
        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
        }
      }
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [storePos[0], storePos[1], dropPos[0], dropPos[1]]);

  return (
    <React.Fragment>
      <Marker position={storePos} icon={storeIcon}>
        <Popup className="premium-leaflet-popup">
          <div className="font-sans text-xs">
            <h4 className="font-bold text-slate-800">Store Origin</h4>
            <p className="text-slate-500 mt-0.5">{storePos[0].toFixed(4)}, {storePos[1].toFixed(4)}</p>
          </div>
        </Popup>
      </Marker>

      <Marker 
        position={dropPos} 
        icon={isFailure ? failureIcon : successIcon}
        eventHandlers={{ click: () => setActiveMarker(delivery.id) }}
      >
        <DeliveryPopup delivery={delivery} isFailure={isFailure} />
      </Marker>

      {!isCompleted && (
        <Marker position={storePos} icon={driverIcon} ref={markerRef} zIndexOffset={1000}>
           <Popup className="premium-leaflet-popup">
              <div className="font-sans text-xs font-bold text-blue-600">
                Driver En-Route
              </div>
           </Popup>
        </Marker>
      )}

      <Polyline 
        positions={[storePos, dropPos]} 
        color={routeColor} 
        weight={3} 
        dashArray={isCompleted ? undefined : "5, 10"} 
        opacity={isCompleted ? 0.9 : 0.6}
        className={isCompleted ? '' : 'animate-route-flow'}
      />
    </React.Fragment>
  );
};

export const DigitalTwinPage = () => {
  const [twinData, setTwinData] = useState<TwinItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [filterPrediction, setFilterPrediction] = useState('All');
  const [minConfidence, setMinConfidence] = useState(0);
  const [searchId, setSearchId] = useState('');

  // Map State
  const [searchFocus, setSearchFocus] = useState<Coordinate | null>(null);
  const [activeMarker, setActiveMarker] = useState<number | null>(null);
  const [fitBoundsTrigger, setFitBoundsTrigger] = useState(0);

  const fetchTwinData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiClient.get<TwinItem[]>('/twin/');
      setTwinData(res.data || []);
    } catch (err: any) {
      console.error('Error fetching digital twin telemetry:', err);
      setError(err.response?.data?.detail || err.message || 'Failed to sync spatial telemetry logs.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTwinData();
  }, [fetchTwinData]);

  const filteredData = useMemo(() => {
    let result = [...twinData];
    if (filterPrediction === 'Success') {
      result = result.filter(d => d.prediction !== 'Delivery Failure');
    } else if (filterPrediction === 'Failure') {
      result = result.filter(d => d.prediction === 'Delivery Failure');
    }
    if (minConfidence > 0) {
      result = result.filter(d => (d.confidence <= 1 ? d.confidence * 100 : d.confidence) >= minConfidence);
    }
    if (searchId.trim()) {
      result = result.filter(d => d.id.toString().includes(searchId.trim()));
    }
    return result;
  }, [twinData, filterPrediction, minConfidence, searchId]);

  useEffect(() => {
    if (searchId.trim() && filteredData.length > 0) {
      setSearchFocus(filteredData[0].store);
      setActiveMarker(filteredData[0].id);
    } else {
      setSearchFocus(null);
    }
  }, [searchId, filteredData]);

  const pieData = useMemo(() => {
    const successCount = filteredData.filter(d => d.prediction !== 'Delivery Failure').length;
    const failureCount = filteredData.length - successCount;
    return [
      { name: 'Success', value: successCount, color: '#10B981' },
      { name: 'Failure', value: failureCount, color: '#EF4444' }
    ];
  }, [filteredData]);

  const stats = useMemo(() => {
    if (!filteredData.length) return { total: 0, success: 0, failed: 0, avgConf: 0, avgRisk: 0 };
    const successCount = filteredData.filter(d => d.prediction !== 'Delivery Failure').length;
    const failedCount = filteredData.length - successCount;
    const confSum = filteredData.reduce((acc, curr) => acc + (curr.confidence <= 1 ? curr.confidence * 100 : curr.confidence), 0);
    const riskSum = filteredData.reduce((acc, curr) => acc + curr.risk_score, 0);
    return {
      total: filteredData.length,
      success: successCount,
      failed: failedCount,
      avgConf: confSum / filteredData.length,
      avgRisk: riskSum / filteredData.length
    };
  }, [filteredData]);

  if (error && !isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <ErrorState title="Telemetry Sync Failed" message={error} onRetry={fetchTwinData} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] gap-4 animate-fade-in">
      
      {/* Top Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between shrink-0">
        <div>
          <h1 className="text-3xl font-extrabold text-brand-text tracking-tight">AI Logistics Digital Twin</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Live spatial visualization of dispatch inferences and delivery routes.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={fetchTwinData} isLoading={isLoading} leftIcon={<RefreshCw size={14} />}>
            Sync Network
          </Button>
          <Button variant="primary" size="sm" leftIcon={<Layers size={14} />} onClick={() => toast.info('Twin Settings feature coming soon')}>
            Twin Settings
          </Button>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="flex flex-col lg:flex-row flex-1 gap-6 min-h-0 overflow-hidden">
        
        {/* Left Panel (28%) */}
        <div className="w-full lg:w-[28%] flex flex-col gap-5 overflow-y-auto pr-1 pb-4">
          
          <div className="grid grid-cols-2 gap-3 shrink-0">
            <div className="bg-brand-card border border-brand-border rounded-xl p-3 shadow-soft flex flex-col">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Total Routes</span>
              <span className="text-xl font-black text-brand-text">{isLoading ? '...' : stats.total}</span>
            </div>
            <div className="bg-success/10 border border-success/20 rounded-xl p-3 shadow-soft flex flex-col">
              <span className="text-[10px] uppercase font-bold text-success">Successful</span>
              <span className="text-xl font-black text-success">{isLoading ? '...' : stats.success}</span>
            </div>
            <div className="bg-danger/10 border border-danger/20 rounded-xl p-3 shadow-soft flex flex-col">
              <span className="text-[10px] uppercase font-bold text-danger">Failures Detected</span>
              <span className="text-xl font-black text-danger">{isLoading ? '...' : stats.failed}</span>
            </div>
            <div className="bg-brand-card border border-brand-border rounded-xl p-3 shadow-soft flex flex-col">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Avg Confidence</span>
              <span className="text-xl font-black text-brand-text">{isLoading ? '...' : `${stats.avgConf.toFixed(1)}%`}</span>
            </div>
          </div>

          <Card className="shrink-0 shadow-soft">
            <CardHeader className="border-b border-slate-100 pb-3 p-4">
              <CardTitle className="text-sm font-bold flex items-center gap-2"><Filter size={14}/> Simulation Filters</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Locate Delivery ID</label>
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    placeholder="Search ID..."
                    className="h-9 w-full rounded-lg border border-brand-border pl-9 pr-3 text-xs focus:ring-2 focus:ring-primary/20 outline-none bg-brand-background text-brand-text"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase">AI Prediction Class</label>
                <select
                  value={filterPrediction}
                  onChange={(e) => setFilterPrediction(e.target.value)}
                  className="h-9 w-full rounded-lg border border-brand-border px-3 text-xs focus:ring-2 focus:ring-primary/20 outline-none bg-brand-background text-brand-text"
                >
                  <option value="All">All Routes</option>
                  <option value="Success">Success (Safe)</option>
                  <option value="Failure">Failure (Risky)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Min Confidence Limit</label>
                  <span className="text-[10px] font-bold text-primary">{minConfidence}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={minConfidence}
                  onChange={(e) => setMinConfidence(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="shrink-0 shadow-soft flex-1 min-h-[220px]">
            <CardHeader className="border-b border-slate-100 pb-3 p-4">
              <CardTitle className="text-sm font-bold flex items-center gap-2"><Activity size={14}/> Network Reliability</CardTitle>
            </CardHeader>
            <CardContent className="p-4 h-40">
              {stats.total === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-400 text-xs">No Data Available</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={35}
                      outerRadius={55}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip contentStyle={{ borderRadius: '8px', border: '1px solid var(--brand-border)', background: 'var(--brand-card)', color: 'var(--brand-text)', fontSize: '11px' }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

        </div>

        {/* Right Panel (72%) - Full Screen Map */}
        <div className="flex-1 relative flex flex-col gap-4 min-h-[400px]">
          
          <div className="flex-1 w-full rounded-2xl overflow-hidden border border-brand-border shadow-premium relative bg-brand-background">
            {isLoading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 z-10 bg-brand-background/80 backdrop-blur-sm">
                <Loading variant="spinner" text="Initializing Leaflet GIS Canvas..." />
              </div>
            ) : filteredData.length === 0 ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 z-10 bg-brand-background">
                <MapPin size={48} className="mb-4 text-slate-300 dark:text-slate-700" />
                <h3 className="text-lg font-bold text-brand-text">No telemetry routes found</h3>
                <p className="text-sm mt-1 max-w-sm text-center">Adjust your simulation filters or initiate a prediction to plot a route.</p>
              </div>
            ) : (
              <>
                {/* Floating Live Statistics Overlay (Top Left) */}
                <div className="absolute top-4 left-4 z-[400] flex flex-col gap-3 w-auto lg:w-[280px]">
                  <div className="bg-brand-card/90 backdrop-blur-md border border-brand-border rounded-xl shadow-premium p-4 pointer-events-none">
                     <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5"><Activity size={14} className="text-primary"/> Live Simulation Stats</h3>
                     <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                        <div className="flex flex-col">
                          <span className="text-xl font-black text-brand-text">{stats.total}</span>
                          <span className="text-[9px] uppercase font-bold text-slate-500">Active</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xl font-black text-success">{stats.success}</span>
                          <span className="text-[9px] uppercase font-bold text-success">Successful</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xl font-black text-danger">{stats.failed}</span>
                          <span className="text-[9px] uppercase font-bold text-danger">Failures</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xl font-black text-brand-text">{stats.avgRisk.toFixed(1)}</span>
                          <span className="text-[9px] uppercase font-bold text-slate-500">Avg Risk</span>
                        </div>
                     </div>
                  </div>
                </div>

                {/* Map Container */}
                <MapContainer 
                  center={[12.9716, 77.5946]} 
                  zoom={12} 
                  scrollWheelZoom={true} 
                  className="w-full h-full z-0"
                  zoomControl={false}
                >
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                  />
                  
                  <MapBoundsController data={filteredData} searchFocus={searchFocus} fitBoundsTrigger={fitBoundsTrigger} />
                  <MapControls onReset={() => { setSearchFocus(null); setFitBoundsTrigger(prev => prev + 1); }} />

                  {/* Floating Legend Overlay (Bottom Left) */}
                  <div className="absolute bottom-6 left-4 z-[400] pointer-events-none">
                    <div className="bg-brand-card/90 backdrop-blur-md border border-brand-border rounded-xl shadow-premium p-3 flex flex-col gap-2 min-w-[160px]">
                      <div className="flex items-center gap-2.5 text-[11px] font-bold text-slate-600 dark:text-slate-300">
                        <div className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]"></div> Store Location
                      </div>
                      <div className="flex items-center gap-2.5 text-[11px] font-bold text-slate-600 dark:text-slate-300">
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div> Driver En-Route
                      </div>
                      <div className="flex items-center gap-2.5 text-[11px] font-bold text-slate-600 dark:text-slate-300">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div> Delivery Success
                      </div>
                      <div className="flex items-center gap-2.5 text-[11px] font-bold text-slate-600 dark:text-slate-300">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)] animate-pulse"></div> Delivery Failure
                      </div>
                    </div>
                  </div>

                  {filteredData.map((d) => (
                    <AnimatedRoute key={d.id} delivery={d} setActiveMarker={setActiveMarker} />
                  ))}
                </MapContainer>
              </>
            )}
          </div>

          {/* Horizontal Timeline Overlay (Below Map) */}
          <div className="h-[90px] shrink-0 bg-brand-card border border-brand-border rounded-2xl shadow-soft p-3 flex items-center gap-4 overflow-x-auto">
            <div className="shrink-0 px-3 border-r border-brand-border h-full flex flex-col justify-center">
              <span className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1"><Clock size={12}/> Recent Nodes</span>
            </div>
            {filteredData.slice(0, 10).map((d) => (
              <motion.div 
                key={d.id} 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`shrink-0 w-32 p-2 border rounded-xl transition-colors cursor-pointer ${activeMarker === d.id ? 'bg-primary/10 border-primary' : 'border-brand-border bg-brand-background/50 hover:bg-brand-background hover:border-primary/50'}`}
                onClick={() => {
                  setSearchFocus(d.drop);
                  setActiveMarker(d.id);
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-black text-brand-text">ID #{d.id}</span>
                  <div className={`w-2 h-2 rounded-full ${d.prediction === 'Delivery Failure' ? 'bg-danger' : 'bg-success'}`} />
                </div>
                <p className="text-[9px] text-slate-500 font-medium truncate">Conf: {Math.round(d.confidence <= 1 ? d.confidence * 100 : d.confidence)}%</p>
              </motion.div>
            ))}
            {filteredData.length === 0 && <div className="text-xs text-slate-400 font-semibold px-4">No recent routes logged.</div>}
          </div>

        </div>
      </div>

    </div>
  );
};

export default DigitalTwinPage;
