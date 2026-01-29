import React, { useState } from 'react';
import { ChevronRightIcon, UserIcon, CurrencyDollarIcon, HomeIcon, ShieldCheckIcon, MapPinIcon } from '@heroicons/react/24/outline';

export interface UserData {
  name: string;
  annualIncome: number;
  householdSize: number;
  hasInsurance: boolean;
  insuranceType: string;
  state: string;
  selectedSupplies: string[];
}

interface UserFormProps {
  onSubmit: (data: UserData) => void;
  loading: boolean;
}

const diabetesSupplies = [
  { id: 'humalog', name: 'Humalog (Lilly)', category: 'insulin' },
  { id: 'novolog', name: 'NovoLog (Novo Nordisk)', category: 'insulin' },
  { id: 'lantus', name: 'Lantus (Sanofi)', category: 'insulin' },
  { id: 'basaglar', name: 'Basaglar (Lilly)', category: 'insulin' },
  { id: 'tresiba', name: 'Tresiba (Novo Nordisk)', category: 'insulin' },
  { id: 'toujeo', name: 'Toujeo (Sanofi)', category: 'insulin' },
  { id: 'dexcom-g7', name: 'Dexcom G7 CGM', category: 'cgm' },
  { id: 'freestyle-libre', name: 'FreeStyle Libre CGM', category: 'cgm' },
  { id: 'omnipod-5', name: 'Omnipod 5', category: 'pump' },
  { id: 'tandem-tslim', name: 'Tandem t:slim X2', category: 'pump' },
  { id: 'medtronic-minimed', name: 'MiniMed (Medtronic)', category: 'pump' },
  { id: 'test-strips', name: 'Blood Glucose Test Strips', category: 'supplies' }
];

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 
  'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 
  'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 
  'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 
  'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 
  'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];

export default function UserForm({ onSubmit, loading }: UserFormProps) {
  const [formData, setFormData] = useState<UserData>({
    name: '',
    annualIncome: 0,
    householdSize: 1,
    hasInsurance: false,
    insuranceType: 'none',
    state: '',
    selectedSupplies: []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (formData.annualIncome <= 0) {
      newErrors.annualIncome = 'Annual income must be greater than 0';
    }

    if (formData.householdSize < 1) {
      newErrors.householdSize = 'Household size must be at least 1';
    }

    if (!formData.state) {
      newErrors.state = 'Please select your state';
    }

    if (formData.selectedSupplies.length === 0) {
      newErrors.selectedSupplies = 'Please select at least one diabetes supply';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleSupplyChange = (supplyId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedSupplies: prev.selectedSupplies.includes(supplyId)
        ? prev.selectedSupplies.filter(id => id !== supplyId)
        : [...prev.selectedSupplies, supplyId]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            T1D Benefits Navigator
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto">
            Find Patient Assistance Programs for Type 1 Diabetes supplies and medications. 
            Get personalized recommendations based on your income, insurance, and needs.
          </p>
        </div>

        {/* Main Form */}
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <UserIcon className="h-6 w-6 text-blue-400 mr-2" />
                <h2 className="text-xl font-semibold text-white">Personal Information</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                  {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    State *
                  </label>
                  <select
                    value={formData.state}
                    onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select your state</option>
                    {US_STATES.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                  {errors.state && <p className="text-red-400 text-sm mt-1">{errors.state}</p>}
                </div>
              </div>
            </div>

            {/* Financial Information */}
            <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <CurrencyDollarIcon className="h-6 w-6 text-green-400 mr-2" />
                <h2 className="text-xl font-semibold text-white">Financial Information</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Annual Household Income *
                  </label>
                  <input
                    type="number"
                    value={formData.annualIncome || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, annualIncome: Number(e.target.value) }))}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 50000"
                  />
                  {errors.annualIncome && <p className="text-red-400 text-sm mt-1">{errors.annualIncome}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Household Size *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.householdSize}
                    onChange={(e) => setFormData(prev => ({ ...prev, householdSize: Number(e.target.value) }))}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.householdSize && <p className="text-red-400 text-sm mt-1">{errors.householdSize}</p>}
                </div>
              </div>
            </div>

            {/* Insurance Information */}
            <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <ShieldCheckIcon className="h-6 w-6 text-purple-400 mr-2" />
                <h2 className="text-xl font-semibold text-white">Insurance Information</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Do you have health insurance?
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="hasInsurance"
                        checked={formData.hasInsurance}
                        onChange={() => setFormData(prev => ({ ...prev, hasInsurance: true, insuranceType: 'private' }))}
                        className="mr-2 text-blue-500 focus:ring-blue-500"
                      />
                      <span className="text-white">Yes</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="hasInsurance"
                        checked={!formData.hasInsurance}
                        onChange={() => setFormData(prev => ({ ...prev, hasInsurance: false, insuranceType: 'none' }))}
                        className="mr-2 text-blue-500 focus:ring-blue-500"
                      />
                      <span className="text-white">No</span>
                    </label>
                  </div>
                </div>

                {formData.hasInsurance && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Insurance Type
                    </label>
                    <select
                      value={formData.insuranceType}
                      onChange={(e) => setFormData(prev => ({ ...prev, insuranceType: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="private">Private/Commercial Insurance</option>
                      <option value="medicare">Medicare</option>
                      <option value="medicaid">Medicaid</option>
                      <option value="tricare">Tricare/Military</option>
                      <option value="other">Other Government Insurance</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Diabetes Supplies */}
            <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <HomeIcon className="h-6 w-6 text-yellow-400 mr-2" />
                <h2 className="text-xl font-semibold text-white">Diabetes Supplies Needed *</h2>
              </div>
              
              <p className="text-gray-300 text-sm mb-4">
                Select all diabetes supplies you need assistance with:
              </p>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {diabetesSupplies.map(supply => (
                  <label key={supply.id} className="flex items-center space-x-3 p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.selectedSupplies.includes(supply.id)}
                      onChange={() => handleSupplyChange(supply.id)}
                      className="text-blue-500 focus:ring-blue-500 rounded"
                    />
                    <div className="flex-1">
                      <span className="text-white text-sm font-medium">{supply.name}</span>
                      <span className="block text-gray-400 text-xs capitalize">{supply.category}</span>
                    </div>
                  </label>
                ))}
              </div>
              {errors.selectedSupplies && <p className="text-red-400 text-sm mt-2">{errors.selectedSupplies}</p>}
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Finding Programs...
                  </>
                ) : (
                  <>
                    Find Assistance Programs
                    <ChevronRightIcon className="ml-2 h-5 w-5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}