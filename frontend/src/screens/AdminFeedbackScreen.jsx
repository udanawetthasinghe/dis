import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table, Button, Form, Image, Pagination } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import { useGetAllFeedbackQuery, useDeleteFeedbackMutation } from "../slices/feedbackApiSlice";
import { useGetUsersQuery } from "../slices/usersApiSlice";
import AdminSideMenu from "../components/AdminSideMenu";
import Message from "../components/Message";
import { toast } from "react-toastify";
import moment from "moment";


const AdminFeedbackScreen = () => {
    const { data: feedback = [], error, refetch } = useGetAllFeedbackQuery();
    const { data: users = [] } = useGetUsersQuery();
    const [deleteFeedback] = useDeleteFeedbackMutation();

    // Build a mapping from user id to user email
    const userEmailMap = {};
    if (users && Array.isArray(users)) {
        users.forEach((user) => {
            userEmailMap[user._id] = user.email;
        });
    }

    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 25;

    // Filter feedback based on search term
    const filtered = feedback.filter((item) => {
        const email = userEmailMap[item.user] || "unknown";
        return (
            item.district.toLowerCase().includes(search.toLowerCase()) ||
            item.description.toLowerCase().includes(search.toLowerCase()) ||
            email.toLowerCase().includes(search.toLowerCase())
        );
    });

    const currentRecords = filtered.slice(
        (currentPage - 1) * recordsPerPage,
        currentPage * recordsPerPage
    );

    const deleteHandler = async (id) => {
        if (window.confirm("Delete this feedback?")) {
            try {
                await deleteFeedback(id).unwrap();
                toast.success("Feedback deleted successfully");
                refetch();
            } catch (err) {
                toast.error(err?.data?.message || err.message);
            }
        }
    };

    const totalPages = Math.ceil(filtered.length / recordsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    return (
        <Container fluid className="mt-3">
            <Row>
                <Col md={2}>
                    <AdminSideMenu />
                </Col>
                <Col md={10}>
                    <h2>User Feedback Submissions</h2>

                    <Form.Control
                        type="text"
                        placeholder="Search by email, district, or description"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="my-3"
                    />

                    {error && <Message variant="danger">{error?.data?.message || error.error}</Message>}

                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>Email</th>
                                <th>District</th>
                                <th>Description</th>
                                <th>Image</th>
                                <th>Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentRecords.map((fb) => (
                                <tr key={fb._id}>
                                    <td>{userEmailMap[fb.user] || "Unknown"}</td>
                                    <td>{fb.district}</td>
                                    <td>{fb.description}</td>
                                    <td>
                                        <a
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                window.open(`http://localhost:5000/uploads/${fb.image}`, 'popupWindow', 'width=600,height=400,scrollbars=yes');
                                            }}
                                        >
                                            {fb.image && (
                                                <Image
                                                    src={`http://localhost:5000/uploads/${fb.image}`}
                                                    alt="breeding"
                                                    fluid
                                                    thumbnail
                                                    style={{ width: "60px", height: "60px", objectFit: "cover" }}
                                                />
                                            )}</a>




                                    </td>
                                    <td>{moment(fb.createdAt).format("YYYY-MM-DD")}</td>
                                    <td>
                                        <Button variant="danger" size="sm" onClick={() => deleteHandler(fb._id)}>
                                            <FaTrash />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    {totalPages > 1 && (
                        <Pagination>
                            {[...Array(totalPages)].map((_, i) => (
                                <Pagination.Item
                                    key={i + 1}
                                    active={i + 1 === currentPage}
                                    onClick={() => setCurrentPage(i + 1)}
                                >
                                    {i + 1}
                                </Pagination.Item>
                            ))}
                        </Pagination>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default AdminFeedbackScreen;
