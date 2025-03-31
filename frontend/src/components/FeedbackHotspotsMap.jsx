import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useGetFeedbackByWeekQuery } from '../slices/feedbackApiSlice';
import { getWeekNumber } from '../utils/dateUtils'; // A helper function to compute week number
import { districtCoordinates } from '../config/config'; // e.g., { Colombo: { lat: 6.9271, lng: 79.8612 }, ... }
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix marker icon issues with react-leaflet and webpack/vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const FeedbackHotspotsMap = () => {
  // Determine the current week number (or you could use latest feedback's week if available)
  const currentWeek = getWeekNumber(new Date());
  
  // Fetch feedback data for the current week using RTK Query
  const { data: feedbackData = [] } = useGetFeedbackByWeekQuery(currentWeek);

  // Group feedback records by district and count occurrences
  const hotspots = useMemo(() => {
    // Feedback records should have a 'district' field
    const counts = feedbackData.reduce((acc, feedback) => {
      const dist = feedback.district || 'Unknown';
      if (!acc[dist]) {
        acc[dist] = { district: dist, count: 0 };
      }
      acc[dist].count++;
      return acc;
    }, {});
    return Object.values(counts);
  }, [feedbackData]);

  // Determine map center; here we use Colombo as a default
  const mapCenter = districtCoordinates.Colombo || { lat: 6.9271, lng: 79.8612 };

  return (
    <div style={{ height: '500px', width: '100%' }}>
      <MapContainer center={mapCenter} zoom={10} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {hotspots.map((hotspot) => {
          // Look up district coordinates from your config; if not found, skip rendering
          const coords = districtCoordinates[hotspot.district];
          if (!coords) return null;
          return (
            <Marker key={hotspot.district} position={[coords.lat, coords.lng]}>
              <Popup>
                <strong>{hotspot.district}</strong>
                <br />
                Feedback Count: {hotspot.count}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default FeedbackHotspotsMap;
