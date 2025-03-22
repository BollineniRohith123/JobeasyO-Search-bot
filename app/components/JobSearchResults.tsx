import React from 'react';
import { JobMatch, JobSearchResultsProps } from '../types/perplexity';
import { ExternalLink } from 'lucide-react';
import SearchLoadingAnimation from './SearchLoadingAnimation';

export default function JobSearchResults({ isSearching, results, error }: JobSearchResultsProps) {
  return (
    <div className="mt-8">
      <div className="rounded-lg bg-gray-900/50 border border-gray-800 overflow-hidden transition-all duration-300 hover:border-blue-800/30">
        <div className="p-4">
          {error ? (
            <div className="text-red-400 text-center py-4">
              <p>Error finding job matches: {error}</p>
            </div>
          ) : isSearching ? (
            <SearchLoadingAnimation />
          ) : results.length > 0 ? (
            <div className="space-y-3">
              {results.map((job, index) => (
                <a
                  key={index}
                  href={job.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors duration-300"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-grow">
                      <h4 className="text-blue-300 font-medium">{job.title}</h4>
                      <p className="text-gray-400 text-sm">{job.company}</p>
                      
                      {/* Additional information */}
                      <div className="mt-2 space-y-1">
                        {job.description && (
                          <p className="text-gray-300 text-sm flex items-start">
                            <Info className="w-3 h-3 text-gray-400 mr-1 mt-1" />
                            <span>{job.description}</span>
                          </p>
                        )}
                        
                        {job.location && (
                          <p className="text-gray-300 text-sm flex items-center">
                            <MapPin className="w-3 h-3 text-gray-400 mr-1" />
                            <span>{job.location}</span>
                          </p>
                        )}
                        
                        {job.salary && (
                          <p className="text-gray-300 text-sm flex items-center">
                            <DollarSign className="w-3 h-3 text-gray-400 mr-1" />
                            <span>{job.salary}</span>
                          </p>
                        )}
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 mt-1 ml-2 flex-shrink-0" />
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-400">
              No matching jobs found
            </div>
          )}
        </div>

        {/* Status Footer */}
        <div className="bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-blue-900/20 p-3 text-center">
          {isSearching ? (
            <p className="text-xs text-gray-400">
              Using AI to find your perfect job match...
            </p>
          ) : results.length > 0 ? (
            <p className="text-xs text-gray-400">
              Found {results.length} potential matches - Click any job to learn more
            </p>
          ) : (
            <p className="text-xs text-gray-400">
              No matching jobs found. Try updating your profile with more details.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}