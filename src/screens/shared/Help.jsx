import React, { useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { useNavigate } from 'react-router-dom';

const FAQS = [
  {
    category: 'GENERAL',
    questions: [
      {
        q: 'How do I log in to TACTIX?',
        a: "Enter your registered email and password on the login screen. If you're new, sign up first using your details and mobile number."
      },
      {
        q: 'What should I do if I forget my password?',
        a: 'Click “Forgot Password” on the login page, enter your email, and follow the reset link sent to you.'
      },
      {
        q: 'Why am I not seeing my assigned team?',
        a: 'Teams are assigned by the admin or coach. If it’s not visible, your assignment may still be pending—contact your coach or admin.'
      },
      {
        q: 'How do I update my profile information?',
        a: 'Go to Profile → Edit Profile, update your details, and click Save.'
      }
    ]
  }
];

export default function Help() {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(`${0}-0`); // categoryIndex-questionIndex

  const toggleAccordion = (catIndex, qIndex) => {
    const key = `${catIndex}-${qIndex}`;
    setOpenIndex(prev => prev === key ? null : key);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 max-w-4xl mx-auto w-full pb-20 px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-3xl font-black text-on-surface uppercase tracking-tight">Help & Support</h1>
            <p className="text-on-surface/50 text-sm">Frequently asked questions and support resources.</p>
          </div>
          <button 
            onClick={() => navigate('/feedback')}
            className="bg-primary hover:bg-primary/90 text-on-surface font-black px-6 py-3 rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all active:scale-95 flex items-center gap-2 text-xs uppercase tracking-widest"
          >
            <span className="material-symbols-outlined text-xl">contact_support</span>
            Contact Support
          </button>
        </div>

        {/* FAQs Accordion */}
        <div className="flex flex-col gap-8">
          {FAQS.map((category, cIdx) => (
            <div key={cIdx} className="flex flex-col gap-4">
              <h2 className="text-lg font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                <span className="material-symbols-outlined">help</span>
                {category.category}
              </h2>
              
              <div className="bg-[#111111] border border-outline-variant/30 rounded-2xl overflow-hidden shadow-lg">
                {category.questions.map((faq, qIdx) => {
                  const isOpen = openIndex === `${cIdx}-${qIdx}`;
                  return (
                    <div 
                      key={qIdx} 
                      className={`border-b border-white/5 last:border-0 transition-colors ${isOpen ? 'bg-on-surface/5' : 'hover:bg-white/[0.02]'}`}
                    >
                      <button
                        onClick={() => toggleAccordion(cIdx, qIdx)}
                        className="w-full p-6 flex justify-between items-center text-left focus:outline-none"
                      >
                        <span className="text-sm font-bold text-on-surface pr-8 leading-relaxed">
                          {faq.q}
                        </span>
                        <span 
                          className={`material-symbols-outlined text-on-surface/40 transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : ''}`}
                        >
                          expand_more
                        </span>
                      </button>
                      
                      <div 
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
                      >
                        <p className="p-6 pt-0 text-on-surface/60 text-sm leading-relaxed">
                          {faq.a}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Contact info box */}
        <div className="mt-8 bg-gradient-to-br from-primary/20 to-transparent border border-primary/30 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-6 justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[50px] rounded-full pointer-events-none" />
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined text-2xl">mail</span>
            </div>
            <div>
              <h3 className="text-on-surface font-bold text-lg mb-1">Still need help?</h3>
              <p className="text-on-surface/60 text-sm max-w-md">
                If you couldn't find the answer to your question, feel free to reach out to our support team.
              </p>
            </div>
          </div>
          <a 
            href="mailto:Tactixsport@gmail.com"
            className="whitespace-nowrap px-6 py-3 rounded-xl bg-on-surface/10 hover:bg-white/20 text-on-surface font-bold text-sm transition-colors border border-outline-variant/30 flex items-center gap-2"
          >
            Email Support
          </a>
        </div>
      </div>
    </DashboardLayout>
  );
}
