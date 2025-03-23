import React, { useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, RefreshCw } from 'lucide-react';

interface TestResult {
  connection: boolean;
  jobSearch: boolean;
}

interface ApiTestResponse {
  status: 'success' | 'failure' | 'error';
  message: string;
  results?: TestResult;
  error?: string;
  timestamp: string;
}

export default function PerplexityApiTester() {
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<ApiTestResponse | null>(null);

  const runTests = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/perplexity/test');
      const data = await response.json();
      setTestResults(data);
    } catch (error) {
      setTestResults({
        status: 'error',
        message: error instanceof Error ? error.message : 'An error occurred',
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderTestResult = (passed: boolean, label: string) => (
    <div className="flex items-center space-x-2 p-2">
      {passed ? (
        <CheckCircle className="w-5 h-5 text-green-400" />
      ) : (
        <XCircle className="w-5 h-5 text-red-400" />
      )}
      <span className={passed ? 'text-green-300' : 'text-red-300'}>
        {label}: {passed ? 'Passed' : 'Failed'}
      </span>
    </div>
  );

  return (
    <div className="mt-4 p-4 bg-gray-900/50 border border-gray-800 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-blue-300">Perplexity API Tests</h3>
        <button
          onClick={runTests}
          disabled={isLoading}
          className="flex items-center space-x-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Running Tests...</span>
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4" />
              <span>Run Tests</span>
            </>
          )}
        </button>
      </div>

      {testResults ? (
        <div className="space-y-3">
          <div className={`p-3 rounded-lg ${
            testResults.status === 'success' ? 'bg-green-900/20 border border-green-800/30' :
            testResults.status === 'failure' ? 'bg-yellow-900/20 border border-yellow-800/30' :
            'bg-red-900/20 border border-red-800/30'
          }`}>
            <div className="flex items-center space-x-2">
              {testResults.status === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : testResults.status === 'failure' ? (
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
              ) : (
                <XCircle className="w-5 h-5 text-red-400" />
              )}
              <span className={
                testResults.status === 'success' ? 'text-green-300' :
                testResults.status === 'failure' ? 'text-yellow-300' :
                'text-red-300'
              }>
                {testResults.message}
              </span>
            </div>
          </div>

          {testResults.results && (
            <div className="p-3 bg-gray-800/50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-300 mb-2">Test Details:</h4>
              <div className="space-y-1">
                {renderTestResult(testResults.results.connection, 'API Connection')}
                {renderTestResult(testResults.results.jobSearch, 'Job Search')}
              </div>
            </div>
          )}

          <div className="text-xs text-gray-400">
            Last run: {new Date(testResults.timestamp).toLocaleString()}
          </div>
        </div>
      ) : (
        <div className="text-center py-4 text-gray-400">
          Click "Run Tests" to verify Perplexity API integration
        </div>
      )}
    </div>
  );
}