import React, { useEffect } from 'react';
import { MapContainer, TileLayer,useMap} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet.heat';
import { dengueData } from '../config/config';


const HeatLayer = () => {
    const map = useMap();
  
    useEffect(() => {
      const heatData = dengueData.map(data => [data.lat, data.lng, data.cases]);
      const heatLayer = L.heatLayer(heatData, { radius: 25 }).addTo(map);
  
      // Clean up the layer on unmount
      return () => {
        map.removeLayer(heatLayer);
      };
    }, [map]);
  
    return null;
  };
  
  const Heatmap = () => {
    return (
      <MapContainer center={[6.9271, 79.8612]} zoom={8.5} style={{ height: "410px", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <HeatLayer />
      </MapContainer>
    );
  };
  
  export default Heatmap;
