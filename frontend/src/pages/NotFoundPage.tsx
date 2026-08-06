import { useNavigate } from 'react-router-dom';
import { Compass, MoveLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-10rem)] flex flex-col items-center justify-center p-6 text-center select-none">
      {/* 3D-like Glowing Icon Circle */}
      <div className="relative mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-slate-100/50 border border-slate-200 shadow-soft">
        <div className="absolute inset-0 rounded-full bg-primary/5 blur-md" />
        <Compass size={44} className="stroke-[1.5] text-primary animate-float" />
      </div>

      {/* Title */}
      <h1 className="text-5xl font-black text-slate-900 tracking-tighter">
        404
      </h1>
      
      {/* Message */}
      <h2 className="text-xl font-bold text-slate-800 tracking-tight mt-3">
        Waypoint Not Found
      </h2>
      
      <p className="text-slate-500 text-sm max-w-sm mt-2 leading-relaxed">
        The coordinates you entered do not match any active logistical route. Let's redirect you back to base.
      </p>

      {/* Redirect buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mt-8">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(-1)}
          leftIcon={<MoveLeft size={16} />}
        >
          Go Back
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate('/dashboard')}
          leftIcon={<Home size={16} />}
        >
          Return Base
        </Button>
      </div>
    </div>
  );
};
export default NotFoundPage;
