import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Building, MapPin, FileText, ListChecks, CircleDollarSign, Briefcase, AlertCircle } from 'lucide-react';
import GradientText from './GradientText';
import LoadingDots from './LoadingDots';
import type { JobProfileItem } from '@/lib/types';
import JobSearchResults from './JobSearchResults';
import type { JobMatch, PerplexityApiStatus } from '../types/perplexity';
import PerplexityApiTester from './PerplexityApiTester';

export default function JobProfile() {
  const [profile, setProfile] = useState<Partial<JobProfileItem>>({});
  const profileRef = useRef<Partial<JobProfileItem>>({});
  const lastUpdateTime = useRef<number>(Date.now());
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<JobMatch[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleJobSearch = async (profile: JobProfileItem) => {
    try {
      const response = await fetch('/api/jobs/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      });

      if (!response.ok) {
        throw new Error('Failed to search jobs');
      }

      const results = await response.json();
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching jobs:', error);
      setSearchError(error instanceof Error ? error.message : 'An error occurred while searching for jobs.');
    } finally {
      setIsSearching(false);
    }
  };

  const searchJobs = useCallback(async () => {
    if (!profileRef.current) {
      setSearchError('Job search is not available at this time.');
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      // Convert partial profile to full profile structure required by PerplexityService
      const fullProfile: JobProfileItem = {
        skills: profileRef.current.skills || [],
        techStack: profileRef.current.techStack || [],
        experience: profileRef.current.experience || '',
        yearsOfExperience: profileRef.current.yearsOfExperience || '',
        preferredIndustries: profileRef.current.preferredIndustries || [],
        preferredRoles: profileRef.current.preferredRoles || [],
        employmentTypes: profileRef.current.employmentTypes || [],
        locationPreference: profileRef.current.locationPreference || '',
        remotePreference: profileRef.current.remotePreference || '',
        salaryRange: profileRef.current.salaryRange || { min: 0, max: 0, currency: 'USD' },
        targetRoles: profileRef.current.targetRoles || [],
        suggestedRoles: profileRef.current.suggestedRoles || [],
        currentStatus: profileRef.current.currentStatus || '',
        additionalNotes: profileRef.current.additionalNotes || ''
      };

      await handleJobSearch(fullProfile);
    } catch (error) {
      console.error('Error searching jobs:', error);
      setSearchError(error instanceof Error ? error.message : 'An error occurred while searching for jobs.');
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleCallEnded = useCallback(() => {
    console.log('Call ended, starting job search...');
    searchJobs();
  }, [searchJobs]);

  // Enhanced profile update handler
  const handleProfileUpdate = useCallback((event: CustomEvent<string>) => {
    try {
      const updatedProfile = JSON.parse(event.detail);
      const currentTime = Date.now();
      
      // Debounce updates that come too quickly (within 500ms)
      if (currentTime - lastUpdateTime.current < 500) {
        return;
      }
      
      lastUpdateTime.current = currentTime;
      console.debug('Received profile update:', updatedProfile);

      // Keep a reference to the latest profile
      profileRef.current = {
        ...profileRef.current,
        ...updatedProfile
      };
      
      // Update state with new data
      setProfile(prevProfile => {
        const newProfile = {
          ...prevProfile,
          ...updatedProfile
        };
        console.debug('Profile state updated:', newProfile);
        return newProfile;
      });
    } catch (error) {
      console.error('Error handling profile update:', error);
    }
  }, []);

  // More frequent profile validation
  useEffect(() => {
    const validateProfile = () => {
      const currentProfile = JSON.stringify(profile);
      const referenceProfile = JSON.stringify(profileRef.current);
      
      if (currentProfile !== referenceProfile) {
        console.debug('Profile sync required - updating state');
        setProfile(profileRef.current);
      }
    };
    
    // Check more frequently (every 500ms) for updates
    const interval = setInterval(validateProfile, 500);
    return () => clearInterval(interval);
  }, [profile]);

  // Enhanced event listener setup
  useEffect(() => {
    console.debug('Setting up profile update listeners');
    window.addEventListener('jobProfileUpdated', handleProfileUpdate as EventListener);
    window.addEventListener('callEnded', handleCallEnded);
    
    return () => {
      console.debug('Cleaning up profile update listeners');
      window.removeEventListener('jobProfileUpdated', handleProfileUpdate as EventListener);
      window.removeEventListener('callEnded', handleCallEnded);
    };
  }, [handleProfileUpdate, handleCallEnded]);

  const formatArray = useCallback((arr?: string[]) => {
    if (!arr || arr.length === 0) return '';
    return arr.join(', ');
  }, []);

  const formatSalaryRange = useCallback((range?: { min: number; max: number; currency: string }) => {
    if (!range) return '';
    if (range.min === 0 && range.max === 0) return '';
    if (range.min && range.max) {
      return `${range.currency}${range.min.toLocaleString()} - ${range.currency}${range.max.toLocaleString()}`;
    }
    return range.min ? `From ${range.currency}${range.min.toLocaleString()}` : `Up to ${range.currency}${range.max.toLocaleString()}`;
  }, []);

  const renderExperienceInfo = () => {
    const hasExperience = profile.experience || profile.yearsOfExperience || (profile.skills && profile.skills.length > 0);
    
    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {hasExperience ? (
          <>
            {(profile.experience || profile.yearsOfExperience) && (
              <div className="bg-blue-900/20 text-blue-300 px-2 py-1 rounded text-xs">
                {profile.yearsOfExperience && `${profile.yearsOfExperience} years`} {profile.experience}
              </div>
            )}
            {profile.skills?.map((skill, index) => (
              <div key={index} className="bg-blue-900/20 text-blue-300 px-2 py-1 rounded text-xs">
                {skill}
              </div>
            ))}
          </>
        ) : (
          <p className="text-gray-400 text-sm">Share your experience and skills...</p>
        )}
      </div>
    );
  };

  const renderLocationInfo = () => {
    if (!profile.locationPreference && !profile.remotePreference) {
      return (
        <p className="text-gray-400 text-sm mt-1">
          Share your location and work mode preferences...
        </p>
      );
    }

    return (
      <p className="text-blue-300 text-sm mt-1">
        {profile.locationPreference} {profile.remotePreference && `(${profile.remotePreference})`}
      </p>
    );
  };

  const renderCurrentStatus = () => {
    return profile.currentStatus ? (
      <div className="bg-blue-900/20 text-blue-300 px-2 py-1 rounded text-sm">
        {profile.currentStatus}
      </div>
    ) : (
      <p className="text-gray-400 text-sm">
        Share your current job search status...
      </p>
    );
  };

  // Render API status message if there's an error
  const renderApiStatus = () => {
    if (!perplexityApiKey) {
      return (
        <div className="mt-4 p-3 bg-yellow-900/30 border border-yellow-800/50 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-yellow-400 mr-2" />
            <p className="text-yellow-300 text-sm">
              Perplexity API key is not configured. Job search functionality is disabled.
            </p>
          </div>
        </div>
      );
    }
    
    return null;
  };

  return (
    <>
      <div className="rounded-xl bg-gray-900/80 backdrop-blur-md border border-gray-800/50 overflow-hidden transition-all duration-300 hover:border-blue-800/30 shadow-lg">
        <div className="p-5">
          <div className="mb-5">
            <div className="flex items-center mb-2">
              <Award className="w-5 h-5 text-blue-400 mr-2" />
              <h3 className="text-lg font-semibold">
                <GradientText>Career Profile</GradientText>
              </h3>
            </div>
            <p className="text-gray-400 text-sm">
              Your profile updates in real-time as we discuss your career.
            </p>
          </div>
          <div className="space-y-4 relative">
            {/* Current Status Section */}
            <div className="flex items-start space-x-3 p-4 bg-gray-900/50 rounded-xl hover:bg-gray-800/50 transition-colors duration-300 border border-gray-800/30 group">
              <Briefcase className="w-5 h-5 text-blue-400 mt-1 group-hover:scale-110 transition-transform" />
              <div className="w-full">
                <h4 className="font-medium text-blue-300">Current Status</h4>
                <div className="mt-2">
                  {renderCurrentStatus()}
                </div>
              </div>
            </div>
            {/* Experience Section */}
            <div className="flex items-start space-x-3 p-4 bg-gray-900/50 rounded-xl hover:bg-gray-800/50 transition-colors duration-300 border border-gray-800/30 group">
              <FileText className="w-5 h-5 text-blue-400 mt-1 group-hover:scale-110 transition-transform" />
              <div className="w-full">
                <h4 className="font-medium text-blue-300">Experience & Skills</h4>
                {renderExperienceInfo()}
              </div>
            </div>
            {/* Location Section */}
            <div className="flex items-start space-x-3 p-4 bg-gray-900/50 rounded-xl hover:bg-gray-800/50 transition-colors duration-300 border border-gray-800/30 group">
              <MapPin className="w-5 h-5 text-blue-400 mt-1 group-hover:scale-110 transition-transform" />
              <div className="w-full">
                <h4 className="font-medium text-blue-300">Location & Work Mode</h4>
                {renderLocationInfo()}
              </div>
            </div>
            {/* Industry Section */}
            <div className="flex items-start space-x-3 p-4 bg-gray-900/50 rounded-xl hover:bg-gray-800/50 transition-colors duration-300 border border-gray-800/30 group">
              <Building className="w-5 h-5 text-blue-400 mt-1 group-hover:scale-110 transition-transform" />
              <div className="w-full">
                <h4 className="font-medium text-blue-300">Target Industries</h4>
                {profile.preferredIndustries?.length ? (
                  <p className="text-blue-300 text-sm mt-1">
                    {formatArray(profile.preferredIndustries)}
                  </p>
                ) : (
                  <p className="text-gray-400 text-sm mt-1">
                    Tell me about your preferred industries...
                  </p>
                )}
              </div>
            </div>
            {/* Goals Section */}
            <div className="flex items-start space-x-3 p-4 bg-gray-900/50 rounded-xl hover:bg-gray-800/50 transition-colors duration-300 border border-gray-800/30 group">
              <ListChecks className="w-5 h-5 text-blue-400 mt-1 group-hover:scale-110 transition-transform" />
              <div className="w-full">
                <h4 className="font-medium text-blue-300">Career Goals</h4>
                {profile.targetRoles?.length ? (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {profile.targetRoles.map((role, index) => (
                      <div key={index} className="bg-blue-900/30 text-blue-300 px-3 py-1 rounded-full text-xs border border-blue-800/30 hover:bg-blue-800/40 transition-colors duration-300">
                        {role}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm mt-1">
                    What are your career aspirations...
                  </p>
                )}
              </div>
            </div>
            {/* Salary Section */}
            <div className="flex items-start space-x-3 p-4 bg-gray-900/50 rounded-xl hover:bg-gray-800/50 transition-colors duration-300 border border-gray-800/30 group">
              <CircleDollarSign className="w-5 h-5 text-blue-400 mt-1 group-hover:scale-110 transition-transform" />
              <div className="w-full">
                <h4 className="font-medium text-blue-300">Salary Range</h4>
                {formatSalaryRange(profile.salaryRange) ? (
                  <p className="text-blue-300 text-sm mt-1">
                    {formatSalaryRange(profile.salaryRange)}
                  </p>
                ) : (
                  <p className="text-gray-400 text-sm mt-1">
                    Expected compensation details...
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Status Indicator */}
        <div className="bg-gradient-to-r from-blue-900/30 via-purple-900/30 to-blue-900/30 p-4 text-center border-t border-blue-900/20">
          <div className="flex items-center justify-center">
            <Zap size={16} className="text-blue-400 mr-2 animate-pulse" />
            <LoadingDots size={2} color="bg-blue-400" />
          </div>
          <p className="text-xs text-gray-400 mt-2">Listening for updates...</p>
        </div>
      </div>

      {/* Render API Status */}
      {renderApiStatus()}

      {/* Job Search Results */}
      {(isSearching || searchResults.length > 0 || searchError) && (
        <JobSearchResults
          isSearching={isSearching}
          results={searchResults}
          error={searchError || undefined}
        />
      )}

      {/* API Tester (for development and testing) */}
      {process.env.NODE_ENV === 'development' && (
        <PerplexityApiTester />
      )}
    </>
  );
}