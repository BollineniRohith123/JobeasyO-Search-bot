import { PerplexityConfig, PerplexityResponse, JobMatch, PerplexityTestResult } from '../types/perplexity';
import { JobProfileItem } from '@/lib/types';

export class PerplexityService {
  private config: PerplexityConfig;
  private apiStatus: { isOperational: boolean; lastChecked: Date | null } = {
    isOperational: false,
    lastChecked: null
  };
  private maxRetries = 2;
  private timeout = 30000; // 30 seconds

  constructor(config: PerplexityConfig) {
    this.config = config;
  }

  private async fetchWithTimeout(url: string, options: RequestInit, timeout: number): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      return response;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private async retryFetch(url: string, options: RequestInit): Promise<Response> {
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        const response = await this.fetchWithTimeout(url, options, this.timeout);
        if (response.ok || response.status === 401) { // Don't retry auth errors
          return response;
        }
        lastError = new Error(`HTTP error! status: ${response.status}`);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Network request failed');
        if (error instanceof Error && error.name === 'AbortError') {
          throw new Error('Request timed out. Please try again.');
        }
        // Only retry on network errors, not timeouts
        if (attempt === this.maxRetries) {
          throw lastError;
        }
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
    throw lastError || new Error('Maximum retries exceeded');
  }

  private formatSearchQuery(profile: JobProfileItem): string {
    const queryParts = [];

    if (profile.targetRoles?.length) {
      queryParts.push(`Role: ${profile.targetRoles.join(' or ')}`);
    } else if (profile.preferredRoles?.length) {
      queryParts.push(`Role: ${profile.preferredRoles.join(' or ')}`);
    }
    
    if (profile.yearsOfExperience) {
      queryParts.push(`Experience: ${profile.yearsOfExperience} years`);
    }

    if (profile.locationPreference) {
      queryParts.push(`Location: ${profile.locationPreference}`);
    }
    if (profile.remotePreference) {
      queryParts.push(`Work Mode: ${profile.remotePreference}`);
    }

    if (profile.techStack?.length) {
      queryParts.push(`Required Skills: ${profile.techStack.join(', ')}`);
    }
    
    if (profile.preferredIndustries?.length) {
      queryParts.push(`Industries: ${profile.preferredIndustries.join(', ')}`);
    }

    if (profile.salaryRange && (profile.salaryRange.min > 0 || profile.salaryRange.max > 0)) {
      queryParts.push(`Salary Range: ${profile.salaryRange.min}-${profile.salaryRange.max} ${profile.salaryRange.currency}`);
    }

    return `
      Find real and current job opportunities matching these requirements:
      ${queryParts.join('\n')}

      Return 5 most relevant matches in JSON format with these fields:
      {
        "title": "Exact Job Title",
        "company": "Company Name",
        "location": "Job Location (City, Remote, etc)",
        "description": "Brief job description",
        "requirements": ["Key requirements/skills"],
        "employmentType": "Full-time/Part-time/Contract",
        "salary": "Salary range if available",
        "postedDate": "Job posting date",
        "applyUrl": "Direct application URL"
      }

      Instructions:
      1. Focus on active job postings from the last 2 weeks
      2. Only include real companies and positions
      3. Prioritize direct application links
      4. Use company career pages when direct links aren't available
      5. Ensure accurate job titles and company names
    `;
  }

  private async parseResponse(response: PerplexityResponse): Promise<JobMatch[]> {
    try {
      if (!response.choices?.[0]?.message?.content) {
        console.warn('Invalid response format:', response);
        return [];
      }

      const content = response.choices[0].message.content;
      let jobs: any[] = [];

      try {
        const match = content.match(/\[[\s\S]*?\]/);
        if (match) {
          jobs = JSON.parse(match[0]);
        } else {
          jobs = JSON.parse(content);
        }
      } catch (error) {
        console.warn('Could not parse JSON from response, using fallback parser');
        return this.fallbackParser(content);
      }

      if (!Array.isArray(jobs)) {
        console.warn('Response is not an array:', jobs);
        return [];
      }

      return jobs
        .filter(job => job && typeof job === 'object')
        .map(job => this.validateAndCleanJobEntry(job))
        .filter(job => job.title !== 'Unknown Position' && job.company !== 'Unknown Company');
    } catch (error) {
      console.error('Error parsing response:', error);
      return [];
    }
  }

