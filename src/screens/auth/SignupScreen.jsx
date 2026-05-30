import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import OnboardingStep1 from './OnboardingStep1';
import OnboardingStep2 from './OnboardingStep2';
import OnboardingStep3 from './OnboardingStep3';
import { useTheme } from '../../context/ThemeContext';
import Logo from '../../components/common/Logo';

export default function SignupScreen() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: '',
    schoolId: '',
    schoolName: '',
    teamId: '',
    teamName: '',
    sport: '',
    isGoogleUser: false,
    admissionNumber: '',
  });
  
  const navigate = useNavigate();
  const { signup } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleDataChange = (newData) => {
    setData((prev) => ({ ...prev, ...newData }));
  };

  const completeSignup = async (finalData) => {
    try {
      let result;
      
      const payload = {
        schoolId: finalData.schoolId || '',
        schoolName: finalData.schoolName || '',
        teamId: finalData.teamId || '',
        teamName: finalData.teamName || '',
        sport: finalData.sport || '',
        phone: finalData.phone || '',
        admissionNumber: finalData.admissionNumber || '',
        setupCompleted: true,
      };

      if (finalData.isGoogleUser) {
        // For Google users, we just update their Firestore profile
        // The user is already signed in via Google at this point
        payload.isGoogleUser = true;
        result = await signup(
          finalData.email, 
          'GOOGLE_AUTH_USER', 
          finalData.name, 
          finalData.role,
          payload
        );
      } else {
        result = await signup(
          finalData.email, 
          finalData.password, 
          finalData.name, 
          finalData.role,
          payload
        );
      }

      if (result.success) {
        navigate('/dashboard', { replace: true });
      } else {
        alert(result.error || 'Signup failed');
      }
    } catch (err) {
      console.error('Signup error:', err);
      alert('An unexpected error occurred');
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-background relative flex flex-col items-center p-6 md:p-12">
      {/* Theme Toggle */}
      <button
        type="button"
        onClick={toggleTheme}
        className="absolute top-5 right-5 z-20 h-10 px-3 rounded-lg bg-surface-container border border-outline-variant text-on-surface flex items-center gap-2 hover:bg-surface-container-high transition-colors glass"
      >
        <span className="material-symbols-outlined text-[18px]">{isDark ? 'light_mode' : 'dark_mode'}</span>
        <span className="text-label-sm">{isDark ? 'Light' : 'Dark'}</span>
      </button>

      {/* Header */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-12">
        <Logo variant="header" size="sm" />
      </div>

      {/* Step Render */}
      <main className="w-full flex-1 flex flex-col items-center justify-center">
        {step === 1 && (
          <OnboardingStep1 
            nextStep={nextStep} 
            onDataChange={handleDataChange} 
            data={data} 
          />
        )}
        {step === 2 && (
          <OnboardingStep2 
            prevStep={prevStep} 
            nextStep={nextStep}
            completeSignup={completeSignup} 
            onDataChange={handleDataChange} 
            data={data} 
          />
        )}
        {step === 3 && (
          <OnboardingStep3 
            data={data}
            onDataChange={handleDataChange}
            completeSignup={completeSignup}
          />
        )}
      </main>

    </div>
  );
}
