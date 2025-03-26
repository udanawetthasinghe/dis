import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const MultiLineChart = ({ chartData, width, height }) => {
  const containerRef = useRef();
  const tooltipRef = useRef(); // NEW tooltip ref

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

    // Create tooltip div (fixed positioned)
    let tooltip = d3.select(tooltipRef.current)
      .style('position', 'fixed')
      .style('padding', '4px 8px')
      .style('background', 'rgba(255, 255, 255, 0.9)')
      .style('color', '#000')
      .style('border-radius', '4px')
      .style('pointer-events', 'none')
      .style('opacity', 0);

    // X domain
    const xDomain = data.map(d => `${d.year}-${d.week}`);
    const xScale = d3.scaleBand()
      .domain(xDomain)
      .range([0, innerWidth])
      .padding(0.1);

    // Y domain
    const allValues = data.flatMap(d => [d.data1, d.data2]); // adapt if more series
    const yMax = d3.max(allValues);
    const yScale = d3.scaleLinear()
      .domain([0, yMax])
      .range([innerHeight, 0]);

    // Define series (customize as needed)
    const series = [
      { key: 'data1', color: 'steelblue' },
      { key: 'data2', color: 'orange' }
    ];

    // Line generator
    const lineGenerator = d3.line()
      .x(d => xScale(`${d.year}-${d.week}`) + xScale.bandwidth() / 2)
      .y(d => yScale(d.value))
      .curve(d3.curveMonotoneX);

    // Draw lines and circles for each series
    series.forEach(s => {
      const seriesData = data.map(d => ({
        year: d.year,
        week: d.week,
        value: d[s.key]
      }));

      // Draw line
      g.append('path')
        .datum(seriesData)
        .attr('fill', 'none')
        .attr('stroke', s.color)
        .attr('stroke-width', 2)
        .attr('d', lineGenerator);

      // Draw circles with tooltip handlers
      g.selectAll(`.circle-${s.key}`)
        .data(seriesData)
        .enter()
        .append('circle')
        .attr('class', `circle-${s.key}`)
        .attr('cx', d => xScale(`${d.year}-${d.week}`) + xScale.bandwidth() / 2)
        .attr('cy', d => yScale(d.value))
        .attr('r', 4)
        .attr('fill', s.color)
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
    });
        // X Axis, skipping ticks
        // e.g. show every 5th label
    // Compute tick interval so we show ~40 labels max
const tickInterval = Math.max(1, Math.round(xDomain.length / 40));



  // Filter every nth label
const filteredDomain = xDomain.filter((_, i) => i % tickInterval === 0);
const xAxis = d3.axisBottom(xScale).tickValues(filteredDomain);

    // Axes
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis)
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

    // Basic Legend (if provided)
    const legendKeys = Object.entries(legend);
    const legendGroup = svg.append('g')
      .attr('transform', `translate(${width - 150}, ${margin.top})`);

    legendKeys.forEach(([key, label], i) => {
      const color = key === 'data1' ? 'steelblue' : 'orange';
      const yPos = i * 20;
      legendGroup.append('rect')
        .attr('x', 0)
        .attr('y', yPos)
        .attr('width', 10)
        .attr('height', 10)
        .attr('fill', color);
      legendGroup.append('text')
        .attr('x', 20)
        .attr('y', yPos + 10)
        .style('font-size', '12px')
        .text(label);
    });
  }, [chartData, width, height]);

  return (
    <div style={{ position: 'relative' }}>
      {/* Tooltip container */}
      <div ref={tooltipRef}></div>
      <div ref={containerRef} />
    </div>
  );
};

export default MultiLineChart;
