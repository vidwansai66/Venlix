import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, PackageX, Loader2 } from 'lucide-react';
import DeliveriesHeader from '@/components/driver/deliveries/DeliveriesHeader';
import DeliveriesFilterBar from '@/components/driver/deliveries/DeliveriesFilterBar';
import DeliveryCard from '@/components/driver/deliveries/DeliveryCard';
import type { Delivery } from '@/components/driver/deliveries/DeliveryCard';
import DeliveryDetailsDrawer from '@/components/driver/deliveries/DeliveryDetailsDrawer';
import { useDriverData } from '@/hooks/useDriverData';
import type { DriverDeliveryItem } from '@/hooks/useDriverData';

export const DriverDeliveriesPage = () => {
  const { deliveries, isLoading, error, refetch } = useDriverData();
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Nearest First");

  // Drawer State
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleViewDetails = (delivery: Delivery) => {
    setSelectedDelivery(delivery);
    setIsDrawerOpen(true);
  };

  // Map Backend Data to Delivery Card Format
  const mappedDeliveries: Delivery[] = useMemo(() => {
    return deliveries.map((d: DriverDeliveryItem) => {
      // Map AI Prediction to a UI Status
      let status = "Assigned";
      if (d.prediction === 'Delivery Successful') status = "Delivered";
      else if (d.prediction === 'Delivery Failure') status = "Failed";
      
      const priority = d.risk_level === 'Critical' || d.risk_level === 'High' ? 'High' : 'Normal';

      return {
        internalId: d.id,
        id: d.delivery_id || `DEL-${d.id}`,
        customerName: d.customer?.name || "Unknown Customer",
        customerPhone: "+1 (555) 000-0000",
        address: d.customer?.address || "Unknown Address",
        distance: `${d.distance_km || 0} km`,
        eta: `${d.Delivery_Time || 0} mins`,
        orderValue: `$${d.order_value || 0}.00`,
        status,
        priority,
        riskLevel: d.risk_score || 0,
        aiRecommendation: d.ai_recommendation?.description || "Proceed with standard delivery protocol."
      };
    });
  }, [deliveries]);

  const filteredAndSortedDeliveries = useMemo(() => {
    let result = [...mappedDeliveries];

    // Status Filter
    if (statusFilter !== "All") {
      result = result.filter(d => d.status === statusFilter);
    }

    // Search Query (ID or Name)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(d => 
        d.id.toLowerCase().includes(q) || 
        d.customerName.toLowerCase().includes(q)
      );
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "Nearest First") {
        return parseFloat(a.distance) - parseFloat(b.distance);
      }
      if (sortBy === "Highest Priority") {
        const pOrder: Record<string, number> = { "Critical": 0, "High": 1, "Medium": 2, "Normal": 3, "Low": 4 };
        return (pOrder[a.priority] ?? 5) - (pOrder[b.priority] ?? 5);
      }
      return b.id.localeCompare(a.id);
    });

    return result;
  }, [mappedDeliveries, statusFilter, searchQuery, sortBy]);

  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-12 bg-danger/5 border border-danger/20 rounded-2xl max-w-7xl mx-auto mt-8">
        <h3 className="text-xl font-bold text-danger mb-2">Connection Error</h3>
        <p className="text-muted mb-6 max-w-md text-center">{error}</p>
        <button 
          onClick={refetch}
          className="flex items-center gap-2 px-6 py-3 bg-brand-card border border-brand-border rounded-xl font-bold hover:bg-brand-background transition-colors"
        >
          <RefreshCw size={16} /> Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      <DeliveriesHeader />
      
      <DeliveriesFilterBar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {/* Content Area */}
      <div className="mt-6">
        {isLoading && mappedDeliveries.length === 0 ? (
          // Skeleton Loading State
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="rounded-2xl border border-brand-border bg-brand-card p-5 h-[160px] animate-pulse flex flex-col justify-between">
                 <div className="flex gap-4">
                   <div className="h-6 w-24 bg-brand-background rounded-full"></div>
                   <div className="h-6 w-32 bg-brand-background rounded-full"></div>
                 </div>
                 <div className="h-8 w-1/3 bg-brand-background rounded"></div>
                 <div className="flex gap-6">
                   <div className="h-4 w-16 bg-brand-background rounded"></div>
                   <div className="h-4 w-16 bg-brand-background rounded"></div>
                 </div>
              </div>
            ))}
          </div>
        ) : filteredAndSortedDeliveries.length > 0 ? (
          // Loaded Deliveries
          <div className="space-y-4">
            {filteredAndSortedDeliveries.map(delivery => (
              <DeliveryCard 
                key={delivery.id} 
                delivery={delivery} 
                onViewDetails={handleViewDetails} 
              />
            ))}
          </div>
        ) : (
          // Empty State
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-brand-border bg-brand-card shadow-soft min-h-[400px]"
          >
            <div className="w-20 h-20 bg-brand-background rounded-full flex items-center justify-center mb-6 border border-brand-border shadow-inner">
               <PackageX size={40} className="text-muted" />
            </div>
            <h3 className="text-xl font-bold text-brand-text mb-2">No deliveries found</h3>
            <p className="text-sm font-medium text-muted max-w-md mb-8">
              We couldn't find any assigned deliveries matching your current filters. Clear your filters or check back later.
            </p>
            <button 
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("All");
                refetch();
              }}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors shadow-[0_0_15px_rgba(124,58,237,0.3)]"
            >
              <RefreshCw size={16} />
              Reset Filters
            </button>
          </motion.div>
        )}
      </div>

      <DeliveryDetailsDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        delivery={selectedDelivery} 
      />
    </div>
  );
};

export default DriverDeliveriesPage;
