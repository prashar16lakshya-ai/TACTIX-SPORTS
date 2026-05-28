import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { usePermission } from '../../hooks/usePermission';
import { collection, query, onSnapshot, orderBy, addDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../context/AuthContext';

import { useAppData } from '../../context/AppDataContext';
const TYPE_CONFIG = {
  player: { icon: 'person', color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20' },
  team: { icon: 'groups', color: 'text-[#FF1493]', bg: 'bg-[#FF1493]/10', border: 'border-[#FF1493]/20' },
  school: { icon: 'school', color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20' },
};

export default function AnnouncementsModule() {
  const { can } = usePermission();
  const { user } = useAuth();
  const { data } = useAppData();
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', description: '', type: 'school' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user?.isDemo) {
      setAchievements(data?.announcements || []);
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'announcements'), orderBy('date', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAchievements(fetched);
      setLoading(false);
    }, () => {
      setAchievements([]);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.isDemo, data?.announcements]);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if(!newPost.title || !newPost.description) return;
    
    setSubmitting(true);
    try {
      if (user?.isDemo) {
        // Simulate network delay for realistic UX
        await new Promise(resolve => setTimeout(resolve, 800));
        alert('Demo Mode: Announcement posted successfully (simulated)!');
        setShowModal(false);
        setNewPost({ title: '', description: '', type: 'school' });
        return;
      }

      await addDoc(collection(db, 'announcements'), {
        title: newPost.title,
        description: newPost.description,
        type: newPost.type,
        date: new Date().toISOString(),
        verified: true,
        createdBy: user?.name || 'Admin',
        relatedPlayers: []
      });
      setShowModal(false);
      setNewPost({ title: '', description: '', type: 'school' });
    } catch (error) {
      console.error('Error posting announcement:', error);
      alert('Failed to post announcement.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 max-w-3xl mx-auto w-full pb-20 px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-3xl font-black text-on-surface uppercase tracking-tight">Announcement and Celebration</h1>
            <p className="text-on-surface/50 text-sm">Official announcements and school victories.</p>
          </div>
          {can('announcements', 'write') && (
            <button 
              onClick={() => setShowModal(true)}
              className="bg-primary hover:bg-primary/90 text-on-surface font-black px-6 py-3 rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all active:scale-95 flex items-center gap-2 text-xs uppercase tracking-widest"
            >
              <span className="material-symbols-outlined text-xl">campaign</span>
              Post Update
            </button>
          )}
        </div>

        {/* Timeline Feed */}
        <div className="relative flex flex-col gap-6 before:absolute before:left-[19px] before:top-4 before:bottom-4 before:w-[2px] before:bg-on-surface/10">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-32 bg-on-surface/5 rounded-2xl border border-white/5 animate-pulse ml-12"></div>
            ))
          ) : (
            achievements.length > 0 ? (
              achievements.map((ach) => (
                <div key={ach.id} className="relative pl-12 group">
                  {/* Timeline Node */}
                  <div className={`absolute left-0 top-1 w-10 h-10 rounded-full ${TYPE_CONFIG[ach.type]?.bg || TYPE_CONFIG.school.bg} border ${TYPE_CONFIG[ach.type]?.border || TYPE_CONFIG.school.border} flex items-center justify-center z-10 shadow-lg`}>
                    <span className={`material-symbols-outlined text-xl ${TYPE_CONFIG[ach.type]?.color || TYPE_CONFIG.school.color}`}>
                      {TYPE_CONFIG[ach.type]?.icon || TYPE_CONFIG.school.icon}
                    </span>
                  </div>

                  {/* Content Card */}
                  <div className="bg-[#111111] border border-outline-variant/30 rounded-2xl p-6 hover:border-primary/50 transition-all relative overflow-hidden group">
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-bold text-on-surface leading-tight group-hover:text-primary transition-colors">{ach.title}</h3>
                        {ach.verified && (
                          <div className="flex items-center gap-1 bg-blue-500/20 border border-blue-500/30 px-2 py-0.5 rounded-full shrink-0">
                            <span className="material-symbols-outlined text-[12px] text-blue-400">verified</span>
                            <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Verified</span>
                          </div>
                        )}
                      </div>
                      
                      <p className="text-on-surface/60 text-sm leading-relaxed">{ach.description}</p>
                      
                      <div className="flex flex-wrap items-center gap-4 mt-2 pt-4 border-t border-white/5">
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-sm text-on-surface/30">calendar_today</span>
                          <span className="text-[10px] font-black text-on-surface/30 uppercase tracking-widest">
                            {new Date(ach.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-sm text-on-surface/30">person_edit</span>
                          <span className="text-[10px] font-black text-on-surface/30 uppercase tracking-widest">By {ach.createdBy}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-on-surface/30 text-center ml-12">
                <span className="material-symbols-outlined text-6xl mb-4">campaign</span>
                <p className="text-sm uppercase tracking-[0.2em] font-black">No Announcements Yet</p>
                <p className="text-xs mt-2 max-w-xs">Stay tuned for official updates, match results, and student achievements.</p>
              </div>
            )
          )}
        </div>
      </div>

      {/* Post Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111111] border border-outline-variant/30 rounded-3xl w-full max-w-lg overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            <div className="p-6 border-b border-outline-variant/30 flex justify-between items-center bg-on-surface/5">
              <h2 className="text-xl font-bold text-on-surface uppercase tracking-wider flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">campaign</span>
                New Update
              </h2>
              <button 
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full bg-on-surface/10 flex items-center justify-center text-on-surface hover:bg-white/20 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            
            <form onSubmit={handlePostSubmit} className="p-6 flex flex-col gap-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface/40 mb-2">Category</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'school', label: 'School', icon: 'school' },
                    { id: 'team', label: 'Team', icon: 'groups' },
                    { id: 'player', label: 'Player', icon: 'person' },
                  ].map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setNewPost({...newPost, type: t.id})}
                      className={`py-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                        newPost.type === t.id 
                        ? 'bg-primary/20 border-primary text-primary shadow-[0_0_15px_rgba(168,85,247,0.2)]' 
                        : 'bg-on-surface/5 border-outline-variant/30 text-on-surface/60 hover:bg-on-surface/10'
                      }`}
                    >
                      <span className="material-symbols-outlined">{t.icon}</span>
                      <span className="text-[10px] font-bold uppercase">{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface/40 mb-2">Title</label>
                <input
                  type="text"
                  required
                  value={newPost.title}
                  onChange={e => setNewPost({...newPost, title: e.target.value})}
                  className="w-full bg-[#1A1A1A] border border-outline-variant/30 rounded-xl p-4 text-on-surface font-lexend outline-none focus:border-primary transition-colors"
                  placeholder="e.g., Regional Tournament Results"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface/40 mb-2">Details</label>
                <textarea
                  required
                  value={newPost.description}
                  onChange={e => setNewPost({...newPost, description: e.target.value})}
                  className="w-full bg-[#1A1A1A] border border-outline-variant/30 rounded-xl p-4 text-on-surface font-lexend outline-none focus:border-primary transition-colors min-h-[120px] resize-none"
                  placeholder="Share the full details of this announcement..."
                />
              </div>

              <div className="flex gap-4 mt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-4 rounded-xl font-bold uppercase tracking-widest text-xs bg-on-surface/5 text-on-surface hover:bg-on-surface/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !newPost.title || !newPost.description}
                  className="flex-1 py-4 rounded-xl font-bold uppercase tracking-widest text-xs bg-primary text-on-primary hover:bg-primary/90 transition-colors disabled:opacity-50 shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                >
                  {submitting ? 'Posting...' : 'Post Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
