import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const SingleLineD3 = ({ chartData, width, height }) => {
  const svgRef = useRef(null);
  const tooltipRef = useRef(null);

  useEffect(() => {
    if (!chartData) return;
    const { title, xAxisLabel, yAxisLabel, data } = chartData;

    // Clear old content
    d3.select(svgRef.current).selectAll('*').remove();

    // Create a tooltip div (absolute positioned)
    let tooltip = d3.select(tooltipRef.current)
    .style('position', 'fixed')
    .style('padding', '4px 8px')
    .style('background', 'rgba(255, 255, 255, 0.9)')
    .style('color', '#000')
    .style('border-radius', '4px')
    .style('pointer-events', 'none')
    .style('opacity', 0);
  
    // Margins
    const margin = { top: 50, right: 20, bottom: 70, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create SVG
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

    // X domain (e.g., "2018-1", "2018-2", etc.)
    const xDomain = data.map(d => `${d.year}-${d.week}`);
    const xScale = d3.scaleBand()
      .domain(xDomain)
      .range([0, innerWidth])
      .padding(0.1);

    // Y domain
    const yMax = d3.max(data, d => d.value);
    const yScale = d3.scaleLinear()
      .domain([0, yMax])
      .range([innerHeight, 0]);

    // Create line generator
    const lineGenerator = d3.line()
      .x(d => xScale(`${d.year}-${d.week}`) + xScale.bandwidth() / 2)
      .y(d => yScale(d.value))
      .curve(d3.curveMonotoneX);

    // Draw the line
    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 2)
      .attr('d', lineGenerator);

    // RIGHT AFTER you append circles (replace your existing .on(...) chain with this)

const containerRect = svgRef.current.getBoundingClientRect();

// Add circles for each data point + improved tooltip
g.selectAll('.data-circle')
  .data(data)
  .enter()
  .append('circle')
  .attr('class', 'data-circle')
  .attr('cx', d => xScale(`${d.year}-${d.week}`) + xScale.bandwidth() / 2)
  .attr('cy', d => yScale(d.value))
  .attr('r', 4)
  .attr('fill', 'steelblue')
  .on('mouseover', (event, d) => {
    tooltip
      .style('opacity', 1)
      .html(`Week: <strong>${d.year}-${d.week}</strong><br/>${yAxisLabel}: <strong>${d.value}</strong>`)
      .style('left', `${event.clientX + 10}px`)
      .style('top', `${event.clientY + 10}px`);
  })
  .on('mousemove', (event) => {
    tooltip
      .style('left', `${event.clientX + 10}px`)
      .style('top', `${event.clientY + 10}px`);
  })
  .on('mouseout', () => {
    tooltip.style('opacity', 0);
  });

    // X Axis, skipping ticks
    // e.g. show every 5th label
    // Compute tick interval so we show ~40 labels max
const tickInterval = Math.max(1, Math.round(xDomain.length / 40));



  // Filter every nth label
const filteredDomain = xDomain.filter((_, i) => i % tickInterval === 0);
const xAxis = d3.axisBottom(xScale).tickValues(filteredDomain);

    g.append('g')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(xAxis)
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end');

    // Y Axis
    const yAxis = d3.axisLeft(yScale);
    g.append('g').call(yAxis);

    // X Axis Label
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height - 20)
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
  }, [chartData, width, height]);

  return (
    <div style={{ position: 'relative' }}>
      {/* This div will be used as a tooltip container */}
      <div ref={tooltipRef}></div>
      <div ref={svgRef} />
    </div>
  );
};

export default SingleLineD3;
