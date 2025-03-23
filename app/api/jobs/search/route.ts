import { NextRequest, NextResponse } from 'next/server';
import { PerplexityService } from '@/app/services/perplexity';
import { JobMatch } from '@/app/types/perplexity';
import { JobProfileItem } from '@/lib/types';

export const runtime = 'edge';
export const revalidate = 0;

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    // Check API key first
    const apiKey = process.env.PERPLEXITY_API_KEY;
    
    if (!apiKey) {
      console.error('Perplexity API key not found in environment variables');
      return NextResponse.json(
        {
          success: false,
          error: 'Job search service is not properly configured'
        },
        { status: 500 }
      );
    }

    // Parse and validate request body
    let profile: JobProfileItem;
    try {
      profile = await req.json();
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request format'
        },
        { status: 400 }
      );
    }

    // Validate required profile fields
    if (!profile.targetRoles?.length && !profile.preferredRoles?.length) {
      return NextResponse.json(
        {
          success: false,
          error: 'Please specify your target roles to find matching jobs'
        },
        { status: 400 }
      );
    }

    console.log('Received profile:', profile);

    // Add suggested roles to preferred roles if available
    const enrichedProfile = {
      ...profile,
      preferredRoles: [
        ...(profile.targetRoles || []),
        ...(profile.preferredRoles || [])
      ],
      techStack: [
        ...(profile.techStack || []),
        ...(profile.skills || [])
      ]
    };

    console.log('Enriched profile for job search:', enrichedProfile);

    // Initialize job search service
    const jobSearchService = new PerplexityService({
      apiKey,
      model: 'sonar',
      temperature: 0.3,
      maxTokens: 4000
    });

    // Test connection first
    const testResult = await jobSearchService.testConnection();
    if (!testResult.isOperational) {
      console.error('Job search service test failed:', testResult.message);
      return NextResponse.json(
        {
          success: false,
          error: 'Job search service is temporarily unavailable. Please try again in a few minutes.'
        },
        { status: 503 }
      );
    }

    // Search for jobs
    const results = await jobSearchService.searchJobs(enrichedProfile);
    
    // Validate results
    if (!Array.isArray(results)) {
      console.error('Invalid response format:', results);
      throw new Error('Received invalid response from job search service');
    }

    // Enrich and validate job results
    const enrichedResults = results
      .filter((job): job is JobMatch => {
        // Type guard to ensure each job has required fields
        return (
          typeof job === 'object' &&
          job !== null &&
          typeof job.title === 'string' &&
          typeof job.company === 'string' &&
          typeof job.applyUrl === 'string'
        );
      })
      .map(job => ({
        ...job,
        postedDate: job.postedDate || 'Recently posted',
        description: job.description || 'Full job description available on application page'
      }));

    // Return appropriate response based on results
    if (enrichedResults.length === 0) {
      return NextResponse.json({
        success: true,
        jobs: [],
        message: 'No exact matches found. Try adjusting your search criteria.'
      });
    }

    return NextResponse.json({
      success: true,
      jobs: enrichedResults
    });

  } catch (error) {
    console.error('Job search error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    const isAuthError = error instanceof Error && (
      errorMessage.includes('API key') || 
      errorMessage.includes('authentication') || 
      errorMessage.includes('401') ||
      errorMessage.includes('403')
    );

    // Set appropriate status code and message
    const status = isAuthError ? 401 : 
      error instanceof Error && errorMessage.includes('Rate limit') ? 429 : 500;
    
    const message = isAuthError 
      ? 'Job search service authentication failed. Please try again later.'
      : status === 429
      ? 'Too many requests. Please try again in a few minutes.'
      : 'Unable to complete job search. Please try again.';
    
    return NextResponse.json(
      {
        success: false,
        error: message,
        details: errorMessage
      },
      { status }
    );
  }
}
