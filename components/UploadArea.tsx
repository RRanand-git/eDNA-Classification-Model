
import React, { useCallback, useState } from 'react';
import { UploadIcon, FileIcon, LoadingSpinnerIcon, ModelIcon } from './Icons';

interface UploadAreaProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
  onClassify: () => void;
  isLoading: boolean;
  selectedModel: string;
  onModelChange: (model: string) => void;
}

const models = [
  "SIH-BioBERT (98% Accuracy)",
  "MetaGeneMark (95% Accuracy)",
  "Kraken2 (93% Accuracy)",
  "Ensembl VEP (90% Accuracy)"
];

const UploadArea: React.FC<UploadAreaProps> = ({ file, onFileChange, onClassify, isLoading, selectedModel, onModelChange }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileChange(e.target.files[0]);
    }
  };

  return (
    <div className="bg-surface p-6 rounded-lg shadow-sm border border-gray-200 w-full">
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
          isDragging ? 'border-primary bg-blue-50' : 'border-gray-300'
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleFileSelect}
          accept=".fasta,.fa,.csv"
          disabled={isLoading}
        />
        <div className="flex flex-col items-center justify-center space-y-3">
          <UploadIcon className="h-12 w-12 text-gray-400" />
          <p className="text-gray-600">
            <label htmlFor="file-upload" className="font-semibold text-primary cursor-pointer hover:underline">
              Click to upload
            </label> or drag and drop
          </p>
          <p className="text-xs text-gray-500">FASTA or CSV files</p>
        </div>
      </div>
      {file && (
        <div className="mt-4 flex items-center justify-between bg-gray-100 p-3 rounded-md">
          <div className="flex items-center space-x-2">
            <FileIcon className="h-5 w-5 text-gray-500"/>
            <span className="text-sm font-medium text-gray-700">{file.name}</span>
            <span className="text-sm text-gray-500">({(file.size / 1024).toFixed(2)} KB)</span>
          </div>
          <button onClick={() => onFileChange(null)} className="text-gray-500 hover:text-red-500" disabled={isLoading}>
             &times;
          </button>
        </div>
      )}
      
      <div className="mt-4">
        <label htmlFor="model-select" className="block text-sm font-medium text-gray-700 text-left mb-1">Select Model</label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <ModelIcon className="h-5 w-5 text-gray-400" />
          </div>
          <select 
            id="model-select" 
            value={selectedModel}
            onChange={(e) => onModelChange(e.target.value)}
            disabled={isLoading}
            className="block w-full appearance-none rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 text-base focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
          >
            {models.map(model => <option key={model}>{model}</option>)}
          </select>
        </div>
      </div>

      <button
        onClick={onClassify}
        disabled={!file || isLoading}
        className="mt-6 w-full bg-primary text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-colors duration-200 enabled:hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isLoading ? <LoadingSpinnerIcon className="h-5 w-5 mr-2" /> : null}
        {isLoading ? 'Processing...' : 'Classify Sequences'}
      </button>
    </div>
  );
};

export default UploadArea;
