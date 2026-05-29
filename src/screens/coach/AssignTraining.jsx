import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import TopBar from '../../components/TopBar';
import BottomNav from '../../components/BottomNav';

export default function AssignTraining() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data } = useAppData();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '60 min',
    difficulty: 'High',
    type: 'Physical',
    equipment: '',
    assignType: 'team', // team, specific, individual
    teamId: data?.groups?.[0]?.id || '',
    startDate: '',
    dueDate: '',
  });

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!formData.title) return alert('Title is required');
    
    setLoading(true);
    try {

      await addDoc(collection(db, 'trainings'), {
        ...formData,
        coachId: user?.uid || 'unknown',
        createdAt: serverTimestamp(),
        status: 'active'
      });
      alert('Training assigned successfully!');
      navigate(-1);
    } catch (err) {
      console.error(err);
      alert('Error assigning training');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh bg-background flex flex-col font-lexend pb-24">
      <TopBar showBack title="Assign Training" subtitle="Create and assign training for your team" />
      
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 mt-6 flex flex-col gap-6">
        <form onSubmit={handleAssign} className="flex flex-col gap-6">
          
          {/* Training Details */}
          <section className="bg-surface-container-low border border-white/5 rounded-2xl p-5 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#DC143C]/10 blur-3xl pointer-events-none rounded-full"></div>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-[#DC143C]/20 flex items-center justify-center text-[#DC143C]">
                <span className="material-symbols-outlined text-[16px]">fitness_center</span>
              </div>
              <h2 className="text-on-surface font-bold text-lg">Training Details</h2>
            </div>

            <div className="flex flex-col gap-5">
              {/* Title */}
              <div className="flex flex-col gap-2">
                <label className="text-xs text-on-surface/60">Training Title</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={formData.title}
                    onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Speed & Agility Drills"
                    className="w-full bg-[#111111] border border-outline-variant/30 rounded-xl p-4 text-on-surface outline-none focus:border-[#DC143C] transition-colors pr-16"
                    maxLength={60}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-on-surface/30">{formData.title.length}/60</span>
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-2">
                <label className="text-xs text-on-surface/60">Description</label>
                <div className="relative">
                  <textarea 
                    value={formData.description}
                    onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="High intensity speed and agility drills..."
                    className="w-full bg-[#111111] border border-outline-variant/30 rounded-xl p-4 text-on-surface outline-none focus:border-[#DC143C] transition-colors resize-none h-24"
                    maxLength={200}
                  />
                  <span className="absolute right-4 bottom-4 text-xs text-on-surface/30">{formData.description.length}/200</span>
                </div>
              </div>

              {/* 2-col Grid: Duration & Difficulty */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-on-surface/60 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-[#FF1493]">schedule</span> Duration
                  </label>
                  <div className="relative">
                    <select 
                      value={formData.duration}
                      onChange={e => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                      className="w-full bg-[#111111] border border-outline-variant/30 rounded-xl p-4 text-on-surface outline-none focus:border-[#DC143C] appearance-none"
                    >
                      <option>30 min</option>
                      <option>45 min</option>
                      <option>60 min</option>
                      <option>90 min</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface/40 pointer-events-none">expand_more</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs text-on-surface/60 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-[#FF1493]">bar_chart</span> Difficulty
                  </label>
                  <div className="relative">
                    <select 
                      value={formData.difficulty}
                      onChange={e => setFormData(prev => ({ ...prev, difficulty: e.target.value }))}
                      className={`w-full bg-[#111111] border border-outline-variant/30 rounded-xl p-4 outline-none focus:border-[#DC143C] appearance-none ${formData.difficulty === 'High' ? 'text-red-400' : formData.difficulty === 'Medium' ? 'text-yellow-400' : 'text-green-400'}`}
                    >
                      <option>Low</option>
                      <option>Medium</option>
                      <option className="text-red-400">High</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface/40 pointer-events-none">expand_more</span>
                  </div>
                </div>
              </div>

              {/* 2-col Grid: Type & Equipment */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-on-surface/60 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-[#FF1493]">directions_run</span> Training Type
                  </label>
                  <div className="relative">
                    <select 
                      value={formData.type}
                      onChange={e => setFormData(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full bg-[#111111] border border-outline-variant/30 rounded-xl p-4 text-on-surface outline-none focus:border-[#DC143C] appearance-none"
                    >
                      <option>Physical</option>
                      <option>Tactical</option>
                      <option>Technical</option>
                      <option>Recovery</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface/40 pointer-events-none">expand_more</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs text-on-surface/60 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-[#FF1493]">settings</span> Equipment (Optional)
                  </label>
                  <input 
                    type="text" 
                    value={formData.equipment}
                    onChange={e => setFormData(prev => ({ ...prev, equipment: e.target.value }))}
                    placeholder="Cones, Ladder, Hurdles"
                    className="w-full bg-[#111111] border border-outline-variant/30 rounded-xl p-4 text-on-surface outline-none focus:border-[#DC143C] transition-colors"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Assign To */}
          <section className="bg-surface-container-low border border-white/5 rounded-2xl p-5 shadow-lg relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-[#DC143C]/20 flex items-center justify-center text-[#DC143C]">
                <span className="material-symbols-outlined text-[16px]">group</span>
              </div>
              <h2 className="text-on-surface font-bold text-lg">Assign To</h2>
            </div>

            <div className="flex gap-2 p-1 bg-[#111111] rounded-2xl border border-white/5 mb-5">
              <button type="button" onClick={() => setFormData({...formData, assignType: 'team'})} className={`flex-1 py-3 text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2 ${formData.assignType === 'team' ? 'bg-[#FF1493] text-on-surface shadow-lg' : 'text-on-surface/40 hover:text-on-surface/80'}`}>
                Entire Team {formData.assignType === 'team' && <span className="material-symbols-outlined text-[16px] bg-white text-[#FF1493] rounded-full">check_circle</span>}
              </button>
              <button type="button" onClick={() => setFormData({...formData, assignType: 'specific'})} className={`flex-1 py-3 text-sm font-bold rounded-xl transition-colors ${formData.assignType === 'specific' ? 'bg-on-surface/10 text-on-surface' : 'text-on-surface/40 hover:text-on-surface/80'}`}>
                Specific Players
              </button>
              <button type="button" onClick={() => setFormData({...formData, assignType: 'individual'})} className={`flex-1 py-3 text-sm font-bold rounded-xl transition-colors ${formData.assignType === 'individual' ? 'bg-on-surface/10 text-on-surface' : 'text-on-surface/40 hover:text-on-surface/80'}`}>
                Individual
              </button>
            </div>

            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center overflow-hidden">
                <span className="material-symbols-outlined text-[14px] text-green-500">sports_soccer</span>
              </div>
              <select 
                value={formData.teamId}
                onChange={e => setFormData(prev => ({ ...prev, teamId: e.target.value }))}
                className="w-full bg-[#111111] border border-outline-variant/30 rounded-xl p-4 pl-16 text-on-surface font-bold outline-none focus:border-[#DC143C] appearance-none"
              >
                {data?.groups?.map(g => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface/40 pointer-events-none">expand_more</span>
            </div>
          </section>

          {/* Schedule */}
          <section className="bg-surface-container-low border border-white/5 rounded-2xl p-5 shadow-lg relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-[#DC143C]/20 flex items-center justify-center text-[#DC143C]">
                <span className="material-symbols-outlined text-[16px]">calendar_today</span>
              </div>
              <h2 className="text-on-surface font-bold text-lg">Schedule</h2>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-5">
              <div className="flex flex-col gap-2">
                <label className="text-xs text-on-surface/60">Start Date</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface/40 text-[18px]">calendar_month</span>
                  <input 
                    type="date" 
                    value={formData.startDate}
                    onChange={e => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full bg-[#111111] border border-outline-variant/30 rounded-xl p-4 pl-12 pr-10 text-on-surface outline-none focus:border-[#DC143C] [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                  />
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface/40 pointer-events-none">expand_more</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs text-on-surface/60">Due Date</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface/40 text-[18px]">calendar_month</span>
                  <input 
                    type="date" 
                    value={formData.dueDate}
                    onChange={e => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="w-full bg-[#111111] border border-outline-variant/30 rounded-xl p-4 pl-12 pr-10 text-on-surface outline-none focus:border-[#DC143C] [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                  />
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface/40 pointer-events-none">expand_more</span>
                </div>
              </div>
            </div>

            <div className="bg-[#DC143C]/10 border border-[#DC143C]/20 rounded-xl p-4 flex gap-3 text-[#FF1493]">
              <span className="material-symbols-outlined text-[20px]">event_available</span>
              <p className="text-sm">Training will be visible to players from the start date until the due date.</p>
            </div>
          </section>

          <button 
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-gradient-to-r from-[#FF1493] to-[#FF1493] text-on-surface font-bold text-lg rounded-full flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 mt-2"
          >
            {loading ? (
              <span className="material-symbols-outlined animate-spin">refresh</span>
            ) : (
              <>
                <span className="material-symbols-outlined">send</span>
                Assign Training
              </>
            )}
          </button>
        </form>
      </main>

      <BottomNav />
    </div>
  );
}
