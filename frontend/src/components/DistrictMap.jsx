import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, GeoJSON } from 'react-leaflet';
import { Container, Row, Col, Form } from "react-bootstrap";
import Message from "../components/Message";

import dengueData from '../config/dengue-data.json';
import sriDistricts from '../config/sri‑lanka‑districts.json'
import { districts } from "../config/config";
import { useGetYearsQuery, useGetWeeklyByYearQuery } from '../slices/weeklyDngDataApiSlice';
import Legend from './Legend';

///////////////////////////// download map

import { toPng } from 'html-to-image';
import download from 'downloadjs';
import { Button } from 'react-bootstrap';
import { useRef } from 'react';

const DistrictMap = () => {

  const mapRef = useRef(null);

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

  // Compute median and sub-range thresholds
  const { subRange, grades, getColor } = useMemo(() => {
    const totals = Object.values(yearTotals).sort((a, b) => a - b);
    if (!totals.length) return { subRange: 0, grades: [], getColor: () => '#FFEDA0' };

    const mid = totals.length % 2
      ? totals[(totals.length - 1) / 2]
      : (totals[totals.length / 2 - 1] + totals[totals.length / 2]) / 2;
    const sr = Math.max(Math.floor(mid / 3), 1);
    // Now include 6×sr as the top threshold
    const thresholds = [0, sr, sr * 2, sr * 3, sr * 4, sr * 5, sr * 6];

    const colorFn = (cases) =>
      cases > thresholds[6] ? '#800026'
        : cases > thresholds[5] ? '#BD0026'
          : cases > thresholds[4] ? '#E31A1C'
            : cases > thresholds[3] ? '#FC4E2A'
              : cases > thresholds[2] ? '#FD8D3C'
                : cases > thresholds[1] ? '#FEB24C'
                  : cases > 0 ? '#FFEDA5'
                    : '#FFEDA0'; // or whatever you want for zero


    return { subRange: sr, grades: thresholds, getColor: colorFn };
  }, [yearTotals]);


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


  const exportMap = () => {
    if (!mapRef.current) return;
    toPng(mapRef.current, { cacheBust: true, backgroundColor: '#fff' })
      .then((dataUrl) => {
        download(dataUrl, `SriLanka_Dengue_${selectedYear}.png`, 'image/png');
      })
      .catch((err) => console.error('Export failed:', err));
  };



  return (

    <Container fluid className="mt-3">

<br/>
      <Row className="align-items-center mb-4">
        <Col md={2}>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>Year</strong>

        </Col>
   
          <Col md={2}>
          
          <Form.Select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            disabled={loadingYears}
            className="border p-2 rounded w-40"

          >
            {years.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </Form.Select>         
          </Col>

        

      </Row>

      {dataError && <Message variant="danger">{dataError.message}</Message>}



<Row>
<Col md={9}>

        <MapContainer
          center={[7.8731, 80.7718]}
          zoom={7.5}
          scrollWheelZoom={false}
          style={{ height: '780px', width: '100%', backgroundColor: '#fff' }}
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
                layer.on("click", () => setSelectedDistrict({ id, dstName: name }));
                layer.on("mouseover", () => layer.setStyle({ weight: 3, fillOpacity: 0.7 }));
                layer.on("mouseout", () => layer.setStyle(styleFn(feature)));
              }}
            />

          )}
          <Legend grades={grades} getColor={getColor} />

        </MapContainer>

        </Col>

        <Col md={3}>


          {selectedDistrict
            ? <><h3>{selectedDistrict.dstName}</h3>
              <p>
                <strong>Dengue Cases ({selectedYear}):</strong>{" "}
                {(yearTotals[selectedDistrict.id] || 0).toLocaleString()}
              </p>              </>
            : <p>Click a district for details</p>}
</Col>
<Col md={3}>
          <Button onClick={exportMap} disabled={loadingData}>Export Map as PNG</Button>
        </Col>
</Row>
 
    </Container>

  );
};

export default DistrictMap;
