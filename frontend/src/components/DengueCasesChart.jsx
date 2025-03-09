import { useState, useEffect } from 'react';

import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { getDistrictNameById } from '../config/config';

// Register chart components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const DengueCasesChart = ({ data, districtId }) => {
    const [chartData, setChartData] = useState({});
  
    useEffect(() => {
      const aggregateData = (data, districtId) => {
        if (!data || data.length === 0) {
          return {
            labels: [],
            datasets: [],
          };
        }
  
        const monthToCases = {};
  
        data
          .filter(({ districtId: id }) => id === districtId)
          .forEach(({ year, month, dengueCases }) => {
            const key = `${year}-${month}`;
            if (!monthToCases[key]) {
              monthToCases[key] = 0;
            }
            monthToCases[key] += dengueCases;
          });
  
        const labels = Object.keys(monthToCases).sort();
        const cases = labels.map((label) => monthToCases[label]);
  
        return {
          labels,
          datasets: [
            {
              label: `Dengue Cases for ${getDistrictNameById(districtId)}`,
              data: cases,
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              fill: true,
            },
          ],
        };
      };
  
      setChartData(aggregateData(data, districtId));
    }, [data, districtId]);
  
    return (
      <div>
        <h5>Dengue Cases by Month</h5>
        {Object.keys(chartData).length > 0 && (
          <Line data={chartData} />
        )}
      </div>
    );
  };
  
  export default DengueCasesChart;