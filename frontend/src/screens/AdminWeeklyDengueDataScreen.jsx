import { useState, useEffect } from "react";
import { Table, Button, Container, Row, Col, Form, Pagination } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import AdminSideMenu from "../components/AdminSideMenu";
import Message from "../components/Message";
import { toast } from "react-toastify";
import { getDistrictNameById } from "../config/config";
import {
  useGetWeeklyDngDataQuery,
  useDeleteWeeklyDngCasesMutation,
} from "../slices/weeklyDngDataApiSlice";

const AdminWeeklyDengueDataScreen = () => {
  // States for search filters
  const [yearFilter, setYearFilter] = useState("");
  const [weekFilter, setWeekFilter] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 50;

  // Fetch data from API (assumed to return an array)
  const { data: weeklyData, error, refetch } = useGetWeeklyDngDataQuery({});
  const [deleteWeeklyDngData] = useDeleteWeeklyDngCasesMutation();

  // Delete handler
  const deleteHandler = async (id) => {
    if (window.confirm("Do you really want to delete this record?")) {
      try {
        await deleteWeeklyDngData(id);
        toast.success("Weekly dengue record deleted successfully");
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  // Filter the data locally based on search inputs
  const filteredData = weeklyData?.filter((record) => {
    const matchesYear = yearFilter ? record.year.toString().includes(yearFilter) : true;
    const matchesWeek = weekFilter ? record.week.toString().includes(weekFilter) : true;
    const districtName = getDistrictNameById(record.districtId);
    const matchesDistrict = districtFilter ? districtName.toLowerCase().includes(districtFilter.toLowerCase()) : true;
    return matchesYear && matchesWeek && matchesDistrict;
  }) || [];

  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredData.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredData.length / recordsPerPage);

  // Build pagination items
  const paginationItems = [];
  for (let number = 1; number <= totalPages; number++) {
    paginationItems.push(
      <Pagination.Item
        key={number}
        active={number === currentPage}
        onClick={() => setCurrentPage(number)}
      >
        {number}
      </Pagination.Item>
    );
  }

  // Reset page if filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [yearFilter, weekFilter, districtFilter]);

  return (
    <Container fluid className="mt-3">
      <Row className="align-items-center">
        <Col md={2}></Col>
        <Col md={9}>
          <h1>Weekly Dengue Data</h1>
        </Col>
      </Row>
      <Row>
        <Col md={2}>
          <AdminSideMenu />
        </Col>
        <Col md={9}>
          {error && <Message variant="danger">{error?.data?.message || error.error}</Message>}
          <Table striped hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>
                  YEAR
                  <Form.Control
                    size="sm"
                    type="text"
                    placeholder="Search Year"
                    value={yearFilter}
                    onChange={(e) => setYearFilter(e.target.value)}
                  />
                </th>
                <th>
                  WEEK
                  <Form.Control
                    size="sm"
                    type="text"
                    placeholder="Search Week"
                    value={weekFilter}
                    onChange={(e) => setWeekFilter(e.target.value)}
                  />
                </th>
                <th>
                  DISTRICT
                  <Form.Control
                    size="sm"
                    type="text"
                    placeholder="Search District"
                    value={districtFilter}
                    onChange={(e) => setDistrictFilter(e.target.value)}
                  />
                </th>
                <th>DENGUE CASES</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.map((record) => (
                <tr key={record._id}>
                  <td>{record._id}</td>
                  <td>{record.year}</td>
                  <td>{record.week}</td>
                  <td>{getDistrictNameById(record.districtId)}</td>
                  <td>{record.dengueCases}</td>
                  <td>
                    <LinkContainer to={`/admin/weeklyDengueData/${record._id}/edit`}>
                      <Button variant="light" className="btn-sm mx-2">
                        <FaEdit /> Edit
                      </Button>
                    </LinkContainer>
                    <Button
                      variant="danger"
                      className="btn-sm"
                      onClick={() => deleteHandler(record._id)}
                    >
                      <FaTrash /> Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination className="justify-content-center">
              {paginationItems}
            </Pagination>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default AdminWeeklyDengueDataScreen;
