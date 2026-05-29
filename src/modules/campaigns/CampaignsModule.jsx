import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../../components/TopBar';
import BottomNav from '../../components/BottomNav';
import { useAppData } from '../../context/AppDataContext';
import EmptyState from '../../components/common/EmptyState';

export default function CampaignsModule() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All Campaigns');
  const { data } = useAppData();
  const campaigns = data?.campaigns || [];

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesTab = activeTab === 'All Campaigns' || campaign.status === activeTab;
    const matchesSearch = campaign.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          campaign.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const activeCount = campaigns.filter(c => c.status === 'Active').length;
  const upcomingCount = campaigns.filter(c => c.status === 'Upcoming').length;
  const completedCount = campaigns.filter(c => c.status === 'Completed').length;

  return (
    <div className="min-h-dvh bg-background flex flex-col font-lexend pb-24">
      <TopBar 
        showBack 
        title="Campaigns" 
        subtitle="Create, manage and track your campaigns"
        trailingIcon="add"
        onTrailingIconClick={() => alert('Add Campaign clicked')} // Placeholder for create modal
      />
      
      {/* Top action button logic inside TopBar uses a small icon, but the mockup has a prominent floating '+' icon.
          We can override TopBar or just add a custom + button. TopBar has trailingIcon logic. 
          To match mockup's large + button exactly, we can use an absolute element, but TopBar works for now. */}
          
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 mt-4 flex flex-col gap-6">
        
        {/* Stat Cards */}
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-[#111111] rounded-2xl p-4 flex flex-col justify-center items-center relative overflow-hidden border border-white/5">
            <span className="material-symbols-outlined text-[#FF1493] text-[24px] absolute left-3 top-3">rocket_launch</span>
            <div className="text-3xl font-black text-on-surface mt-4">{campaigns.length}</div>
            <div className="text-[10px] text-on-surface/50 uppercase tracking-wider mt-1">Total Campaigns</div>
          </div>
          <div className="bg-[#111111] rounded-2xl p-4 flex flex-col justify-center items-center relative overflow-hidden border border-white/5">
            <span className="material-symbols-outlined text-green-400 text-[24px] absolute left-3 top-3">play_arrow</span>
            <div className="text-3xl font-black text-green-400 mt-4">{activeCount}</div>
            <div className="text-[10px] text-on-surface/50 uppercase tracking-wider mt-1">Active</div>
          </div>
          <div className="bg-[#111111] rounded-2xl p-4 flex flex-col justify-center items-center relative overflow-hidden border border-white/5">
            <span className="material-symbols-outlined text-orange-400 text-[24px] absolute left-3 top-3">schedule</span>
            <div className="text-3xl font-black text-orange-400 mt-4">{upcomingCount}</div>
            <div className="text-[10px] text-on-surface/50 uppercase tracking-wider mt-1">Upcoming</div>
          </div>
          <div className="bg-[#111111] rounded-2xl p-4 flex flex-col justify-center items-center relative overflow-hidden border border-white/5">
            <span className="material-symbols-outlined text-red-400 text-[24px] absolute left-3 top-3">check_circle</span>
            <div className="text-3xl font-black text-red-400 mt-4">{completedCount}</div>
            <div className="text-[10px] text-on-surface/50 uppercase tracking-wider mt-1">Completed</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-outline-variant/30 mt-2">
          {['All Campaigns', 'Active', 'Upcoming', 'Completed'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 pb-3 text-sm font-bold transition-all relative ${activeTab === tab ? 'text-[#FF1493]' : 'text-on-surface/40 hover:text-on-surface/80'}`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-[#FF1493] shadow-[0_0_10px_#FF1493]" />
              )}
            </button>
          ))}
        </div>

        {/* Search & Filter */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface/40 pointer-events-none">search</span>
            <input 
              type="text" 
              placeholder="Search campaigns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#111111] border border-outline-variant/30 rounded-xl py-3 pl-12 pr-4 text-on-surface text-sm outline-none focus:border-[#FF1493] transition-colors"
            />
          </div>
          <button className="bg-[#111111] border border-outline-variant/30 rounded-xl px-5 flex items-center justify-center gap-2 text-on-surface text-sm font-bold hover:bg-on-surface/5 transition-colors">
            <span className="material-symbols-outlined text-[18px]">filter_list</span>
            Filter
            <span className="material-symbols-outlined text-[18px] text-on-surface/40">expand_more</span>
          </button>
        </div>

        {/* Campaign List */}
        <div className="flex flex-col gap-4">
          {filteredCampaigns.map(campaign => (
            <div key={campaign.id} className="bg-[#111111] border border-white/5 rounded-2xl p-4 flex gap-4 hover:bg-white/[0.02] transition-colors cursor-pointer group">
              
              {/* Image Placeholder */}
              <div className={`w-28 h-28 rounded-xl shrink-0 bg-gradient-to-br ${campaign.imageColor} flex flex-col items-center justify-center p-3 text-center relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                <span className="font-black text-on-surface leading-tight uppercase relative z-10 text-[11px] drop-shadow-md">
                  {campaign.title.split(' ').map((word, i) => (
                    <React.Fragment key={i}>{word}<br/></React.Fragment>
                  ))}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <div className="min-w-0">
                    <h3 className="text-on-surface font-bold text-base truncate">{campaign.title}</h3>
                    <p className="text-on-surface/50 text-[11px] mt-1 line-clamp-2 leading-relaxed">{campaign.description}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-md text-[10px] font-bold border shrink-0 ${campaign.statusColor}`}>
                    {campaign.status}
                  </span>
                </div>

                <div className="flex justify-between items-end mt-3">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-1.5 text-on-surface/40 text-[10px]">
                      <span className="material-symbols-outlined text-[14px]">calendar_month</span>
                      {campaign.dateRange}
                    </div>
                    <div className="flex items-center gap-1.5 text-on-surface/40 text-[10px]">
                      <span className="material-symbols-outlined text-[14px]">group</span>
                      {campaign.targetGroup}
                    </div>
                  </div>

                  {/* Progress Circle or Status */}
                  <div className="shrink-0 flex flex-col items-center gap-1">
                    {campaign.status === 'Active' && (
                      <>
                        <div className="relative w-12 h-12 flex items-center justify-center">
                          <svg className="w-full h-full transform -rotate-90">
                            <circle cx="24" cy="24" r="20" stroke="rgba(255,255,255,0.1)" strokeWidth="4" fill="transparent" />
                            <circle cx="24" cy="24" r="20" stroke="#4ADE80" strokeWidth="4" fill="transparent" strokeDasharray={2 * Math.PI * 20} strokeDashoffset={(2 * Math.PI * 20) * (1 - campaign.progress / 100)} className="transition-all duration-1000" />
                          </svg>
                          <span className="absolute text-[11px] font-black text-on-surface">{campaign.progress}%</span>
                        </div>
                        <span className="text-[9px] text-on-surface/40 uppercase tracking-wider">Progress</span>
                      </>
                    )}
                    {campaign.status === 'Upcoming' && (
                      <>
                        <div className="text-[10px] text-on-surface/40 uppercase tracking-wider text-center mt-2">Starts in</div>
                        <div className="text-xl font-black text-on-surface">{campaign.startsIn}</div>
                        <div className="text-[10px] text-on-surface/40">days</div>
                      </>
                    )}
                    {campaign.status === 'Completed' && (
                      <div className="w-12 h-12 rounded-full border-2 border-red-400 flex items-center justify-center text-red-400 mt-2">
                        <span className="material-symbols-outlined text-2xl">check</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
            </div>
          ))}
          
          {filteredCampaigns.length === 0 && (
            <EmptyState
              icon="campaign"
              title="No campaigns found"
              description={campaigns.length === 0 ? "You haven't created any campaigns yet." : "No campaigns match your filters."}
              actionLabel="Create Campaign"
              onAction={() => alert('Add Campaign clicked')}
            />
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
