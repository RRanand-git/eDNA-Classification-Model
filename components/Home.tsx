
import React from 'react';
import UploadArea from './UploadArea';
import ProgressBar from './ProgressBar';

interface HomeProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
  onClassify: () => void;
  isLoading: boolean;
  selectedModel: string;
  onModelChange: (model: string) => void;
  error: string | null;
  progress: number;
}

const Home: React.FC<HomeProps> = (props) => {
  return (
    <div className="w-full max-w-3xl text-center">
      <div className="bg-surface/80 backdrop-blur-sm p-8 md:p-12 rounded-xl shadow-lg border border-gray-200/50">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-3">
          AI-Powered eDNA Classification
        </h1>
        <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
          Unlock biodiversity insights. Upload your FASTA or CSV files to classify sequences and detect novel species with cutting-edge models.
        </p>
        <div className="w-full max-w-xl mx-auto">
          <UploadArea
            file={props.file}
            onFileChange={props.onFileChange}
            onClassify={props.onClassify}
            isLoading={props.isLoading}
            selectedModel={props.selectedModel}
            onModelChange={props.onModelChange}
          />
        </div>
      </div>
      {props.isLoading && <ProgressBar progress={props.progress} />}
      {props.error && !props.isLoading && (
        <div className="mt-6 text-red-600 bg-red-100 border border-red-400 rounded-md p-4 w-full max-w-xl mx-auto text-center">
          <p className="font-semibold">Error</p>
          <p>{props.error}</p>
        </div>
      )}
    </div>
  );
};

export default Home;
