import React, { useMemo } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';
import { useGetFeedbackByWeekQuery } from '../slices/feedbackApiSlice';
import { getWeekNumber } from '../config/dateUtils'; // helper function for week number
import 'leaflet/dist/leaflet.css';
import { districtCoordinates } from '../config/config'; // e.g., { Colombo: { lat: 6.9271, lng: 79.8612 }, ... }

// Fix default marker icons for leaflet (if needed)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const HeatLayer = () => {
  const currentWeek = getWeekNumber(new Date());
  const { data: feedbackData = [] } = useGetFeedbackByWeekQuery(currentWeek);

  const map = useMap();

  // Group feedback data by district and count the number of records per district.
  const heatData = useMemo(() => {
    const counts = feedbackData.reduce((acc, feedback) => {
      const dist = feedback.district || 'Unknown';
      acc[dist] = (acc[dist] || 0) + 1;
      return acc;
    }, {});
    // Create an array of [lat, lng, intensity] for each district.
    return Object.keys(counts)
      .filter((dist) => districtCoordinates[dist]) // only include districts with coordinates
      .map((dist) => [
        districtCoordinates[dist].lat,
        districtCoordinates[dist].lng,
        100*counts[dist]
      ]);
  }, [feedbackData]);

  React.useEffect(() => {
    if (!map) return;
    const heatLayer = L.heatLayer(heatData, { radius: 25 }).addTo(map);
    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, heatData]);

  return null;
};

const FeedbackHotspotsMap = () => {
  // Center the map on Colombo (or any default center)
  const defaultCenter = [6.9271, 79.8612];
  return (
    <MapContainer center={defaultCenter} zoom={9} style={{ height: "900px", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <HeatLayer />
    </MapContainer>
  );
};

export default FeedbackHotspotsMap;
