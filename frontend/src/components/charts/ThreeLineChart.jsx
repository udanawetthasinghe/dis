import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const ThreeLineChart=({ chartData, width, height }) => {
  const containerRef = useRef();
  const tooltipRef = useRef();

  useEffect(() => {
    d3.select(containerRef.current).selectAll('*').remove();

    const { title, xAxisLabel, yAxisLabel, legend = {}, data } = chartData;
    const margin = { top: 50, right: 20, bottom: 60, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(containerRef.current)
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .style('width', '100%')
    .style('height', 'auto');


    
    svg.append('text')
      .attr('x', width/2).attr('y', (margin.top-10)/2)
      .attr('text-anchor','middle').style('font-size','16px')
      .text(title);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleBand()
      .domain(data.map(d => d.week))
      .range([0, innerWidth])
      .padding(0.1);

    const allValues = data.flatMap(d => Object.keys(legend).map(k => d[k]));
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(allValues)])
      .range([innerHeight, 0]);

    const series = Object.entries(legend).map(([key,label],i) => ({
      key,
      label,
      color: d3.schemeCategory10[i]
    }));

    const line = d3.line()
      .defined(d => !isNaN(d.value))
      .x(d => xScale(d.week) + xScale.bandwidth()/2)
      .y(d => yScale(d.value))
      .curve(d3.curveMonotoneX);

    // Tooltip
    const tooltip = d3.select(tooltipRef.current)
      .style('position','fixed').style('opacity',0)
      .style('background','rgba(255,255,255,0.9)').style('padding','6px')
      .style('border-radius','4px');

    series.forEach(s => {
      const seriesData = data.map(d => ({ week: d.week, value: d[s.key] }));

      g.append('path')
        .datum(seriesData)
        .attr('fill','none')
        .attr('stroke', s.color)
        .attr('stroke-width', 2)
        .attr('d', line);

      g.selectAll(`circle-${s.key}`)
        .data(seriesData)
        .enter()
        .append('circle')
        .attr('cx', d => xScale(d.week) + xScale.bandwidth()/2)
        .attr('cy', d => yScale(d.value))
        .attr('r', 4)
        .attr('fill', s.color)
        .on('mouseover', (e,d) => {
          tooltip.html(`${s.label}<br/>Week: ${d.week}<br/>${yAxisLabel}: ${d.value}`)
            .style('left', `${e.clientX+10}px`).style('top', `${e.clientY+10}px`)
            .style('opacity',1);
        })
        .on('mousemove', e => tooltip.style('left', `${e.clientX+10}px`).style('top', `${e.clientY+10}px`))
        .on('mouseout', () => tooltip.style('opacity',0));
    });

    const tickInterval = Math.max(1, Math.round(data.length/40));
    const xAxis = d3.axisBottom(xScale).tickValues(data.map(d=>d.week).filter((_,i)=>i%tickInterval===0));

    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis).selectAll('text')
      .attr('transform','rotate(-45)').style('text-anchor','end');

    g.append('g').call(d3.axisLeft(yScale));

    svg.append('text').attr('x',width/2).attr('y',height-10)
      .attr('text-anchor','middle').style('font-size','12px').text(xAxisLabel);

    svg.append('text').attr('transform','rotate(-90)')
      .attr('x', -height/2).attr('y',20)
      .attr('text-anchor','middle').style('font-size','12px').text(yAxisLabel);

    // Legenddistrict
    const legendY = margin.top-10;
const legendX = (width / 2) - ((Object.keys(legend).length * 100) / 2);
    const legendGroup = svg.append('g').attr('transform', `translate(${legendX},${legendY})`);
    series.forEach((s,i) => {
        const xOffset = i * 100; // spacing between items

      legendGroup.append('rect').attr('x', xOffset)
      .attr('y', 0)
      .attr('width', 12)
      .attr('height', 12).attr('fill', s.color);
      legendGroup.append('text') .attr('x', xOffset + 18)
      .attr('y', 10)
      .style('font-size', '12px').text(s.label);
    });

  }, [chartData, width, height]);

  return (
    <div style={{ width: '100%', position:'relative'}}>
      <div ref={tooltipRef}></div>
      <div ref={containerRef} />
    </div>
  );
}
export default ThreeLineChart;