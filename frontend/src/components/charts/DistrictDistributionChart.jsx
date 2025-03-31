import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { districts } from '../../config/config';
import ResponsiveChartWrapper from './ResponsiveChartWrapper';

export default function DistrictDistributionChart({ data, width, height }) {
  const svgRef = useRef();
  const tooltipRef = useRef();

  useEffect(() => {
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .style('width', '100%')
    .style('height', 'auto');
  

    const radius = Math.min(width, height) / 2 - 50;
    const g = svg.append('g')
      .attr('transform', `translate(${width/2},${height/2})`);

    const pie = d3.pie().value(d => d.cases)(data);
    const arc = d3.arc().innerRadius(0).outerRadius(radius);
    const labelArc = d3.arc().innerRadius(radius * 0.6).outerRadius(radius * 0.6);
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const tooltip = d3.select(tooltipRef.current)
      .style('position','fixed').style('opacity',0)
      .style('background','white').style('padding','6px').style('border','1px solid #ccc');

    g.selectAll('path')
      .data(pie)
      .enter().append('path')
      .attr('d', arc)
      .attr('fill', d => color(d.data.district))
      .on('mouseover',(e,d)=>{
        tooltip.html(`${districts[d.data.district]}<br/>${((d.data.cases / d3.sum(data, d=>d.cases))*100).toFixed(1)}%`)
          .style('left',`${e.clientX+10}px`).style('top',`${e.clientY+10}px`).style('opacity',1);
      })
      .on('mousemove', e => tooltip.style('left',`${e.clientX+10}px`).style('top',`${e.clientY+10}px`))
      .on('mouseout',()=>tooltip.style('opacity',0));

// Compute total & percentages, sort ascending
const totalCases = d3.sum(data, d => d.cases);
const sorted = pie
  .map(d => ({ district: d.data.district, pct: (d.data.cases / totalCases) * 100 }))
  .sort((a, b) => b.pct - a.pct);

// Position legend at right edge, 20px down
const legendX = width - 130;
const legendY = 20;

const legendGroup = svg.append('g')
  .attr('transform', `translate(${legendX}, ${legendY})`);

sorted.forEach((d, i) => {
  const yOffset = i * 20;
  legendGroup.append('rect')
    .attr('x', 0)
    .attr('y', yOffset)
    .attr('width', 12)
    .attr('height', 12)
    .attr('fill', color(d.district));

  legendGroup.append('text')
    .attr('x',16)
    .attr('y', yOffset + 10)
    .style('font-size', '11px')
    .text(`${districts[d.district]} — ${d.pct.toFixed(1)}%`);
});


    g.selectAll('text')
      .data(pie)
      .enter().append('text')
      .attr('transform', d => `translate(${labelArc.centroid(d)})`)
      .attr('text-anchor','middle')
      .style('font-size','17px')
      .style('font-weight', 'bold')  
      .text(d => {
        const pct = (d.data.cases / totalCases) * 100;
        return pct > 5 ? `${pct.toFixed(0)}%` : '';
      });  }, [data]);

  return (
    <ResponsiveChartWrapper maxWidth="800px">
      <div ref={tooltipRef}></div>
      <div ref={svgRef} />
    </ResponsiveChartWrapper>

  );
}
