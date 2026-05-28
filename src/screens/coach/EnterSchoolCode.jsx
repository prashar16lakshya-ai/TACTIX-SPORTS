import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase';
import { doc, updateDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { validateCode, generateCode, createAccessCode } from '../../utils/codeManager';
import InputField from '../../components/onboarding/InputField';
import Button from '../../components/onboarding/Button';

export default function EnterSchoolCode() {
  const [step, setStep] = useState(1);
  const [stepData, setStepData] = useState({
    sportCode: '',
    teamName: '',
  });
  const [schoolData, setSchoolData] = useState(null);
  const [generatedCode, setGeneratedCode] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user, updateSession } = useAuth();
  const navigate = useNavigate();

  const handleCopyCode = async (code) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(code);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = code;
        textArea.style.position = "absolute";
        textArea.style.left = "-999999px";
        document.body.prepend(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
        } catch (error) {
          console.error('Fallback copy failed', error);
        } finally {
          textArea.remove();
        }
      }
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2500);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleValidateSport = async (e) => {
    e.preventDefault();
    if (!stepData.sportCode) {
      setError('Please enter a sport code');
      return;
    }
    setLoading(true);
    setError('');
    
    try {
      const validation = await validateCode(stepData.sportCode, 'sport');
      if (!validation.success) {
        setError(validation.error);
        return;
      }

      setSchoolData({
        schoolId: validation.data.schoolId,
        schoolName: validation.data.schoolName,
        sport: stepData.sportCode.split('-')[1]
      });
      setStep(2);
      setSuccess('Sport code validated!');
    } catch (err) {
      setError('Validation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    if (!stepData.teamName) {
      setError('Please enter a team name');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const sport = user?.sport || schoolData.sport || 'ALL';
      const teamCode = generateCode('TEAM', sport);
      const teamId = `TEAM-${Date.now()}`;

      // Create Team Document
      await setDoc(doc(db, 'teams', teamId), {
        teamId,
        name: stepData.teamName,
        sport: sport,
        schoolId: schoolData.schoolId,
        coachId: user?.email || user?.uid,
        createdAt: serverTimestamp(),
      });

      // Create Team Access Code Document
      await createAccessCode({
        code: teamCode,
        type: 'team',
        createdBy: user?.email || user?.uid,
        schoolId: schoolData.schoolId,
        schoolName: schoolData.schoolName,
        teamId: teamId,
        teamName: stepData.teamName,
      });

      // Update User Profile
      if (user?.uid) {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          schoolId: schoolData.schoolId || '',
          schoolName: schoolData.schoolName || '',
          teamId: teamId || '',
          teamName: stepData.teamName || '',
          sport: sport || 'ALL'
        });
        
        updateSession({
          schoolId: schoolData.schoolId || '',
          schoolName: schoolData.schoolName || '',
          teamId: teamId || '',
          teamName: stepData.teamName || '',
          sport: sport || 'ALL'
        });
      }

      setGeneratedCode(teamCode);
      setStep(3);
      setSuccess('Team created successfully!');
    } catch (err) {
      console.error(err);
      setError('Failed to create team. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const skipStep = () => {
    navigate('/coach', { replace: true });
  };

  const renderSuccessState = (code) => (
    <div className="flex flex-col items-center space-y-6 animate-in fade-in zoom-in duration-500">
      <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-primary cyan-glow">
        <span className="material-symbols-outlined text-5xl">check_circle</span>
      </div>
      <div className="text-center">
        <h3 className="text-xl font-bold text-on-surface mb-2">Success!</h3>
        <p className="text-on-surface-variant text-sm">Share this code with players to join your team</p>
      </div>

      <div className="w-full p-6 bg-on-surface/5 border-2 border-primary/30 rounded-2xl relative group purple-glow">
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-primary font-black mb-2">Your Team Code</p>
          <p className="text-3xl font-black tracking-tighter text-on-surface font-lexend">{code}</p>
        </div>
        <div className="absolute top-2 right-2 flex items-center gap-2">
          {copySuccess && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-primary/20 rounded-full border border-primary/30 animate-in fade-in zoom-in slide-in-from-right-2 duration-300">
              <span className="material-symbols-outlined text-[14px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <span className="text-[10px] text-primary font-black uppercase tracking-widest">Copied</span>
            </div>
          )}
          <button
            onClick={() => handleCopyCode(code)}
            className={`p-2 rounded-lg transition-all duration-300 ${copySuccess
              ? 'bg-primary/20 text-primary scale-110'
              : 'bg-on-surface/5 text-on-surface-variant hover:text-primary hover:bg-primary/10'
              }`}
            aria-label="Copy code to clipboard"
          >
            <span className="material-symbols-outlined text-[20px]">
              {copySuccess ? 'check' : 'content_copy'}
            </span>
          </button>
        </div>
      </div>

      <Button
        text="Go to Dashboard"
        icon="dashboard"
        onClick={() => navigate('/coach', { replace: true })}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-on-background relative flex flex-col items-center justify-center p-6 md:p-12">
      <div className="w-full max-w-md mx-auto space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-on-surface mb-2">Join a School</h2>
          <p className="text-on-surface-variant">Enter your school's sport code to create your team.</p>
        </div>

        <div className="w-full bg-surface-container-low border border-outline-variant p-6 md:p-8 rounded-xl shadow-2xl glass relative overflow-hidden">
          {error && (
            <div className="mb-6 flex items-center gap-2 p-3 bg-error-container/20 border border-error/30 rounded-lg animate-in slide-in-from-top-2">
              <span className="material-symbols-outlined text-error text-[18px]">error</span>
              <p className="text-sm text-error font-bold">{error}</p>
            </div>
          )}

          {success && !generatedCode && (
            <div className="mb-6 flex items-center gap-2 p-3 bg-primary/10 border border-primary/30 rounded-lg animate-in slide-in-from-top-2">
              <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
              <p className="text-sm text-primary font-bold">{success}</p>
            </div>
          )}

          <div className="space-y-6">
            {step === 1 && (
              <form onSubmit={handleValidateSport} className="space-y-6">
                <InputField
                  id="sportCode"
                  label="Enter Sport Code"
                  icon="vpn_key"
                  placeholder="SPT-SPORT-XXXX"
                  value={stepData.sportCode}
                  onChange={(e) => setStepData({ ...stepData, sportCode: e.target.value })}
                  helperText="Get code from your school admin"
                />
                <Button type="submit" text={loading ? "Verifying..." : "Check Code"} icon="verified" loading={loading} />
                <button 
                  type="button" 
                  onClick={skipStep}
                  className="w-full text-sm font-bold text-on-surface-variant hover:text-primary transition-colors py-2"
                >
                  Skip for now
                </button>
              </form>
            )}
            {step === 2 && (
              <form onSubmit={handleCreateTeam} className="space-y-6 animate-in slide-in-from-right-4">
                <InputField
                  id="teamName"
                  label="Team Name"
                  icon="groups"
                  placeholder="e.g. Under-16 A-Team"
                  value={stepData.teamName}
                  onChange={(e) => setStepData({ ...stepData, teamName: e.target.value })}
                />
                <Button type="submit" text={loading ? "Please wait..." : "Create Team"} icon="construction" loading={loading} />
                <button 
                  type="button" 
                  onClick={skipStep}
                  className="w-full text-sm font-bold text-on-surface-variant hover:text-primary transition-colors py-2"
                >
                  Skip for now
                </button>
              </form>
            )}
            {step === 3 && renderSuccessState(generatedCode)}
          </div>
        </div>
      </div>
    </div>
  );
}
