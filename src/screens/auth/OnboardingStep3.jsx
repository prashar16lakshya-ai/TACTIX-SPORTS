import React, { useState } from 'react';
import ProgressHeader from '../../components/onboarding/ProgressHeader';
import InputField from '../../components/onboarding/InputField';
import Button from '../../components/onboarding/Button';
import { generateCode, createAccessCode, validateCode } from '../../utils/codeManager';
import { db } from '../../firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function OnboardingStep3({ data, onDataChange, completeSignup }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [step, setStep] = useState(1); // For multi-step flows like Coach
  const [generatedCode, setGeneratedCode] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [stepData, setStepData] = useState({
    schoolName: '',
    sport: '',
    sportCode: '',
    teamName: '',
    teamCode: '',
  });

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

  const handleAdminSetup = async (e) => {
    e.preventDefault();
    if (!stepData.schoolName) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const sportCode = generateCode('SPT', 'ALL');
      const schoolId = `SCH-${Date.now()}`;

      await setDoc(doc(db, 'schools', schoolId), {
        schoolId,
        name: stepData.schoolName,
        createdAt: serverTimestamp(),
      });

      await createAccessCode({
        code: sportCode,
        type: 'sport',
        createdBy: data.email,
        schoolId: schoolId,
        schoolName: stepData.schoolName,
      });

      setGeneratedCode(sportCode);
      onDataChange({
        schoolId,
        schoolName: stepData.schoolName,
        sport: 'ALL',
        generatedSportCode: sportCode
      });
      setStep(2); // Show generated code
      setSuccess('School created successfully!');
    } catch (err) {
      setError('Failed to set up school. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCoachValidateSport = async (e) => {
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

      onDataChange({
        schoolId: validation.data.schoolId,
        schoolName: validation.data.schoolName,
        sport: stepData.sportCode.split('-')[1]
      });
      setStep(2); // Move to team creation
      setSuccess('Sport code validated!');
    } catch (err) {
      setError('Validation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCoachCreateTeam = async (e) => {
    e.preventDefault();
    if (!stepData.teamName) {
      setError('Please enter a team name');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const sport = data.sport || stepData.sportCode.split('-')[1];
      const teamCode = generateCode('TEAM', sport);
      const teamId = `TEAM-${Date.now()}`;

      await setDoc(doc(db, 'teams', teamId), {
        teamId,
        name: stepData.teamName,
        sport: sport,
        schoolId: data.schoolId,
        coachId: data.email,
        createdAt: serverTimestamp(),
      });

      await createAccessCode({
        code: teamCode,
        type: 'team',
        createdBy: data.email,
        schoolId: data.schoolId,
        schoolName: data.schoolName,
        teamId: teamId,
        teamName: stepData.teamName,
      });

      setGeneratedCode(teamCode);
      onDataChange({
        teamId,
        teamName: stepData.teamName,
        generatedTeamCode: teamCode
      });
      setStep(3); // Show generated code
      setSuccess('Team forged successfully!');
    } catch (err) {
      setError('Failed to create team. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePlayerSetup = async (e) => {
    e.preventDefault();
    if (!stepData.teamCode) {
      setError('Please enter a team code');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const validation = await validateCode(stepData.teamCode, 'team');
      if (!validation.success) {
        setError(validation.error);
        return;
      }

      setSuccess('Successfully joined!');
      setTimeout(() => {
        completeSignup({
          ...data,
          schoolId: validation.data.schoolId,
          schoolName: validation.data.schoolName,
          teamId: validation.data.teamId,
          teamName: validation.data.teamName,
        });
      }, 1500);
    } catch (err) {
      setError('Failed to join team. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderSuccessState = (code, label) => (
    <div className="flex flex-col items-center space-y-6 animate-in fade-in zoom-in duration-500">
      <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-primary cyan-glow">
        <span className="material-symbols-outlined text-5xl">check_circle</span>
      </div>
      <div className="text-center">
        <h3 className="text-xl font-bold text-on-surface mb-2">Success!</h3>
        <p className="text-on-surface-variant text-sm">{label}</p>
      </div>

      <div className="w-full p-6 bg-on-surface/5 border-2 border-primary/30 rounded-2xl relative group purple-glow">
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-primary font-black mb-2">Your Code</p>
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
        onClick={() => completeSignup(data)}
      />
    </div>
  );

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <ProgressHeader
        step={3}
        title={data.role === 'admin' ? 'School Setup' : data.role === 'coach' ? 'Team Setup' : 'Join YOUR TEAM NAME'}
        subtitle="Finish setting up your details."
      />

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

        {/* ADMIN FLOW */}
        {data.role === 'admin' && (
          step === 1 ? (
            <form onSubmit={handleAdminSetup} className="space-y-6">
              <InputField
                id="schoolName"
                label="School Name"
                icon="school"
                placeholder="E.g., school name "
                value={stepData.schoolName}
                onChange={(e) => setStepData({ ...stepData, schoolName: e.target.value })}
              />
              <Button type="submit" text={loading ? "Please wait..." : "Create School"} icon="rocket_launch" loading={loading} />
            </form>
          ) : renderSuccessState(generatedCode, "Share this code with coaches to join your school")
        )}

        {/* COACH FLOW */}
        {data.role === 'coach' && (
          <div className="space-y-6">
            {step === 1 && (
              <form onSubmit={handleCoachValidateSport} className="space-y-6">
                <InputField
                  id="sportCode"
                  label="Enter Sport Code"
                  icon="vpn_key"
                  placeholder="SPT-ALPHA-XXX"
                  value={stepData.sportCode}
                  onChange={(e) => setStepData({ ...stepData, sportCode: e.target.value })}
                  helperText="Get code from your school admin"
                  loading={loading}
                />
                <Button type="submit" text={loading ? "Verifying..." : "Check Code"} icon="verified" loading={loading} />
              </form>
            )}
            {step === 2 && (
              <form onSubmit={handleCoachCreateTeam} className="space-y-6 animate-in slide-in-from-right-4">
                <InputField
                  id="teamName"
                  label="Team Name"
                  icon="groups"
                  placeholder="TEAM NAME"
                  value={stepData.teamName}
                  onChange={(e) => setStepData({ ...stepData, teamName: e.target.value })}
                />
                <Button type="submit" text={loading ? "Please wait..." : "Create Team"} icon="construction" loading={loading} />
              </form>
            )}
            {/* Success View */}
            {step === 3 && renderSuccessState(generatedCode, "Share this code with players to join YOUR TEAM NAME")}
          </div>
        )}

        {/* PLAYER FLOW */}
        {data.role === 'player' && (
          <form onSubmit={handlePlayerSetup} className="space-y-6">
            <InputField
              id="teamCode"
              label="Enter Team Code"
              icon="vpn_key"
              placeholder="TEAM-ALPHA-XXX"
              value={stepData.teamCode}
              onChange={(e) => setStepData({ ...stepData, teamCode: e.target.value })}
              helperText="Get code from your coach or school admin"
              loading={loading}
            />
            <Button type="submit" text={loading ? "Verifying..." : "Join Team"} icon="person_add" loading={loading} />
          </form>
        )}
      </div>
    </div>
  );
}
