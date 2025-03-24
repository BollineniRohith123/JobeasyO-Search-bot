# JobeasyO-Search-bot API Documentation

This document provides detailed information about the APIs used in the JobeasyO-Search-bot application.

## Table of Contents

1. [Perplexity API](#perplexity-api)
2. [Ultravox API](#ultravox-api)
3. [Jobs Search API](#jobs-search-api)

---

## Perplexity API

The Perplexity API is used to search for job opportunities based on user profiles and preferences.

### Endpoint

```
POST /api/perplexity
```

### Authentication

Requires a Perplexity API key set in the environment variable `PERPLEXITY_API_KEY`.

### Request Body

```json
{
  "profile": {
    "skills": ["JavaScript", "React", "Node.js"],
    "techStack": ["TypeScript", "Next.js", "Express"],
    "experience": "5 years in web development",
    "yearsOfExperience": "5",
    "preferredIndustries": ["Technology", "Finance"],
    "preferredRoles": ["Frontend Developer", "Full Stack Developer"],
    "employmentTypes": ["Full-time", "Contract"],
    "locationPreference": "New York",
    "remotePreference": "Remote",
    "salaryRange": {
      "min": 80000,
      "max": 120000,
      "currency": "USD"
    },
    "targetRoles": ["Senior Frontend Developer"],
    "suggestedRoles": [],
    "currentStatus": "Actively looking",
    "additionalNotes": "Prefer remote positions"
  }
}
```

### Response

```json
{
  "results": [
    {
      "title": "Senior Frontend Developer",
      "company": "Example Tech Inc.",
      "location": "New York (Remote)",
      "description": "We're looking for a Senior Frontend Developer with React experience...",
      "requirements": ["5+ years of experience", "React", "TypeScript"],
      "employmentType": "Full-time",
      "salary": "$90,000 - $120,000",
      "postedDate": "2023-06-15",
      "applyUrl": "https://example.com/apply"
    }
  ]
}
```

### Error Responses

- **400 Bad Request**: Profile data is missing or invalid
- **500 Internal Server Error**: API key not configured or other server errors

### Status Check

```
GET /api/perplexity
```

Returns the operational status of the Perplexity API and documentation.

### Perplexity Test API

```
GET /api/perplexity/test
```

This endpoint is used to test the Perplexity API functionality. It runs a series of tests to verify that the API is working correctly.

#### Authentication

Requires a Perplexity API key set in the environment variable `PERPLEXITY_API_KEY`.

#### Response

```json
{
  "status": "success",
  "message": "All Perplexity API tests passed successfully",
  "results": {
    "connection": true,
    "jobSearch": true
  },
  "timestamp": "2023-06-15T12:34:56.789Z"
}
```

#### Error Responses

- **500 Internal Server Error**: API key not configured or other server errors

#### Tests Performed

1. **Connection Test**: Verifies that the application can connect to the Perplexity API
2. **Job Search Test**: Tests the job search functionality using a sample profile

---

## Ultravox API

The Ultravox API is used for communication functionality within the application.

### Endpoint

```
POST /api/ultravox
```

### Authentication

Requires an Ultravox API key set in the environment variable `ULTRAVOX_API_KEY`.

### Request Body

```json
{
  "systemPrompt": "You are a helpful assistant for job seekers.",
  "model": "gpt-4",
  "languageHint": "en-US",
  "selectedTools": [],
  "initialMessages": [
    {
      "role": "USER",
      "text": "Hello, I need help with my job search."
    }
  ],
  "voice": "echo",
  "temperature": 0.7,
  "maxDuration": "10m",
  "timeExceededMessage": "The conversation has exceeded the maximum duration.",
  "callKey": "unique-call-identifier"
}
```

### Response

The API returns the response from the Ultravox service, which typically includes call information and status.

### Error Responses

- **500 Internal Server Error**: Error calling Ultravox API or authentication issues

---

## Jobs Search API

An internal API that leverages the Perplexity service to search for job opportunities.

### Endpoint

```
POST /api/jobs/search
```

### Authentication

Requires a Perplexity API key set in the environment variable `PERPLEXITY_API_KEY`.

### Request Body

```json
{
  "skills": ["JavaScript", "React", "Node.js"],
  "techStack": ["TypeScript", "Next.js", "Express"],
  "experience": "5 years in web development",
  "yearsOfExperience": "5",
  "preferredIndustries": ["Technology", "Finance"],
  "preferredRoles": ["Frontend Developer", "Full Stack Developer"],
  "employmentTypes": ["Full-time", "Contract"],
  "locationPreference": "New York",
  "remotePreference": "Remote",
  "salaryRange": {
    "min": 80000,
    "max": 120000,
    "currency": "USD"
  },
  "targetRoles": ["Senior Frontend Developer"],
  "suggestedRoles": [],
  "currentStatus": "Actively looking",
  "additionalNotes": "Prefer remote positions"
}
```

### Response

```json
{
  "success": true,
  "jobs": [
    {
      "title": "Senior Frontend Developer",
      "company": "Example Tech Inc.",
      "location": "New York (Remote)",
      "description": "We're looking for a Senior Frontend Developer with React experience...",
      "requirements": ["5+ years of experience", "React", "TypeScript"],
      "employmentType": "Full-time",
      "salary": "$90,000 - $120,000",
      "postedDate": "2023-06-15",
      "applyUrl": "https://example.com/apply"
    }
  ]
}
```

### Error Responses

- **400 Bad Request**: Missing required fields (target roles)
- **401 Unauthorized**: Authentication failed
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Unexpected errors
- **503 Service Unavailable**: Job search service is temporarily unavailable

---

## Technical Implementation Details

### Perplexity Service

The Perplexity service is implemented with the following features:

1. **Retry Mechanism**: Automatically retries failed requests with exponential backoff
2. **Timeout Handling**: Requests timeout after 30 seconds
3. **Error Handling**: Comprehensive error handling for various API response scenarios
4. **Response Parsing**: Robust parsing of API responses with fallback mechanisms
5. **Connection Testing**: Ability to test API connectivity before making search requests

### Query Formation

The job search query is formed based on the user's profile with emphasis on:

- Target roles and skills
- Experience level
- Location preferences
- Industry preferences
- Salary expectations

### Response Processing

The API responses are processed to:

1. Extract valid job listings
2. Clean and validate job data
3. Format URLs and ensure all required fields are present
4. Filter out invalid or incomplete job listings

### Error Handling

The APIs implement comprehensive error handling for:

- Authentication failures
- Rate limiting
- Timeout issues
- Malformed requests
- Service unavailability

---

## Environment Variables

The following environment variables are required:

- `PERPLEXITY_API_KEY`: API key for the Perplexity service
- `ULTRAVOX_API_KEY`: API key for the Ultravox service

---

## Type Definitions

### JobProfileItem

```typescript
interface JobProfileItem {
  skills: string[];
  experience: string;
  yearsOfExperience: string;
  preferredIndustries: string[];
  preferredRoles: string[];
  locationPreference: string;
  employmentTypes: string[];  // Contract/Full time/Freelance
  remotePreference: string;  // Remote/Hybrid/On-site
  salaryRange: {
    min: number;
    max: number;
    currency: string;
  };
  targetRoles: string[];     // Specific roles planning to apply for
  suggestedRoles: string[];  // AI suggested roles based on experience
  currentStatus: string;     // Actively looking, Open to opportunities, etc.
  additionalNotes: string;
  techStack: string[];       // Specific technologies/frameworks
}
```

### JobMatch

```typescript
interface JobMatch {
  title: string;
  company: string;
  applyUrl: string;
  description?: string;
  location?: string;
  salary?: string;
  requirements?: string[];
  employmentType?: string;
  postedDate?: string;
}
```

### CallConfig

```typescript
interface CallConfig {
  systemPrompt: string;
  model?: string;
  languageHint?: string;
  selectedTools?: SelectedTool[];
  initialMessages?: Message[];
  voice?: string;
  temperature?: number;
  maxDuration?: string;
  timeExceededMessage?: string;
  callKey?: string;
}
```

---

## Best Practices

1. **Error Handling**: Always handle API errors gracefully and provide meaningful error messages to users.
2. **Rate Limiting**: Implement rate limiting to avoid exceeding API quotas.
3. **Validation**: Validate user input before making API requests.
4. **Caching**: Consider caching API responses to improve performance and reduce API calls.
5. **Logging**: Log API requests and responses for debugging purposes.
6. **Security**: Never expose API keys in client-side code.
7. **Fallbacks**: Implement fallback mechanisms for when APIs are unavailable.

---

## Troubleshooting

### Common Issues

1. **API Key Issues**: Ensure that the API keys are correctly set in the environment variables.
2. **Rate Limiting**: If you encounter rate limiting errors, implement exponential backoff or reduce the frequency of API calls.
3. **Timeout Errors**: For long-running requests, consider increasing the timeout value.
4. **Parsing Errors**: If you encounter parsing errors, check the API response format and ensure that your parsing logic can handle variations.

### Debugging Tips

1. Check the API response status code and body for error messages.
2. Verify that the request payload matches the expected format.
3. Test API connectivity using the test endpoints before making actual requests.
4. Monitor API usage to avoid exceeding quotas.

---

## Support

For issues with the APIs, please contact the respective API providers:

- Perplexity API: [Perplexity Support](https://www.perplexity.ai/support)
- Ultravox API: [Ultravox Support](https://www.ultravox.ai/support)

For issues with the JobeasyO-Search-bot application, please open an issue on the GitHub repository.