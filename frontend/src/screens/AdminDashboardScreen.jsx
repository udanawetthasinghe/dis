import React, { useState } from 'react';
import { Form, Container, Row, Col, Card, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import AdminSideMenu from '../components/AdminSideMenu';
import Heatmap from '../components/Heatmap';
import DengueCasesChart from '../components/DengueCasesChart';
import AdminGraphSamples from '../components/AdminGraphSamples'; // Reusable component for sample JSON examples
import { useGetDngDataQuery } from '../slices/dngDataApiSlice';
import DistrictMap from '../components/DistrictMap';

import { districts } from '../config/config';
import CustomizeMap from '../components/CustomizeMap';
import FeedbackHotspotsMap from '../components/FeedbackHotspotsMap';

const AdminDashboardScreen = () => {
  const [selectedDistrict, setSelectedDistrict] = useState('LK-11');
  const { data: dngData } = useGetDngDataQuery({});

  const handleDistrictChange = (event) => {
    setSelectedDistrict(event.target.value);
  };

  return (
    <Container fluid className="mt-3">
      <Row>
        <Col md={2}>
          <AdminSideMenu />
        </Col>
        <Col md={10}>
          {/* Row with Dengue Dynamics and Latest Dengue Hotspot side by side */}
          <Row>
          
            <Col md={6}>
            <Container style={{ height: "500px" }}>
              <Card className="mb-3" style={{ height: "480px" }}>
                <Card.Body>
                  <h4>Dengue Dynamics</h4>
                  <Form.Group controlId="districtSelect" className="mb-3">
                    <Form.Label>
                      <h6>Select District</h6>
                    </Form.Label>
                    <Form.Control as="select" value={selectedDistrict} onChange={handleDistrictChange}>
                      {Object.entries(districts).map(([id, name]) => (
                        <option key={id} value={id}>
                          {name}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                  <DengueCasesChart data={dngData} districtId={selectedDistrict} />
                </Card.Body>
              </Card>
              </Container>
            </Col>
           
            <Col md={6}>
              <Card className="mb-3">
                <Card.Body>
                  <h4>Latest Dengue Hotspot</h4>
                  <FeedbackHotspotsMap />
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Row with Sample Graph Data Formats */}
          <Row>
            <Col>
              <Card className="mb-3">
                <Card.Body>
                  <h2>Sample Graph Data Formats</h2>
                  <AdminGraphSamples />
                  <LinkContainer to="/admin/graph-samples">
                    <Button variant="info" className="mt-3">
                      View More Details
                    </Button>
                  </LinkContainer>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Row with Dengue Heatmap Component */}
          <Row>
            <Col>
              <Card className="mb-3">
                <Card.Body>
                <div>
      <h1>Dengue Heatmap</h1>
      <DistrictMap />
    </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>





                {/* Row with Customize Dengue Heatmap Component */}
                <Row>
            <Col>
              <Card className="mb-3">
                <Card.Body>
                <div>
      <h1>Customize Dengue Heatmap</h1>
      <CustomizeMap/>
    </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>


        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboardScreen;
