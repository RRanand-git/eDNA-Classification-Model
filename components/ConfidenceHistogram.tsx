import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { SequenceResult } from '../types';

interface ConfidenceHistogramProps {
  data: SequenceResult[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-200 rounded shadow-lg">
        <p className="font-semibold">{`Confidence: ${label}`}</p>
        <p>Sequence Count: <span className="font-bold">{payload[0].value}</span></p>
      </div>
    );
  }
  return null;
};

const ConfidenceHistogram: React.FC<ConfidenceHistogramProps> = ({ data }) => {
  const histogramData = useMemo(() => {
    const bins = Array(10).fill(0).map((_, i) => ({
      name: `${(i * 0.1).toFixed(1)}-${((i + 1) * 0.1).toFixed(1)}`,
      count: 0,
    }));

    data.forEach(item => {
      const binIndex = Math.floor(item.confidence * 10);
      if (binIndex >= 0 && binIndex < 10) {
        bins[binIndex].count++;
      } else if (item.confidence === 1.0) { // Handle case where confidence is exactly 1.0
        bins[9].count++;
      }
    });

    return bins;
  }, [data]);

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart
          data={histogramData}
          margin={{
            top: 20, right: 30, left: 20, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="count" name="Number of Sequences" fill="#3498db" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ConfidenceHistogram;
