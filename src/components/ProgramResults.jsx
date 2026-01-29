import React, { useState } from 'react';
import { calculateFPLPercentage } from '../utils/eligibility.js';

const ProgramResults = ({ userProfile, programs, onProgramSelect, onBack }) => {
  const [filterType, setFilterType] = useState('all'); // 'all', 'manufacturer', 'nonprofit'
  const [sortBy, setSortBy] = useState('score'); // 'score', 'name', 'processingTime'

  const filteredPrograms = programs.filter(program => {
    if (filterType === 'all') return true;
    return program.type === filterType;
  });

  const sortedPrograms = [...filteredPrograms].sort((a, b) => {
    switch (sortBy) {
      case 'score':
        return b.eligibilityScore - a.eligibilityScore;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'processingTime':
        // Sort by processing time (faster first)
        const getProcessingDays = (time) => {
          if (!time) return 999;
          const match = time.match(/(\d+)-?(\d+)?/);
          return match ? parseInt(match[1]) : 999;
        };
        return getProcessingDays(a.processingTime) - getProcessingDays(b.processingTime);
      default:
        return 0;
    }
  });

  const userFPLPercentage = calculateFPLPercentage(
    userProfile.income, 
    parseInt(userProfile.householdSize)
  );

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-accent-green';
    if (score >= 6) return 'text-accent-yellow';
    if (score >= 4) return 'text-accent-red';
    return 'text-text-secondary';
  };

  const getScoreBg = (score) => {
    if (score >= 8) return 'bg-accent-green/10 border-accent-green/20';
    if (score >= 6) return 'bg-accent-yellow/10 border-accent-yellow/20';
    if (score >= 4) return 'bg-accent-red/10 border-accent-red/20';
    return 'bg-bg-tertiary/10 border-bg-tertiary/20';
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header with user summary */}
      <div className="mb-8 p-6 bg-bg-secondary rounded-lg border border-bg-tertiary">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-text-primary">
            Patient Assistance Programs for {userProfile.name}
          </h1>
          <button
            onClick={onBack}
            className="px-4 py-2 text-sm text-text-secondary hover:text-text-primary border border-bg-tertiary rounded-lg hover:border-accent-blue transition-colors"
          >
            ← Edit Information
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-text-secondary">Household Income:</span>
            <div className="font-semibold text-text-primary">
              ${userProfile.income?.toLocaleString()}
            </div>
            <div className="text-xs text-text-secondary">
              {userFPLPercentage}% of Federal Poverty Level
            </div>
          </div>
          <div>
            <span className="text-text-secondary">Household Size:</span>
            <div className="font-semibold text-text-primary">
              {userProfile.householdSize} {parseInt(userProfile.householdSize) === 1 ? 'person' : 'people'}
            </div>
          </div>
          <div>
            <span className="text-text-secondary">Insurance:</span>
            <div className="font-semibold text-text-primary">
              {userProfile.insurance.hasInsurance ? 'Insured' : 'Uninsured'}
            </div>
            {userProfile.insurance.hasInsurance && (
              <div className="text-xs text-text-secondary">
                {userProfile.insurance.provider || 'Provider not specified'}
              </div>
            )}
          </div>
          <div>
            <span className="text-text-secondary">Supplies Needed:</span>
            <div className="font-semibold text-text-primary">
              {userProfile.selectedSupplies?.length || 0} selected
            </div>
            {userProfile.urgentNeed && (
              <div className="text-xs text-accent-red font-medium">
                Urgent need
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-text-primary">
            Found {sortedPrograms.length} matching programs
          </h2>
          
          {/* Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 bg-bg-primary border border-bg-tertiary rounded-lg text-text-primary text-sm focus:outline-none focus:border-accent-blue"
          >
            <option value="all">All Programs</option>
            <option value="manufacturer">Manufacturer Programs</option>
            <option value="nonprofit">Nonprofit Programs</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 bg-bg-primary border border-bg-tertiary rounded-lg text-text-primary text-sm focus:outline-none focus:border-accent-blue"
          >
            <option value="score">Best Match</option>
            <option value="name">Program Name</option>
            <option value="processingTime">Fastest Processing</option>
          </select>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-4 text-xs text-text-secondary">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-accent-green rounded"></div>
            <span>High Match (8-10)</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-accent-yellow rounded"></div>
            <span>Medium (6-7)</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-accent-red rounded"></div>
            <span>Low (4-5)</span>
          </div>
        </div>
      </div>

      {/* Program List */}
      <div className="space-y-4">
        {sortedPrograms.map((program) => (
          <div
            key={program.id}
            className={`p-6 rounded-lg border cursor-pointer transition-all hover:border-accent-blue ${getScoreBg(program.eligibilityScore)}`}
            onClick={() => onProgramSelect(program)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-text-primary">
                    {program.name}
                  </h3>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    program.type === 'manufacturer' 
                      ? 'bg-accent-blue/20 text-accent-blue' 
                      : 'bg-accent-green/20 text-accent-green'
                  }`}>
                    {program.type === 'manufacturer' ? 'Manufacturer' : 'Nonprofit'}
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-medium bg-bg-primary border ${
                    program.category === 'insulin' ? 'border-purple-500/30 text-purple-400' :
                    program.category === 'cgm' ? 'border-blue-500/30 text-blue-400' :
                    program.category === 'pump' ? 'border-green-500/30 text-green-400' :
                    'border-gray-500/30 text-gray-400'
                  }`}>
                    {program.category.toUpperCase()}
                  </div>
                </div>
                
                <div className="text-sm text-text-secondary mb-3">
                  {program.manufacturer} • {program.benefits}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-text-secondary">Products:</span>
                    <div className="text-text-primary">
                      {program.products?.slice(0, 3).join(', ')}
                      {program.products?.length > 3 && ` +${program.products.length - 3} more`}
                    </div>
                  </div>
                  <div>
                    <span className="text-text-secondary">Income Limit:</span>
                    <div className="text-text-primary">
                      {program.eligibilityIncome || 'Varies'}
                    </div>
                  </div>
                  <div>
                    <span className="text-text-secondary">Processing:</span>
                    <div className="text-text-primary">
                      {program.processingTime || 'Not specified'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Eligibility Score */}
              <div className="flex flex-col items-end space-y-2 ml-6">
                <div className={`text-3xl font-bold ${getScoreColor(program.eligibilityScore)}`}>
                  {program.eligibilityScore}
                </div>
                <div className="text-xs text-center">
                  <div className={`font-medium ${getScoreColor(program.eligibilityScore)}`}>
                    {program.eligibilityLevel.level}
                  </div>
                  <div className="text-text-secondary">MATCH</div>
                </div>
              </div>
            </div>

            {/* Quick eligibility indicators */}
            <div className="flex flex-wrap gap-2 mt-4">
              {userFPLPercentage <= (program.incomeThresholdPercent || 999) && (
                <span className="px-2 py-1 bg-accent-green/20 text-accent-green text-xs rounded-full">
                  ✓ Income Qualified
                </span>
              )}
              {program.products?.some(product => 
                userProfile.selectedSupplies?.some(userSupply => 
                  product.toLowerCase().includes(userSupply.toLowerCase()) ||
                  userSupply.toLowerCase().includes(product.toLowerCase())
                )
              ) && (
                <span className="px-2 py-1 bg-accent-blue/20 text-accent-blue text-xs rounded-full">
                  ✓ Product Match
                </span>
              )}
              {!userProfile.insurance.hasInsurance && (
                <span className="px-2 py-1 bg-accent-yellow/20 text-accent-yellow text-xs rounded-full">
                  ✓ Uninsured Priority
                </span>
              )}
              {program.processingTime?.includes('1-2 weeks') && userProfile.urgentNeed && (
                <span className="px-2 py-1 bg-accent-red/20 text-accent-red text-xs rounded-full">
                  ⚡ Fast Processing
                </span>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-bg-tertiary text-right">
              <span className="text-accent-blue text-sm font-medium hover:underline">
                View Details & Application →
              </span>
            </div>
          </div>
        ))}
      </div>

      {sortedPrograms.length === 0 && (
        <div className="text-center py-12">
          <div className="text-text-secondary mb-4">
            No programs match your current filters.
          </div>
          <button
            onClick={() => setFilterType('all')}
            className="px-4 py-2 bg-accent-blue text-white rounded-lg hover:bg-blue-600"
          >
            Show All Programs
          </button>
        </div>
      )}

      {/* Call to Action */}
      <div className="mt-12 p-6 bg-accent-blue/10 border border-accent-blue/20 rounded-lg">
        <h3 className="text-lg font-semibold text-text-primary mb-2">
          Need Help Applying?
        </h3>
        <p className="text-text-secondary mb-4">
          Patient assistance programs can be complex. Click on any program above to get step-by-step application guidance,
          required documents checklist, and tips for increasing your approval chances.
        </p>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center space-x-2 text-accent-blue">
            <span>📋</span>
            <span>Application checklists</span>
          </div>
          <div className="flex items-center space-x-2 text-accent-blue">
            <span>📄</span>
            <span>Required documents</span>
          </div>
          <div className="flex items-center space-x-2 text-accent-blue">
            <span>💡</span>
            <span>Approval tips</span>
          </div>
          <div className="flex items-center space-x-2 text-accent-blue">
            <span>🔗</span>
            <span>Direct application links</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramResults;