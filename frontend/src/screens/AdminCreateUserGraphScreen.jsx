import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AdminSideMenu from '../components/AdminSideMenu';
import { useSelector } from 'react-redux';
import { useCreateUserGraphMutation } from '../slices/userGraphsApiSlice';
import { useGetGraphsQuery } from '../slices/graphsApiSlice';
import AdminGraphSamples from '../components/AdminGraphSamples';

const AdminCreateUserGraphScreen = () => {
  const navigate = useNavigate();

  // 1. Get the logged-in user from Redux (JWT token stored in 'auth.userInfo')
  const { userInfo } = useSelector((state) => state.auth);
  const userId = userInfo?._id; // If your user object has '_id' or 'id'

  // 2. Fetch available graphs from the 'graphs' collection
  const { data: graphs, isLoading: isGraphsLoading, error: graphsError } = useGetGraphsQuery();

  // Local form state
  const [selectedGraphName, setSelectedGraphName] = useState(''); // The chosen graph name from dropdown
  const [graphTitle, setGraphTitle] = useState('');
  const [apiRoute, setApiRoute] = useState('');
  const [description, setDescription] = useState('');
  const [xTitle, setXTitle] = useState('');
  const [yTitle, setYTitle] = useState('');

  // RTK mutation for creating a user graph
  const [createUserGraph, { isLoading }] = useCreateUserGraphMutation();

  // Submit handler
  const submitHandler = async (e) => {
    e.preventDefault();

    // 1. Validate user ID
    if (!userId) {
      toast.error('No user ID found. Please log in first.');
      return;
    }

    // 2. Validate the selected graph name
    if (!selectedGraphName) {
      toast.error('Please select a graph from the dropdown.');
      return;
    }

    // 3. Find the graph document by name to get its _id
    const selectedGraph = graphs?.find((g) => g.graphName === selectedGraphName);
    if (!selectedGraph) {
      toast.error('Selected graph name does not match any existing graph.');
      return;
    }

    const graphId = selectedGraph._id; // We'll store this in userGraphs

    try {
      // 4. Call the createUserGraph mutation
      await createUserGraph({
        userId,
        graphId, // derived from the selected graph
        graphTitle,
        apiRoute,
        description,
        xTitle,
        yTitle,
      }).unwrap();

      toast.success('User Graph created successfully');
      navigate('/admin/usergraphs');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <Container fluid className="mt-3">
      <Row>
        <Col md={2}>
          <AdminSideMenu />
        </Col>
        <Col md={5}>
          <h1>Add a New User Graph</h1>

          {/* Display loading/error for graphs */}
          {isGraphsLoading && <p>Loading graph list...</p>}
          {graphsError && <p>Error loading graphs: {graphsError.message}</p>}

          <Form onSubmit={submitHandler}>
            {/* 1. Graph Name Dropdown */}
            <Form.Group className="my-2" controlId="graphName">
              <Form.Label>Select Graph</Form.Label>
              <Form.Control
                as="select"
                value={selectedGraphName}
                onChange={(e) => setSelectedGraphName(e.target.value)}
              >
                <option value="">-- Select a Graph --</option>
                {graphs &&
                  graphs.map((graph) => (
                    <option key={graph._id} value={graph.graphName}>
                      {graph.graphName}
                    </option>
                  ))}
              </Form.Control>
            </Form.Group>

            {/* 2. Graph Title */}
            <Form.Group className="my-2" controlId="graphTitle">
              <Form.Label>Graph Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter a custom title for this user graph"
                value={graphTitle}
                onChange={(e) => setGraphTitle(e.target.value)}
              />
            </Form.Group>

            {/* 3. API Route */}
            <Form.Group className="my-2" controlId="apiRoute">
              <Form.Label>API Route <br/>(The API route should return structured JSON data that matches the sample graph data formats)</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter the API route (e.g., http://...)"
                value={apiRoute}
                onChange={(e) => setApiRoute(e.target.value)}
              />
            </Form.Group>

            {/* 4. Description */}
            <Form.Group className="my-2" controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Describe the user graph"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>

            {/* 5. X-Title */}
            <Form.Group className="my-2" controlId="xTitle">
              <Form.Label>X-Axis Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter x-axis title"
                value={xTitle}
                onChange={(e) => setXTitle(e.target.value)}
              />
            </Form.Group>

            {/* 6. Y-Title */}
            <Form.Group className="my-2" controlId="yTitle">
              <Form.Label>Y-Axis Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter y-axis title"
                value={yTitle}
                onChange={(e) => setYTitle(e.target.value)}
              />
            </Form.Group>

            {/* 7. Submit */}
            <Button type="submit" variant="primary" className="mt-3" disabled={isLoading || isGraphsLoading}>
              {isLoading ? 'Creating...' : 'Add User Graph'}
            </Button>
          </Form>
        </Col>

        <Col md={5}>
        <Card className="mb-3">
                <Card.Body>
                  <h2>Sample Graph Data Formats</h2>
                  <p>The following sample JSON formats should be used by researchers when submitting their research findings to the system via the API. Please review the JSON formats for the different graph types currently provided by the system.</p>
                  <AdminGraphSamples />
                  <LinkContainer to="/admin/graph-samples">
                    <Button variant="info" className="mt-3">
                      View More Details
                    </Button>
                  </LinkContainer>
                </Card.Body>
              </Card>        </Col>
      </Row>
    </Container>
  );
};

export default AdminCreateUserGraphScreen;
