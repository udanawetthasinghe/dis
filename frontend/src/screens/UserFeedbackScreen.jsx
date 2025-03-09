


import React, { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';


const containerStyle = {
  width: '100%',
  height: '400px',
};

const center = {
  lat: 6.9271,
  lng: 79.8612,
};

const UserFeedbackScreen = () => {
  const [location, setLocation] = useState(null);
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [submittedData, setSubmittedData] = useState(null);

  const handleMapClick = (e) => {
    setLocation({ lat: e.latLng.lat(), lng: e.latLng.lng() });
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmittedData({ location, description, images });
  };

  return (
    <div>
      <h1>Dengue Breeding Place Submission</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="map" className="mb-3">
          <Form.Label>Location</Form.Label>
          <LoadScript googleMapsApiKey={'AIzaSyCn2aRlMPH9FhD3ZmSVatxxfxWDP4zWQes'}>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={10}
              onClick={handleMapClick}
            >
              {location && <Marker position={location} />}
            </GoogleMap>
          </LoadScript>
        </Form.Group>

        <Form.Group controlId="description" className="mb-3">
          <Form.Label>Small Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={description}
            onChange={handleDescriptionChange}
          />
        </Form.Group>

        <Form.Group controlId="images" className="mb-3">
          <Form.Label>Images</Form.Label>
          <Form.Control type="file" multiple onChange={handleImageChange} />
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>

      {submittedData && (
        <Card className="mt-3">
          <Card.Header>Submitted Data</Card.Header>
          <Card.Body>
            <Card.Text>
              <strong>Location:</strong> {`Lat: ${submittedData.location.lat}, Lng: ${submittedData.location.lng}`}
            </Card.Text>
            <Card.Text>
              <strong>Description:</strong> {submittedData.description}
            </Card.Text>
            <div>
              <strong>Images:</strong>
              <div className="d-flex flex-wrap">
                {submittedData.images.map((image, index) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(image)}
                    alt={`Dengue Breeding Place ${index}`}
                    className="img-thumbnail m-1"
                    style={{ width: '150px', height: '150px' }}
                  />
                ))}
              </div>
            </div>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};
export default UserFeedbackScreen;
