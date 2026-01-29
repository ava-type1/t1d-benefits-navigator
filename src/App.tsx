import React, { useState } from 'react';
import UserForm, { UserData } from './components/UserForm';
import SearchResults from './components/SearchResults';
import { PAP_DATABASE, PAPProgram } from './data/papDatabase';

type AppState = 'form' | 'results';

function App() {
  const [currentState, setCurrentState] = useState<AppState>('form');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [matchingPrograms, setMatchingPrograms] = useState<PAPProgram[]>([]);
  const [loading, setLoading] = useState(false);

  const findMatchingPrograms = (data: UserData): PAPProgram[] => {
    const matchedPrograms: PAPProgram[] = [];

    // Helper function to check if a program matches user's selected supplies
    const programMatchesSupplies = (program: PAPProgram): boolean => {
      // Check if any of the program's products match user's selected supplies
      const supplyToProductMap: { [key: string]: string[] } = {
        'humalog': ['Humalog', 'Insulin Lispro'],
        'novolog': ['NovoLog', 'NovoRapid', 'Fiasp'],
        'lantus': ['Lantus', 'Insulin Glargine'],
        'basaglar': ['Basaglar'],
        'tresiba': ['Tresiba'],
        'toujeo': ['Toujeo'],
        'dexcom-g7': ['Dexcom G6', 'Dexcom G7', 'Dexcom'],
        'freestyle-libre': ['FreeStyle Libre'],
        'omnipod-5': ['Omnipod'],
        'tandem-tslim': ['t:slim', 'Tandem'],
        'medtronic-minimed': ['MiniMed', 'Medtronic'],
        'test-strips': ['test strips', 'glucose monitoring']
      };

      return data.selectedSupplies.some(supply => {
        const productKeywords = supplyToProductMap[supply] || [supply];
        return productKeywords.some(keyword => 
          program.products.some(product => 
            product.toLowerCase().includes(keyword.toLowerCase()) ||
            keyword.toLowerCase().includes(product.toLowerCase())
          )
        );
      });
    };

    // Find all matching programs
    PAP_DATABASE.forEach(program => {
      // Check if program matches user's supplies
      if (programMatchesSupplies(program)) {
        matchedPrograms.push(program);
      }
    });

    // Always include resource programs (GetInsulin, NeedyMeds)
    const resourcePrograms = PAP_DATABASE.filter(program => 
      program.organizationType === 'nonprofit' && program.category === 'resource'
    );
    
    resourcePrograms.forEach(program => {
      if (!matchedPrograms.find(p => p.id === program.id)) {
        matchedPrograms.push(program);
      }
    });

    return matchedPrograms;
  };

  const handleFormSubmit = async (data: UserData) => {
    setLoading(true);
    setUserData(data);

    // Simulate API call delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1500));

    const programs = findMatchingPrograms(data);
    setMatchingPrograms(programs);
    setLoading(false);
    setCurrentState('results');
  };

  const handleBackToForm = () => {
    setCurrentState('form');
    setUserData(null);
    setMatchingPrograms([]);
  };

  return (
    <div className="min-h-screen">
      {currentState === 'form' ? (
        <UserForm 
          onSubmit={handleFormSubmit}
          loading={loading}
        />
      ) : (
        userData && (
          <SearchResults 
            programs={matchingPrograms}
            userData={userData}
            onBack={handleBackToForm}
          />
        )
      )}
    </div>
  );
}

export default App;