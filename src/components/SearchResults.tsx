import React, { useState } from 'react';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  PhoneIcon, 
  LinkIcon, 
  DocumentTextIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ArrowLeftIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { PAPProgram, calculateEligibilityScore, getFPLThreshold } from '../data/papDatabase';
import { UserData } from './UserForm';

interface SearchResultsProps {
  programs: PAPProgram[];
  userData: UserData;
  onBack: () => void;
}

interface ProgramWithScore extends PAPProgram {
  eligibilityScore: ReturnType<typeof calculateEligibilityScore>;
}

export default function SearchResults({ programs, userData, onBack }: SearchResultsProps) {
  const [expandedPrograms, setExpandedPrograms] = useState<Set<string>>(new Set());

  // Calculate eligibility scores for all programs
  const programsWithScores: ProgramWithScore[] = programs.map(program => ({
    ...program,
    eligibilityScore: calculateEligibilityScore(
      program,
      userData.annualIncome,
      userData.householdSize,
      userData.hasInsurance,
      userData.insuranceType,
      userData.state
    )
  }));

  // Sort by eligibility score (highest first)
  const sortedPrograms = programsWithScores.sort((a, b) => b.eligibilityScore.score - a.eligibilityScore.score);

  const toggleExpanded = (programId: string) => {
    setExpandedPrograms(prev => {
      const newSet = new Set(prev);
      if (newSet.has(programId)) {
        newSet.delete(programId);
      } else {
        newSet.add(programId);
      }
      return newSet;
    });
  };

  const getScoreColor = (score: number, eligible: boolean) => {
    if (!eligible) return 'text-red-400';
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const getScoreLabel = (score: number, eligible: boolean) => {
    if (!eligible) return 'Not Eligible';
    if (score >= 80) return 'High Match';
    if (score >= 60) return 'Good Match';
    return 'Fair Match';
  };

  const fplThreshold = getFPLThreshold(userData.householdSize, userData.state);
  const userFPLPercentage = (userData.annualIncome / fplThreshold) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center text-blue-400 hover:text-blue-300 mb-4 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Form
          </button>
          
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Your Benefits Search Results
            </h1>
            <p className="text-gray-300 text-lg max-w-3xl mx-auto mb-6">
              Based on your information, here are the Patient Assistance Programs you may qualify for.
            </p>
          </div>

          {/* User Summary */}
          <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6 max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold text-white mb-4">Your Information Summary</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Income:</span>
                <p className="text-white font-medium">${userData.annualIncome.toLocaleString()}/year</p>
                <p className="text-blue-300">{userFPLPercentage.toFixed(0)}% of FPL</p>
              </div>
              <div>
                <span className="text-gray-400">Household:</span>
                <p className="text-white font-medium">{userData.householdSize} people</p>
              </div>
              <div>
                <span className="text-gray-400">Insurance:</span>
                <p className="text-white font-medium">
                  {userData.hasInsurance ? userData.insuranceType : 'Uninsured'}
                </p>
              </div>
              <div>
                <span className="text-gray-400">State:</span>
                <p className="text-white font-medium">{userData.state}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="max-w-6xl mx-auto">
          {sortedPrograms.length === 0 ? (
            <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-8 text-center">
              <ExclamationTriangleIcon className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Programs Found</h3>
              <p className="text-gray-300">
                We couldn't find any matching assistance programs for your selected supplies. 
                Try adjusting your selections or contact the manufacturers directly.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <p className="text-gray-300">
                  Found <span className="font-bold text-white">{sortedPrograms.length}</span> potential programs
                </p>
              </div>

              {sortedPrograms.map(program => {
                const isExpanded = expandedPrograms.has(program.id);
                const { score, eligible, reasons } = program.eligibilityScore;

                return (
                  <div key={program.id} className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl overflow-hidden">
                    {/* Program Header */}
                    <div 
                      className="p-6 cursor-pointer hover:bg-gray-700/30 transition-colors"
                      onClick={() => toggleExpanded(program.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-xl font-semibold text-white">{program.name}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              eligible ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                            }`}>
                              {eligible ? <CheckCircleIcon className="h-4 w-4 inline mr-1" /> : <XCircleIcon className="h-4 w-4 inline mr-1" />}
                              {getScoreLabel(score, eligible)}
                            </span>
                          </div>
                          
                          <p className="text-gray-400 mb-2">{program.organization}</p>
                          
                          <div className="flex flex-wrap gap-2 mb-3">
                            {program.products.slice(0, 3).map(product => (
                              <span key={product} className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-md text-xs">
                                {product}
                              </span>
                            ))}
                            {program.products.length > 3 && (
                              <span className="px-2 py-1 bg-gray-600 text-gray-300 rounded-md text-xs">
                                +{program.products.length - 3} more
                              </span>
                            )}
                          </div>

                          <div className="flex items-center space-x-4 text-sm">
                            <div className="flex items-center">
                              <span className="text-gray-400">Match Score:</span>
                              <span className={`ml-1 font-medium ${getScoreColor(score, eligible)}`}>
                                {score}/100
                              </span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-gray-400">Coverage:</span>
                              <span className="ml-1 text-white font-medium capitalize">
                                {program.benefits.coverageType.replace('_', ' ')}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="ml-4">
                          {isExpanded ? (
                            <ChevronUpIcon className="h-5 w-5 text-gray-400" />
                          ) : (
                            <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="border-t border-gray-700">
                        <div className="p-6 space-y-6">
                          {/* Eligibility Details */}
                          <div>
                            <h4 className="text-lg font-medium text-white mb-3 flex items-center">
                              <CheckCircleIcon className="h-5 w-5 mr-2 text-blue-400" />
                              Eligibility Assessment
                            </h4>
                            <div className="space-y-2">
                              {reasons.map((reason, index) => (
                                <p key={index} className="text-sm text-gray-300 flex items-start">
                                  <span className="mr-2">{reason.startsWith('✅') ? '✅' : '❌'}</span>
                                  <span>{reason.substring(2)}</span>
                                </p>
                              ))}
                            </div>
                          </div>

                          {/* Program Details */}
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="text-lg font-medium text-white mb-3 flex items-center">
                                <CurrencyDollarIcon className="h-5 w-5 mr-2 text-green-400" />
                                Benefits
                              </h4>
                              <div className="space-y-2 text-sm">
                                <p><span className="text-gray-400">Coverage:</span> <span className="text-white">{program.benefits.amount}</span></p>
                                <p><span className="text-gray-400">Duration:</span> <span className="text-white">{program.benefits.duration}</span></p>
                                {program.benefits.limitations.map((limitation, index) => (
                                  <p key={index} className="text-gray-300">• {limitation}</p>
                                ))}
                              </div>
                            </div>

                            <div>
                              <h4 className="text-lg font-medium text-white mb-3 flex items-center">
                                <DocumentTextIcon className="h-5 w-5 mr-2 text-purple-400" />
                                Requirements
                              </h4>
                              <div className="space-y-2 text-sm text-gray-300">
                                <p><strong>Income Limit:</strong> {program.eligibilityRequirements.incomeThreshold.description}</p>
                                <p><strong>Citizenship:</strong> {program.eligibilityRequirements.citizenship}</p>
                                {program.eligibilityRequirements.additionalRequirements.map((req, index) => (
                                  <p key={index}>• {req}</p>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Application Process */}
                          <div>
                            <h4 className="text-lg font-medium text-white mb-3 flex items-center">
                              <ClockIcon className="h-5 w-5 mr-2 text-yellow-400" />
                              How to Apply
                            </h4>
                            
                            <div className="grid md:grid-cols-2 gap-6">
                              <div>
                                <h5 className="font-medium text-white mb-2">Contact Information</h5>
                                <div className="space-y-2">
                                  {program.applicationProcess.phoneNumber && (
                                    <a 
                                      href={`tel:${program.applicationProcess.phoneNumber}`}
                                      className="flex items-center text-blue-400 hover:text-blue-300 transition-colors"
                                    >
                                      <PhoneIcon className="h-4 w-4 mr-2" />
                                      {program.applicationProcess.phoneNumber}
                                    </a>
                                  )}
                                  {program.applicationProcess.applicationUrl && (
                                    <a 
                                      href={program.applicationProcess.applicationUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center text-blue-400 hover:text-blue-300 transition-colors"
                                    >
                                      <LinkIcon className="h-4 w-4 mr-2" />
                                      Apply Online
                                    </a>
                                  )}
                                </div>
                              </div>

                              <div>
                                <h5 className="font-medium text-white mb-2">Application Details</h5>
                                <div className="space-y-1 text-sm text-gray-300">
                                  <p><strong>Processing Time:</strong> {program.applicationProcess.processingTime}</p>
                                  <p><strong>Physician Required:</strong> {program.applicationProcess.physicianInvolvement ? 'Yes' : 'No'}</p>
                                  <p><strong>Renewal:</strong> {program.applicationProcess.renewalRequired ? 'Required' : 'Not required'}</p>
                                </div>
                              </div>
                            </div>

                            <div className="mt-4">
                              <h5 className="font-medium text-white mb-2">Required Documents</h5>
                              <div className="grid md:grid-cols-2 gap-2">
                                {program.applicationProcess.requiredDocuments.map((doc, index) => (
                                  <p key={index} className="text-sm text-gray-300">• {doc}</p>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Notes */}
                          {program.notes.length > 0 && (
                            <div>
                              <h4 className="text-lg font-medium text-white mb-3 flex items-center">
                                <ExclamationTriangleIcon className="h-5 w-5 mr-2 text-orange-400" />
                                Important Notes
                              </h4>
                              <div className="space-y-1">
                                {program.notes.map((note, index) => (
                                  <p key={index} className="text-sm text-gray-300">• {note}</p>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Quick Action Buttons */}
                          <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-700">
                            {program.applicationProcess.phoneNumber && (
                              <a 
                                href={`tel:${program.applicationProcess.phoneNumber}`}
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center"
                              >
                                <PhoneIcon className="h-4 w-4 mr-2" />
                                Call Now
                              </a>
                            )}
                            {program.applicationProcess.applicationUrl && (
                              <a 
                                href={program.applicationProcess.applicationUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center"
                              >
                                <LinkIcon className="h-4 w-4 mr-2" />
                                Apply Online
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Additional Resources */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Additional Resources</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-white mb-2">Emergency Insulin Support</h4>
                <p className="text-gray-300 text-sm mb-2">
                  If you need insulin within 7 days, visit GetInsulin.org for emergency resources.
                </p>
                <a 
                  href="https://getinsulin.org/get-urgent-insulin-support/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-colors text-sm"
                >
                  Get Emergency Support →
                </a>
              </div>
              <div>
                <h4 className="font-medium text-white mb-2">State-Specific Programs</h4>
                <p className="text-gray-300 text-sm mb-2">
                  Some states have additional insulin assistance programs beyond manufacturer PAPs.
                </p>
                <a 
                  href="https://www.needymeds.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-colors text-sm"
                >
                  Search State Programs →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}