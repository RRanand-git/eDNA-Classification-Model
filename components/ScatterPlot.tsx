import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ZAxis } from 'recharts';
import type { SequenceResult } from '../types';

interface ScatterPlotProps {
  data: SequenceResult[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-2 border border-gray-200 rounded shadow-lg text-sm">
        <p className="font-bold">{data.id}</p>
        <p>Confidence: <span className="font-semibold">{data.confidence.toFixed(2)}</span></p>
        <p>Novelty Score: <span className="font-semibold">{data.noveltyScore.toFixed(2)}</span></p>
        <p>Status: <span className={`font-semibold ${data.isNovel ? 'text-red-600' : 'text-green-600'}`}>{data.isNovel ? 'Novel' : 'Known'}</span></p>
      </div>
    );
  }
  return null;
};

const ScatterPlot: React.FC<ScatterPlotProps> = ({ data }) => {
    
  const knownData = data.filter(d => !d.isNovel);
  const novelData = data.filter(d => d.isNovel);

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <ScatterChart
          margin={{
            top: 20, right: 20, bottom: 20, left: 20,
          }}
        >
          <CartesianGrid />
          <XAxis type="number" dataKey="noveltyScore" name="Novelty Score" unit="" domain={[0, 1]} />
          <YAxis type="number" dataKey="confidence" name="Confidence" unit="" domain={[0, 1]} />
          <ZAxis type="category" dataKey="id" name="Sequence ID" />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />}/>
          <Legend />
          <Scatter name="Known" data={knownData} fill="#2ecc71" shape="circle" />
          <Scatter name="Novel" data={novelData} fill="#e74c3c" shape="cross" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ScatterPlot;