import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-bg-secondary border-t border-bg-tertiary mt-16">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-accent-blue rounded-lg flex items-center justify-center">
                <span className="text-lg font-bold text-white">🩺</span>
              </div>
              <h3 className="text-lg font-semibold text-text-primary">
                T1D Benefits Navigator
              </h3>
            </div>
            <p className="text-text-secondary text-sm mb-4 max-w-md">
              Making diabetes care more affordable by connecting families with Patient Assistance Programs. 
              Built with ❤️ for the Type 1 diabetes community.
            </p>
            <div className="flex items-center space-x-2 text-xs text-text-secondary">
              <span className="w-2 h-2 bg-accent-green rounded-full"></span>
              <span>Updated January 2025</span>
              <span>•</span>
              <span>30+ Programs Tracked</span>
              <span>•</span>
              <span>100% Free to Use</span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-text-primary mb-3">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://www.jdrf.org" target="_blank" rel="noopener noreferrer" 
                   className="text-text-secondary hover:text-accent-blue transition-colors">
                  JDRF
                </a>
              </li>
              <li>
                <a href="https://www.diabetes.org" target="_blank" rel="noopener noreferrer"
                   className="text-text-secondary hover:text-accent-blue transition-colors">
                  American Diabetes Association
                </a>
              </li>
              <li>
                <a href="https://www.needymeds.org" target="_blank" rel="noopener noreferrer"
                   className="text-text-secondary hover:text-accent-blue transition-colors">
                  NeedyMeds Database
                </a>
              </li>
              <li>
                <a href="https://getinsulin.org" target="_blank" rel="noopener noreferrer"
                   className="text-text-secondary hover:text-accent-blue transition-colors">
                  GetInsulin.org
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-text-primary mb-3">Emergency Help</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="tel:1-833-get-insulin" 
                   className="text-accent-red hover:text-red-400 transition-colors font-medium">
                  📞 1-833-GET-INSULIN
                </a>
                <div className="text-xs text-text-secondary">24/7 Emergency Line</div>
              </li>
              <li>
                <a href="https://getinsulin.org" target="_blank" rel="noopener noreferrer"
                   className="text-text-secondary hover:text-accent-blue transition-colors">
                  Emergency Insulin Program
                </a>
              </li>
              <li>
                <a href="tel:988" 
                   className="text-text-secondary hover:text-accent-blue transition-colors">
                  988 Crisis Lifeline
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-bg-tertiary mt-8 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between text-sm text-text-secondary">
            <div className="mb-4 md:mb-0">
              <p>
                © 2025 T1D Benefits Navigator. 
                Part of the <span className="text-accent-blue">AVA Ecosystem</span> for Type 1 Diabetes families.
              </p>
            </div>
            
            <div className="flex items-center space-x-6">
              <span className="text-xs">
                Made by KameronMartinLLC
              </span>
              <div className="flex items-center space-x-1">
                <span className="text-xs">Powered by</span>
                <span className="text-accent-blue text-xs font-medium">Claude Code</span>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 p-4 bg-accent-yellow/10 border border-accent-yellow/20 rounded-lg">
          <h4 className="font-semibold text-text-primary mb-2 text-sm">⚠️ Important Disclaimer</h4>
          <p className="text-xs text-text-secondary leading-relaxed">
            This tool provides information about patient assistance programs based on publicly available data. 
            Program availability, eligibility requirements, and benefits may change without notice. 
            Always verify current program details directly with the manufacturer or organization before applying. 
            This tool does not guarantee approval for any program and should not replace consultation with healthcare providers or social workers.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;