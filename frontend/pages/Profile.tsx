import React, { useState, useRef } from 'react';
import { useAuth } from '../lib/AuthContext';
import api from '../lib/api';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { 
  User, 
  Mail, 
  Shield, 
  Building2, 
  GraduationCap, 
  Calendar,
  Settings,
  Bell,
  Hash,
  Camera,
  Edit2,
  Save,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    department: user?.department || '',
    semester: user?.semester || '',
    roll_number: user?.roll_number || ''
  });

  if (!user) return null;

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('photo', file);

    setPhotoLoading(true);
    try {
      await api.post('/auth/profile/photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      await refreshUser();
      toast.success('Profile photo updated successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update photo');
    } finally {
      setPhotoLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.patch('/auth/profile', formData);
      await refreshUser();
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const departments = [
    'Computer Science (CSE)',
    'Information Technology (IT)',
    'Mechanical Engineering',
    'Electrical Engineering',
    'Electronics & Telecommunication (ENTC)',
    'AI & Data Science (AIDS)',
    'IoT (CSE)',
    'MBA',
    'M.Tech'
  ];

  const semesters = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
          <p className="text-slate-500 mt-1">Manage your account information and academic details</p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${
            isEditing 
              ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' 
              : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200'
          }`}
        >
          {isEditing ? (
            <><X className="w-4 h-4" /> Cancel</>
          ) : (
            <><Edit2 className="w-4 h-4" /> Edit Profile</>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1 space-y-6"
        >
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="h-24 bg-indigo-600" />
            <div className="px-6 pb-6 -mt-12 text-center">
              <div className="relative inline-block p-1 bg-white rounded-2xl shadow-lg mb-4 group">
                <div className="bg-slate-100 w-24 h-24 rounded-xl flex items-center justify-center overflow-hidden relative">
                  {user.profile_photo ? (
                    <img 
                      src={user.profile_photo} 
                      alt={user.name} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <User className="w-12 h-12 text-slate-400" />
                  )}
                  
                  {photoLoading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
                
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 p-2 bg-white rounded-lg shadow-md border border-slate-100 text-indigo-600 hover:text-indigo-700 transition-colors"
                  disabled={photoLoading}
                >
                  <Camera className="w-4 h-4" />
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handlePhotoUpload} 
                  className="hidden" 
                  accept="image/*"
                />
              </div>
              <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
              <p className="text-indigo-600 font-semibold text-sm uppercase tracking-wider">
                {user.role === 'admin' ? 'Authority / Admin' : 'Vidyarthi (Student)'}
              </p>
            </div>
            <div className="border-t border-slate-100 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Account Status</span>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold uppercase rounded">Verified</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Settings className="w-4 h-4 text-slate-400" />
              Account Actions
            </h3>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                Change Password
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                Grievance Alerts
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors">
                Logout from all devices
              </button>
            </div>
          </div>
        </motion.div>

        {/* Details Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 space-y-6"
        >
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">
                {isEditing ? 'Update Profile Details' : 'Academic & Personal Details'}
              </h3>
            </div>
            
            <AnimatePresence mode="wait">
              {isEditing ? (
                <motion.form
                  key="edit-form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  onSubmit={handleUpdateProfile}
                  className="p-6 space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Full Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2 opacity-60">
                      <label className="text-sm font-bold text-slate-700">Email Address (Read-only)</label>
                      <input
                        type="email"
                        disabled
                        value={user.email}
                        className="w-full px-4 py-2 bg-slate-100 border border-slate-200 rounded-xl outline-none cursor-not-allowed"
                      />
                    </div>
                    
                    {user.role === 'student' && (
                      <>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700">Roll Number</label>
                          <input
                            type="text"
                            required
                            value={formData.roll_number}
                            onChange={(e) => setFormData({ ...formData, roll_number: e.target.value })}
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700">Department / Branch</label>
                          <select
                            required
                            value={formData.department}
                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                          >
                            <option value="">Select Branch</option>
                            {departments.map(dept => (
                              <option key={dept} value={dept}>{dept}</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700">Current Semester</label>
                          <select
                            required
                            value={formData.semester}
                            onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                          >
                            <option value="">Select Semester</option>
                            {semesters.map(sem => (
                              <option key={sem} value={sem}>{sem}</option>
                            ))}
                          </select>
                        </div>
                      </>
                    )}
                  </div>
                  
                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-lg shadow-indigo-100"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <><Save className="w-4 h-4" /> Save Changes</>
                      )}
                    </button>
                  </div>
                </motion.form>
              ) : (
                <motion.div
                  key="view-details"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <InfoItem icon={User} label="Full Name" value={user.name} />
                  <InfoItem icon={Mail} label="Email Address" value={user.email} />
                  <InfoItem icon={Shield} label="User Role" value={user.role.charAt(0).toUpperCase() + user.role.slice(1)} />
                  
                  {user.role === 'student' && (
                    <>
                      <InfoItem icon={Hash} label="Roll Number" value={user.roll_number || 'N/A'} />
                      <InfoItem icon={Building2} label="Department / Branch" value={user.department || 'N/A'} />
                      <InfoItem icon={GraduationCap} label="Current Semester" value={user.semester || 'N/A'} />
                    </>
                  )}
                  
                  <InfoItem icon={Calendar} label="Registration Date" value={user.created_at ? format(new Date(user.created_at), 'MMMM yyyy') : 'N/A'} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900">Recent Notifications</h3>
              <button className="text-sm font-bold text-indigo-600 hover:underline">Mark as Read</button>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <ActivityItem 
                  icon={Bell} 
                  title="Grievance Resolved" 
                  desc="Your grievance regarding 'Library Fine' has been resolved by the Librarian." 
                  time="1 hour ago" 
                />
                <ActivityItem 
                  icon={Shield} 
                  title="Anti-Ragging Update" 
                  desc="The college has updated the anti-ragging guidelines for the new semester." 
                  time="2 days ago" 
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
        <Icon className="w-3 h-3" />
        {label}
      </p>
      <p className="text-slate-900 font-medium">{value}</p>
    </div>
  );
}

function ActivityItem({ icon: Icon, title, desc, time }: { icon: any, title: string, desc: string, time: string }) {
  return (
    <div className="flex gap-4">
      <div className="bg-slate-50 p-2 rounded-lg h-fit">
        <Icon className="w-5 h-5 text-slate-400" />
      </div>
      <div>
        <h4 className="text-sm font-bold text-slate-900">{title}</h4>
        <p className="text-sm text-slate-500 mt-0.5">{desc}</p>
        <p className="text-xs text-slate-400 mt-1">{time}</p>
      </div>
    </div>
  );
}
