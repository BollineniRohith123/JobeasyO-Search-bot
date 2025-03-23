import { NextRequest, NextResponse } from 'next/server';
import { runAllTests } from '../test';

// Load Perplexity API key from environment variable
const perplexityApiKey = process.env.PERPLEXITY_API_KEY;

export async function GET() {
  try {
    if (!perplexityApiKey) {
      return NextResponse.json(
        { error: 'Perplexity API key is not configured' },
        { status: 500 }
      );
    }

    // Run all tests
    const testResults = await runAllTests(perplexityApiKey);
    
    // Determine overall status
    const allTestsPassed = Object.values(testResults).every(result => result === true);
    
    return NextResponse.json({
      status: allTestsPassed ? 'success' : 'failure',
      message: allTestsPassed 
        ? 'All Perplexity API tests passed successfully' 
        : 'Some Perplexity API tests failed',
      results: testResults,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error running Perplexity API tests:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'An error occurred',
        status: 'error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}