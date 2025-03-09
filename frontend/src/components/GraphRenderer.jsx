import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import SingleLineChart from './SingleLineChart';
import MultiLineChart from './MultiLineChart';
import CategoricalScatterChart from './CategoricalScatterChart';

const GraphRenderer = ({ graphType, apiRoute, width = 600, height = 300 }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(apiRoute);
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        const jsonData = await res.json();
        setChartData(jsonData); // Store the entire JSON object
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchData();
  }, [apiRoute]);

  if (loading) return <p>Loading chart data...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!chartData) return <p>No data available</p>;

  // Pass the entire chartData object to the sub-component
  switch (graphType) {
    case 'SingleLine':
      return <SingleLineChart chartData={chartData} width={width} height={height} />;
    case 'MultiLine':
      return <MultiLineChart chartData={chartData} width={width} height={height} />;
    case 'CategoricalScatter':
      return <CategoricalScatterChart chartData={chartData} width={width} height={height} />;
    default:
      return <p>Unsupported graph type: {graphType}</p>;
  }
};

export default GraphRenderer;
