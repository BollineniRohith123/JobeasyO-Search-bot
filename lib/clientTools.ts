import { ClientToolImplementation, Role } from 'ultravox-client';
import type { JobProfileItem } from '@/lib/types';
import { toggleMute } from './callFunctions';

// Client-implemented tool for Job Profile
export const updateJobProfileTool: ClientToolImplementation = (parameters) => {
  console.debug("Received job profile update parameters:", parameters);
  
  try {
    // Get the profileData from parameters
    const profileData = parameters.profileData;
    
    // Basic validation for required fields
    if (!profileData) {
      throw new Error("Profile data is missing");
    }

    // Validate and ensure all fields exist with proper types
    const validatedProfile: JobProfileItem = {
      skills: Array.isArray(profileData.skills) ? profileData.skills : [],
      techStack: Array.isArray(profileData.techStack) ? profileData.techStack : [],
      experience: String(profileData.experience || ''),
      yearsOfExperience: String(profileData.yearsOfExperience || ''),
      preferredIndustries: Array.isArray(profileData.preferredIndustries) ? profileData.preferredIndustries : [],
      preferredRoles: Array.isArray(profileData.preferredRoles) ? profileData.preferredRoles : [],
      employmentTypes: Array.isArray(profileData.employmentTypes) ? profileData.employmentTypes : [],
      locationPreference: String(profileData.locationPreference || ''),
      remotePreference: String(profileData.remotePreference || ''),
      salaryRange: {
        min: Number(profileData.salaryRange?.min || 0),
        max: Number(profileData.salaryRange?.max || 0),
        currency: String(profileData.salaryRange?.currency || 'USD')
      },
      targetRoles: Array.isArray(profileData.targetRoles) ? profileData.targetRoles : [],
      suggestedRoles: Array.isArray(profileData.suggestedRoles) ? profileData.suggestedRoles : [],
      currentStatus: String(profileData.currentStatus || ''),
      additionalNotes: String(profileData.additionalNotes || '')
    };
    
    console.debug("Validated profile data:", validatedProfile);
    
    if (typeof window !== "undefined") {
      // Create and dispatch the event with the validated data
      const event = new CustomEvent("jobProfileUpdated", {
        detail: JSON.stringify(validatedProfile),
      });
      
      console.debug("Dispatching jobProfileUpdated event");
      window.dispatchEvent(event);
      console.debug("Event dispatched successfully");
    }
    
    return "Updated the job profile successfully.";
  } catch (error) {
    console.error("Error processing profile update:", error);
    return "Failed to update job profile: " + (error instanceof Error ? error.message : String(error));
  }
};

// Add the toggleMic function for use in the MicToggleButton component
export const toggleMic = async (role: Role): Promise<boolean> => {
  try {
    toggleMute(role);
    
    // Return true to indicate success
    return true;
  } catch (error) {
    console.error(`Error toggling ${role === Role.USER ? 'microphone' : 'speaker'}:`, error);
    
    // Return false to indicate failure
    return false;
  }
};