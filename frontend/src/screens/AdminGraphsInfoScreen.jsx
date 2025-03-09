import React from 'react';
import { Table, Button, Container, Row, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import AdminSideMenu from '../components/AdminSideMenu';
import { toast } from 'react-toastify';
import {
  useGetGraphsQuery,
  useDeleteGraphMutation,
} from '../slices/graphsApiSlice';

const AdminGraphsInfoScreen = () => {
  const { data: graphs, error, isLoading, refetch } = useGetGraphsQuery();
  const [deleteGraph] = useDeleteGraphMutation();

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this graph?')) {
      try {
        await deleteGraph(id).unwrap();
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
          <h1>Graphs Info</h1>
          <LinkContainer to="/admin/graphs/create">
            <Button variant="primary" className="my-3">
              Add New Graph
            </Button>
          </LinkContainer>

          {isLoading && <p>Loading...</p>}
          {error && <p>Error fetching graphs</p>}

          {graphs && (
            <Table striped hover responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Graph Index</th>
                  <th>Graph Name</th>
                  <th>Graph Type</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {graphs.map((graph) => (
                  <tr key={graph._id}>
                    <td>{graph._id}</td>
                    <td>{graph.graphIndex}</td>
                    <td>{graph.graphName}</td>
                    <td>{graph.graphType}</td>
                    <td>{graph.graphDescrip}</td>
                    <td>
                      {/* EDIT BUTTON */}
                      <LinkContainer to={`/admin/graphs/${graph._id}/edit`}>
                        <Button variant="light" className="btn-sm mx-1">
                          Edit
                        </Button>
                      </LinkContainer>

                      {/* DELETE BUTTON */}
                      <Button
                        variant="danger"
                        className="btn-sm mx-1"
                        onClick={() => deleteHandler(graph._id)}
                      >
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default AdminGraphsInfoScreen;