  private validateAndCleanJobEntry(job: any): JobMatch {
    const cleanUrl = (url: string, company: string, title: string) => {
      if (typeof url === 'string' && url.startsWith('http')) {
        try {
          new URL(url);
          return url;
        } catch {
          // If URL is invalid, fall through to default
        }
      }
      
      return `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(`${title} ${company}`)}`;
    };

    return {
      title: typeof job.title === 'string' ? job.title : 'Unknown Position',
      company: typeof job.company === 'string' ? job.company : 'Unknown Company',
      location: typeof job.location === 'string' ? job.location : undefined,
      description: typeof job.description === 'string' ? job.description : undefined,
      requirements: Array.isArray(job.requirements) ? job.requirements : undefined,
      employmentType: typeof job.employmentType === 'string' ? job.employmentType : undefined,
      salary: typeof job.salary === 'string' ? job.salary : undefined,
      postedDate: typeof job.postedDate === 'string' ? job.postedDate : undefined,
      applyUrl: cleanUrl(job.applyUrl || '', job.company || '', job.title || '')
    };
  }

  private fallbackParser(content: string): JobMatch[] {
    const jobs: JobMatch[] = [];
    const jobBlocks = content.split(/\d+\.\s+/).filter(block => block.trim());

    for (const block of jobBlocks) {
      try {
        const title = block.match(/Title:\s*([^\n]+)/)?.[1] || 'Unknown Position';
        const company = block.match(/Company:\s*([^\n]+)/)?.[1] || 'Unknown Company';
        const location = block.match(/Location:\s*([^\n]+)/)?.[1];
        const description = block.match(/Description:\s*([^\n]+)/)?.[1];
        const salary = block.match(/Salary:\s*([^\n]+)/)?.[1];
        const employmentType = block.match(/Type:\s*([^\n]+)/)?.[1];
        const applyUrl = block.match(/URL:\s*([^\n]+)/)?.[1];

        if (title !== 'Unknown Position' && company !== 'Unknown Company') {
          jobs.push({
            title,
            company,
            location,
            description,
            salary,
            employmentType,
            applyUrl: applyUrl || `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(`${title} ${company}`)}`
          });
        }
      } catch (error) {
        console.warn('Error parsing job block:', error);
      }
    }

    return jobs;
  }

  public async searchJobs(profile: JobProfileItem): Promise<JobMatch[]> {
    if (!this.config.apiKey) {
      throw new Error('API key is required');
    }

    try {
      const query = this.formatSearchQuery(profile);
      
      const response = await this.retryFetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: this.config.model || 'sonar',
          messages: [
            {
              role: 'system',
              content: 'You are a job search expert. Return detailed job listings in JSON format.'
            },
            {
              role: 'user',
              content: query
            }
          ],
          max_tokens: this.config.maxTokens || 4000,
          temperature: this.config.temperature || 0.3,
          top_p: 0.95,
          search_domain_filter: null,
          return_related_questions: false,
          search_recency_filter: 'week'
        })
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error('API Error:', {
          status: response.status,
          statusText: response.statusText,
          body: errorBody
        });
        
        if (response.status === 401) {
          throw new Error('Invalid API key or authentication failed');
        }
        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please try again later');
        }
        throw new Error('Job search service is temporarily unavailable');
      }

      const data: PerplexityResponse = await response.json();
      const jobs = await this.parseResponse(data);

      if (jobs.length === 0) {
        throw new Error('No matching jobs found. Try adjusting your search criteria.');
      }

      this.apiStatus.isOperational = true;
      this.apiStatus.lastChecked = new Date();
      return jobs;

    } catch (error) {
      console.error('Error searching jobs:', error);
      this.apiStatus.isOperational = false;
      this.apiStatus.lastChecked = new Date();
      
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unable to process job search. Please try again later.');
    }
  }

  public async testConnection(): Promise<PerplexityTestResult> {
    if (!this.config.apiKey) {
      return {
        isOperational: false,
        message: 'API key is required',
        timestamp: new Date()
      };
    }

    try {
      const response = await this.retryFetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: this.config.model || 'sonar',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant.'
            },
            {
              role: 'user',
              content: 'Return a simple JSON response with the key "status" and value "operational"'
            }
          ],
          max_tokens: 100,
          temperature: 0.1
        })
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`API request failed: ${response.statusText} (${response.status})\n${errorBody}`);
      }

      const data = await response.json();
      
      this.apiStatus.isOperational = true;
      this.apiStatus.lastChecked = new Date();
      
      return {
        isOperational: true,
        message: 'Job search service is ready',
        timestamp: new Date(),
        details: data
      };
    } catch (error) {
      console.error('Service test failed:', error);
      
      this.apiStatus.isOperational = false;
      this.apiStatus.lastChecked = new Date();
      
      return {
        isOperational: false,
        message: error instanceof Error ? error.message : 'Service connectivity test failed',
        timestamp: new Date()
      };
    }
  }

  public getApiStatus() {
    return {
      ...this.apiStatus,
      config: {
        model: this.config.model,
        temperature: this.config.temperature,
        maxTokens: this.config.maxTokens
      }
    };
  }
}
