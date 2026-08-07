import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/Table';
import { 
  Phone, 
  MessageSquare, 
  Navigation, 
  Key, 
  Camera, 
  CheckCircle2, 
  AlertTriangle,
  MapPin,
  Clock,
  ShieldCheck,
  User,
  X,
  QrCode
} from 'lucide-react';
import { toast } from 'sonner';

export const DriverWorkspace = ({ deliveries }: { deliveries?: any[] }) => {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [isPassApproved, setIsPassApproved] = useState(false);

  const stops = (deliveries || []).map((d: any, index: number) => {
    const dateStr = new Date(d.created_at).toISOString().slice(0, 10).replace(/-/g, '');
    const orderId = `VEN-${dateStr}-${String(d.id).padStart(4, '0')}`;
    return {
      id: d.id,
      orderId: orderId,
      customer: 'Customer', // Would come from joined customer table
    society: 'Society Name', // Would come from joined address table
    eta: new Date(d.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    priority: d.risk_score >= 70 ? 'High' : d.risk_score >= 40 ? 'Medium' : 'Low',
    status: index === 0 ? 'Current' : 'Pending',
    risk_score: d.risk_score
    };
  });



  const renderBadge = (priority: string) => {
    switch(priority) {
      case 'High': return <Badge variant="danger" pill>High</Badge>;
      case 'Medium': return <Badge variant="warning" pill>Medium</Badge>;
      default: return <Badge variant="outline" pill>Low</Badge>;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Today's Stops Table */}
      <Card className="shadow-soft">
        <CardHeader className="border-b border-brand-border p-4 bg-brand-background/50">
           <CardTitle className="text-sm font-bold flex items-center gap-2 text-brand-text"><MapPin size={16}/> Today's Stops</CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-brand-background hover:bg-brand-background">
                <TableHead className="w-[80px]">Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Society</TableHead>
                <TableHead>ETA</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stops.map((stop) => (
                <TableRow 
                  key={stop.id} 
                  className={`cursor-pointer transition-colors ${stop.status === 'Current' ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-brand-background/50'}`}
                  onClick={() => setSelectedOrder(stop.orderId)}
                >
                  <TableCell className="font-bold text-brand-text">{stop.orderId}</TableCell>
                  <TableCell className="font-medium text-slate-600 dark:text-slate-300">{stop.customer}</TableCell>
                  <TableCell className="font-medium text-slate-600 dark:text-slate-300">{stop.society}</TableCell>
                  <TableCell className="font-bold text-brand-text">{stop.eta}</TableCell>
                  <TableCell>{renderBadge(stop.priority)}</TableCell>
                  <TableCell>
                    {stop.status === 'Current' ? (
                      <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-ping"></div> Current
                      </div>
                    ) : (
                      <span className="text-xs font-semibold text-slate-400">{stop.status}</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
         {[
           { label: 'Call Customer', icon: Phone, color: 'text-blue-500', bg: 'bg-blue-500/10' },
           { label: 'Chat', icon: MessageSquare, color: 'text-purple-500', bg: 'bg-purple-500/10' },
           { label: 'Navigation', icon: Navigation, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
           { label: 'Request Pass', icon: Key, color: 'text-orange-500', bg: 'bg-orange-500/10' },
           { label: 'Upload POD', icon: Camera, color: 'text-primary', bg: 'bg-primary/10' },
           { label: 'Mark Delivered', icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10' },
           { label: 'Report Issue', icon: AlertTriangle, color: 'text-danger', bg: 'bg-danger/10' },
         ].map((action, idx) => (
           <button key={idx} onClick={() => toast.info(`${action.label} action dispatched.`)} className="bg-brand-card border border-brand-border rounded-xl p-4 flex flex-col items-center justify-center gap-2 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all active:translate-y-0">
             <div className={`w-10 h-10 rounded-full flex items-center justify-center ${action.bg} ${action.color}`}>
               <action.icon size={20} />
             </div>
             <span className="text-xs font-bold text-brand-text text-center">{action.label}</span>
           </button>
         ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Visitor Pass Card */}
        <Card className={`shadow-soft bg-gradient-to-br ${isPassApproved ? 'from-success/5 to-transparent border-success/20' : 'from-orange-500/5 to-transparent border-orange-500/20'}`}>
          <CardHeader className="border-b border-brand-border/50 p-4">
             <CardTitle className={`text-sm font-bold flex items-center gap-2 ${isPassApproved ? 'text-success' : 'text-orange-500'}`}><Key size={16}/> Visitor Pass</CardTitle>
          </CardHeader>
          <CardContent className="p-5 flex flex-col items-center">
            {isPassApproved ? (
              <Badge variant="success" className="mb-4 text-xs">Pass Approved</Badge>
            ) : (
              <Badge variant="warning" className="mb-4 text-xs">Approval Pending</Badge>
            )}
            
            <div className={`w-32 h-32 border-2 ${isPassApproved ? 'border-solid border-success/30 text-success bg-success/5' : 'border-dashed border-orange-500/30 text-orange-500/50 bg-orange-500/5'} rounded-xl flex flex-col items-center justify-center mb-4 transition-all duration-500`}>
               {isPassApproved ? (
                 <>
                   <QrCode size={48} className="mb-2" />
                   <span className="text-[10px] font-bold uppercase tracking-wider">Show at Gate</span>
                 </>
               ) : (
                 <>
                   <Key size={32} className="mb-2"/>
                   <span className="text-[10px] font-bold uppercase tracking-wider">Awaiting QR</span>
                 </>
               )}
            </div>
            <div className="w-full grid grid-cols-2 gap-2 mb-4">
              <div className="bg-brand-card border border-brand-border rounded-lg p-2 text-center">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Gate</span>
                <span className="text-sm font-black text-brand-text">Gate 2</span>
              </div>
              <div className="bg-brand-card border border-brand-border rounded-lg p-2 text-center">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Security</span>
                <span className="text-sm font-black text-brand-text">1234</span>
              </div>
            </div>
            
            {!isPassApproved ? (
              <Button 
                onClick={() => {
                  const toastId = toast.loading('Generating Visitor Pass...');
                  setTimeout(() => {
                    setIsPassApproved(true);
                    toast.success('Visitor Pass Approved & Generated', { id: toastId });
                  }, 1500);
                }} 
                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              >
                Simulate Generation
              </Button>
            ) : (
              <Button variant="outline" className="w-full border-success text-success hover:bg-success/10">
                Share with Security
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Delivery Checklist */}
        <Card className="shadow-soft">
          <CardHeader className="border-b border-brand-border p-4 bg-brand-background/50">
             <CardTitle className="text-sm font-bold flex items-center gap-2 text-brand-text"><CheckCircle2 size={16}/> Delivery Checklist</CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
             {[
               { task: 'Reach Society', status: 'Complete' },
               { task: 'Visitor Pass Approved', status: 'Pending' },
               { task: 'Customer Available', status: 'Pending' },
               { task: 'Package Verified', status: 'Pending' },
               { task: 'Photo Uploaded', status: 'Pending' },
               { task: 'Delivery Completed', status: 'Pending' },
             ].map((item, idx) => (
               <div key={idx} className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border ${item.status === 'Complete' ? 'bg-success text-white border-success' : 'border-slate-300 dark:border-slate-600 text-transparent'}`}>
                     <CheckCircle2 size={12} />
                   </div>
                   <span className={`text-sm font-bold ${item.status === 'Complete' ? 'text-brand-text' : 'text-slate-500'}`}>{item.task}</span>
                 </div>
                 {item.status === 'Complete' ? (
                   <span className="text-[10px] font-bold text-success uppercase tracking-wider">Done</span>
                 ) : (
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending</span>
                 )}
               </div>
             ))}
          </CardContent>
        </Card>
      </div>




      {/* Details Drawer Overlay */}
      <AnimatePresence>
        {selectedOrder && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
              onClick={() => setSelectedOrder(null)}
            />
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full md:w-[400px] bg-brand-card shadow-2xl z-[110] border-l border-brand-border flex flex-col"
            >
              <div className="p-5 border-b border-brand-border flex items-center justify-between bg-brand-background/50">
                <h3 className="text-lg font-black text-brand-text">{selectedOrder}</h3>
                <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-brand-border rounded-full transition-colors text-slate-500 hover:text-brand-text">
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6 flex-1 overflow-y-auto space-y-6">
                
                {/* Risk Alert */}
                <div className="bg-danger/10 border border-danger/20 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-danger">
                    <AlertTriangle size={24} />
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider">Current Risk</p>
                      <p className="text-2xl font-black leading-none">{stops.find(s => s.orderId === selectedOrder)?.risk_score || 0}%</p>
                    </div>
                  </div>
                  <Badge variant="danger">{stops.find(s => s.orderId === selectedOrder)?.priority} Risk</Badge>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Customer</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center"><User size={20}/></div>
                      <p className="text-lg font-bold text-brand-text">Rajeev</p>
                    </div>
                  </div>
                  <div className="h-px w-full bg-brand-border"></div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Phone</p>
                    <p className="text-base font-bold text-brand-text">+91 XXXXX XXXXX</p>
                  </div>
                  <div className="h-px w-full bg-brand-border"></div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Society</p>
                    <p className="text-base font-bold text-brand-text">My Home Bhooja</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Tower</p>
                      <p className="text-base font-bold text-brand-text">B</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Flat</p>
                      <p className="text-base font-bold text-brand-text">1204</p>
                    </div>
                  </div>
                  <div className="h-px w-full bg-brand-border"></div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">ETA</p>
                    <p className="text-xl font-black text-brand-text flex items-center gap-2"><Clock size={20} className="text-primary"/> 3:15 PM</p>
                  </div>
                </div>

              </div>
              <div className="p-5 border-t border-brand-border bg-brand-background/50 grid grid-cols-2 gap-3">
                <Button variant="outline" onClick={() => setSelectedOrder(null)} className="w-full">Cancel</Button>
                <Button onClick={() => { toast.success('Delivery started.'); setSelectedOrder(null); }} className="w-full">Start Delivery</Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};

export default DriverWorkspace;
