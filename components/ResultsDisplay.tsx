import React, { useState, useMemo } from 'react';
import type { ClassificationResult, SpeciesRichness, SequenceResult } from '../types';
import TaxonomyTreemap from './TaxonomyChart';
import NoveltyChart from './NoveltyChart';
import ResultsTable from './ResultsTable';
import ScatterPlot from './ScatterPlot';
import ConfidenceHistogram from './ConfidenceHistogram';
import { DownloadIcon, RetryIcon, EyeIcon, ChartBarIcon, TableCellsIcon } from './Icons';

interface ResultsDisplayProps {
  results: ClassificationResult;
  onReset: () => void;
  fileName: string;
}

type ResultTab = 'overview' | 'visuals' | 'details';

const SummaryCard: React.FC<{ label: string; value: string | number; }> = ({ label, value }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm text-center border border-gray-200">
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
);

const AbundanceTable: React.FC<{ data: SpeciesRichness[] }> = ({ data }) => (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 bg-white">
            <thead className="bg-gray-50">
                <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Species</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Abundance</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Relative Abundance</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
                {data.map((row) => (
                    <tr key={row.species} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.species}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.abundance}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.relativeAbundance}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);


const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, onReset, fileName }) => {
  const [filter, setFilter] = useState('');
  const [activeTab, setActiveTab] = useState<ResultTab>('overview');

  const filteredDetailedResults = useMemo(() => {
    if (!filter) {
      return results.detailedResults;
    }
    return results.detailedResults.filter(row =>
      row.id.toLowerCase().includes(filter.toLowerCase())
    );
  }, [filter, results.detailedResults]);


  const handleDownload = () => {
    const headers = "id,predictedTaxonomy,confidence,noveltyScore,isNovel\n";
    const csvContent = results.detailedResults.map(row => 
        `${row.id},"${row.predictedTaxonomy}",${row.confidence},${row.noveltyScore},${row.isNovel}`
    ).join("\n");

    const blob = new Blob([headers + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `results_${fileName}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
  };
  
  const TabButton: React.FC<{
    tabName: ResultTab;
    currentTab: ResultTab;
    onClick: (tab: ResultTab) => void;
    children: React.ReactNode;
    icon: React.ReactNode;
  }> = ({ tabName, currentTab, onClick, children, icon }) => (
    <button onClick={() => onClick(tabName)} className={`flex items-center space-x-2 py-3 px-4 border-b-2 font-medium text-sm transition-colors ${currentTab === tabName ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
        {icon}
        <span>{children}</span>
    </button>
  )

  return (
    <div className="w-full max-w-7xl animate-fade-in">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Classification Results</h2>
            <div className="flex space-x-2">
                 <button 
                    onClick={handleDownload}
                    className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center transition-colors hover:bg-green-700">
                    <DownloadIcon className="h-5 w-5 mr-2" />
                    Download CSV
                </button>
                <button 
                    onClick={onReset}
                    className="bg-primary text-white font-semibold py-2 px-4 rounded-lg flex items-center transition-colors hover:bg-blue-600">
                    <RetryIcon className="h-5 w-5 mr-2" />
                    Classify Another
                </button>
            </div>
        </div>
        
        <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-2">
                <TabButton tabName="overview" currentTab={activeTab} onClick={setActiveTab} icon={<ChartBarIcon className="h-5 w-5" />}>
                    Overview
                </TabButton>
                <TabButton tabName="visuals" currentTab={activeTab} onClick={setActiveTab} icon={<EyeIcon className="h-5 w-5" />}>
                    Visualizations
                </TabButton>
                <TabButton tabName="details" currentTab={activeTab} onClick={setActiveTab} icon={<TableCellsIcon className="h-5 w-5" />}>
                    Detailed Results
                </TabButton>
            </nav>
        </div>

      {activeTab === 'overview' && (
        <div className="animate-fade-in space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <SummaryCard label="Total Sequences" value={results.summary.totalSequences} />
            <SummaryCard label="Classified" value={results.summary.classified} />
            <SummaryCard label="Novel" value={results.summary.novel} />
            <SummaryCard label="Species Richness" value={results.diversityIndices.totalSpecies} />
            <SummaryCard label="Shannon Index (H')" value={results.diversityIndices.shannonIndex} />
          </div>
          
           <div className="bg-surface p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Abundance and Richness</h3>
                <AbundanceTable data={results.speciesRichness} />
            </div>
        </div>
      )}

      {activeTab === 'visuals' && (
        <div className="animate-fade-in space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-surface p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-xl font-semibold mb-4 text-gray-700">Hierarchical Taxonomic Distribution</h3>
                    <TaxonomyTreemap data={results.taxonomyTree} />
                </div>
                <div className="bg-surface p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-xl font-semibold mb-4 text-gray-700">Novelty Detection</h3>
                    <NoveltyChart data={results.noveltySummary} />
                </div>
            </div>
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-surface p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-xl font-semibold mb-4 text-gray-700">Confidence vs. Novelty Score</h3>
                    <ScatterPlot data={results.detailedResults} />
                </div>
                <div className="bg-surface p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-xl font-semibold mb-4 text-gray-700">Confidence Score Distribution</h3>
                    <ConfidenceHistogram data={results.detailedResults} />
                </div>
            </div>
        </div>
      )}

      {activeTab === 'details' && (
        <div className="animate-fade-in">
          <div className="bg-surface p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-700">Detailed Sequence Results</h3>
                <input 
                  type="text"
                  placeholder="Filter by Sequence ID..."
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="block w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>
              <ResultsTable data={filteredDetailedResults} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsDisplay;