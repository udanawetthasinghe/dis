import React, { useState, useEffect, useMemo } from 'react';
import { useGetYearsQuery, useGetWeeklyByYearQuery } from '../../slices/weeklyDngDataApiSlice';
import { skipToken } from '@reduxjs/toolkit/query';
import DistrictDistributionChart from '../charts/DistrictDistributionChart';
import { districts } from '../../config/config';

const DistrictDistributionContainer = () => {
  const { data: years = [] } = useGetYearsQuery();
  const [year, setYear] = useState();

  useEffect(() => {
    if (years.length && !year) setYear(years[0]);
  }, [years, year]);

  const { data } = useGetWeeklyByYearQuery(year ?? skipToken);
  const weeklyData = Array.isArray(data) ? data : [];

  const aggregated = useMemo(() => {
    const totals = {};
    weeklyData.forEach(r => {
      totals[r.districtId] = (totals[r.districtId] || 0) + r.dengueCases;
    });
    return Object.entries(totals).map(([district, cases]) => ({ district, cases }));
  }, [weeklyData]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">District Distribution</h2>
      &nbsp; &nbsp; &nbsp; Years: &nbsp; 
      <select
        value={year || ''}
        onChange={e => setYear(Number(e.target.value))}
        className="border p-2 rounded mb-6"
      >
        {years.map(y => <option key={y} value={y}>{y}</option>)}
      </select>

      <DistrictDistributionChart data={aggregated} width={800} height={600} />
    </div>
  );
};

export default DistrictDistributionContainer;
