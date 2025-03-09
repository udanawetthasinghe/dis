import { Table, Button, Container, Row, Col } from "react-bootstrap";

import { LinkContainer } from "react-router-bootstrap";
import { FaEdit, FaTrash,FaCheck } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import AdminSideMenu from "../components/AdminSideMenu";

import Message from "../components/Message";
import { toast } from "react-toastify";
import {
  districts,
  getDistrictIdByName,
  getDistrictNameById,
} from "../config/config";

import {
  useGetDngDataQuery,
  useGetDngCaseDetailsQuery,
  useDeleteDngCasesMutation,
} from "../slices/dngDataApiSlice";

const DengueDataScreen = () => {
  ////***  If directed to this page from dng case edit page: this page will display that updated case also */

  const { id: dngCaseId } = useParams();

  if (dngCaseId) {
    const { data: dngCase } = useGetDngCaseDetailsQuery(dngCaseId);
  }
  // Get Updated dengue case details

  /////*********************   End first part */
  // Get dengue data
  const { data: dngData, error, refetch } = useGetDngDataQuery({});

  // Create delete mutation
  const [deleteDengueCase] = useDeleteDngCasesMutation();

  // Delete handler
  const deleteHandler = async (id) => {
    if (window.confirm("Do you need to delete this data! Confirm?")) {
      try {
        await deleteDengueCase(id);
        toast.success("Dengue case deleted successfully");
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  // Render dengue data
  return (
    <>
   
      <Container fluid className="mt-3">
 
    
        <Row className="align-items-center">
          <Col md={2}></Col>
          <Col md={9}>
            <h1>Dengue Data</h1>
          </Col>
        </Row>

        <Row>
          <Col md={2}>
            <AdminSideMenu />
          </Col>
          <Col md={9}>
            <Table striped hover responsive className="table-sm">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>YEAR</th>
                  <th>MONTH</th>
                  <th>DISTRICT ID</th>
                  <th>DENGUE CASES</th>
                  <th>RAINFALL</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {dngData &&
                  dngData.map((dngData) => (
                    <tr key={dngData._id}>
                      <td>{dngData._id}</td>
                      <td>{dngData.year}</td>
                      <td>{dngData.month}</td>
                      <td>{getDistrictNameById(dngData.districtId)}</td>
                      <td>{dngData.dengueCases}</td>
                      <td>{dngData.rainfall}</td>
                      <td>
                        <LinkContainer
                          to={`/admin/dengueData/${dngData._id}/edit`}
                        >
                          <Button variant="light" className="btn-sm mx-2">
                            <FaEdit /> EDIT
                          </Button>
                        </LinkContainer>
                        <Button
                          variant="danger"
                          className="btn-sm"
                          onClick={() => deleteHandler(dngData._id)}
                        >
                          <FaTrash /> DELETE
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default DengueDataScreen;
