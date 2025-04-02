import React, { useState } from 'react';
import { Form, Container, Card, Button, Col, Row } from 'react-bootstrap';
import { toast } from "react-toastify";
import { useCreateFeedbackMutation } from '../slices/feedbackApiSlice';
import GoogleMapPicker from '../components/GoogleMapPicker';

const FeedbackSubmissionScreen = () => {
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [district, setDistrict] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState('');

  const [createFeedback, { isLoading }] = useCreateFeedbackMutation();

  // Reverse geocode using Google Maps Geocoding API
  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyDPRLHyCbz6ilidw1xcohG3q-xhXKRrJhE`
      );

      console.log(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyDPRLHyCbz6ilidw1xcohG3q-xhXKRrJhE`)
      const data = await response.json();
      if (data.status === 'OK' && data.results.length > 0) {
        // Find an address component that indicates district or locality
        const addressComponents = data.results[0].address_components;
        const districtComponent = addressComponents.find(component =>
          component.types.includes('administrative_area_level_2'));
        if (districtComponent) {
          console.log("Extracted district:", districtComponent.long_name);
          setDistrict(districtComponent.long_name);
        } else {
          console.log("District not found in reverse geocoding results.");
          setDistrict('');
        }
      } else {
        console.error('Reverse geocoding failed:', data.status);
        setDistrict('');
      }
    } catch (error) {
      console.error('Error in reverse geocoding:', error);
      setDistrict('');
    }
  };

  // This function is passed to the map component
  const handleLocationSelect = async (lat, lng) => {
    setLocation({ lat, lng });
    // Call reverse geocoding to extract district
    await reverseGeocode(lat, lng);
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    // Prepare form data for submission
    const formData = new FormData();
    formData.append('lat', location.lat);
    formData.append('lng', location.lng);
    formData.append('district', district); // Automatically set via reverse geocoding
    formData.append('description', description);
  if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      await createFeedback(formData).unwrap();
      setMessage('Feedback submitted successfully!');
      // Optionally clear the form fields
    } catch (error) {
      console.error(error);
      setMessage('Error submitting feedback.');
    }
  };


  // ====== Single Entry Form Validation ======
    const validateInputs = () => {
 

      let errorMessage = "";
      if (!district) {
        errorMessage += "Please pick the location |";
      }

      if (!description) {
        errorMessage += " Please add a short description";
      }
      if (errorMessage) {
        toast.error(errorMessage);
        return false;
      }
      return true;
    };

  return (
    <Container>
      
          <h1>Submit Dengue Breeding Place Feedback</h1>

          <Row>
          <p>Report potential dengue breeding sites quickly and easily! 
            Simply click on the interactive map to choose a location, add a short description, and optionally attach a photo. 
            Your feedback helps us identify and address high-risk areas in your community.</p>
          
        
          </Row>
          <Row>
          
          <Card>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="locationSelect" className="mb-3">
              <Form.Label>Select Location</Form.Label>
              <GoogleMapPicker onLocationSelect={handleLocationSelect} />
            </Form.Group>
            {/* Removed district input field; district is set via reverse geocoding */}
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
            {message && <p className="mt-3">{message}</p>}

          </Form>
          </Card.Body>
          </Card>  
          
 
       
   

          


          </Row>
          
    </Container>
  );
};

export default FeedbackSubmissionScreen;
