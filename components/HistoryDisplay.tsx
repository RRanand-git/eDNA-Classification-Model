
import React from 'react';
import type { HistoryEntry } from '../types';
import { HistoryIcon } from './Icons';

interface HistoryDisplayProps {
  history: HistoryEntry[];
  onView: (id: string) => void;
}

const HistoryDisplay: React.FC<HistoryDisplayProps> = ({ history, onView }) => {

  if (history.length === 0) {
    return (
       <div className="w-full max-w-4xl text-center bg-surface p-8 rounded-lg shadow-sm border border-gray-200">
         <HistoryIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
         <h2 className="text-2xl font-bold text-gray-700">No History Yet</h2>
         <p className="text-text-secondary mt-2">Your past classification results will appear here.</p>
       </div>
    );
  }

  return (
    <div className="w-full max-w-5xl bg-surface p-6 rounded-lg shadow-sm border border-gray-200 animate-fade-in">
       <div className="flex items-center mb-6">
        <HistoryIcon className="h-8 w-8 text-primary" />
        <h2 className="text-3xl font-bold text-gray-800 ml-3">Classification History</h2>
      </div>
       <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model Used</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {history.map((entry) => (
              <tr key={entry.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{entry.fileName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(entry.timestamp).toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{(entry.duration / 1000).toFixed(2)}s</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.modelUsed}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => onView(entry.id)}
                    className="text-primary hover:text-blue-700 font-semibold"
                  >
                    View Results
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryDisplay;
