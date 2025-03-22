export interface PerplexityConfig {
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
}

export interface JobMatch {
  title: string;
  company: string;
  applyUrl: string;
  description?: string;
  location?: string;
  salary?: string;
}

export interface PerplexityResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  citations?: any[];
}

export interface JobSearchResultsProps {
  isSearching: boolean;
  results: JobMatch[];
  error?: string;
}

export interface PerplexityApiStatus {
  isOperational: boolean;
  lastChecked: Date | null;
  config: {
    model: string;
    temperature: number;
    maxTokens: number;
  };
}

export interface PerplexityTestResult {
  isOperational: boolean;
  message: string;
  timestamp: Date;
  details?: any;
}