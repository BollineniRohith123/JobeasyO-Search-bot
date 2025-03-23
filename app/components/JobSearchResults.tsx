import React from 'react';
import { JobMatch, JobSearchResultsProps } from '../types/perplexity';
import { ExternalLink, Info, MapPin, DollarSign, Building, Calendar, Briefcase, AlertCircle, Search } from 'lucide-react';
import SearchLoadingAnimation from './SearchLoadingAnimation';
import GradientText from './GradientText';

export default function JobSearchResults({ isSearching, results, error }: JobSearchResultsProps) {
  return (
    <div className="mt-8">
      <div className="rounded-xl bg-gray-900/80 backdrop-blur-md border border-gray-800/50 overflow-hidden transition-all duration-300 hover:border-blue-800/30 shadow-lg">
        <div className="p-5">
          <div className="flex items-center mb-4">
            <Search className="w-5 h-5 text-blue-400 mr-2" />
            <h3 className="text-lg font-semibold">
              <GradientText>Job Opportunities</GradientText>
            </h3>
          </div>
          
          {error ? (
            <div className="bg-red-900/20 border border-red-800/30 rounded-xl p-6 text-center">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
              <p className="text-red-300 font-medium mb-2">Unable to find matching jobs</p>
              <p className="text-gray-400 text-sm">
                Please try again later or adjust your profile information.
              </p>
            </div>
          ) : isSearching ? (
            <div className="flex flex-col justify-center items-center py-12">
              <SearchLoadingAnimation />
              <p className="text-blue-300 mt-4 font-medium">Finding your perfect match...</p>
              <p className="text-gray-400 text-sm mt-2">Searching across thousands of opportunities</p>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-5">
              {results.map((job, index) => (
                <a
                  key={index}
                  href={job.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-5 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 transition-all duration-300 group border border-gray-700/30 hover:border-blue-700/30 hover:shadow-md"
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
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                        {job.location && (
                          <div className="flex items-center space-x-2 text-gray-300 bg-gray-800/70 px-3 py-2 rounded-lg">
                            <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0" />
                            <span className="text-sm truncate">{job.location}</span>
                          </div>
                        )}
                        
                        {job.employmentType && (
                          <div className="flex items-center space-x-2 text-gray-300 bg-gray-800/70 px-3 py-2 rounded-lg">
                            <Briefcase className="w-4 h-4 text-blue-400 flex-shrink-0" />
                            <span className="text-sm truncate">{job.employmentType}</span>
                          </div>
                        )}
                        
                        {job.salary && (
                          <div className="flex items-center space-x-2 text-gray-300 bg-gray-800/70 px-3 py-2 rounded-lg">
                            <DollarSign className="w-4 h-4 text-blue-400 flex-shrink-0" />
                            <span className="text-sm truncate">{job.salary}</span>
                          </div>
                        )}
                        
                        {job.postedDate && (
                          <div className="flex items-center space-x-2 text-gray-300 bg-gray-800/70 px-3 py-2 rounded-lg">
                            <Calendar className="w-4 h-4 text-blue-400 flex-shrink-0" />
                            <span className="text-sm truncate">{job.postedDate}</span>
                          </div>
                        )}
                      </div>

                      {/* Description */}
                      {job.description && (
                        <div className="mt-4 text-gray-300 text-sm flex items-start p-3 bg-gray-800/30 rounded-lg border border-gray-700/20">
                          <Info className="w-4 h-4 text-blue-400 mr-2 mt-1 flex-shrink-0" />
                          <p className="line-clamp-2">{job.description}</p>
                        </div>
                      )}

                      {/* Requirements */}
                      {job.requirements && job.requirements.length > 0 && (
                        <div className="mt-4">
                          <div className="flex flex-wrap gap-2">
                            {job.requirements.slice(0, 5).map((req, idx) => (
                              <span 
                                key={idx}
                                className="px-3 py-1 text-xs rounded-full bg-blue-900/30 text-blue-200 border border-blue-800/30 hover:bg-blue-800/40 transition-colors duration-300"
                              >
                                {req}
                              </span>
                            ))}
                            {job.requirements.length > 5 && (
                              <span className="px-3 py-1 text-xs rounded-full bg-gray-800 text-gray-400 border border-gray-700/30">
                                +{job.requirements.length - 5} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Apply Button */}
                      <div className="mt-4 text-right">
                        <span className="inline-flex items-center px-4 py-2 bg-blue-600/80 hover:bg-blue-500/80 rounded-lg text-sm font-medium transition-colors duration-300 border border-blue-500/30">
                          Apply Now
                          <ExternalLink className="w-3 h-3 ml-2" />
                        </span>
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="bg-gray-900/50 border border-gray-800/30 rounded-xl p-8 text-center">
              <Search className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-300 font-medium mb-2">No matching jobs found</p>
              <p className="text-gray-400 text-sm">
                Try adjusting your preferences or adding more skills to your profile.
              </p>
            </div>
          )}
        </div>

        {/* Status Footer */}
        <div className="bg-gradient-to-r from-blue-900/30 via-purple-900/30 to-blue-900/30 p-4 text-center border-t border-blue-900/20">
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