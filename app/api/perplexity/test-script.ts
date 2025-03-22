/**
 * Perplexity API Test Script
 * 
 * This script can be run from the command line to test the Perplexity API integration.
 * Usage: ts-node test-script.ts <API_KEY>
 */

import { runAllTests } from './test';

async function main() {
  // Get API key from command line arguments
  const apiKey = process.argv[2];
  
  if (!apiKey) {
    console.error('Error: API key is required');
    console.error('Usage: ts-node test-script.ts <API_KEY>');
    process.exit(1);
  }
  
  console.log('Running Perplexity API tests...');
  
  try {
    const results = await runAllTests(apiKey);
    
    console.log('\n=== Test Results ===');
    console.log(`API Connection: ${results.connection ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`Job Search: ${results.jobSearch ? '✅ PASSED' : '❌ FAILED'}`);
    
    const allPassed = Object.values(results).every(result => result === true);
    
    console.log('\n=== Summary ===');
    if (allPassed) {
      console.log('✅ All tests passed successfully!');
      process.exit(0);
    } else {
      console.log('❌ Some tests failed. Please check the results above.');
      process.exit(1);
    }
  } catch (error) {
    console.error('Error running tests:', error);
    process.exit(1);
  }
}

main();