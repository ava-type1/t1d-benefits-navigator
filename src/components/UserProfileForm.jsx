import React, { useState } from 'react';
import { programs } from '../data/programs.js';
import { getMatchingPrograms } from '../utils/eligibility.js';

const UserProfileForm = ({ onSubmit }) => {
  const [profile, setProfile] = useState({
    name: '',
    income: '',
    householdSize: '1',
    state: '',
    insurance: {
      hasInsurance: null,
      provider: '',
      highDeductible: false,
      poorCoverage: false
    },
    selectedSupplies: [],
    urgentNeed: false
  });

  const [currentSection, setCurrentSection] = useState('basic'); // 'basic', 'insurance', 'supplies'

  const usStates = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  const diabetesSupplies = [
    { category: 'Insulin', items: ['Humalog', 'NovoLog', 'Apidra', 'Fiasp', 'Lantus', 'Levemir', 'Tresiba', 'Basaglar', 'Toujeo', 'Admelog'] },
    { category: 'CGM', items: ['Dexcom G7', 'Dexcom G6', 'FreeStyle Libre 3', 'FreeStyle Libre 2', 'Guardian 4'] },
    { category: 'Insulin Pump', items: ['Omnipod 5', 'Omnipod DASH', 't:slim X2', 'MiniMed 780G', 'MiniMed 770G'] },
    { category: 'Test Strips', items: ['Accu-Chek', 'OneTouch', 'FreeStyle', 'Contour', 'True Metrix'] },
    { category: 'Other Supplies', items: ['Pen Needles', 'Syringes', 'Lancets', 'Alcohol Wipes', 'Ketone Strips', 'Glucagon'] }
  ];

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setProfile(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setProfile(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSupplyToggle = (supply) => {
    setProfile(prev => ({
      ...prev,
      selectedSupplies: prev.selectedSupplies.includes(supply)
        ? prev.selectedSupplies.filter(s => s !== supply)
        : [...prev.selectedSupplies, supply]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!profile.name || !profile.income || !profile.state || profile.insurance.hasInsurance === null) {
      alert('Please fill in all required fields.');
      return;
    }

    if (profile.selectedSupplies.length === 0) {
      alert('Please select at least one diabetes supply you need help with.');
      return;
    }

    // Get matching programs
    const matchingPrograms = getMatchingPrograms(programs, profile);
    
    onSubmit(profile, matchingPrograms);
  };

  const nextSection = () => {
    if (currentSection === 'basic') setCurrentSection('insurance');
    else if (currentSection === 'insurance') setCurrentSection('supplies');
  };

  const prevSection = () => {
    if (currentSection === 'insurance') setCurrentSection('basic');
    else if (currentSection === 'supplies') setCurrentSection('insurance');
  };

  const canProceed = () => {
    if (currentSection === 'basic') {
      return profile.name && profile.income && profile.state;
    }
    if (currentSection === 'insurance') {
      return profile.insurance.hasInsurance !== null;
    }
    if (currentSection === 'supplies') {
      return profile.selectedSupplies.length > 0;
    }
    return false;
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-8">
          {['basic', 'insurance', 'supplies'].map((step, index) => (
            <div key={step} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                currentSection === step 
                  ? 'bg-accent-blue text-white' 
                  : index < ['basic', 'insurance', 'supplies'].indexOf(currentSection)
                    ? 'bg-accent-green text-white'
                    : 'bg-bg-tertiary text-text-secondary'
              }`}>
                {index + 1}
              </div>
              {index < 2 && (
                <div className={`w-16 h-1 mx-2 ${
                  index < ['basic', 'insurance', 'supplies'].indexOf(currentSection)
                    ? 'bg-accent-green'
                    : 'bg-bg-tertiary'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="text-center mt-4">
          <h2 className="text-xl font-semibold text-text-primary capitalize">
            {currentSection === 'basic' && 'Basic Information'}
            {currentSection === 'insurance' && 'Insurance Details'}
            {currentSection === 'supplies' && 'Diabetes Supplies'}
          </h2>
          <p className="text-text-secondary text-sm mt-1">
            {currentSection === 'basic' && 'Tell us about yourself and your household'}
            {currentSection === 'insurance' && 'Help us understand your insurance situation'}
            {currentSection === 'supplies' && 'Select the supplies you need assistance with'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-bg-secondary rounded-lg p-8">
        
        {/* Basic Information Section */}
        {currentSection === 'basic' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-4 py-3 bg-bg-primary border border-bg-tertiary rounded-lg text-text-primary focus:outline-none focus:border-accent-blue"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Annual Household Income *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary">$</span>
                  <input
                    type="number"
                    value={profile.income}
                    onChange={(e) => handleInputChange('income', parseInt(e.target.value) || '')}
                    className="w-full pl-8 pr-4 py-3 bg-bg-primary border border-bg-tertiary rounded-lg text-text-primary focus:outline-none focus:border-accent-blue"
                    placeholder="50000"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Household Size *
                </label>
                <select
                  value={profile.householdSize}
                  onChange={(e) => handleInputChange('householdSize', e.target.value)}
                  className="w-full px-4 py-3 bg-bg-primary border border-bg-tertiary rounded-lg text-text-primary focus:outline-none focus:border-accent-blue"
                  required
                >
                  {[1,2,3,4,5,6,7,8].map(size => (
                    <option key={size} value={size}>{size} {size === 1 ? 'person' : 'people'}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                State *
              </label>
              <select
                value={profile.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                className="w-full px-4 py-3 bg-bg-primary border border-bg-tertiary rounded-lg text-text-primary focus:outline-none focus:border-accent-blue"
                required
              >
                <option value="">Select your state</option>
                {usStates.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Insurance Section */}
        {currentSection === 'insurance' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-4">
                Do you currently have health insurance? *
              </label>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 p-4 bg-bg-primary rounded-lg cursor-pointer hover:bg-bg-tertiary">
                  <input
                    type="radio"
                    name="hasInsurance"
                    value="true"
                    checked={profile.insurance.hasInsurance === true}
                    onChange={() => handleInputChange('insurance.hasInsurance', true)}
                    className="text-accent-blue"
                  />
                  <span className="text-text-primary">Yes, I have health insurance</span>
                </label>
                <label className="flex items-center space-x-3 p-4 bg-bg-primary rounded-lg cursor-pointer hover:bg-bg-tertiary">
                  <input
                    type="radio"
                    name="hasInsurance"
                    value="false"
                    checked={profile.insurance.hasInsurance === false}
                    onChange={() => handleInputChange('insurance.hasInsurance', false)}
                    className="text-accent-blue"
                  />
                  <span className="text-text-primary">No, I don't have health insurance</span>
                </label>
              </div>
            </div>

            {profile.insurance.hasInsurance && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Insurance Provider
                  </label>
                  <input
                    type="text"
                    value={profile.insurance.provider}
                    onChange={(e) => handleInputChange('insurance.provider', e.target.value)}
                    className="w-full px-4 py-3 bg-bg-primary border border-bg-tertiary rounded-lg text-text-primary focus:outline-none focus:border-accent-blue"
                    placeholder="e.g., Aetna, Blue Cross, Cigna"
                  />
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-text-primary">Insurance Coverage Issues (check all that apply):</h3>
                  
                  <label className="flex items-center space-x-3 p-3 bg-bg-primary rounded-lg cursor-pointer hover:bg-bg-tertiary">
                    <input
                      type="checkbox"
                      checked={profile.insurance.highDeductible}
                      onChange={(e) => handleInputChange('insurance.highDeductible', e.target.checked)}
                      className="text-accent-blue"
                    />
                    <span className="text-text-primary">High deductible (over $1,000)</span>
                  </label>

                  <label className="flex items-center space-x-3 p-3 bg-bg-primary rounded-lg cursor-pointer hover:bg-bg-tertiary">
                    <input
                      type="checkbox"
                      checked={profile.insurance.poorCoverage}
                      onChange={(e) => handleInputChange('insurance.poorCoverage', e.target.checked)}
                      className="text-accent-blue"
                    />
                    <span className="text-text-primary">Poor coverage for diabetes supplies</span>
                  </label>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Supplies Section */}
        {currentSection === 'supplies' && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center space-x-4 mb-4">
                <h3 className="text-lg font-medium text-text-primary">Select the diabetes supplies you need assistance with:</h3>
                <label className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={profile.urgentNeed}
                    onChange={(e) => handleInputChange('urgentNeed', e.target.checked)}
                    className="text-accent-red"
                  />
                  <span className="text-text-secondary">Urgent need (less than 7 days supply)</span>
                </label>
              </div>
              
              {diabetesSupplies.map((category) => (
                <div key={category.category} className="mb-6">
                  <h4 className="text-md font-medium text-text-primary mb-3 flex items-center">
                    <span className="w-2 h-2 bg-accent-blue rounded-full mr-3"></span>
                    {category.category}
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {category.items.map((item) => (
                      <label key={item} className="flex items-center space-x-2 p-3 bg-bg-primary rounded-lg cursor-pointer hover:bg-bg-tertiary">
                        <input
                          type="checkbox"
                          checked={profile.selectedSupplies.includes(item)}
                          onChange={() => handleSupplyToggle(item)}
                          className="text-accent-blue"
                        />
                        <span className="text-sm text-text-primary">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-8 mt-8 border-t border-bg-tertiary">
          <button
            type="button"
            onClick={prevSection}
            className={`px-6 py-3 rounded-lg font-medium ${
              currentSection === 'basic'
                ? 'bg-bg-tertiary text-text-secondary cursor-not-allowed'
                : 'bg-bg-primary text-text-primary hover:bg-bg-tertiary border border-bg-tertiary'
            }`}
            disabled={currentSection === 'basic'}
          >
            Previous
          </button>

          {currentSection === 'supplies' ? (
            <button
              type="submit"
              className={`px-8 py-3 rounded-lg font-medium ${
                canProceed()
                  ? 'bg-accent-blue text-white hover:bg-blue-600'
                  : 'bg-bg-tertiary text-text-secondary cursor-not-allowed'
              }`}
              disabled={!canProceed()}
            >
              Find Programs
            </button>
          ) : (
            <button
              type="button"
              onClick={nextSection}
              className={`px-6 py-3 rounded-lg font-medium ${
                canProceed()
                  ? 'bg-accent-blue text-white hover:bg-blue-600'
                  : 'bg-bg-tertiary text-text-secondary cursor-not-allowed'
              }`}
              disabled={!canProceed()}
            >
              Next
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default UserProfileForm;