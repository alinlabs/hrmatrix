import React from 'react';
import { CreateQuestionView } from './create-question-view';
import { TestPackage } from './types';

export { CreateQuestionView };

interface ModalCustomizeTestProps {
  testPackage: TestPackage;
  isOpen: boolean;
  onClose: () => void;
  onSaved: (updatedPackage: TestPackage) => void;
  onStartSimulation: (pkg: TestPackage) => void;
  onShareTest: (pkg: TestPackage) => void;
}

export const ModalCustomizeTest: React.FC<ModalCustomizeTestProps> = ({
  testPackage,
  isOpen,
  onClose,
  onSaved,
  onStartSimulation,
  onShareTest
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs overflow-y-auto p-4 sm:p-6">
      <div className="bg-white rounded-3xl p-4 sm:p-6 max-w-7xl mx-auto shadow-2xl">
        <CreateQuestionView
          packages={[testPackage]}
          selectedPackage={testPackage}
          onClose={onClose}
          onSaved={onSaved}
          onStartSimulation={onStartSimulation}
          onShareTest={onShareTest}
        />
      </div>
    </div>
  );
};
