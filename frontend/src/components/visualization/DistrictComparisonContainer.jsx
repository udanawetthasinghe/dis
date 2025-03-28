import React, { useState, useEffect, useMemo } from 'react';
import { useGetYearsQuery, useGetWeeklyByYearQuery } from '../../slices/weeklyDngDataApiSlice';
import { skipToken } from '@reduxjs/toolkit/query';
import DistrictComparisonChart from '../charts/DistrictComparisonChart';
import { districts } from "../../config/config";

const DistrictComparisonContainer = () => {
  const { data: years = [] } = useGetYearsQuery();
  const [year1, setYear1] = useState();
  const [year2, setYear2] = useState();
  const [year3, setYear3] = useState();

  // Default to latest three consecutive years
  useEffect(() => {
    if (years.length >= 3 && !year1) {
      setYear1(years[0]);
      setYear2(years[1]);
      setYear3(years[2]);
    }
  }, [years, year1]);

  const { data: data1 = [] } = useGetWeeklyByYearQuery(year1 ?? skipToken);
  const { data: data2 = [] } = useGetWeeklyByYearQuery(year2 ?? skipToken);
  const { data: data3 = [] } = useGetWeeklyByYearQuery(year3 ?? skipToken);

  const aggregated = useMemo(() => {
    const districtIds = Array.from(new Set([...data1, ...data2, ...data3].map(r => r.districtId)));
    return districtIds.map(districtId => ({
      district: districts[districtId],
      [`year${year1}`]: data1.filter(r => r.districtId === districtId).reduce((sum, r) => sum + r.dengueCases, 0),
      [`year${year2}`]: data2.filter(r => r.districtId === districtId).reduce((sum, r) => sum + r.dengueCases, 0),
      [`year${year3}`]: data3.filter(r => r.districtId === districtId).reduce((sum, r) => sum + r.dengueCases, 0),
    }));
  }, [data1, data2, data3, year1, year2, year3]);

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold mb-4">District Comparison</h2>

      <div className="flex items-center gap-4 mb-6">
      &nbsp; &nbsp; &nbsp; Years: &nbsp; {[ [year1, setYear1], [year2, setYear2], [year3, setYear3] ].map(([yr, setter], idx) => (
    <label key={idx} className="flex items-center text-sm font-medium">
            <select
              value={yr || ''}
              onChange={e => setter(e.target.value ? Number(e.target.value) : undefined)}
              className="border p-2 rounded w-28"
            >
             {years.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </label>
        ))}
      </div>

      <DistrictComparisonChart 
        data={aggregated} 
        years={[year1, year2, year3]} 
        width={800} 
        height={500} 
      />
    </div>
  );
};

export default DistrictComparisonContainer;
