import React, { useState,useEffect, useMemo } from 'react';
import { MapContainer, GeoJSON } from 'react-leaflet';
import { Container, Row, Col, Form } from "react-bootstrap";
import Message from "../components/Message";

import dengueData from '../config/dengue-data.json';
import sriDistricts from '../config/sri‑lanka‑districts.json'
import { districts } from "../config/config";
import { useGetYearsQuery, useGetWeeklyByYearQuery } from '../slices/weeklyDngDataApiSlice';

const DistrictMap = () => {

  const [selectedYear, setSelectedYear] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  const { data: years = [], isLoading: loadingYears } = useGetYearsQuery();
  const {
    data: weeklyRecords = [],
    isLoading: loadingData,
    error: dataError,
  } = useGetWeeklyByYearQuery(selectedYear, { skip: !selectedYear });

  // Set default selected year (latest) once years are loaded, only once.
  useEffect(() => {
    if (years.length && !selectedYear) {
      setSelectedYear(years[0]);
    }
  }, [years, selectedYear]);


   // Aggregate weekly data into per-district totals using useMemo (avoids repeated setState calls)
   const yearTotals = useMemo(() => {
    return weeklyRecords.reduce((acc, { districtId, dengueCases }) => {
      acc[districtId] = (acc[districtId] || 0) + dengueCases;
      return acc;
    }, {});
  }, [weeklyRecords]);

   // Reset selected district when year changes.
   useEffect(() => {
    setSelectedDistrict(null);
  }, [selectedYear]);


  const getColor = cases =>
    cases > 400 ? '#800026'
    : cases > 300 ? '#BD0026'
    : cases > 200 ? '#E31A1C'
    : cases > 100 ? '#FC4E2A'
    : cases > 50  ? '#FD8D3C'
    : cases > 0   ? '#FEB24C'
    : '#FFEDA0';


// Style generator (always uses the latest yearTotals)
const styleFn = (feature) => {
  const cases = yearTotals[feature.properties.id] ?? 0;
  return {
    fillColor: getColor(cases),
    weight: 1,
    color: "#fff",
    fillOpacity: 1,
  };
};


console.log(yearTotals["LK-11"]);




  return (

    <Container fluid className="mt-3">

<Row className="align-items-center mb-4">
        <Col md={3}>
          <Form.Label>Select Year</Form.Label>
          <Form.Select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            disabled={loadingYears}
          >
            {years.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </Form.Select>
        </Col>
</Row>


{dataError && <Message variant="danger">{dataError.message}</Message>}





    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
      <MapContainer
        center={[7.8731, 80.7718]}
        zoom={7.5}
        scrollWheelZoom={false}
        style={{ height: '780px', width: '48%', backgroundColor: '#fff'  }}
      >
{!loadingData && (
  <GeoJSON
    key={selectedYear}                // 🔑 remount on each new year
    data={sriDistricts}
    style={feature => styleFn(feature)} // always uses current yearTotals
    onEachFeature={(feature, layer) => {
      const id = feature.properties.id;
      const name = districts[id] || "Unknown";
      const cases = yearTotals[id] ?? 0;

      layer.bindTooltip(name, { sticky: true });
      layer.on("click", () => setSelectedDistrict({ id, dstName: name, cases }));
      layer.on("mouseover", () => layer.setStyle({ weight: 3, fillOpacity: 0.7 }));
      layer.on("mouseout", () => layer.setStyle(styleFn(feature)));
    }}
  />
)}
      </MapContainer>
      <div style={{ padding: '1rem', width: '52%' }}>
        {selectedDistrict 
          ? <><h3>{selectedDistrict .dstName} ({selectedDistrict .id})</h3>
              <p><strong>Dengue Cases ({selectedYear}):</strong> {selectedDistrict.cases.toLocaleString()}</p>
              </>
          : <p>Click a district for details</p>}
      </div>
    </div>

    </Container>

  );
};

export default DistrictMap;
