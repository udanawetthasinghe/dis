import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const ScatterD3 = ({ chartData, width, height }) => {
  const svgRef = useRef();

  useEffect(() => {
    d3.select(svgRef.current).selectAll('*').remove();

    const { title, xAxisLabel, yAxisLabel, categoryKey = 'riskLevel', categoryColors = {}, data = [] } = chartData;

    // For demonstration, let's keep a scaleBand for the x-axis
    // If you prefer a time scale, convert (year, week) to a date
    const margin = { top: 50, right: 20, bottom: 70, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    // Title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', margin.top / 2)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .text(title || '');

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // X scale
    const xDomain = data.map(d => `${d.year}-${d.week}`);
    const xScale = d3.scaleBand()
      .domain(xDomain)
      .range([0, innerWidth])
      .padding(0.1);

    // Y scale
    const yMax = d3.max(data, d => d.data1);
    const yScale = d3.scaleLinear()
      .domain([0, yMax])
      .range([innerHeight, 0]);

    // Scatter points
    g.selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', d => xScale(`${d.year}-${d.week}`) + xScale.bandwidth() / 2)
      .attr('cy', d => yScale(d.data1))
      .attr('r', 5)
      .attr('fill', d => categoryColors[d[categoryKey]] || 'gray');

    // X axis
    const xAxis = d3.axisBottom(xScale);

    // Optionally skip some ticks if domain is large
    const filteredDomain = xDomain.filter((_, i) => i % 5 === 0); // every 5th
    xAxis.tickValues(filteredDomain);

    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis)
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end');

    // Y axis
    const yAxis = d3.axisLeft(yScale);
    g.append('g').call(yAxis);

    // X axis label
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height - 20)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .text(xAxisLabel || '');

    // Y axis label
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .text(yAxisLabel || '');

    // Legend
    const legendEntries = Object.entries(categoryColors);
    const legendGroup = svg.append('g')
      .attr('transform', `translate(${width - 150}, ${margin.top})`);

    legendEntries.forEach(([catValue, catColor], i) => {
      const yPos = i * 20;
      legendGroup.append('rect')
        .attr('x', 0)
        .attr('y', yPos)
        .attr('width', 10)
        .attr('height', 10)
        .attr('fill', catColor);
      legendGroup.append('text')
        .attr('x', 20)
        .attr('y', yPos + 10)
        .style('font-size', '12px')
        .text(catValue);
    });

  }, [chartData, width, height]);

  return <div ref={svgRef} />;
};

export default ScatterD3;
