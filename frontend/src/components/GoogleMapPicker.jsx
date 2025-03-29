import React, { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '300px',
};

const defaultCenter = { lat: 6.9271, lng: 79.8612 }; // Colombo, Sri Lanka

const GoogleMapPicker = ({ onLocationSelect }) => {
  const [markerPosition, setMarkerPosition] = useState(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey:"AIzaSyDPRLHyCbz6ilidw1xcohG3q-xhXKRrJhE",
  });

  const handleMapClick = useCallback((event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    const selectedLocation = { lat, lng };
    
    // Log the selected location for debugging
    console.log("Selected location:", selectedLocation);
    
    // Set marker without changing the center
    setMarkerPosition(selectedLocation);
    
    // Pass the coordinates to the parent component
    if (onLocationSelect) {
      onLocationSelect(lat, lng);
    }
  }, [onLocationSelect]);

  if (loadError) {
    return <div>Error loading map.</div>;
  }

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={defaultCenter}  // Always use the default center (Colombo)
      zoom={12}
      onClick={handleMapClick}
      options={{ draggableCursor: 'pointer' }} // Set cursor style to pointer
    >
      {markerPosition && <Marker position={markerPosition} />}
    </GoogleMap>
  ) : (
    <div>Loading map...</div>
  );
};

export default React.memo(GoogleMapPicker);
