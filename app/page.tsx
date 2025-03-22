'use client';
import React, { useState, useCallback, useEffect, useRef, Suspense } from 'react';
import { useToast } from './context/ToastContext';
import LoadingScreen, { LoadingSpinner } from './components/LoadingScreen';
import { useSearchParams } from 'next/navigation'; 
import { startCall, endCall } from '@/lib/callFunctions'
import { CallConfig, SelectedTool, JobProfileData } from '@/lib/types'
import demoConfig from './demo-config';
import { Role, Transcript, UltravoxSessionStatus } from 'ultravox-client';
import BorderedImage from '@/app/components/BorderedImage';
import UVLogo from '@/public/UVMark-White.svg';
import CallStatus from './components/CallStatus';
import MicToggleButton from './components/MicToggleButton';
import { PhoneOffIcon, Briefcase, Code, MapPin, Building, XCircle } from 'lucide-react';
import JobProfile from './components/JobProfile';
import ConversationSummary from './components/ConversationSummary';
import BackgroundAnimation from './components/BackgroundAnimation';
import GradientText from './components/GradientText';

type SearchParamsProps = {
  showMuteSpeakerButton: boolean;
  modelOverride: string | undefined;
  showUserTranscripts: boolean;
};

type SearchParamsHandlerProps = {
  children: (props: SearchParamsProps) => React.ReactNode;
};

function SearchParamsHandler({ children }: SearchParamsHandlerProps) {
  const searchParams = useSearchParams();
  const showMuteSpeakerButton = searchParams.get('showSpeakerMute') === 'true';
  const showUserTranscripts = searchParams.get('showUserTranscripts') === 'true';
  let modelOverride: string | undefined;
  
  if (searchParams.get('model')) {
    modelOverride = "fixie-ai/" + searchParams.get('model');
  }
  return children({ showMuteSpeakerButton, modelOverride, showUserTranscripts });
}

