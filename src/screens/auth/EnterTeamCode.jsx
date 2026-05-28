import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { validateCode } from '../../utils/codeManager';
import InputField from '../../components/onboarding/InputField';
import Button from '../../components/onboarding/Button';

export default function EnterTeamCode() {
  const [teamCode, setTeamCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user, updateSession } = useAuth();
  const navigate = useNavigate();

  const handleJoinTeam = async (e) => {
    e.preventDefault();
    if (!teamCode) {
      setError('Please enter a team code');
      return;
    }
    setLoading(true);
    setError('');
    
    try {
      const validation = await validateCode(teamCode, 'team');
      if (!validation.success) {
        setError(validation.error);
        return;
      }

      // Update user document with teamId and schoolId
      if (user?.uid) {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          teamId: validation.data.teamId || '',
          schoolId: validation.data.schoolId || '',
          teamName: validation.data.teamName || '',
          schoolName: validation.data.schoolName || ''
        });
        
        // Update local session
        updateSession({
          teamId: validation.data.teamId || '',
          schoolId: validation.data.schoolId || '',
          teamName: validation.data.teamName || '',
          schoolName: validation.data.schoolName || ''
        });
      }

      setSuccess('Successfully joined team!');
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 1500);
    } catch (err) {
      console.error(err);
      setError('Failed to join team. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const skipStep = () => {
    navigate('/dashboard', { replace: true });
  };

  return (
    <div className="min-h-screen bg-background text-on-background relative flex flex-col items-center justify-center p-6 md:p-12">
      <div className="w-full max-w-md mx-auto space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-on-surface mb-2">Join a Team</h2>
          <p className="text-on-surface-variant">Enter your team code to get started.</p>
        </div>

        <div className="w-full bg-surface-container-low border border-outline-variant p-6 md:p-8 rounded-xl shadow-2xl glass relative overflow-hidden">
          {error && (
            <div className="mb-6 flex items-center gap-2 p-3 bg-error-container/20 border border-error/30 rounded-lg animate-in slide-in-from-top-2">
              <span className="material-symbols-outlined text-error text-[18px]">error</span>
              <p className="text-sm text-error font-bold">{error}</p>
            </div>
          )}

          {success ? (
            <div className="flex flex-col items-center space-y-4 animate-in fade-in zoom-in duration-500">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-primary cyan-glow">
                <span className="material-symbols-outlined text-5xl">check_circle</span>
              </div>
              <h3 className="text-xl font-bold text-on-surface">Success!</h3>
              <p className="text-on-surface-variant text-sm">Redirecting to dashboard...</p>
            </div>
          ) : (
            <form onSubmit={handleJoinTeam} className="space-y-6">
              <InputField
                id="teamCode"
                label="Enter Team Code"
                icon="vpn_key"
                placeholder="TEAM-SPORT-XXXX"
                value={teamCode}
                onChange={(e) => setTeamCode(e.target.value)}
              />
              <Button type="submit" text={loading ? "Please wait..." : "Join Team"} icon="person_add" loading={loading} />
              
              <button 
                type="button" 
                onClick={skipStep}
                className="w-full text-sm font-bold text-on-surface-variant hover:text-primary transition-colors py-2"
              >
                Skip for now
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
