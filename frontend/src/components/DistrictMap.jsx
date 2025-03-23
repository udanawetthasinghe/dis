import React, { useState } from 'react';
import { MapContainer, GeoJSON } from 'react-leaflet';
import dengueData from '../config/dengue-data.json';
import sriDistricts from '../config/sri‑lanka‑districts.json'
import { districts, getDistrictNameById } from "../config/config";

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
    fillOpacity:1,
  });
  const onEachFeature = (feature, layer) => {

    const {id} = feature.properties;
    const dstName=districts[id];
    const cases = dengueData[id] || 0;

    layer.bindTooltip(dstName, { sticky: true, direction: 'auto' });
    layer.on('click', () => setSelected({ id, dstName, cases }));
    layer.on('mouseover', () => layer.setStyle({ fillOpacity: 0.7 }));
    layer.on('mouseout', () => layer.setStyle(style(feature)));

  
  };

  return (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
      <MapContainer
        center={[7.8731, 80.7718]}
        zoom={7.5}
        scrollWheelZoom={false}
        style={{ height: '780px', width: '48%', backgroundColor: '#fff'  }}
      >
        <GeoJSON data={sriDistricts} style={style} onEachFeature={onEachFeature} />
      </MapContainer>
      <div style={{ padding: '1rem', width: '52%' }}>
        {selected
          ? <><h3>{selected.dstName} ({selected.id})</h3><p>Dengue cases: {selected.cases}</p></>
          : <p>Click a district for details</p>}
      </div>
    </div>
  );
};

export default DistrictMap;
