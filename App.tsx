
import React, { useState, useEffect, useCallback } from 'react';
import type { ClassificationResult, HistoryEntry } from './types';
import { runClassification } from './services/classificationService';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import ProgressBar from './components/ProgressBar';
import ResultsDisplay from './components/ResultsDisplay';
import HistoryDisplay from './components/HistoryDisplay';
import About from './components/About';

type View = 'upload' | 'results' | 'history' | 'about';

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [results, setResults] = useState<ClassificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [currentView, setCurrentView] = useState<View>('upload');
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('SIH-BioBERT (98% Accuracy)');

  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('eDNAHistory');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (e) {
      console.error("Failed to load history from localStorage", e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('eDNAHistory', JSON.stringify(history));
    } catch (e) {
      console.error("Failed to save history to localStorage", e);
    }
  }, [history]);

  const handleFileChange = (selectedFile: File | null) => {
    setFile(selectedFile);
    setError(null);
  };

  const handleReset = () => {
    setFile(null);
    setIsLoading(false);
    setProgress(0);
    setResults(null);
    setError(null);
    setCurrentView('upload');
  };
  
  const handleClassify = useCallback(async () => {
    if (!file) {
      setError('Please select a file first.');
      return;
    }

    setIsLoading(true);
    setProgress(0);
    setResults(null);
    setError(null);
    const startTime = Date.now();

    try {
      const resultData = await runClassification(file, setProgress);
      const endTime = Date.now();
      const newHistoryEntry: HistoryEntry = {
        id: `run-${Date.now()}`,
        fileName: file.name,
        timestamp: Date.now(),
        duration: endTime - startTime,
        modelUsed: selectedModel,
        ...resultData,
      };
      setHistory(prev => [newHistoryEntry, ...prev]);
      setResults(newHistoryEntry);
      setCurrentView('results');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
      setProgress(100);
    }
  }, [file, selectedModel]);

  const handleViewHistoryItem = (id: string) => {
    const item = history.find(h => h.id === id);
    if (item) {
      setResults(item);
      setCurrentView('results');
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'history':
        return <HistoryDisplay history={history} onView={handleViewHistoryItem} />;
      case 'about':
        return <About />;
      case 'results':
        return results && !isLoading ? <ResultsDisplay results={results} onReset={handleReset} fileName={results.fileName || 'result'} /> : <p>No results to display.</p>;
      case 'upload':
      default:
        return (
          <Home
            file={file}
            onFileChange={handleFileChange}
            onClassify={handleClassify}
            isLoading={isLoading}
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
            error={error}
            progress={progress}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-text-primary">
      <Header currentView={currentView} setView={setCurrentView} hasResults={!!results} />
      <main className={`flex-grow container mx-auto px-4 py-8 flex flex-col items-center justify-center ${currentView === 'upload' ? 'bg-transparent' : 'bg-gray-50'}`}>
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
};

export default App;
