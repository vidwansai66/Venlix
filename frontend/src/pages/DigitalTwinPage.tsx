import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Activity, RefreshCw, Play, Pause, Square, FastForward } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useLiveDeliveries } from '@/hooks/useLiveDeliveries';

// Subcomponents
import DeliveryDetailsDrawer from '@/components/live-monitor/DeliveryDetailsDrawer';
import LiveDeliveryFeed from '@/components/live-monitor/LiveDeliveryFeed';

// --- Leaflet Custom Icons ---
const warehouseIcon = L.divIcon({
  className: 'custom-icon bg-transparent border-none',
  html: `<div class="w-5 h-5 bg-blue-500 rounded-md border-2 border-white shadow-[0_0_12px_rgba(59,130,246,0.8)] flex items-center justify-center"><div class="w-2 h-2 bg-white rounded-sm"></div></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const driverIcon = L.divIcon({
  className: 'custom-icon bg-transparent border-none',
  html: `<div class="w-5 h-5 bg-emerald-500 rounded-full border-2 border-white shadow-[0_0_12px_rgba(16,185,129,0.8)] flex items-center justify-center text-[10px]">🚚</div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const gateIcon = L.divIcon({
  className: 'custom-icon bg-transparent border-none',
  html: `<div class="w-5 h-5 bg-orange-500 rounded-full border-2 border-white shadow-[0_0_12px_rgba(249,115,22,0.8)] flex items-center justify-center text-[10px] text-white">🛡️</div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const riskIcon = L.divIcon({
  className: 'custom-icon bg-transparent border-none',
  html: `<div class="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-[0_0_20px_rgba(239,68,68,0.9)] animate-pulse flex items-center justify-center text-[10px] text-white">⚠️</div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const successIcon = L.divIcon({
  className: 'custom-icon bg-transparent border-none',
  html: `<div class="w-5 h-5 bg-emerald-500 rounded-full border-2 border-white shadow-[0_0_12px_rgba(16,185,129,0.8)] flex items-center justify-center text-[12px] text-white">✓</div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const MapControls = () => {
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
    </div>
  );
};

export const DigitalTwinPage = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<any>(null);
  const [simulating, setSimulating] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const { 
    stats, 
    deliveries, 
    activeDeliveries, 
    societies,
    refresh, 
    startSimulation, 
    pauseSimulation, 
    resetSimulation 
  } = useLiveDeliveries();

  useEffect(() => {
    // Check if new high risk delivery arrived
    const latest = activeDeliveries?.[0];
    if (latest && (latest.risk_level === 'High' || latest.risk_level === 'Critical')) {
      toast.error(`High Risk Detected: Order #${latest.id}`, { icon: "⚠️" });
    }
  }, [activeDeliveries?.[0]?.id]);

  const handlePlay = () => {
    setSimulating(true);
    startSimulation();
    toast.success("Simulation Started");
  };

  const handlePause = () => {
    setSimulating(false);
    pauseSimulation();
    toast.info("Simulation Paused");
  };

  const handleReset = () => {
    setSimulating(false);
    resetSimulation();
    toast.success("Simulation Reset");
  };

  const handleMarkerClick = (delivery: any) => {
    // Map backend model to drawer expected format
    const drawerData = {
      id: delivery.id,
      customer: delivery.customer_availability, // Placeholder, real name not in schema
      driver: "Assigned Agent",
      society: delivery.area,
      eta: delivery.delivery_time + " mins",
      risk: delivery.risk_score,
      confidence: delivery.confidence,
      action: delivery.risk_level === "High" ? "Call Customer" : "None",
      isHighRisk: delivery.risk_level === "High" || delivery.risk_level === "Critical",
      ...delivery // pass all other fields
    };
    setSelectedDelivery(drawerData);
    setDrawerOpen(true);
  };

  const storePos: [number, number] = [12.9345, 77.6266];

  const filteredActiveDeliveries = activeDeliveries.filter((d: any) => {
    let matchSearch = true;
    if (searchQuery) {
      const lower = searchQuery.toLowerCase();
      matchSearch = String(d.id).includes(lower) || 
                    (d.area && d.area.toLowerCase().includes(lower)) || 
                    (d.current_status && d.current_status.toLowerCase().includes(lower));
    }
    
    let matchFilter = true;
    if (activeFilter) {
      if (activeFilter === 'Risk') matchFilter = d.risk_level === 'High' || d.risk_level === 'Critical';
      if (activeFilter === 'Driver') matchFilter = !!d.driver_status; // just an example
      if (activeFilter === 'Society') matchFilter = !!d.area;
      if (activeFilter === 'Status') matchFilter = d.current_status !== 'Delivered';
    }
    return matchSearch && matchFilter;
  });

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] gap-4 animate-fade-in">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between shrink-0">
        <div>
          <h1 className="text-3xl font-extrabold text-brand-text tracking-tight">Live Delivery Monitor</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Monitor deliveries in real time and intervene before failures happen.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-brand-card border border-brand-border px-3 py-1.5 rounded-full shadow-sm">
            <span className="relative flex h-2 w-2">
               <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${simulating ? 'bg-success' : 'bg-orange-500'} opacity-75`}></span>
               <span className={`relative inline-flex rounded-full h-2 w-2 ${simulating ? 'bg-success' : 'bg-orange-500'}`}></span>
             </span>
             <span className={`text-xs font-bold ${simulating ? 'text-success' : 'text-orange-500'} uppercase tracking-wider`}>
                {simulating ? 'Live Simulation' : 'Paused'}
             </span>
          </div>

          <div className="flex items-center gap-2 border-r border-brand-border pr-4">
            {!simulating ? (
              <Button variant="primary" size="sm" leftIcon={<Play size={14} />} onClick={handlePlay}>Play</Button>
            ) : (
              <Button variant="outline" size="sm" leftIcon={<Pause size={14} />} onClick={handlePause}>Pause</Button>
            )}
            <Button variant="outline" size="sm" leftIcon={<Square size={14} />} onClick={handleReset}>Stop</Button>
          </div>

          <Button variant="outline" size="sm" leftIcon={<RefreshCw size={14} />} onClick={refresh}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Main Grid Layout (Two Column) */}
      <div className="flex flex-col lg:flex-row flex-1 gap-6 min-h-0 overflow-hidden">
        
        {/* Left Panel (Map) */}
        <div className="flex-1 relative flex flex-col gap-4 min-h-[400px]">
          <div className="flex-1 w-full rounded-2xl overflow-hidden border border-brand-border shadow-premium relative bg-brand-background">
            
            {/* Top Map Stats Floating */}
            <div className="absolute top-4 left-4 z-[400] flex gap-3">
              <div className="bg-brand-card/90 backdrop-blur-md border border-brand-border rounded-xl shadow-premium p-3 flex flex-col pointer-events-none min-w-[100px]">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Live Deliveries</span>
                <span className="text-2xl font-black text-brand-text mt-1">{activeDeliveries.length}</span>
              </div>
              <div className="bg-brand-card/90 backdrop-blur-md border border-danger/50 rounded-xl shadow-[0_0_15px_rgba(239,68,68,0.15)] p-3 flex flex-col pointer-events-none min-w-[100px]">
                <span className="text-[10px] font-bold text-danger uppercase">High Risk</span>
                <span className="text-2xl font-black text-danger mt-1">{stats.high_risk_deliveries}</span>
              </div>
              <div className="bg-brand-card/90 backdrop-blur-md border border-primary/50 rounded-xl shadow-[0_0_15px_rgba(124,58,237,0.15)] p-3 flex flex-col pointer-events-none min-w-[100px]">
                <span className="text-[10px] font-bold text-primary uppercase">AI Active</span>
                <span className="text-2xl font-black text-primary mt-1">{activeDeliveries.length}</span>
              </div>
              <div className="bg-brand-card/90 backdrop-blur-md border border-success/50 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.15)] p-3 flex flex-col pointer-events-none min-w-[100px]">
                <span className="text-[10px] font-bold text-success uppercase">Resolved Today</span>
                <span className="text-2xl font-black text-success mt-1">{stats.todays_deliveries - activeDeliveries.length}</span>
              </div>
            </div>

            <MapContainer center={[12.9430, 77.6343]} zoom={13} scrollWheelZoom={true} className="w-full h-full z-0" zoomControl={false}>
              <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
              <MapControls />
              
              <Marker position={storePos} icon={warehouseIcon}>
                <Popup className="premium-leaflet-popup">Central Warehouse</Popup>
              </Marker>

              {societies.map((soc: any, idx: number) => (
                <Marker key={idx} position={[soc.lat, soc.lng]} icon={gateIcon}>
                  <Popup className="premium-leaflet-popup min-w-[200px]">
                    <div className="flex flex-col gap-2">
                      <div className="font-bold text-brand-text border-b border-brand-border pb-1 mb-1 text-sm">{soc.name}</div>
                      <div className="flex justify-between text-xs text-slate-500"><span>Today's Deliveries:</span> <span className="font-bold text-brand-text">{Math.floor(Math.random() * 20 + 5)}</span></div>
                      <div className="flex justify-between text-xs text-slate-500"><span>Today's Failures:</span> <span className="font-bold text-danger">{Math.floor(Math.random() * 3)}</span></div>
                      <div className="flex justify-between text-xs text-slate-500"><span>Avg Gate Wait:</span> <span className="font-bold text-brand-text">{Math.floor(Math.random() * 5 + 2)} min</span></div>
                      <div className="flex justify-between text-xs text-slate-500"><span>Avg Visitor Appr.:</span> <span className="font-bold text-brand-text">{Math.floor(Math.random() * 4 + 1)} min</span></div>
                      <div className="flex justify-between text-xs text-slate-500"><span>Average Risk:</span> <span className="font-bold text-orange-500">{Math.floor(Math.random() * 20 + 20)}%</span></div>
                    </div>
                  </Popup>
                </Marker>
              ))}

              {filteredActiveDeliveries.map((delivery) => {
                const dropLat = delivery.drop_lat || storePos[0];
                const dropLng = delivery.drop_lng || storePos[1];
                const currentLat = delivery.current_lat || delivery.store_lat || storePos[0];
                const currentLng = delivery.current_lng || delivery.store_lng || storePos[1];
                const dropPos: [number, number] = [dropLat, dropLng];
                const currentPos: [number, number] = [currentLat, currentLng];
                const isHighRisk = delivery.risk_level === 'High' || delivery.risk_level === 'Critical';
                const isResolved = delivery.current_status === 'Delivered';
                
                return (
                  <React.Fragment key={delivery.id}>
                    <Polyline 
                      positions={[storePos, dropPos]} 
                      color={isHighRisk ? '#EF4444' : isResolved ? '#10B981' : '#3B82F6'} 
                      weight={2} 
                      dashArray={delivery.current_status === 'On Route' ? "10, 10" : undefined}
                      opacity={0.3}
                      className={delivery.current_status === 'On Route' ? 'animate-route-flow' : ''}
                    />
                    
                    <Marker 
                      position={currentPos} 
                      icon={isHighRisk ? riskIcon : isResolved ? successIcon : driverIcon} 
                      zIndexOffset={isHighRisk ? 1000 : 500} 
                      eventHandlers={{ click: () => handleMarkerClick(delivery) }}
                    >
                      <Popup className="premium-leaflet-popup min-w-[200px]">
                        <div className="flex flex-col gap-2 cursor-pointer" onClick={() => handleMarkerClick(delivery)}>
                          <div className="font-bold text-brand-text border-b border-brand-border pb-1 mb-1 text-sm">Driver Profile</div>
                          <div className="flex justify-between text-xs text-slate-500"><span>Driver Rating:</span> <span className="font-bold text-brand-text">{delivery.agent_rating || "4.8"} / 5.0</span></div>
                          <div className="flex justify-between text-xs text-slate-500"><span>Reliability:</span> <span className="font-bold text-success">{Math.round((delivery.driver_reliability_score || 0.95) * 100)}%</span></div>
                          <div className="flex justify-between text-xs text-slate-500"><span>Experience:</span> <span className="font-bold text-brand-text">{delivery.driver_experience || 3} Yrs</span></div>
                          <div className="flex justify-between text-xs text-slate-500"><span>Current Order:</span> <span className="font-bold text-primary">#{delivery.id}</span></div>
                          <div className="flex justify-between text-xs text-slate-500"><span>Today's Distance:</span> <span className="font-bold text-brand-text">{Math.floor(Math.random() * 30 + 10)} km</span></div>
                          <div className="flex justify-between text-xs text-slate-500"><span>Today's Failures:</span> <span className="font-bold text-brand-text">0</span></div>
                          <div className="mt-1 pt-2 border-t border-brand-border text-center text-[10px] text-primary font-bold">Click marker for Delivery Details</div>
                        </div>
                      </Popup>
                    </Marker>
                  </React.Fragment>
                );
              })}

              {/* Legend */}
              <div className="absolute bottom-28 left-4 z-[400] pointer-events-none">
                <div className="bg-brand-card/90 backdrop-blur-md border border-brand-border rounded-xl shadow-premium p-4 grid grid-cols-2 gap-x-6 gap-y-3 min-w-[240px]">
                   <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                     <div className="w-3 h-3 bg-emerald-500 rounded-full flex items-center justify-center text-[8px] text-white">✓</div> Safe Delivery
                   </div>
                   <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                     <div className="w-3 h-3 bg-orange-500 rounded-full shadow-[0_0_8px_rgba(249,115,22,0.5)]"></div> Medium Risk
                   </div>
                   <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                     <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div> High Risk
                   </div>
                   <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                     <div className="w-3 h-3 bg-blue-500 rounded-sm"></div> Warehouse
                   </div>
                   <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                     <div className="w-3 h-3 bg-emerald-500 rounded-full flex items-center justify-center text-[8px]">🚚</div> Driver
                   </div>
                   <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                     <div className="w-3 h-3 bg-orange-500 rounded-full flex items-center justify-center text-[8px] text-white">🛡️</div> Society Gate
                   </div>
                </div>
              </div>

              {/* Bottom Panel Society Intelligence */}
              <div className="absolute bottom-4 left-4 right-4 z-[400] h-[90px] bg-brand-card/90 backdrop-blur-md border border-brand-border rounded-2xl shadow-premium p-4 flex items-center gap-8 overflow-x-auto hide-scrollbar pointer-events-auto">
                 <div className="shrink-0 pr-6 border-r border-brand-border/50 flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                     <Activity size={20} />
                   </div>
                   <div>
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Global Intelligence</p>
                     <p className="text-sm font-black text-brand-text">All Regions</p>
                   </div>
                 </div>
                 <div className="flex items-center gap-8 shrink-0">
                   <div>
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Total Orders Today</p>
                     <p className="text-xl font-black text-brand-text">{stats.todays_deliveries}</p>
                   </div>
                   <div>
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Average Risk</p>
                     <p className="text-xl font-black text-brand-text">{stats.average_risk_score}%</p>
                   </div>
                   <div>
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Cost Saved (AI)</p>
                     <p className="text-xl font-black text-success">₹{stats.cost_saved}</p>
                   </div>
                 </div>
              </div>

            </MapContainer>
          </div>
        </div>

        {/* Right Panel (Delivery Intelligence Panel) */}
        <div className="w-full lg:w-[320px] xl:w-[400px] flex flex-col min-h-0 shrink-0">
           <LiveDeliveryFeed 
             deliveries={deliveries} 
             searchQuery={searchQuery}
             setSearchQuery={setSearchQuery}
             activeFilter={activeFilter}
             setActiveFilter={setActiveFilter}
           />
        </div>

      </div>

      <DeliveryDetailsDrawer 
        isOpen={drawerOpen} 
        onClose={() => setDrawerOpen(false)} 
        delivery={selectedDelivery}
        riskTimelineData={[]} // Can generate dynamically if needed
      />
    </div>
  );
};

export default DigitalTwinPage;

