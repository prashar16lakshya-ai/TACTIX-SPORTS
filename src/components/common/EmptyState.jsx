import React from 'react';

export default function EmptyState({ title, message, icon }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-on-surface/5 border border-outline-variant/30 rounded-3xl min-h-[300px]">
      <div className="w-16 h-16 rounded-full bg-[#FF1493]/10 flex items-center justify-center mb-4 border border-[#FF1493]/20">
        <span className="material-symbols-outlined text-3xl text-[#FF1493]">
          {icon || 'analytics'}
        </span>
      </div>
      <h3 className="text-xl font-black text-on-surface mb-2 tracking-tight uppercase">
        {title || 'No Data Available'}
      </h3>
      <p className="text-sm text-on-surface/50 max-w-md leading-relaxed">
        {message || 'Data is not yet available for this section. Check back later.'}
      </p>
    </div>
  );
}
