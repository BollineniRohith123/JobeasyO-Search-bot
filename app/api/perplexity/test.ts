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
    
    // Simplified test profile with essential fields only
    const testProfile: JobProfileItem = {
      skills: ['JavaScript'],
      techStack: ['React'],
      experience: 'Mid-level software developer',
      yearsOfExperience: '3',
      preferredIndustries: ['Technology'],
      preferredRoles: ['Frontend Developer'],
      employmentTypes: ['Full-time'],
      locationPreference: 'San Francisco',
      remotePreference: 'Remote',
      salaryRange: { min: 0, max: 0, currency: '$' },
      targetRoles: ['Frontend Developer'],
      suggestedRoles: [],
      currentStatus: 'Actively looking',
      additionalNotes: ''
    };
    
    const results = await perplexityService.searchJobs(testProfile);
    
    console.log('Job search response:', results);
    
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
