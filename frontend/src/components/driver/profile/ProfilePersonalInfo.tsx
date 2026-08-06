import { useState } from 'react';
import { toast } from 'sonner';
import { User, Phone, Mail, Calendar, MapPin, Heart, AlertCircle, FileText } from 'lucide-react';
import { ProfileEditModal } from './modals/ProfileEditModal';

export const ProfilePersonalInfo = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [personalInfo, setPersonalInfo] = useState({
    fullName: "John Doe",
    phone: "+1 (555) 123-4567",
    email: "john.doe@example.com",
    dob: "15 Oct 1988",
    gender: "Male",
    address: "123 Delivery Lane, NY 10001",
    emergencyContact: "Jane Doe (+1 555 987 6543)",
    licenseNumber: "DL-987654321",
    licenseExpiry: "24 Dec 2028"
  });

  const fields = [
    { label: "Full Name", value: personalInfo.fullName, icon: User, key: 'fullName' },
    { label: "Phone Number", value: personalInfo.phone, icon: Phone, key: 'phone' },
    { label: "Email Address", value: personalInfo.email, icon: Mail, key: 'email' },
    { label: "Date of Birth", value: personalInfo.dob, icon: Calendar, key: 'dob' },
    { label: "Gender", value: personalInfo.gender, icon: User, key: 'gender' },
    { label: "Home Address", value: personalInfo.address, icon: MapPin, key: 'address' },
    { label: "Emergency Contact", value: personalInfo.emergencyContact, icon: Heart, key: 'emergencyContact' },
    { label: "License Number", value: personalInfo.licenseNumber, icon: FileText, key: 'licenseNumber' },
    { label: "License Expiry", value: personalInfo.licenseExpiry, icon: AlertCircle, key: 'licenseExpiry' },
  ];

  return (
    <div className="rounded-2xl border border-brand-border bg-brand-card p-6 shadow-soft h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-base font-bold text-brand-text">Personal Information</h2>
        <button className="text-xs font-bold text-primary hover:text-primary/80 transition-colors" onClick={() => setIsModalOpen(true)}>Edit</button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fields.map((field, idx) => {
          const Icon = field.icon;
          return (
            <div key={idx}>
              <span className="text-[10px] font-bold text-muted uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                <Icon size={12} /> {field.label}
              </span>
              <p className="text-sm font-semibold text-brand-text bg-brand-background/50 border border-brand-border p-2.5 rounded-lg">
                {field.value}
              </p>
            </div>
          );
        })}
      </div>
      <ProfileEditModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        defaultValues={personalInfo}
        onSave={(data) => setPersonalInfo(data)}
      />
    </div>
  );
};
export default ProfilePersonalInfo;
