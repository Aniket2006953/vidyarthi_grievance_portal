import React, { useEffect, useState } from 'react';
import { useAuth } from '../lib/AuthContext';
import api from '../lib/api';
import { toast } from 'sonner';
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  Search, 
  Filter, 
  Trash2, 
  ExternalLink,
  BarChart3,
  AlertCircle,
  Calendar,
  ShieldCheck,
  User as UserIcon,
  GraduationCap,
  Hash
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Complaint {
  id: number;
  title: string;
  description: string;
  category: string;
  status: 'Pending' | 'In Progress' | 'Resolved' | 'Rejected';
  file_path: string | null;
  admin_remarks: string | null;
  created_at: string;
  student_name?: string;
  department?: string;
  semester?: string;
  roll_number?: string;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterDepartment, setFilterDepartment] = useState('All');
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetchComplaints();
    if (user?.role === 'admin') fetchStats();
  }, [user]);

  const fetchComplaints = async () => {
    try {
      const res = await api.get('/complaints');
      setComplaints(res.data);
    } catch (error) {
      toast.error('Failed to load grievances');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await api.get('/complaints/stats');
      setStats(res.data);
    } catch (error) {
      console.error('Failed to load stats');
    }
  };

  const handleUpdateStatus = async (id: number, status: string, remarks: string) => {
    try {
      await api.patch(`/complaints/${id}/status`, { status, remarks });
      toast.success('Status updated successfully');
      fetchComplaints();
      fetchStats();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this grievance?')) return;
    try {
      await api.delete(`/complaints/${id}`);
      toast.success('Grievance deleted');
      fetchComplaints();
      if (user?.role === 'admin') fetchStats();
    } catch (error) {
      toast.error('Failed to delete grievance');
    }
  };

  const filteredComplaints = complaints.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) || 
                         c.description.toLowerCase().includes(search.toLowerCase()) ||
                         (c.student_name && c.student_name.toLowerCase().includes(search.toLowerCase())) ||
                         (c.roll_number && c.roll_number.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = filterCategory === 'All' || c.category === filterCategory;
    const matchesStatus = filterStatus === 'All' || c.status === filterStatus;
    const matchesDepartment = filterDepartment === 'All' || c.department === filterDepartment;
    return matchesSearch && matchesCategory && matchesStatus && matchesDepartment;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'In Progress': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Resolved': return 'bg-green-100 text-green-700 border-green-200';
      case 'Rejected': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending': return <Clock className="w-4 h-4" />;
      case 'In Progress': return <Loader2 className="w-4 h-4 animate-spin" />;
      case 'Resolved': return <CheckCircle2 className="w-4 h-4" />;
      case 'Rejected': return <XCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Loading Grievance Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            {user?.role === 'admin' ? 'Authority Dashboard' : 'My Grievances'}
          </h1>
          <p className="text-slate-500 mt-1">
            {user?.role === 'admin' 
              ? 'Grievance Redressal System - Admin Panel' 
              : 'Track and manage your submitted grievances'}
          </p>
        </div>
        
        {user?.role === 'admin' && stats && (
          <div className="flex gap-4 overflow-x-auto pb-2 md:pb-0">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center gap-3 min-w-[140px]">
              <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase">Total</p>
                <p className="text-xl font-bold text-slate-900">{complaints.length}</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center gap-3 min-w-[140px]">
              <div className="bg-yellow-100 p-2 rounded-lg text-yellow-600">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase">Pending</p>
                <p className="text-xl font-bold text-slate-900">
                  {complaints.filter(c => c.status === 'Pending').length}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by subject, student name or roll number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
          >
            <option value="All">All Categories</option>
            <option value="Academic">Academic</option>
            <option value="Hostel">Hostel</option>
            <option value="Mess">Mess</option>
            <option value="Scholarship">Scholarship</option>
            <option value="Library">Library</option>
            <option value="Ragging">Ragging</option>
            <option value="Infrastructure">Infrastructure</option>
            <option value="Technical">Technical</option>
            <option value="Other">Other</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Rejected">Rejected</option>
          </select>
          {user?.role === 'admin' && (
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
            >
              <option value="All">All Branches</option>
              <option value="CSE">CSE</option>
              <option value="IT">IT</option>
              <option value="AIDS">AIDS</option>
              <option value="IoT (CSE)">IoT (CSE)</option>
              <option value="ENTC">ENTC</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Electrical">Electrical</option>
              <option value="Civil">Civil</option>
              <option value="MBA">MBA</option>
              <option value="MTech">MTech</option>
              <option value="Other">Other</option>
            </select>
          )}
        </div>
      </div>

      {/* Complaints List */}
      <div className="grid grid-cols-1 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredComplaints.length > 0 ? (
            filteredComplaints.map((complaint) => (
              <motion.div
                key={complaint.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase rounded tracking-wider">
                          {complaint.category}
                        </span>
                        <span className={cn(
                          "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border",
                          getStatusColor(complaint.status)
                        )}>
                          {getStatusIcon(complaint.status)}
                          {complaint.status}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900">{complaint.title}</h3>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-500 text-sm">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {complaint.created_at ? format(new Date(complaint.created_at), 'MMM d, yyyy') : 'Unknown Date'}
                        </span>
                        {user?.role === 'admin' && (
                          <>
                            <span className="flex items-center gap-1 font-medium text-indigo-600">
                              <UserIcon className="w-4 h-4" />
                              {complaint.student_name}
                            </span>
                            <span className="flex items-center gap-1 text-slate-400">
                              <Hash className="w-4 h-4" />
                              {complaint.roll_number}
                            </span>
                            <span className="flex items-center gap-1 text-slate-400">
                              <GraduationCap className="w-4 h-4" />
                              {complaint.department} ({complaint.semester})
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      {complaint.file_path && (
                        <a
                          href={complaint.file_path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="View Attachment"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      )}
                      {(user?.role === 'admin' || (user?.role === 'student' && complaint.status === 'Pending')) && (
                        <button
                          onClick={() => handleDelete(complaint.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-slate-600 leading-relaxed mb-6">
                    {complaint.description}
                  </p>

                  {complaint.admin_remarks && (
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mb-6">
                      <div className="flex items-center gap-2 text-slate-900 font-bold text-sm mb-1">
                        <ShieldCheck className="w-4 h-4 text-indigo-600" />
                        Authority Response
                      </div>
                      <p className="text-slate-600 text-sm italic">"{complaint.admin_remarks}"</p>
                    </div>
                  )}

                  {user?.role === 'admin' && (
                    <div className="pt-6 border-t border-slate-100">
                      <AdminActionPanel 
                        complaint={complaint} 
                        onUpdate={handleUpdateStatus} 
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 py-20 text-center">
              <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No grievances found</h3>
              <p className="text-slate-500">Try adjusting your filters or search query.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function AdminActionPanel({ complaint, onUpdate }: { complaint: Complaint, onUpdate: any }) {
  const [status, setStatus] = useState(complaint.status);
  const [remarks, setRemarks] = useState(complaint.admin_remarks || '');
  const [isEditing, setIsEditing] = useState(false);

  if (!isEditing) {
    return (
      <button
        onClick={() => setIsEditing(true)}
        className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
      >
        Take Action / Update Status
      </button>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">New Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Official Remarks</label>
          <input
            type="text"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Add official comment..."
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => {
            onUpdate(complaint.id, status, remarks);
            setIsEditing(false);
          }}
          className="px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Update Grievance
        </button>
        <button
          onClick={() => setIsEditing(false)}
          className="px-4 py-2 bg-slate-100 text-slate-600 text-sm font-bold rounded-lg hover:bg-slate-200 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
