export interface SequenceResult {
  id: string;
  predictedTaxonomy: string;
  confidence: number;
  noveltyScore: number;
  isNovel: boolean;
}

export interface TaxonomyNode {
  name: string;
  value: number;
  children?: TaxonomyNode[];
}

export interface NoveltySummary {
  known: number;
  novel: number;
}

export interface SpeciesRichness {
  species: string;
  abundance: number;
  relativeAbundance: string; // percentage string
}

export interface DiversityIndices {
  shannonIndex: number;
  totalSpecies: number;
}

export interface ClassificationResult {
  summary: {
    totalSequences: number;
    classified: number;
    novel: number;
  };
  taxonomyTree: TaxonomyNode[];
  noveltySummary: NoveltySummary;
  detailedResults: SequenceResult[];
  speciesRichness: SpeciesRichness[];
  diversityIndices: DiversityIndices;
  // Added fileName to base type for convenience when re-displaying from history
  fileName?: string; 
}

export interface HistoryEntry extends ClassificationResult {
  id: string;
  fileName: string;
  timestamp: number;
  duration: number; // in milliseconds
  modelUsed: string;
}