export default function Home() {
  const { showToast } = useToast();
  const [isCallActive, setIsCallActive] = useState(false);
  const [agentStatus, setAgentStatus] = useState<string>('off');
  const [callTranscript, setCallTranscript] = useState<Transcript[] | null>([]);
  const [customerProfileKey, setCustomerProfileKey] = useState<string | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [latestProfile, setLatestProfile] = useState<JobProfileData | null>(null);
  const transcriptContainerRef = useRef<HTMLDivElement>(null);
  const [showFloatingButton, setShowFloatingButton] = useState(false);

  useEffect(() => {
    if (transcriptContainerRef.current) {
      transcriptContainerRef.current.scrollTop = transcriptContainerRef.current.scrollHeight;
    }
  }, [callTranscript]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setShowFloatingButton(scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleStatusChange = useCallback((status: UltravoxSessionStatus | string | undefined) => {
    if(status) {
      setAgentStatus(status);
    } else {
      setAgentStatus('off');
    }
    
  }, []);

  const handleTranscriptChange = useCallback((transcripts: Transcript[] | undefined) => {
    if(transcripts) {
      setCallTranscript([...transcripts]);
    }
  }, []);

  const clearCustomerProfile = useCallback(() => {
    setCustomerProfileKey(prev => prev ? `${prev}-cleared` : 'cleared');
  }, []);

  const handleStartCallButtonClick = async (modelOverride?: string) => {
    try {
      handleStatusChange('Starting call...');
      setCallTranscript(null);
      clearCustomerProfile();
      const newKey = `call-${Date.now()}`;
      setCustomerProfileKey(newKey);
      let callConfig: CallConfig = {
        systemPrompt: demoConfig.callConfig.systemPrompt,
        model: modelOverride || demoConfig.callConfig.model,
        languageHint: demoConfig.callConfig.languageHint,
        voice: demoConfig.callConfig.voice,
        temperature: demoConfig.callConfig.temperature,
        maxDuration: demoConfig.callConfig.maxDuration,
        timeExceededMessage: demoConfig.callConfig.timeExceededMessage
      };
      const paramOverride: { [key: string]: any } = {
        "callId": newKey
      }
      let cpTool: SelectedTool | undefined = demoConfig?.callConfig?.selectedTools?.find(tool => tool.toolName === "updateJobProfile");
      
      if (cpTool) {
        cpTool.parameterOverrides = paramOverride;
      }
      callConfig.selectedTools = demoConfig.callConfig.selectedTools;
      await startCall({
        onStatusChange: handleStatusChange,
        onTranscriptChange: handleTranscriptChange
      }, callConfig);
      setIsCallActive(true);
      handleStatusChange('Call started successfully');
      showToast('Career conversation started successfully', 'success');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      handleStatusChange(`Error starting call: ${errorMessage}`);
      showToast(`Failed to start conversation: ${errorMessage}`, 'error');
    }
  };

  const handleEndCallButtonClick = async () => {
    try {
      handleStatusChange('Ending call...');
      await endCall();
      setIsCallActive(false);
      handleStatusChange('Call ended successfully');
      setShowSummary(true);
      showToast('Career conversation completed! Showing summary...', 'success');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      handleStatusChange(`Error ending call: ${errorMessage}`);
      showToast(`Failed to end conversation: ${errorMessage}`, 'error');
    }
  };

  useEffect(() => {
    const handleProfileUpdate = (event: CustomEvent<string>) => {
      try {
        const parsedData = JSON.parse(event.detail);
        const updatedProfile = {
          profile: {
            ...(latestProfile?.profile || {}),
            ...parsedData
          }
        };
        
        setLatestProfile(updatedProfile);

        // Ensure JobProfile component gets the update
        const profileUpdateEvent = new CustomEvent('jobProfileUpdated', {
          detail: JSON.stringify(updatedProfile.profile)
        });
        window.dispatchEvent(profileUpdateEvent);
      } catch (error) {
        console.error('Error parsing profile data:', error);
        showToast('Error updating profile', 'error');
      }
    };

    window.addEventListener('jobProfileUpdated', handleProfileUpdate as EventListener);
    return () => {
      window.removeEventListener('jobProfileUpdated', handleProfileUpdate as EventListener);
    };
  }, [showToast, latestProfile]);

  const [isLoading, setIsLoading] = useState(false);

  const startCallWithLoading = async (modelOverride?: string) => {
    setIsLoading(true);
    try {
      await handleStartCallButtonClick(modelOverride);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <BackgroundAnimation 
        variant={
          isCallActive ? 'active' : 
          isLoading ? 'subtle' : 
          'default'
        } 
      />
      <Suspense fallback={<LoadingScreen message="Loading JobeasyO..." />}>
      {isLoading && <LoadingScreen message="Initializing voice interaction..." />}
      <SearchParamsHandler>
        {({ showMuteSpeakerButton, modelOverride, showUserTranscripts }: SearchParamsProps) => (
          <>
            {!isCallActive && showFloatingButton && (
              <button
                type="button"
                className="fixed bottom-8 right-8 z-50 animate-bounce hover:animate-none hover:bg-blue-700 bg-blue-600 px-6 py-4 text-lg font-bold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center space-x-2"
                onClick={() => startCallWithLoading(modelOverride)}
              >
                <span>Start Career Conversation</span>
                <svg className="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
            
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)]">
              <div className="max-w-[1206px] mx-auto w-full py-5 pl-5 pr-[10px] border border-[#2A2A2A] rounded-[3px]">
                <div className="flex flex-col justify-center lg:flex-row">
                  <div className="w-full lg:w-2/3">
                    <div className="flex flex-col justify-between items-center h-full font-mono p-4">
                      {isCallActive ? (
                        <div className="w-full">
                          <div className="mb-5 relative">
                            <div 
                              ref={transcriptContainerRef}
                              className="h-[400px] p-4 overflow-y-auto relative bg-gray-900/95 backdrop-blur border border-gray-800 rounded-lg scrollbar-visible"
                            >
                              {callTranscript && callTranscript.map((transcript, index) => (
                                <div 
                                  key={index} 
                                  className={`mb-4 p-3 rounded-lg transition-all duration-300 ${
                                    transcript.speaker === 'agent' 
                                      ? 'bg-blue-900/20 border border-blue-800/30' 
                                      : showUserTranscripts ? 'bg-gray-800/50 border border-gray-700/30' : 'hidden'
                                  }`}
                                >
                                  <div className="flex items-center mb-2">
                                    {transcript.speaker === 'agent' ? (
                                      <>
                                        <Briefcase size={16} className="text-blue-400 mr-2" />
                                        <span className="text-blue-400 font-medium">JobeasyO Assistant</span>
                                      </>
                                    ) : (
                                      <>
                                        <MapPin size={16} className="text-gray-400 mr-2" />
                                        <span className="text-gray-400 font-medium">You</span>
                                      </>
                                    )}
                                  </div>
                                  <p className={`${
                                    transcript.speaker === 'agent' 
                                      ? 'text-blue-100' 
                                      : 'text-gray-300'
                                  } leading-relaxed`}>
                                    {transcript.text}
                                  </p>
                                </div>
                              ))}
                            </div>
                            <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-t from-transparent to-gray-900/95 pointer-events-none rounded-t-lg" />
                            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-transparent to-gray-900/95 pointer-events-none rounded-b-lg" />
                          </div>
                          <div className="flex justify-between space-x-4 p-4 w-full bg-gray-900/95 backdrop-blur border border-gray-800 rounded-lg mt-4">
                            <MicToggleButton role={Role.USER}/>
                            { showMuteSpeakerButton && <MicToggleButton role={Role.AGENT}/> }
                            <button
                              type="button"
                              className="flex-grow flex items-center justify-center h-10 bg-red-500/90 hover:bg-red-600/90 rounded-md transition-colors duration-300"
                              onClick={handleEndCallButtonClick}
                              disabled={!isCallActive}
                            >
                              <PhoneOffIcon width={24} className="brightness-0 invert" />
                              <span className="ml-2">End Conversation</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center w-full py-8">
                          <div className="flex flex-col items-center justify-center mb-12 text-center">
                            <div className="relative mb-8">
                              <Briefcase size={120} className="text-blue-400" />
                              <div className="absolute -top-4 -right-4 w-8 h-8 bg-green-500 rounded-full animate-ping" />
                              <div className="absolute -top-4 -right-4 w-8 h-8 bg-green-500 rounded-full" />
                            </div>
                            <h2 className="text-4xl font-bold mb-4">
                              <GradientText animate className="text-5xl">JobeasyO</GradientText>
                            </h2>
                            <p className="text-xl text-gray-400 mb-8 max-w-2xl">
                              Your AI-powered career assistant is ready to help you find your 
                              <GradientText className="ml-2 font-semibold">perfect role</GradientText>
                            </p>
                            
                            <button
                              type="button"
                              className="group relative hover:scale-105 hover:bg-blue-700 bg-blue-600 px-10 py-5 text-xl font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                              onClick={() => startCallWithLoading(modelOverride)}
                            >
                              <div className="absolute inset-0 bg-blue-400 rounded-xl animate-pulse group-hover:animate-none opacity-20"></div>
                              <div className="flex items-center space-x-3">
                                <span>Start Career Conversation</span>
                                <svg className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            </button>
                          </div>

                          <div className="w-full max-w-2xl bg-gray-900 rounded-lg p-6 mb-8">
                            <h3 className="text-xl mb-4">
                              <GradientText>Let's Find Your Perfect Role</GradientText>
                            </h3>
                            <p className="text-gray-400 mb-6">{demoConfig.overview}</p>
                            <div className="bg-gray-800 p-6 rounded-lg border-l-4 border-blue-400">
                              <p className="font-semibold mb-4">
                                <GradientText
                                  from="from-blue-300"
                                  via="via-indigo-300"
                                  to="to-purple-300"
                                >
                                  Ready to discuss:
                                </GradientText>
                              </p>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-start space-x-3 p-3 rounded-lg bg-gray-900/50">
                                  <Code className="w-5 h-5 text-blue-400 mt-1" />
                                  <div>
                                    <h4 className="font-semibold text-blue-300">Skills & Experience</h4>
                                    <p className="text-sm text-gray-400">Share your technical expertise</p>
                                  </div>
                                </div>
                                <div className="flex items-start space-x-3 p-3 rounded-lg bg-gray-900/50">
                                  <Briefcase className="w-5 h-5 text-blue-400 mt-1" />
                                  <div>
                                    <h4 className="font-semibold text-blue-300">Career Goals</h4>
                                    <p className="text-sm text-gray-400">Define your career objectives</p>
                                  </div>
                                </div>
                                <div className="flex items-start space-x-3 p-3 rounded-lg bg-gray-900/50">
                                  <MapPin className="w-5 h-5 text-blue-400 mt-1" />
                                  <div>
                                    <h4 className="font-semibold text-blue-300">Location</h4>
                                    <p className="text-sm text-gray-400">Specify work preferences</p>
                                  </div>
                                </div>
                                <div className="flex items-start space-x-3 p-3 rounded-lg bg-gray-900/50">
                                  <Building className="w-5 h-5 text-blue-400 mt-1" />
                                  <div>
                                    <h4 className="font-semibold text-blue-300">Industries</h4>
                                    <p className="text-sm text-gray-400">Explore opportunities</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <CallStatus status={agentStatus}>
                    <JobProfile />
                  </CallStatus>
                </div>
              </div>
              {showSummary && latestProfile && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 overflow-y-auto fade-in">
                  <div className="min-h-screen px-4 py-12 flex items-center justify-center">
                    <div className="relative w-full max-w-5xl">
                      <div className="sticky top-4 flex justify-end mb-4 fade-in-up delay-100">
                        <button
                          onClick={() => setShowSummary(false)}
                          className="bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white px-4 py-2 rounded-full flex items-center transition-all duration-300"
                        >
                          <span className="mr-2">Close Summary</span>
                          <XCircle size={20} />
                        </button>
                      </div>
                      <div className="bg-black/50 rounded-xl p-6 fade-in-up delay-200">
                        <ConversationSummary profile={latestProfile} />
                      </div>
                      <div className="text-center mt-8 text-gray-400 fade-in-up delay-300">
                        <p>Thank you for using JobeasyO! We hope this conversation was helpful.</p>
                        <p className="mt-2">Feel free to start another conversation anytime.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </SearchParamsHandler>
      </Suspense>
    </>
  );
}
