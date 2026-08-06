import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  MapPin,
  Truck,
  Activity,
  Sliders,
  Calendar,
  Sparkles,
  HelpCircle,
  AlertTriangle,
  CheckCircle,
  Database,
  Cpu,
  Brain
} from 'lucide-react';
import apiClient from '@/services/apiClient';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

// Form interface definition
interface DeliveryItem {
  id: number;
  prediction: string;
  confidence: number;
  risk_score: number;
  created_at: string;
}

// Zod Validation Schema
const predictionSchema = z.object({
  // Driver Information
  Agent_Age: z.coerce.number().min(18, 'Min age is 18').max(70, 'Max age is 70'),
  Agent_Rating: z.coerce.number().min(1.0, 'Min rating is 1.0').max(5.0, 'Max rating is 5.0'),

  // Store Location
  Store_Latitude: z.coerce.number().min(-90, 'Min latitude -90').max(90, 'Max latitude 90'),
  Store_Longitude: z.coerce.number().min(-180, 'Min longitude -180').max(180, 'Max longitude 180'),

  // Drop Location
  Drop_Latitude: z.coerce.number().min(-90, 'Min latitude -90').max(90, 'Max latitude 90'),
  Drop_Longitude: z.coerce.number().min(-180, 'Min longitude -180').max(180, 'Max longitude 180'),

  // Delivery Details
  Weather: z.coerce.number().int().min(1).max(5),
  Traffic: z.coerce.number().int().min(1).max(4),
  Vehicle: z.coerce.number().int().min(1).max(4),
  Area: z.coerce.number().int().min(1).max(3),
  Category: z.coerce.number().int().min(1).max(5),
  Delivery_Time: z.coerce.number().min(1, 'Time must be positive'),
  pin_code: z.coerce.number().int().min(100000, 'Must be 6 digits').max(999999, 'Must be 6 digits'),

  // Driver Performance
  driver_on_time_rate: z.coerce.number().min(0, 'Min 0.0').max(1.0, 'Max 1.0'),
  customer_unavailability_history: z.coerce.number().min(0, 'Min 0.0').max(1.0, 'Max 1.0'),
  address_failure_history_rate: z.coerce.number().min(0, 'Min 0.0').max(1.0, 'Max 1.0'),

  // Order Info
  order_value: z.coerce.number().min(1, 'Must be positive'),
  slot_width_minutes: z.coerce.number().min(1, 'Must be positive'),
  distance_km: z.coerce.number().min(0.1, 'Min distance 100m'),
  risk_score: z.coerce.number().min(0, 'Min 0.0').max(1.0, 'Max 1.0'),

  // Date Information
  day_of_week: z.coerce.number().int().min(1).max(7),
  month: z.coerce.number().int().min(1).max(12),
  is_weekend: z.coerce.number().int().min(0).max(1),
  pickup_delay_minutes: z.coerce.number().min(0, 'Must be positive'),
  hour_of_day: z.coerce.number().int().min(0).max(23),
});

type PredictionFormData = z.infer<typeof predictionSchema>;

// Sensible defaults representing a normal dispatch route to ease testing
const defaultValues: PredictionFormData = {
  Agent_Age: 28,
  Agent_Rating: 4.8,
  Store_Latitude: 12.9716,
  Store_Longitude: 77.5946,
  Drop_Latitude: 12.9352,
  Drop_Longitude: 77.6245,
  Weather: 1, // Sunny
  Traffic: 2, // Medium
  Vehicle: 1, // Motorcycle
  Area: 1, // Urban
  Category: 1, // Groceries
  Delivery_Time: 30,
  pin_code: 560001,
  driver_on_time_rate: 0.92,
  customer_unavailability_history: 0.05,
  address_failure_history_rate: 0.02,
  order_value: 650,
  slot_width_minutes: 30,
  distance_km: 4.6,
  risk_score: 0.35,
  day_of_week: 1, // Monday
  month: 8, // August
  is_weekend: 0, // Weekday
  pickup_delay_minutes: 3.0,
  hour_of_day: 15,
};

