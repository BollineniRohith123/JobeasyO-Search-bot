import { NextRequest, NextResponse } from 'next/server';
import { PerplexityService } from '@/app/services/perplexity';
import { JobProfileItem } from '@/lib/types';

// Load Perplexity API key from environment variable
const perplexityApiKey = process.env.NEXT_PUBLIC_PERPLEXITY_API_KEY;

export async function POST(request: NextRequest) {
  try {
    if (!perplexityApiKey) {
      return NextResponse.json(
        { error: 'Perplexity API key is not configured' },
        { status: 500 }
      );
    }

    const perplexityService = new PerplexityService({
      apiKey: perplexityApiKey,
      model: 'sonar',
      temperature: 0.3,
      maxTokens: 3000
    });

    const body = await request.json();
    const { profile } = body;

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile data is required' },
        { status: 400 }
      );
    }

    // Convert to JobProfileItem
    const jobProfile: JobProfileItem = {
      skills: profile.skills || [],
      techStack: profile.techStack || [],
      experience: profile.experience || '',
      yearsOfExperience: profile.yearsOfExperience || '',
      preferredIndustries: profile.preferredIndustries || [],
      preferredRoles: profile.preferredRoles || [],
      employmentTypes: profile.employmentTypes || [],
      locationPreference: profile.locationPreference || '',
      remotePreference: profile.remotePreference || '',
      salaryRange: profile.salaryRange || { min: 0, max: 0, currency: 'USD' },
      targetRoles: profile.targetRoles || [],
      suggestedRoles: profile.suggestedRoles || [],
      currentStatus: profile.currentStatus || '',
      additionalNotes: profile.additionalNotes || ''
    };

    // Trigger call ended event to notify frontend
    const results = await perplexityService.searchJobs(jobProfile);
    
    return NextResponse.json({ results });
  } catch (error) {
    console.error('Error in Perplexity API route:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An error occurred' },
      { status: 500 }
    );
  }
}

// For testing purposes
export async function GET() {
  try {
    if (!perplexityApiKey) {
      return NextResponse.json(
        { error: 'Perplexity API key is not configured' },
        { status: 500 }
      );
    }

    // Return API documentation
    return NextResponse.json({
      status: 'Perplexity API is operational',
      documentation: {
        endpoints: [
          {
            method: 'POST',
            path: '/api/perplexity',
            description: 'Search for jobs using Perplexity API',
            requestBody: {
              profile: 'JobProfileItem object with user profile data'
            },
            response: {
              results: 'Array of job matches'
            }
          },
          {
            method: 'GET',
            path: '/api/perplexity',
            description: 'Get API status and documentation',
            response: {
              status: 'API operational status',
              documentation: 'API documentation'
            }
          }
        ]
      }
    });
  } catch (error) {
    console.error('Error in Perplexity API route:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An error occurred' },
      { status: 500 }
    );
  }
}