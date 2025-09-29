
import React from 'react';
import { DnaIcon } from './Icons';

const About: React.FC = () => {
  return (
    <div className="w-full max-w-4xl bg-surface p-8 rounded-lg shadow-sm border border-gray-200 animate-fade-in text-left">
      <div className="flex items-center mb-6">
        <DnaIcon className="h-10 w-10 text-primary" />
        <h2 className="text-3xl font-bold text-gray-800 ml-4">About the eDNA Pipeline</h2>
      </div>
      <div className="space-y-4 text-text-secondary">
        <p>
          This application provides an advanced, AI-driven pipeline for the classification of environmental DNA (eDNA) sequences. 
          Built for the Smart India Hackathon (SIH), our tool is designed to help researchers, ecologists, and conservationists 
          rapidly analyze rRNA datasets from environmental samples.
        </p>
        <h3 className="text-xl font-semibold text-gray-700 pt-4">Key Features</h3>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>Efficient File Upload:</strong> Supports common bioinformatics formats like FASTA and CSV for easy data input.</li>
          <li><strong>AI-Powered Classification:</strong> Leverages state-of-the-art machine learning models to predict the taxonomic origin of each DNA sequence with high accuracy.</li>
          <li><strong>Novelty Detection:</strong> Employs specialized algorithms to identify sequences that may belong to previously unknown or uncatalogued species, highlighting potential areas for new biological discovery.</li>
          <li><strong>Interactive Visualizations:</strong> Presents complex data through intuitive charts and tables, including taxonomic distribution pies and novelty summary bars.</li>
          <li><strong>Persistent History:</strong> Automatically saves your classification runs, allowing you to revisit and compare results over time.</li>
        </ul>
        <h3 className="text-xl font-semibold text-gray-700 pt-4">Our Mission</h3>
        <p>
          Our goal is to democratize the power of genomic analysis for environmental monitoring. By providing a user-friendly and powerful tool, 
          we aim to accelerate biodiversity research, support conservation efforts, and enhance our understanding of the complex ecosystems 
          all around us.
        </p>
      </div>
    </div>
  );
};

export default About;
