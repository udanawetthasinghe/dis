import React, { useState, useEffect, useMemo } from 'react';
import { useGetYearsQuery, useGetWeeklyByYearQuery } from '../../slices/weeklyDngDataApiSlice';
import { skipToken } from '@reduxjs/toolkit/query';
import MultiLineChart from './ThreeLineChart';

export default function WeeklyComparisonChart({ width = 600, height = 400 }) {
  const { data: years = [] } = useGetYearsQuery();
  const [year1, setYear1] = useState();
  const [year2, setYear2] = useState();
  const [year3, setYear3] = useState();
  const [district, setDistrict] = useState('All Island');

  // Default to the latest three years
  useEffect(() => {
    if (years.length >= 3 && !year1 && !year2 && !year3) {
      setYear1(years[0]);
      setYear2(years[1]);
      setYear3(years[2]);
    }
  }, [years, year1, year2, year3]);

  const { data: data1 = [] } = useGetWeeklyByYearQuery(year1 ?? skipToken);
  const { data: data2 = [] } = useGetWeeklyByYearQuery(year2 ?? skipToken);
  const { data: data3 = [] } = useGetWeeklyByYearQuery(year3 ?? skipToken);

  const districts = useMemo(() => {
    const setIds = new Set(['All Island']);
    [data1, data2, data3].forEach(arr => arr.forEach(r => setIds.add(r.districtId)));
    return Array.from(setIds);
  }, [data1, data2, data3]);

  const combinedData = useMemo(() => {
    const weeks = Array.from({ length: 52 }, (_, i) => i + 1);
    return weeks.map(week => ({
      week,
      [`year${year1}`]: data1.filter(d => d.week === week && (district === 'All Island' || d.districtId === district)).reduce((sum, r) => sum + r.dengueCases, 0),
      [`year${year2}`]: data2.filter(d => d.week === week && (district === 'All Island' || d.districtId === district)).reduce((sum, r) => sum + r.dengueCases, 0),
      [`year${year3}`]: data3.filter(d => d.week === week && (district === 'All Island' || d.districtId === district)).reduce((sum, r) => sum + r.dengueCases, 0),
    }));
  }, [year1, data1, year2, data2, year3, data3, district]);

  const legend = {
    [`year${year1}`]: String(year1),
    [`year${year2}`]: String(year2),
    [`year${year3}`]: String(year3),
  };

  const chartData = {
    title: 'Weekly Dengue Cases Comparison',
    xAxisLabel: 'Week',
    yAxisLabel: 'Cases',
    legend,
    data: combinedData,
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Weekly Comparison</h2>

      <div className="flex gap-2 mb-4">
        <select value={district} onChange={e => setDistrict(e.target.value)} className="border p-2 rounded w-40">
          {districts.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        {[ [year1, setYear1], [year2, setYear2], [year3, setYear3] ].map(([yr, setter], idx) => (
          <select
            key={idx}
            value={yr || ''}
            onChange={e => setter(e.target.value ? Number(e.target.value) : undefined)}
            className="border p-2 rounded w-24"
          >
            <option value="">Year</option>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        ))}
      </div>

      <MultiLineChart chartData={chartData} width={width} height={height} />
    </div>
  );
}
