import React from 'react';
import { 
  Briefcase, Code, Building, MapPin,
  Target, Banknote, Network, Monitor,
  Clock, CheckCircle2 
} from 'lucide-react';
import { JobProfileData } from '@/lib/types';
import GradientText from './GradientText';

interface ConversationSummaryProps {
  profile: JobProfileData;
}

const ConversationSummary: React.FC<ConversationSummaryProps> = ({ profile }) => {
  const renderSection = (
    title: string, 
    icon: React.ReactNode, 
    content: React.ReactNode, 
    isEmpty: boolean,
    delay: string = ''
  ) => (
    <div className={`p-4 rounded-lg bg-gray-900/50 border border-gray-800 hover:border-blue-800/30 transition-colors duration-300 fade-in-up ${delay}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <span className="text-blue-400">{icon}</span>
          <GradientText 
            from="from-blue-400" 
            to="to-indigo-400" 
            className="ml-2 font-medium"
          >
            {title}
          </GradientText>
        </div>
        {!isEmpty && (
          <div className="flex items-center text-green-400">
            <CheckCircle2 size={14} className="mr-1" />
            <span className="text-xs">Captured</span>
          </div>
        )}
      </div>
      <div className="text-gray-300">
        {content}
      </div>
    </div>
  );

  const formatListItems = (items: string[]) => {
    if (items.length === 0) return <span className="text-gray-500 text-sm">None specified</span>;
    
    return (
      <div className="flex flex-wrap gap-2">
        {items.map((item, index) => (
          <span 
            key={index} 
            className="bg-blue-900/30 text-blue-300 px-3 py-1 rounded-full text-sm transition-all duration-300 hover:bg-blue-800/40"
          >
            {item}
          </span>
        ))}
      </div>
    );
  };

  const formatSalaryRange = (salary: { min: number; max: number; currency: string }) => {
    if (salary.min === 0 && salary.max === 0) return <span className="text-gray-500 text-sm">Not specified</span>;
    
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: salary.currency,
      maximumFractionDigits: 0
    });
    
    return (
      <span className="text-blue-300 text-lg">
        {formatter.format(salary.min)} - {formatter.format(salary.max)} {salary.currency}
      </span>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto fade-in">
      <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-800/30 rounded-lg p-6 mb-6 fade-in-up">
        <h2 className="text-3xl font-bold mb-2">
          <GradientText animate>Conversation Summary</GradientText>
        </h2>
        <p className="text-gray-400">Here's a comprehensive summary of our career discussion.</p>
      </div>

      <div className="space-y-4">
        {/* Current Status */}
        {renderSection(
          "Current Status",
          <Target size={18} className="mr-2" />,
          <p className="text-blue-300">
            {profile.profile.currentStatus || "Status not specified"}
          </p>,
          !profile.profile.currentStatus,
          'delay-100'
        )}

        {/* Skills & Tech */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Skills */}
          {renderSection(
            "Skills",
            <Code size={18} className="mr-2" />,
            formatListItems(profile.profile.skills),
            profile.profile.skills.length === 0,
            'delay-200'
          )}

          {/* Tech Stack */}
          {renderSection(
            "Tech Stack",
            <Monitor size={18} className="mr-2" />,
            formatListItems(profile.profile.techStack),
            profile.profile.techStack.length === 0,
            'delay-200'
          )}
        </div>

        {/* Experience */}
        {renderSection(
          "Experience",
          <Briefcase size={18} className="mr-2" />,
          <div className="space-y-2">
            {profile.profile.yearsOfExperience && (
              <div className="flex items-center text-blue-300 mb-2">
                <Clock size={16} className="mr-2" />
                <span>{profile.profile.yearsOfExperience} Years</span>
              </div>
            )}
            <p className="text-blue-300">{profile.profile.experience || "No experience details provided"}</p>
          </div>,
          !profile.profile.experience && !profile.profile.yearsOfExperience,
          'delay-300'
        )}

        {/* Employment & Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Employment Types */}
          {renderSection(
            "Employment Types",
            <Network size={18} className="mr-2" />,
            formatListItems(profile.profile.employmentTypes),
            profile.profile.employmentTypes.length === 0,
            'delay-300'
          )}

          {/* Location Preferences */}
          {renderSection(
            "Location & Work Mode",
            <MapPin size={18} className="mr-2" />,
            <div className="space-y-2">
              <p className="text-blue-300">
                Location: {profile.profile.locationPreference || "Not specified"}
              </p>
              <p className="text-blue-300">
                Work Mode: {profile.profile.remotePreference || "Not specified"}
              </p>
            </div>,
            !profile.profile.locationPreference && !profile.profile.remotePreference,
            'delay-300'
          )}
        </div>

        {/* Career Interests */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Industries */}
          {renderSection(
            "Preferred Industries",
            <Building size={18} className="mr-2" />,
            formatListItems(profile.profile.preferredIndustries),
            profile.profile.preferredIndustries.length === 0,
            'delay-300'
          )}

          {/* Salary Expectations */}
          {renderSection(
            "Expected Salary",
            <Banknote size={18} className="mr-2" />,
            formatSalaryRange(profile.profile.salaryRange),
            profile.profile.salaryRange.min === 0 && profile.profile.salaryRange.max === 0,
            'delay-300'
          )}
        </div>

        {/* Role Matches */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Target Roles */}
          {renderSection(
            "Target Roles",
            <Target size={18} className="mr-2" />,
            formatListItems(profile.profile.targetRoles),
            profile.profile.targetRoles.length === 0,
            'delay-300'
          )}

          {/* AI Suggested Roles */}
          {renderSection(
            "AI Suggested Roles",
            <Briefcase size={18} className="mr-2" />,
            formatListItems(profile.profile.suggestedRoles),
            profile.profile.suggestedRoles.length === 0,
            'delay-300'
          )}
        </div>

        {/* Additional Notes */}
        {profile.profile.additionalNotes && renderSection(
          "Additional Notes",
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>,
          <p className="text-blue-300">{profile.profile.additionalNotes}</p>,
          false,
          'delay-300'
        )}
      </div>
    </div>
  );
};

export default ConversationSummary;
