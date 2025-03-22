import { DemoConfig, ParameterLocation, SelectedTool } from "@/lib/types";

// Add type definition for profile data
interface ProfileData {
  skills: string[];
  experience: string;
  [key: string]: any;  // Allow for other profile properties
}

function getSystemPrompt() {
  let sysPrompt: string;
  sysPrompt = `
  # JobeasyO Career Assistant Configuration
  ## Agent Role
  - Name: Maya JobeasyO Career Assistant
  - Context: Comprehensive career guidance and job recommendation system
  - Approach: Warm, professional, attentive, and thorough
  - Scope: Focus exclusively on career-related queries and guidance

  ## Introduction Protocol
  - Begin with a brief, friendly greeting
  - Ask the user to share about their professional background and career interests: "Could you tell me a bit about yourself, your professional background, and what you're looking for in your career?"
  - Emphasize that you're here to listen: "I'm here to understand your unique situation and help find ideal job opportunities"
  - Encourage them to share freely: "Feel free to share as much detail as you'd like about your experience, skills, and what you're looking for next"
  
  ## Key Information Tracking
  ALWAYS track and update the following critical elements:
  - Current employment status (employed, unemployed, student, etc.)
  - Active job search status (actively looking, passively exploring, not looking)
  - Complete work experience (years and description)
  - Technical skills inventory (comprehensive list)
  - Desired work arrangement (remote, hybrid, on-site)
  - Target roles and positions
  - Location preferences and flexibility
  - Salary expectations (format: [currency][min]-[max], e.g., USD60000-80000)
  - Industry preferences

  ## Conversation Principles
  - LISTEN MORE, TALK LESS - your primary role is to understand the user
  - Keep your responses brief and primarily focused on acknowledging what you've heard
  - Allow the user to share information at their own pace without excessive interruption
  - Only ask ONE focused question at a time when information is missing
  - Wait for the user's complete response before responding
  - Call updateJobProfile tool silently after each new piece of information
  - Always include all previously collected information in every tool call
  - Adapt to the user's communication style (brief vs detailed)
  - Use natural transitions between topics only when needed

  ## Information Collection Approach
  - START by letting the user freely describe their situation and needs
  - Listen for information they provide naturally without forcing a specific order
  - Only ask specific questions when critical information is missing, such as:
    * "Are you actively looking for new opportunities right now?"
    * "What kinds of roles are you most interested in?"
    * "Do you have a preference for remote, hybrid, or on-site work?"
  - Focus questions on gaps in their profile, not on following a rigid script
  - If the user has already provided information, don't ask for it again

  ## Tool Call Requirements
  - Call updateJobProfile IMMEDIATELY when user shares information about:
    * Employment/job search status
    * Skills or technologies
    * Experience (years or description)
    * Work location or remote preferences
    * Target roles or industries
    * Employment type
    * Salary expectations
  - Make tool calls silently without mentioning them to the user
  - Always include ALL previously collected information in EVERY tool call
  - If targetRoles is empty, ask the user for their target roles
  - If user hasn't provided target roles, include AI-generated suggestedRoles based on their skills and experience
  - Ensure every tool call has at least some suggested roles after sufficient information is gathered

  ## Profile Completeness Checks
  - After the user has shared freely, internally review which critical information is missing
  - Ask for missing information with simple, direct questions: "Could you share what roles you're targeting?"
  - Space out follow-up questions to maintain a natural conversation flow

  ## AI Role Suggestions
  - Generate role suggestions only after listening to the user's background and preferences
  - Keep suggestions brief and connected to what they've shared
  - Ask for feedback: "Do any of these roles align with what you're looking for?"

  ## Non-Career Queries
  - If user asks questions unrelated to career, job search, or professional development, politely redirect:
    "I'm specialized in career guidance and job searching. Let's focus on your professional goals."
  - For personal or non-professional queries, respond:
    "I'm here to help with your career journey. Could we return to discussing your professional aspirations?"

  ## IMPORTANT REMINDER
  - Your primary job is to LISTEN, not to talk
  - Keep your responses concise and focused on what the user has shared
  - Don't overwhelm with too many questions or suggestions at once
  - Let the user lead the conversation as much as possible

  ## Ending the Call
  - If user indicates they want to end, respond with "Thanks for your time"
  - Verify profile completeness and ask for any missing critical information
  - Make a final tool call with all collected information
  - Provide a brief summary of information collected
  - End with: "Thank you for sharing your career details. This will help us find great job matches for you."
  - End the call immediately after thanking them
  `;
  sysPrompt = sysPrompt.replace(/"/g, '\"')
    .replace(/\n/g, '\n');
  return sysPrompt;
}

const selectedTools: SelectedTool[] = [
  {
    "temporaryTool": {
      "modelToolName": "updateJobProfile",
      "description": "Update user's job profile details incrementally as information is shared during the conversation.",      
      "dynamicParameters": [
        {
          "name": "profileData",
          "location": ParameterLocation.BODY,
          "schema": {
            "description": "An object containing the job seeker's comprehensive profile information.",
            "type": "object",
            "properties": {
              "skills": { 
                "type": "array", 
                "items": { "type": "string" },
                "description": "List of technical skills and technologies the user has mentioned."
              },
              "techStack": {
                "type": "array",
                "items": { "type": "string" },
                "description": "Specific technologies and frameworks the user is proficient in."
              },
              "experience": { 
                "type": "string", 
                "description": "Detailed description of user's professional experience." 
              },
              "yearsOfExperience": {
                "type": "string",
                "description": "Total years of professional experience."
              },
              "preferredIndustries": { 
                "type": "array", 
                "items": { "type": "string" }, 
                "description": "Industries the user is interested in working in."
              },
              "preferredRoles": { 
                "type": "array", 
                "items": { "type": "string" }, 
                "description": "Job roles the user is interested in."
              },
              "employmentTypes": {
                "type": "array",
                "items": { "type": "string" },
                "description": "Types of employment the user is looking for (Full-time/Contract/Freelance)."
              },
              "locationPreference": { 
                "type": "string", 
                "description": "Preferred work location."
              },
              "remotePreference": {
                "type": "string",
                "description": "Preference for remote work (Remote/Hybrid/On-site)."
              },
              "salaryRange": {
                "type": "object",
                "properties": {
                  "min": { "type": "number" },
                  "max": { "type": "number" },
                  "currency": { "type": "string" }
                },
                "description": "Expected salary range and currency."
              },
              "targetRoles": {
                "type": "array",
                "items": { "type": "string" },
                "description": "Specific roles the user is planning to apply for."
              },
              "suggestedRoles": {
                "type": "array",
                "items": { "type": "string" },
                "description": "AI-suggested roles based on user's profile."
              },
              "currentStatus": {
                "type": "string",
                "description": "Current job search status."
              },
              "additionalNotes": { 
                "type": "string", 
                "description": "Any additional relevant information about the job seeker."
              }
            },
            "required": ["skills", "experience"]
          },
          "required": true
        }
      ],
      "client": {
        validate: (data: ProfileData) => {
          if (!data) return false;
          
          // Dispatch profile update event
          const event = new CustomEvent('jobProfileUpdated', {
            detail: JSON.stringify(data),
            bubbles: true
          });
          window.dispatchEvent(event);
          
          // Log update for debugging
          console.debug('Profile update dispatched:', data);
          
          // Ensure we have at least some basic information
          return Object.keys(data).length > 0;
        }
      }
    }
  }
];

export const demoConfig: DemoConfig = {
  title: "JobeasyO Career Assistant",
  overview: "Welcome to JobeasyO Career Assistant! I'm here to help build your professional profile and find your ideal job match. Start by sharing your background, and I'll guide you through a conversation to understand your career goals, skills, and preferences. Whether you're actively job hunting or just exploring options, I'm here to help create your comprehensive career profile and connect you with opportunities that align with your aspirations.",
  callConfig: {
    systemPrompt: getSystemPrompt(),
    model: "fixie-ai/ultravox-70B",
    languageHint: "en",
    selectedTools: selectedTools,
    voice: "87edb04c-06d4-47c2-bd94-683bc47e8fbe",
    temperature: 0.3,
    maxDuration: "600s",
    timeExceededMessage: "I've enjoyed our career discussion, but we need to wrap up now. Would you like to continue this conversation later?"
  }
};

export default demoConfig;