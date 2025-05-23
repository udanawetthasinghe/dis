import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import ResponsiveChartWrapper from './ResponsiveChartWrapper';

const DistrictComparisonChart=({chartData})=> {
  const svgRef = useRef();
  const tooltipRef = useRef();

  useEffect(() => {
    d3.select(svgRef.current).selectAll('*').remove();

    const { title, xAxisLabel, yAxisLabel, years, data }=chartData;


    const internalWidth = 1000;
    const internalHeight = 600;
    const margin = { top: 80, right: 0, bottom: 100, left: 65 };
    const innerWidth = internalWidth - margin.left - margin.right;
    const innerHeight = internalHeight - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
    .append('svg')
    .attr('viewBox', `0 0 ${internalWidth} ${internalHeight}`)
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .style('width', '100%')
    .style('height', 'auto');



    svg.append('text')
      .attr('x', internalWidth/2).attr('y', (margin.top-10)/2)
      .attr('text-anchor','middle').style('font-size','16px')
      .text(title);



    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const districts = data.map(d => d.district);
    const keys = years.map(y => `year${y}`);

    const x0 = d3.scaleBand().domain(districts).range([0, innerWidth]).padding(0.2);
    const x1 = d3.scaleBand().domain(keys).range([0, x0.bandwidth()]).padding(0.05);
    const y = d3.scaleLinear().domain([0, d3.max(data, d => Math.max(...keys.map(k => d[k] || 0)))]).nice().range([innerHeight, 0]);

    const color = d3.scaleOrdinal().domain(keys).range(d3.schemeCategory10);

    const tooltip = d3.select(tooltipRef.current)
      .style('position','fixed').style('opacity',0).style('background','white').style('padding','4px').style('border','1px solid #ccc');

    g.selectAll('g')
      .data(data)
      .enter().append('g')
      .attr('transform', d => `translate(${x0(d.district)},0)`)
      .selectAll('rect')
      .data(d => keys.map(k => ({ key: k, value: d[k] || 0, district: d.district })))
      .enter().append('rect')
        .attr('x', d => x1(d.key)).attr('y', d => y(d.value))
        .attr('width', x1.bandwidth()).attr('height', d => innerHeight - y(d.value))
        .attr('fill', d => color(d.key))
        .on('mouseover',(e,d)=> {
          tooltip.html(`${d.key.replace('year','')}<br/>${d.district}: ${d.value}`)
            .style('left', `${e.clientX+10}px`).style('top', `${e.clientY+10}px`).style('opacity',1);
        })
        .on('mousemove', e => tooltip.style('left', `${e.clientX+10}px`).style('top', `${e.clientY+10}px`))
        .on('mouseout', () => tooltip.style('opacity',0));

    g.append('g').attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x0)).selectAll('text').attr('transform','rotate(-45)').style('text-anchor','end');
    g.append('g').call(d3.axisLeft(y));

    // Legend

    svg.append('text').attr('x',internalWidth/2).attr('y',internalHeight-10)
      .attr('text-anchor','middle').style('font-size','12px').text(xAxisLabel);

    svg.append('text').attr('transform','rotate(-90)')
      .attr('x', -internalHeight/2).attr('y',20)
      .attr('text-anchor','middle').style('font-size','12px').text(yAxisLabel);

    const legendY = margin.top-10;
    const legendX = (internalWidth / 2) - ((Object.keys(years).length * 100) / 2);
        const legend = svg.append('g').attr('transform', `translate(${legendX},${legendY})`);
    keys.forEach((key,i) => {
      legend.append('rect').attr('x', i*100).attr('width',12).attr('height',12).attr('fill', color(key));
      legend.append('text').attr('x', i*100+18).attr('y',12).text('Year'+key.replace('year',''));
    });

  }, [chartData]);

  return (
    <ResponsiveChartWrapper>
      <div ref={tooltipRef}></div>
      <div ref={svgRef} />
    </ResponsiveChartWrapper>
  );
}

export default DistrictComparisonChart;