
import React from 'react';
import { CheckCircleIcon, LoadingSpinnerIcon } from './Icons';

interface ProgressBarProps {
  progress: number;
}

const steps = [
    { name: "Initializing pipeline", threshold: 0 },
    { name: "Preprocessing sequences", threshold: 15 },
    { name: "Aligning to database", threshold: 40 },
    { name: "Running classification model", threshold: 65 },
    { name: "Novelty detection", threshold: 85 },
    { name: "Finalizing results", threshold: 99 }
];

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  const currentStepIndex = steps.findIndex((step, i) => {
    const nextStep = steps[i + 1];
    return progress >= step.threshold && (!nextStep || progress < nextStep.threshold);
  });
  
  return (
    <div className="w-full max-w-2xl mt-8 p-4 bg-gray-50 rounded-lg">
       <div className="flex justify-between mb-2">
        <span className="text-base font-medium text-primary">Processing...</span>
        <span className="text-sm font-medium text-primary">{Math.min(progress, 100)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
        <div
          className="bg-primary h-2.5 rounded-full transition-all duration-300 ease-linear"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="space-y-2">
        {steps.map((step, index) => {
          let status: 'completed' | 'in_progress' | 'pending' = 'pending';
          if (progress >= step.threshold) {
             status = progress >= (steps[index+1]?.threshold || 100) ? 'completed' : 'in_progress';
          }
           if (progress === 100) status = 'completed';

          return (
            <div key={step.name} className="flex items-center text-sm">
                {status === 'completed' && <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />}
                {status === 'in_progress' && <LoadingSpinnerIcon className="h-5 w-5 text-primary mr-2 flex-shrink-0" />}
                {status === 'pending' && <div className="h-5 w-5 mr-2 flex-shrink-0 flex items-center justify-center"><div className="h-2 w-2 rounded-full bg-gray-300"></div></div>}
              <span className={`${status === 'in_progress' ? 'text-primary font-semibold' : status === 'completed' ? 'text-gray-700' : 'text-gray-500'}`}>
                {step.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressBar;
