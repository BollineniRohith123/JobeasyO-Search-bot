/**
 * Perplexity API Test Suite
 * 
 * This file contains tests for the Perplexity API integration.
 * Run these tests to verify that the API is working correctly.
 */

import { PerplexityService } from '@/app/services/perplexity';
import { JobProfileItem } from '@/lib/types';

/**
 * Test the Perplexity API connection
 */
export async function testPerplexityConnection(apiKey: string): Promise<boolean> {
  try {
    console.log('Testing Perplexity API connection...');
    
    const perplexityService = new PerplexityService({
      apiKey,
      model: 'sonar',
      temperature: 0.3,
      maxTokens: 3000
    });
    
    const result = await perplexityService.testConnection();
    
    console.log('Connection test result:', result);
    return result.isOperational;
  } catch (error) {
    console.error('Error testing Perplexity API connection:', error);
    return false;
  }
}

/**
 * Test the Perplexity job search functionality
 */
export async function testJobSearch(apiKey: string): Promise<boolean> {
  try {
    console.log('Testing Perplexity job search functionality...');
    
    const perplexityService = new PerplexityService({
      apiKey,
      model: 'sonar',
      temperature: 0.3,
      maxTokens: 3000
    });
    
    // Sample profile for testing
    const testProfile: JobProfileItem = {
      skills: ['JavaScript', 'React', 'Node.js'],
      techStack: ['TypeScript', 'Next.js', 'TailwindCSS'],
      experience: 'Mid-level',
      yearsOfExperience: '3',
      preferredIndustries: ['Technology', 'Finance'],
      preferredRoles: ['Frontend Developer', 'Full Stack Developer'],
      employmentTypes: ['Full-time'],
      locationPreference: 'San Francisco',
      remotePreference: 'Remote',
      salaryRange: { min: 100000, max: 150000, currency: '$' },
      targetRoles: ['Frontend Developer', 'React Developer'],
      suggestedRoles: [],
      currentStatus: 'Actively looking',
      additionalNotes: 'Looking for a remote position with a good work-life balance'
    };
    
    const results = await perplexityService.searchJobs(testProfile);
    
    console.log(`Job search returned ${results.length} results`);
    console.log('First result:', results[0]);
    
    return results.length > 0;
  } catch (error) {
    console.error('Error testing Perplexity job search:', error);
    return false;
  }
}

/**
 * Run all tests
 */
export async function runAllTests(apiKey: string): Promise<{
  connection: boolean;
  jobSearch: boolean;
}> {
  const connectionTest = await testPerplexityConnection(apiKey);
  const jobSearchTest = await testJobSearch(apiKey);
  
  return {
    connection: connectionTest,
    jobSearch: jobSearchTest
  };
}