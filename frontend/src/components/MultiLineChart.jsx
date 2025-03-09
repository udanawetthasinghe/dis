import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const MultiLineChart = ({ chartData, width, height }) => {
  const containerRef = useRef();

  useEffect(() => {
    d3.select(containerRef.current).selectAll('*').remove();

    const { title, xAxisLabel, yAxisLabel, legend = {}, data } = chartData;

    const margin = { top: 50, right: 20, bottom: 60, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(containerRef.current)
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

    // X domain
    const xDomain = data.map(d => `${d.year}-${d.week}`);
    const xScale = d3.scaleBand()
      .domain(xDomain)
      .range([0, innerWidth])
      .padding(0.1);

    // Y domain
    const allValues = data.flatMap(d => [d.data1, d.data2]); // adapt for more series
    const yMax = d3.max(allValues);
    const yScale = d3.scaleLinear()
      .domain([0, yMax])
      .range([innerHeight, 0]);

    // Lines data
    const series = [
      { key: 'data1', color: 'steelblue' },
      { key: 'data2', color: 'orange' }
    ];

    const lineGenerator = d3.line()
      .x(d => xScale(`${d.year}-${d.week}`) + xScale.bandwidth() / 2)
      .y(d => yScale(d.value));

    // Draw lines
    series.forEach(s => {
      const seriesData = data.map(d => ({ year: d.year, week: d.week, value: d[s.key] }));
      g.append('path')
        .datum(seriesData)
        .attr('fill', 'none')
        .attr('stroke', s.color)
        .attr('stroke-width', 2)
        .attr('d', lineGenerator);
    });

    // Axes
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end');

    g.append('g').call(d3.axisLeft(yScale));

    // X Axis Label
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height - 10)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .text(xAxisLabel || '');

    // Y Axis Label
    svg.append('text')
      .attr('transform', `rotate(-90)`)
      .attr('x', -height / 2)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .text(yAxisLabel || '');

    // Basic Legend
    // legend = { data1: 'Expected Cases', data2: 'Real Cases' }
    const legendKeys = Object.entries(legend);
    const legendGroup = svg.append('g')
      .attr('transform', `translate(${width - 150}, ${margin.top})`);

    legendKeys.forEach(([key, label], i) => {
      const color = key === 'data1' ? 'steelblue' : 'orange';
      const yPos = i * 20;
      // color box
      legendGroup.append('rect')
        .attr('x', 0)
        .attr('y', yPos)
        .attr('width', 10)
        .attr('height', 10)
        .attr('fill', color);
      // text
      legendGroup.append('text')
        .attr('x', 20)
        .attr('y', yPos + 10)
        .style('font-size', '12px')
        .text(label);
    });

  }, [chartData, width, height]);

  return <div ref={containerRef} />;
};

export default MultiLineChart;
