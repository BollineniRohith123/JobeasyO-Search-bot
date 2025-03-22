import { PerplexityConfig, PerplexityResponse, JobMatch } from '../types/perplexity';
import { JobProfileItem } from '@/lib/types';

export class PerplexityService {
  private config: PerplexityConfig;
  private apiStatus: { isOperational: boolean; lastChecked: Date | null } = {
    isOperational: false,
    lastChecked: null
  };

  constructor(config: PerplexityConfig) {
    this.config = config;
  }

  private formatSearchQuery(profile: JobProfileItem): string {
    const parts = [];

    if (profile.targetRoles?.length) {
      parts.push(`Looking for roles as: ${profile.targetRoles.join(', ')}`);
    }
    if (profile.techStack?.length) {
      parts.push(`Skills: ${profile.techStack.join(', ')}`);
    }
    if (profile.yearsOfExperience) {
      parts.push(`Experience: ${profile.yearsOfExperience} years`);
    }
    if (profile.locationPreference) {
      const location = profile.remotePreference 
        ? `${profile.locationPreference} (${profile.remotePreference})`
        : profile.locationPreference;
      parts.push(`Location: ${location}`);
    }
    if (profile.preferredIndustries?.length) {
      parts.push(`Industries: ${profile.preferredIndustries.join(', ')}`);
    }
    if (profile.salaryRange?.min || profile.salaryRange?.max) {
      const salary = [];
      if (profile.salaryRange.min) salary.push(`min ${profile.salaryRange.currency}${profile.salaryRange.min}`);
      if (profile.salaryRange.max) salary.push(`max ${profile.salaryRange.currency}${profile.salaryRange.max}`);
      parts.push(`Salary: ${salary.join(' - ')}`);
    }

    return `
      Find current job openings for a candidate with:
      ${parts.join('\n')}
      
      Return ONLY job postings with direct application links.
      Format results as a JSON array of objects with EXACTLY these fields:
      {
        "title": "Job Title",
        "company": "Company Name",
        "applyUrl": "Direct application URL"
      }
      
      Return at most 10 most relevant jobs, focusing on active listings.
    `;
  }

  private async parseResponse(response: PerplexityResponse): Promise<JobMatch[]> {
    try {
      const content = response.choices[0].message.content;
      let jobs: any[] = [];

      try {
        jobs = JSON.parse(content);
      } catch {
        const match = content.match(/\[[\s\S]*\]/);
        if (match) {
          jobs = JSON.parse(match[0]);
        }
      }

      if (!Array.isArray(jobs)) {
        throw new Error('Invalid response format');
      }

      return jobs.map(job => ({
        title: job.title || 'Unknown Position',
        company: job.company || 'Unknown Company',
        applyUrl: job.applyUrl || '#'
      }));
    } catch (error) {
      console.error('Error parsing Perplexity response:', error);
      throw new Error('Failed to parse job search results');
    }
  }

  public async searchJobs(profile: JobProfileItem): Promise<JobMatch[]> {
    try {
      const query = this.formatSearchQuery(profile);
      
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
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
              content: 'You are a job search assistant that returns results in JSON format with direct application links.'
            },
            {
              role: 'user',
              content: query
            }
          ],
          max_tokens: this.config.maxTokens || 3000,
          temperature: this.config.temperature || 0.3,
          top_p: 0.95,
          search_domain_filter: null,
          return_related_questions: false,
          search_recency_filter: 'recent'
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data: PerplexityResponse = await response.json();
      return await this.parseResponse(data);

    } catch (error) {
      console.error('Error searching jobs:', error);
      
      // Update API status on error
      this.apiStatus.isOperational = false;
      this.apiStatus.lastChecked = new Date();
      
      throw error;
    }
  }

  /**
   * Test the Perplexity API connection
   * @returns Object with test results
   */
  public async testConnection(): Promise<{
    isOperational: boolean;
    message: string;
    timestamp: Date;
    details?: any;
  }> {
    try {
      // Simple test query
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
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
        throw new Error(`API request failed: ${response.statusText} (${response.status})`);
      }

      const data = await response.json();
      
      // Update API status
      this.apiStatus.isOperational = true;
      this.apiStatus.lastChecked = new Date();
      
      return {
        isOperational: true,
        message: 'Perplexity API connection successful',
        timestamp: new Date(),
        details: data
      };
    } catch (error) {
      console.error('Perplexity API test failed:', error);
      
      // Update API status on error
      this.apiStatus.isOperational = false;
      this.apiStatus.lastChecked = new Date();
      
      return {
        isOperational: false,
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date()
      };
    }
  }

  /**
   * Get the current API status
   */
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