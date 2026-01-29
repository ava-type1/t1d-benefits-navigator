import { federalPovertyLevels } from '../data/programs.js';

// Calculate Federal Poverty Level percentage based on income and household size
export function calculateFPLPercentage(income, householdSize, year = 2024) {
  const fplForSize = federalPovertyLevels[year][householdSize] || federalPovertyLevels[year][8];
  return Math.round((income / fplForSize) * 100);
}

// Calculate eligibility score (1-10 scale)
export function calculateEligibilityScore(program, userProfile) {
  let score = 0;
  const { income, householdSize, state, insurance } = userProfile;
  
  const userFPLPercentage = calculateFPLPercentage(income, householdSize);
  
  // Income eligibility (40% of score)
  if (program.incomeThresholdPercent) {
    if (userFPLPercentage <= program.incomeThresholdPercent) {
      score += 4; // Full points for meeting income requirement
    } else if (userFPLPercentage <= program.incomeThresholdPercent * 1.2) {
      score += 2; // Partial points for being close
    }
  } else {
    // For programs without strict income limits (like emergency programs)
    score += 3;
  }
  
  // Insurance status (20% of score)
  if (!insurance.hasInsurance) {
    score += 2; // Uninsured gets full points
  } else if (insurance.highDeductible || insurance.poorCoverage) {
    score += 1.5; // Underinsured gets partial points
  } else {
    score += 0.5; // Insured gets minimal points
  }
  
  // Product match (20% of score)  
  const selectedProducts = userProfile.selectedSupplies || [];
  const programProducts = program.products || [];
  
  const hasMatchingProduct = selectedProducts.some(userProduct =>
    programProducts.some(programProduct => 
      programProduct.toLowerCase().includes(userProduct.toLowerCase()) ||
      userProduct.toLowerCase().includes(programProduct.toLowerCase())
    )
  );
  
  if (hasMatchingProduct) {
    score += 2;
  } else if (program.category === 'general') {
    score += 1; // General programs get partial points
  }
  
  // Geographic eligibility (10% of score)
  if (program.stateRestrictions && !program.stateRestrictions.includes(state)) {
    score = Math.max(0, score - 2);
  } else {
    score += 1;
  }
  
  // Urgency bonus (10% of score)
  if (userProfile.urgentNeed) {
    if (program.type === 'nonprofit' && program.id.includes('emergency')) {
      score += 1;
    } else if (program.processingTime && program.processingTime.includes('1-2 weeks')) {
      score += 0.5;
    }
  } else {
    score += 1;
  }
  
  return Math.min(10, Math.max(1, Math.round(score)));
}

// Convert numeric score to descriptive level
export function getEligibilityLevel(score) {
  if (score >= 8) return { level: 'HIGH', color: 'accent-green', description: 'Excellent match - Apply immediately' };
  if (score >= 6) return { level: 'MEDIUM', color: 'accent-yellow', description: 'Good match - Worth applying' };
  if (score >= 4) return { level: 'LOW', color: 'accent-red', description: 'Possible match - Review requirements carefully' };
  return { level: 'VERY LOW', color: 'text-secondary', description: 'Unlikely match - Consider other options' };
}

// Filter and sort programs based on user profile
export function getMatchingPrograms(programs, userProfile) {
  return programs
    .map(program => ({
      ...program,
      eligibilityScore: calculateEligibilityScore(program, userProfile),
      eligibilityLevel: getEligibilityLevel(calculateEligibilityScore(program, userProfile))
    }))
    .sort((a, b) => b.eligibilityScore - a.eligibilityScore);
}

// Generate personalized application checklist
export function generateApplicationChecklist(program, userProfile) {
  const baseChecklist = [
    'Gather required documents (see list below)',
    'Review eligibility requirements carefully',
    'Complete application form accurately',
    'Get prescription from healthcare provider if needed'
  ];
  
  const programSpecific = [];
  
  if (program.requirements.some(req => req.includes('income'))) {
    programSpecific.push('Prepare income verification (tax returns, pay stubs, or bank statements)');
  }
  
  if (program.requirements.some(req => req.includes('insurance'))) {
    programSpecific.push('Gather insurance cards and coverage details');
    if (userProfile.insurance.hasInsurance) {
      programSpecific.push('Get insurance denial letter if coverage was denied');
    }
  }
  
  if (program.category === 'pump' || program.category === 'cgm') {
    programSpecific.push('Obtain letter of medical necessity from endocrinologist');
    programSpecific.push('Include diabetes management history and A1C records');
  }
  
  if (program.type === 'manufacturer') {
    programSpecific.push(`Contact ${program.manufacturer} customer service to confirm current program details`);
  }
  
  programSpecific.push('Submit application and required documents');
  programSpecific.push(`Follow up after ${program.processingTime || '2-3 weeks'}`);
  
  if (program.renewalRequired === 'Annual') {
    programSpecific.push('Set calendar reminder to renew annually');
  }
  
  return [...baseChecklist, ...programSpecific];
}

export default {
  calculateFPLPercentage,
  calculateEligibilityScore,
  getEligibilityLevel,
  getMatchingPrograms,
  generateApplicationChecklist
};