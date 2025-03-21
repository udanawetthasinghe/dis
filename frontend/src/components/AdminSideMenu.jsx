// AdminSideMenu.js
import React from "react";
import { Nav, Navbar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const AdminSideMenu = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
      <Nav className="flex-column mt-3">
        <Nav.Item>
          <Nav.Link disabled>Users</Nav.Link>
          <Nav className="flex-column ms-3">
            <LinkContainer to="/admin/users">
              <Nav.Link>Existing Users</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/admin/user/register">
              <Nav.Link>Add User</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/admin/users/delete">
              <Nav.Link>Delete Users</Nav.Link>
            </LinkContainer>
          </Nav>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link disabled>Dengue Data</Nav.Link>
          <Nav className="flex-column ms-3">
            <LinkContainer to="/admin/weeklyDengueData">
              <Nav.Link>All Dengue Data</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/admin/weeklyDengueData/add">
              <Nav.Link>Add Dengue Data</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/admin/dengueData/update">
              <Nav.Link>Update Dengue Data</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/admin/dengueData/delete">
              <Nav.Link>Delete Dengue Data</Nav.Link>
            </LinkContainer>
          </Nav>
        </Nav.Item>
        {/* NEW: Customize Graphs */}
        <Nav.Item>
          <Nav.Link disabled>Customize Graphs</Nav.Link>
          <Nav className="flex-column ms-3">
            <LinkContainer to="/admin/graphs">
              <Nav.Link>Graphs Info</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/admin/usergraphs">
              <Nav.Link>Users Graphs</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/activated-user-graphs">
              <Nav.Link>Activated Graphs</Nav.Link>
            </LinkContainer>
          </Nav>
        </Nav.Item>
      </Nav>
    </Navbar>
  );
};

export default AdminSideMenu;
