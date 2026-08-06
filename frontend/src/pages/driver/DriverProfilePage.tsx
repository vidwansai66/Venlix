import { useState, useEffect } from 'react';
import ProfileHeader from '@/components/driver/profile/ProfileHeader';
import ProfilePersonalInfo from '@/components/driver/profile/ProfilePersonalInfo';
import ProfileVehicleInfo from '@/components/driver/profile/ProfileVehicleInfo';
import ProfileWorkInfo from '@/components/driver/profile/ProfileWorkInfo';
import ProfileSettings from '@/components/driver/profile/ProfileSettings';
import ProfileDocuments from '@/components/driver/profile/ProfileDocuments';
import ProfileSupport from '@/components/driver/profile/ProfileSupport';
import ProfileDangerZone from '@/components/driver/profile/ProfileDangerZone';
import { ChangePasswordModal } from '@/components/driver/profile/modals/ChangePasswordModal';

export const DriverProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // Simulate network request
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-brand-text tracking-tight">Profile & Settings</h1>
        <p className="text-muted mt-1 text-sm font-medium">
          Manage your personal information, vehicle details, and preferences.
        </p>
      </div>

      {loading ? (
        // Skeleton Layout
        <div className="space-y-6">
          <div className="h-[250px] rounded-3xl bg-brand-card animate-pulse border border-brand-border"></div>
          <div className="h-[350px] rounded-2xl bg-brand-card animate-pulse border border-brand-border"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="h-[300px] rounded-2xl bg-brand-card animate-pulse border border-brand-border"></div>
             <div className="h-[300px] rounded-2xl bg-brand-card animate-pulse border border-brand-border"></div>
          </div>
        </div>
      ) : (
        <>
          <ProfileHeader />

          <ProfilePersonalInfo />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProfileVehicleInfo />
            <ProfileWorkInfo />
          </div>

          <ProfileSettings onChangePasswordModal={() => setIsPasswordModalOpen(true)} />

          <ProfileDocuments />

          <ProfileSupport />

          <ProfileDangerZone />

          <ChangePasswordModal 
            isOpen={isPasswordModalOpen} 
            onClose={() => setIsPasswordModalOpen(false)} 
          />
        </>
      )}
    </div>
  );
};

export default DriverProfilePage;
