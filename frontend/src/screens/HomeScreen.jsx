import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import mainImage from "../img/main.png"; 
import insightsImage from "../img/insights.png"
import forecastImage from "../img/forecasts.png"
import feedbackImage from "../img/feedback.png"
const HomeScreen = () => {
  return (
    <Container fluid className="mt-4">
      {/* First Row: Introduction */}
      <Row className="mb-5 align-items-center">
        {/* Left side: Static image */}
        <Col md={6}>
          <img
            src={mainImage} 
            alt="Dengue Awareness"
            style={{ width: '85%', height: 'auto', borderRadius: '10px' }}
          />
        </Col>

        {/* Right side: Intro text */}
        <Col md={6}>
          <h1>Welcome to the Dengue Information System</h1>
          <p>
            This platform is developed to enhance public awareness, visualize dengue data,
            predict dengue outbreaks, and encourage public participation by reporting breeding sites.
            Together, we can control dengue and save lives.
          </p>
          <p>
            Explore insights, forecasts, and contribute directly by sharing feedback about breeding hotspots.
          </p>
        </Col>
      </Row>
<br/>
      {/* Second Row: Features */}
      <Row className="g-4" >
      <h1 className="text-center">Explore the System Features</h1>
      
        </Row>

        <br/>

        <br/>
        <br/>
      <Row className="g-4">

      <Col md={2}></Col>
  
      <Col md={2}>
          <Card className="h-100 shadow-sm">
            <Card.Img variant="top" src={insightsImage} height="auto" width="100%"/>
            <Card.Body>
              <Card.Title>Dengue Insights</Card.Title>
              <Card.Text>
                Explore real-time dengue trends and district-wise case distributions.
              </Card.Text>
              
              <Button as={Link} to="/dengue-insights" variant="success">
                View Insights
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={1}></Col>

        <Col md={2}>
          <Card className="h-100 shadow-sm">
            <Card.Img variant="top" src={forecastImage} height="auto" width="100%" />
            <Card.Body>
              <Card.Title>Dengue Forecast</Card.Title>
              <Card.Text>
                View weekly risk forecasts powered by climate-based predictive models.
              </Card.Text>
              <Button as={Link} to="/activated-user-graphs" variant="success">
                View Forecast
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={1}></Col>

        <Col md={2}>
          <Card className="h-100 shadow-sm">
            <Card.Img variant="top" src={feedbackImage} height="auto" width="100%" />
            <Card.Body>
              <Card.Title>Submit Feedback</Card.Title>
              <Card.Text>
                Help us identify mosquito breeding sites by submitting your observations.
              </Card.Text>
              <Button as={Link} to="/feedback" variant="success">
                Submit Now
              </Button>
            </Card.Body>
          </Card>
        </Col>
  
      
      
           
      </Row>
    </Container>
  );
};

export default HomeScreen;
