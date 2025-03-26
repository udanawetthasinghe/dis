import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const ScatterD3 = ({ chartData, width, height }) => {
  const svgRef = useRef();
  const tooltipRef = useRef(); // NEW tooltip ref

  useEffect(() => {
    d3.select(svgRef.current).selectAll('*').remove();

    const { title, xAxisLabel, yAxisLabel, categoryKey = 'riskLevel', categoryColors = {}, data = [] } = chartData;
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

    // Create tooltip div (fixed positioned)
    let tooltip = d3.select(tooltipRef.current)
      .style('position', 'fixed')
      .style('padding', '4px 8px')
      .style('background', 'rgba(255, 255, 255, 0.9)')
      .style('color', '#000')
      .style('border-radius', '4px')
      .style('pointer-events', 'none')
      .style('opacity', 0);

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

    // Scatter points with tooltip event handlers
    g.selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', d => xScale(`${d.year}-${d.week}`) + xScale.bandwidth() / 2)
      .attr('cy', d => yScale(d.data1))
      .attr('r', 5)
      .attr('fill', d => categoryColors[d[categoryKey]] || 'gray')
      .on('mouseover', (event, d) => {
        tooltip
          .style('opacity', 1)
          .html(`Week: <strong>${d.year}-${d.week}</strong><br/>${yAxisLabel}: <strong>${d.data1}</strong><br/>${categoryKey}: <strong>${d[categoryKey]}</strong>`)
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

    // X axis

    // Compute tick interval so we show ~40 labels max
const tickInterval = Math.max(1, Math.round(xDomain.length / 40));



  // Filter every nth label
const filteredDomain = xDomain.filter((_, i) => i % tickInterval === 0);
const xAxis = d3.axisBottom(xScale).tickValues(filteredDomain);

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

  return (
    <div style={{ position: 'relative' }}>
      {/* Tooltip container */}
      <div ref={tooltipRef}></div>
      <div ref={svgRef} />
    </div>
  );
};

export default ScatterD3;
