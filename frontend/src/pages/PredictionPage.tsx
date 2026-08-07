import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, ShieldAlert, Activity, Sparkles, AlertTriangle, Loader2, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import apiClient from '@/services/apiClient';

const getRiskColor = (riskLevel: string) => {
  switch (riskLevel) {
    case 'Low': return 'bg-emerald-500 text-white';
    case 'Medium': return 'bg-orange-500 text-white';
    case 'High': return 'bg-red-500 text-white';
    case 'Critical': return 'bg-red-900 text-white';
    default: return 'bg-slate-500 text-white';
  }
};

const getRiskTextColor = (riskLevel: string) => {
  switch (riskLevel) {
    case 'Low': return 'text-emerald-500';
    case 'Medium': return 'text-orange-500';
    case 'High': return 'text-red-500';
    case 'Critical': return 'text-red-900';
    default: return 'text-slate-500';
  }
};

export const PredictionPage = () => {
  const [isBackendHealthy, setIsBackendHealthy] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [predictionResult, setPredictionResult] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState({
    customer_answered_call: 'Yes',
    customer_availability: 'Home',
    visitor_pass_status: 'Approved',
    driver_status: 'Available',
    Weather: 'Clear',
    Traffic: 'Low',
    society_security_level: 'Open',
    previous_failed_deliveries: 0,
    gate_wait_time: 2,
    estimated_arrival_delay: 0,
  });

  useEffect(() => {
    const checkHealth = async () => {
      try {
        await apiClient.get('/health');
        setIsBackendHealthy(true);
      } catch (err) {
        setIsBackendHealthy(false);
      }
    };
    checkHealth();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'previous_failed_deliveries' || name === 'gate_wait_time' || name === 'estimated_arrival_delay' ? Number(value) : value
    }));
  };

  const handlePredict = async () => {
    setLoading(true);
    setError(null);
    setPredictionResult(null);

    // Build the full payload with defaults for missing fields
    const payload = {
      Agent_Age: 30,
      Agent_Rating: 4.5,
      Weather: formData.Weather,
      Traffic: formData.Traffic,
      Vehicle: 'Bike',
      Area: 'Urban',
      Delivery_Time: 30,
      customer_answered_call: formData.customer_answered_call,
      customer_response_time: 5,
      customer_availability: formData.customer_availability,
      visitor_pass_status: formData.visitor_pass_status,
      society_security_level: formData.society_security_level,
      gate_wait_time: formData.gate_wait_time,
      driver_status: formData.driver_status,
      previous_failed_deliveries: formData.previous_failed_deliveries,
      address_confidence: 0.9,
      preferred_delivery_slot: 'Morning',
      estimated_arrival_delay: formData.estimated_arrival_delay,
      driver_experience: 24,
      pickup_delay_minutes: 5.0,
      hour_of_day: 14,
      day_of_week: 'Monday',
      is_weekend: 0,
      arrival_within_preferred_slot: 1,
      customer_reachability_score: 0.9,
      society_accessibility_score: 0.85,
      driver_reliability_score: 0.95
    };

    try {
      const response = await apiClient.post('/predict', payload);
      setPredictionResult(response.data);
    } catch (err: any) {
      if (err.response) {
        if (err.response.status === 422) {
          setError('Validation error: ' + err.response.data.message);
        } else if (err.response.status === 500) {
          setError('Internal server error during prediction.');
        } else {
          setError('Model loading error or backend issue.');
        }
      } else {
        setError('Network failure. Backend unavailable.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (isBackendHealthy === false) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] animate-fade-in text-center">
        <WifiOff size={64} className="text-danger mb-4" />
        <h2 className="text-3xl font-extrabold text-brand-text mb-2">Backend Offline</h2>
        <p className="text-muted max-w-md">The Venlix AI backend could not be reached. Please check if the server is running.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-brand-text tracking-tight flex items-center gap-3">
            Prediction Engine 
            <Badge variant="primary" className="bg-primary/10 text-primary border-primary/20 animate-pulse">
              <Brain size={14} className="mr-1"/> AI Active
            </Badge>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Test the AI model by providing real-time delivery features.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Input Form Column */}
        <Card className="border-brand-border bg-brand-card shadow-lg">
          <CardContent className="p-6">
            <h3 className="text-lg font-black text-brand-text mb-6 flex items-center gap-2">
              <Sparkles size={18} className="text-primary"/> Simulation Parameters
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Customer Answered Call</label>
                  <select name="customer_answered_call" value={formData.customer_answered_call} onChange={handleChange} className="w-full h-10 px-3 bg-brand-background border border-brand-border rounded-lg text-sm text-brand-text focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Customer Availability</label>
                  <select name="customer_availability" value={formData.customer_availability} onChange={handleChange} className="w-full h-10 px-3 bg-brand-background border border-brand-border rounded-lg text-sm text-brand-text focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <option value="Home">Home</option>
                    <option value="Office">Office</option>
                    <option value="Travelling">Travelling</option>
                    <option value="Unknown">Unknown</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Visitor Pass Status</label>
                  <select name="visitor_pass_status" value={formData.visitor_pass_status} onChange={handleChange} className="w-full h-10 px-3 bg-brand-background border border-brand-border rounded-lg text-sm text-brand-text focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <option value="Approved">Approved</option>
                    <option value="Pending">Pending</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Driver Status</label>
                  <select name="driver_status" value={formData.driver_status} onChange={handleChange} className="w-full h-10 px-3 bg-brand-background border border-brand-border rounded-lg text-sm text-brand-text focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <option value="Available">Available</option>
                    <option value="Delayed">Delayed</option>
                    <option value="Accident">Accident</option>
                    <option value="Medical Emergency">Medical Emergency</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Weather</label>
                  <select name="Weather" value={formData.Weather} onChange={handleChange} className="w-full h-10 px-3 bg-brand-background border border-brand-border rounded-lg text-sm text-brand-text focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <option value="Clear">Clear</option>
                    <option value="Light Rain">Light Rain</option>
                    <option value="Heavy Rain">Heavy Rain</option>
                    <option value="Storm">Storm</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Traffic</label>
                  <select name="Traffic" value={formData.Traffic} onChange={handleChange} className="w-full h-10 px-3 bg-brand-background border border-brand-border rounded-lg text-sm text-brand-text focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Gate Wait Time (mins)</label>
                  <input type="number" name="gate_wait_time" value={formData.gate_wait_time} onChange={handleChange} className="w-full h-10 px-3 bg-brand-background border border-brand-border rounded-lg text-sm text-brand-text focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Est. Arrival Delay (mins)</label>
                  <input type="number" name="estimated_arrival_delay" value={formData.estimated_arrival_delay} onChange={handleChange} className="w-full h-10 px-3 bg-brand-background border border-brand-border rounded-lg text-sm text-brand-text focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Previous Failed Deliveries</label>
                <input type="number" name="previous_failed_deliveries" value={formData.previous_failed_deliveries} onChange={handleChange} className="w-full h-10 px-3 bg-brand-background border border-brand-border rounded-lg text-sm text-brand-text focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
            </div>

            <Button 
              variant="primary" 
              className="w-full mt-6 bg-gradient-to-r from-primary to-purple-600 border-none shadow-[0_0_15px_rgba(124,58,237,0.3)] h-12 text-lg"
              onClick={handlePredict}
              disabled={loading}
            >
              {loading ? (
                <><Loader2 className="animate-spin mr-2" size={20} /> Predicting Risk...</>
              ) : (
                <><Brain className="mr-2" size={20} /> Generate Prediction</>
              )}
            </Button>

            {error && (
              <div className="mt-4 p-4 rounded-xl bg-danger/10 border border-danger/20 text-danger text-sm font-bold flex items-center gap-2">
                <AlertTriangle size={18} /> {error}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Column */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {!predictionResult ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center p-12 text-center bg-brand-card border border-brand-border rounded-xl shadow-lg min-h-[400px]"
              >
                <div className="w-20 h-20 bg-brand-background rounded-full flex items-center justify-center mb-6 border border-brand-border shadow-inner">
                  <Brain size={40} className="text-muted" />
                </div>
                <h3 className="text-xl font-bold text-brand-text mb-2">No prediction yet</h3>
                <p className="text-sm font-medium text-muted max-w-md">
                  Adjust parameters on the left and click Generate Prediction to see AI analysis.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Hero Result */}
                <Card className={`border overflow-hidden relative shadow-lg ${
                  predictionResult.risk_level === 'Low' ? 'border-success/50 bg-success/5' :
                  predictionResult.risk_level === 'Medium' ? 'border-warning/50 bg-warning/5' :
                  'border-danger/50 bg-danger/5'
                }`}>
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Brain size={120} />
                  </div>
                  <CardContent className="p-6 relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <Badge className={`${getRiskColor(predictionResult.risk_level)} border-none shadow-sm mb-2`}>
                          {predictionResult.risk_level} Risk
                        </Badge>
                        <h2 className={`text-3xl font-black ${getRiskTextColor(predictionResult.risk_level)}`}>
                          {predictionResult.prediction}
                        </h2>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Confidence</p>
                        <p className="text-2xl font-black text-brand-text">{predictionResult.confidence}%</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 mt-6 pt-6 border-t border-current/10">
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase mb-1">Risk Score</p>
                        <p className={`text-xl font-black ${getRiskTextColor(predictionResult.risk_level)}`}>{predictionResult.risk_score}/100</p>
                      </div>
                      <div className="flex-1">
                         <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${predictionResult.risk_score}%` }}
                            transition={{ duration: 1 }}
                            className={`h-full ${getRiskColor(predictionResult.risk_level)}`} 
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* AI Insights & Factors */}
                {predictionResult.risk_factors && predictionResult.risk_factors.length > 0 && (
                  <Card className="border-brand-border bg-brand-card shadow-lg">
                    <CardContent className="p-5">
                      <h3 className="text-sm font-black text-brand-text uppercase tracking-widest mb-4 flex items-center gap-2">
                        <AlertTriangle size={16} className="text-danger"/> Top Risk Factors
                      </h3>
                      <div className="space-y-3">
                        {predictionResult.risk_factors.map((factor: any, i: number) => (
                          <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-brand-background border border-brand-border">
                            <span className="text-sm font-bold text-brand-text">{factor.factor}</span>
                            <span className="text-xs font-bold text-danger">Impact: {factor.impact}%</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {predictionResult.protective_factors && predictionResult.protective_factors.length > 0 && (
                  <Card className="border-brand-border bg-brand-card shadow-lg">
                    <CardContent className="p-5">
                      <h3 className="text-sm font-black text-brand-text uppercase tracking-widest mb-4 flex items-center gap-2">
                        <ShieldAlert size={16} className="text-success"/> Protective Factors
                      </h3>
                      <div className="space-y-3">
                        {predictionResult.protective_factors.map((factor: any, i: number) => (
                          <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-brand-background border border-brand-border">
                            <span className="text-sm font-bold text-brand-text">{factor.factor}</span>
                            <span className="text-xs font-bold text-success">Impact: {factor.impact}%</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Recommendations */}
                <Card className="border-brand-border bg-brand-card shadow-lg">
                  <CardContent className="p-5">
                    <h3 className="text-sm font-black text-brand-text uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Sparkles size={16} className="text-primary"/> Recommended Actions
                    </h3>
                    <div className="space-y-3">
                      {predictionResult.recommended_actions.map((act: any, i: number) => (
                        <div key={i} className="p-3 rounded-lg bg-brand-background border border-brand-border flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-1.5 rounded bg-primary/10 text-primary">
                              <Activity size={16} />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-brand-text">{act.action}</p>
                              <p className="text-[10px] font-bold text-slate-500 uppercase">Priority: {act.priority}</p>
                            </div>
                          </div>
                          <Badge variant="outline" className="border-primary/30 text-primary">+{act.expected_improvement}% Success</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Estimated Outcomes */}
                <Card className="border-brand-border bg-brand-card shadow-lg">
                  <CardContent className="p-5">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Est. Success</p>
                        <p className="text-2xl font-black text-success">{predictionResult.estimated_success_after_action}%</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Time Saved</p>
                        <p className="text-2xl font-black text-brand-text">{predictionResult.estimated_time_saved_minutes}m</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Cost Saved</p>
                        <p className="text-2xl font-black text-brand-text">₹{predictionResult.estimated_cost_saved_rupees}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Fuel Saved</p>
                        <p className="text-2xl font-black text-brand-text">{predictionResult.estimated_fuel_saved_liters}L</p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-brand-border flex justify-between items-center text-[10px] font-bold text-slate-400">
                      <span>Model: {predictionResult.model}</span>
                      <span>Timestamp: {new Date(predictionResult.timestamp).toLocaleString()}</span>
                    </div>
                  </CardContent>
                </Card>

              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default PredictionPage;
