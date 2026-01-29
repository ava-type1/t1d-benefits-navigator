import React, { useState } from 'react';
import UserProfileForm from './components/UserProfileForm';
import ProgramResults from './components/ProgramResults';
import ProgramDetail from './components/ProgramDetail';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  const [currentStep, setCurrentStep] = useState('profile'); // 'profile', 'results', 'detail'
  const [userProfile, setUserProfile] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [matchingPrograms, setMatchingPrograms] = useState([]);

  const handleProfileSubmit = (profile, programs) => {
    setUserProfile(profile);
    setMatchingPrograms(programs);
    setCurrentStep('results');
  };

  const handleProgramSelect = (program) => {
    setSelectedProgram(program);
    setCurrentStep('detail');
  };

  const handleBackToResults = () => {
    setCurrentStep('results');
    setSelectedProgram(null);
  };

  const handleBackToProfile = () => {
    setCurrentStep('profile');
    setUserProfile(null);
    setMatchingPrograms([]);
    setSelectedProgram(null);
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {currentStep === 'profile' && (
          <UserProfileForm onSubmit={handleProfileSubmit} />
        )}
        
        {currentStep === 'results' && (
          <ProgramResults 
            userProfile={userProfile}
            programs={matchingPrograms}
            onProgramSelect={handleProgramSelect}
            onBack={handleBackToProfile}
          />
        )}
        
        {currentStep === 'detail' && (
          <ProgramDetail 
            program={selectedProgram}
            userProfile={userProfile}
            onBack={handleBackToResults}
          />
        )}
      </main>
      
      <Footer />
    </div>
  );
}

export default App;