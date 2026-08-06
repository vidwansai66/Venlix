import { useDriverData } from '@/hooks/useDriverData';
import { RefreshCw, BrainCircuit } from 'lucide-react';
import AssistantHeader from '@/components/driver/assistant/AssistantHeader';
import AssistantSummary from '@/components/driver/assistant/AssistantSummary';
import AiRecommendationCard from '@/components/driver/assistant/AiRecommendationCard';
import RiskFactors from '@/components/driver/assistant/RiskFactors';
import DecisionTrace from '@/components/driver/assistant/DecisionTrace';
import CurrentDeliveryContext from '@/components/driver/assistant/CurrentDeliveryContext';
import AssistantActions from '@/components/driver/assistant/AssistantActions';
import RecentRecommendations from '@/components/driver/assistant/RecentRecommendations';
import AiHealthPanel from '@/components/driver/assistant/AiHealthPanel';

export const DriverAssistantPage = () => {
  const { deliveries, isLoading, error, refetch } = useDriverData();

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

  // Find the delivery most in need of AI intervention
  const activeDeliveries = deliveries.filter(d => d.prediction !== 'Delivery Successful');
  
  // Sort by risk_score descending to find the highest risk delivery
  const highestRiskDelivery = activeDeliveries.sort((a, b) => (b.risk_score || 0) - (a.risk_score || 0))[0];

  return (
    <div className="w-full max-w-7xl mx-auto">
      <AssistantHeader />
      
      {isLoading && deliveries.length === 0 ? (
        // Skeleton Loading State
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
             {[1, 2, 3, 4].map(i => <div key={i} className="h-28 rounded-2xl bg-brand-card animate-pulse border border-brand-border"></div>)}
          </div>
          <div className="h-64 rounded-3xl bg-brand-card animate-pulse border border-brand-border mb-8"></div>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 space-y-8">
               <div className="h-40 rounded-2xl bg-brand-card animate-pulse border border-brand-border"></div>
               <div className="h-40 rounded-2xl bg-brand-card animate-pulse border border-brand-border"></div>
            </div>
            <div className="space-y-6">
               <div className="h-40 rounded-2xl bg-brand-card animate-pulse border border-brand-border"></div>
               <div className="h-40 rounded-2xl bg-brand-card animate-pulse border border-brand-border"></div>
            </div>
          </div>
        </div>
      ) : !highestRiskDelivery ? (
        // Safe State
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-brand-border bg-brand-card shadow-soft min-h-[400px]">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 border border-primary/20 shadow-inner">
             <BrainCircuit size={40} className="text-primary" />
          </div>
          <h3 className="text-xl font-bold text-brand-text mb-2">No AI Interventions Required</h3>
          <p className="text-sm font-medium text-muted max-w-md mb-8">
            All your current deliveries are on track with low risk scores. The AI Copilot is monitoring your route in the background.
          </p>
        </div>
      ) : (
        <>
          <AssistantSummary />
          <AiRecommendationCard delivery={highestRiskDelivery} />
          <RiskFactors delivery={highestRiskDelivery} />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mt-8">
            {/* Left Column (Wider on Desktop) - Trace and Context */}
            <div className="xl:col-span-2 flex flex-col">
              <DecisionTrace delivery={highestRiskDelivery} />
            </div>

            {/* Right Column - Context, Actions, History, Health */}
            <div className="flex flex-col">
              <CurrentDeliveryContext delivery={highestRiskDelivery} />
              <AssistantActions />
              <RecentRecommendations />
              <AiHealthPanel />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DriverAssistantPage;
