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
