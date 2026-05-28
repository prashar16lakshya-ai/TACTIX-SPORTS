import React from 'react'
import RoleCard from '../../components/onboarding/RoleCard'
import ProgressHeader from '../../components/onboarding/ProgressHeader'

export default function OnboardingStep1({ nextStep, onDataChange, data }) {

  const handleRoleSelect = (role) => {
    onDataChange({ role })
  }

  const handleContinue = () => {
    if (data.role) {
      nextStep()
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <ProgressHeader
        step={1}
        title="Select your role"
        subtitle="Your role defines your access level within the system."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <RoleCard
          role="player"
          title="Student"
          description="Track your matches, wins, and points with YOUR TEAM NAME."
          hint="Join using team code"
          icon="sports_soccer"
          isSelected={data.role === 'player'}
          onClick={() => handleRoleSelect('player')}
        />
        <RoleCard
          role="coach"
          title="Coach"
          description="Manage YOUR TEAM NAMEs and help your players grow."
          hint="Join using sport code"
          icon="strategy"
          isSelected={data.role === 'coach'}
          onClick={() => handleRoleSelect('coach')}
        />
        <RoleCard
          role="admin"
          title="Admin"
          description="Set up your school and manage all access codes."
          hint="Create school"
          icon="admin_panel_settings"
          isSelected={data.role === 'admin'}
          onClick={() => handleRoleSelect('admin')}
        />
      </div>

      <div className="mt-12 flex flex-col md:flex-row items-center justify-end gap-6 border-t border-outline-variant/30 pt-8">
        <div className="flex gap-6 w-full md:w-auto">
          <button
            onClick={handleContinue}
            disabled={!data.role}
            className="flex-1 md:flex-none px-12 py-4 bg-primary-container hover:bg-primary text-on-primary rounded-full font-headline-md text-body-md active:scale-95 transition-all shadow-[0_0_20px_rgba(124,58,237,0.3)] disabled:opacity-50 disabled:active:scale-100 font-bold tracking-widest"
          >
            CONTINUE
          </button>
        </div>
      </div>
    </div>
  )
}
