import React, { useState } from 'react';
import { generateApplicationChecklist, calculateFPLPercentage } from '../utils/eligibility.js';

const ProgramDetail = ({ program, userProfile, onBack }) => {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'requirements', 'application', 'documents'
  const [checkedItems, setCheckedItems] = useState([]);

  const checklist = generateApplicationChecklist(program, userProfile);
  const userFPLPercentage = calculateFPLPercentage(userProfile.income, parseInt(userProfile.householdSize));

  const handleChecklistToggle = (index) => {
    setCheckedItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

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

  const isIncomeQualified = !program.incomeThresholdPercent || userFPLPercentage <= program.incomeThresholdPercent;
  const hasProductMatch = program.products?.some(product => 
    userProfile.selectedSupplies?.some(userSupply => 
      product.toLowerCase().includes(userSupply.toLowerCase()) ||
      userSupply.toLowerCase().includes(product.toLowerCase())
    )
  );

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={onBack}
            className="px-4 py-2 text-sm text-text-secondary hover:text-text-primary border border-bg-tertiary rounded-lg hover:border-accent-blue transition-colors"
          >
            ← Back to Results
          </button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-text-primary">{program.name}</h1>
            <p className="text-text-secondary">{program.manufacturer} • {program.benefits}</p>
          </div>
          <div className={`text-right p-4 rounded-lg border ${getScoreBg(program.eligibilityScore)}`}>
            <div className={`text-3xl font-bold ${getScoreColor(program.eligibilityScore)}`}>
              {program.eligibilityScore}
            </div>
            <div className="text-sm">
              <div className={`font-medium ${getScoreColor(program.eligibilityScore)}`}>
                {program.eligibilityLevel.level} MATCH
              </div>
              <div className="text-text-secondary text-xs">
                {program.eligibilityLevel.description}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Status Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className={`p-4 rounded-lg border ${
            isIncomeQualified ? 'border-accent-green/30 bg-accent-green/10' : 'border-accent-red/30 bg-accent-red/10'
          }`}>
            <div className="flex items-center space-x-2 mb-2">
              <span className={isIncomeQualified ? 'text-accent-green' : 'text-accent-red'}>
                {isIncomeQualified ? '✓' : '✗'}
              </span>
              <span className="font-medium text-text-primary">Income Eligibility</span>
            </div>
            <div className="text-sm text-text-secondary">
              You: {userFPLPercentage}% FPL | Limit: {program.eligibilityIncome}
            </div>
          </div>

          <div className={`p-4 rounded-lg border ${
            hasProductMatch ? 'border-accent-green/30 bg-accent-green/10' : 'border-accent-yellow/30 bg-accent-yellow/10'
          }`}>
            <div className="flex items-center space-x-2 mb-2">
              <span className={hasProductMatch ? 'text-accent-green' : 'text-accent-yellow'}>
                {hasProductMatch ? '✓' : '○'}
              </span>
              <span className="font-medium text-text-primary">Product Match</span>
            </div>
            <div className="text-sm text-text-secondary">
              {hasProductMatch ? 'Your supplies are covered' : 'Check product coverage'}
            </div>
          </div>

          <div className={`p-4 rounded-lg border ${
            !userProfile.insurance.hasInsurance ? 'border-accent-green/30 bg-accent-green/10' : 'border-accent-blue/30 bg-accent-blue/10'
          }`}>
            <div className="flex items-center space-x-2 mb-2">
              <span className={!userProfile.insurance.hasInsurance ? 'text-accent-green' : 'text-accent-blue'}>
                {!userProfile.insurance.hasInsurance ? '✓' : 'i'}
              </span>
              <span className="font-medium text-text-primary">Insurance Status</span>
            </div>
            <div className="text-sm text-text-secondary">
              {!userProfile.insurance.hasInsurance ? 'Uninsured - Priority' : 'Insured - May qualify'}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-bg-tertiary">
          <nav className="-mb-px flex space-x-8">
            {[
              { key: 'overview', label: 'Overview' },
              { key: 'requirements', label: 'Requirements' },
              { key: 'application', label: 'Application' },
              { key: 'documents', label: 'Documents' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.key
                    ? 'border-accent-blue text-accent-blue'
                    : 'border-transparent text-text-secondary hover:text-text-primary hover:border-text-secondary'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="space-y-8">
        
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-3">Program Details</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-text-secondary">Type:</span>
                      <span className="ml-2 text-text-primary capitalize">{program.type} Program</span>
                    </div>
                    <div>
                      <span className="text-text-secondary">Category:</span>
                      <span className="ml-2 text-text-primary capitalize">{program.category}</span>
                    </div>
                    <div>
                      <span className="text-text-secondary">Processing Time:</span>
                      <span className="ml-2 text-text-primary">{program.processingTime || 'Not specified'}</span>
                    </div>
                    <div>
                      <span className="text-text-secondary">Renewal:</span>
                      <span className="ml-2 text-text-primary">{program.renewalRequired || 'Not specified'}</span>
                    </div>
                    {program.phoneNumber && (
                      <div>
                        <span className="text-text-secondary">Phone:</span>
                        <span className="ml-2 text-text-primary">{program.phoneNumber}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-3">Covered Products</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {program.products?.map((product, index) => (
                      <div key={index} className={`p-2 rounded text-sm border ${
                        userProfile.selectedSupplies?.some(userSupply => 
                          product.toLowerCase().includes(userSupply.toLowerCase()) ||
                          userSupply.toLowerCase().includes(product.toLowerCase())
                        )
                          ? 'border-accent-green/30 bg-accent-green/10 text-accent-green'
                          : 'border-bg-tertiary bg-bg-primary text-text-primary'
                      }`}>
                        {product}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-3">Benefits</h3>
                  <p className="text-text-primary bg-bg-secondary p-4 rounded-lg">
                    {program.benefits}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-3">Quick Actions</h3>
                  <div className="space-y-3">
                    <a
                      href={program.applicationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full px-4 py-3 bg-accent-blue text-white rounded-lg text-center hover:bg-blue-600 transition-colors"
                    >
                      Start Application →
                    </a>
                    {program.phoneNumber && (
                      <a
                        href={`tel:${program.phoneNumber}`}
                        className="block w-full px-4 py-3 bg-bg-secondary border border-bg-tertiary text-text-primary rounded-lg text-center hover:border-accent-blue transition-colors"
                      >
                        Call {program.phoneNumber}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Requirements Tab */}
        {activeTab === 'requirements' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-4">Eligibility Requirements</h3>
              <div className="space-y-3">
                {program.requirements?.map((requirement, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-bg-secondary rounded-lg">
                    <div className="w-2 h-2 bg-accent-blue rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="text-text-primary">{requirement}</p>
                      {requirement.includes('income') && program.incomeThresholdPercent && (
                        <p className="text-sm text-text-secondary mt-1">
                          Your income: {userFPLPercentage}% FPL (Limit: {program.incomeThresholdPercent}% FPL)
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-4">Income Guidelines</h3>
              <div className="bg-bg-secondary p-6 rounded-lg">
                <div className="mb-4">
                  <p className="text-text-primary font-medium">
                    Income Requirement: {program.eligibilityIncome || 'Varies by situation'}
                  </p>
                  {program.incomeThresholdPercent && (
                    <p className="text-sm text-text-secondary mt-1">
                      This means your household income must be at or below {program.incomeThresholdPercent}% of the Federal Poverty Level
                    </p>
                  )}
                </div>
                
                {program.incomeThresholdPercent && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    {[1, 2, 3, 4, 5, 6].map(size => {
                      const fplAmount = 30000 * size * 0.85; // Approximate FPL calculation
                      const maxIncome = Math.round(fplAmount * (program.incomeThresholdPercent / 100));
                      return (
                        <div key={size} className="text-center">
                          <div className="text-text-secondary">{size} {size === 1 ? 'person' : 'people'}</div>
                          <div className="text-text-primary font-medium">
                            ${maxIncome.toLocaleString()}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Application Tab */}
        {activeTab === 'application' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-4">Application Checklist</h3>
              <p className="text-text-secondary mb-6">
                Follow this step-by-step checklist to ensure your application is complete and has the best chance of approval.
              </p>
              
              <div className="space-y-3">
                {checklist.map((item, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-bg-secondary rounded-lg">
                    <button
                      onClick={() => handleChecklistToggle(index)}
                      className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        checkedItems.includes(index)
                          ? 'bg-accent-green border-accent-green text-white'
                          : 'border-bg-tertiary hover:border-accent-blue'
                      }`}
                    >
                      {checkedItems.includes(index) && '✓'}
                    </button>
                    <div className={`flex-1 ${
                      checkedItems.includes(index) ? 'line-through opacity-60' : ''
                    }`}>
                      <p className="text-text-primary">{item}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-accent-blue/10 border border-accent-blue/20 rounded-lg">
                <h4 className="font-semibold text-text-primary mb-2">💡 Pro Tips for Success</h4>
                <ul className="space-y-1 text-sm text-text-secondary">
                  <li>• Submit applications early in the program year when funding is most available</li>
                  <li>• Include a personal letter explaining your situation and financial hardship</li>
                  <li>• Make copies of everything before sending</li>
                  <li>• Follow up within the stated processing timeframe</li>
                  <li>• If denied, ask about the appeals process</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-4">Required Documents</h3>
              <p className="text-text-secondary mb-6">
                Gather these documents before starting your application. Having everything ready will speed up the process.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-text-primary mb-3">📄 Always Required</h4>
                  <div className="space-y-2">
                    {['Completed application form', 'Valid government-issued ID', 'Prescription from healthcare provider'].map((doc, index) => (
                      <div key={index} className="flex items-center space-x-2 p-2 bg-bg-secondary rounded">
                        <span className="text-accent-blue">•</span>
                        <span className="text-text-primary text-sm">{doc}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-text-primary mb-3">💰 Income Verification</h4>
                  <div className="space-y-2">
                    {['Tax returns (most recent)', 'Pay stubs (last 3 months)', 'Bank statements', 'Social Security/disability statements'].map((doc, index) => (
                      <div key={index} className="flex items-center space-x-2 p-2 bg-bg-secondary rounded">
                        <span className="text-accent-yellow">•</span>
                        <span className="text-text-primary text-sm">{doc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {program.documentsNeeded && (
                <div className="mt-6">
                  <h4 className="font-semibold text-text-primary mb-3">🏥 Program-Specific Documents</h4>
                  <div className="grid md:grid-cols-2 gap-2">
                    {program.documentsNeeded.map((doc, index) => (
                      <div key={index} className="flex items-center space-x-2 p-3 bg-bg-secondary rounded-lg">
                        <span className="text-accent-green">•</span>
                        <span className="text-text-primary text-sm">{doc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 p-4 bg-accent-yellow/10 border border-accent-yellow/20 rounded-lg">
                <h4 className="font-semibold text-text-primary mb-2">⚠️ Document Tips</h4>
                <ul className="space-y-1 text-sm text-text-secondary">
                  <li>• All documents must be current (usually within 30-90 days)</li>
                  <li>• Submit clear, legible copies (not originals unless specified)</li>
                  <li>• Ensure all pages of multi-page documents are included</li>
                  <li>• If unemployed, include a letter explaining your situation</li>
                  <li>• Contact the program if you're missing any required documents</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-bg-secondary border-t border-bg-tertiary p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="text-sm text-text-secondary">
            Completion: {checkedItems.length}/{checklist.length} steps
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 text-sm text-text-primary border border-bg-tertiary rounded-lg hover:border-accent-blue transition-colors"
            >
              Print Checklist
            </button>
            <a
              href={program.applicationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2 bg-accent-blue text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Start Application
            </a>
          </div>
        </div>
      </div>

      {/* Add bottom padding to account for fixed bar */}
      <div className="h-20"></div>
    </div>
  );
};

export default ProgramDetail;