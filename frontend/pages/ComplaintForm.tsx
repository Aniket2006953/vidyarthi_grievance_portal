import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { toast } from 'sonner';
import { 
  Send, 
  Paperclip, 
  AlertCircle, 
  BookOpen, 
  Home, 
  Utensils, 
  Cpu, 
  MoreHorizontal,
  ChevronLeft,
  GraduationCap,
  Library,
  ShieldAlert,
  Building
} from 'lucide-react';
import { motion } from 'motion/react';

export default function ComplaintForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Academic'
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('category', formData.category);
    if (file) data.append('file', file);

    try {
      await api.post('/complaints', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Grievance submitted successfully!');
      navigate('/');
    } catch (error) {
      toast.error('Failed to submit grievance');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'Academic', icon: BookOpen, color: 'text-blue-600 bg-blue-50' },
    { id: 'Hostel', icon: Home, color: 'text-orange-600 bg-orange-50' },
    { id: 'Mess', icon: Utensils, color: 'text-green-600 bg-green-50' },
    { id: 'Scholarship', icon: GraduationCap, color: 'text-purple-600 bg-purple-50' },
    { id: 'Library', icon: Library, color: 'text-amber-600 bg-amber-50' },
    { id: 'Ragging', icon: ShieldAlert, color: 'text-red-600 bg-red-50' },
    { id: 'Infrastructure', icon: Building, color: 'text-cyan-600 bg-cyan-50' },
    { id: 'Technical', icon: Cpu, color: 'text-indigo-600 bg-indigo-50' },
    { id: 'Other', icon: MoreHorizontal, color: 'text-slate-600 bg-slate-50' },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-slate-500 hover:text-indigo-600 font-medium mb-6 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Dashboard
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden"
      >
        <div className="bg-indigo-600 px-8 py-6 text-white">
          <h1 className="text-2xl font-bold">File a New Grievance</h1>
          <p className="text-indigo-100 mt-1 opacity-90">Please provide clear details for faster resolution by the authorities.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Category Selection */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider">Select Grievance Category</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: cat.id })}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all gap-2 ${
                    formData.category === cat.id
                      ? 'border-indigo-600 bg-indigo-50 shadow-md shadow-indigo-100'
                      : 'border-slate-100 bg-white hover:border-slate-200'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${cat.color}`}>
                    <cat.icon className="w-6 h-6" />
                  </div>
                  <span className={`text-[10px] font-bold text-center ${formData.category === cat.id ? 'text-indigo-700' : 'text-slate-600'}`}>
                    {cat.id}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Subject / Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="e.g. Issue with semester results / Hostel water supply"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Detailed Description</label>
              <textarea
                required
                rows={5}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
                placeholder="Explain your concern in detail. Include dates, locations, or names if relevant..."
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Supporting Documents (Optional)</label>
              <div className="relative group">
                <input
                  type="file"
                  onChange={(e) => {
                    const selectedFile = e.target.files?.[0] || null;
                    if (selectedFile && selectedFile.size > 5 * 1024 * 1024) {
                      toast.error('File size exceeds 5MB limit');
                      e.target.value = '';
                      return;
                    }
                    setFile(selectedFile);
                  }}
                  className="hidden"
                  id="file-upload"
                  accept="image/*,.pdf,.doc,.docx"
                />
                <label
                  htmlFor="file-upload"
                  className="flex items-center justify-center w-full px-4 py-4 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-all group"
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="bg-slate-100 p-2 rounded-lg group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                      <Paperclip className="w-6 h-6 text-slate-400 group-hover:text-indigo-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-500 group-hover:text-indigo-700">
                      {file ? file.name : 'Click to upload photo or document'}
                    </span>
                    <span className="text-xs text-slate-400">Max size: 5MB (Images, PDF, DOC)</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100 mb-8">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800">
                <strong>Anti-Ragging Policy:</strong> Ragging is a criminal offence. Use the 'Ragging' category for immediate attention by the Anti-Ragging Committee.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting Grievance...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Submit Grievance
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
