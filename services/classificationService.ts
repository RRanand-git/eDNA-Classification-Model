import type { ClassificationResult, SequenceResult, TaxonomyNode, SpeciesRichness, DiversityIndices } from '../types';

// Helper to build a tree from taxonomy strings
const buildTaxonomyTree = (results: SequenceResult[]): TaxonomyNode[] => {
    const root: { [key: string]: TaxonomyNode } = {};

    results.forEach(result => {
        if (result.predictedTaxonomy === 'Unclassified') return;

        const path = result.predictedTaxonomy.split('; ');
        let currentNode = root;

        path.forEach((part, index) => {
            if (!currentNode[part]) {
                currentNode[part] = { name: part, value: 0 };
                if (index < path.length - 1) {
                    currentNode[part].children = [];
                }
            }
            
            // A bit of a hack to make the nested children structure work for the treemap library
            const childrenAsDict = currentNode[part].children?.reduce((acc, child) => {
                acc[child.name] = child;
                return acc;
            }, {} as {[key: string]: TaxonomyNode}) || {};

            if (index < path.length - 1) {
                 currentNode = childrenAsDict;
            } else {
                currentNode[part].value++;
            }
        });
    });

    // Convert the dictionary back to an array
    const tree: TaxonomyNode[] = [];
    Object.keys(root).forEach(key => {
        const node = root[key];
        const children = node.children ? Object.values(node.children as any) as TaxonomyNode[] : undefined;

        const totalValue = (children ? children.reduce((sum, child) => sum + child.value, 0) : 0) + node.value;
        
        tree.push({
            name: key,
            value: totalValue,
            children: children
        });
    });

    // Assign value to parent nodes based on sum of children
     const assignParentValues = (nodes: TaxonomyNode[]) => {
        nodes.forEach(node => {
            if (node.children) {
                assignParentValues(node.children);
                node.value = node.children.reduce((sum, child) => sum + child.value, 0);
            }
        });
    };
    assignParentValues(tree);


    return tree;
};


// Mock data generator
const generateMockResults = (file: File): ClassificationResult => {
  const totalSequences = Math.floor(Math.random() * 200) + 50;
  const detailedResults: SequenceResult[] = [];
  
  const speciesList = ['Lactobacillus', 'Bifidobacterium', 'E. coli', 'S. aureus', 'C. difficile', 'P. aeruginosa'];
  const speciesCounts: { [key: string]: number } = {};

  for (let i = 0; i < totalSequences; i++) {
    const isNovel = Math.random() < 0.15;
    const confidence = isNovel ? Math.random() * 0.4 + 0.3 : Math.random() * 0.2 + 0.8;
    
    let taxonomy = 'Unclassified';
    let species = 'Unknown';

    const randTax = Math.random();
    if (randTax > 0.95) {
        taxonomy = 'Unclassified';
    } else if (randTax > 0.9) {
        taxonomy = 'Viruses; Phage';
        species = 'Bacteriophage T4';
    } else if (randTax > 0.7) {
        taxonomy = 'Eukaryota; Fungi';
        species = 'Saccharomyces cerevisiae';
    } else if (randTax > 0.6) {
        taxonomy = 'Archaea; Euryarchaeota';
        species = 'Methanobrevibacter smithii';
    } else {
        taxonomy = 'Bacteria; Firmicutes';
        species = speciesList[Math.floor(Math.random() * speciesList.length)];
    }
    
    let finalTaxonomy = 'Unclassified';
    if (confidence > 0.5) {
        finalTaxonomy = `${taxonomy}; ${species}`;
        speciesCounts[species] = (speciesCounts[species] || 0) + 1;
    }

    detailedResults.push({
      id: `SEQ_${i + 1}`,
      predictedTaxonomy: finalTaxonomy,
      confidence: parseFloat(confidence.toFixed(2)),
      noveltyScore: parseFloat(Math.random().toFixed(2)),
      isNovel: isNovel,
    });
  }

  const classified = detailedResults.filter(r => r.confidence > 0.5).length;
  const novel = detailedResults.filter(r => r.isNovel).length;

  const taxonomyTree = buildTaxonomyTree(detailedResults.filter(r => r.confidence > 0.5));
  
  const speciesRichness: SpeciesRichness[] = Object.entries(speciesCounts).map(([species, abundance]) => ({
    species,
    abundance,
    relativeAbundance: ((abundance / classified) * 100).toFixed(2) + '%',
  })).sort((a,b) => b.abundance - a.abundance);
  
  let shannonIndex = 0;
  if (classified > 0) {
    Object.values(speciesCounts).forEach(count => {
        const p = count / classified;
        if (p > 0) {
            shannonIndex -= p * Math.log(p);
        }
    });
  }


  const diversityIndices: DiversityIndices = {
    shannonIndex: parseFloat(shannonIndex.toFixed(3)),
    totalSpecies: Object.keys(speciesCounts).length,
  };

  return {
    summary: {
      totalSequences,
      classified,
      novel,
    },
    taxonomyTree,
    noveltySummary: {
      known: totalSequences - novel,
      novel,
    },
    detailedResults,
    speciesRichness,
    diversityIndices,
  };
};


export const runClassification = (file: File, setProgress: (progress: number) => void): Promise<ClassificationResult> => {
  return new Promise((resolve, reject) => {
    const totalDuration = Math.random() * 2000 + 3000; // 3-5 seconds
    let progress = 0;
    
    const interval = setInterval(() => {
      progress += 1;
      setProgress(Math.min(progress, 99)); 
      
      if(progress >= 100) {
        clearInterval(interval);
        const results = generateMockResults(file);
        setProgress(100);
        resolve(results);
      }
    }, totalDuration / 100);

    // Safety timeout
    setTimeout(() => {
        clearInterval(interval);
        reject(new Error("Processing timed out."));
    }, totalDuration + 2000);
  });
};