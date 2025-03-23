import React from 'react';
import { JobMatch, JobSearchResultsProps } from '../types/perplexity';
import { ExternalLink, Info, MapPin, DollarSign, Building, Calendar, Briefcase } from 'lucide-react';
import SearchLoadingAnimation from './SearchLoadingAnimation';

export default function JobSearchResults({ isSearching, results, error }: JobSearchResultsProps) {
  return (
    <div className="mt-8">
      <div className="rounded-lg bg-gray-900/50 border border-gray-800 overflow-hidden transition-all duration-300 hover:border-blue-800/30">
        <div className="p-4">
          {error ? (
            <div className="text-red-400 text-center py-4">
              <p>Unable to find matching jobs at the moment. Please try again later.</p>
            </div>
          ) : isSearching ? (
            <div className="flex justify-center items-center py-8">
              <SearchLoadingAnimation />
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-4">
              {results.map((job, index) => (
                <a
                  key={index}
                  href={job.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors duration-300 group"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-grow">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-blue-300 font-medium text-lg group-hover:text-blue-200 transition-colors">
                          {job.title}
                        </h4>
                        <ExternalLink className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <Building className="w-4 h-4 text-gray-400" />
                        <p className="text-gray-300">{job.company}</p>
                      </div>
                      
                      {/* Job Details Grid */}
                      <div className="grid grid-cols-2 gap-3 mt-3">
                        {job.location && (
                          <div className="flex items-center space-x-2 text-gray-300">
                            <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="text-sm truncate">{job.location}</span>
                          </div>
                        )}
                        
                        {job.employmentType && (
                          <div className="flex items-center space-x-2 text-gray-300">
                            <Briefcase className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="text-sm truncate">{job.employmentType}</span>
                          </div>
                        )}
                        
                        {job.salary && (
                          <div className="flex items-center space-x-2 text-gray-300">
                            <DollarSign className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="text-sm truncate">{job.salary}</span>
                          </div>
                        )}
                        
                        {job.postedDate && (
                          <div className="flex items-center space-x-2 text-gray-300">
                            <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="text-sm truncate">{job.postedDate}</span>
                          </div>
                        )}
                      </div>

                      {/* Description */}
                      {job.description && (
                        <div className="mt-3 text-gray-300 text-sm flex items-start">
                          <Info className="w-4 h-4 text-gray-400 mr-2 mt-1 flex-shrink-0" />
                          <p className="line-clamp-2">{job.description}</p>
                        </div>
                      )}

                      {/* Requirements */}
                      {job.requirements && job.requirements.length > 0 && (
                        <div className="mt-3">
                          <div className="flex flex-wrap gap-2">
                            {job.requirements.slice(0, 5).map((req, idx) => (
                              <span 
                                key={idx}
                                className="px-2 py-1 text-xs rounded-full bg-blue-900/30 text-blue-200 border border-blue-800/30"
                              >
                                {req}
                              </span>
                            ))}
                            {job.requirements.length > 5 && (
                              <span className="px-2 py-1 text-xs rounded-full bg-gray-800 text-gray-400">
                                +{job.requirements.length - 5} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-400">
              No matching jobs found. Try adjusting your preferences.
            </div>
          )}
        </div>

        {/* Status Footer */}
        <div className="bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-blue-900/20 p-3 text-center">
          {isSearching ? (
            <p className="text-xs text-gray-400">
              Finding the best job matches for your profile...
            </p>
          ) : results.length > 0 ? (
            <p className="text-xs text-gray-400">
              Found {results.length} matching opportunities - Click any job to apply
            </p>
          ) : (
            <p className="text-xs text-gray-400">
              Try updating your profile with different skills or preferences
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