// Help Tooltip Component
const FormTooltip = ({ text }: { text: string }) => (
  <div className="group relative inline-block text-slate-400 hover:text-slate-600 cursor-pointer ml-1.5 shrink-0 select-none">
    <HelpCircle size={13} className="stroke-[2.5]" />
    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:flex w-48 flex-col items-center bg-slate-900 text-white text-[10px] p-2 rounded-lg shadow-lg font-medium leading-normal z-50 text-center">
      {text}
      <span className="w-2.5 h-2.5 bg-slate-900 rotate-45 -mt-1.5 absolute top-full left-1/2 -translate-x-1/2" />
    </span>
  </div>
);

// SVG Circular Progress Bar
const CircularProgress = ({ value, colorClass = 'stroke-primary' }: { value: number; colorClass?: string }) => {
  const radius = 30;
  const strokeWidth = 5;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - (value / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center h-20 w-20 shrink-0">
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="40"
          cy="40"
          r={radius}
          className="stroke-brand-border"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <motion.circle
          cx="40"
          cy="40"
          r={radius}
          className={colorClass}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: progressOffset }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </svg>
      <span className="absolute text-xs font-black text-brand-text">{Math.round(value)}%</span>
    </div>
  );
};

export const PredictionPage = () => {
  const [predictionResult, setPredictionResult] = useState<{
    id: number;
    delivery_failed: boolean;
    prediction: string;
    confidence: number;
  } | null>(null);

  const [isPredicting, setIsPredicting] = useState<boolean>(false);
  const [predictionError, setPredictionError] = useState<string | null>(null);
  
  // History list
  const [history, setHistory] = useState<DeliveryItem[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<any>({
    resolver: zodResolver(predictionSchema) as any,
    defaultValues,
  });

  // Load last 3 predictions from deliveries endpoint
  const fetchPredictionHistory = useCallback(async () => {
    setIsHistoryLoading(true);
    try {
      const res = await apiClient.get<DeliveryItem[]>('/deliveries/');
      const sorted = (res.data || []).sort((a, b) => b.id - a.id);
      setHistory(sorted.slice(0, 3));
    } catch (err) {
      console.error('Error fetching prediction history:', err);
    } finally {
      setIsHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPredictionHistory();
  }, [fetchPredictionHistory]);

  // Handle Form Submission
  const onSubmit = async (data: PredictionFormData) => {
    setIsPredicting(true);
    setPredictionError(null);
    setPredictionResult(null);

    try {
      const res = await apiClient.post('/prediction/', data);
      setPredictionResult(res.data);
      // Refresh history list immediately
      fetchPredictionHistory();
    } catch (err: any) {
      console.error('Prediction failed:', err);
      setPredictionError(
        err.response?.data?.detail || 
        err.message || 
        'Could not execute model inference. Verify FastAPI backend connection.'
      );
    } finally {
      setIsPredicting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-brand-text tracking-tight">
            AI Delivery Failure Prediction
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Configure shipping variables to classify delivery failure risks using the trained XGBoost model.
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => reset(defaultValues)}
          disabled={isPredicting}
        >
          Reset Fields
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side (65% width): Prediction Form */}
        <div className="lg:col-span-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* 1. Driver Information Section */}
            <Card className="hover:border-primary/40 transition-all duration-300">
              <CardHeader className="border-b border-brand-border pb-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
                    <User size={16} />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-bold">Driver Information</CardTitle>
                    <CardDescription className="text-xs">Specify age and performance rating metrics.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center">
                    Agent Age
                    <FormTooltip text="Age of the delivery agent. Range: 18 to 70 years." />
                  </label>
                  <input
                    type="number"
                    disabled={isPredicting}
                    placeholder="e.g. 28"
                    className={`flex h-11 w-full rounded-xl border border-brand-border bg-brand-background px-3.5 py-2 text-brand-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 ${
                      errors.Agent_Age ? 'border-danger/60 focus:ring-danger/20 focus:border-danger' : ''
                    }`}
                    {...register('Agent_Age')}
                  />
                  {errors.Agent_Age?.message && <p className="text-xs font-medium text-danger">{errors.Agent_Age.message as string}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center">
                    Agent Rating
                    <FormTooltip text="Average courier star rating history. Scale: 1.0 to 5.0." />
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    disabled={isPredicting}
                    placeholder="e.g. 4.8"
                    className={`flex h-11 w-full rounded-xl border border-brand-border bg-brand-background px-3.5 py-2 text-brand-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 ${
                      errors.Agent_Rating ? 'border-danger/60 focus:ring-danger/20 focus:border-danger' : ''
                    }`}
                    {...register('Agent_Rating')}
                  />
                  {errors.Agent_Rating?.message && <p className="text-xs font-medium text-danger">{errors.Agent_Rating.message as string}</p>}
                </div>
              </CardContent>
            </Card>

            {/* 2. Locations Section */}
            <Card className="hover:border-primary/40 transition-all duration-300">
              <CardHeader className="border-b border-brand-border pb-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-bold">Location Coordinates</CardTitle>
                    <CardDescription className="text-xs">Origin and destination GPS coordinates.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5">
                {/* Store Coordinates */}
                <div className="space-y-3 p-4 rounded-xl border border-brand-border bg-brand-background">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest border-b border-slate-100 pb-1.5">Store Origin</h4>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      disabled={isPredicting}
                      className="flex h-10 w-full rounded-xl border border-brand-border bg-brand-background px-3.5 py-2 text-brand-text text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50"
                      {...register('Store_Latitude')}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      disabled={isPredicting}
                      className="flex h-10 w-full rounded-xl border border-brand-border bg-brand-background px-3.5 py-2 text-brand-text text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50"
                      {...register('Store_Longitude')}
                    />
                  </div>
                </div>

                {/* Drop Coordinates */}
                <div className="space-y-3 p-4 rounded-xl border border-brand-border bg-brand-background">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest border-b border-slate-100 pb-1.5">Drop Destination</h4>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      disabled={isPredicting}
                      className="flex h-10 w-full rounded-xl border border-brand-border bg-brand-background px-3.5 py-2 text-brand-text text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50"
                      {...register('Drop_Latitude')}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      disabled={isPredicting}
                      className="flex h-10 w-full rounded-xl border border-brand-border bg-brand-background px-3.5 py-2 text-brand-text text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50"
                      {...register('Drop_Longitude')}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 3. Delivery Details Section */}
            <Card className="hover:border-primary/40 transition-all duration-300">
              <CardHeader className="border-b border-brand-border pb-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-purple-500/10 text-purple-500 rounded-lg">
                    <Truck size={16} />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-bold">Delivery Parameters & Environment</CardTitle>
                    <CardDescription className="text-xs">Contextual routing signals and vehicle type.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center">
                    Weather Condition
                    <FormTooltip text="Environmental status. Sunny (1), Cloudy (2), Rainy (3), Stormy (4), Sandstorm (5)." />
                  </label>
                  <select
                    disabled={isPredicting}
                    className="flex h-11 w-full rounded-xl border border-brand-border bg-brand-background px-3.5 py-2 text-brand-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50"
                    {...register('Weather')}
                  >
                    <option value={1}>Sunny</option>
                    <option value={2}>Cloudy</option>
                    <option value={3}>Rainy</option>
                    <option value={4}>Stormy</option>
                    <option value={5}>Sandstorm / Foggy</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center">
                    Traffic Density
                    <FormTooltip text="Congestion status. Low (1), Medium (2), High (3), Jam (4)." />
                  </label>
                  <select
                    disabled={isPredicting}
                    className="flex h-11 w-full rounded-xl border border-brand-border bg-brand-background px-3.5 py-2 text-brand-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50"
                    {...register('Traffic')}
                  >
                    <option value={1}>Low</option>
                    <option value={2}>Medium</option>
                    <option value={3}>High</option>
                    <option value={4}>Jam</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center">
                    Vehicle Type
                    <FormTooltip text="Courier transportation mode. Motorcycle (1), Scooter (2), Bicycle (3), Car (4)." />
                  </label>
                  <select
                    disabled={isPredicting}
                    className="flex h-11 w-full rounded-xl border border-brand-border bg-brand-background px-3.5 py-2 text-brand-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50"
                    {...register('Vehicle')}
                  >
                    <option value={1}>Motorcycle</option>
                    <option value={2}>Scooter</option>
                    <option value={3}>Bicycle</option>
                    <option value={4}>Car / Van</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center">
                    Operational Area
                    <FormTooltip text="Hub topological zone. Urban (1), Suburban (2), Rural (3)." />
                  </label>
                  <select
                    disabled={isPredicting}
                    className="flex h-11 w-full rounded-xl border border-brand-border bg-brand-background px-3.5 py-2 text-brand-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50"
                    {...register('Area')}
                  >
                    <option value={1}>Urban</option>
                    <option value={2}>Suburban</option>
                    <option value={3}>Rural</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center">
                    Cargo Category
                    <FormTooltip text="Type of goods being dispatched. Groceries (1), Electronics (2), Apparel (3), Documents (4), Medicines (5)." />
                  </label>
                  <select
                    disabled={isPredicting}
                    className="flex h-11 w-full rounded-xl border border-brand-border bg-brand-background px-3.5 py-2 text-brand-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50"
                    {...register('Category')}
                  >
                    <option value={1}>Groceries</option>
                    <option value={2}>Electronics</option>
                    <option value={3}>Apparel</option>
                    <option value={4}>Documents / Mail</option>
                    <option value={5}>Medicines / Biologicals</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center">
                    Target Delivery Time
                    <FormTooltip text="Allocated dispatch timeline in minutes." />
                  </label>
                  <input
                    type="number"
                    disabled={isPredicting}
                    placeholder="e.g. 30"
                    className={`flex h-11 w-full rounded-xl border border-brand-border bg-brand-background px-3.5 py-2 text-brand-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 ${
                      errors.Delivery_Time ? 'border-danger/60 focus:ring-danger/20 focus:border-danger' : ''
                    }`}
                    {...register('Delivery_Time')}
                  />
                  {errors.Delivery_Time?.message && <p className="text-xs font-medium text-danger">{errors.Delivery_Time.message as string}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center">
                    Postal Code (6 Digits)
                    <FormTooltip text="Regional Indian pin code parameter. Range: 100000 to 999999." />
                  </label>
                  <input
                    type="number"
                    disabled={isPredicting}
                    placeholder="e.g. 560001"
                    className={`flex h-11 w-full rounded-xl border border-brand-border bg-brand-background px-3.5 py-2 text-brand-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 ${
                      errors.pin_code ? 'border-danger/60 focus:ring-danger/20 focus:border-danger' : ''
                    }`}
                    {...register('pin_code')}
                  />
                  {errors.pin_code?.message && <p className="text-xs font-medium text-danger">{errors.pin_code.message as string}</p>}
                </div>
              </CardContent>
            </Card>

            {/* 4. Driver Performance Section */}
            <Card className="hover:border-primary/40 transition-all duration-300">
              <CardHeader className="border-b border-brand-border pb-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg">
                    <Activity size={16} />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-bold">Driver Performance Metrics</CardTitle>
                    <CardDescription className="text-xs">Historical performance parameters of the courier.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center">
                    On-Time Rate
                    <FormTooltip text="Historical on-time completion percentage. Value: 0.0 to 1.0 (90% = 0.9)." />
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    disabled={isPredicting}
                    className="flex h-11 w-full rounded-xl border border-brand-border bg-brand-background px-3.5 py-2 text-brand-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50"
                    {...register('driver_on_time_rate')}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center">
                    Unavailability Rate
                    <FormTooltip text="Frequency of customer unavailable setbacks. Value: 0.0 to 1.0." />
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    disabled={isPredicting}
                    className="flex h-11 w-full rounded-xl border border-brand-border bg-brand-background px-3.5 py-2 text-brand-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50"
                    {...register('customer_unavailability_history')}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center">
                    Address Failure Rate
                    <FormTooltip text="Historical bad address resolution failures. Value: 0.0 to 1.0." />
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    disabled={isPredicting}
                    className="flex h-11 w-full rounded-xl border border-brand-border bg-brand-background px-3.5 py-2 text-brand-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50"
                    {...register('address_failure_history_rate')}
                  />
                </div>
              </CardContent>
            </Card>

            {/* 5. Order Information & Risk */}
            <Card className="hover:border-primary/40 transition-all duration-300">
              <CardHeader className="border-b border-brand-border pb-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
                    <Sliders size={16} />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-bold">Order Financials & Risk Profile</CardTitle>
                    <CardDescription className="text-xs">Order values, routing distance, and baseline risks.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center">
                    Order Value (INR)
                    <FormTooltip text="Order value metrics. Influences route priority." />
                  </label>
                  <input
                    type="number"
                    disabled={isPredicting}
                    placeholder="e.g. 500"
                    className="flex h-11 w-full rounded-xl border border-brand-border bg-brand-background px-3.5 py-2 text-brand-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50"
                    {...register('order_value')}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center">
                    Delivery Slot Width
                    <FormTooltip text="Customer promise buffer width in minutes." />
                  </label>
                  <input
                    type="number"
                    disabled={isPredicting}
                    placeholder="e.g. 30"
                    className="flex h-11 w-full rounded-xl border border-brand-border bg-brand-background px-3.5 py-2 text-brand-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50"
                    {...register('slot_width_minutes')}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center">
                    Route Distance (KM)
                    <FormTooltip text="GIS mapped topological distance in kilometers." />
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    disabled={isPredicting}
                    placeholder="e.g. 4.8"
                    className="flex h-11 w-full rounded-xl border border-brand-border bg-brand-background px-3.5 py-2 text-brand-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50"
                    {...register('distance_km')}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center">
                    Baseline Risk Score
                    <FormTooltip text="Initial safety classification score. Value: 0.0 to 1.0." />
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    disabled={isPredicting}
                    placeholder="e.g. 0.35"
                    className="flex h-11 w-full rounded-xl border border-brand-border bg-brand-background px-3.5 py-2 text-brand-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50"
                    {...register('risk_score')}
                  />
                </div>
              </CardContent>
            </Card>

            {/* 6. Date & Time Context Section */}
            <Card className="hover:border-primary/40 transition-all duration-300">
              <CardHeader className="border-b border-brand-border pb-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-indigo-500/10 text-indigo-500 rounded-lg">
                    <Calendar size={16} />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-bold">Temporal Context</CardTitle>
                    <CardDescription className="text-xs">Schedule and time details.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center">
                    Day of Week
                    <FormTooltip text="Day metrics. Mon (1), Tue (2), ..., Sun (7)." />
                  </label>
                  <select
                    disabled={isPredicting}
                    className="flex h-11 w-full rounded-xl border border-brand-border bg-brand-background px-3.5 py-2 text-brand-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50"
                    {...register('day_of_week')}
                  >
                    <option value={1}>Monday</option>
                    <option value={2}>Tuesday</option>
                    <option value={3}>Wednesday</option>
                    <option value={4}>Thursday</option>
                    <option value={5}>Friday</option>
                    <option value={6}>Saturday</option>
                    <option value={7}>Sunday</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center">
                    Month
                    <FormTooltip text="Calendar month value. Range: 1 to 12." />
                  </label>
                  <select
                    disabled={isPredicting}
                    className="flex h-11 w-full rounded-xl border border-brand-border bg-brand-background px-3.5 py-2 text-brand-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50"
                    {...register('month')}
                  >
                    <option value={1}>January</option>
                    <option value={2}>February</option>
                    <option value={3}>March</option>
                    <option value={4}>April</option>
                    <option value={5}>May</option>
                    <option value={6}>June</option>
                    <option value={7}>July</option>
                    <option value={8}>August</option>
                    <option value={9}>September</option>
                    <option value={10}>October</option>
                    <option value={11}>November</option>
                    <option value={12}>December</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center">
                    Weekend Status
                    <FormTooltip text="Indicate whether the dispatch is scheduled on a weekend." />
                  </label>
                  <select
                    disabled={isPredicting}
                    className="flex h-11 w-full rounded-xl border border-brand-border bg-brand-background px-3.5 py-2 text-brand-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50"
                    {...register('is_weekend')}
                  >
                    <option value={0}>Weekday</option>
                    <option value={1}>Weekend</option>
                  </select>
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center">
                    Pickup Delay (Min)
                    <FormTooltip text="Initial delay before courier departs from the store." />
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    disabled={isPredicting}
                    placeholder="e.g. 3.0"
                    className="flex h-11 w-full rounded-xl border border-brand-border bg-brand-background px-3.5 py-2 text-brand-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50"
                    {...register('pickup_delay_minutes')}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center">
                    Hour of Day
                    <FormTooltip text="24-hour timestamp of checkout. Range: 0 to 23." />
                  </label>
                  <input
                    type="number"
                    disabled={isPredicting}
                    placeholder="e.g. 15"
                    className="flex h-11 w-full rounded-xl border border-brand-border bg-brand-background px-3.5 py-2 text-brand-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50"
                    {...register('hour_of_day')}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Form Submit Trigger */}
            <div className="pt-2">
              <Button
                variant="primary"
                type="submit"
                isLoading={isPredicting}
                disabled={isPredicting}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 border-none rounded-xl text-white font-bold text-base shadow-lg shadow-blue-500/25 gap-2"
                leftIcon={<Sparkles size={18} className="animate-pulse text-cyan-200" />}
              >
                {isPredicting ? 'Analyzing Route Parameters...' : 'Predict Delivery Failure Risk'}
              </Button>
            </div>

          </form>
        </div>

        {/* Right Side (35% width): AI Prediction Result Card & History */}
        <div className="lg:col-span-4 space-y-6">
          
          <AnimatePresence mode="wait">
            
            {/* Case 1: Fetch/Network Error Banners */}
            {predictionError && (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="border-danger/30 bg-danger/5 shadow-soft">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2 text-danger">
                      <AlertTriangle size={18} />
                      <CardTitle className="text-sm font-bold">Inference Error</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-xs text-danger/80 leading-relaxed font-semibold">
                      {predictionError}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onSubmit(defaultValues)}
                      className="w-full text-danger border-danger/25 hover:bg-danger/10"
                    >
                      Retry Inference
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Case 2: Currently Predicting Progress Screen */}
            {isPredicting && (
              <motion.div
                key="predicting"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-4"
              >
                <Card className="border-blue-200/50 bg-blue-50/5 shadow-soft text-center py-10 px-6">
                  <CardContent className="space-y-6 flex flex-col items-center">
                    <div className="relative">
                      <span className="absolute inset-0 rounded-full bg-blue-500/20 blur-xl animate-ping" />
                      <div className="p-4 bg-blue-600/10 text-blue-500 rounded-full border border-blue-500/25">
                        <Cpu size={36} className="animate-spin stroke-[1.5]" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-base font-bold text-slate-800 tracking-tight">Analyzing Delivery...</h3>
                      <p className="text-xs text-slate-500 leading-normal max-w-xs">
                        Passing dispatch parameters to trained gradient-boosted decision trees...
                      </p>
                    </div>
                    <div className="w-full max-w-xs bg-slate-100 h-1.5 rounded-full overflow-hidden relative">
                      <motion.div
                        className="bg-blue-600 h-full rounded-full"
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 1.8, ease: 'easeInOut', repeat: Infinity }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Case 3: Empty State Placeholder */}
            {!predictionResult && !isPredicting && !predictionError && (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4"
              >
                <Card className="border-slate-200/80 bg-white p-6 shadow-soft text-center py-12">
                  <CardContent className="space-y-4 flex flex-col items-center">
                    <div className="p-4 bg-slate-50 border border-slate-100 text-slate-400 rounded-full shadow-inner animate-float">
                      <Brain size={32} className="stroke-[1.5]" />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-sm font-bold text-slate-850">Awaiting Model Parameters</h3>
                      <p className="text-xs text-slate-500 max-w-[220px] leading-relaxed">
                        Submit the telemetry form to run the prediction classifier.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Case 4: Displays Prediction Results */}
            {predictionResult && !isPredicting && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: 'spring', bounce: 0.1, duration: 0.4 }}
              >
                <Card
                  className={`border-t-4 shadow-premium relative overflow-hidden ${
                    predictionResult.delivery_failed
                      ? 'border-t-danger border-slate-200 bg-white'
                      : 'border-t-success border-slate-200 bg-white'
                  }`}
                >
                  
                  {/* Backdrop Glow effect */}
                  <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-[60px] opacity-10 pointer-events-none ${
                    predictionResult.delivery_failed ? 'bg-danger' : 'bg-success'
                  }`} />

                  <CardHeader className="pb-3 border-b border-slate-50 flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-base font-extrabold text-slate-900">Inference Classification</CardTitle>
                      <CardDescription className="text-xs mt-0.5">XGBoost prediction results.</CardDescription>
                    </div>
                    <Badge variant={predictionResult.delivery_failed ? 'danger' : 'success'} pill>
                      {predictionResult.delivery_failed ? 'Failure Warning' : 'Safe Route'}
                    </Badge>
                  </CardHeader>
                  
                  <CardContent className="pt-6 space-y-6">
                    
                    {/* Status Visual Panel */}
                    <div className="flex items-center gap-4 p-4 rounded-2xl border border-slate-50 bg-slate-50/20">
                      {predictionResult.delivery_failed ? (
                        <div className="p-3 bg-danger/10 text-danger rounded-xl">
                          <AlertTriangle size={26} className="animate-pulse" />
                        </div>
                      ) : (
                        <div className="p-3 bg-success/10 text-success rounded-xl">
                          <CheckCircle size={26} className="stroke-[2.5]" />
                        </div>
                      )}
                      
                      <div className="flex-1">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">AI Classification</span>
                        <h3 className={`text-base font-extrabold ${
                          predictionResult.delivery_failed ? 'text-danger' : 'text-success'
                        }`}>
                          {predictionResult.prediction}
                        </h3>
                      </div>
                    </div>

                    {/* Gauge Circle Confidence Indicator */}
                    <div className="flex items-center gap-6 p-4 rounded-2xl border border-slate-50 bg-slate-50/20">
                      <CircularProgress
                        value={predictionResult.confidence <= 1 ? predictionResult.confidence * 100 : predictionResult.confidence}
                        colorClass={predictionResult.delivery_failed ? 'stroke-danger' : 'stroke-success'}
                      />
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Prediction Confidence</span>
                        <h4 className="text-sm font-bold text-slate-800">
                          {predictionResult.delivery_failed ? 'Severe risk likelihood' : 'Highly confident ETA'}
                        </h4>
                        <p className="text-[10px] text-slate-400">Validated against historical routes.</p>
                      </div>
                    </div>

                    {/* Summary Parameters List */}
                    <div className="space-y-2.5 border-t border-slate-100 pt-4">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Dispatch Summary</h4>
                      
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">Delivery Database ID</span>
                        <span className="font-bold text-slate-800">#{predictionResult.id}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">Weather Condition</span>
                        <span className="font-semibold text-slate-700">Sunny (Standard)</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">Traffic Congestion</span>
                        <span className="font-semibold text-slate-700">Medium</span>
                      </div>
                    </div>

                  </CardContent>
                </Card>
              </motion.div>
            )}

          </AnimatePresence>

          {/* History Panel (Below Result Card) */}
          <Card className="hover:border-slate-200 transition-all duration-300">
            <CardHeader className="border-b border-slate-50 pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold">Prediction Logs History</CardTitle>
                <Database size={15} className="text-slate-400" />
              </div>
              <CardDescription className="text-xs">Latest 3 dispatches recorded in DB.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {isHistoryLoading ? (
                <div className="p-4 space-y-2 animate-pulse">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-10 bg-slate-100 rounded-lg w-full" />
                  ))}
                </div>
              ) : (
                <div>
                  {history.length === 0 ? (
                    <div className="p-6 text-center text-slate-450 text-xs">
                      No historical prediction logs.
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {history.map((item) => (
                        <div key={item.id} className="p-4 flex items-center justify-between text-xs hover:bg-slate-50/50 transition-colors">
                          <div className="space-y-1">
                            <span className="font-bold text-slate-800 block">Dispatch #{item.id}</span>
                            <span className="text-[10px] text-slate-400">
                              {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <Badge variant={item.prediction === 'Delivery Failure' ? 'danger' : 'success'}>
                              {item.prediction === 'Delivery Failure' ? 'Failure' : 'Success'}
                            </Badge>
                            <span className="font-semibold text-slate-500">
                              {Math.round(item.confidence <= 1 ? item.confidence * 100 : item.confidence)}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

        </div>

      </div>
    </div>
  );
};

export default PredictionPage;
