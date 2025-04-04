import React, { useState } from 'react';
import { Table, Button, Container, Row, Col, Form } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import AdminSideMenu from '../components/AdminSideMenu';
import { toast } from 'react-toastify';
import {
  useGetUserGraphsQuery,
  useUpdateUserGraphMutation,
  useDeleteUserGraphMutation,
} from '../slices/userGraphsApiSlice';
import GraphRenderer from '../components/GraphRenderer';
import { singleLineGraphSampleNew,singleLineGraphSample, multiLineGraphSample, categoricalScatterGraphSample } from '../config/sampleGraphData';


const AdminUserGraphsScreen = () => {
  const { data: userGraphs, error, isLoading, refetch } = useGetUserGraphsQuery();
  const [updateUserGraph] = useUpdateUserGraphMutation();
  const [deleteUserGraph] = useDeleteUserGraphMutation();
  

  // Local state to hold the record being viewed
  const [viewRecord, setViewRecord] = useState(null);

  // Filter out any graphs with state=99 (removed)
  const visibleGraphs = userGraphs?.filter((ug) => ug.state !== 99) || [];

  // Separate tables: Pending (state=1) and Active/Rejected (state=3 or 5)
  const pendingGraphs = visibleGraphs.filter((ug) => ug.state === 1);
  const activeOrRejectedGraphs = visibleGraphs.filter(
    (ug) => ug.state === 3 || ug.state === 5
  );

  // Common update function for state changes
  const updateGraphState = async (id, newState) => {
    try {
      await updateUserGraph({ id, state: newState }).unwrap();
      toast.success(`Graph state updated to ${newState}`);
      refetch();
      if (viewRecord && viewRecord._id === id) {
        setViewRecord(null);
      }
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const handleActivate = (id) => updateGraphState(id, 3); // Active
  const handleReject = (id) => updateGraphState(id, 1);   // Rejected
  const handleRemove = (id) => updateGraphState(id, 99);  // Removed

  // "View" button sets the record to be viewed
  const handleView = (record) => setViewRecord(record);
  const handleCloseView = () => setViewRecord(null);

    const deleteHandler = async (id) => {
      if (window.confirm('Are you sure you want to delete this graph?')) {
        try {
          console.log(id)
          await deleteUserGraph(id).unwrap();
          toast.success('Graph deleted successfully');
          refetch();
        } catch (err) {
          toast.error(err?.data?.message || err.error);
        }
      }
    };

  return (
    <Container fluid className="mt-3">
      <Row>
        <Col md={2}>
          <AdminSideMenu />
        </Col>
        <Col md={10}>
          <h1>User Graphs</h1>

          <LinkContainer to="/admin/usergraphs/create">
            <Button variant="primary" className="my-3">
              Add User Graph
            </Button>
          </LinkContainer>

          {isLoading && <p>Loading...</p>}
          {error && <p>Error fetching user graphs</p>}

          {/* Pending Graphs Table */}
          <h3>Pending Graphs</h3>
          {pendingGraphs.length === 0 ? (
            <p>No pending user graphs.</p>
          ) : (
            <Table striped hover responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User</th>

                  <th>Graph Title</th>
                  <th>API Route</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingGraphs.map((ug) => (
                  <tr key={ug._id}>
                    <td>{ug._id}</td>
                    <td>{ug.userId?.name || 'Unknown User'}</td>

                    <td>{ug.graphTitle}</td>
                    <td>{ug.apiRoute}</td>
                    <td>Pending</td>
                    <td>
                      <Button variant="info" className="btn-sm mx-1" onClick={() => handleView(ug)}>
                        View
                      </Button>
                      <Button variant="success" className="btn-sm mx-1" onClick={() => handleActivate(ug._id)}>
                        Activate
                      </Button>
                      <Button variant="danger" className="btn-sm mx-1" onClick={() => deleteHandler(ug._id)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}

          {/* Active/Rejected Graphs Table */}
          <h3 className="mt-5">Active / Rejected Graphs</h3>
          {activeOrRejectedGraphs.length === 0 ? (
            <p>No active or rejected user graphs.</p>
          ) : (
            <Table striped hover responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User</th>
                  <th>Graph Title</th>
                  <th>API Route</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {activeOrRejectedGraphs.map((ug) => {
                  let statusLabel = ug.state === 3 ? 'Active' : 'Rejected';
                  return (
                    <tr key={ug._id}>
                      <td>{ug._id}</td>
                      <td>{ug.userId?.name || 'Unknown User'}</td>
                      <td>{ug.graphTitle}</td>
                      <td>{ug.apiRoute}</td>
                      <td>{statusLabel}</td>
                      <td>
                        <Button variant="info" className="btn-sm mx-1" onClick={() => handleView(ug)}>
                          View
                        </Button>
                        {ug.state === 3 && (
                          <Button variant="warning" className="btn-sm mx-1" onClick={() => handleReject(ug._id)}>
                            Reject
                          </Button>
                        )}
                        <Button variant="danger" className="btn-sm mx-1" onClick={() => deleteHandler(ug._id)}>
                          delete
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}

          {/* View Panel: Display record details and graph side by side */}
          {viewRecord && (
            <Row className="mt-4">
              <Col md={6}>
                <h4>User Graph Details</h4>
                <Form>
                  <Form.Group className="my-2" controlId="viewUser">
                    <Form.Label>User</Form.Label>
                    <Form.Control
                      type="text"
                      value={viewRecord.userId?.name || 'Unknown User'}
                      readOnly
                    />
                  </Form.Group>
                  <Form.Group className="my-2" controlId="viewGraphTitle">
                    <Form.Label>Graph Title</Form.Label>
                    <Form.Control type="text" value={viewRecord.graphTitle} readOnly />
                  </Form.Group>
                  <Form.Group className="my-2" controlId="viewApiRoute">
                    <Form.Label>API Route</Form.Label>
                    <Form.Control type="text" value={viewRecord.apiRoute} readOnly />
                  </Form.Group>
                  <Form.Group className="my-2" controlId="viewDescription">
                    <Form.Label>Description</Form.Label>
                    <Form.Control as="textarea" rows={3} value={viewRecord.description} readOnly />
                  </Form.Group>
                  <Form.Group className="my-2" controlId="viewXTitle">
                    <Form.Label>X-Axis Title</Form.Label>
                    <Form.Control type="text" value={viewRecord.xTitle} readOnly />
                  </Form.Group>
                  <Form.Group className="my-2" controlId="viewYTitle">
                    <Form.Label>Y-Axis Title</Form.Label>
                    <Form.Control type="text" value={viewRecord.yTitle} readOnly />
                  </Form.Group>
                  <Form.Group className="my-2" controlId="viewStatus">
                    <Form.Label>Status</Form.Label>
                    <Form.Control
                      type="text"
                      value={
                        viewRecord.state === 1
                          ? 'Pending'
                          : viewRecord.state === 3
                          ? 'Active'
                          : viewRecord.state === 5
                          ? 'Rejected'
                          : 'Unknown'
                      }
                      readOnly
                    />
                  </Form.Group>
                  <Button variant="secondary" onClick={handleCloseView} className="mt-3">
                    Close
                  </Button>
                </Form>
              </Col>
              <Col md={6}>
                <h4>Graph Preview</h4>
                <GraphRenderer
                  graphType={viewRecord.graphId?.graphType}
                  apiRoute={viewRecord.apiRoute}
                  width={500}
                  height={300}
                />
              </Col>
            </Row>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default AdminUserGraphsScreen;
