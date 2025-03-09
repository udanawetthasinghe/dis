import React, { useEffect, useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import AdminSideMenu from '../components/AdminSideMenu';
import {
  useGetGraphByIdQuery,
  useUpdateGraphMutation,
} from '../slices/graphsApiSlice';

const AdminGraphEditScreen = () => {
  const {graphId } = useParams(); // from /admin/graphs/:graphId/edit
  const navigate = useNavigate();

  // Queries & Mutations
  const {
    data: graph,
    isLoading,
    error,
  } = useGetGraphByIdQuery(graphId, {
    // Optionally, skip if no graphId
    skip: !graphId,
  });
  const [updateGraph, { isLoading: isUpdating }] = useUpdateGraphMutation();

  // Local State
  const [graphIndex, setGraphIndex] = useState('');
  const [graphName, setGraphName] = useState('');
  const [graphType, setGraphType] = useState('');
  const [graphDescrip, setGraphDescrip] = useState('');

  // Load existing data into form once fetched
  useEffect(() => {
    if (graph) {
      setGraphIndex(graph.graphIndex);
      setGraphName(graph.graphName);
      setGraphType(graph.graphType);
      setGraphDescrip(graph.graphDescrip);
    }
  }, [graph]);

  // Submit Handler
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateGraph({
        id: graphId,
        graphIndex,
        graphName,
        graphType,
        graphDescrip,
      }).unwrap();

      toast.success('Graph updated successfully');
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
        <Col md={10}>
          <h1>Edit Graph</h1>
          {isLoading && <p>Loading graph data...</p>}
          {error && <p>Error loading graph: {error?.data?.message || error.message}</p>}

          {graph && (
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

              <Button
                type="submit"
                variant="primary"
                className="mt-3"
                disabled={isUpdating}
              >
                {isUpdating ? 'Updating...' : 'Update Graph'}
              </Button>
            </Form>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default AdminGraphEditScreen;
