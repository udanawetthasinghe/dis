import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCreateGraphMutation } from '../slices/graphsApiSlice';
import AdminSideMenu from '../components/AdminSideMenu';

const AdminGraphCreateScreen = () => {
  const [graphIndex, setGraphIndex] = useState('');
  const [graphName, setGraphName] = useState('');
  const [graphType, setGraphType] = useState('');
  const [graphDescrip, setGraphDescrip] = useState('');
  const [createGraph, { isLoading }] = useCreateGraphMutation();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await createGraph({ graphIndex, graphName, graphType, graphDescrip }).unwrap();
      toast.success('Graph created successfully');
      navigate('/admin/graphs');
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
        <Col md={6}>
          <h1>Add New Graph</h1>
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="graphIndex" className="my-2">
              <Form.Label>Graph Index</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter graph index"
                value={graphIndex}
                onChange={(e) => setGraphIndex(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="graphName" className="my-2">
              <Form.Label>Graph Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter graph name"
                value={graphName}
                onChange={(e) => setGraphName(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="graphType" className="my-2">
              <Form.Label>Graph Type</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter graph type"
                value={graphType}
                onChange={(e) => setGraphType(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="graphDescrip" className="my-2">
              <Form.Label>Graph Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter description"
                value={graphDescrip}
                onChange={(e) => setGraphDescrip(e.target.value)}
              />
            </Form.Group>

            <Button type="submit" variant="success" className="mt-3" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Add Graph'}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminGraphCreateScreen;
