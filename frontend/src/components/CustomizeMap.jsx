import React, { useState, useMemo, useRef, useEffect } from "react";
import { Container, Row, Col, Form, Table, Button } from "react-bootstrap";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import Legend from "./Legend";
import sriDistricts from "../config/sri‑lanka‑districts.json";
import dengueData from "../config/dengue-data.json";
import { districts } from "../config/config";
import { toPng } from "html-to-image";
import download from "downloadjs";

const CustomizeMap = () => {
  const [topic, setTopic] = useState("");
  const [inputData, setInputData] = useState(dengueData);
  const [mapData, setMapData] = useState(null);
  const mapRef = useRef(null);
  const inputRefs = useRef({});
  const districtIds = Object.keys(districts).slice(1);
  const [palette, setPalette] = useState("warm");

  // Auto‑generate map on first load
  useEffect(() => {
    setMapData({ ...dengueData });
  }, []);

  const handleInputChange = (id, value) => {
    setInputData((prev) => ({
      ...prev,
      [id]: value === "" ? "" : Number(value),
    }));
  };

  const handleGenerate = () => {
    const totals = {};
    districtIds.forEach((id) => {
      // Use user input if provided; otherwise zero
      totals[id] = inputData[id] !== "" ? Number(inputData[id]) : 0;
    });
    setMapData(totals);
  };

  const handleExport = () => {
    if (!mapRef.current) return;
    toPng(mapRef.current, { backgroundColor: "#fff", cacheBust: true }).then(
      (dataUrl) => download(dataUrl, `${topic || "map"}.png`, "image/png")
    );
  };

  const handleKeyDown = (e, id) => {
    if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      const nextIndex = (districtIds.indexOf(id) + 1) % districtIds.length;
      const nextId = districtIds[nextIndex];
      inputRefs.current[nextId]?.focus();
    }
  };

  ///available color palettes
  const PALETTES = {
    warm: [
      "#FFEDA0",
      "#FFEDA5",
      "#FEB24C",
      "#FD8D3C",
      "#FC4E2A",
      "#E31A1C",
      "#BD0026",
      "#800026",
    ],
    cold: [
      "#f5faff",
      "#f7fbff",
      "#deebf7",
      "#c6dbef",
      "#9ecae1",
      "#6baed6",
      "#3182bd",
      "#08519c",
    ],
  };

  const { grades, getColor } = useMemo(() => {
    if (!mapData) return { grades: [], getColor: () => "#FFEDA0" };
    const vals = Object.values(mapData).sort((a, b) => a - b);
    const mid =
      vals.length % 2
        ? vals[(vals.length - 1) / 2]
        : (vals[vals.length / 2 - 1] + vals[vals.length / 2]) / 2;
    const sr = Math.max(Math.floor(mid / 3), 1);
    const thresholds = [0, sr, sr * 2, sr * 3, sr * 4, sr * 5, sr * 6];
    const colorFn = (cases) => {
      const colors = PALETTES[palette];
      return cases > thresholds[6]
        ? colors[7]
        : cases > thresholds[5]
        ? colors[6]
        : cases > thresholds[4]
        ? colors[5]
        : cases > thresholds[3]
        ? colors[4]
        : cases > thresholds[2]
        ? colors[3]
        : cases > thresholds[1]
        ? colors[2]
        : cases > 0
        ? colors[1]
        : colors[0];
    };

    return { grades: thresholds, getColor: colorFn };
  }, [mapData]);

  const styleFn = (feature) => ({
    fillColor: getColor(mapData?.[feature.properties.id] || 0),
    weight: 1,
    color: "#fff",
    fillOpacity: 0.8,
  });

  return (
    <Container fluid className="mt-3">
      <Row>
        <Col md={6}>
          <Form.Label className="fs-3 mb-3">{topic || "Map Title"}</Form.Label>
          <div ref={mapRef}>
            {mapData && (
              <MapContainer
                center={[7.8731, 80.7718]}
                scrollWheelZoom={false}
                zoom={7.5}
                style={{ height: "750px", width: "100%" }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <GeoJSON
                  data={sriDistricts}
                  style={styleFn}
                  onEachFeature={(feature, layer) => {
                    const id = feature.properties.id;
                    const name = districts[id] || "Unknown";

                    layer.bindTooltip(name, { sticky: true });
                  }}
                />
                <Legend grades={grades} getColor={getColor} />
              </MapContainer>
            )}
          </div>
          <Button className="mt-3" variant="secondary" onClick={handleExport} disabled={!mapData}>
            Export Map as PNG
          </Button>
        </Col>

        <Col md={6}>
          <Form.Group controlId="mapTopic">
            <Form.Label>Map Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Color Palette</Form.Label>
            <Form.Select
              value={palette}
              onChange={(e) => setPalette(e.target.value)}
            >
              <option value="warm">Warm (Reds)</option>
              <option value="cold">Cold (Blues)</option>
            </Form.Select>
          </Form.Group>

          <Table striped bordered hover size="sm" className="mt-4">
            <thead>
              <tr>
                <th>District</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {districtIds.map((id) => (
                <tr key={id}>
                  <td>{districts[id]}</td>
                  <td>
                    <Form.Control
                      type="number"
                      min="0"
                      value={inputData[id] ?? ""} // controlled empty until typed
                      onChange={(e) => handleInputChange(id, e.target.value)}
                      onFocus={(e) => e.target.select()} // <— highlight entire value
                      onKeyDown={(e) => handleKeyDown(e, id)}
                      ref={(el) => (inputRefs.current[id] = el)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Button variant="secondary" onClick={handleGenerate}>Generate Map</Button>

        </Col>
      </Row>
    </Container>
  );
};

export default CustomizeMap;
