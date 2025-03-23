import React, { useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import dengueData from '../config/dengue-data.json';
import sriDistricts from '../config/sri‑lanka‑districts.json'

const DistrictMap = () => {
  const [selected, setSelected] = useState(null);

  const getColor = cases =>
    cases > 400 ? '#800026'
    : cases > 300 ? '#BD0026'
    : cases > 200 ? '#E31A1C'
    : cases > 100 ? '#FC4E2A'
    : cases > 50  ? '#FD8D3C'
    : cases > 0   ? '#FEB24C'
    : '#FFEDA0';
  const style = ({ properties }) => ({
    fillColor: getColor(dengueData[properties.id] || 0),
    weight: 1,
    color: '#fff',
    fillOpacity: 0.7,
  });
  const onEachFeature = (feature, layer) => {
    layer.on('click', () => {
      const { id, name } = feature.properties;
      setSelected({ id, name, cases: dengueData[id]});
    });
  };

  return (
    <div className="flex">
      <MapContainer
        center={[7.8731, 80.7718]}
        zoom={7.5}
        style={{ height: '410px', width: '70%' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <GeoJSON data={sriDistricts} style={style} onEachFeature={onEachFeature} />
      </MapContainer>
      <div style={{ padding: '1rem', width: '30%' }}>
        {selected
          ? <><h3>{selected.name} ({selected.id})</h3><p>Dengue cases: {selected.cases}</p></>
          : <p>Click a district for details</p>}
      </div>
    </div>
  );
};

export default DistrictMap;
