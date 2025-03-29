import React, { useState } from 'react';
import { Form, Container, Row, Col, Card, Button } from 'react-bootstrap';
import GoogleMapPicker from '../components/GoogleMapPicker'; // your custom map picker component
import { useCreateFeedbackMutation } from '../slices/feedbackApiSlice';

const FeedbackSubmissionScreen = () => {
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [district, setDistrict] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState('');

  // RTK Query mutation hook for feedback submission
  const [createFeedback, { isLoading }] = useCreateFeedbackMutation();

  // Handle location selection from the map
  const handleLocationSelect = async (lat, lng) => {
    setLocation({ lat, lng });
    // Perform reverse geocoding via your own method/API if desired
    // For example, you can call a separate RTK Query endpoint or a utility function here
    // and then setDistrict with the result.
    // For now, we'll assume that functionality is handled elsewhere.
    // setDistrict(...);
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Prepare a FormData object to support file uploads
    const formData = new FormData();
    formData.append('lat', location.lat);
    formData.append('lng', location.lng);
    formData.append('district', district);
    formData.append('description', description);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      const result = await createFeedback(formData).unwrap();
      setMessage('Feedback submitted successfully!');
      // Clear form fields if needed
    } catch (error) {
      console.error(error);
      setMessage('Error submitting feedback.');
    }
  };

  return (
    <Container className="mt-3">
      <Card className="mb-3">
        <Card.Body>
          <h3>Submit Dengue Breeding Place Feedback</h3>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="locationSelect" className="mb-3">
              <Form.Label>Select Location</Form.Label>
              <GoogleMapPicker onLocationSelect={handleLocationSelect} />
            </Form.Group>
            <Form.Group controlId="district" className="mb-3">
              <Form.Label>District / City</Form.Label>
              <Form.Control type="text" value={district} readOnly />
            </Form.Group>
            <Form.Group controlId="description" className="mb-3">
              <Form.Label>Short Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="image" className="mb-3">
              <Form.Label>Upload Photo</Form.Label>
              <Form.Control type="file" onChange={handleFileChange} />
            </Form.Group>
            <Button type="submit" variant="primary" disabled={isLoading}>
              {isLoading ? 'Submitting...' : 'Submit Feedback'}
            </Button>
          </Form>
          {message && <p className="mt-3">{message}</p>}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default FeedbackSubmissionScreen;
