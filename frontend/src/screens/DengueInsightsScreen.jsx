import React, { useState, useEffect } from 'react';
import { useGetYearsQuery, useGetWeeklyByYearQuery } from '../slices/weeklyDngDataApiSlice';
import WeeklyTrendLineChart from '../components/charts/WeeklyTrendLineChart';
import YearlyDistrictBarChart from '../components/charts/YearlyDistrictBarChart';
import YearlyDistrictPieChart from '../components/charts/YearlyDistrictPieChart';
import WeeklyComparisonContainer from '../components/visualization/WeeklyComparisonContainer';
import DistrictComparisonContainer from '../components/visualization/DistrictComparisonContainer';
import DistrictDistributionContainer from '../components/visualization/DistrictDistributionContainer';


function DengueInsightsScreen() {
  // Fetch available years
  const { data: years = [], isLoading: loadingYears, error: errorYears } = useGetYearsQuery();

  // When years load, set the default year
  const [year, setYear] = useState(new Date().getFullYear());
  useEffect(() => {
    if (years && years.length) {
      setYear(years[0]);
    }
  }, [years]);

  // Fetch weekly data for the selected year
  const { data: weeklyData = [], isLoading: loadingWeekly, error: errorWeekly } = useGetWeeklyByYearQuery(year);

  // Render loading/error messages if needed
  if (loadingYears) return <div className="p-4">Loading available years...</div>;
  if (errorYears) return <div className="p-4 text-red-500">Error loading years: {errorYears?.message || 'Unknown error'}</div>;
  if (loadingWeekly) return <div className="p-4">Loading weekly data for {year}...</div>;
  if (errorWeekly) return <div className="p-4 text-red-500">Error loading weekly data: {errorWeekly?.message || 'Unknown error'}</div>;

  return (
    <div className="p-4 grid grid-cols-3 gap-8">
      <div className="col-span-2 space-y-8">
              <h1 className="text-3xl font-bold mb-4">Dengue Insights Dashboard</h1>
      <select
        value={year}
        onChange={e => setYear(Number(e.target.value))}
        className="border p-2 rounded"
      >
        {years.map(y => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>

      <WeeklyTrendLineChart data={weeklyData} year={year} />
      <div className="grid grid-cols-2 gap-8">
        <YearlyDistrictBarChart data={weeklyData} year={year} />
        <YearlyDistrictPieChart data={weeklyData} year={year} />
      </div>

      </div>

{/* Right‑hand comparison panel */}
<WeeklyComparisonContainer />

<DistrictComparisonContainer/>

<DistrictDistributionContainer/>

</div>


  );
}

export default DengueInsightsScreen;
